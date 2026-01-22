const { Pool } = require('pg');

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    query: jest.fn()
  };
} else {
  const pool = new Pool({
    host: 'postgres',
    user: 'notes',
    password: 'notes',
    database: 'notesdb',
    port: 5432
  });

  async function initDb(retries = 5) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS notes (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      console.log('Database ready');
    } catch (err) {
      console.error('DB init failed, retrying...', err.message);
      if (retries > 0) {
        setTimeout(() => initDb(retries - 1), 3000);
      } else {
        throw err;
      }
    }
  }

  initDb();

  module.exports = pool;
}
