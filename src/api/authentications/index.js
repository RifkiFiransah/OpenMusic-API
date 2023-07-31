const AuthenticationsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: "authentications",
  version: '2.0.0',
  register: async (server, {
    authenticationsService,
    usersService,
    tokenManager,
    validator
  }) => {
    const authenticationHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    )
    server.route(routes(authenticationHandler))
  }
}