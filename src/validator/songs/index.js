const InvariantError = require("../../exceptions/InvariantError");
const { songPayloadSchema } = require("./schema");

const SongsValidator = {
    ValidateSongPayload: (payload) => {
        const validatorResult = songPayloadSchema.validate(payload)
        if(validatorResult.error){
            throw new InvariantError(validatorResult.error.message)
        }
    }
}
module.exports = SongsValidator