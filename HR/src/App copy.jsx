
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
  

  useEffect(() => {

  }, [])

  return (



    <>
      <Routes>

  
        <Route
          path="/*"
          element={
            <MainLayout>
              <AppRoutes employees={employees} />
            </MainLayout>
          }
        />
      

      </Routes>


       
    </>
  )
}

export default App
