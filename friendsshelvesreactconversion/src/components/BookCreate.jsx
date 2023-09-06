import { useState } from 'react';
import BookCreateForm from './BookCreateForm';


function BookCreate({onCreate}){

  
    const handleSubmit = (title, author, ISBN, blurb) => {
        onCreate(title, author, ISBN, blurb); 
        setShowForm(false);

    };

    const[showForm, setShowForm] = useState(false);

    const handleShow = () => {
      setShowForm(!showForm);
    }

    let content = <div><button className="buttonBookCreate" onClick={handleShow}> Add a Book </button></div>

    if (showForm){
        content = <BookCreateForm onSubmit={handleSubmit}/>;
    }   
  
    return (<div>
        {content}
      </div>
    )
}

export default BookCreate;