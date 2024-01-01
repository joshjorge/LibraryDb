const express = require('express');
const mongoose = require('mongoose');
const { Author, validateAuthor } = require('../models/bookAuthor');
const connected = require('../middleware/connected');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', async(req, res) => {
    const author = await Author.find();

    res.send(author);
});
router.get('/:id', async(req, res) => {
    const author = await Author.findById(req.params.id);

    if (!author) res.status(404).send('Author not found');

    res.send(author);
});

router.post('/', connected, admin, async(req, res) => {
    const { error } = validateAuthor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const author = new Author({
        author: req.body.author,
        country: req.body.country,
    });

    await author.save();

    res.send(author);
});

router.put('/:id', connected, admin, async(req, res) => {
    const { error } = validateAuthor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const author = await Author.findByIdAndUpdate(
        req.params.id, {
            author: req.body.author,
            country: req.body.country,
        }, { new: true }
    );
    if (!author) return res.status(404).send('Author not found');

    await author.save();

    res.send(author);
});

router.delete('/:id', connected, admin, async(req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) return res.status(404).send('Item not found');

    res.send(author);
});

module.exports = router;