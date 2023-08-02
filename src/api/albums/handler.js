// const ClientError = require('../../exceptions/ClientError')
const autoBind = require('auto-bind')

class AlbumsHandler {
    constructor(service, validator){
        this._service = service
        this._validator = validator

        autoBind(this)
    }
    async postAlbumHandler(request, h){
        this._validator.ValidateAlbumPayload(request.payload)

        const albumId = await this._service.addAlbum(request.payload)
        const response  = h.response({
            status: 'success',
            message: 'Menambahkan album',
            data: {
                albumId
            }
        })
        response.code(201)
        return response
    }

    async getAlbumsHandler(){
        const albums = await this._service.getAlbums()
        return {
            status: 'success',
            data: {
                albums
            }
        }
    }

    async getAlbumByIdHandler(request){   
        const { id } = request.params
        const album = await this._service.getAlbumById(id)
        const songs = await this._service.getSongByAlbumId(id)
        const getDetailAlbum = {...album, songs}
        return {
            status: 'success',
            message: 'mendapatkan album berdasarkan id',
            data: {
                album: getDetailAlbum
            }
        }
    }

    async putAlbumByIdHandler(request){
        this._validator.ValidateAlbumPayload(request.payload)
        const { id } = request.params
        const {name, year} = request.payload
        await this._service.editAlbumById(id, {name, year})
        return {
            status: 'success',
            message: 'mengubah album berdasarkan id'
        }
    }

    async deleteAlbumByIdHandler(request){
        const { id } = request.params
        await this._service.deleteAlbumById(id)
        return {
            status: 'success',
            message: 'menghapus album berdasarkan id'
        }
    }
}
module.exports = AlbumsHandler