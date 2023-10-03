module.exports = func => {
    // FOLLOW-UP: What does this do and why?
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}