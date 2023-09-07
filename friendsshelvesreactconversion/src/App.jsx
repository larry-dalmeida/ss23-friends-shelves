import { useState } from 'react'
import BookCreate from './components/BookCreate'
import BookList from './components/BookList'
import './App.css'
import BookSearch from './components/BookSearch';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';

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

    const searchBook = (title) =>{
      if(title && title.length > 1){
        const searchBooksTitle = books.filter((books) => {
          return books.title.includes(title);
        });
        setSearchBooks(searchBooksTitle)
        if(searchBooksTitle.length == 0){
          const searchBooksTitle = books.filter((books) => {
            return books.author.includes(title);
          });
          setSearchBooks(searchBooksTitle)
        
          if(searchBooksTitle.length == 0){
            const searchBooksTitle = books.filter((books) => {
              return books.ISBN.includes(title);
            });
            setSearchBooks(searchBooksTitle)
          }
        }
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

    //Handle login and password validation
    const[showLogin, setShowLogin] = useState(true);
    const[loggedIn, setLoggedIn] = useState(false);

    const handleLogin = (username, password) => {
      const searchUsers = users.filter((users) => {
        return users.username.includes(username);
      });

      if(String(searchUsers[0].password) == String(password)){
        setLoggedIn(true);
          }  
      if(loggedIn === true){
        setShowLogin(false);
      }
    };

    //Register users that are registring 
    const [users, setUsers] = useState([]);

    const handleRegister = (username, password, passwordConfirm) => {
        const updatedUsers = [
          ...users, {
            username: username,
            password: password,
            passwordConfirm: passwordConfirm
          }
        ];
        setUsers(updatedUsers);
        
    }


    let showPage = <div><NavBar /> <LoginForm onSubmit={handleLogin} onRegister={handleRegister}/></div>

    if(showLogin == false){
      showPage = 
      <div>
        <NavBar /> 
        <BookSearch onSearch={searchBook} />
        <BookCreate onCreate={createBook} /> 
        <BookList books={books} searchBooks = {searchBooks} onDelete={deleteBookById} onEdit={editBookById} onSearch={searchBook}/>
    </div>
    }

    return (showPage)
        
}

export default App
