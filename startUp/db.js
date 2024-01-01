const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  mongoose
    .connect('mongodb://127.0.0.1/library')
    .then(() => winston.info('Connected...'))
    .catch(err => console.error(err, 'Failed'));
};

//
