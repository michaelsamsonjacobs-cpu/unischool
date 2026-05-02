// Supabase Edge Function: LMS Webhook Ingestion
// Receives grade/progress events from partner university LMS systems.
// Normalizes the payload and updates the enrollment record.
// Deploy: supabase functions deploy lms-webhook

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
}

/**
 * Adapter interface: Normalize different LMS webhook payloads into
 * a standard internal format.
 */
const LMS_ADAPTERS: Record<string, (body: any) => any> = {
    // Canvas LMS (used by ASU, many others)
    canvas: (body: any) => {
        const event = body;
        return {
            external_enrollment_id: event.body?.enrollment_id?.toString() || event.body?.id?.toString(),
            status: mapCanvasStatus(event.body?.workflow_state),
            grade_letter: event.body?.grade || null,
            grade_numeric: event.body?.score ? parseFloat(event.body.score) : null,
            completion_percentage: event.body?.computed_current_score || null,
            source: 'webhook',
        };
    },

    // Blackboard
    blackboard: (body: any) => {
        return {
            external_enrollment_id: body.membership?.id || body.enrollmentId,
            status: mapBlackboardStatus(body.status),
            grade_letter: body.grade?.letter || null,
            grade_numeric: body.grade?.score ? parseFloat(body.grade.score) : null,
            completion_percentage: body.progress?.percentage || null,
            source: 'webhook',
        };
    },

    // Generic / Custom (for institutions with custom LMS)
    custom: (body: any) => {
        return {
            external_enrollment_id: body.enrollment_id || body.externalId || body.id,
            status: body.status || null,
            grade_letter: body.grade_letter || body.grade || null,
            grade_numeric: body.grade_numeric !== undefined ? parseFloat(body.grade_numeric) : null,
            completion_percentage: body.completion_percentage !== undefined ? parseFloat(body.completion_percentage) : null,
            source: 'webhook',
        };
    },
}

function mapCanvasStatus(canvasState: string | undefined): string | null {
    const map: Record<string, string> = {
        'active': 'in_progress',
        'completed': 'completed',
        'inactive': 'withdrawn',
        'invited': 'pending',
    };
    return canvasState ? (map[canvasState] || null) : null;
}

function mapBlackboardStatus(bbStatus: string | undefined): string | null {
    const map: Record<string, string> = {
        'InProgress': 'in_progress',
        'Completed': 'completed',
        'Withdrawn': 'withdrawn',
        'NotStarted': 'enrolled',
    };
    return bbStatus ? (map[bbStatus] || null) : null;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)
        // Route format: /lms-webhook?institution=ASU&lms=canvas
        const institutionCode = url.searchParams.get('institution')
        const lmsType = url.searchParams.get('lms') || 'custom'

        if (!institutionCode) {
            return new Response(
                JSON.stringify({ error: 'Missing institution parameter' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Verify the webhook secret against the institution's stored secret
        const webhookSecret = req.headers.get('x-webhook-secret')
        const { data: institution } = await supabase
            .from('institutions')
            .select('id, webhook_secret_encrypted')
            .eq('short_code', institutionCode)
            .single()

        if (!institution) {
            return new Response(
                JSON.stringify({ error: `Unknown institution: ${institutionCode}` }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Validate webhook secret if configured
        if (institution.webhook_secret_encrypted && webhookSecret !== institution.webhook_secret_encrypted) {
            return new Response(
                JSON.stringify({ error: 'Invalid webhook secret' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse and normalize the body using the appropriate adapter
        const body = await req.json()
        const adapter = LMS_ADAPTERS[lmsType] || LMS_ADAPTERS['custom']
        const normalized = adapter(body)

        if (!normalized.external_enrollment_id) {
            return new Response(
                JSON.stringify({ error: 'Could not extract enrollment ID from payload' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Find the enrollment by external ID
        const { data: enrollment, error: findError } = await supabase
            .from('enrollments')
            .select('id, student_id, status')
            .eq('external_enrollment_id', normalized.external_enrollment_id)
            .single()

        if (findError || !enrollment) {
            console.warn(`[LMS Webhook] No enrollment found for external ID: ${normalized.external_enrollment_id}`)
            // Return 200 to prevent retries — the enrollment just doesn't exist in our system
            return new Response(
                JSON.stringify({ received: true, matched: false }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Build update payload (only update fields that are present)
        const updates: Record<string, any> = {
            last_synced_at: new Date().toISOString(),
            sync_source: 'webhook',
        }

        if (normalized.status) updates.status = normalized.status
        if (normalized.grade_letter) updates.grade_letter = normalized.grade_letter
        if (normalized.grade_numeric !== null && normalized.grade_numeric !== undefined) {
            updates.grade_numeric = normalized.grade_numeric
        }
        if (normalized.completion_percentage !== null && normalized.completion_percentage !== undefined) {
            updates.completion_percentage = normalized.completion_percentage
        }

        // Set timestamps
        if (normalized.status === 'in_progress' && enrollment.status === 'enrolled') {
            updates.started_at = new Date().toISOString()
        }
        if (normalized.status === 'completed') {
            updates.completed_at = new Date().toISOString()
        }
        if (normalized.status === 'graded') {
            updates.grade_received_at = new Date().toISOString()
        }

        const { error: updateError } = await supabase
            .from('enrollments')
            .update(updates)
            .eq('id', enrollment.id)

        if (updateError) throw updateError

        // Write audit log
        await supabase.from('audit_log').insert({
            actor_id: null,
            action: 'enrollment.lms_webhook',
            resource_type: 'enrollment',
            resource_id: enrollment.id,
            old_data: { status: enrollment.status },
            new_data: updates,
        })

        return new Response(
            JSON.stringify({ received: true, matched: true, enrollment_id: enrollment.id }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('[LMS Webhook] Error:', error)
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
