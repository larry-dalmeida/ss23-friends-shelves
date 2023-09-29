const Book = require('../models/book');

// react version of: send all books in the db to FE
module.exports.index = async (req, res) => {
    const books = await Book.find({}).populate('owner').sort({ title: 1 });
    res.send(books);
};

// react version of: send all books of a user in the db to FE
module.exports.myIndex = async (req, res) => {
    const currentUser = req.user._id;
    const books = await Book.find({ owner: currentUser }).populate('owner').sort({ title: 1 });
    res.send(books);
};


// react version of: post request handeling for a new book 
module.exports.createBook = async (req, res, next) => {
    const book = new Book(req.body.book);
    book.owner = req.user._id;
    await book.save();
    // req.flash('success', 'Successfully created a new book!');
    res.send(book)
};

// Esther: should be usefull when the show page like with the BE version is up
module.exports.showBook = async (req, res) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'writer'
        },
    }).populate('owner');
    if (!book) {
        req.flash('error', 'Cannot find that book!');
        // return res.redirect('/books');
    };
    // res.render('books/show', { book });
};


// react version of: put request handeling for updating a book 
module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, { ...req.body.book });
    const book = await Book.findOne({ _id: id }).populate('owner');
    // req.flash('success', 'Successfully updated this book!');
    res.send(book);
};

// react version of: deleting a book
module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    // req.flash('success', 'Successfully deleted a book!');
    res.send('Successfully deleted a book!');
};


