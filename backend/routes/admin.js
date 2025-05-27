const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');
const Test = require('../models/Test');
const multer = require('multer');
const path = require('path');
const Article = require('../models/Article');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Используем абсолютный путь к директории frontend/assets
        const basePath = path.join(__dirname, '../../frontend/assets');
        let uploadPath = basePath;
        
        if (file.fieldname === 'file') {
            uploadPath = path.join(basePath, 'tabs');
        } else if (file.fieldname === 'audio') {
            uploadPath = path.join(basePath, 'audio');
        }

        // Создаем директорию, если она не существует
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        console.log('Saving file to:', uploadPath); // Добавляем логирование
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Сохраняем оригинальное расширение файла
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        console.log('Generated filename:', filename); // Добавляем логирование
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Проверяем тип файла
        if (file.fieldname === 'file' && !file.originalname.endsWith('.pdf')) {
            return cb(new Error('Only PDF files are allowed for tabs'));
        }
        if (file.fieldname === 'audio' && !file.originalname.match(/\.(mp3|wav|ogg)$/)) {
            return cb(new Error('Only audio files (mp3, wav, ogg) are allowed'));
        }
        cb(null, true);
    }
});

const User = require('../models/User');

// Middleware для проверки авторизации
function isAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    res.redirect('/login');
}

// Применяем middleware ко всем маршрутам
router.use(isAuthenticated);

// Страница админ-панели
router.get('/', (req, res) => {
    res.render('admin/dashboard', { user: req.session.user });
});

// Пользователи
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/index', { users, user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при загрузке пользователей');
  }
});

router.post('/delete-user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при удалении пользователя');
  }
});

// Статьи
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.render('admin/articles', { articles, user: req.session.user });
    } catch (error) {
        console.error('Error loading articles:', error);
        res.status(500).send('Ошибка при загрузке статей');
    }
});

router.post('/articles/create', async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const article = new Article({
            title,
            content,
            image: image || null
        });
        await article.save();
        res.redirect('/admin/articles');
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).send('Ошибка при создании статьи');
    }
});

router.post('/articles/edit/:id', async (req, res) => {
    try {
        const { title, content, image } = req.body;
        await Article.findByIdAndUpdate(req.params.id, {
            title,
            content,
            image: image || null
        });
        res.redirect('/admin/articles');
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send('Ошибка при обновлении статьи');
    }
});

router.post('/articles/delete/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/admin/articles');
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).send('Ошибка при удалении статьи');
    }
});

// Страница управления табами
router.get('/tabs', async (req, res) => {
    try {
        const tabs = await Tab.find().sort({ title: 1 });
        res.render('admin/tabs', { tabs, user: req.session.user });
    } catch (error) {
        console.error('Error loading tabs:', error);
        res.status(500).send('Ошибка при загрузке табов');
    }
});

// Создание нового таба
router.post('/tabs/create', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, artist, video } = req.body;
        const file = req.files['file'][0];
        const audio = req.files['audio'][0];

        console.log('Uploaded files:', { file, audio }); // Добавляем логирование

        const tab = new Tab({
            title,
            artist,
            file: file.filename, // Сохраняем только имя файла
            audio: audio.filename, // Сохраняем только имя файла
            video: video || ''
        });

        await tab.save();
        console.log('Saved tab:', tab); // Добавляем логирование
        res.redirect('/admin/tabs');
    } catch (error) {
        console.error('Error creating tab:', error);
        res.status(500).send('Ошибка при создании таба');
    }
});

// Редактирование таба
router.post('/tabs/edit/:id', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, artist, video } = req.body;
        const updateData = { title, artist, video };

        // Обновляем файлы только если они были загружены
        if (req.files['file']) {
            updateData.file = req.files['file'][0].filename;
        }
        if (req.files['audio']) {
            updateData.audio = req.files['audio'][0].filename;
        }

        await Tab.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin/tabs');
    } catch (error) {
        console.error('Error updating tab:', error);
        res.status(500).send('Ошибка при обновлении таба');
    }
});

// Удаление таба
router.post('/tabs/delete/:id', async (req, res) => {
    try {
        await Tab.findByIdAndDelete(req.params.id);
        res.redirect('/admin/tabs');
    } catch (error) {
        console.error('Error deleting tab:', error);
        res.status(500).send('Ошибка при удалении таба');
    }
});

// Страница управления тестами
router.get('/tests', async (req, res) => {
    try {
        const tests = await Test.find().sort({ title: 1 });
        res.render('admin/tests', { tests, user: req.session.user });
    } catch (error) {
        console.error('Error loading tests:', error);
        res.status(500).send('Ошибка при загрузке тестов');
    }
});

// Создание нового теста
router.post('/tests/create', async (req, res) => {
    try {
        const { title, questionText, options, correctAnswer } = req.body;
        const test = new Test({
            title,
            questions: [{
                questionText,
                options: options.split(',').map(opt => opt.trim()),
                correctAnswer
            }]
        });
        await test.save();
        res.redirect('/admin/tests');
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).send('Ошибка при создании теста');
    }
});

// Редактирование теста
router.post('/tests/edit/:id', async (req, res) => {
    try {
        const { title, questionText, options, correctAnswer } = req.body;
        const test = await Test.findById(req.params.id);
        
        if (!test) {
            return res.status(404).send('Тест не найден');
        }

        test.title = title;
        test.questions = [{
            questionText,
            options: options.split(',').map(opt => opt.trim()),
            correctAnswer
        }];

        await test.save();
        res.redirect('/admin/tests');
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).send('Ошибка при обновлении теста');
    }
});

// Удаление теста
router.post('/tests/delete/:id', async (req, res) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.redirect('/admin/tests');
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).send('Ошибка при удалении теста');
    }
});

module.exports = router;
