const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// API endpoint to get all tests
router.get('/api/tests', async (req, res) => {
  try {
    const tests = await Test.find().sort({ title: 1 });
    res.json(tests);
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ error: 'Ошибка при загрузке тестов' });
  }
});

// API endpoint to check test answers
router.post('/api/tests/:id/check', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Тест не найден' });
    }

    const { answers } = req.body;
    
    // Проверяем, что answers является массивом
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Неверный формат ответов' });
    }

    let score = 0;
    const total = test.questions.length;

    // Проверяем каждый ответ
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Формируем ответ с правильными ответами
    const correctAnswers = test.questions.map(q => q.correctAnswer);

    res.json({
      score,
      total,
      correctAnswers
    });
  } catch (err) {
    console.error('Error checking test:', err);
    res.status(500).json({ error: 'Ошибка при проверке теста' });
  }
});

// Page route to display tests
router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find().sort({ title: 1 });
    res.render('tests', { tests });
  } catch (err) {
    console.error('Error rendering tests page:', err);
    res.status(500).send('Ошибка при загрузке тестов');
  }
});

module.exports = router;
