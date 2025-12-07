const { mqttHost, mqttUser, mqttPass } = require('./env');

module.exports = {
  host: mqttHost,
  options: {
    clientId: 'backend_server',
    username: mqttUser,
    password: mqttPass,
    clean: true,
    reconnectPeriod: 2000,
  }
};
