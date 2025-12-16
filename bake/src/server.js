// src/server.js
require('dotenv').config();
const app = require('./app');
const { mqttInit } = require('./core/mqtt/mqtt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config/env');

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for now, restrict in production
    methods: ["GET", "POST"]
  }
});

// Socket.io authentication and room management
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user authentication - join user-specific room
  socket.on('authenticate', (token) => {
    try {
      if (token) {
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.id;
        
        // Join user-specific room
        socket.join(`user:${userId}`);
        socket.userId = userId;
        console.log(`Socket ${socket.id} joined room user:${userId}`);
      }
    } catch (err) {
      console.error('Socket authentication error:', err.message);
    }
  });

  // Handle joining device-specific rooms
  socket.on('subscribe-device', (deviceUuid) => {
    if (socket.userId) {
      socket.join(`device:${deviceUuid}`);
      console.log(`Socket ${socket.id} subscribed to device:${deviceUuid}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mqttInit(io); // Pass io instance to MQTT
});
