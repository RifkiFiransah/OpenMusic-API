// const ClientError = require("../../exceptions/ClientError");
const autoBind = require('auto-bind')

class SongsHandler {
    constructor(service, validator){
        this._service = service
        this._validator = validator

        autoBind(this)
    }

    async postSongHandler(request, h){
        this._validator.ValidateSongPayload(request.payload)    
        const songId = await this._service.addSong(request.payload)
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

    async getSongsHandler(request){
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

    async getSongByIdHandler(request){
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

    async putSongByIdHandler(request){
        this._validator.ValidateSongPayload(request.payload)
        const { id } = request.params
        // const { title, year, genre, performer, duration, albumI } = request.payload
        await this._service.editSongById(id, request.payload)
        return {
            status: 'success',
            message: 'mengubah lagu berdasarkan id lagu'
        }
    }

    async deleteSongByIdHandler(request){
        const {id} = request.params
        await this._service.deleteSongById(id)
        return {
            status: 'success',
            message: 'menghapus lagu berdasarkan id'
        }
    }
}

module.exports = SongsHandler