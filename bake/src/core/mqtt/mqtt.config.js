// src/core/mqtt/mqtt.config.js
module.exports = {
  host: process.env.MQTT_HOST || 'mqtt://192.168.1.14:1883',
  options: {
    clientId: 'backend_server',
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    clean: true,
    reconnectPeriod: 2000
  }
};
