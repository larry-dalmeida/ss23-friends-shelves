import { createContext, useState } from 'react';
import axios from 'axios';


const UserContext = createContext();

function Provider({ children }){

  //Register users that are registring 
  const [loggedInUser, setLoggedInUser] = useState([]);

   //Handle login and password validation
   const [showLogin, setShowLogin] = useState(true);
   const [loggedIn, setLoggedIn] = useState(false);

  // Esther to Alex: the session is now woking. With it on every request I can access the req.user object with the user _id username and email
  // you could check if there is a way for you to get the userdata you need for display or logic from the session or if its common that 
  // this info is sent from the BE and than, as we do it currently, saved to a State
  const handleLogin = async (username, password) => {
    const response = await axios.post('http://localhost:8080/login', { username, password }, { withCredentials: true });
    const user = response.data;
    userLoginSateChanges(user);
  };

  const userLoginSateChanges = (user) => {
    if (user) {
      setLoggedInUser(user);
      setLoggedIn(true);
      setShowLogin(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    const response = await axios.post('http://localhost:8080/register', { username, email, password }, { withCredentials: true })
    const user = response.data;
    // userLoginSateChanges(user) automatic login upon registering is broken, have to do bugfix;
  }

  // Logout function to set all States back to 0
  const handleLogout = async () => {
    const response = await axios.get('http://localhost:8080/logout', { withCredentials: true });
    setShowLogin(true);
    setLoggedIn(false);
    setLoggedInUser([]);
  };


  const valueToShare = {
    loggedIn,
    showLogin,
    loggedInUser,
    handleLogin,
    handleLogout,
    handleRegister,
    userLoginSateChanges,
    
}

    return <UserContext.Provider value={valueToShare}>
        { children }
    </UserContext.Provider>

}

export { Provider };
export default UserContext;