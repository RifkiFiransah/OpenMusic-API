exports.up = pgm => {
    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        name: {
            type: 'TEXT',
            notNull: true
        },
        year: {
            type: 'INT',
            notNull: true
        },
        cover: {
            type: 'TEXT',
            notNull: true
        },
        created_at: {
            type: 'TEXT',
            notnull: true
        },
        updated_at: {
            type: 'TEXT',
            notnull: true
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('albums')
};
