// src/modules/alertSettings/alertSettings.validation.js
const Joi = require('joi');

const updateSettingsSchema = Joi.object({
    minTemperature: Joi.number().allow(null).optional(),
    maxTemperature: Joi.number().allow(null).optional(),
    minHumidity: Joi.number().min(0).max(100).allow(null).optional(),
    maxHumidity: Joi.number().min(0).max(100).allow(null).optional(),
    minOxygen: Joi.number().min(0).max(100).allow(null).optional(),
    maxOxygen: Joi.number().min(0).max(100).allow(null).optional(),
    emailNotifications: Joi.boolean().optional(),
    notificationEmail: Joi.string().email().allow(null, '').optional(),
}).custom((value, helpers) => {
    // Validate that min is less than max for each sensor type
    if (value.minTemperature !== undefined && value.maxTemperature !== undefined) {
        if (value.minTemperature !== null && value.maxTemperature !== null && value.minTemperature >= value.maxTemperature) {
            return helpers.error('any.invalid', { message: 'minTemperature must be less than maxTemperature' });
        }
    }

    if (value.minHumidity !== undefined && value.maxHumidity !== undefined) {
        if (value.minHumidity !== null && value.maxHumidity !== null && value.minHumidity >= value.maxHumidity) {
            return helpers.error('any.invalid', { message: 'minHumidity must be less than maxHumidity' });
        }
    }

    if (value.minOxygen !== undefined && value.maxOxygen !== undefined) {
        if (value.minOxygen !== null && value.maxOxygen !== null && value.minOxygen >= value.maxOxygen) {
            return helpers.error('any.invalid', { message: 'minOxygen must be less than maxOxygen' });
        }
    }

    // If email notifications are enabled, email must be provided
    if (value.emailNotifications && !value.notificationEmail) {
        return helpers.error('any.invalid', { message: 'notificationEmail is required when emailNotifications is enabled' });
    }

    return value;
});

module.exports = {
    updateSettingsSchema,
};
