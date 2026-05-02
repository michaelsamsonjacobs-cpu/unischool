const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock'); // Mock key for local dev

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';

/**
 * Handle Stripe Webhooks for franchise billing and enrollment events.
 * Triggered via HTTP request.
 */
exports.handleWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // In local emulator without raw body support, or if signature verification is bypassed for testing:
        if (process.env.FUNCTIONS_EMULATOR === 'true') {
            console.warn("Running in emulator. Skipping strict Stripe signature validation.");
            event = req.body;
        } else {
            // Verify signature in production
            event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        }
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const db = admin.firestore();

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log(`Handling checkout session completed for ${session.id}`);

                // Example: Link checkout session to Franchise Billing document
                if (session.client_reference_id) {
                    const franchiseRef = db.collection('franchises').doc(session.client_reference_id);
                    await franchiseRef.set({
                        subscription_status: 'active',
                        checkout_session_id: session.id,
                        last_payment: admin.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                    console.log(`Updated billing status for franchise ${session.client_reference_id}`);
                }
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                console.log(`Payment succeeded for invoice ${invoice.id}`);
                // Record payment in firestore...
                break;

            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                console.log(`Subscription deleted ${subscription.id}`);
                // Handle cancellation...
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        res.json({ received: true });
    } catch (error) {
        console.error("Error processing Stripe webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});
