const autoBind = require('auto-bind')

class AlbumLikesHandler {
  constructor(service){
    this._service = service

    autoBind(this)
  }

  async postLikeByIdHandler(request, h){
    const {id} = request.params
    const {id: userId} = request.auth.credentials
    
    await this._service.addLikeToAlbum(id, userId)
    const response = h.response({
      status: 'success',
      message: 'Anda menyukai album ini'
    }).code(201)
    return response
  }

  async deleteLikeByIdHandler(request){
    const {id} = request.params
    const {id: userId} = request.auth.credentials

    await this._service.deleteLike(id, userId)
    return {
      status: 'success',
      message: 'Berhasil membatalkan like'
    }
  }

  async getLikeByIdHandler(request, h){
    const {id} = request.params
    const likes = await this._service.getAlbumLikes(id)
    const response = h.response({
      status: 'success',
      data: {
        likes
      }
    })
    return response
  }
}

module.exports = AlbumLikesHandler