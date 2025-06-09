const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Пользователь уже существует' });

  const user = await User.create({ name, email, password });
  res.json({ token: generateToken(user._id), user: { name: user.name, email: user.email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Неверные данные' });

  res.json({ token: generateToken(user._id), user: { name: user.name, email: user.email } });
};
