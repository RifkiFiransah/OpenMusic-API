const autoBind = require("auto-bind")

class ExportsHandler {
  constructor(service, playlistsService, validator){
    this._service = service
    this._playlistsService = playlistsService
    this._validator = validator

    autoBind(this)
  }

  async postExportPlaylistHandler(request, h){
    this._validator.validateExportSongsPayload(request.payload)
    const userId =  request.auth.credentials.id
    const {id: playlistId} = request.params
    const {targetEmail} = request.payload

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId)
    const playlist = await this._playlistsService.getPlaylistSongs(playlistId)

    const message = {
      targetEmail,
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