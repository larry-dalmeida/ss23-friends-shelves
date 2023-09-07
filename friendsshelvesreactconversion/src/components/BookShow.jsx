import BookEdit from './BookEdit';
import {useState} from 'react';



function BookShow({book, onDelete, onEdit}){

    //Handle the edit menu for every book
    const[showEdit, setShowEdit] = useState(false);

    const handleDeleteClick = () =>{
        onDelete(book.id);
    }

    const handleEditClick = () => {
            setShowEdit(!showEdit);
    };

    //Handle submissions for edits
    const handleSubmit = (id, newTitle, newAuthor, newISBN, newImage, newBlurb) => {

        onEdit(id, newTitle, newAuthor, newISBN, newImage, newBlurb);
        setShowEdit(false);
    }

    //Show the book as object
    let content = <div><p>{book.title}</p>{book.author}<p>{book.ISBN}</p>{book.blurb}</div>
    ; 

    //if edit button has been pressed, show edit menu for set book
    if (showEdit){
        content = <BookEdit onSubmit={handleSubmit} book={book}/>;
    }

    // API for book images, might be used later: let bookImage = 'https://covers.openlibrary.org/b/isbn/'.concat(book.ISBN,'-M.jpg');
    
    //Show book or edit menu for each book
    return <div className = "book-show">
            {content}
                <div ClassName = "actions">
                    <p>
                        <button className = "edit" onClick = {handleEditClick}>
                            Edit
                        </button>
                        <button className = "delete" onClick = {handleDeleteClick}>
                            Delete
                        </button>
                    </p>
                </div>
        </div>
}

export default BookShow;