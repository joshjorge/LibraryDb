const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { User, validateUser } = require('../models/user');
const connected = require('../middleware/connected');
const imageTypes = ['image/jpeg', 'image/png'];

const router = express.Router();

router.get('/', connected, async(req, res) => {
    const currentUser = await User.findById(req.user._id).select(
        '-userPassw -_id -isAdmin -userEmail'
    );

    res.send(currentUser);
});

router.post('/singUp', async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ userEmail: req.body.userEmail });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassw: req.body.userPassw,
        confirmPassw: req.body.confirmPassw,
    });

    await user.save();
    const token = user.generateToken();

    res.header('x-auth-token', token).header('x-jTkn-auth', token).send(user);

    res.send(user);
});

router.post('/updatePassw', connected, async(req, res) => {
    const { error } = passwSchema(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.find(req.user._id).select('+userPassw');

    const validPassw = user.isCorrectPassw(req.body.userPassw, user.userPassw);
    if (!validPassw) res.status(401).send('Passw incorrect');

    user.userPassw = req.body.userPassw;
    user.confirmPassw = req.body.confirmPassw;

    user.save();

    res.send(user);
});

function passwSchema(passw) {
    const schema = joi.object({
        userPassw: joi.string().required().min(8).max(20).max(50),
        confirmPassw: joi.string().required().min(8).max(20),
    });
    return schema.validate(passw);
}

function saveImage(user, imageEncoded) {
    if (imageEncoded == null) return;

    const image = JSON.parse(imageEncoded);
    if (image != null && imageTypes.includes(image.type)) {
        user.image = new Buffer.from(image.data, 'base64');
        user.imageType = image.type;
    }
}
module.exports = router;