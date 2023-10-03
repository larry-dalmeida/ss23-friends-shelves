const User = require('../models/user');

// react version: user register - to do: cookies/session
module.exports.register = async (req, res, next) => {
    // FIXME: [Security, UX] Add form validation
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        const dbUserentry = await User.find({ username: username });
        // TODO: [RESTful API Guidelines] Send an appropriate HTTP Status Code, in this case 201 Created
        res.send(dbUserentry);
        req.login(registeredUser, err => {
            if (err) return next(err);
            // req.flash('success', `Welcome to FriendsShelves ${username}!`);
            // res.send(username);
        });
    } catch (e) {
        // req.flash('error', e.message);
        // TODO: [RESTful API Guidelines] Send an appropriate HTTP Status Code
        res.send(e.message);
    };
}

// react version:
// Esther: get session and redirect logic set up
module.exports.login = async (req, res) => {
    const { username } = req.body;
    const user = await User.find({ username: username });
    // req.flash('success', `Welcome back ${username}!`);
    // const redirectUrl = res.locals.returnTo || '/books/mine';
    // res.redirect(redirectUrl);
    res.send(user);
}

// react version:
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        // req.flash('success', 'Goodbye!');
        // res.redirect('/');
    });
    res.send('successfully logged out on the BE!');
}