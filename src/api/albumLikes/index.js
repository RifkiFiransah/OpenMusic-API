const AlbumLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: 'albumLikes',
  version: '3.0.0',
  register: async(server, {albumsService, service}) => {
    const albumLikesHandler = new AlbumLikesHandler(albumsService, service)
    server.route(routes(albumLikesHandler))
  }
}