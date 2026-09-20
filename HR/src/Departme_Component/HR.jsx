import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Users, DollarSign, TrendingUp, AlertCircle, Loader2, Trash2 } from 'lucide-react';

const HR = () => {
const TOKEN = localStorage.getItem("token");
const navigate = useNavigate();
  const [emp, setEmp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const month  = new Date().getMonth()+1;

  const formatMoney = (value) => new Intl.NumberFormat("en-US").format(value || 0);
  
  const departmentTotal = useMemo(() => {
    return emp[0]?.total_department_salary || emp.reduce((sum, item) => sum + (item.salary || 0), 0);
  }, [emp]);

  const averageSalary = emp.length ? departmentTotal / emp.length : 0;
  const handleDelete = async ()=>{

    try {
      const res= await axios.delete(`http://localhost:8080/api2/deleteDepartmentById`,{
        params:{
    
          id:id
        },
    
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    
    })
    if(res.data.success){
      alert(res.data.message);
      navigate("/departments/",{
        state:{
          departmentDelete:true
        }
      })
    }

    } catch (error){
       console.log("FULL ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);
  

  alert(
    `Error: ${error.response?.status}\n` +
    `${error.response?.data?.message || error.message}`
  );

    if (error.response?.status === 404) {
      alert("Department not found.");
    } else if (error.response?.status === 403) {
      alert("You don't have permission to delete this department.");
    } else {
      alert(
        error.response?.data?.message ||
        "Could not delete department."
      );
    }
  }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`http://localhost:8080/api2/departmentById`,{
        params:{
          month:month,
          id:id
        },
    
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    

      });
      console.log(res.data);
      
      setEmp(res.data);
    } catch (error) {
      setError("Could not load department employees."+error);
      setEmp([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 mx-10  animate-slide-up">
      {/* Header */}
      <div className=' flex justify-between items-center'>
       <div>

        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Department Overview</p>
        <h2 className="text-3xl font-extrabold text-gray-900">{emp[0]?.departmentName} Department #{id}</h2>
      </div>

      <button onClick={()=>handleDelete()} className="border-b shadow-2xl inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 active:scale-95">Delete Department

        <Trash2 size={18}/>
      </button>
      </div>
   
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Total Employees", value: emp.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Total Salary", value: `${formatMoney(departmentTotal)} KS`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { title: "Average Salary", value: `${formatMoney(averageSalary)} KS`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{stat.title}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider">Employee Name</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase text-gray-500 tracking-wider">Salary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <span className="font-medium">Loading department data...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-red-500">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={32} />
                    <span className="font-bold">{error}</span>
                  </div>
                </td>
              </tr>
            ) : emp.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-gray-400 font-medium">No employees found.</td>
              </tr>
            ) : (
              emp.map((item) => (
                <tr key={item.id} className="group transition-colors hover:bg-gray-50/80">
                  <td className="px-6 py-4 text-sm font-mono text-gray-400">#{item.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-green-600 tabular-nums">
                    {formatMoney(item.salary)} KS
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HR;