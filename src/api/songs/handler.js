// const ClientError = require("../../exceptions/ClientError");
const autoBind = require('auto-bind')

class SongsHandler {
    constructor(service, validator){
        this._service = service
        this._validator = validator

        autoBind(this)
        // this.postSongHandler = this.postSongHandler.bind(this)
        // this.getSongsHandler = this.getSongsHandler.bind(this)
        // this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
        // this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
        // this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }

    async postSongHandler(request, h){
        this._validator.ValidateSongPayload(request.payload)    
        const { title, year, genre, performer, duration, albumId } = request.payload
        const songId = await this._service.addSong({title, year, genre, performer, duration, albumId})
        const response = h.response({
            status: 'success',
            message: 'menambahkan lagu',
            data: {
                songId
            }
        })
        response.code(201)
        return response
    }

    async getSongsHandler(request, h){
        const queryParams = request.query
        const songs = await this._service.getSongs(queryParams)
        return {
            status: 'success',
            message: 'mendapatkan seluruh lagu',
            data: {
                songs: songs
            }
        }
    }

    async getSongByIdHandler(request, h){
        const {id} = request.params
        const song = await this._service.getSongById(id)
        return {
            status: 'success',
            message: 'mendapatkan lagu berdasarkan id',
            data: {
                song
            }
        }
    }

    async putSongByIdHandler(request, h){
        this._validator.ValidateSongPayload(request.payload)
        const { id } = request.params
        const { title, year, genre, performer, duration, albumId } = request.payload
        await this._service.editSongById(id, {title, year, genre, performer, duration, albumId})
        return {
            status: 'success',
            message: 'mengubah lagu berdasarkan id lagu'
        }
    }

    async deleteSongByIdHandler(request, h){
        const {id} = request.params
        await this._service.deleteSongById(id)
        return {
            status: 'success',
            message: 'menghapus lagu berdasarkan id'
        }
    }
}

module.exports = SongsHandler