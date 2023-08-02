const autoBind = require('auto-bind')
class UploadAlbumsHandler {
  constructor(service, storageService, validator){
    this._service = service
    this._storageService = storageService
    this._validator = validator

    autoBind(this)
  }

  async postUploadAlbumsHandler(request, h){
    const {cover} = request.payload
    const {id} = request.params
    this._validator.validateAlbumHeaders(cover.hapi.headers)

    const filename = await this._storageService.writeFile(cover, cover.hapi)
    const album = await this._service.getAlbumById(id)
    if(album.coverUrl){
      await this._storageService.deleteFile(filename)
    }
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
    await this._service.editCoverAlbumById(id, coverUrl)
    const response = h.response({
      status: 'success',
      message: "Sampul berhasil diunggah",
      data: {
        fileLocation: coverUrl
      }
    }).code(201)
    return response
  }
}

module.exports = UploadAlbumsHandler