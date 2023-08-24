const mongoose = require('mongoose');
// const Review = require('./review');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    isbn: Number,
    image: String,
    blurb: String,
    // owner: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    // },
});


module.exports = mongoose.model('Book', BookSchema);