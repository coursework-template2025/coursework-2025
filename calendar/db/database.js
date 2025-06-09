const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/calendar.db");

// Создание таблицы для событий, если её нет
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT
  )`);
});

// Таблица пользователей
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

// Экспорт функций и базы данных
module.exports = {
  db, // <-- ВАЖНО: добавляем экспорт базы данных

  getEvents: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM events", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getEventsByMonth: (month, year) => {
    return new Promise((resolve, reject) => {
      const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endDate = `${year}-${month.toString().padStart(2, "0")}-31`;

      db.all(
        "SELECT * FROM events WHERE date BETWEEN ? AND ?",
        [startDate, endDate],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getEventsByDay: (day, month, year) => {
    return new Promise((resolve, reject) => {
      const date = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      db.all("SELECT * FROM events WHERE date = ?", [date], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  addEvent: (title, date) => {
    return new Promise((resolve, reject) => {
      const eventDate = new Date(date);
      const formattedDate = eventDate.toISOString().split("T")[0];

      if (isNaN(eventDate.getTime())) {
        return reject("Некорректная дата");
      }

      db.run(
        "INSERT INTO events (title, date) VALUES (?, ?)",
        [title, formattedDate],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },
};
