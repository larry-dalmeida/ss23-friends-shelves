const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Book = require('./models/book');

mongoose.connect('mongodb://127.0.0.1:27017/friends-shelves');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.redirect('books/mine')
});

app.get('/books', catchAsync(async (req, res) => {
    const books = await Book.find({});
    res.render('books/all', { books });
}));

app.get('/books/mine', (req, res) => {
    res.render('books/mine')
});

app.get('/books/new', (req, res) => {
    res.render('books/new');
});

app.post('/books', catchAsync(async (req, res, next) => {
    const book = new Book(req.body.book);
    await book.save();
    res.redirect(`/books/${book._id}`);
}))

app.get('/books/:id', catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id)
    // .populate({
    //     path: 'reviews',
    //     populate: {
    //         path: 'author'
    //     },
    // }).populate('author');
    // console.log(campground);
    // if (!campground) {
    //     req.flash('error', 'Cannot find that campground!');
    //     return res.redirect('/campgrounds');
    // };
    res.render('books/show', { book });
}))

app.get('/books/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id)
    res.render('books/edit', { book });
})

app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    // req.flash('success', 'Successfully updated campground!');
    res.redirect(`/books/${book._id}`)
})

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    // req.flash('success', 'Successfully deleted a campground!');
    res.redirect('/books');
})


app.route('/register')
    .get((req, res) => {
        res.render('users/register');
    })

app.route('/login')
    .get((req, res) => {
        res.render('users/login');
    })

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!';
    res.status(statusCode).render('error', { err });
});


app.listen(8080, () => {
    console.log('Serving on port 8080')
});