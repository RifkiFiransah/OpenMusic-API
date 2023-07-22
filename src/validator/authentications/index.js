const InvariantError = require("../../exceptions/InvariantError");
const { PostAuthenticationsPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema } = require("./schema");

const AuthenticationsValidator = {
  ValidatePostAuthenticationPayload: (payload) => {
    const validatorResult = PostAuthenticationsPayloadSchema.validate(payload)
    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  },
  ValidatePutAuthenticationPayload: (payload) => {
    const validatorResult = PutAuthenticationPayloadSchema.validate(payload)
    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  },
  ValidateDeleteAuthenticationPayload: (payload) => {
    const validatorResult = DeleteAuthenticationPayloadSchema.validate(payload)
    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  }
}

module.exports = AuthenticationsValidator