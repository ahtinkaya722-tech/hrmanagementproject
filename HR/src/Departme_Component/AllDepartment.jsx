import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Chart } from "react-google-charts";
import DepartmentsNetSalaryPieChart from '../components/DepartmentsNetSalaryPieChart';

const AllDepartment = () => {
 

  return (
    <div>


      <div className='grid grid-cols-3 gap-6 bg-gray-50 hover:shadow-inner transition-all p-4 rounded-lg  animate-slide-up'>
        <div className="grid col-span-3">
            <DepartmentsNetSalaryPieChart/>
          
            </div>
         

      </div>
   </div>
   
  )
}

export default AllDepartment
