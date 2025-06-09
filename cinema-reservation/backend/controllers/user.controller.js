const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// ✅ Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('🔔 Запрос пришел:', req.body);

    // Проверяем, есть ли пользователь с таким email
    const checkSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkSql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Ошибка сервера' });

      if (results.length > 0) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }

      // Хэшируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Добавляем пользователя
      const insertSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(insertSql, [name, email, hashedPassword], (err2) => {
        if (err2) return res.status(500).json({ message: 'Ошибка при регистраи' });
        res.status(201).json({ message: 'Пользователь зарегистрирован' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// ✅ Вход пользователя
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Ошибка сервера' });

      if (results.length === 0) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const user = results[0];

      // Проверяем пароль
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Неверный пароль' });
      }

      // Создаем токен
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d',
      });

      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
