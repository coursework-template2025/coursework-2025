const express = require('express');
const path = require('path');
const session = require('express-session'); // 👈 добавляем
const app = express();
const port = 3004;

const db = require('./initDB');

if (typeof db.initDB === 'function') {
  db.initDB();
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// 👇 Настройка сессий
app.use(session({
  secret: 'super-secret-key', // можешь заменить на что-то более сложное
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // для dev режима, в проде надо ставить true с HTTPS
}));

// 👇 Подключаем основной роутер
const lessonsRouter = require('./routes/lessons');
app.use('/', lessonsRouter);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
