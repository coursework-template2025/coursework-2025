const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// API endpoint to get all articles
router.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Ошибка при загрузке статей' });
  }
});

// Page route to display articles
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.render('articles', { articles });
  } catch (err) {
    console.error('Error rendering articles page:', err);
    res.status(500).send('Ошибка при загрузке статей');
  }
});

module.exports = router;
