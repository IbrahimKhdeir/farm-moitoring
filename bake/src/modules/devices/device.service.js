const prisma = require('../../database/prisma');

async function addDeviceService({ deviceUuid, name, userId }) {
  return prisma.device.create({ data: { deviceUuid, name, userId } });
}

async function getDevicesService(userId) {
  const where = userId ? { userId } : {};
  return prisma.device.findMany({
    where,
    include: { sensors: true }
  });
}

module.exports = { addDeviceService, getDevicesService };
