const Joi = require("joi");
const currentYear = new Date().getFullYear()

const songPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(currentYear).required(),
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string()
})

module.exports = {songPayloadSchema}