const Joi = require("joi");

const songPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    duration: Joi.number()
})

module.exports = {songPayloadSchema}