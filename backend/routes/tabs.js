const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');

// Получение списка табов
router.get('/', async (req, res) => {
    try {
        const tabs = await Tab.find().select('-file.data -audio.data').sort({ title: 1 });
        res.render('tabs', { tabs, user: req.session.user });
    } catch (error) {
        console.error('Error loading tabs:', error);
        res.status(500).send('Ошибка при загрузке табов');
    }
});

// Получение PDF файла
router.get('/file/:id', async (req, res) => {
    try {
        const tab = await Tab.findById(req.params.id);
        if (!tab || !tab.file.data) {
            return res.status(404).send('Файл не найден');
        }
        res.set('Content-Type', tab.file.contentType);
        res.set('Content-Disposition', `inline; filename="${tab.file.filename}"`);
        res.send(tab.file.data);
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).send('Ошибка при загрузке файла');
    }
});

// Получение аудио файла
router.get('/audio/:id', async (req, res) => {
    try {
        const tab = await Tab.findById(req.params.id);
        if (!tab || !tab.audio.data) {
            return res.status(404).send('Аудио не найдено');
        }
        res.set('Content-Type', tab.audio.contentType);
        res.set('Content-Disposition', `inline; filename="${tab.audio.filename}"`);
        res.send(tab.audio.data);
    } catch (error) {
        console.error('Error serving audio:', error);
        res.status(500).send('Ошибка при загрузке аудио');
    }
});

module.exports = router;
  