// upload-service/messaging/startPublisher.js

const { getChannel, CLEAR_SKY_EVENTS_EXCHANGE } = require('./connectRabbitMQ');
async function publishGradesUpload(
    uploadType,
    batchId,
    courseMeta,
    gradeEntries,
    extractedUsers = [],
    correlationId
) {
    const channel = getChannel();

    // Construct the base event payload
    const event = {
        batchId: batchId,
        courseMeta: courseMeta,
        gradeEntries: gradeEntries,
        correlationId: correlationId,
        timestamp: new Date().toISOString()
    };

    // Determine the routing key based on the uploadType
    let routingKey;
    if (uploadType === 'initial') {
        routingKey = 'grades.initial.uploaded';
        event.extractedUsersDetails = extractedUsers;
    } else if (uploadType === 'final') {
        routingKey = 'grades.final.uploaded';
    } else {
        console.error(`[❌ Upload Service] Invalid uploadType provided: "${uploadType}". Must be 'initial' or 'final'.`);
        throw new Error(`Invalid uploadType: "${uploadType}".`);
    }

    // Publish the message to the central topic exchange
    channel.publish(
        CLEAR_SKY_EVENTS_EXCHANGE,
        routingKey,
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
    );

    console.log(`[📤 Upload Service] Published event "${routingKey}" for batch ${batchId}`);
}

module.exports = {
    publishGradesUpload,
};