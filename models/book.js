const mongoose = require('mongoose');
const joi = require('joi');
require('joi-objectid')(joi);

const Book = mongoose.model(
    'Book',
    new mongoose.Schema({
        bookTitle: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 100,
            trim: true,
        },
        bookDescription: {
            type: String,
            required: true,
            minlength: 15,
            maxlength: 1000,
        },
        bookPubDate: {
            type: Date,
        },
        addDate: {
            type: Date,
            default: Date.now(),
        },
        bookGenre: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Genre',
            required: true,
            trim: true,
        },
        bookAuthor: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Author',
            required: true,
            trim: true,
        },

        // bookComment: {
        //     type: mongoose.SchemaTypes.ObjectId,
        //     ref: 'User_Pov',
        //     required: true,
        // },

        cover: {
            type: Buffer,
        },
        imageType: {
            type: String,
        },
    })
);

function validateBook(book) {
    const schema = joi.object({
        bookTitle: joi.string().min(2).max(50).required(),
        bookDescription: joi.string().min(15).max(1000).required(),
        bookPubDate: joi.date(),
        bookGenre: joi.objectId().required(),
        bookAuthor: joi.objectId().required(),
    });

    return schema.validate(book);
}

exports.Book = Book;
exports.validateBook = validateBook;