// src/modules/alertSettings/alertSettings.route.js
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('./alertSettings.controller');
const { updateSettingsSchema } = require('./alertSettings.validation');
const authenticate = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');

router.get('/:deviceId', authenticate, getSettings);
router.put('/:deviceId', authenticate, validate(updateSettingsSchema), updateSettings);

module.exports = router;
