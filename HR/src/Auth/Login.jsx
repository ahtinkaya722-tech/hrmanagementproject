import {React,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import axios from "axios";
import {startToken} from "./auth";
const Login = ({setToken}) => {

    const navigate = useNavigate();
    const [formData,setFormData]=useState({
        email:"",
        password:""
    });
 const login = async () => {
    console.log("🔥 LOGIN FUNCTION CALLED");

    try {
        console.log("🔥 EMAIL =", formData.email);

        const res = await axios.post(
            "http://localhost:8080/api/auth/login",
            formData
        );

        console.log("🔥 RESPONSE =", res.data);

          
            
              if(res.data !=null){

               const result=  await Swal.fire({
                  icon: "success",
                  title: "Login Successful",
                  text: res.data.username,
                  confirmButtonText:"Continue",
                  draggable: true,
                });
                startToken(res.data.token);
                   localStorage.setItem(
                "token",
                res.data.token
            );
             localStorage.setItem(
                "user",
                JSON.stringify( res.data.user)
            );
            setToken(res.data.token);

            if(result.isConfirmed){
                navigate("/dashboard");
            }
            
              } 
             

         } catch(error) {
              console.log("========== LOGIN ERROR ==========");
    console.log("ERROR =", error);
    console.log("MESSAGE =", error.message);
    console.log("RESPONSE =", error.response);
    console.log("STATUS =", error.response?.status);
    console.log("DATA =", error.response?.data);
    console.log("=================================");

     
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid username or password",
        });

        }


    }
    const handleChange =(e)=>{
            setFormData({
                ...formData,
                [e.target.name]:e.target.value
            })
    }
  return (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
    
    {/* Header Section */}
    <div className="text-center">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        HR Portal Login
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Welcome back. Please enter your employee credentials.
      </p>
    </div>

    {/* Form Section */}
    <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); login(); }}>
      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="name@company.com"
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10" 
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10" 
          required
        />
      </div>

      <button
        type="submit"
        className="w-full mt-2 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Sign In to Dashboard
      </button>
    </form>
    
    {/* Footer Link */}
    <p className="mt-6 text-center text-sm text-slate-500">
      New team member?{' '}
      <span 
        className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200" 
        onClick={() => navigate("/signUp")}
      >
        Request an account
      </span>
    </p>

  </div>
</div>
  )
}

export default Login
