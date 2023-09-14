import { useState } from 'react'
import Logo from '../assest/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

// import { BiSolidFileImage } from 'react-icons/bi'

const Register = () => {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const navigate = useNavigate()

  const handleSignUp = (e) =>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
        navigate("/login")
      })
      .catch((error) => {
        console.log(error)
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
               Sign Up
           </h1>
       <form onSubmit={handleSignUp}  className=' flex flex-col w-full gap-y-11'>
           {/* <label for="file" className=' flex items-center w-full px-[13px] cursor-pointer py-[11px] text-[#8c8c8c] bg-[#333333] text-[16px] h-[48px] rounded-[3px]'><BiSolidFileImage  className=' text-lg mr-2 text-[#e50914]'/> Select Image</label>
           <input type='file' id='file' className=' hidden'/> */}
           <input onChange={ (e) => setEmail(e.target.value) } className=' w-full px-[13px] py-[11px] text-[#8c8c8c]: placeholder:text-[#8c8c8c] bg-[#333333] text-[16px] h-[48px] rounded-[3px] placeholder:font-medium' type='email' placeholder='Enter email'/>
           <input  onChange={ (e) => setPassword(e.target.value) } className=' w-full px-[13px] py-[11px] text-[#8c8c8c]: placeholder:text-[#8c8c8c] bg-[#333333] text-[16px] h-[48px] rounded-[3px] placeholder:font-medium' type='password' placeholder='Password'/>
           <button type='submit' className=' w-full text-center font-bold py-[11px] text-[#fff] bg-[#E50914] text-[16px] h-[48px] rounded-[3px]'>Sign Up</button>
       </form>
        <div className=' mt-9'>
           <p className=' text-[#737373] text-[16px]'>Have an account?<Link to="/login" className=' text-white font-bold ml-1 mr-[1px] hover:underline hover:decoration-1 text-[16px]'>Sign In now</Link>.</p>
        </div>
     </div>

   </div>
   )
}

export default Register