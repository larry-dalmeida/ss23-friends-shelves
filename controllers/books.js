const Book = require('../models/book');

module.exports.index = async (req, res) => {
    const books = await Book.find({}).populate('owner');
    res.render('books/all', { books });
};

module.exports.myIndex = async (req, res) => {
    const currentUser = req.user._id;
    const mybooks = await Book.find({ owner: currentUser }).populate('owner');
    res.render('books/mine', { mybooks })
};

module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
};

module.exports.createBook = async (req, res, next) => {
    const book = new Book(req.body.book);
    book.owner = req.user._id;
    await book.save();
    req.flash('success', 'You successfully created a new book!');
    res.redirect(`/books/${book._id}`);
};

module.exports.showBook = async (req, res) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'writer'
        },
    }).populate('owner');
    if (!book) {
        req.flash('error', 'Cannot find that book!');
        return res.redirect('/books');
    };
    res.render('books/show', { book });
};

module.exports.renderEditForm = async (req, res) => {
    const book = await Book.findById(req.params.id)
    if (!book) {
        req.flash('error', 'Cannot find that book!');
        return res.redirect('/books');
    };
    res.render('books/edit', { book });
};

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    req.flash('success', 'Successfully updated this book!');
    res.redirect(`/books/${book._id}`)
};

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a book!');
    res.redirect('/books');
};


