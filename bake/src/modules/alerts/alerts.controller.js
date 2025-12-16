// src/modules/alerts/alerts.controller.js
const prisma = require('../../database/prisma');
const { success, error } = require('../../core/utils/response');

async function listAlerts(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        
        // Get all alerts for devices owned by the user
        const alerts = await prisma.alert.findMany({
            where: {
                device: {
                    userId: userId,
                },
            },
            include: {
                device: {
                    select: {
                        id: true,
                        name: true,
                        deviceUuid: true,
                    },
                },
                sensor: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        success(res, alerts, 'Alerts retrieved');
    } catch (err) {
        console.error(err);
        error(res, err.message);
    }
}

async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        const userId = req.userId || req.user?.id;

        // Verify alert exists and belongs to user's device
        const alert = await prisma.alert.findFirst({
            where: {
                id,
                device: {
                    userId: userId,
                },
            },
        });

        if (!alert) {
            return error(res, 'Alert not found or access denied', 404);
        }

        // Update alert
        const updatedAlert = await prisma.alert.update({
            where: { id },
            data: { isRead: true },
        });

        success(res, updatedAlert, 'Alert marked as read');
    } catch (err) {
        console.error(err);
        error(res, err.message);
    }
}

async function getUnreadCount(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        
        const count = await prisma.alert.count({
            where: {
                isRead: false,
                device: {
                    userId: userId,
                },
            },
        });

        success(res, { count }, 'Unread count retrieved');
    } catch (err) {
        console.error(err);
        error(res, err.message);
    }
}

module.exports = {
    listAlerts,
    markAsRead,
    getUnreadCount,
};
