const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/User');
require('dotenv').config();

app.use(express.static('public'));

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'секрет',
  resave: false,
  saveUninitialized: false
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ==== Маршруты ====



app.get('/', (req, res) => {
  res.send('Главная страница');
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});