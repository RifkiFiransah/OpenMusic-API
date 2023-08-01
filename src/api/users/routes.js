const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (request, h) => handler.getUserByIdHandler(request, h) 
  },
  {
    method: 'GET',
    path: '/users',
    handler: (request) => handler.getUserByUsernameHandler(request) 
  }
]

module.exports = routes