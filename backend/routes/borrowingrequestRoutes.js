const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateBorrowingrequest, isLoggedIn, isOwner, isNotOwner, borrowingrequestBelongsToBook, bookHasOngoingBorrowingrequest } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const borrowingrequests = require('../controllers/borrowingrequests');

router.post('/',
    // isLoggedIn,
    validateBorrowingrequest,
    // catchAsync(isNotOwner),
    bookHasOngoingBorrowingrequest,
    catchAsync(borrowingrequests.createBorrowingrequest));

router.route('/:borrowingrequestId')
    .post(
        // isLoggedIn,
        validateBorrowingrequest,
        catchAsync(borrowingrequestBelongsToBook),
        catchAsync(borrowingrequests.handlePostBorrowingrequest))
    .delete(
        //  isLoggedIn,
        // catchAsync(isOwner),
        catchAsync(borrowingrequestBelongsToBook),
        catchAsync(borrowingrequests.deleteBorrowingrequest)
    );

module.exports = router;