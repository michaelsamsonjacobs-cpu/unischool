// Supabase Edge Function: Enhanced Stripe Webhook Handler
// Handles subscription lifecycle + franchise revenue allocation
// Deploy: supabase functions deploy stripe-webhook

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

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature ?? '',
            Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', (err as Error).message)
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
    }

    console.log('Received Stripe event:', event.type)

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            const userId = session.metadata?.user_id
            const franchiseId = session.metadata?.franchise_id || null
            const customerId = session.customer as string
            const subscriptionId = session.subscription as string

            if (userId && subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId)
                const priceId = subscription.items.data[0]?.price.id

                // Determine plan dynamically from price metadata or env vars
                let plan = 'student'
                const proPriceId = Deno.env.get('STRIPE_PRO_PRICE_ID')
                const teamPriceId = Deno.env.get('STRIPE_TEAM_PRICE_ID')
                const enterprisePriceId = Deno.env.get('STRIPE_ENTERPRISE_PRICE_ID')

                if (priceId === teamPriceId) plan = 'team'
                else if (priceId === enterprisePriceId) plan = 'enterprise'
                else if (priceId === proPriceId) plan = 'pro'

                // Upsert subscription record
                await supabase.from('subscriptions').upsert({
                    user_id: userId,
                    franchise_id: franchiseId || null,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    stripe_price_id: priceId,
                    plan: plan,
                    status: subscription.status,
                    current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
                    current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id' })

                // Audit log
                await supabase.from('audit_log').insert({
                    actor_id: userId,
                    action: 'subscription.created',
                    resource_type: 'subscription',
                    franchise_id: franchiseId || null,
                    new_data: { plan, subscription_id: subscriptionId, price_id: priceId },
                })
            }
            break
        }

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription
            const subscriptionId = subscription.id

            const { data: existing } = await supabase
                .from('subscriptions')
                .select('user_id, franchise_id, status')
                .eq('stripe_subscription_id', subscriptionId)
                .single()

            if (existing) {
                const oldStatus = existing.status
                const newStatus = subscription.status

                await supabase.from('subscriptions').update({
                    status: newStatus,
                    current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
                    current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                }).eq('stripe_subscription_id', subscriptionId)

                // Audit
                await supabase.from('audit_log').insert({
                    actor_id: existing.user_id,
                    action: event.type === 'customer.subscription.deleted'
                        ? 'subscription.canceled'
                        : 'subscription.updated',
                    resource_type: 'subscription',
                    franchise_id: existing.franchise_id,
                    old_data: { status: oldStatus },
                    new_data: { status: newStatus },
                })
            }
            break
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice
            const subscriptionId = invoice.subscription as string

            if (subscriptionId) {
                await supabase.from('subscriptions').update({
                    status: 'past_due',
                    updated_at: new Date().toISOString(),
                }).eq('stripe_subscription_id', subscriptionId)

                // Audit
                const { data: sub } = await supabase
                    .from('subscriptions')
                    .select('user_id, franchise_id')
                    .eq('stripe_subscription_id', subscriptionId)
                    .single()

                if (sub) {
                    await supabase.from('audit_log').insert({
                        actor_id: sub.user_id,
                        action: 'subscription.payment_failed',
                        resource_type: 'subscription',
                        franchise_id: sub.franchise_id,
                        new_data: { invoice_id: invoice.id },
                    })
                }
            }
            break
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
})
