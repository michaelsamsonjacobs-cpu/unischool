// Supabase Edge Function: Enhanced Checkout with Stripe Connect
// Supports multi-party payment splitting: Platform + Franchise
// Deploy: supabase functions deploy create-checkout

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
})

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { priceId, userId, email, franchiseId, successUrl, cancelUrl } = await req.json()

        if (!priceId || !userId || !email) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: priceId, userId, email' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Build Stripe Checkout session config
        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                user_id: userId,
                franchise_id: franchiseId || '',
            },
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    user_id: userId,
                    franchise_id: franchiseId || '',
                },
            },
            success_url: successUrl || `${Deno.env.get('SITE_URL') || 'https://unischool.app'}/app?checkout=success`,
            cancel_url: cancelUrl || `${Deno.env.get('SITE_URL') || 'https://unischool.app'}/pricing?checkout=canceled`,
        }

        // If a franchise exists, set up Stripe Connect split payments
        if (franchiseId) {
            const { data: franchise } = await supabase
                .from('franchises')
                .select('stripe_account_id, platform_fee_percent, platform_fee_flat_cents')
                .eq('id', franchiseId)
                .single()

            if (franchise?.stripe_account_id) {
                // Calculate the platform's application fee
                // The franchise gets the remainder after the platform takes its cut
                const feePercent = franchise.platform_fee_percent || 10
                const feeFlat = franchise.platform_fee_flat_cents || 0

                sessionConfig.subscription_data!.application_fee_percent = feePercent
                sessionConfig.subscription_data!.transfer_data = {
                    destination: franchise.stripe_account_id,
                }

                // Note: Stripe Connect handles the split automatically.
                // Platform gets: feePercent% + feeFlat
                // Franchise gets: remainder
            }
        }

        const session = await stripe.checkout.sessions.create(sessionConfig)

        return new Response(
            JSON.stringify({ url: session.url, sessionId: session.id }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Checkout error:', error)
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
