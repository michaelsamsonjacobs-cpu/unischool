const admin = require('firebase-admin');

// Initialize the Admin SDK once for all functions
admin.initializeApp();

const { onUserCreated } = require("./src/authTriggers");
const { stripeWebhook, canvasWebhook } = require("./src/webhooks");
const { syllabusParser } = require("./src/syllabusParser");
const { lectureProcessor } = require("./src/lectureProcessor");
const { conceptSynthesizer } = require("./src/conceptSynthesizer");

exports.onUserCreated = onUserCreated;
exports.stripeWebhook = stripeWebhook;
exports.canvasWebhook = canvasWebhook;
exports.syllabusParser = syllabusParser;
exports.lectureProcessor = lectureProcessor;
exports.conceptSynthesizer = conceptSynthesizer;
