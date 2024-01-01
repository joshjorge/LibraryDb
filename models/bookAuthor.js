const mongoose = require('mongoose');
const joi = require('joi');

const Author = mongoose.model(
    'Author',
    new mongoose.Schema({
        author: { type: String, required: true, minlength: 2, maxlength: 50 },
        country: { type: String, required: true, minlength: 2, maxlength: 50 },
    })
);

function validateAuthor(author) {
    const schema = joi.object({
        author: joi.string().min(2).required(),
        country: joi.string().min(2).required(),
    });

    return schema.validate(author);
}

exports.Author = Author;
exports.validateAuthor = validateAuthor;