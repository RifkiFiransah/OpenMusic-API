const AlbumLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: 'albumLikes',
  version: '3.0.0',
  register: async(server, {service}) => {
    const albumLikesHandler = new AlbumLikesHandler(service)
    server.route(routes(albumLikesHandler))
  }
}