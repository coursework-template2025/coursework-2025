const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const multer = require('multer');
const path = require('path');

// Настройка multer для загрузки фото
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware для проверки авторизации
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } 
  res.redirect('/login');
}

// Форма создания объявления
router.get('/new', isAuthenticated, (req, res) => {
  res.render('cars/new');
});

// Обработка создания объявления
router.post('/', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const { brand, model, year, price, phone, additionalInfo } = req.body;
    const photo = req.file ? '/uploads/' + req.file.filename : null;

    const car = new Car({
      brand,
      model,
      year,
      price,
      phone,
      additionalInfo,
      photo,
      author: req.session.userId
    });

    await car.save();
    res.redirect('/cars');
  } catch (err) {
    console.error(err);
    res.send('Ошибка при добавлении объявления');
  }
});

// Страница со списком объявлений с поиском
router.get('/', async (req, res) => {
  try {
    const { brand, model } = req.query;
    const filter = {};

    if (brand) filter.brand = new RegExp(brand, 'i'); // нечувствительный к регистру поиск
    if (model) filter.model = new RegExp(model, 'i');

    const cars = await Car.find(filter).sort({ createdAt: -1 }).lean();
    res.render('cars/index', { cars, search: { brand, model } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при загрузке объявлений');
  }
});

// Страница одного авто по ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).lean();
    if (!car) {
      return res.status(404).send('Автомобиль не найден');
    }
    res.render('cars/show', { car });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;

const methodOverride = require('method-override');
router.use(methodOverride('_method'));

// Страница редактирования авто
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).lean();
    if (!car || car.author.toString() !== req.session.userId) {
      return res.status(403).send('Доступ запрещён');
    }
    res.render('cars/edit', { car });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при загрузке');
  }
});

// Обработка обновления
router.post('/:id', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const { brand, model, year, price, phone, additionalInfo } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car || car.author.toString() !== req.session.userId) {
      return res.status(403).send('Доступ запрещён');
    }

    car.brand = brand;
    car.model = model;
    car.year = year;
    car.price = price;
    car.phone = phone;
    car.additionalInfo = additionalInfo;

    if (req.file) {
      car.photo = '/uploads/' + req.file.filename;
    }

    await car.save();
    res.redirect(`/cars/${car._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при обновлении');
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.author.toString() !== req.session.userId) {
      return res.status(403).send('Доступ запрещён');
    }
    await Car.findByIdAndDelete(req.params.id);
    res.redirect('/cars');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при удалении');
  }
});

