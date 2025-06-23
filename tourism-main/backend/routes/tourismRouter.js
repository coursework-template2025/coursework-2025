const express = require('express');
const Tourism = require('../models/Tourism');

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
    try {
        const tourism = new Tourism(req.body);
        await tourism.save();
        res.status(201).send(tourism);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        const tours = await Tourism.find();
        res.send(tours);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// READ ONE BY ID
router.get('/:id', async (req, res) => {
    try {
        const tour = await Tourism.findById(req.params.id);
        if (!tour) return res.status(404).send({ error: 'Tour not found' });
        res.send(tour);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const tour = await Tourism.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!tour) return res.status(404).send({ error: 'Tour not found' });
        res.send(tour);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const tour = await Tourism.findByIdAndDelete(req.params.id);
        if (!tour) return res.status(404).send({ error: 'Tour not found' });
        res.send({ message: 'Tour deleted' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
