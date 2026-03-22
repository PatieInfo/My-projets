const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'contacts.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    phone     TEXT,
    category  TEXT DEFAULT 'personal',
    created   TEXT DEFAULT (datetime('now'))
  )
`);

const { count } = db.prepare('SELECT COUNT(*) AS count FROM contacts').get();

if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO contacts (name, email, phone, category) VALUES (@name, @email, @phone, @category)'
  );

  const seed = db.transaction((rows) => rows.forEach(r => insert.run(r)));

  seed([
    { name: 'Alice Martin',  email: 'alice.martin@example.com',  phone: '+1 555-0101', category: 'work'     },
    { name: 'Bob Nguyen',    email: 'bob.nguyen@example.com',    phone: '+1 555-0102', category: 'personal' },
    { name: 'Clara Dubois',  email: 'clara.dubois@example.com',  phone: '+1 555-0103', category: 'work'     },
    { name: 'David Osei',    email: 'david.osei@example.com',    phone: '+1 555-0104', category: 'family'   },
    { name: 'Eva Rosenberg', email: 'eva.rosenberg@example.com', phone: '+1 555-0105', category: 'personal' },
  ]);

  console.log('Sample contacts inserted.');
}

module.exports = db;
