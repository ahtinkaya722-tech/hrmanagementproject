import  {React,useState} from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [form, setForm] = useState({
    username:"",
    password:""
  })
    const navigate = useNavigate();

    const login = ()=>{

        localStorage.setItem("token","123");
       window.location.href = "/";

    }
    const handleLogin = async()=>{

    }

  return (
    <div className='flex justify-center flex-col'>
       <h1 className='font-bold text-3xl text-red-300'>   
        Welcome Back
        </h1> 
        <br />
        <form onSubmit={handleLogin} clasName="bg-black">

        <div className=" flex  gap-2 justify-center items-center w-full max-w-md  p-8 rounded-xl shadow-lg ">
            <label htmlFor="username" className=" text-sm font-medium text-gray-700">   Username </label>           
         
            <input
                type="text"
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />



     

      
            <label htmlFor="username" className=" text-sm font-medium text-gray-700">   password </label>           
         
            <input
                type="text"
                id="username"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />

       <button className='px-2 py-3 border rounded-lg bg-blue-300 hover:bg-blue-600 transition-all text-white' type='submit' disabled= {loading}>Submit</button>

        </div>


   
        </form>
      

       
        <p className='font-medium text-sm transiton-all duration-200'>Log In <span className='text-blue-400 text-sm font-medium cursor-pointer hover:text-blue-500 duration-200 ' onClick={ ()=> navigate("/login")}>Log In Account</span></p>
    </div>
  )
}

export default SignUp
