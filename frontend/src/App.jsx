import { useState, useEffect } from 'react';
import axios from 'axios';
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
  // const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState([]);

  //Fetching books from user
  const fetchBooksMine = async (loggedInUser) => {
    try {
      const response = await axios.post('http://localhost:8080/books/mine', loggedInUser);
      setBooks(response.data);
    } catch (e) {
      console.log(e)
    };
  };
  const fetchBooksAll = async () => {
    try {
      const response = await axios.get('http://localhost:8080/books');
      setBooks(response.data);
    } catch (e) {
      console.log(e)
    };
  };


  const handleFetchBooks = (showIdentifier, loggedInUser) => {
    setShowBooks(showIdentifier);

    if (showIdentifier === "mine") {
      fetchBooksMine(loggedInUser);
    }
    if (showIdentifier === "all") {
      fetchBooksAll();
    }

  };


  //Edit book by ID
  const editBookById = async (id, newTitle, newAuthor, newISBN, newBlurb, user) => {
    try {
      const owner = user[0]._id;
      const input = {
        book: {
          title: newTitle,
          author: newAuthor,
          image: "https://tse1.explicit.bing.net/th?id=OIP.TF-ZDchnQgWskBRH8ZNu1gHaI6&pid=Api",
          isbn: newISBN,
          blurb: newBlurb
        },
        owner
      };
      const response = await axios.put(`http://localhost:8080/books/${id}`, input);

      // Esther to Alex: better get new axios request form db/ fetch books (mine/all) depending on where the user currently is
      // current bug: the old version of the book is still in state and won't change
      const updatedBooks = books.map((book) => {
        if (book._id === id) {
          return { ...response.data };
        }
        return book;
      });
      setBooks(updatedBooks);

    } catch (e) {
      console.log(e)
    };
  };


  //function for deleting books when delete button is pressed, delete book from array
  //Esther: delete route is `http://localhost:8080/books/${id}`
  const deleteBookById = async (id, userId) => {
    try {
      // Esther: with session userId should be sent through to toggle on isOwner in book routes
      // console.log(userId);
      await axios.delete(`http://localhost:8080/books/${id}`);

      // Esther to Alex: better get new axios request form db/ fetch books (mine/all) depending on where the user currently is
      const updatedBooks = books.filter((books) => {
        return books._id !== id;
      });
      setBooks(updatedBooks);
    } catch (e) {
      console.log(e)
    };
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
  const createBook = async (title, author, isbn, blurb, user) => {
    try {
      const owner = user[0]._id;
      const input = {
        book: { title, author, image: "https://tse1.explicit.bing.net/th?id=OIP.TF-ZDchnQgWskBRH8ZNu1gHaI6&pid=Api", isbn, blurb },
        owner
      };
      const response = await axios.post('http://localhost:8080/books',
        input);

      // Esther to Alex: better get new axios request form db/ fetch books (mine/all) depending on where the user currently is
      // this should also get rid of the bug, that the buttons don't show right away
      const updatedBooks = [
        ...books, response.data
      ];
      setBooks(updatedBooks);
    } catch (e) {
      console.log(e)
    };
  }

  //Handle login and password validation
  const [showLogin, setShowLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const userLoginSateChanges = (user) => {
    if (user) {
      setLoggedInUser(user);
      setLoggedIn(true);
      setShowLogin(false);
    }
  };
  useEffect(() => {
    if (loggedIn === true) {
      handleFetchBooks("mine", loggedInUser);
    }
  }, [loggedIn])

  //Esther:  to be done: send not only user data, but session cookie
  // Esther to Alex: talking of Session data: there should be a function running in the beginning of every page refresh that checks if the user is
  // in an ongoing session and depdending on that he should get the user data from the server and show the content 
  // or ask for signup previous to showing the content
  const handleLogin = async (username, password) => {
    const response = await axios.post('http://localhost:8080/login', { username, password });
    const user = response.data;
    userLoginSateChanges(user);
  };

  //Esther: to be done: send not only user data, but session cookie
  const handleRegister = async (username, email, password) => {
    const response = await axios.post('http://localhost:8080/register', { username, email, password })
    const user = response.data;
    userLoginSateChanges(user);
  }

  // Logout function to set all States back to 0
  const handleLogout = async () => {
    const response = await axios.get('http://localhost:8080/logout');
    // console.log(response.data);
    setShowLogin(true);
    setLoggedIn(false);
    setLoggedInUser([]);
    setBooks([]);
  }

  let showPage = <div><NavBar /> <LoginRegisterForm onSubmit={handleLogin} onRegister={handleRegister} /></div>

  if (showLogin == false) {
    showPage =
      <div>
        <NavBar loggedInUser={loggedInUser} handleFetchBooks={handleFetchBooks} handleLogout={handleLogout} />
        <BookSearch onSearch={searchBook} />
        <BookCreate user={loggedInUser} onCreate={createBook} />
        <BookList books={books} searchBooks={searchBooks} onDelete={deleteBookById} onEdit={editBookById} onSearch={searchBook} user={loggedInUser} showBooks={showBooks} />
      </div>
  }

  return (showPage)

}

export default App
