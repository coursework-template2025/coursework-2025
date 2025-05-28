const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Форма регистрации
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Обработка регистрации
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Проверка, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword
    });
    await user.save();

    // Записываем id пользователя в сессию
    req.session.userId = user._id;
    res.redirect('/cars');
  } catch (err) {
    console.error(err);
    res.send('Ошибка при регистрации');
  }
});

// Форма входа
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Обработка входа
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send('Пользователь не найден');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send('Неверный пароль');
    }

    req.session.userId = user._id;
    res.redirect('/cars');
  } catch (err) {
    console.error(err);
    res.send('Ошибка при входе');
  }
});

// Выход из аккаунта
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
