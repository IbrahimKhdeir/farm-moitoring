const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate.middleware');
const authMiddleware = require('../../middleware/auth.middleware');
const { addDevice, getDevices } = require('./device.controller');
const { createDeviceSchema } = require('./device.validation');

// Protect device routes: require authentication to list/create devices.
router.post('/', authMiddleware, validate(createDeviceSchema), addDevice);
router.get('/', authMiddleware, getDevices);

module.exports = router;
