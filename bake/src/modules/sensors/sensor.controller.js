const {
  listSensorsByDevice,
  listSensorReadings,
  listAlertsByDevice,
} = require('./sensor.service');
const { success, error } = require('../../core/utils/response');

async function getSensorsByDevice(req, res) {
  try {
    const deviceId = Number(req.params.deviceId);
    const sensors = await listSensorsByDevice(deviceId);
    return success(res, sensors);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getSensorReadings(req, res) {
  try {
    const sensorId = Number(req.params.sensorId);
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const readings = await listSensorReadings(sensorId, limit);
    return success(res, readings);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getDeviceAlerts(req, res) {
  try {
    const deviceId = Number(req.params.deviceId);
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const alerts = await listAlertsByDevice(deviceId, limit);
    return success(res, alerts);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getSensorsByDevice,
  getSensorReadings,
  getDeviceAlerts,
};


