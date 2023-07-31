const Joi = require("joi");

const AlbumHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp').required()
}).unknown()

module.exports = {AlbumHeadersSchema}