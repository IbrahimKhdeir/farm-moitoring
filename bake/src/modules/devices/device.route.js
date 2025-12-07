const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate.middleware');
const { addDevice, getDevices } = require('./device.controller');
const { createDeviceSchema } = require('./device.validation');

router.post('/', validate(createDeviceSchema), addDevice);
router.get('/', getDevices);

module.exports = router;
