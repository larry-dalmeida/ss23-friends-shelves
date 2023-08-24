const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const books = require('../controllers/books');
const { validateBook } = require('../middleware');



router.route('/')
    .get(catchAsync(books.index))
    .post(validateBook, catchAsync(books.createBook));

router.get('/mine', books.myIndex);

router.get('/new', books.renderNewForm);

router.route('/:id')
    .get(catchAsync(books.showBook))
    .put(validateBook, catchAsync(books.updateBook))
    .delete(catchAsync(books.deleteBook));

router.get('/:id/edit', catchAsync(books.renderEditForm));


module.exports = router;