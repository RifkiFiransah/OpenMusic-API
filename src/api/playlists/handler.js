const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor(service, playlistSongsService, psActivitiesService, validator){
    this._service = service
    this._psService = playlistSongsService
    this._psaService = psActivitiesService
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
    this.postPlaylistSongsByIdHandler = this.postPlaylistSongsByIdHandler.bind(this)
    this.getPlaylistSongsByIdHandler = this.getPlaylistSongsByIdHandler.bind(this)
    this.deletePlaylistSongsByIdHandler = this.deletePlaylistSongsByIdHandler.bind(this)
    this.getPlaylistActivitiesByIdHandler = this.getPlaylistActivitiesByIdHandler.bind(this)
  }

  async postPlaylistHandler(request, h){
    try {
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

  async getPlaylistHandler(request, h){
    try {
      // const {id: owner} = request.auth.credentials
      const playlists = await this._service.getPlaylists(request.auth.credentials)
      return {
        status: 'success',
        data: {
          playlists
        }
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

  async deletePlaylistByIdHandler(request, h){
    try {
      const {id} = request.params
      const {id: credentialId} = request.auth.credentials
      await this._service.verifyPlaylistOwner(id, credentialId)
      await this._service.deletePlaylistById(id)
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus'
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

  async postPlaylistSongsByIdHandler(request, h){
    try {
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

  async getPlaylistSongsByIdHandler(request,  h){
    try {
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

  async deletePlaylistSongsByIdHandler(request, h){
    try {
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

  async getPlaylistActivitiesByIdHandler(request, h){
    try{
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

module.exports = PlaylistsHandler