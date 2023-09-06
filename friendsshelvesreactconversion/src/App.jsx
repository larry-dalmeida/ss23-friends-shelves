import { useState } from 'react'
import BookCreate from './components/BookCreate'
import BookList from './components/BookList'
import './App.css'
import BookSearch from './components/BookSearch';
import NavBar from './components/NavBar';

function App() {
  const [books, setBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState([]);

    const editBookById = (id, newTitle, newAuthor, newISBN, newBlurb) => {

        const updatedBooks = books.map((book) =>{
            if(book.id === id){
                return {...book, title:newTitle, author:newAuthor, ISBN: newISBN, blurb: newBlurb};
            }

            return book;
        });
        setBooks(updatedBooks);

    };

    const deleteBookById = (id) =>{
        const updatedBooks = books.filter((books) => {
            return books.id !== id;
        });
        setBooks(updatedBooks);
    }

    const searchBook = (title, author, ISBN) =>{
      if(title && title.length > 1){
        const searchBooksTitle = books.filter((books) => {
          return books.title.includes(title);
        });
        setSearchBooks(searchBooksTitle)
      }
      else if(author && author.length > 1){
        const searchBooksTitle = books.filter((books) => {
          return books.author.includes(author);
        });
        setSearchBooks(searchBooksTitle)
      }
      else if(ISBN && ISBN.length > 1){
        const searchBooksTitle = books.filter((books) => {
          return books.ISBN.includes(ISBN);
        });
        setSearchBooks(searchBooksTitle)
      }
      else{
        setSearchBooks([])
      }
      
    }

    const createBook = (title, author, ISBN, blurb) =>{
        const updatedBooks = [
            ...books, {
                id: Math.round(Math.random()*9999), 
                title: title,
                author: author,
                ISBN: ISBN,
                blurb: blurb
            }
        ];
        setBooks(updatedBooks);
    };

    return (
        <div>
            <NavBar />
            <BookSearch onSearch={searchBook} />
            <BookCreate onCreate={createBook} /> 
            <BookList books={books} searchBooks = {searchBooks} onDelete={deleteBookById} onEdit={editBookById} onSearch={searchBook}/>
        </div>)
}

export default App
