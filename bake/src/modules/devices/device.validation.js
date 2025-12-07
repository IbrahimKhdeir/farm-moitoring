const Joi = require('joi');

const createDeviceSchema = Joi.object({
  deviceUuid: Joi.string().uuid().required().messages({
    'string.guid': 'deviceUuid must be a valid UUID',
  }),
  name: Joi.string().min(2).max(100).required(),
  userId: Joi.number().integer().positive().optional(),
});

module.exports = {
  createDeviceSchema,
};


