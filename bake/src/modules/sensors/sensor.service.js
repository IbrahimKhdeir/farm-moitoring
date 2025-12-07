const prisma = require('../../database/prisma');

async function listSensorsByDevice(deviceId) {
  return prisma.sensor.findMany({
    where: { deviceId },
    orderBy: { id: 'asc' },
  });
}

async function listSensorReadings(sensorId, limit = 100) {
  return prisma.reading.findMany({
    where: { sensorId },
    orderBy: { recordedAt: 'desc' },
    take: limit,
  });
}

async function listAlertsByDevice(deviceId, limit = 100) {
  return prisma.alert.findMany({
    where: { deviceId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

module.exports = {
  listSensorsByDevice,
  listSensorReadings,
  listAlertsByDevice,
};


