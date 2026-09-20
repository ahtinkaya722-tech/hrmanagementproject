import React from 'react'
import { Outlet } from "react-router-dom";
import DepartmentTabs from '../components/DepartmentTabs';
const Department = () => {
  return (
    <div className='ml-5'>
       <div className="mb-2 animate-slide-up">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Department Management</h1>
                <p className="text-lg text-gray-500 mt-2 font-medium">
                   Manage all company departments, assign roles, and organize employee structure efficiently.
                </p>
         </div>


          <DepartmentTabs/>
          <main className='ml-3'>
          <Outlet />
       
          </main>


    </div>
  )
}

export default Department
