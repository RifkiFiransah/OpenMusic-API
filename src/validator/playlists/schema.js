const Joi = require("joi")

const postPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required()
})

const postPlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().required()
})

module.exports = {postPlaylistsPayloadSchema, postPlaylistSongsPayloadSchema}