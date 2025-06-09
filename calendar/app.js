const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./db/database");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Сессии
app.use(
  session({
    secret: "секретный_ключ_для_сессии", // замени на что-то своё
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");

// Главная страница
app.get("/", async (req, res) => {
  let month = parseInt(req.query.month);
  let year = parseInt(req.query.year);
  const today = new Date();

  if (isNaN(month) || isNaN(year)) {
    month = today.getMonth();
    year = today.getFullYear();
  }

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const events = await db.getEventsByMonth(month + 1, year); // +1 для SQL

  res.render("index", {
    events,
    currentDay: today.getDate(),
    currentMonthIndex: month,
    currentMonthName: monthNames[month],
    currentYear: year,
    user: req.session.user || null, // <-- добавляем пользователя в шаблон
  });
});
// Страница регистрации
app.get("/register", (req, res) => {
  res.render("register", { user: req.session.user || null });
});

// Страница входа
app.get("/login", (req, res) => {
  res.render("login", { user: req.session.user || null });
});
// Регистрация
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Имя и пароль обязательны");
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    stmt.run(username, hash, function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).send("Пользователь уже существует");
        } else {
          console.error("Ошибка SQLite:", err);
          return res.status(500).send("Ошибка при регистрации (БД)");
        }
      }
      req.session.user = { id: this.lastID, username };
      res.redirect("/");
    });
  } catch (err) {
    console.error("Ошибка хешации:", err);
    res.status(500).send("Ошибка при регистрации");
  }
});

// Авторизация
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  db.db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err || !user) {
        return res.status(400).send("Неверное имя или пароль");
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).send("Неверное имя или пароль");
      }

      req.session.user = { id: user.id, username: user.username };
      res.redirect("/");
    }
  );
});

// Выход
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Добавление события
app.post("/api/events", async (req, res) => {
  const { title, date } = req.body;
  if (!title || !date) {
    return res
      .status(400)
      .json({ status: "error", message: "Название и дата обязательны" });
  }

  try {
    await db.addEvent(title, date);
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Ошибка при добавлении события" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
