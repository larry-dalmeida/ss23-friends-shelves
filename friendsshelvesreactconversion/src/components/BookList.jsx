import BookShow from './BookShow'

function BookList({books, searchBooks, onDelete, onEdit, onSearch, user}){

    //render all books in books array
    let renderedBooks = books.map((book) => {
        return <BookShow onEdit = {onEdit} onDelete = {onDelete} onSearch = {onSearch} key={book.id} book={book} user={user} />;
    }); 

    //render books that adhere to search query if there are any 
    if(searchBooks.length > 0){
        renderedBooks = searchBooks.map((book) => {
            return <BookShow onEdit = {onEdit} onDelete = {onDelete} onSearch = {onSearch} key={book.id} book={book} user={user} />;
        }); 
    }
    

    return(<div>
            <div className = "pageTitle"><h2>Your Bookshelf</h2></div>
            <div className ="book-list">{renderedBooks}</div>
        </div>
    )
}

export default BookList;