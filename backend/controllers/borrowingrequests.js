const Book = require('../models/book');
const Borrowingrequest = require('../models/borrowingrequest');

// create a borrowingrequest
module.exports.createBorrowingrequest = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    const { requserid, status, message, dueDate } = req.body.borrowingrequest;
    const borrowingrequest = new Borrowingrequest();
    // borrowingrequest.borrower = req.user._id;
    borrowingrequest.borrower = requserid;
    borrowingrequest.bookLocation = status;
    borrowingrequest.dueDate = dueDate;
    borrowingrequest.textlog.push({ messageText: message, messageWriter: 'b' });
    book.borrowingrequests.push(borrowingrequest);
    await borrowingrequest.save();
    await book.save();
    // req.flash('success', 'Created new review!');
    // res.redirect(`/books/${id}`);
    res.send(book);
};

module.exports.deleteBorrowingrequest = async (req, res) => {
    const { id, borrowingrequestId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { borrowingrequests: borrowingrequestId } });
    await Borrowingrequest.findByIdAndDelete(borrowingrequestId);
    // req.flash('success', 'Successfully deleted a review!');
    // res.redirect(`/books/${id}`);
    res.send('you deleted the borrowing request');
};

// Esther: add checking logic if the user._id asking for running this function is acctually the owner of the book
// handle post request to a specific borrowingrequest
module.exports.handlePostBorrowingrequest = async (req, res) => {
    const { id, borrowingrequestId } = req.params;
    const { requserid, status, message, dueDate } = req.body.borrowingrequest;
    const book = await Book.findById(id);
    const borrowingrequest = await Borrowingrequest.findById(borrowingrequestId);
    if (borrowingrequest.bookLocation === 'home' && status === 'transferLtoB' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        borrowingrequest.dueDate = dueDate;
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: 'l' });
        };
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('you accepted the borrowingrequest');
    } else if (borrowingrequest.bookLocation === 'transferLtoB' && status === 'atB' && borrowingrequest.borrower.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: 'b' });
        };
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('The book is now at B!');
    } else if (borrowingrequest.bookLocation === 'atB' && status === 'transferBtoL' && borrowingrequest.borrower.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        // Esther: To Do: figure out how to get the timestamp of the request and set this one to dueDate
        borrowingrequest.dueDate = dueDate;
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: 'b' });
        };
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('B asked to give book back ahead of time - now in transferBtoL!');
    } else if (borrowingrequest.bookLocation === 'atB' && status === 'transferBtoL' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        // Esther: To Do: figure out how to get the timestamp of the request and set this one to dueDate
        borrowingrequest.dueDate = dueDate;
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: 'l' });
        };
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('L asked to get book back - now in transferBtoL!');
    } else if (borrowingrequest.bookLocation === 'transferBtoL' && status === 'home' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: 'l' });
        };
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('L got the book back - now its back home!');
    } else if (borrowingrequest.bookLocation === status && book.owner.equals(requserid)) {
        if (dueDate) {
            borrowingrequest.dueDate = dueDate;
        } if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: 'l' });
        };
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('L sent a message and/or adjusted the dueDate - no bookLocation changes!');
    } else if (borrowingrequest.bookLocation === status && borrowingrequest.borrower.equals(requserid)) {
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: 'b' });
        };
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('B sent a message - no bookLocation changes!');
    } else {
        // req.flash('error', 'Cannot find this request!');
        // return res.redirect('/books/:id');
        console.log('next try')
    };
    const updatedbook = await Book.findById(id).populate('borrowingrequests');
    res.send(updatedbook);
};


// console.log(id);
// console.log(borrowingrequestId);
// console.log(req.body);
// console.log(borrowingrequest);
// console.log(message);
// console.log(dueDate);
// console.log(book.borrowingrequests[0]);