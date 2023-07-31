const path = require('path')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.postUploadAlbumsHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 512000,
        output: 'stream'
      }
    }
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file')
      }
    }
  }
]

module.exports = routes