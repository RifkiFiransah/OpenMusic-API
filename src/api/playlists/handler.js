const autoBind = require("auto-bind")

class PlaylistsHandler {
  constructor(service, playlistSongsService, psActivitiesService, validator){
    this._service = service
    this._psService = playlistSongsService
    this._psaService = psActivitiesService
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistHandler(request, h){
    this._validator.validatePlaylistsPayload(request.payload)
    const {name} = request.payload
    const {id: credentialId} = request.auth.credentials
    const playlistId = await this._service.addPlaylist(name, credentialId)
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistHandler(request){
    const playlists = await this._service.getPlaylists(request.auth.credentials)
    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistByIdHandler(request){
    const {id} = request.params
    const {id: credentialId} = request.auth.credentials
    await this._service.verifyPlaylistOwner(id, credentialId)
    await this._service.deletePlaylistById(id)
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  async postPlaylistSongsByIdHandler(request, h){
    this._validator.validatePlaylistSongsPayload(request.payload)
    const {id: playlistId} = request.params
    const {songId} = request.payload
    const {id: credentialId} = request.auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, credentialId)
    await this._psService.addPlaylistSong(playlistId, songId, credentialId)
    const response = h.response({
      status: 'success',
      message: 'Playlist songs berhasil ditambahkan'
    })
    response.code(201)
    return response
  }

  async getPlaylistSongsByIdHandler(request){
    const {id} = request.params
    const {id: credentialId} = request.auth.credentials
    await this._service.verifyPlaylistAccess(id, credentialId)
    const playlist = await this._service.getPlaylistById(id)
    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  async deletePlaylistSongsByIdHandler(request){
    this._validator.validatePlaylistSongsPayload(request.payload)

    const {id} = request.params
    const {id: credentialId} = request.auth.credentials
    const {songId} = request.payload
    await this._service.verifyPlaylistAccess(id, credentialId)
    await this._psService.deletePlaylistSong(songId, id, credentialId)
    return {
      status: 'success',
      message: 'Playlist songs berhasil dihapus'
  }
  }

  async getPlaylistActivitiesByIdHandler(request){
    const {id: playlistId} = request.params
    const {id: credentialId} = request.auth.credentials
    await this._service.verifyPlaylistAccess(playlistId, credentialId)
    const activities = await this._psaService.getActivityByPlaylistId(request.params)
    return {
      status: 'success',
      data: {
        playlistId,
        activities
      }
    }
  }
}

module.exports = PlaylistsHandler