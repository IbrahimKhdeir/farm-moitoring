// src/core/mqtt/mqtt.config.js
module.exports = {
  host: process.env.MQTT_HOST || 'mqtts://9ffbb9ad524241c98a8bc879ac0598ec.s1.eu.hivemq.cloud:8883',
  options: {
    clientId: `backend_server_${Math.random().toString(16).substring(2, 8)}`,
    username: process.env.MQTT_USER || 'farm-user',
    password: process.env.MQTT_PASS || 'Farm@123',
    clean: true,
    reconnectPeriod: 2000,
    connectTimeout: 30000,
    rejectUnauthorized: true
  }
};
