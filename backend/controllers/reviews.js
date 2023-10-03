const Book = require('../models/book');
const Review = require('../models/review');

// Esther: useful, once we get to reviews
module.exports.createReview = async (req, res) => {
    const book = await Book.findById(req.params.id);
    const review = new Review(req.body.review);
    review.writer = req.user._id;
    book.reviews.push(review);
    await review.save();
    await book.save();
    // TODO: [RESTful API Guidelines] Currently the backend is responsibile for showing the success message 
    // Ideally the responsibility of visual feedback to the user is delegated to the frontend
    // with the backend only sending the appropriate HTTP Status Code (201) to make the API RESTful
    // Additionally you could add a location header https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location to the tell the frontend 
    // where to find the newly created review
    req.flash('success', 'Created new review!');
    // res.redirect(`/books/${book._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    // TODO: [RESTful API Guidelines] Same as above, might find this in other controllers too
    req.flash('success', 'Successfully deleted a review!');
    // res.redirect(`/books/${id}`);
};