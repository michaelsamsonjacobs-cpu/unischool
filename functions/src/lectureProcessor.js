const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Triggered when a student requests a video lecture summarization.
 * Simulates video analysis and summarization tailored for younger students.
 */
exports.summarizeLecture = functions.firestore
    .document('users/{userId}/lectures/{lectureId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const userId = context.params.userId;
        const courseId = data.course_id;
        const db = admin.firestore();

        console.log(`Summarizing lecture for user ${userId} in course ${courseId}`);

        try {
            await snap.ref.update({ status: 'analyzing_video' });

            // SIMULATION: In a real environment, we would use an LLM API (like Gemini 1.5 Pro)
            // to process the video or its transcript.

            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time

            const mockSummary = {
                title: 'Introduction to Microeconomics - Lecture 1',
                key_takeaways: [
                    'Economics is the study of scarcity.',
                    'Opportunity cost is what you give up to get something else.',
                    'Microeconomics focuses on individual and firm decisions.'
                ],
                glossary: {
                    'Scarcity': 'The fundamental economic problem of having unlimited human wants in a world of limited resources.',
                    'Opportunity Cost': 'The value of the next best alternative given up.'
                },
                timestamped_notes: [
                    { time: '05:20', note: 'Professor clearly defines Opportunity Cost.' },
                    { time: '14:45', note: 'Discussion on how scarcity affects daily choices.' }
                ]
            };

            await snap.ref.update({
                status: 'completed',
                summary: mockSummary,
                completed_at: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`Successfully generated summary for lecture ${context.params.lectureId}`);

        } catch (error) {
            console.error('Error summarizing video:', error);
            await snap.ref.update({ status: 'error', error_details: error.message });
        }
    });
