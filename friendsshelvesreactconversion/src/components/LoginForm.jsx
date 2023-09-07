import { useState } from 'react';


function LoginForm({onSubmit, onRegister}){

    //Handle the data from the login form

    const [formData, setFormData] = useState({username: "", password: ""})

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
        onSubmit(formData.username, formData.password);
    };


     //Handle the data from the register form

     const [registerFormData, setRegisterFormData] = useState({username: "", password: "", passwordConfirm: ""})

     const handleRegisterChange = (event) => {
         const changedField = event.target.name;
         const newValue = event.target.value;
         setRegisterFormData(currData => {
             currData[changedField] = newValue;
             return{...currData};
         })
 
     }
 
     const handleRegisterSubmit = (event) => {
        event.preventDefault();
        onRegister(registerFormData.username, registerFormData.password, registerFormData.passwordConfirm);
        setShowRegister(false);   
     };


    //Handle showing the register form

    const [showRegister, setShowRegister] = useState(false);

    const handleShowRegister = (event) => {
        event.preventDefault();
        setShowRegister(true);
    }


    //Show either the login or register form
    let showRegisterOrLogin = (
    <div>
        <h2>Login</h2>
            <form onSubmit = {handleSubmit}>
                <p>
                    <label>Username </label>
                    <input 
                    type = "text"
                    placeholder = "Username" 
                    className="input" 
                    value = {formData.username} 
                    onChange = {handleChange}
                    name = "username"
                    id="username"
                    />
                </p>
                <p>
                    <label>Password </label>
                    <input
                    type = "password"
                    placeholder = "Password" 
                    className="input" 
                    value = {formData.password} 
                    onChange = {handleChange}
                    name = "password"
                    id="password"
                    />
                </p>
                <button onClick={handleSubmit} className="button">Login</button>
            </form>
        <div onClick ={handleShowRegister} id="registerFormLink">I don't have an account yet</div>
    </div>)

    if(showRegister === true){
        showRegisterOrLogin = 
            <div>
                <h3>Register Form</h3>
                <form onRegister = {handleRegisterSubmit}>
                    <p>
                        <label>Username </label>
                        <input 
                        type = "text"
                        placeholder = "Username" 
                        className="input" 
                        value = {registerFormData.username} 
                        onChange = {handleRegisterChange}
                        name = "username"
                        id="username"
                        />
                    </p>
                    <p>
                        <label>Password </label>
                        <input
                        type = "password"
                        placeholder = "Password" 
                        className="input" 
                        value = {registerFormData.password} 
                        onChange = {handleRegisterChange}
                        name = "password"
                        id="password"
                        />
                    </p>
                    <p>
                        <label>Confirm Password </label>
                        <input
                        type = "password"
                        placeholder = "Confirm Password" 
                        className="input" 
                        value = {registerFormData.passwordConfirm} 
                        onChange = {handleRegisterChange}
                        name = "passwordConfirm"
                        id="passwordConfirm"
                        />
                    </p>
                    <button onClick={handleRegisterSubmit} className="button">Register</button>
                    </form>
                    </div>
        }
    

    return (showRegisterOrLogin)
}

export default LoginForm;