const express = require('express');
const mongoose = require('mongoose');
const joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateConnexion(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ userEmail: req.body.userEmail });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = user.isCorrectPassw(req.body.userPassw, user.userPassw);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = await user.generateToken();

  res.send(token);
  res.header('x-auth-token', token).header('x-jTkn-auth', token).send(user);
});

function validateConnexion(user) {
  const schema = joi.object({
    userEmail: joi.string().min(8).max(20).required().email(),
    userPassw: joi.string().min(8).max(20).required(),
  });

  return schema.validate(user);
}
module.exports = router;
