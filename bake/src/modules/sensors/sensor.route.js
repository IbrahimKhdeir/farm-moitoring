const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate.middleware');
const {
  listByDeviceParamsSchema,
  listReadingsParamsSchema,
} = require('./sensor.validation');
const {
  getSensorsByDevice,
  getSensorReadings,
  getDeviceAlerts,
} = require('./sensor.controller');

// GET /api/sensors/device/:deviceId
router.get(
  '/device/:deviceId',
  validate({ params: listByDeviceParamsSchema }),
  getSensorsByDevice
);

// GET /api/sensors/:sensorId/readings
router.get(
  '/:sensorId/readings',
  validate({ params: listReadingsParamsSchema }),
  getSensorReadings
);

// GET /api/sensors/device/:deviceId/alerts
router.get(
  '/device/:deviceId/alerts',
  validate({ params: listByDeviceParamsSchema }),
  getDeviceAlerts
);

module.exports = router;


