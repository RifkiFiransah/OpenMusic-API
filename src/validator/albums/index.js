const InvariantError = require('../../exceptions/InvariantError')
const {albumPayloadSchema} = require('./schema')

const AlbumsValidator = {
    ValidateAlbumPayload: (payload) => {
        const validatorResult = albumPayloadSchema.validate(payload)
        if(validatorResult.error){
            throw new InvariantError(validatorResult.error.message)
        }
    }
}
module.exports = AlbumsValidator 