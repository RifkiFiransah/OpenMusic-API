const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistSongsService{
  constructor(psActivitiesService){
    this._pool = new Pool()
    this._psActivitiesService = psActivitiesService
  }

  async addPlaylistSong(playlistId, songId, userId){
    const id = `playlistSongs-${nanoid(16)}`

    const cekSongId = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId]
    }

    const resultSongId = await this._pool.query(cekSongId)
    if(!resultSongId.rows.length){
      throw new NotFoundError('Song tidak ditemukan')
    }

    const query = {
      text: `INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId]
    }
    const result = await this._pool.query(query)
    if(!result.rowCount){
      throw new InvariantError('Gagal menambahkan playlist musik')
    }
    await this._psActivitiesService.addPlaylistActivity({playlistId, songId, userId, action: 'add'})
    return result.rows[0].id
  }

  async deletePlaylistSong(songId, playlistId, userId){
    const query = {
      text:'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id =$2 RETURNING id',
      values: [songId, playlistId]
    }
    const result = await this._pool.query(query)
    if(!result.rows.length){
      throw new NotFoundError('Song id tidak ditemukan')
    }
    await this._psActivitiesService.addPlaylistActivity({playlistId, songId, userId, action: 'delete'})
  }
}
module.exports = PlaylistSongsService