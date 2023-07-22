exports.up = pgm => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type:'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
      onDelete: 'cascade'
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    time: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP')
    }
  })
};

exports.down = pgm => {
  pgm.dropTable('playlist_song_activities')
};