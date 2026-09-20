    import React from 'react'
    import "../css/Tasks.css";
    import { useState, useEffect } from 'react';
    import axios from 'axios';
import { LogIn } from 'lucide-react';
     import Swal from 'sweetalert2';
    
 

    const Task = () => {
          const token = localStorage.getItem("token");
         const [selectedMonth, setSelectedMonth] = useState("current");

    const months = [];

    for(let i =0;i < 12 ; i ++){
      const date = new Date();
      date.setMonth(date.getMonth()- i);
      months.push({
        value:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`,
        label: date.toLocaleString("default", {
        month: "long",
        year: "numeric",
        })


    }) };
        const user = JSON.parse(localStorage.getItem("user"));
        const [showModel, setModel] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
      const dayName= new Date().toLocaleString("en-Us",{
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"2-digit"
  })
   const clearForm = () => {
    setForm({
      title: "",
      dueDate: "",
      priority: "",
      desc: "",
    });
  };

    const [form, setForm] = useState({
    description: "",
    dueDate: "",
    timeRange: "",
    report_type:""

});
 const deleteTask = async (task) => {

    // Confirmation popup
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    });

    // Stop if user clicks Cancel
    if (!result.isConfirmed) {
        return;
    }

    try {

        // Delete task
        const res = await axios.delete(
            `http://localhost:8080/api3/deleteTasks/${task.taskId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Success message
        await Swal.fire({
            title: "Deleted!",
            text: res.data,
            icon: "success"
        });

        // Reload tasks
        await loadProjects();

    } catch (error) {

        console.error("Delete failed:", error);

        if (error.response?.status === 404) {

            Swal.fire({
                title: "Not Found!",
                text: error.response.data,
                icon: "warning"
            });

        } else if (error.response?.status === 401) {

            Swal.fire({
                title: "Unauthorized!",
                text: error.response?.data,
                icon: "warning"
            });
            
        
console.log(error.response?.data);

        } else if (error.response?.status === 403) {

            Swal.fire({
                title: "Forbidden!",
                text: "You don't have permission to delete this task.",
                icon: "warning"
            });

        } else {

            Swal.fire({
                title: "Error!",
                text: error.response?.data || "Failed to delete task.",
                icon: "error"
            });
        }
    }
};
 
const filteredTasks = tasks.filter((t)=>{
  console.log(t);
  
if(!t.dueDate){
  return false;
}

const taskDate= new Date(t.dueDate);
const now = new Date();

if(selectedMonth === "current"){
  console.log(taskDate.getFullYear()+"and "+now.getFullYear()+"and "+ taskDate.getMonth() +"and "+now.getMonth());
  
  return (taskDate.getFullYear() === now.getFullYear() && taskDate.getMonth()=== now.getMonth());
}

if(selectedMonth === "last"){
  const lastMonth = new Date(now.getFullYear(),now.getMonth()-1,1);

  return(taskDate.getFullYear() === lastMonth.getFullYear()&& taskDate.getMonth() === lastMonth.getMonth());
}
 
const [year, month] = selectedMonth.split("-");
  console.log(selectedMonth);
  
    return (
      taskDate.getFullYear() === Number(year) &&
      taskDate.getMonth() === Number(month) - 1
    );

})
     

const addTask = async () => {



    try {

        const newTask = {
            userId: user.userId,
            description: form.description,
            dueDate: form.dueDate,
            timeRange: form.timeRange,
            report_type:form.report_type
        };


        const res = await axios.post(
            "http://localhost:8080/api3/addTask",
            newTask,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

          
      Swal.fire({
         title: "Success",
         text:res.data,
          icon: "success",
        draggable: true
        });
  
        setTasks([
            ...tasks,
            res.data
        ]);

   
        setModel(false);

        
        loadProjects();
       
        setForm({
            description:"",
            dueDate:"",
            timeRange:""
        });


    } catch(error){
        if(error.response?.status === 409){ 
           Swal.fire({
                title: "Task Already Exists",
                text: error.response.data,
                icon: "warning",
                confirmButtonText: "OK"
            });}else if(error.response?.status === 500){
                Swal.fire({
                title: "Failed!",
                text: error.response.data,
                icon: "error",
                confirmButtonText: "OK"
            })}else{
               Swal.fire({
                title: "Error!",
                text: "Something went wrong. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
            }

   setModel(false);

    }

};
 const updateTask = async () => {
    if (!editTask) return;

    const updatedTask = {
      title: form.title,
      priority: form.priority,
      dueDate: form.dueDate,
      desc:form.desc
    };

    const current_Task = tasks.find((t)=> t.id === editTask );
      const final_Task = {...current_Task,...updatedTask};

    try {
      const res = await fetch(`http://localhost:7000/tasks/${editTask}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify(
       final_Task
    ),
      });

      if (!res.ok) { 
        throw new Error(`Failed to update task: ${res.status}`);
      }

      const savedTask = await res.json();
      
      // UI Update
      setTasks((prev)=> prev.map((task)=>task.id === editTask ? savedTask :task));


      setIsEditOpen(false);
      setEditTask(null);
      clearForm();


    } catch (error) {
      console.error("Update failed:", error);
    }
  };

const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    });
    console.log(   [e.target.name] , e.target.value);

};
    
    const openEdit = (task) => {

    setEditTask(task.id);

    setForm({
        description: task.description,
        dueDate: task.dueDate,
        timeRange: task.timeRange
    });

    setIsEditOpen(true);
};

  const loadProjects = async () => {  
        try {
            const res = await axios.get("http://localhost:8080/api/getTasksForUser",{
                headers:{
                   Authorization: `Bearer ${token}`,
                },
                params:{
                    userId:user.userId,
                }
            });
         
            if(!token){
                console.log("token is null");
                
            }  
            console.log(res.data);
            
            const data = res.data;
          
            
            setTasks(data);
  
            
            
            
        } catch (error) {
            console.error("Failed to load tasks:", error);
        }
        };
        useEffect(() => {
      

        loadProjects();
    }, []);

  return (
    <div className="tasks-page">
        <div className="flex items-center gap-3 mb-5">
  <label
    htmlFor="month"
    className="text-sm font-semibold text-gray-700 whitespace-nowrap"
  >
    Select Month
  </label>

  <div className="relative">
    <select
      id="month"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="
        appearance-none
        w-52
        px-4
        py-2.5
        pr-10
        text-sm
        font-medium
        text-gray-800
        bg-white
        border
        border-gray-300
        rounded-lg
        shadow-sm
        outline-none
        cursor-pointer
        transition
        duration-200
        hover:border-gray-400
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
      "
    >
      <option value="current">
        This Month
      </option>

      <option value="last">
        Last Month
      </option>

      <optgroup label="Months">
        {months.map((month,index) => (
          <option
              key={`${month.value}-${index}`}
            value={month.value}
          >
            {month.label}
          </option>
        ))}
      </optgroup>
    </select>

    {/* Dropdown arrow */}
    <span className="
      pointer-events-none
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      text-gray-500
      text-lg
    ">
      ▾
    </span>
  </div>
</div>
      <header className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Track your personal and team action items.</p>
        </div>

          <button className="add-task-btn" onClick={() => setModel(true)}>
          + Add Task
        </button>
 

       
      </header>

<div className="daily-schedule-container">
  {/* Repeat this section for each day (Monday, Tuesday, etc.) */}
  <div className="day-column">
    <h3 className="day-label"> {dayName} </h3>
    <div className="tasks-grid">
            {filteredTasks.map((task) => (
      <div key={task.taskId} className="task-square-box">
          <div className="square-header">
              <div
  className={`font-medium text-sm border px-2 py-1.5 rounded-lg ${
    task.report_type === "morning"
      ? "bg-green-50 text-green-400 border-green-200"
      : task.report_type === "night"
      ? "bg-red-50 text-red-400 border-red-200"
      : "bg-gray-50 text-gray-400 border-gray-200"
  }`}
>
  {task.report_type}
</div>
                
          <div className="priority-dot"></div>
          </div>
          
          <div className="square-content">
           <span className="task-title">
  {task.dueDate} : {task.timeRange}
</span>
           <p className="task-desc-short">
  {task.description?.split('\n').map((line,index)=>(
    <span key={index}>
      {line}
      <br/>
    </span>
  ))}
</p>
          </div>

          <div className="square-actions">
            <button onClick={() => openEdit(task)} className="icon-btn">✎</button>
            <button onClick={() => deleteTask(task)} className="icon-btn delete">✕</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
       {showModel && (
        <div className='model-overlay' onClick={() => setModel(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Add Task</h2>
    

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />

            <select
 name="timeRange"
 value={form.timeRange}
 onChange={handleChange}
>

<option value="">Select Time</option>
<option value="9 - 5">9 - 5</option>
<option value="1 - 5">1 - 5</option>

</select>


<select
 name="report_type"
 value={form.report_type}
 onChange={handleChange}
>

<option value="">Select Report Type</option>
<option value="morning">morning</option>
<option value="night">night</option>


</select>

        <textarea
 name="description"
 value={form.description}
 onChange={handleChange}
 placeholder="Add description"
/>

            <button onClick={addTask}>Create Task</button>
            <button onClick={() => setModel(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="edit-modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
            />

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">Morning</option>
              <option value="High">Night</option>
            
            </select>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          
<textarea 
  name="desc" 
  value={form.desc} 
  onChange={handleChange} 
  placeholder="Add a detailed description..."
  className="modal-textarea"
></textarea>

            <button onClick={updateTask}>Update</button>
            <button onClick={() => setIsEditOpen(false)}>Cancel</button>
          </div>
        </div>
      )} 
      
    </div>
  );
};


    export default Task
