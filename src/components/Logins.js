import Logo from '../assest/logo.png'
import { Link } from 'react-router-dom'
import React,{ useContext, useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Logins = () => {
  
    const [error,setError] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const {dispatch} = useContext(AuthContext)
  
    const handleLogin = (e) =>{
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          dispatch({type: "LOGIN", payload:user})
          navigate("/")
      })
      .catch((error) => {
          setError(true)
      });
    }
  
    return (
      <div className='w-full h-[100vh] bg-custom-background flex items-center justify-center'>
      <Link to="/">
       <div className=' absolute top-8 left-10'>
         <img src={Logo} className=" w-[150px]"/>
       </div>
      </Link>
        <div className='sign-container-gradient w-[420px]  min-h-[600px] pt-[60px] pr-[68px] pb-[40px] pl-[68px] roboto'>
             <h1 className=' text-4xl font-bold mb-9'>
                  Sign In
              </h1>
          <form  className=' flex flex-col w-full gap-y-11' onSubmit={handleLogin}>
              <input onChange={ (e) => setEmail(e.target.value)} className=' w-full px-[13px] py-[11px] text-[#8c8c8c]: placeholder:text-[#8c8c8c] bg-[#333333] text-[16px] h-[48px] rounded-[3px] placeholder:font-medium' type='email' placeholder='Enter email'/>
              <input onChange={ (e) => setPassword(e.target.value) } className=' w-full px-[13px] py-[11px] text-[#8c8c8c]: placeholder:text-[#8c8c8c] bg-[#333333] text-[16px] h-[48px] rounded-[3px] placeholder:font-medium' type='password' placeholder='Password'/>
              <button type='submit' className=' w-full text-center font-bold py-[11px] text-[#fff] bg-[#E50914] text-[16px] h-[48px] rounded-[3px]'>Sign In</button>
              {error ? <p className=' text-red-600 mt-1 text-center'>Wrong Email or Password</p> : null}
          </form>
           <div className=' mt-8'>
              <p className=' text-[#737373] text-[16px]'>New to Netflix?<Link to="/register" className=' text-white font-bold ml-1 mr-[1px] hover:underline hover:decoration-1 text-[16px]'>Sign up now</Link>.</p>
           </div>
        </div>
  
      </div>
    )
}

export default Logins