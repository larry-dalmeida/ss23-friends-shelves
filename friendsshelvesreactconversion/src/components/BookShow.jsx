import BookEdit from './BookEdit';
import {useState} from 'react';



function BookShow({book, onDelete, onEdit}){

    const[showEdit, setShowEdit] = useState(false);

    const handleDeleteClick = () =>{
        onDelete(book.id);
    }

    const handleEditClick = () => {
            setShowEdit(!showEdit);
    };

    const handleSubmit = (id, newTitle, newAuthor, newISBN, newImage, newBlurb) => {

        onEdit(id, newTitle, newAuthor, newISBN, newImage, newBlurb);
        setShowEdit(false);
    }

    let content = <div><p>{book.title}</p>{book.author}<p>{book.ISBN}</p>{book.blurb}</div>
    ; 

    if (showEdit){
        content = <BookEdit onSubmit={handleSubmit} book={book}/>;
    }

    let bookImage = 'https://covers.openlibrary.org/b/isbn/'.concat(book.ISBN,'-M.jpg');
    
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