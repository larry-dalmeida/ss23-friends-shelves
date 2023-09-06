import {useState} from 'react';


function BookEdit({book, onSubmit}){

    const[title, setTitle] = useState(book.title);
    const[author, setAuthor] = useState(book.author);
    const[isbn, setISBN] = useState(book.ISBN);
    const[blurb, setBlurb] = useState(book.blurb);

    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };

    
    const handleChangeAuthor = (event) => {
        setAuthor(event.target.value);
    };

    
    const handleChangeISBN = (event) => {
        setISBN(event.target.value);
    };

    const handleChangeBlurb = (event) => {
        setBlurb(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(book.id, title, author, isbn, blurb);

    };

    return <form onSubmit ={handleSubmit} className = "book-edit">
        <p>
        <label>Title</label>
        <input className="input" value={title} onChange={handleChangeTitle}/>
        </p>
        <p>
        <label>Author</label>
        <input className="input" value={author} onChange={handleChangeAuthor}/>
        </p>
        <p>
        <label>ISBN</label>
        <input className="input" value={isbn} onChange={handleChangeISBN}/>
        </p>
        <p>
        <label>Blurb</label>
        <input className="input" value={blurb} onChange={handleChangeBlurb}/>
        </p>
        <button className="button is-primary">
            Save
        </button>
    </form>
}

export default BookEdit;