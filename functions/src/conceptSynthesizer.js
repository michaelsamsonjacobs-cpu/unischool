const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

/**
 * conceptSynthesizer - Cloud Function triggered when new course material (lecture/reading) is added.
 * Compares new content against existing "Hot Folder" context to identify "Concept Collisions".
 */
exports.conceptSynthesizer = onDocumentCreated("courses/{courseId}/materials/{materialId}", async (event) => {
    const db = getFirestore();
    const { courseId, materialId } = event.params;
    const newData = event.data.data();

    if (!newData.content) return;

    try {
        // 1. Fetch existing materials for this course
        const materialsSnapshot = await db.collection("courses")
            .doc(courseId)
            .collection("materials")
            .where("__name__", "!=", materialId)
            .get();

        const existingMaterials = materialsSnapshot.docs.map(doc => doc.data());

        // 2. Perform Dialectical Analysis (Simulated for Demo)
        // In a production environment, we would send the new content + existing context to Gemini Pro
        // with a prompt like: "Identify contradictory claims between these documents and explain the theoretical basis for each."

        console.log(`Analyzing material ${materialId} against ${existingMaterials.length} existing items in course ${courseId}`);

        // Mocking a detected collision
        const mockCollision = {
            concept: "Economic Growth Metrics",
            contradiction: "Lecture 3 claims GDP is the only metric for progress, while 'Limits to Growth' reading argues for planetary boundaries.",
            resolution: "Professor Davis focuses on neoclassical efficiency, whereas the reading represents the ecological economics framework.",
            studentExplanation: "Think of it like measuring a garden: one person counts the vegetables (GDP), while another checks if the soil is getting tired (Planetary Boundaries). Both are right in their own way!",
            sources: [materialId, "reading_001"],
            timestamp: FieldValue.serverTimestamp()
        };

        // 3. Store the synthesis results
        await db.collection("courses")
            .doc(courseId)
            .collection("synthesis")
            .add(mockCollision);

        console.log(`Dialectical resolution stored for course ${courseId}`);
    } catch (err) {
        console.error("Dialectical Synthesis failed:", err);
    }
});
