const express = require('express');
const router = express.Router();
const User = require('../models/User');

  

// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register');
});

// Обработка регистрации
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(400).send('Ошибка регистрации: ' + err.message);
  }
});

// Страница входа
router.get('/login', (req, res) => {
  res.render('login');
});

// Обработка входа
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send('Неверный логин или пароль');
  }

  req.session.user = { 
    id: user._id, 
    role: user.role, 
    username: user.username,
    isAdmin: user.role === 'admin'
  };
  res.redirect(user.role === 'admin' ? '/admin' : '/');
});

// Выход
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});



module.exports = router;
