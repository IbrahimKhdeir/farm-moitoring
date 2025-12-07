const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.route');
const deviceRoutes = require('../modules/devices/device.route');
const sensorRoutes = require('../modules/sensors/sensor.route');
const dashboardRoutes = require('../modules/dashboard/dashboard.route');
const alertSettingsRoutes = require('../modules/alertSettings/alertSettings.route');
const alertsRoutes = require('../modules/alerts/alerts.route');

router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/sensors', sensorRoutes);
router.use('/alert-settings', alertSettingsRoutes);
router.use('/alerts', alertsRoutes);
router.use('/', dashboardRoutes);

module.exports = router;
