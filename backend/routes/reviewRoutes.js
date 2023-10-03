const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewWriter } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');

// Esther: revisit once we implement reviews 
// FIXME: [Code Organisation, Security] User needs to be logged in to perform all actions on the reviews route
// Moving this one level above ensures that all actions are protected, preventative of a security loopholes
// such as where a dev may forget about to add this check for a new route
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewWriter, catchAsync(reviews.deleteReview));

module.exports = router;