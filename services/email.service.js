const axios = require('axios');
const User = require('../models/user.model');

/**
 * Send email notification via notification service
 * @param {string} subject - Email subject
 * @param {string} userId - User ID (recipient)
 * @param {string} content - Email body content
 * @returns {Promise<void>}
 */
const sendMail = async (subject, userId, content) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            console.warn(`[sendMail] No user found with ID: ${userId}`);
            return;
        }

        const payload = {
            subject,
            recepientEmails: [user.email],
            content,
        };

        const url = `${process.env.NOTI_SERVICE}/notiservice/api/v1/notifications`;

        await axios.post(url, payload);

        console.info(`[sendMail] Notification sent to ${user.email}`);
    } catch (error) {
        console.error('[sendMail] Failed to send notification:', error.message);
        // Optionally: rethrow if you want upstream code to handle the failure
        // throw error;
    }
};

module.exports = sendMail;
