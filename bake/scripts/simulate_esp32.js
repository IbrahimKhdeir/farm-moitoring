const mqtt = require('mqtt');
require('dotenv').config({ path: '../.env' }); // Adjust path if running from scripts dir

// Use the same config as the backend or hardcode for testing
const host = process.env.MQTT_HOST || 'mqtt://192.168.1.14:1883';
const options = {
    clientId: 'simulated_esp32',
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
};

const client = mqtt.connect(host, options);

const deviceUuid = 'ESP32_AMER_01';

client.on('connect', () => {
    console.log('Simulator connected to MQTT broker');

    setInterval(() => {
        // Simulate Temperature
        const temp = (20 + Math.random() * 10).toFixed(2);
        client.publish(`devices/${deviceUuid}/sensors/temperature`, temp);
        console.log(`Published Temperature: ${temp}`);

        // Simulate Humidity
        const hum = (40 + Math.random() * 20).toFixed(2);
        client.publish(`devices/${deviceUuid}/sensors/humidity`, hum);
        console.log(`Published Humidity: ${hum}`);

        // Simulate Gas
        const gas = (Math.random() * 100).toFixed(2);
        client.publish(`devices/${deviceUuid}/sensors/gas`, gas);
        console.log(`Published Gas: ${gas}`);

    }, 5000); // Send data every 5 seconds
});

client.on('error', (err) => {
    console.error('MQTT Error:', err);
});
