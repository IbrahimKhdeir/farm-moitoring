const prisma = require('../../database/prisma');
const { success, error } = require('../../core/utils/response');

async function getStats(req, res) {
    try {
        const devicesCount = await prisma.device.count();
        const sensorsCount = await prisma.sensor.count();

        success(res, {
            devicesCount,
            sensorsCount
        }, 'Dashboard stats retrieved');
    } catch (err) {
        error(res, err.message);
    }
}

async function getNotifications(req, res) {
    try {
        // Mock notifications for now, or fetch from a Notification table if it existed
        const notifications = [];
        success(res, notifications, 'Notifications retrieved');
    } catch (err) {
        error(res, err.message);
    }
}

module.exports = {
    getStats,
    getNotifications
};
