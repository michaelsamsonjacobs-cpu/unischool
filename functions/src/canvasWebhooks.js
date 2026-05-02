const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Handle Webhooks from Canvas LMS for grade updates, assignment submissions, etc.
 * Triggered via HTTP request.
 */
exports.handleWebhook = functions.https.onRequest(async (req, res) => {
    // For production, implement HMAC verification of the Canvas payload here.

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const payload = req.body;
    console.log("Received Canvas Event:", payload.event_type || 'Unknown');

    const db = admin.firestore();

    try {
        // Simplified handling based on possible event types from Canvas Live Events or webhooks
        switch (payload.event_type) {
            case 'submission_created':
            case 'submission_updated':
                const submission = payload.data || payload; // Depending on canvas structure
                const studentId = submission.user_id; // Note: You'd need a mapping from Canvas ID to Firebase UID
                const courseId = submission.course_id;

                // In a real scenario, map canvas user to firebase user:
                // const userRef = await db.collection('user_mappings').where('canvas_id', '==', studentId).get();
                // const firebaseUid = userRef.docs[0].id;

                // For demo, assume studentId is the Firebase UID or we just log it
                console.log(`Assignment submitted by canvas_user=${studentId} in course=${courseId} with grade=${submission.grade}`);

                // Example update to enrollment progress subcollection:
                /*
                await db.collection('users').doc(firebaseUid)
                  .collection('enrollments').doc(courseId.toString())
                  .set({
                      last_activity: admin.firestore.FieldValue.serverTimestamp(),
                      recent_grade: submission.grade
                  }, { merge: true });
                */
                break;

            case 'course_completed':
                // Handle course completion logic
                console.log("Course completed event", payload);
                break;

            default:
                console.log(`Unhandled Canvas event type: ${payload.event_type}`);
        }

        res.status(200).send('Event processed');
    } catch (error) {
        console.error("Error processing Canvas webhook:", error);
        res.status(500).send("Internal Server Error processing Canvas Payload.");
    }
});
