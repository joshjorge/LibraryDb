const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    userEmail: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 50,
        lowercase: true,
    },
    userPassw: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20,
    },
    confirmPassw: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.userPassw;
            },
            message: 'Passw does not match',
        },
    },
    image: {
        type: Buffer,
    },
    imageType: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    passWordRestTkn: String,
    passWordExpire: Date,
});

function validateUser(user) {
    const schema = joi.object({
        userName: joi.string().min(2).max(50).required(),
        userEmail: joi.string().email().required().min(5).max(50),
        userPassw: joi.string().required().min(8).max(20).max(50),
        confirmPassw: joi.string().required().min(8).max(20),
        image: joi.string(),
    });

    return schema.validate(user);
}
userSchema.methods.generateToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin },
        config.get('jwtPrivateKey')
    );
    return token;
};

userSchema.pre('save', async function(next) {
    this.userPassw = await bcrypt.hash(this.userPassw, 12);

    this.confirmPassw = undefined;

    next();
});

userSchema.methods.isCorrectPassw = async function(newPassw, currentPassw) {
    return await bcrypt.compare(newPassw, currentPassw);
};

userSchema.methods.generateResetToken = function() {
    const token = crypto.randomBytes(32).toString('hex');

    this.passWordRestTkn = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    console.log({ token }, this.passWordRestTkn);
    this.passWordExpire = Date.now() + 10 * 60 * 1000;

    return token;
};

userSchema.virtual('imagePath').get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};chartset=utf-8;base64,${this.image.toString(
      'base64'
    )}`;
    }
});

const User = mongoose.model('User', userSchema);
exports.User = User;
exports.validateUser = validateUser;