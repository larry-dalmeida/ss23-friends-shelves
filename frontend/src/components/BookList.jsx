import BookShow from './BookShow'
import { useContext } from 'react';
import BooksContext from '../context/books';
import UserContext from '../context/user';

function BookList() {

    const { books, searchBooks, showBooks } = useContext(BooksContext);
    const { loggedInUser } = useContext(UserContext);

    //render all books in books array
    let renderedBooks = books.map((book) => {
        return <BookShow key={book._id} book={book} user={loggedInUser} />;
        //Esther: do you actually need to pass key - it is included in book I think?
    });

    //render books that adhere to search query if there are any 
    if (searchBooks.length > 0) {
        renderedBooks = searchBooks.map((book) => {
            return <BookShow key={book._id} book={book} user={loggedInUser} />;
        });
    }

    let pageTitle = 'Your Bookshelf';

    if (showBooks === "all") {
        pageTitle = 'All Books';
    }

    return (<div>
        <div className="pageTitle"><h2>{pageTitle}</h2></div>
        <div className="book-list">{renderedBooks}</div>
    </div>
    )
}

export default BookList;