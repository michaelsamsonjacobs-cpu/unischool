const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Triggered when a new document is added to 'courses/{courseId}/syllabus_processing'.
 * Simulates the ingestion of a syllabus and the generation of a Hot Folder.
 */
exports.processSyllabus = functions.firestore
    .document('courses/{courseId}/syllabus_processing/{docId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const courseId = context.params.courseId;
        const db = admin.firestore();

        console.log(`Starting syllabus processing for course ${courseId}`);

        try {
            // Update status
            await snap.ref.update({ status: 'analyzing_syllabus' });

            // SIMULATION: In a real environment, you'd download the file from data.file_url
            // and use a document parser / LLM to extract reading lists and concepts.
            // We simulate that extraction here.

            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work

            const mockExtractedConcepts = [
                { title: 'Core Principle 1: Supply and Demand', text: 'Demand refers to how much of a product or service is desired by buyers. Supply represents how much the market can offer...' },
                { title: 'Required Reading: Chapter 4', text: 'In Chapter 4, the author discusses the macroeconomic implications of inflation on developing economies...' },
                { title: 'Glossary: Elasticity', text: 'Elasticity is a measure of a variable\'s sensitivity to a change in another variable.' }
            ];

            // Populate the Hot Folder
            const hotFolderRef = db.collection('courses').doc(courseId).collection('hot_folder');

            const batch = db.batch();
            for (const item of mockExtractedConcepts) {
                const newDocRef = hotFolderRef.doc();
                batch.set(newDocRef, {
                    title: item.title,
                    extracted_text: item.text,
                    source_doc: snap.id,
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                });
            }

            await batch.commit();

            // Mark syllabus processing as complete
            await snap.ref.update({ status: 'completed' });
            console.log(`Successfully generated Hot Folder for course ${courseId}`);

        } catch (error) {
            console.error('Error processing syllabus:', error);
            await snap.ref.update({ status: 'error', error_details: error.message });
        }
    });
