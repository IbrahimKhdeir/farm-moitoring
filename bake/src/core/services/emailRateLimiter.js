// src/core/services/emailRateLimiter.js

// Store last email sent time per device+sensor combination
const lastEmailSent = new Map();

// Rate limit: 15 minutes in milliseconds
const RATE_LIMIT_MS = 15 * 60 * 1000;

/**
 * Check if we can send an email for this device+sensor combination
 * @param {number} deviceId 
 * @param {string} sensorType 
 * @returns {boolean} true if email can be sent, false if rate limited
 */
function canSendEmail(deviceId, sensorType) {
    const key = `${deviceId}-${sensorType}`;
    const lastSent = lastEmailSent.get(key);

    if (!lastSent) {
        return true; // Never sent before
    }

    const timeSinceLastEmail = Date.now() - lastSent;
    return timeSinceLastEmail >= RATE_LIMIT_MS;
}

/**
 * Record that an email was sent for this device+sensor combination
 * @param {number} deviceId 
 * @param {string} sensorType 
 */
function recordEmailSent(deviceId, sensorType) {
    const key = `${deviceId}-${sensorType}`;
    lastEmailSent.set(key, Date.now());
}

/**
 * Get time remaining until next email can be sent (in minutes)
 * @param {number} deviceId 
 * @param {string} sensorType 
 * @returns {number} minutes remaining, or 0 if can send now
 */
function getTimeUntilNextEmail(deviceId, sensorType) {
    const key = `${deviceId}-${sensorType}`;
    const lastSent = lastEmailSent.get(key);

    if (!lastSent) {
        return 0;
    }

    const timeSinceLastEmail = Date.now() - lastSent;
    const timeRemaining = RATE_LIMIT_MS - timeSinceLastEmail;

    if (timeRemaining <= 0) {
        return 0;
    }

    return Math.ceil(timeRemaining / (60 * 1000)); // Convert to minutes
}

module.exports = {
    canSendEmail,
    recordEmailSent,
    getTimeUntilNextEmail,
};
