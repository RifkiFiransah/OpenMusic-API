const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (request, h) => handler.postAlbumHandler(request, h),
        options: {
            cors: {
                origin: ['*']
            }
        }
    },
    {
        method: 'GET',
        path: '/albums',
        handler: () => handler.getAlbumsHandler()
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: (request) => handler.getAlbumByIdHandler(request)
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: (request) => handler.putAlbumByIdHandler(request)
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (request) => handler.deleteAlbumByIdHandler(request)
    },
]

module.exports = routes