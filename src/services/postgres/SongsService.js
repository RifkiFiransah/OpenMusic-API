const { nanoid } = require("nanoid")
const { Pool } = require("pg")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")
const { mapDBSongsToModel } = require("../../utils")

class SongsService {
    constructor(){
        this._pool = new Pool()
    }

    async addSong({title, year, genre, performer, duration, albumId}){
        const id = `song-${nanoid(16)}`
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()

        const query = {
            text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            values: [id, title, year, genre, performer, duration, albumId,createdAt, updatedAt]
        }
        const result = await this._pool.query(query)
        if(!result.rows[0].id){
            throw new InvariantError('lagu gagal ditambahkan')
        }
        return result.rows[0].id
    }

    async getSongs(requestParam){
        const {title, performer} = requestParam
        if(title != undefined && performer != undefined){
            const query = {
                text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2",
                values: [`%${title}%`, `%${performer}%`]
            }
            const {rows} = await this._pool.query(query)
            return rows
        }
        if(title){
            const query = {
                text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1",
                values: [`%${title}%`]
            }
            const {rows} = await this._pool.query(query)
            return rows
        }
        if(performer){
            const query = {
                text: "SELECT id, title, performer FROM songs WHERE performer ILIKE $1",
                values: [`%${performer}%`]
            }
            const {rows} = await this._pool.query(query)
            return rows
        }
        const result = await this._pool.query("SELECT id, title, performer FROM songs")
        return result.rows.map(mapDBSongsToModel)
    }

    async getSongById(id){
        const query= {
            text: "SELECT * FROM songs WHERE id = $1",
            values: [id]
        }
        const result = await this._pool.query(query)
        if(!result.rows.length){
            throw new NotFoundError('lagu tidak ditemukan')
        }
        return result.rows.map(mapDBSongsToModel)[0]
    }

    async editSongById(id, {title, year, genre, performer, duration, albumId}){
        const updatedAt = new Date().toISOString()
        const query = {
            text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id",
            values: [title, year, genre, performer, duration, updatedAt, id]
        }
        const result = await this._pool.query(query)
        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui lagu, id tidak ditemukan')
        }
        return result.rows.map(mapDBSongsToModel)[0]
    }

    async deleteSongById(id){
        const query = {
            text: "DELETE FROM songs WHERE id = $1 RETURNING id",
            values: [id]
        }
        const result = await this._pool.query(query)
        if(!result.rows.length){
            throw new NotFoundError('lagu tidak ditemukan')
        }
        return result.rows.map(mapDBSongsToModel)[0]
    }
}
module.exports = SongsService