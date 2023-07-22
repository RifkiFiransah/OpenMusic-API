const InvariantError = require("../../exceptions/InvariantError");
const { collaborationPayloadSchema } = require("./schema");

const CollaborationValidator = {
    validateCollaborationPayload: (payload) => {
        const validatorResult = collaborationPayloadSchema.validate(payload)
        if(validatorResult.error){
            throw new InvariantError(validatorResult.error.message)
        }
    }
}
module.exports = CollaborationValidator