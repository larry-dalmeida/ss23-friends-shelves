const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const books = require('../controllers/books');
const { isLoggedIn, validateBook, isOwner } = require('../middleware');



router.route('/')
    .get(catchAsync(books.index))
    .post(isLoggedIn, validateBook, catchAsync(books.createBook));

router.get('/mine', isLoggedIn, books.myIndex);

router.get('/new', isLoggedIn, books.renderNewForm);

router.route('/:id')
    .get(catchAsync(books.showBook))
    .put(isLoggedIn, isOwner, validateBook, catchAsync(books.updateBook))
    .delete(isLoggedIn, isOwner, catchAsync(books.deleteBook));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(books.renderEditForm));


module.exports = router;