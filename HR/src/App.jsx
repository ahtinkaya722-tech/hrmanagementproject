
import { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'
import MainLayout from './layout/MainLayout';
import { Routes, Route, Navigate } from "react-router-dom";
import { startToken } from './Auth/auth';
import AppRoutes from './Routes/AppRoutes';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
function App() {
  const [employees, setEmployees] = useState([]);
  const [token,setToken]=useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchEmployee = async () => {
         const token = localStorage.getItem("token");

        if (token) {
            startToken(token);
        }


      try {
        const res = await axios.get("http://localhost:8080/api/findAllEmployees",{

          headers:{ Authorization :`Bearer ${token}`}
        });
        setEmployees(res.data);

      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    }

    fetchEmployee();
  }, [])

  return (



    <>
      <Routes>

      {!token&& (<>
      
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login setToken={setToken} />} />  
      <Route path="/signup" element={<SignUp />} />
      
      </>)}

          {token && (
        <Route
          path="/*"
          element={
            <MainLayout>
              <AppRoutes employees={employees} />
            </MainLayout>
          }
        />
      )}

      </Routes>


       
    </>
  )
}

export default App
