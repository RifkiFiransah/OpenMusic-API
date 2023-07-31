require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const inert = require('@hapi/inert')
const path = require('path')

// Albums
const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums/')

// Songs
const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')

// Users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// Authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const AuthenticationsValidator = require('./validator/authentications')
const TokenManager = require('./tokenize/TokenManager')

// Playlists
const playlists = require('./api/playlists')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService')
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService')
const PlaylistsValidator = require('./validator/playlists')

// Collaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// Exports
const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

// Uploads
const uploads = require('./api/uploads')
const StorageService = require('./services/storage/StorageService')
const UploadsValidator = require('./validator/uploads')

// Error
const ClientError = require('./exceptions/ClientError')

const init = async() => {
    const collaborationsService = new CollaborationsService()
    const playlistActivitiesService = new PlaylistActivitiesService()
    const albumsService = new AlbumsService()
    const songsService = new SongsService()
    const usersService = new UsersService()
    const authenticationsService = new AuthenticationsService()
    const playlistsService = new PlaylistsService(collaborationsService)
    const playlistSongsService = new PlaylistSongsService(playlistActivitiesService)
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/cover'))

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    // Registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt
        },
        {
            plugin: inert
        }
    ])

    // Mendefinisikan strategy authentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
        isValid: true,
        credentials: {
            id: artifacts.decoded.payload.id
        }
        })
    })

    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator
            }
        },
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                playlistSongsService: playlistSongsService,
                psActivitiesService: playlistActivitiesService,
                validator: PlaylistsValidator
            }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                usersService,
                validator: CollaborationsValidator
            }
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,
                playlistsService,
                validator: ExportsValidator
            }
        },
        {
            plugin: uploads,
            options: {
                service: albumsService,
                storageService,
                validator: UploadsValidator
            }
        }
    ])

    server.ext('onPreResponse', (request,  h) => {
        // mendapatkan konteks response dari request
        const { response } =request
        if(response instanceof Error){
            // penanganan client error secara internal
            if(response instanceof ClientError){
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                })
                newResponse.code(response.statusCode)
                return newResponse
            }
            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if(!response.isServer){
                return h.continue
            }
            // penanganan error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagaln pada server'
            })
            newResponse.code(500)
            return newResponse
        }
        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue
    })

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();