const { ExportSongsPayloadSchema } = require("./schema");
const InvariantError = require('../../exceptions/InvariantError')

const ExportValidator = {
  validateExportSongsPayload: (payload) => {
    const validatorResult = ExportSongsPayloadSchema.validate(payload)
    
    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  } 
}

module.exports = ExportValidator