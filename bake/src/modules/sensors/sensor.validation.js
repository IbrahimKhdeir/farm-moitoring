const Joi = require('joi');

const sensorTypeEnum = Joi.string().valid(
  'temperature',
  'humidity',
  'oxygen',
  'co2',
  'ph'
);

const listByDeviceParamsSchema = Joi.object({
  deviceId: Joi.number().integer().positive().required(),
});

const listReadingsParamsSchema = Joi.object({
  sensorId: Joi.number().integer().positive().required(),
});

module.exports = {
  sensorTypeEnum,
  listByDeviceParamsSchema,
  listReadingsParamsSchema,
};


