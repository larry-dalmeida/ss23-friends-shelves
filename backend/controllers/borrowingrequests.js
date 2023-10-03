const Book = require('../models/book');
const Borrowingrequest = require('../models/borrowingrequest');

// create a borrowingrequest
// NIT: [Naming Conventions] createBorrowingRequest (camelCase)
module.exports.createBorrowingrequest = async (req, res) => {
    const reqTimestamp = new Date();
    const { id } = req.params;
    const book = await Book.findById(id);
    const { requserid, status, message, dueDate } = req.body.borrowingrequest;
    // Esther to Alex: comment above, uncomment below
    // const {status, message, dueDate } = req.body.borrowingrequest;
    const borrowingrequest = new Borrowingrequest();
    borrowingrequest.borrower = requserid;
    // Esther to Alex: comment above, uncomment below
    // borrowingrequest.borrower = req.user._id;
    borrowingrequest.bookLocation = status;
    borrowingrequest.dueDate = dueDate;
    borrowingrequest.textlog.push({ messageText: message, messageWriter: 'b', messageTimestamp: reqTimestamp });
    book.borrowingrequests.push(borrowingrequest);
    await borrowingrequest.save();
    await book.save();
    const updatedBook = await Book.findById(id).populate('borrowingrequests');
    // req.flash('success', 'Created new review!');
    // res.redirect(`/books/${id}`);
    res.send(updatedBook);
};

module.exports.deleteBorrowingrequest = async (req, res) => {
    const { id, borrowingrequestId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { borrowingrequests: borrowingrequestId } });
    await Borrowingrequest.findByIdAndDelete(borrowingrequestId);
    // req.flash('success', 'Successfully deleted the borrowing request!');
    // res.redirect(`/books/${id}`);
    res.send('you deleted the borrowing request');
};

// handle post request to a specific borrowingrequest
module.exports.handlePostBorrowingrequest = async (req, res) => {
    const reqTimestamp = new Date();
    const { id, borrowingrequestId } = req.params;
    const { requserid, status, message } = req.body.borrowingrequest;
    // Esther to Alex: comment the above line and uncomment the following two lines - I'll then do the clean up, when the FE stands
    // const { status, message } = req.body.borrowingrequest;
    // const requserid = req.user._id;
    const dueDate = new Date(req.body.borrowingrequest.dueDate);
    const book = await Book.findById(id);
    const borrowingrequest = await Borrowingrequest.findById(borrowingrequestId);
    const pushMessage = () => {
        if (message) {
            borrowingrequest.textlog.push({ messageText: message, messageWriter: book.owner.equals(requserid) ? 'l' : 'b', messageTimestamp: reqTimestamp });
        };
    };
    // some logic that only allows dueDate adjustment for dueDates that lie in the future 
    // and prevent L to set dueDate in transferBtoL previous of the reqTimestampPlus3days
    const setDueDate = () => {
        // FIXME: [Readability] Since the condition blocks below are mutually exclusive, recommend returning early to avoid:
        // 1. unnecessary nesting
        // 2. holding the full model of how it works in the readers end until the last line 
        // for more info: https://medium.com/swlh/return-early-pattern-3d18a41bba8
        if (borrowingrequest.bookLocation === 'transferBtoL') {
            if (borrowingrequest.dueDate < dueDate) {
                borrowingrequest.dueDate = dueDate;
            } else if (borrowingrequest.dueDate >= dueDate) {
                console.log(`dueDate must be after the ${borrowingrequest.dueDate}`);
            };
        } else if (dueDate > reqTimestamp) {
            borrowingrequest.dueDate = dueDate;
        } else if (dueDate <= reqTimestamp) {
            // req.flash('error', 'Select a date that lies in the future!');
            // return res.redirect('/books/:id');
            console.log('dueDate must be in the future');
        }
    };

    // Esther: check the dueDate setting logic, so that its borrower and lender friendly when FE is up
    // logic for updating the request depending on the current situation
    // FIXME: [Readability] The logic tree below is becoming hard to read, I've got some ideas, will add comments later
    if (borrowingrequest.bookLocation === 'home' && status === 'backHome') {
        borrowingrequest.bookLocation = status;
        borrowingrequest.dueDate = reqTimestamp;
        pushMessage();
        await borrowingrequest.save();
    } else if (borrowingrequest.bookLocation === 'home' && status === 'transferLtoB' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        setDueDate();
        pushMessage();
        await borrowingrequest.save();
    } else if (borrowingrequest.bookLocation === 'transferLtoB' && status === 'atB' && borrowingrequest.borrower.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        pushMessage();
        await borrowingrequest.save();
    } else if (borrowingrequest.bookLocation === 'atB' && status === 'transferBtoL' && borrowingrequest.borrower.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        borrowingrequest.dueDate = reqTimestamp;
        pushMessage();
        await borrowingrequest.save();
    } else if (borrowingrequest.bookLocation === 'atB' && status === 'transferBtoL' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        const reqTimestampPlus3days = new Date(reqTimestamp.setDate(reqTimestamp.getDate() + 3));
        borrowingrequest.dueDate = reqTimestampPlus3days;
        pushMessage();
        await borrowingrequest.save();
    } else if (borrowingrequest.bookLocation === 'transferBtoL' && status === 'backHome' && book.owner.equals(requserid)) {
        borrowingrequest.bookLocation = status;
        pushMessage();
        await borrowingrequest.save();
    } else if (borrowingrequest.bookLocation === status && book.owner.equals(requserid)) {
        setDueDate();
        pushMessage();
        await borrowingrequest.save();
    } else if (borrowingrequest.bookLocation === status && borrowingrequest.borrower.equals(requserid)) {
        pushMessage();
        await borrowingrequest.save();
    } else {
        // req.flash('error', 'Something went wrong with updating this request. Couldn't do it.');
        // return res.redirect('/books/:id');
        console.log('next try')
    };
    const updatedbook = await Book.findById(id).populate('borrowingrequests');
    res.send(updatedbook);
};