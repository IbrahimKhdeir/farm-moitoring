const { addDeviceService, getDevicesService } = require('./device.service');
const { success, error } = require('../../core/utils/response');

async function addDevice(req, res) {
  try {
    const device = await addDeviceService({
      ...req.body,
      userId: req.userId || req.user?.id
    });
    success(res, device, 'Device added');
  } catch (err) {
    error(res, err.message);
  }
}

async function getDevices(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const devices = await getDevicesService(userId);
    success(res, devices);
  } catch (err) {
    error(res, err.message);
  }
}

module.exports = { addDevice, getDevices };
