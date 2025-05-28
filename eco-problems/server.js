const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const path = require('path');
const cors = require('cors');
const authRoutes = require("./auth");

mongoose.connect('mongodb://127.0.0.1:27017/eco-problems')
  .then(() => console.log('✅ Подключено к MongoDB'))
  .catch(err => console.error('Ошибка подключения:', err));

app.use(cors()); // Можно настроить cors({ origin: 'http://yourdomain.com' })
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api/auth", authRoutes);

app.get('/problems', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении проблем' });
  }
});

app.post('/problems', async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля' });
    }
    const problem = new Problem({ title, description, location });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при создании проблемы' });
  }
});

app.delete('/problems/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Некорректный ID' });
    }
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Проблема не найдена' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при удалении проблемы' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
