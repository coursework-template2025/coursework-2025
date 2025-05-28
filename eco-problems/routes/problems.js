// routes/problems.js
const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// GET все проблемы
router.get('/', async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

// POST новая проблема
router.post('/', async (req, res) => {
  const problem = new Problem(req.body);
  await problem.save();
  res.json(problem);
});

// PUT обновить проблему
router.put('/:id', async (req, res) => {
  const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE удалить проблему
router.delete('/:id', async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Проблема удалена' });
});

module.exports = router;
