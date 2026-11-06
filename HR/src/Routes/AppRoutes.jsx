import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Payroll from "../pages/Payroll";
import Department from "../pages/Department";
import AllDepartment from "../Departme_Component/AllDepartment";
import HR from "../Departme_Component/HR";
import Position from "../pages/Position";
import Reports from "../components/Reports";
import Setting from "../pages/Setting";
import Task from "../pages/Task";
import Leave from "../pages/Leave";
import RequestLeave from "../pages/RequestLeave";
import AddAnnouncements from "../pages/AddAnnouncements";
import LeaveBalance from "../pages/LeaveBalance";
import Attendance from "../pages/Attendance";
import Students from "../components/Students";
import SchoolDashBoard from "../school_Management_Component/schoolDashBoard";


const AppRoutes = ({ employees }) => {
  
  
  return (
    <Routes>

      
      <Route path="/dashboard" element={<Dashboard employees={employees} />} />
      <Route path="/school/dashboard" element={<SchoolDashBoard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/payroll" element={<Payroll />} />
      <Route path="/position" element={<Position/>}/>
      <Route path="/reports" element={<Reports/>}/>
      <Route path="/setting" element={<Setting/>}/>
      <Route path="/task" element={<Task/>}/>
       <Route path="/leave" element={<Leave/>} />
       <Route path="/attendance" element={<Attendance/>} />
       <Route path="/request_leave" element={<RequestLeave/>} />
        <Route path="/Announcements" element={<AddAnnouncements/>} />
      <Route path="/departments" element={<Department />}>
        <Route index element={<AllDepartment />} />
        <Route path=":id" element={<HR/>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;






