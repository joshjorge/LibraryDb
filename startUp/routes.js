require('express-async-errors');
const express = require('express');
const error = require('../middleware/error');

const books = require('../routes/books');
const genres = require('../routes/genre');
const authors = require('../routes/author');
const usersPov = require('../routes/usersPov');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/book', books);
    app.use('/api/genre', genres);
    app.use('/api/author', authors);
    app.use('/api/comment', usersPov);
    app.use('/api/me', users);
    app.use('/api/auth', auth);
    app.use(error);
};