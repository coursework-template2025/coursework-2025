const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./travels.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        friend_code TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_id INTEGER,
        destination TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        budget REAL,
        description TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS trip_participants (
        trip_id INTEGER,
        user_id INTEGER,
        FOREIGN KEY(trip_id) REFERENCES trips(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS friends (
        user_id INTEGER,
        friend_id INTEGER,
        UNIQUE(user_id, friend_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS trip_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,
        user_id INTEGER,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(trip_id) REFERENCES trips(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
});

module.exports = db;