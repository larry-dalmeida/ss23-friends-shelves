import { useEffect, useContext } from 'react';
import BookCreate from './components/BookCreate'
import BookList from './components/BookList'
import './App.css'
import BookSearch from './components/BookSearch';
import NavBar from './components/NavBar';
import LoginRegisterForm from './components/LoginRegister/LoginRegisterForm';
import BooksContext from './context/books';
import UserContext from './context/user';



function App() {
  
  const { handleFetchBooks } = useContext(BooksContext);
  const { loggedIn, showLogin } = useContext(UserContext);
    
  useEffect(() => {
    if (loggedIn === true) {
      handleFetchBooks("mine");
    }
  }, [loggedIn])


  let showPage = <div><NavBar /> <LoginRegisterForm /></div>

  if (showLogin == false) {
    showPage =
      <div>
        <NavBar />
        <BookSearch />
        <BookCreate />
        <BookList />
      </div>
  }

  return (showPage)

}

export default App
