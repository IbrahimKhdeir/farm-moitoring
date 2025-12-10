const prisma = require('../../database/prisma');

async function addDeviceService({ deviceUuid, name, userId }) {
  return prisma.device.create({ data: { deviceUuid, name, userId } });
}

async function getDevicesService(userId) {
  // Only return devices that belong to this user
  // Don't show devices with null userId (global/unassigned devices)
  if (!userId) {
    return [];
  }
  
  return prisma.device.findMany({
    where: { userId },
    include: { sensors: true }
  });
}

module.exports = { addDeviceService, getDevicesService };
