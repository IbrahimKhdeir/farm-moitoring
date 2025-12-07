// src/core/mqtt/mqtt.js
const mqtt = require('mqtt');
const { handleMQTTMessage } = require('./mqttListener');
const { host, options } = require('./mqtt.config');

let client;

function mqttInit(io) {
  client = mqtt.connect(host, options);

  client.on('connect', () => {
    console.log('Connected to MQTT server');
    client.subscribe('devices/+/sensors/#'); // كل الـ topics الخاصة بالحساسات
  });

  client.on('message', async (topic, message) => {
    try {
      await handleMQTTMessage(topic, message.toString(), io);
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = { mqttInit, client };
