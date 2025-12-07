// src/server.js
require('dotenv').config();
const app = require('./app');
const { mqttInit } = require('./core/mqtt/mqtt');

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for now, restrict in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mqttInit(io); // Pass io instance to MQTT
});
