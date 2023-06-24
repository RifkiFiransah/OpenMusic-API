const mapDBAlbumsToModel = ({
id,
name,
year,
created_at,
updated_at
}) => ({
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at
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

module.exports = {mapDBAlbumsToModel, mapDBSongsToModel}