const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("./models/User"); // модель пользователя

const JWT_SECRET = "your_jwt_secret_key"; // Секрет для JWT (лучше хранить в .env)

// Middleware для проверки JWT токена в заголовке Authorization
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "Нет токена, авторизация отклонена" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Нет токена, авторизация отклонена" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Токен невалиден" });
  }
}

router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Имя пользователя должно быть не менее 3 символов"),
    body("email").isEmail().withMessage("Неверный email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Пароль должен быть минимум 6 символов"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Пользователь с таким email уже существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        username,
        email,
        password: hashedPassword,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка сервера");
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Неверный email"),
    body("password").exists().withMessage("Пароль обязателен"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Неверные данные для входа" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Неверные данные для входа" });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка сервера");
    }
  }
);

// Пример защищенного маршрута (можешь использовать для CRUD операций, требующих авторизации)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
