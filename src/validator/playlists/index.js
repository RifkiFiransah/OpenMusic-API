const InvariantError = require("../../exceptions/InvariantError");
const { postPlaylistsPayloadSchema, postPlaylistSongsPayloadSchema } = require("./schema");

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validatorResult = postPlaylistsPayloadSchema.validate(payload)
    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  },
  validatePlaylistSongsPayload: (payload) => {
    const validatorResult = postPlaylistSongsPayloadSchema.validate(payload)
    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  }
}
module.exports = PlaylistsValidator