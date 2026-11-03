import React, { useContext, useState } from 'react'
import './Login.css'
import axios from 'axios';
import { StoreGive } from '../../context/StoreGive';
const Login = ({setLoginpop}) => {
   
    const [currentshow, setCurrentshow] = useState("SignIn");
 const {setToken} = useContext(StoreGive)
    const [data,setData] = useState({
        name:"",
        email:"",
        password:""
    })
    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

  const onSubmitHandler = async (event) =>{
       event.preventDefault();
       const url = "http://localhost:4000";
          let newUrl = url;
       if (currentshow==="Login") {
           newUrl += "/api/user/login"
       }
       else{
           newUrl += "/api/user/register"
     }  
        
      const response = await axios.post(newUrl,data)
  
        
      if (response.data.success) {
        
  setData({
    name:"",
   email:"",
   password:""
})
setLoginpop(false)
 setToken(response.data.token);
  localStorage.setItem("token",response.data.token);

        
      }
     else{      
      alert(response.data.message)      
       }
      }
    return (
        <div className='Login'>
            <form onSubmit={onSubmitHandler} className="login-container">
                <div className="login-pop-head">
                    <h2>{currentshow}</h2>
                    <h1 onClick={() => setLoginpop(false)}>X</h1>
                </div>
                <div className="login-pop-input">
                   {
                    currentshow==="Login"?<></>: <input type="text" placeholder='Enter Your Name' value={data.name} name='name' onChange={onChangeHandler}  required />
                   }
                    <input type="email"  value={data.email} name='email' onChange={onChangeHandler}   placeholder='Enter Your Email' required />
                    <input type="password"  value={data.password} name='password' onChange={onChangeHandler} placeholder='Enter Your Password' required />
                </div>
                <button className='btnsubmit' type='submit'>{currentshow === "SignIn" ? "Create Account" : "Login"}</button>
                {
                    currentshow === "Login" ? <p>Create a new account? <span onClick={() => setCurrentshow("SignIn")}>Click here</span></p> :
                        <p>Already have an account?  <span onClick={() => setCurrentshow("Login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default Login