const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const books = require('../controllers/books');
const { isLoggedIn, validateBook, isOwner } = require('../middleware');

// FIXME: [Code Organisation, Security] Seems like the isLoggedIn middleware is needed for every route
// you could apply it when you 'use' the books route in the app router
// see https://expressjs.com/en/guide/using-middleware.html for examples
router.route('/')
    .get(
        isLoggedIn,
        catchAsync(books.index))
    .post(
        isLoggedIn,
        validateBook,
        catchAsync(books.createBook));

router.get('/mine',
    isLoggedIn,
    catchAsync(books.myIndex));

// Esther: get is not currently used, but should be useful once Alex established a show page for single books
router.route('/:id')
    .get(
        isLoggedIn,
        catchAsync(books.showBook))
    .put(
        isLoggedIn,
        catchAsync(isOwner),
        validateBook,
        catchAsync(books.updateBook))
    .delete(
        isLoggedIn,
        catchAsync(isOwner),
        catchAsync(books.deleteBook));

module.exports = router;