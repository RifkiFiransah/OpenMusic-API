const InvariantError = require("../../exceptions/InvariantError");
const { userPayloadSchema } = require("./schema");

const UsersValidator = {
    ValidateUserPayload: (payload) => {
        const validatorResult = userPayloadSchema.validate(payload)
        if(validatorResult.error){
            throw new InvariantError(validatorResult.error.message)
        }
    }
}
module.exports = UsersValidator