const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const Article = require('./models/Article'); // подключи модель
const articleRoutes = require('./routes/articles');
const tabsRoutes = require('./routes/tabs');
const testsRoutes = require('./routes/tests');
const Tab = require('./models/Tab');
const Test = require('./models/Test');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use('/', articleRoutes);
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Middleware для проверки аутентификации
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/register');
}

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB подключен'))
  .catch(err => console.error('Ошибка MongoDB:', err));

// View engine
app.set('view engine', 'ejs');

// Маршруты
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', articleRoutes);

// Защищенные маршруты
app.use('/tabs', isAuthenticated, tabsRoutes);
app.use('/tests', isAuthenticated, testsRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

// Защищённые страницы
app.get('/tabs', isAuthenticated, async (req, res) => {
  try {
    const tabs = await Tab.find().sort({ title: 1 });
    res.render('tabs', { tabs, user: req.session.user });
  } catch (error) {
    console.error('Error loading tabs:', error);
    res.status(500).send('Ошибка при загрузке табов');
  }
});

app.get('/library', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'library.html'));
});

app.get('/tests', isAuthenticated, async (req, res) => {
  try {
    const tests = await Test.find().sort({ title: 1 });
    res.render('tests', { tests, user: req.session.user });
  } catch (error) {
    console.error('Error loading tests:', error);
    res.status(500).send('Ошибка при загрузке тестов');
  }
});

// Перенаправление с .html на соответствующие маршруты
app.get('/articles.html', (req, res) => {
  res.redirect('/articles');
});

app.get('/tabs.html', (req, res) => {
  res.redirect('/tabs');
});

app.get('/library.html', (req, res) => {
  res.redirect('/library');
});

app.get('/tests.html', (req, res) => {
  res.redirect('/tests');
});

// Проверка авторизации
app.get('/api/check-auth', (req, res) => {
  res.json({ authenticated: !!req.session.user });
});

// Роут для отображения всех статей всем пользователям
app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 }); // последние сверху
    res.render('articles', { articles, user: req.session.user }); // рендерим EJS шаблон
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для выхода
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Ошибка при выходе:', err);
            return res.status(500).send('Ошибка при выходе');
        }
        res.redirect('/');
    });
});

// Статика
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.pdf')) {
            res.set('Content-Type', 'application/pdf');
        } else if (path.endsWith('.mp3')) {
            res.set('Content-Type', 'audio/mpeg');
        }
    }
}));

// Запуск сервера
app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
