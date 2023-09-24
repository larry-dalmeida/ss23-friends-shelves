const Book = require('../models/book');
const Borrowingrequest = require('../models/borrowingrequest');

// create a borrowingrequest
module.exports.createBorrowingrequest = async (req, res) => {
    const reqTimestamp = new Date();
    const { id } = req.params;
    const book = await Book.findById(id);
    const { requserid, status, message, dueDate } = req.body.borrowingrequest;
    const borrowingrequest = new Borrowingrequest();
    // borrowingrequest.borrower = req.user._id;
    borrowingrequest.borrower = requserid;
    borrowingrequest.bookLocation = status;
    borrowingrequest.dueDate = dueDate;
    borrowingrequest.textlog.push({ messageText: message, messageWriter: 'b', messageTimestamp: reqTimestamp });
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
    const reqTimestamp = new Date();
    const { id, borrowingrequestId } = req.params;
    const { requserid, status, message } = req.body.borrowingrequest;
    const dueDate = new Date(req.body.borrowingrequest.dueDate);
    const book = await Book.findById(id);
    const borrowingrequest = await Borrowingrequest.findById(borrowingrequestId);
    const pushMessage = () => {
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: book.owner.equals(requserid) ? 'l' : 'b', messageTimestamp: reqTimestamp });
        };
    };
    const setDueDate = () => {
        if (dueDate > reqTimestamp) {
            borrowingrequest.dueDate = dueDate;
        } if (dueDate <= reqTimestamp) {
            // req.flash('error', 'Select a date that lies in the future!');
            // return res.redirect('/books/:id');
            console.log('dueDate must be in the future');
        }
    };
    // logic for updating the request depending on the current situation
    if (borrowingrequest.bookLocation === 'home' && status === 'backHome' && borrowingrequest.borrower.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        pushMessage();
        await borrowingrequest.save();
        // req.flash('success', 'You decided not to borrow the book!');
        // console.log('B canceled the borrowing request, while the book was still home!');
    } else if (borrowingrequest.bookLocation === 'home' && status === 'transferLtoB' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        setDueDate();
        pushMessage();
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('you accepted the borrowingrequest');
    } else if (borrowingrequest.bookLocation === 'transferLtoB' && status === 'atB' && borrowingrequest.borrower.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        pushMessage();
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('The book is now at B!');
    } else if (borrowingrequest.bookLocation === 'atB' && status === 'transferBtoL' && borrowingrequest.borrower.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        // Esther: To Do: figure out how to get the timestamp of the request and set this one to dueDate
        borrowingrequest.dueDate = reqTimestamp;
        pushMessage();
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('B asked to give book back ahead of time - now in transferBtoL!');
    } else if (borrowingrequest.bookLocation === 'atB' && status === 'transferBtoL' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        borrowingrequest.dueDate = reqTimestamp;
        pushMessage();
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('L asked to get book back - now in transferBtoL!');
    } else if (borrowingrequest.bookLocation === 'transferBtoL' && status === 'backHome' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        pushMessage();
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('L got the book back - now its back home!');
    } else if (borrowingrequest.bookLocation === status && book.owner.equals(requserid)) {
        setDueDate();
        pushMessage();
        await borrowingrequest.save();
        // req.flash('success', 'Accepted borrowing request!');
        // console.log('L sent a message and/or adjusted the dueDate - no bookLocation changes!');
    } else if (borrowingrequest.bookLocation === status && borrowingrequest.borrower.equals(requserid)) {
        pushMessage();
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