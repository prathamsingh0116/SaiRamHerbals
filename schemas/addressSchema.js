const Joi = require("joi");

module.exports.addressSchema = Joi.object({

    address: Joi.object({

        fullName: Joi.string()
            .trim()
            .min(3)
            .max(60)
            .required(),

        phone: Joi.string()
            .trim()
            .pattern(/^[6-9]\d{9}$/)
            .required(),

        alternatePhone: Joi.string()
            .trim()
            .allow("")
            .pattern(/^[6-9]\d{9}$/),

        addressLine1: Joi.string()
            .trim()
            .min(5)
            .max(120)
            .required(),

        addressLine2: Joi.string()
            .trim()
            .allow("")
            .max(120),

        landmark: Joi.string()
            .trim()
            .allow("")
            .max(80),

        city: Joi.string()
            .trim()
            .required(),

        state: Joi.string()
            .trim()
            .required(),

        country: Joi.string()
            .trim()
            .required(),

        pincode: Joi.string()
            .trim()
            .pattern(/^[1-9][0-9]{5}$/)
            .required(),

        addressType: Joi.string()
            .valid("Home","Office","Other")
            .required(),

        label: Joi.string()
            .trim()
            .allow("")
            .max(30),

        latitude: Joi.number()
            .allow(null),

        longitude: Joi.number()
            .allow(null),

        isDefault: Joi.boolean()

    }).required()

});