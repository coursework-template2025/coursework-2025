const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }
  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Невалидный формат токена' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id }; 
    next();
  } catch (err) {
    console.error('Ошибка валидации токена:', err);
    return res.status(401).json({ message: 'Неверный токен' });
  }
};
