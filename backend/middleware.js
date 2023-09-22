const ExpressError = require('./utils/ExpressError');
const { bookSchema, reviewSchema, borrowingrequestSchema } = require('./schemas');
const Book = require('./models/book');
const Review = require('./models/review');
const Borrowingrequest = require('./models/borrowingrequest');

// Esther: revisit when session is working
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        // req.flash('error', 'You must be signed in first');
        // return res.redirect('/login');
        return res.send('sign in please');
    };
    // console.log('isLoggedIn just ran');
    next();
};

// Esther: useful when redirecting with session is working
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

// validate the incoming data for book creation or updating with the book Joi Schema
module.exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

// Esther: revisit when session is working
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book.owner.equals(req.user._id)) {
        // req.flash('error', 'You do not have permission to do that!');
        // return res.redirect(`/books/${id}`)
        return res.send('sign in as book owner please');
    };
    // console.log('isOwner just ran');
    next();
};

// Esther: revisit when session is working and we want to incorporate reviews
module.exports.isReviewWriter = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.writer.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    };
    next();
};

// Esther: revisit when session is working and we want to incorporate reviews
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

// validate the incoming data for borrowingrequest creation or updating with the borrowingrequest Joi Schema
module.exports.validateBorrowingrequest = (req, res, next) => {
    const { error } = borrowingrequestSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};



module.exports.borrowingrequestBelongsToBook = async (req, res, next) => {
    const { id, borrowingrequestId } = req.params;
    const book = await Book.findById(id);
    if (book.borrowingrequests.includes(borrowingrequestId) === true) {
        return next();
    } else {
        // req.flash('error', 'Something went wrong with your request!');
        // return res.redirect(`/books/${id}`);
        return console.log('Something went wrong with your request!')
    };
};

//Esther: change requserId to req.user._id - otherwise working fine
// To Do later: only populate the borrowingrequest with the ID and not all of them
// allow request deletion 
module.exports.isAllowedToDeleteRequest = async (req, res, next) => {
    const { id, borrowingrequestId } = req.params;
    const book = await Book.findById(id).populate('borrowingrequests');
    // const borrowerId = '64f09610fcc82a3f318948fc';
    const requserId = '64f09610fcc82a3f318948fc';
    // const ownerId = '64f0969dfcc82a3f3189491a';
    // const requserId = '64f0969dfcc82a3f3189491a';
    if (book.owner.equals(requserId)) {
        // console.log('you are the owner and allowed to delete the request at any time');
        return next();
    } if (book.borrowingrequests[0].bookLocation === 'home' && book.borrowingrequests[0].borrower.equals(requserId)) {
        // console.log('you are the borrower and only allowed to delete the request when the book is still with the owner');
        return next();
    } else {
        console.log('You are not allowed to delete');
        // req.flash('error', 'You do not have permission to do that!');
        // return res.redirect(`/books/${id}`)
        // return res.send('sign in as book owner or borrower please');
    };
    res.send('isAllowedToDeleteRequest just ran');

};