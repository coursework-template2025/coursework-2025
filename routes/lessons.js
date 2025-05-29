const express = require('express');
const router = express.Router();
const { db } = require('../initDB');
const bcrypt = require('bcrypt');  

// Главная страница с уроками и поиском
router.get('/', (req, res) => {
  const search = req.query.search || '';
  const sql = search
    ? `SELECT * FROM lessons WHERE title LIKE ?`
    : `SELECT * FROM lessons`;
  const params = search ? [`%${search}%`] : [];

  db.all(sql, params, (err, lessons) => {
    if (err) return res.status(500).send('Database error');
    res.render('index', {
      lessons,
      search,
      user: req.session.user // 👈 передаём текущего пользователя
    });
  });
});

// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register', { error: null, user: req.session.user });
});

// Обработка регистрации
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('register', { error: 'Заполните все поля' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.render('register', { error: 'Пользователь уже существует' });
      }
      res.redirect('/login');
    }
  );
});

// Страница входа
router.get('/login', (req, res) => {
  res.render('login', { error: null, user: req.session.user });
});

// Обработка входа
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) {
      return res.render('login', { error: 'Пользователь не найден' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render('login', { error: 'Неверный пароль' });
    }

    // Устанавливаем сессию
    req.session.user = {
      id: user.id,
      username: user.username
    };

    res.redirect('/');
  });
});

// Выход
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Страница создания нового урока 
router.get('/lesson/new', (req, res) => {
  res.render('form', { lesson: {}, questions: [] });
});

//  Обработка создания нового урока 
router.post('/lesson/new', (req, res) => {
    const { title, description, content, video_url, image_url } = req.body;
    const sql = `INSERT INTO lessons (title, description, content, video_url, image_url) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [title, description, content, video_url, image_url], function(err) {
      if (err) return res.status(500).send('Database error');
  
      // После успешного добавления редиректим на главную страницу
      res.redirect('/');
    });
  });

// Страница редактирования урока 
router.get('/lesson/edit/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM lessons WHERE id = ?', [id], (err, lesson) => {
    if (err) return res.status(500).send('Database error');
    if (!lesson) return res.status(404).send('Lesson not found');
    db.all('SELECT * FROM questions WHERE lesson_id = ?', [id], (err, questions) => {
      if (err) return res.status(500).send('Database error');
      res.render('form', { lesson, questions });
    });
  });
});

// Обработка обновления урока 
router.post('/lesson/edit/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, content, video_url, image_url } = req.body;
  const sql = `UPDATE lessons SET title = ?, description = ?, content = ?, video_url = ?, image_url = ? WHERE id = ?`;
  db.run(sql, [title, description, content, video_url, image_url, id], err => {
    if (err) return res.status(500).send('Database error');
    res.redirect(`/lesson/${id}`);
  });
});
// Страница просмотра отдельного урока
router.get('/lesson/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM lessons WHERE id = ?', [id], (err, lesson) => {
      if (err) return res.status(500).send('Database error');
      if (!lesson) return res.status(404).send('Lesson not found');
  
      db.all('SELECT * FROM questions WHERE lesson_id = ?', [id], (err, questions) => {
        if (err) return res.status(500).send('Database error');
  
        const hasQuestions = questions.length > 0;
  
        res.render('lesson', { lesson, questions, hasQuestions });
      });
    });
  });
  
// Удаление урока 
router.post('/lesson/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM lessons WHERE id = ?', [id], err => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/');
  });
});
// Страница создания вопроса для урока 
router.get('/lesson/:id/question/new', (req, res) => {
    const lesson_id = req.params.id;
    res.render('question_form', { lesson_id });
  });
  
  // Обработка создания вопроса 
  router.post('/lesson/:id/question/new', (req, res) => {
    const lesson_id = req.params.id;
    const { question_text, question_type, options, correct_answer, explanation } = req.body;
  
    const sql = `
      INSERT INTO questions (lesson_id, question_text, question_type, options, correct_answer, explanation)
      VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [
      lesson_id,
      question_text,
      question_type,
      options ? JSON.stringify(options) : null,
      correct_answer,
      explanation
    ], err => {
      if (err) return res.status(500).send('Database error');
      res.redirect(`/lesson/${lesson_id}`);
    });
  });
  
  router.get('/lesson/:id/answer', (req, res) => {
    const lessonId = req.params.id;
  
    db.get('SELECT * FROM lessons WHERE id = ?', [lessonId], (err, lesson) => {
      if (err || !lesson) return res.status(404).send('Урок не найден');
  
      db.all('SELECT * FROM questions WHERE lesson_id = ?', [lessonId], (err, questions) => {
        if (err) return res.status(500).send('Ошибка загрузки вопросов');
  
        res.render('quiz', {
          lesson,
          questions
        });
      });
    });
  });

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  }
  
  router.post('/lesson/:id/check-answer', (req, res) => {
    const { questionId, answer } = req.body;
  
    db.get('SELECT * FROM questions WHERE id = ?', [questionId], (err, question) => {
      if (err || !question) {
        return res.status(400).render('wrong', {
          message: '❌ Вопрос не найден'
        });
      }
  
      let correct = false;
      if (question.question_type === 'multiple-choice') {
        try {
          const correctAnswers = JSON.parse(question.correct_answer);
          const userAnswers = Array.isArray(answer) ? answer : [answer];
  
          correct = arraysEqual(userAnswers, correctAnswers);
        } catch {
          correct = answer === question.correct_answer;
        }
      } else if (question.question_type === 'short-answer') {
        correct = answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
      }
  
      if (correct) {
        res.render('success', {
          explanation: question.explanation,
          question: question.question_text
        });
      } else {
        res.render('wrong', {
          explanation: question.explanation,
          question: question.question_text
        });
      }
    });
  });
  

module.exports = router;
