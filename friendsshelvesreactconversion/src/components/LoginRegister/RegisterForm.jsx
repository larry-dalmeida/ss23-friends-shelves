import {useState} from 'react'; 


function RegisterForm ({onRegister, setShowRegister}) {

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
       console.log(registerFormData.password)
    };

    //Register form

    return (<div>
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
            </div>)

}

export default RegisterForm;  