const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate.middleware');
const authenticate = require('../../middleware/auth.middleware');
const { addDevice, getDevices } = require('./device.controller');
const { createDeviceSchema } = require('./device.validation');

// All device operations require authentication so devices are tied to a user
router.post('/', authenticate, validate(createDeviceSchema), addDevice);
router.get('/', authenticate, getDevices);

module.exports = router;
