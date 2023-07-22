const ClientError = require("../../exceptions/ClientError");

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator){
    this._collaborationsService = collaborationsService
    this._playlistsservice = playlistsService
    this._usersservice = usersService 
    this._validator = validator

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async postCollaborationHandler(request, h){
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const {id: credentialId} = request.auth.credentials
      const {playlistId, userId} = request.payload

      await this._playlistsservice.verifyPlaylistOwner(playlistId, credentialId)
      await this._usersservice.verifyUserById(userId)      
      const collaborationId = await this._collaborationsService.addCollaborator(playlistId, userId)

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      // SERVER ERROR
      const response = h.response({
        status: 'fail',
        message: 'maaf terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error);
      return response
    }
  }

  async deleteCollaborationHandler(request, h){
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const {id: credentialId} = request.auth.credentials
      const {playlistId, userId} = request.payload
      
      await this._playlistsservice.verifyPlaylistOwner(playlistId, credentialId)
      await this._usersservice.verifyUserById(userId)      
      await this._collaborationsService.deleteCollaborator(playlistId, userId)
      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus'
      }
    } catch (error) {
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      // SERVER ERROR
      const response = h.response({
        status: 'fail',
        message: 'maaf terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error);
      return response
    }
  }
}

module.exports = CollaborationsHandler