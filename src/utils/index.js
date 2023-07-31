const mapDBAlbumsToModel = ({
id,
name,
year
}) => ({
    id,
    name,
    year
})

const mapDBSongsToModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId
}) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId
})

const mapDBSongsAlbumIdToModel = ({
    id,
    title,
    performer,
    cover
}) => ({
    id,
    title,
    performer,
    coverUrl: cover
})

module.exports = {mapDBAlbumsToModel, mapDBSongsToModel, mapDBSongsAlbumIdToModel}