const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    isbn: String,
    image: String,
    blurb: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
});

// delete the reviews in the reviews database when a book is deleted
BookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});


module.exports = mongoose.model('Book', BookSchema);