const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');


router.post('/', validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', catchAsync(reviews.deleteReview));

module.exports = router;