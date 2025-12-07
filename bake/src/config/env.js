require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  mqttHost: process.env.MQTT_HOST,
  mqttUser: process.env.MQTT_USER,
  mqttPass: process.env.MQTT_PASS,
  jwtSecret: process.env.JWT_SECRET,
};
