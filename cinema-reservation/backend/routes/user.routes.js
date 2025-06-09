const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const { body, validationResult } = require('express-validator');
router.post('/register', 
  [
    body('name').isLength({ min: 2 }).withMessage('Имя должно быть минимум 2 символа'),
    body('email').isEmail().withMessage('Неверный формат email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов'),
  ], 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.register
);
router.post('/login',
  [
    body('email').isEmail().withMessage('Неверный формат email'),
    body('password').notEmpty().withMessage('Пароль обязателен'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.login
);
router.get('/', (req, res) => {
  res.json({ message: 'Список пользователей будет здесь' });
});
router.get('/profile', auth, (req, res) => {
  res.json({ message: `Профиль пользователя с id ${req.userId}` });
});

module.exports = router;
