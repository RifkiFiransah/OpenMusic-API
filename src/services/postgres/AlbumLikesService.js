const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const ClientError = require("../../exceptions/ClientError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumLikesService {
  constructor(albumsService, cacheService){
    this._pool = new Pool()
    this._albumsService = albumsService
    this._cacheService = cacheService
  }

  async addLikeToAlbum(albumId, userId){
    const id = `like-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id,userId,albumId]
    }
    const result = await this._pool.query(query)
    if(!result.rowCount){
      throw new InvariantError('Album gagal disukai')
    }
    await this._cacheService.delete(`likes:${albumId}`)
    return result.rows[0].id
  }

  async getAlbumLikes(albumId){
    try {
      const result = await this._cacheService.get(`likes:${albumId}`)
      return {
        likes: JSON.parse(result),
        cached: true
      }
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }
      const result = await this._pool.query(query)
      if(!result.rowCount){
        throw new NotFoundError('Album tidak ditemukan')
      }
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rowCount))
      return {
        likes: result.rowCount,
        cached: false
      }
    }
  }

  async deleteLike(albumId, userId){
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId]
    }
    const result = await this._pool.query(query)
    if(!result.rowCount){
      throw new NotFoundError('Like gagal dihapus, id tidak ditemukan')
    }
    await this._cacheService.delete(`likes:${albumId}`)
  }

  async verifyUserLiked(id, userId){
    await this._albumsService.getAlbumById(id)
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [id, userId]
    }
    const result = await this._pool.query(query)
    if(result.rowCount > 0){
      throw new ClientError('Anda sudah pernah menyukai album ini')
    }
  }
}

module.exports = AlbumLikesService