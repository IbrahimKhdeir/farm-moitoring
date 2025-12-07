// src/core/mqtt/mqttListener.js
const prisma = require('../../database/prisma');
const { sendAlertEmail } = require('../services/email.service');
const { canSendEmail, recordEmailSent, getTimeUntilNextEmail } = require('../services/emailRateLimiter');

async function handleMQTTMessage(topic, payload, io) {
  // topic: devices/{device_uuid}/sensors/{sensor_type}
  const [_, deviceUuid, __, sensorType] = topic.split('/');
  const value = parseFloat(payload);

  // البحث عن الجهاز والحساس
  const device = await prisma.device.findUnique({
    where: { deviceUuid },
    include: {
      alertSettings: true,
    },
  });
  if (!device) return;

  let sensor = await prisma.sensor.findFirst({
    where: { deviceId: device.id, type: sensorType }
  });

  if (!sensor) {
    sensor = await prisma.sensor.create({
      data: { deviceId: device.id, type: sensorType }
    });
  }

  // إضافة القراءة
  const reading = await prisma.reading.create({
    data: {
      sensorId: sensor.id,
      value
    }
  });

  // Emit real-time update
  if (io) {
    io.emit('sensor-reading', {
      deviceUuid,
      sensorType,
      value,
      timestamp: reading.createdAt
    });
  }

  // Check alert settings and create alerts if thresholds are violated
  if (device.alertSettings) {
    const settings = device.alertSettings;
    let shouldAlert = false;
    let level = 'warning';
    let threshold = '';

    if (sensorType === 'temperature') {
      if (settings.minTemperature !== null && value < settings.minTemperature) {
        shouldAlert = true;
        level = 'warning';
        threshold = `below minimum (${settings.minTemperature}°C)`;
      } else if (settings.maxTemperature !== null && value > settings.maxTemperature) {
        shouldAlert = true;
        level = 'danger';
        threshold = `above maximum (${settings.maxTemperature}°C)`;
      }
    } else if (sensorType === 'humidity') {
      if (settings.minHumidity !== null && value < settings.minHumidity) {
        shouldAlert = true;
        level = 'warning';
        threshold = `below minimum (${settings.minHumidity}%)`;
      } else if (settings.maxHumidity !== null && value > settings.maxHumidity) {
        shouldAlert = true;
        level = 'danger';
        threshold = `above maximum (${settings.maxHumidity}%)`;
      }
    } else if (sensorType === 'oxygen') {
      if (settings.minOxygen !== null && value < settings.minOxygen) {
        shouldAlert = true;
        level = 'danger';
        threshold = `below minimum (${settings.minOxygen}%)`;
      } else if (settings.maxOxygen !== null && value > settings.maxOxygen) {
        shouldAlert = true;
        level = 'warning';
        threshold = `above maximum (${settings.maxOxygen}%)`;
      }
    }

    if (shouldAlert) {
      const message = `${sensorType} value ${value} ${threshold}`;

      // Create alert in database (always create, regardless of email rate limit)
      const alert = await prisma.alert.create({
        data: {
          deviceId: device.id,
          sensorId: sensor.id,
          level,
          message,
          isRead: false,
          emailSent: false,
        },
      });

      // Emit real-time alert
      if (io) {
        io.emit('new-alert', {
          ...alert,
          device: {
            id: device.id,
            name: device.name,
            deviceUuid: device.deviceUuid,
          },
          sensor: {
            id: sensor.id,
            type: sensor.type,
          },
        });
      }

      // Send email notification if enabled and not rate limited
      if (settings.emailNotifications && settings.notificationEmail) {
        // Check if we can send email (rate limit: 15 minutes)
        if (canSendEmail(device.id, sensorType)) {
          const emailSent = await sendAlertEmail({
            to: settings.notificationEmail,
            deviceName: device.name || device.deviceUuid,
            sensorType,
            value,
            threshold,
            level,
            timestamp: alert.createdAt,
          });

          // Update alert with email status
          if (emailSent) {
            await prisma.alert.update({
              where: { id: alert.id },
              data: { emailSent: true },
            });

            // Record that email was sent
            recordEmailSent(device.id, sensorType);
            console.log(`Email sent for ${device.name} - ${sensorType}`);
          }
        } else {
          const minutesRemaining = getTimeUntilNextEmail(device.id, sensorType);
          console.log(`Email rate limited for ${device.name} - ${sensorType}. Next email in ${minutesRemaining} minutes.`);
        }
      }
    }
  }
}

module.exports = { handleMQTTMessage };
