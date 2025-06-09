// middleware/error.middleware.js

module.exports = (err, req, res, next) => {
  console.error('Ошибка:', err);

  res.status(500).json({
    message: 'Внутренняя ошибка сервера',
    error: err.message,
  });
};
