const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/trip-planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const TripSchema = new mongoose.Schema({
  user: String, // имя пользователя
  destination: String,
  date: String,
  notes: String
});

const User = mongoose.model('User', UserSchema);
const Trip = mongoose.model('Trip', TripSchema);

// Регистрация
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: 'Пользователь уже существует' });
  await User.create({ username, password });
  res.json({ success: true });
});

// Вход
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.json({ success: false, message: 'Неверные данные' });
  res.json({ success: true, username });
});

// Добавить поездку
app.post('/trips', async (req, res) => {
  const { user, destination, date, notes } = req.body;
  const trip = await Trip.create({ user, destination, date, notes });
  res.json(trip);
});

// Получить поездки по пользователю
app.get('/trips/:username', async (req, res) => {
  const trips = await Trip.find({ user: req.params.username });
  res.json(trips);
});

// Удалить поездку по ID
app.delete('/trips/:id', async (req, res) => {
  await Trip.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3000, () => console.log('✅ Сервер запущен на http://localhost:3000'));
