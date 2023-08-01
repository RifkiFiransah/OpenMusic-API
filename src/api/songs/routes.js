const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: (request, h) => handler.postSongHandler(request, h),
        options: {
            cors: {
                origin: ['*']
            }
        }
    },
    {
        method: 'GET',
        path: '/songs',
        handler: (request) => handler.getSongsHandler(request)
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: (request) => handler.getSongByIdHandler(request)
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: (request) => handler.putSongByIdHandler(request)
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: (request) => handler.deleteSongByIdHandler(request)
    }
]

module.exports = routes