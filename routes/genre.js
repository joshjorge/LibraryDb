const express = require('express');
const mongoose = require('mongoose');
const { Genre, validateGenre } = require('../models/bookGenre');
const connected = require('../middleware/connected');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', async(req, res) => {
    const genre = await Genre.find();

    res.send(genre);
});
router.get('/:id', async(req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) res.status(404).send('Genre not found');

    res.send(genre);
});

router.post('/', connected, admin, async(req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        genre: req.body.genre,
    });

    await genre.save();

    res.send(genre);
});

router.put('/:id', connected, admin, async(req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
        req.params.id, {
            genre: req.body.genre,
        }, { new: true }
    );
    if (!genre) return res.status(404).send('Genre not found');

    await genre.save();

    res.send(genre);
});

router.delete('/:id', connected, admin, async(req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) return res.status(404).send('Item not found');

    res.send(genre);
});

module.exports = router;