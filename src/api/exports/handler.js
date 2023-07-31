const autoBind = require("auto-bind")

class ExportsHandler {
  constructor(service, playlistsService, validator){
    this._service = service
    this._playlistsService = playlistsService
    this._validator = validator

    autoBind(this)
  }

  async postExportHandler(request, h){
    this._validator.validateExportSongsPayload(request.payload)
    const userId =  request.auth.credentials.id
    const {id: playlistId} = request.params

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId)
    const playlist = await this._playlistsService.getPlaylistById(playlistId)

    const message = {
      targetEmail: request.payload.targetEmail,
      playlist
    }

    await this._service.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda dalam antrean'
    }).code(201)

    return response
  }
}

module.exports = ExportsHandler