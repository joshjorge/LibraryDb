const mongoose = require('mongoose');
const joi = require('joi');

const User_Pov = mongoose.model(
    'User_Pov',
    new mongoose.Schema({
        commenter: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        // book: {
        //     type: mongoose.SchemaTypes.ObjectId,
        //     ref: 'Book',
        //     required: true,
        // },
        commentReply: [],
        comment: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 250,
        },
        rate: {
            type: Number,
            min: 0,
            max: 10,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    })
);

function validatePov(userPov) {
    const schema = joi.object({
        commenter: joi.objectId().required(),
        // book: joi.objectId().required(),
        comment: joi.string().required().min(2).max(250),
        rate: joi.number().required(),
    });

    return schema.validate(userPov);
}

exports.userPov = User_Pov;
exports.validatePov = validatePov;