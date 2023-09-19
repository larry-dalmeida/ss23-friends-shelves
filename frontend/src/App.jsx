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
  const handleFetchBooks = async (showIdentifier) => {
    setShowBooks(showIdentifier);
    try {
      const response = await axios.get(`http://localhost:8080/books/${showIdentifier === 'mine' ? 'mine' : ''}`, { withCredentials: true });
      setBooks(response.data);
    } catch (e) {
      console.log(e)
    };
  };


  //Edit book by ID
  const editBookById = async (id, newTitle, newAuthor, newISBN, newBlurb) => {
    try {
      const input = {
        book: {
          title: newTitle,
          author: newAuthor,
          image: "https://tse1.explicit.bing.net/th?id=OIP.TF-ZDchnQgWskBRH8ZNu1gHaI6&pid=Api",
          isbn: newISBN,
          blurb: newBlurb
        }
      };
      const response = await axios.put(`http://localhost:8080/books/${id}`, input, { withCredentials: true });

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

  //function on clicking Add a Book
  const createBook = async (title, author, isbn, blurb) => {
    try {
      const input = {
        book: { title, author, image: "https://tse1.explicit.bing.net/th?id=OIP.TF-ZDchnQgWskBRH8ZNu1gHaI6&pid=Api", isbn, blurb }
      };
      const response = await axios.post('http://localhost:8080/books', input, { withCredentials: true });

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

  //function on Clicking Delete a Book
  const deleteBookById = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/books/${id}`, { withCredentials: true });

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
      handleFetchBooks("mine");
    }
  }, [loggedIn])

  // Esther to Alex: the session is now woking. With it on every request I can access the req.user object with the user _id username and email
  // you could check if there is a way for you to get the userdata you need for display or logic from the session or if its common that 
  // this info is sent from the BE and than, as we do it currently, saved to a State
  const handleLogin = async (username, password) => {
    const response = await axios.post('http://localhost:8080/login', { username, password }, { withCredentials: true });
    const user = response.data;
    userLoginSateChanges(user);
  };

  const handleRegister = async (username, email, password) => {
    const response = await axios.post('http://localhost:8080/register', { username, email, password }, { withCredentials: true })
    const user = response.data;
    userLoginSateChanges(user);
  }

  // Logout function to set all States back to 0
  const handleLogout = async () => {
    const response = await axios.get('http://localhost:8080/logout', { withCredentials: true });
    // console.log(response);
    setShowLogin(true);
    setLoggedIn(false);
    setLoggedInUser([]);
    setBooks([]);
  }

  let showPage = <div><NavBar /> <LoginRegisterForm onSubmit={handleLogin} onRegister={handleRegister} /></div>

  if (showLogin == false) {
    showPage =
      <div>
        <NavBar handleFetchBooks={handleFetchBooks} handleLogout={handleLogout} />
        <BookSearch onSearch={searchBook} />
        <BookCreate onCreate={createBook} />
        <BookList books={books} searchBooks={searchBooks} onDelete={deleteBookById} onEdit={editBookById} onSearch={searchBook} user={loggedInUser} showBooks={showBooks} />
      </div>
  }

  return (showPage)

}

export default App
