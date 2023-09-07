import bookImage from '../assets/images/book.png'
import bookShelves from '../assets/images/bookshelves.png'
import logout from '../assets/images/logout.png'


function NavBar(){

   
    
    return(<div class= "navBar">
            <img  id='logo' src = {bookImage} />
            <a className="nav-link" href="/books"> <img  className = 'linkImage' src = {bookShelves} /> All Books</a>
            <a className="nav-link" href="/books/mine"> <img  className = 'linkImage' src = {bookImage} /> My Bookshelf</a>
            <div className ='linkAndImage'><a href="/logout" className="nav-link"> <img  className = 'linkImage' src = {logout} /> Logout</a></div>         
    </div>)
        
}

export default NavBar;
