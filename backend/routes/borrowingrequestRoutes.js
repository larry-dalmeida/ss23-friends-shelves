const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateBorrowingrequest, isLoggedIn, isOwner, isAllowedToDeleteRequest, borrowingrequestBelongsToBook } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const borrowingrequests = require('../controllers/borrowingrequests');

router.post('/',
    // isLoggedIn,
    validateBorrowingrequest,
    catchAsync(borrowingrequests.createBorrowingrequest));

router.route('/:borrowingrequestId')
    .post(
        // isLoggedIn,
        validateBorrowingrequest,
        catchAsync(borrowingrequestBelongsToBook),
        catchAsync(borrowingrequests.handlePostBorrowingrequest))
    .delete(
        //  isLoggedIn,
        catchAsync(borrowingrequestBelongsToBook),
        // catchAsync(isAllowedToDeleteRequest),
        catchAsync(borrowingrequests.deleteBorrowingrequest)
    );

module.exports = router;