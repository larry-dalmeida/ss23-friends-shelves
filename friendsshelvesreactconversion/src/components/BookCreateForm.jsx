import { useState } from 'react';


function BookCreateForm({onSubmit}){

    const [formData, setFormData] = useState({title: "", author: "", ISBN: "", blurb: ""})

    const handleChange = (event) => {
        const changedField = event.target.name;
        const newValue = event.target.value;
        setFormData(currData => {
            currData[changedField] = newValue;
            return{...currData};
        })

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData.title, formData.author, formData.ISBN, formData.blurb);
    };

    

    return (<div>
        <h2>Add a Book</h2>
          <form onSubmit = {handleSubmit}>
            <p>
                <label>Title </label>
                <input 
                type = "text"
                placeholder = "title" 
                className="input" 
                value = {formData.title} 
                onChange = {handleChange}
                name = "title"
                id="title"
                />
            </p>
            <p>
                <label>Author </label>
                <input
                type = "text"
                placeholder = "author" 
                className="input" 
                value = {formData.author} 
                onChange = {handleChange}
                name = "author"
                id="author"
                />
            </p>
                <p>
                <label>ISBN </label>
                <input 
                type = "text"
                placeholder = "ISBN" 
                className="input" 
                value = {formData.ISBN} 
                onChange = {handleChange}
                name = "ISBN"
                id="ISBN"
                />
            </p>
            <button onClick={handleSubmit} className="button">Create!</button>
        </form>
      </div>
    )
}

export default BookCreateForm;