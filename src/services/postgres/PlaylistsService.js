const { nanoid } = require("nanoid")
const { Pool } = require("pg")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")
const AuthorizationError = require("../../exceptions/AuthhorizationError")

class PlaylistsService {
  constructor(collaborationsService){
    this._pool = new Pool()

    this._collaborationservice = collaborationsService
  }

  async addPlaylist(name, owner){
    const id = `playlist-${nanoid(16)}`
    
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }
    const result = await this._pool.query(query)
    if(!result.rows[0].id){
      throw new InvariantError('Playlist gagal ditambahkan')
    }
    return result.rows[0].id

  }

  async getPlaylists({id}){
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      INNER JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query)
    return result.rows
  }

  async getPlaylistById(id){
    const query = {
      text: `SELECT playlists.*, users.username, songs.id as song_id, songs.title as song_title, songs.performer FROM playlists
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist not found");
    }

    const songs = result.rows.map((row) => ({
      id: row.song_id,
      title: row.song_title,
      performer: row.performer,
    }));

    const playlstResult = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs,
    };

    return playlstResult;
  }

  async deletePlaylistById(id){
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)
    if(!result.rowCount){
      throw new NotFoundError('Playlist tidak ditemukan')
    }
  }

  async verifyPlaylistOwner(id, owner){
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if(!result.rowCount){
      throw new NotFoundError('Playlist tidak ditemukan')
    }
    const playlist = result.rows[0]
    if(playlist.owner != owner){
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess(playlistId, userId){
    try{
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch(error){
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationservice.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }

  async getPlaylistSongs(id) {
    const queryPlaylist = await this._pool.query({
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [id],
    });

    const query = await this._pool.query({
      text: `SELECT s.id, s.title, s.performer
      FROM songs s 
      LEFT JOIN playlist_songs ps ON s.id = ps.song_id
      WHERE ps.playlist_id = $1`,
      values: [id],
    });

    const result = {
      ...queryPlaylist.rows[0],
      songs: query.rows
    };

    return result;
  }
}

module.exports = PlaylistsService