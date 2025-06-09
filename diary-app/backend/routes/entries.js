const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/entryController');

router.use(auth);
router.get('/', getEntries);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
