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
    performer
}) => ({
    id,
    title,
    performer
})

module.exports = {mapDBAlbumsToModel, mapDBSongsToModel, mapDBSongsAlbumIdToModel}