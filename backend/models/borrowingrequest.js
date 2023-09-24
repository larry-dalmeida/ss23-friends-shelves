const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowingrequestSchema = new Schema({
    borrower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookLocation: { type: String, enum: ['home', 'transferLtoB', 'atB', 'transferBtoL', 'backHome'], required: true, },
    dueDate: Date,
    textlog: [
        {
            messageText: String,
            messageWriter: { type: String, enum: ['b', 'l'], },
            messageTimestamp: Date,
        }
    ],
});

module.exports = mongoose.model("Borrowingrequest", borrowingrequestSchema);