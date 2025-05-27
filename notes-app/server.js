const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 5000;

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'), false);
  },
});

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/notes-app')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Секретный ключ для JWT
const JWT_SECRET = 'my-secret-key-123';

// Модель для пользователей
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Модель для заметок (добавляем поле subject)
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  screenshotPath: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, default: 'Free' }, // Новое поле для предмета
});
const Note = mongoose.model('Note', noteSchema);

// Модель для удалённых заметок
const deletedNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  screenshotPath: String,
  createdAt: { type: Date, default: Date.now },
  subject: { type: String, default: 'Free' }, // Добавляем subject
});
const DeletedNote = mongoose.model('DeletedNote', deletedNoteSchema);

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Access denied: No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied: Token missing' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Тестовый маршрут
app.get('/test', (req, res) => res.json({ message: 'Server is working' }));

// Регистрация
app.post('/api/register', [
  body('username').notEmpty().withMessage('Username is required').trim().escape(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Вход
app.post('/api/login', [
  body('username').notEmpty().withMessage('Username is required').trim().escape(),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Получение списка предметов
app.get('/api/subjects', authenticateToken, async (req, res) => {
  try {
    const subjects = await Note.distinct('subject', { userId: req.user.userId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching subjects' });
  }
});

// Заметки
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { subject } = req.query; // Фильтрация по предмету
    const query = { userId: req.user.userId };
    if (subject) query.subject = subject;
    const notes = await Note.find(query);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching notes' });
  }
});

app.post('/api/notes', authenticateToken, upload.single('screenshot'), [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('content').notEmpty().withMessage('Content is required').trim().escape(),
  body('subject').optional().trim().escape(), // Subject не обязателен
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, content, subject } = req.body;
    const screenshotPath = req.file ? `/uploads/${req.file.filename}` : '';
    const newNote = new Note({
      title,
      content,
      screenshotPath,
      userId: req.user.userId,
      createdAt: new Date(),
      subject: subject || 'Free', // По умолчанию "Free"
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Server error adding note' });
  }
});

app.put('/api/notes/:id', authenticateToken, upload.single('screenshot'), [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('content').notEmpty().withMessage('Content is required').trim().escape(),
  body('subject').optional().trim().escape(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { title, content, subject } = req.body;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId.toString() !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

    note.title = title || note.title;
    note.content = content || note.content;
    note.subject = subject || note.subject;
    if (req.file) {
      if (note.screenshotPath && fs.existsSync(path.join(__dirname, note.screenshotPath))) {
        fs.unlinkSync(path.join(__dirname, note.screenshotPath));
      }
      note.screenshotPath = `/uploads/${req.file.filename}`;
    }
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating note' });
  }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId.toString() !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

    await Note.deleteOne({ _id: id });
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting note' });
  }
});

// Корзина
app.get('/api/deleted-notes', authenticateToken, async (req, res) => {
  try {
    const deletedNotes = await DeletedNote.find({ userId: req.user.userId });
    res.json(deletedNotes);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching deleted notes' });
  }
});

app.post('/api/deleted-notes', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('content').notEmpty().withMessage('Content is required').trim().escape(),
  body('subject').optional().trim().escape(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, content, screenshotPath, subject } = req.body;
    const deletedNote = new DeletedNote({
      userId: req.user.userId,
      title,
      content,
      screenshotPath,
      createdAt: new Date(),
      subject: subject || 'Free',
    });
    await deletedNote.save();
    res.status(201).json(deletedNote);
  } catch (err) {
    res.status(500).json({ error: 'Server error adding to trash' });
  }
});

app.delete('/api/deleted-notes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await DeletedNote.findById(id);
    if (!note) return res.status(404).json({ error: 'Deleted note not found' });
    if (note.userId.toString() !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

    await DeletedNote.deleteOne({ _id: id });
    res.json({ message: 'Deleted note removed permanently' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting from trash' });
  }
});

app.delete('/api/deleted-notes', authenticateToken, async (req, res) => {
  try {
    await DeletedNote.deleteMany({ userId: req.user.userId });
    res.json({ message: 'Trash cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error clearing trash' });
  }
});

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});