const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistActivitiesService {
  constructor(){
    this._pool = new Pool()
  }

  async addPlaylistActivity({playlistId, songId, userId, action}){
    const id =  `playlistSongActivity-${nanoid(16)}`
    const time = new Date().toISOString();
    const query = {
      text: "INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time]
    }

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getActivityByPlaylistId({id}){
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activities psa LEFT JOIN users u ON psa.user_id = u.id LEFT JOIN songs s ON psa.song_id = s.id WHERE psa.playlist_id = $1 ORDER BY psa.time ASC`,
      values: [id],
    };
    const result = await this._pool.query(query)
    if(!result.rows.length){
      throw new NotFoundError('Activity tidak ditemukan')
    }
    return result.rows
  }
}

module.exports = PlaylistActivitiesService