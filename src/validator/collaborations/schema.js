const Joi = require("joi");

const collaborationPayloadSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required()
})

module.exports = {collaborationPayloadSchema}