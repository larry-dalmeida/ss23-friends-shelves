const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    // ejs version:
    // try {
    //     const { email, username, password } = req.body;
    //     const user = new User({ email, username });
    //     const registeredUser = await User.register(user, password);
    //     req.login(registeredUser, err => {
    //         if (err) return next(err);
    //         req.flash('success', `Welcome to FriendsShelves ${username}!`);
    //         res.redirect('/books');
    //     });
    // } catch (e) {
    //     req.flash('error', e.message);
    //     res.redirect('register');
    // };
    // React version:
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        const dbUserentry = await User.find({ username: username });
        res.send(dbUserentry);
        req.login(registeredUser, err => {
            if (err) return next(err);
            // res.send(username);
        });
    } catch (e) {
        res.send(e.message);
    };
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

// rewrite with react: 
// Esther: for now ok, but the redirect logic should be set up, when we get routes
module.exports.login = async (req, res) => {
    // ejs version: previous functions in routes do the authentification, this is just further handeling, when sucessful
    // console.log(req.body);
    const { username } = req.body;
    const user = await User.find({ username: username });
    // req.flash('success', `Welcome back ${username}!`);
    // const redirectUrl = res.locals.returnTo || '/books/mine';
    // res.redirect(redirectUrl);
    // React version: sending user to previously visited page and sending back the username to frontend for flash or incorporation in a nav bar?
    // const redirectUrl = res.locals.returnTo || '/books';
    // res.send({redirectUrl, username});
    res.send(user);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        // req.flash('success', 'Goodbye!');
        // res.redirect('/');
        res.send('successfully logged out on the BE!');
    });
}