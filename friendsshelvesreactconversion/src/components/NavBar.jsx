import { useState } from 'react';
import bookImage from '../assets/images/book.png';
import bookShelves from '../assets/images/bookshelves.png';
import logout from '../assets/images/logout.png';
import axios from 'axios';

// Esther to Alex: I guess its on your list to not show the nav bar items when someone is 
function NavBar({ handleFetchBooks, handleLogout }) {


        const handleShowAllBooks = () => {
                handleFetchBooks("all");  // all is not used in the fetchBook function 
        };

        const handleShowMyBooks = () => {
                handleFetchBooks("mine");
        };

        // Esther to Alex: can this logic be moved to the App.jsx / some middleware file, that holds all the functions? 
        // then we don't need axios in this one any more
        const clickLogout = async () => {
                handleLogout();
        };

        //Show navbar 
        return (<div className="navBar">
                <img id='logo' src={bookImage} />
                <a className="nav-link" onClick={handleShowAllBooks}> <img className='linkImage' src={bookShelves} /> All Books</a>
                <a className="nav-link" onClick={handleShowMyBooks}> <img className='linkImage' src={bookImage} /> My Bookshelf</a>
                <a className="nav-link" onClick={clickLogout}> <img className='linkImage' src={logout} /> Logout</a>
        </div>)

}

export default NavBar;
