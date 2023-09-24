import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider as BooksProvider } from './context/books';
import { Provider as UserProvider } from './context/user';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <BooksProvider>
      <React.StrictMode>
        <App />    
      </React.StrictMode>
    </BooksProvider>
  </UserProvider>,
)
