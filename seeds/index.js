const mongoose = require('mongoose');
const { firstName, lastName, titleStart, titleEnd, bookOwners } = require('./seedHelpers');
const Book = require('../models/book');

mongoose.connect('mongodb://127.0.0.1:27017/friends-shelves');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Book.deleteMany({});
    // for checking if documents are properly connected:
    // const c = new Book({ title: 'purple field' });
    // await c.save();
    for (let i = 0; i < 50; i++) {
        const book = new Book({
            author: `${sample(firstName)} ${sample(lastName)}`,
            title: `${sample(titleStart)} ${sample(titleEnd)}`,
            isbn: '978-3-608-93800-5',
            image: 'https://tse1.mm.bing.net/th?id=OIP.8LPxqTvPFvkgPax6lRcYPwHaKe&pid=Api',
            blurb: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa nihil nisi sit sapiente, eligendi, vero totam vel sequi asperiores ipsa iusto esse quaerat cumque doloribus delectus amet sint id minus.',
            owner: `${sample(bookOwners)}`,
        });
        await book.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });

