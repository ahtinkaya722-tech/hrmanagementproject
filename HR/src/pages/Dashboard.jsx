import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import {
  UsersIcon,
  UserMinusIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import ChartApp from "./ChartApp";



const Dashboard = () => {
  
 
  const [data, setData] = useState({
    totalEmployee: 0,
    activeEmployee: 0,
    inactiveEmployee: 0,
    totalDepartment: 0,
    totalPosition: 0,
  });
  const [deptData, setDeptData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const TOKEN  = localStorage.getItem("token"); 
    const user = localStorage.getItem("user");
    
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, chartRes] = await Promise.all([
          axios.get("http://localhost:8080/api/Dashboards",
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    }),
          axios.get("http://localhost:8080/api/charts",
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    }),
        ]);

        const chartData = [
          ["Department", "Employees"],
          ...chartRes.data.map((item) => [item.name, Number(item.value)]),
        ];

        setData(dashboardRes.data);
        setDeptData(chartData);
        setError("");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Unable to load dashboard data");
      }
    };
    console.log("BACKEND LOGIN RESPONSE:", user);
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full p-8 bg-gray-50/50 min-h-screen animate-fade-in">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">HR Analytics Dashboard</h1>
        <p className="text-lg text-gray-500 mt-2 font-medium">
          Welcome back! Here's what's happening in your organization today.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card
          title="Total Employees"
          value={data.totalEmployee}
          icon={<UsersIcon className="w-7 h-7" />}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          delay="delay-0"
        />
        <Card
          title="Active Employees"
          value={data.activeEmployee}
          icon={<UsersIcon className="w-7 h-7" />}
          color="text-blue-600"
          bgColor="bg-blue-50"
          delay="delay-75"
        />
        <Card
          title="Inactive Employees"
          value={data.inactiveEmployee}
          icon={<UserMinusIcon className="w-7 h-7" />}
          color="text-rose-600"
          bgColor="bg-rose-50"
          delay="delay-150"
        />
        <Card
          title="Departments"
          value={data.totalDepartment}
          icon={<BuildingOfficeIcon className="w-7 h-7" />}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          delay="delay-225"
        />
        <Card
          title="Positions"
          value={data.totalPosition}
          icon={<BriefcaseIcon className="w-7 h-7" />}
          color="text-amber-600"
          bgColor="bg-amber-50"
          delay="delay-300"
        />
      </div>
   
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-slide-up delay-150">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Employees By Department</h2>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">Live Data</div>
          </div>
          
          <div className="h-[400px]">
            {deptData.length > 0 && !error ? (
              <ChartApp data={deptData}></ChartApp>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin"></div>
                <span>Loading analytics...</span>
              </div>
            )}
          </div>
        </div>

        <div className="animate-slide-up delay-300">
            
          <Table />
        </div>
      </div>
    </div>
  );
};
function Card({ title, value, icon, color, bgColor, delay = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-md shadow-gray-200/60 border border-gray-50 flex flex-col items-start gap-4 
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group animate-slide-up`}
    >
      <div className={`p-4 rounded-2xl ${bgColor} ${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      <div>
        <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-3xl font-black mt-1 text-gray-900">{value}</p>
      </div>

      <div className="w-full h-1 bg-gray-50 rounded-full mt-2 overflow-hidden">
        <div className={`h-full ${bgColor} opacity-20 w-2/3`}></div>
      </div>
    </div>
  );
}

export default Dashboard;
