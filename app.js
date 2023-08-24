const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Book = require('./models/book');
const Review = require('./models/review');
const { validateBook, validateReview } = require('./middleware');

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

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
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', userRoutes);
app.use('/books', bookRoutes);
app.use('/books/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.redirect('books/mine')
});







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