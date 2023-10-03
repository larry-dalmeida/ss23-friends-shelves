const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowingrequestSchema = new Schema({
    borrower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // FIXME: [Readability] Recommend using 'prepositions' to describe state changes in location, example: 'AT_LENDER', 'IN_TRANSIT_LENDER_TO_BORROWER', 'IN_TRANSIT_BORROWER_TO_LENDER'
    // Popular convention is to the uppercase as these are constants
    // 1. I chose not to use 'home' as the location may be anywhere.
    // 2. I chose not to use 'backHome' as this may not be necessary (simplified) if AT_LENDER is the same as BACK_AT_LENDER but you know the logic better
    bookLocation: { type: String, enum: ['home', 'transferLtoB', 'atB', 'transferBtoL', 'backHome'], required: true, },
    dueDate: Date,
    textlog: [
        {
            messageText: String,
            // FIXME: [Readability] Recommend avoiding single letter variable names, clearer alternative: ['BORROWER', 'LENDER']
            messageWriter: { type: String, enum: ['b', 'l'], },
            messageTimestamp: Date,
        }
    ],
});

module.exports = mongoose.model("Borrowingrequest", borrowingrequestSchema);