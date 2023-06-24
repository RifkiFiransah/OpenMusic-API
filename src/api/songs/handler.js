const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
    constructor(service, validator){
        this._service = service
        this._validator = validator

        this.postSongHandler = this.postSongHandler.bind(this)
        this.getSongsHandler = this.getSongsHandler.bind(this)
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }

    async postSongHandler(request, h){
        try {
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
        } catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'maaf terjadi kesalahan pada server'
            })
            response.code(500)
            return response
        }
    }

    async getSongsHandler(request, h){
        try {
            const queryParams = request.query
            const songs = await this._service.getSongs(queryParams)
            return {
                status: 'success',
                message: 'mendapatkan seluruh lagu',
                data: {
                    songs: songs
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
                // Server Error
                const response = h.response({
                    status: 'error',
                    message: 'maaf terjadi kesalahan pada server'
                })
                response.code(500)
                return response
        }
    }

    async getSongByIdHandler(request, h){
        try{
            const {id} = request.params
            const song = await this._service.getSongById(id)
            return {
                status: 'success',
                message: 'mendapatkan lagu berdasarkan id',
                data: {
                    song
                }
            }
        }catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'maaf terjadi kesalahan pada server'
            })
            response.code(500)
            return response
        }
    }

    async putSongByIdHandler(request, h){
        try {
            this._validator.ValidateSongPayload(request.payload)
            const { id } = request.params
            const { title, year, genre, performer, duration, albumId } = request.payload
            await this._service.editSongById(id, {title, year, genre, performer, duration, albumId})
            return {
                status: 'success',
                message: 'mengubah lagu berdasarkan id lagu'
            }
        }catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'maaf terjadi kesalahan pada server'
            })
            response.code(500)
            return response
        }
    }

    async deleteSongByIdHandler(request, h){
        try{
            const {id} = request.params
            await this._service.deleteSongById(id)
            return {
                status: 'success',
                message: 'menghapus lagu berdasarkan id'
            }
        }catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'maaf terjadi kesalahan pada server'
            })
            response.code(500)
            return response
        }
    }
}

module.exports = SongsHandler