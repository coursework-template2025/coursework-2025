import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Статические файлы
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.get('/api/courses', (req, res) => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'db.json'));
    const db = JSON.parse(rawData);
    res.json(db.courses || []);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get('/api/courses/:id', (req, res) => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'db.json'));
    const db = JSON.parse(rawData);
    const course = db.courses.find(c => c.id == req.params.id);
    res.json(course || { error: "Course not found" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/api/theory/:filename', (req, res) => {
  const theoryPath = path.join(__dirname, 'theory', req.params.filename);

  fs.readFile(theoryPath, 'utf8', (err, data) => {
    if (err) {
      // Вот это важно! Отправляем 404, чтобы не сработал app.get('*')
      return res.status(404).json({ error: 'Файл не найден' });
    }
    res.type('text/plain').send(data);
  });
});

// Регистрация
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(fs.readFileSync('db.json'));
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Пользователь уже существует" });
  }
  const newUser = { id: Date.now(), email, password, courses: [] };
  db.users.push(newUser);
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  res.json({ success: true });
});

// Вход
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(fs.readFileSync('db.json'));
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Неверные данные" });
  res.json({ id: user.id, email: user.email });
});

// Получить курсы пользователя
app.get('/api/users/:id/courses', (req, res) => {
  const db = JSON.parse(fs.readFileSync('db.json'));
  const user = db.users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  const userCourses = db.courses.filter(course => user.courses.includes(course.id));
  res.json(userCourses);
});

app.get('/api/courses', (req, res) => {
  const db = JSON.parse(fs.readFileSync('./db.json'));
  res.json(db.courses || []);
});

// Добавить курс пользователю
app.post('/api/users/:id/add-course', (req, res) => {
  const { courseId } = req.body;
  const db = JSON.parse(fs.readFileSync('db.json'));
  const user = db.users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  if (!user.courses.includes(courseId)) user.courses.push(courseId);
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  res.json({ success: true });
});

app.post('/api/users/:id/remove-course', (req, res) => {
  const { courseId } = req.body;
  const db = JSON.parse(fs.readFileSync('db.json'));
  const user = db.users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });

  user.courses = user.courses.filter(id => id !== courseId);
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  res.json({ success: true });
});

app.get('/api/users/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync('db.json'));
  const user = db.users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  res.json({ id: user.id, email: user.email });
});
app.get('/api/teachers', (req, res) => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'db.json'));
    const db = JSON.parse(rawData);
    res.json(db.teachers || []);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});


// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});