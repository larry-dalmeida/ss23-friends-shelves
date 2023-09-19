if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// all required packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
// const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// setup of the MongoDbAtlas
const dbURL = process.env.DB_URL;
//mongodb://127.0.0.1:27017/friends-shelves
mongoose.connect(`${dbURL}FriendsShelves`);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
});

// general configurations
const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));
app.use(methodOverride('_method'));

// Esther revisit for making session work
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};

app.use(session(sessionConfig));

// Esther: check if flash is also used with the FE
app.use(flash());

// Authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Esther: check with Authentication and flash
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Route necessities in routers folder
app.use('/', userRoutes);
app.use('/books', bookRoutes);
app.use('/books/:id/reviews', reviewRoutes);

// further routes
app.get('/', (req, res) => {
    res.render('landingPage')
});

// Esther: error handeling - revisit when FE is setup to deal with some error messages
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!';
    res.status(statusCode).render('error', { err });
});

// general configurations
app.listen(8080, () => {
    console.log('Serving on port 8080')
});