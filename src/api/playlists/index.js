const PlaylistsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlists',
  version: '2.0.0',
  register: async (server, {service, playlistSongsService, psActivitiesService, validator}) => {
    const playlistHandler = new PlaylistsHandler(service, playlistSongsService, psActivitiesService, validator)
    server.route(routes(playlistHandler))
  }
}