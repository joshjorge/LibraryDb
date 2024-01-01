const express = require('express');
const mongoose = require('mongoose');
const { userPov, validatePov } = require('../models/userPov');
const { User } = require('../models/user');
const { Book } = require('../models/book');
const connected = require('../middleware/connected');
const { min } = require('moment');

const router = express.Router();

router.get('/', async(req, res) => {
    const comments = await userPov
        .find()
        .populate({ path: 'user', strictPopulate: false })
        .select('-userEmail -userPassw -isAdmin -passWordRestTkn -passWordExpire')
        .populate({ path: 'book', strictPopulate: false });

    res.send(comments);
});

router.post('/:id/reply', connected, async(req, res) => {
    const { error } = requireComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let comment = await userPov
        .find(req.params.id)
        .populate({ path: 'user', strictPopulate: false })
        .select('-userEmail -userPassw -isAdmin -passWordRestTkn -passWordExpire')
        .populate({ path: 'book', strictPopulate: false });

    if (!comment) res.status(404).send('not found or invalid Id');

    const commentReply = {
        replyTo: comment.commenter,
        replier: req.user.userName,
        replyComment: req.body.replyComment,
    };

    await comment.commentReply.push(commentReply);
    res.send(comment);
});

router.post('/:id/post', connected, async(req, res) => {
    const { error } = validatePov(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id).select(
        '-userEmail -userPassw -isAdmin -passWordRestTkn -passWordExpire'
    );
    if (!user) return res.status(404).send('User Invalid');

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Invalid book');

    const comment = new userPov({
        commenter: user,
        book,
        comment: req.body.comment,
        rate: req.body.rate,
    });

    await comment.save();

    res.send(comment);
});

router.delete('/:id/deleteComment', connected, async(req, res) => {
    const comment = await userPov.find(req.params.id);

    if (!comment) return res.status(404).send('Comment not available');

    if (comment.commenter._id !== req.user._id)
        return res.status(401).send('not allowed to remove the comment');

    await comment.delete();
});

function requireComment(comment) {
    const schema = joi.obj({
        replyComment: joi.required().string().min(1).max(150),
    });

    return schema.validate(comment);
}

module.exports = router;