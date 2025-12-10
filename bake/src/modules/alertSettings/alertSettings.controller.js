// src/modules/alertSettings/alertSettings.controller.js
const prisma = require('../../database/prisma');
const { success, error } = require('../../core/utils/response');

async function getSettings(req, res) {
    try {
        const { deviceId } = req.params;
        const deviceIdInt = parseInt(deviceId);
        const userId = req.userId || req.user?.id;

        console.log('getSettings - deviceId:', deviceIdInt, 'userId:', userId);

        // Verify device exists and either belongs to user or is a global device (no owner)
        const device = await prisma.device.findFirst({
            where: {
                id: deviceIdInt,
                OR: [
                    { userId: userId },
                    { userId: null },
                ],
            },
        });

        console.log('Found device:', device);

        if (!device) {
            return error(res, 'Device not found or access denied', 404);
        }

        // Get or create settings
        let settings = await prisma.alertSettings.findUnique({
            where: { deviceId: deviceIdInt },
        });

        if (!settings) {
            // Create default settings
            settings = await prisma.alertSettings.create({
                data: {
                    deviceId: deviceIdInt,
                    minTemperature: 0,
                    maxTemperature: 50,
                    minHumidity: 20,
                    maxHumidity: 80,
                    minOxygen: 18,
                    maxOxygen: 25,
                    emailNotifications: false,
                    notificationEmail: null,
                },
            });
        }

        success(res, settings, 'Alert settings retrieved');
    } catch (err) {
        console.error('getSettings error:', err);
        error(res, err.message);
    }
}

async function updateSettings(req, res) {
    try {
        const { deviceId } = req.params;
        const deviceIdInt = parseInt(deviceId);
        const userId = req.userId || req.user?.id;

        console.log('updateSettings - deviceId:', deviceIdInt, 'userId:', userId);

        // Verify device exists and either belongs to user or is a global device (no owner)
        const device = await prisma.device.findFirst({
            where: {
                id: deviceIdInt,
                OR: [
                    { userId: userId },
                    { userId: null },
                ],
            },
        });

        if (!device) {
            return error(res, 'Device not found or access denied', 404);
        }

        const updateData = {};

        // Only include fields that are provided
        if (req.body.minTemperature !== undefined) updateData.minTemperature = req.body.minTemperature;
        if (req.body.maxTemperature !== undefined) updateData.maxTemperature = req.body.maxTemperature;
        if (req.body.minHumidity !== undefined) updateData.minHumidity = req.body.minHumidity;
        if (req.body.maxHumidity !== undefined) updateData.maxHumidity = req.body.maxHumidity;
        if (req.body.minOxygen !== undefined) updateData.minOxygen = req.body.minOxygen;
        if (req.body.maxOxygen !== undefined) updateData.maxOxygen = req.body.maxOxygen;
        if (req.body.emailNotifications !== undefined) updateData.emailNotifications = req.body.emailNotifications;
        if (req.body.notificationEmail !== undefined) updateData.notificationEmail = req.body.notificationEmail;

        // Upsert settings
        const settings = await prisma.alertSettings.upsert({
            where: { deviceId: deviceIdInt },
            update: updateData,
            create: {
                deviceId: deviceIdInt,
                ...updateData,
            },
        });

        success(res, settings, 'Alert settings updated');
    } catch (err) {
        console.error('updateSettings error:', err);
        error(res, err.message);
    }
}

module.exports = {
    getSettings,
    updateSettings,
};
