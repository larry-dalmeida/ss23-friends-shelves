import { useEffect, useContext } from 'react';
import BookCreate from './components/BookCreate'
import BookList from './components/BookList'
import './App.css'
import BookSearch from './components/BookSearch';
import NavBar from './components/Navigation/NavBar';
import LoginRegisterForm from './components/LoginRegister/LoginRegisterForm';
import BooksContext from './context/books';
import UserContext from './context/user';
import NavigationContext from './context/navigation';



function App() {
  
  const { handleFetchBooks, setBooks } = useContext(BooksContext);
  const { loggedIn, showLogin, handleLogout } = useContext(UserContext);
  const { currentPath, navigate } = useContext(NavigationContext);
    
  useEffect(() => {
    if (loggedIn === true) {
      handleFetchBooks("mine");
    }
  }, [loggedIn])

  useEffect(() => {
    if(currentPath === "/allbooks"){
      handleFetchBooks("");
    } 
    else if(currentPath === "/mybooks"){
      handleFetchBooks("mine");
    }
    else if(currentPath === "/logout"){
      handleLogout();
      setBooks([]);
      navigate("/");
    }
  }, [currentPath]);
  
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
