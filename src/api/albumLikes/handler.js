const autoBind = require('auto-bind')

class AlbumLikesHandler {
  constructor(albumsService, service){
    this._albumsService = albumsService
    this._service = service

    autoBind(this)
  }

  async postLikeByIdHandler(request, h){
      const {id} = request.params
      const {id: userId} = request.auth.credentials
      await this._albumsService.getAlbumById(id)
      await this._service.verifyUserLiked(id, userId)
      // const like = await this._service.verifyUserLiked(id, userId)
      // if(like){
      //   await this._service.deleteLike(id, userId)
      //   const response = h.response({
      //     status: 'success',
      //     message: 'Anda menyukai album ini'
      //   }).code(201)
      //   return response
      // }
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
      const {likes, cached} = await this._service.getAlbumLikes(id)
      const response = h.response({
        status: 'success',
        data: {
          likes
        }
      })
      if(cached){
        response.header('X-Data-Source', 'cache')
      }
      return response
  }
}

module.exports = AlbumLikesHandler