class UploadAlbumsHandler {
  constructor(service, storageService, validator){
    this._service = service
    this._storageService = storageService
    this._validator = validator
  }

  async postUploadAlbumsHandler(request, h){
    const {cover} = request.payload
    const {id} = request.params
    this._validator.validateAlbumHeaders(cover.hapi.headers)

    const filename = await this._storageService.writeFile(cover, cover.hapi)
    const album = await this._service.getAlbumById(id)
    if(album.coverUrl){
      await this._storageService.deleteFile()
    }
    await this._service.editCoverAlbumById(id, filename)
    const response = h.response({
      status: 'success',
      message: "Sampul berhasil diunggah"
    }).code(201)
    return response
  }
}

module.exports = UploadAlbumsHandler