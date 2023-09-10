import { useState } from 'react';
import BookCreateForm from './BookCreateForm';


function BookCreate({user, onCreate}){

    //Handle submit from the bookcreate form
    const handleSubmit = (title, author, ISBN, blurb) => {
        onCreate(title, author, ISBN, blurb, user); 
        setShowForm(false);

    };

    //Handle showing the bookcreateform when button is pressed
    const[showForm, setShowForm] = useState(false);

    const handleShow = () => {
      setShowForm(!showForm);
    }

    //Show button for the book creation form, when form is closed
    let content = <div><button className="buttonBookCreate" onClick={handleShow}> Add a Book </button></div>

    //if statement to call on bookcreateform
    if (showForm){
        content = <BookCreateForm onSubmit={handleSubmit}/>;
    }   
  
    return (<div>
        {content}
      </div>
    )
}

export default BookCreate;