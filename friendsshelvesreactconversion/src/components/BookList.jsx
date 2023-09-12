import BookShow from './BookShow'

function BookList({ books, searchBooks, onDelete, onEdit, onSearch, user, showBooks }) {

    //render all books in books array
    let renderedBooks = books.map((book) => {
        return <BookShow onEdit={onEdit} onDelete={onDelete} onSearch={onSearch} key={book._id} book={book} user={user} />;
        //Esther: do you actually need to pass key - it is included in book I think?
    });

    //render books that adhere to search query if there are any 
    if (searchBooks.length > 0) {
        renderedBooks = searchBooks.map((book) => {
            return <BookShow onEdit={onEdit} onDelete={onDelete} onSearch={onSearch} key={book._id} book={book} user={user} />;
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