const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // модель пользователя
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Пользователь уже существует' });

    // Хэшируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаём пользователя
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Создаём JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
