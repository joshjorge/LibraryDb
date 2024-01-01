const mongoose = require('mongoose');
const joi = require('joi');

const Genre = mongoose.model(
    'Genre',
    new mongoose.Schema({
        genre: { type: String, required: true, minlength: 5, maxlength: 50 },
    })
);

function validateGenre(genre) {
    const schema = joi.object({
        genre: joi.string().min(3).required(),
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;