const Joi = require("joi")

const PostAuthenticationsPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
})

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
})

module.exports = {PostAuthenticationsPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema}