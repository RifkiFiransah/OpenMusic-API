/* eslint-disable camelcase */

exports.up = pgm => {
  // Membuat user baru 
  pgm.sql("INSERT INTO users VALUES('old_playlists', 'old_playlists', 'old_playlists', 'old_playlists')")

  // Membuat nilai owner pada plyalist yang owner nya bernilai null
  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner = NULL")

  // Memberikan nilai constraint foreign key pada owner terhadap kolom id table users
  pgm.addConstraint("playlists", "fk_playlists.owner_users_id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE")
};

exports.down = pgm => {
  // Menghapus constraint fk_notes.owner_users.id pada table notes
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users_id')

  // Mengubah nilai owner old_notes pada note menjadi NULL
  pgm.sql("UPDATE playlists SET owner = null WHERE owner = 'old_playlists'")

  // Menghapus user baru
  pgm.sql("DELETE FROM users WHERE id = 'old_playlist'")
};
