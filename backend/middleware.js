const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Неверный формат токена' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Неверный или просроченный токен' });
  }
};
