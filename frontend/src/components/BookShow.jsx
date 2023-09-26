import BookEdit from './BookEdit';
import { useState, useContext } from 'react';
import BooksContext from '../context/books';



function BookShow({ book, user }) {

    const { deleteBookById } = useContext(BooksContext);

    //Handle the edit menu for every book
    const [showEdit, setShowEdit] = useState(false);

    const handleDeleteClick = () => {
        deleteBookById(book._id);
    }

    const handleEditClick = () => {
        setShowEdit(!showEdit);
    };

    //Handle submissions for edits
    const handleSubmit = () => {
        setShowEdit(false);
    }

    // Esther: book image in line with what db responds - to do: set book image Url in DB by ISBN query of openlibrary  
    // let bookImage = 'https://covers.openlibrary.org/b/isbn/'.concat(book.ISBN, '-M.jpg');
    // Esther to Alex: do we need to define bookImage could we not just use book.image further down?
    let bookImage = book.image;

    // Esther to Alex: I guess we can get rid of the in Library stuff and as a decision maker use the owner logic
    // or better: I want to work on only passing through the owner id for the books the logged in user is the owner for - securety stuff
    // so the logic could be based on only books, where book.owner is even defined - lets talk about this
    let bookInLibrary = "In Library";

    if (book.owner._id !== user[0]._id) {
        bookInLibrary = "Not In Library";
    }

    //Show the book as object
    // let content = <div key={book._id}><p><img className='bookCover' src={bookImage} /></p><b>{book.title}</b><p>{book.author}</p>{book.ISBN}<p>{bookInLibrary}</p>{book.blurb}</div>
    let content = <div key={book._id}>
        <p><img className='bookCover' src={bookImage} /></p>
        <b>{book.title}</b>
        <p>{book.author}</p>
        <p>{book.isbn} </p>
        <p>owned by: {book.owner.username}</p>
        <p>{bookInLibrary}</p>
        <p>{book.blurb}</p>
    </div>
        ;

    let actions =
        <div className="actions">
            <p>
                <button className="edit" onClick={handleEditClick}>
                    Edit
                </button>
                <button className="delete" onClick={handleDeleteClick}>
                    Delete
                </button>
            </p>
        </div>

    if (bookInLibrary !== "In Library") {
        // Esther to Alex: Colt described that there is a way to not create a DOM element 
        //  this will create empty divs, but the div still exists out of no reason
        actions = <div></div>
    }

    //if edit button has been pressed, show edit menu for set book
    if (showEdit) {
        // Esther to Alex: in BookEdit you don't actually read the user in and you don't need it for any logic
        // and I guess because of context you don't need to pass either book nor user down any more
        content = <BookEdit onSubmit={handleSubmit} book={book} user={user} />;
    }

    //Show book or edit menu for each book
    return <div className="book-show">
        {content}
        {actions}
    </div>
}

export default BookShow;