const mapDBAlbumsToModel = ({
id,
name,
cover,
year
}) => ({
    id,
    name,
    year,
    coverUrl: cover
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
}) => ({
    id,
    title,
    performer,
})

module.exports = {mapDBAlbumsToModel, mapDBSongsToModel, mapDBSongsAlbumIdToModel}