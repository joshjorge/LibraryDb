const express = require('express');
const mongoose = require('mongoose');
const { Book, validateBook } = require('../models/book');
const { Author } = require('../models/bookAuthor');
const { Genre } = require('../models/bookGenre');
const connected = require('../middleware/connected');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', async (req, res) => {
  const books = await Book.find()
    .populate({
      path: 'bookGenre',
      strictPopulate: false,
    })
    .populate({
      path: 'bookAuthor',
      strictPopulate: false,
    });

  res.send(books);
});
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate({
      path: 'bookGenre',
      strictPopulate: false,
    })
    .populate({
      path: 'bookAuthor',
      strictPopulate: false,
    });

  if (!book) return res.status(404).send('item not found');

  res.send(book);
});

router.post('/', connected, admin, async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.bookGenre);
  if (!genre) return res.status(404).send('Invalid genre');

  const author = await Author.findById(req.body.bookAuthor);
  if (!author) return res.status(404).send('Invalid author');

  const book = new Book({
    bookTitle: req.body.bookTitle,
    bookDescription: req.body.bookDescription,
    bookPubDate: req.body.bookPubDate,
    bookGenre: genre,
    bookAuthor: author,
  });

  // const author = await Author.findById(req.body.bookAuthor);
  // if (!author) return res.status(404).send('Invalid author');

  // const genre = await Genre.findById(req.body.bookAuthor);
  // if (!genre) return res.status(404).send('Invalid genre');

  await book.save();

  res.send(book);
});

router.put('/:id', connected, admin, async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.bookGenre);
  if (!genre) return res.status(404).send('Invalid genre');

  const author = await Author.findById(req.body.bookAuthor);
  if (!author) return res.status(404).send('Invalid author');

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      bookTitle: req.body.bookTitle,
      bookDescription: req.body.bookDescription,
      bookPubDate: req.body.bookPubDate,
      addDate: req.body.addDate,
      bookGenre: genre,
      bookAuthor: author,
    },
    {
      new: true,
    }
  );

  if (!book) return res.status(404).send('Invalid book');

  await book.save();

  res.send(book);
});

router.delete('/:id', connected, admin, async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) res.status(404).send('Item not found');

  res.send(book);
});
module.exports = router;
