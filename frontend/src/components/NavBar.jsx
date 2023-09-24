import { useContext } from 'react';
import bookImage from '../assets/images/book.png';
import bookShelves from '../assets/images/bookshelves.png';
import logout from '../assets/images/logout.png';
import BooksContext from '../context/books';
import UserContext from '../context/user';


function NavBar() {

        const { handleFetchBooks, setBooks } = useContext(BooksContext);
        const { loggedIn, handleLogout } = useContext(UserContext);


        const handleShowAllBooks = () => {
                handleFetchBooks("all");  // all is not used in the fetchBook function 
        };

        const handleShowMyBooks = () => {
                handleFetchBooks("mine");
        };

        let NavBarIcons = <div><a className="nav-link" onClick={handleShowAllBooks}> <img className='linkImage' src={bookShelves} /> All Books</a>
        <a className="nav-link" onClick={handleShowMyBooks}> <img className='linkImage' src={bookImage} /> My Bookshelf</a>
        <a className="nav-link" onClick={() => {handleLogout(); setBooks([]);}}> <img className='linkImage' src={logout} /> Logout</a></div>;
       if(loggedIn == false){
        NavBarIcons = "";
       }

        //Show navbar 
        return (<div className="navBar">
                <img id='logo' src={bookImage} />
                {NavBarIcons}
        </div>)

}

export default NavBar;
