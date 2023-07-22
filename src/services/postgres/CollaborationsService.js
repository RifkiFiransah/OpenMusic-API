const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { nanoid } = require("nanoid");

class CollaborationsService {
  constructor(){
    this._pool = new Pool()
  }

  async addCollaborator(playlistId, userId){
    const id = `collab-${nanoid(16)}`
    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId]
    }
    const result = await this._pool.query(query)
    if(!result.rows.length){
      throw new InvariantError("Kolaborasi gagal ditambahkan")
    }
    return result.rows[0].id
  }

  async deleteCollaborator(playlistId, userId){
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values:[playlistId, userId]
    }
    const result = await this._pool.query(query)
    if(!result.rows.length){
      throw new InvariantError("Kolaborasi gagal dihapus")
    }
  }

  async verifyCollaborator(playlistId, userId){
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId]
    }
    const result = await this._pool.query(query)
    if(!result.rows.length){
      throw new InvariantError('Kolaborasi gagal diverifikasi')
    }
  }
}

module.exports = CollaborationsService