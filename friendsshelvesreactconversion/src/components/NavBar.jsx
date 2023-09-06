
function NavBar(){

    
    return(<div>
            <a class="nav-link" href="/books">All Books</a>
            <a class="nav-link" href="/books/mine">My Bookshelf</a>
            <a href="/login" class="nav-link">Login</a>
            <a href="/register" class="nav-link">Register</a>
            <a href="/logout" class="nav-link">Logout</a>         
    </div>)
        
}

export default NavBar;
