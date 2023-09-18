const Book = require('../models/book');

module.exports.index = async (req, res) => {
    // const genres = ['fantasy', 'romance', 'crime'];
    // const filters = ['title', 'author', 'isbn'];
    // const books = await Book.find({}).populate('owner').sort({ title: 1 });
    // res.render('books/all', { books, genres, filters });
    const books = await Book.find({}).populate('owner').sort({ title: 1 });
    res.send(books);
};

// rewrite with react: 
module.exports.myIndex = async (req, res) => {
    // ejs version: 
    // const currentUser = req.user._id;
    // const books = await Book.find({ owner: currentUser }).populate('owner').sort({ title: 1 });
    // res.render('books/mine', { books });
    // react version:
    const currentUser = req.body[0]._id;
    // const currentUser = req.user._id;
    const books = await Book.find({ owner: currentUser }).populate('owner').sort({ title: 1 });
    res.send(books);
};

module.exports.search = async (req, res) => {
    const { title, author, isbn, genres } = req.query.search;
    // console.log(req.query);
    // Backend: make Queries with $text work so that typing in one word will give all bigger strings as result that contain that partial string
    // const books = await Book.find({ $text: { $search: `${title}` } }).populate('owner').sort({ title: 1 });
    const books = await Book.find({ $or: [{ title: `${title}` }, { author: `${author}` }, { isbn: `${isbn}` }] }).populate('owner').sort({ title: 1 });
    res.render('books/search', { books })
};

module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
};

module.exports.createBook = async (req, res, next) => {
    // ejs version: 
    // const book = new Book(req.body.book);
    // book.owner = req.user._id;
    // await book.save();
    // req.flash('success', 'You successfully created a new book!');
    // res.redirect(`/books/${book._id}`);
    // react version
    const book = new Book(req.body.book);
    book.owner = req.body.owner;
    await book.save();
    res.send(book)
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
    // console.log(req.params);
    // console.log(req.body);
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, { ...req.body.book });
    const book = await Book.findOne({ _id: id }).populate('owner');
    // req.flash('success', 'Successfully updated this book!');
    // res.redirect(`/books/${book._id}`)
    // res.send(`you made it to update book ${book.title}`);
    res.send(book);
};

module.exports.deleteBook = async (req, res) => {
    // console.log(req.params);
    // res.send("got delete request");
    // ejs version:
    // const { id } = req.params;
    // await Book.findByIdAndDelete(id);
    // req.flash('success', 'Successfully deleted a book!');
    // res.redirect('/books');
    // react version:
    // console.log(req.body);
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.send('Successfully deleted a book!');
};


