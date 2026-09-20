import React,{ forwardRef } from 'react'
import { IoMdAdd } from "react-icons/io";      // Correct folder for IoMdAdd
import { MdDeleteForever } from "react-icons/md";

const CRUD = forwardRef(({buttonAdd,buttonDelete},ref) => {
  return (
    <>
    <div ref={ref} className='mx-2 w-fit p-3 bg-white border-b border-gray-950 rounded-xl shadow-sm flex items-center gap-3 transition-all'> 

     <button onClick={buttonAdd} className='flex items-center gap-3 p-3 font-medium hover:bg-blue-300 transition-all text-sm rounded-xl'> <IoMdAdd />Add</button>
    <button onClick={buttonDelete} className='flex items-center gap-3 p-3 font-medium hover:bg-red-300 transition-all text-sm rounded-xl '> <MdDeleteForever />Delete</button>
    
    </div>
   
  
    </>
  )
});

export default CRUD
