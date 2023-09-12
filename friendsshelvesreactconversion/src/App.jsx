import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import BookCreate from './components/BookCreate'
import BookList from './components/BookList'
import './App.css'
import BookSearch from './components/BookSearch';
import NavBar from './components/NavBar';
import LoginRegisterForm from './components/LoginRegister/LoginRegisterForm';


function App() {

  //start arrays for books in database and searchquery
  const [books, setBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState([]);
  const [showBooks, setShowBooks] = useState("mine");


  //Register users that are registring 
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState([]);

  //Fetching books from user
  //Esther: make a get request depending on showBooks is mine or not and get the books from DB then 
  // less trafic and the routes are already there: http://localhost:8080/books and  http://localhost:8080/books/mine
  const fetchBooks = async (showBooks) => {
    const response = await axios.get('http://localhost:3001/books');
    // const response = await axios.get('http://localhost:8080/books');
    console.log(response);
    setShowBooks(showBooks)

    if (showBooks === "mine") {
      const updatedBooks = response.data.filter((book) => {
        return book.owner._id === loggedInUser[0]._id;
      });
      setBooks(updatedBooks);
    }
    else {
      setBooks(response.data);
    }

  };

  const handleFetchBooks = (showBooks) => {

    fetchBooks(showBooks);

  };

  //Edit book by ID
  //Esther: put route is `http://localhost:8080/books/${id}`
  // I guess just sending the final state parameters of the form to the route should be sufficient to do the rest on the server side
  // afterwards I would go for a new db get request to http://localhost:8080/books to setBooks
  // thats things that don't need to be done by logic on the frontend I think - applies for further functions too
  const editBookById = async (id, newTitle, newAuthor, newISBN, newBlurb) => {

    const response = await axios.put(`http://localhost:3001/books/${id}`, {
      title: newTitle,
      author: newAuthor,
      isbn: newISBN,
      blurb: newBlurb
    });

    const updatedBooks = books.map((book) => {
      if (book._id === id) {
        return { ...book, ...response.data };
      }

      return book;
    });
    setBooks(updatedBooks);

  };

  //function for deleting books when delete button is pressed, delete book from array
  //Esther: delete route is `http://localhost:8080/books/${id}`
  const deleteBookById = async (id) => {

    await axios.delete(`http://localhost:3001/books/${id}`);

    const updatedBooks = books.filter((books) => {
      return books._id !== id;
    });
    setBooks(updatedBooks);
  }

  //function to map titles that adhere to search query coming from booklist>booksearch 
  const searchBook = (title) => {
    if (title && title.length > 1) {
      const searchBooksTitle = books.filter((books) => {
        return books.title.includes(title);
      });
      setSearchBooks(searchBooksTitle)
      if (searchBooksTitle.length == 0) {
        const searchBooksTitle = books.filter((books) => {
          return books.author.includes(title);
        });
        setSearchBooks(searchBooksTitle)

        if (searchBooksTitle.length == 0) {
          const searchBooksTitle = books.filter((books) => {
            return books.ISBN.includes(title);
          });
          setSearchBooks(searchBooksTitle)
        }
      }
    }
    else {
      setSearchBooks([])
    }

  }

  //function for adding books to array when books are created
  //Esther: post route is http://localhost:8080/books
  const createBook = async (title, author, ISBN, blurb, user) => {
    const response = await axios.post('http://localhost:3001/books', { title, author, ISBN, blurb, user });

    const updatedBooks = [
      ...books, response.data
    ];
    setBooks(updatedBooks);
  }

  //Handle login and password validation
  //Esther: On the backend there is a post route to http://localhost:8080/login where username and password should be sent to
  // the backend could then after sucessful authentification send back the needed userinfo + needed sessiondata, so that 
  // upon refreshing the user is not logged out
  // talking of Session data: there should be a function running in the beginning of every page refresh that checks if the user is
  // in an ongoing session and depdending on that he should get the user data from the server and show the content 
  // or ask for signup previous to showing the content
  const [showLogin, setShowLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    const searchUsers = users.filter((users) => {
      return users.username == username && users.password == password;
    });

    if (String(searchUsers[0].password) == String(password)) {
      setLoggedInUser(searchUsers);
      setLoggedIn(true);
      handleFetchBooks("mine");
    }
    if (loggedIn === true) {
      setShowLogin(false);
    }
  };

  //Esther: On the backend there is a post route to http://localhost:8080/register where username, email and password should be sent
  // as a response all necessary session detail should be sent back to the frontend
  const handleRegister = async (username, password, passwordConfirm) => {
    const response = await axios.post('http://localhost:3001/users', { username, password, passwordConfirm });

    const updatedUsers = [
      ...users, response.data
    ];
    setUsers(updatedUsers);

  }


  //Fetching users database
  //Esther: this should after the session part works not be necessary any more :D
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3001/users');

    const updatedUsers = response.data;
    setUsers(updatedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);




  let showPage = <div><NavBar /> <LoginRegisterForm onSubmit={handleLogin} onRegister={handleRegister} /></div>

  if (showLogin == false) {
    showPage =
      <div>
        <NavBar handleFetchBooks={handleFetchBooks} setShowLogin={setShowLogin} />
        <BookSearch onSearch={searchBook} />
        <BookCreate user={loggedInUser[0].username} onCreate={createBook} />
        <BookList books={books} searchBooks={searchBooks} onDelete={deleteBookById} onEdit={editBookById} onSearch={searchBook} user={loggedInUser} showBooks={showBooks} />
      </div>
  }

  return (showPage)

}

export default App
