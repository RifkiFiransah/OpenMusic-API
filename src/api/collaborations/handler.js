const autoBind = require('auto-bind')

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator){
    this._collaborationsService = collaborationsService
    this._playlistsservice = playlistsService
    this._usersservice = usersService 
    this._validator = validator

    autoBind(this)
  }

  async postCollaborationHandler(request, h){
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
  }

  async deleteCollaborationHandler(request){
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
  }
}

module.exports = CollaborationsHandler