// user-service/messaging/handleEvent.js

const { addUsersFromExcel } = require('../services/addUsersFromExcel');
const { publishEvent } = require('./eventPublisher'); // This module will be needed to publish events
const MAX_PROVISIONING_RETRIES = 3; // Max attempts (1 initial + 2 retries)
const RETRY_DELAY_MS = 2000;      // 2 seconds delay between retries
/**
 * Handles incoming events for the user-service.
 * @param {Object} event - The parsed event object from RabbitMQ.
 * For 'grades.initial.uploaded', it contains:
 * `batchId`, `correlationId`, `courseMeta`, `extractedUsersDetails`, `timestamp`.
 * @param {string} routingKey - The routing key (topic) of the received event.
 */
const handleEvent = async (event, routingKey) => {
    console.log(`--- User Service processing event: ${routingKey} ---`);
    console.log(`Batch ID: ${event.batchId}, Course: ${event.courseMeta?.title || event.courseMeta?.name} (${event.courseMeta?.id})`);

    switch (routingKey) {
        case 'grades.initial.uploaded':
        {
            const { batchId, correlationId, courseMeta, extractedUsersDetails } = event;

            console.log(`User Service: Received initial grades upload for Batch ID: ${batchId}. Starting user provisioning.`);
            console.log(`Extracted users count: ${extractedUsersDetails ? extractedUsersDetails.length : 0}`);

            let attempts = 0;
            let provisioningSuccessful = false;
            let lastError = null;

            while (attempts < MAX_PROVISIONING_RETRIES && !provisioningSuccessful) {
                attempts++;
                console.log(`User Service: Attempt ${attempts}/${MAX_PROVISIONING_RETRIES} to provision users for batch ${batchId}.`);
                try {
                    await addUsersFromExcel(extractedUsersDetails);
                    provisioningSuccessful = true; // Operation succeeded
                    console.log(`✅ User Service: Successfully provisioned users for batch ${batchId} on attempt ${attempts}.`);

                } catch (error) {
                    lastError = error; // Store the error from the last attempt
                    console.error(`❌ User Service: Attempt ${attempts} failed to provision users for batch ${batchId}:`, error.message);
                    if (attempts < MAX_PROVISIONING_RETRIES) {
                        console.log(`User Service: Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    }
                }
            }

            if (!provisioningSuccessful) {
                console.error(`❌ User Service: All ${MAX_PROVISIONING_RETRIES} attempts failed to provision users for batch ${batchId}. Publishing failure event.`);
                let finalFailureReason = "PersistentUserProvisioningFailure";
                await publishEvent(
                    'user.provisioning.batch.failed', // Routing key for failure
                    {
                        batchId: batchId,
                        correlationId: correlationId,
                        message: `User provisioning failed for batch ${batchId} after ${MAX_PROVISIONING_RETRIES} attempts. Grades for this batch should be revoked.`,
                        reason: finalFailureReason,
                        }
                );
                console.log(`📢 User Service: Published 'user.provisioning.batch.failed' for batch ${batchId}.`);
            }
            break;
        }

        default:
            console.warn(`⚠️ User Service: Unknown or unhandled routing key: ${routingKey}`);
            break;
    }
};

module.exports = { handleEvent };