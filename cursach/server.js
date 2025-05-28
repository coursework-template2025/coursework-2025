const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/css', express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/car_trade', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

// ВАЖНО! Подключаем сессии перед тем, как к ним обращаться
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/car_trade' })
}));

// Теперь можно обращаться к req.session
app.use(async (req, res, next) => {
  if (req.session.userId) {
    const User = require('./models/User');
    res.locals.user = await User.findById(req.session.userId).lean();
  } else {
    res.locals.user = null;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

app.use('/', authRoutes);

app.use('/cars', (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
}, carRoutes);

app.get('/', (req, res) => {
  res.redirect('/cars');
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

