const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./middleware');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'SECRET_KEY';

/* =======================
   АВТОРИЗАЦИЯ
   ======================= */

// Регистрация
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  const exists = await db.query(
    'SELECT id FROM users WHERE email=$1',
    [email]
  );

  if (exists.rows.length > 0) {
    return res.status(400).json({ message: 'Пользователь уже существует' });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO users(email, password) VALUES($1,$2)',
    [email, hash]
  );

  res.status(201).json({ message: 'Регистрация успешна' });
});

// Логин
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  );

  if (user.rows.length === 0) {
    return res.status(401).json({ message: 'Неверные данные' });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) {
    return res.status(401).json({ message: 'Неверные данные' });
  }

  const token = jwt.sign(
    { id: user.rows[0].id, email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

/* =======================
   ЗАМЕТКИ (CRUD)
   ======================= */

// Получить заметки пользователя
app.get('/api/notes', auth, async (req, res) => {
  const notes = await db.query(
    'SELECT * FROM notes WHERE user_id=$1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(notes.rows);
});

// Создать заметку
app.post('/api/notes', auth, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  await db.query(
    'INSERT INTO notes(title, content, user_id) VALUES($1,$2,$3)',
    [title, content, req.user.id]
  );

  res.sendStatus(201);
});

// Удалить заметку
app.delete('/api/notes/:id', auth, async (req, res) => {
  await db.query(
    'DELETE FROM notes WHERE id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  res.sendStatus(204);
});

/* ======================= */

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Backend started');
  });
}

module.exports = app;
