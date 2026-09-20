import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import {Building2, MapPin, X, PlusCircle}  from "lucide-react";


const DepartmentTabs = () => {
   const TOKEN=localStorage.getItem("token")
  const navigate = useNavigate();
  const [dept, setDept] = useState([]);
  const [popup, setPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    location: "",
  });
const location = useLocation();
  useEffect(() => {
    let isMounted = true;

    const loadDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api2/getDepartment",
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
        if (isMounted) {
          setDept(res.data);
        }
      } catch {
        if (isMounted) {
          setDept([]);
        }
      }
    };

    void loadDepartments();

    return () => {
      isMounted = false;
    };
  }, [location.state?.departmentDelete]);

  const handleChange = (e) => {
    setNewDepartment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api2/getDepartment",
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
      setDept(res.data);
    } catch {
      setDept([]);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api2/addDepartment", newDepartment,{
    
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    

      });

      const message = res.data;
      Swal.fire({
        icon: "success",
        title: "Added",
        text: message || "Department added successfully",
        draggable: true,
      });

      await refreshDepartments();
    } catch(error){
      Swal.fire({
        icon: "error",
        title: "Added Failed",
        text: error.response?.data||"Department could not be added",
        draggable: true,
      });
    }
  };
const tabs = [
  {     id: 0, name: "All", label: "All Department",  route: "" },
  ...dept.map((d) => ({
    id:d.id,
    name: d.name,
    label: d.name,
    route: `/departments/${d.id}`
  })),
];

  return (
    <>
      {/* Department Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6  animate-slide-up">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.name);
              navigate(tab.route);
            }}
            className={`px-5 py-2 rounded-lg font-medium shadow-sm transition-all duration-300 border
              
              ${activeTab === tab.name
                ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow"
              }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Add Button */}
        <button
          onClick={() => { setPopup(true) }}
          className="px-5 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-md"
        >
          + Add Department
        </button>
      </div>

      {/* Popup */}
     {popup && (
  <div className="fixed inset-0 z-50 grid place-items-center p-4">
    {/* Backdrop Blur Overlay */}
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
      onClick={() => setPopup(false)}
    />

    {/* Modal Box */}
    <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 animate-fade-in grid grid-rows-[auto_1fr_auto] gap-6">
      
      {/* Header Grid Row */}
      <div className="grid grid-cols-[1fr_auto] items-center pb-4 border-b border-gray-100">
        <div className="grid grid-flow-col auto-cols-max items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Add Department
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Create a new department in your workspace.
            </p>
          </div>
        </div>

        {/* Close Icon Button */}
        <button
          type="button"
          onClick={() => setPopup(false)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Inputs Grid Container */}
      <div className="grid gap-4">
        {/* Department Name Field */}
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Department Name
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              name="name"
              onChange={handleChange}
              type="text"
              placeholder="e.g. Human Resources"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Location Field */}
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              name="location"
              onChange={handleChange}
              type="text"
              placeholder="e.g. Floor 3, HQ"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Footer Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setPopup(false)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="grid grid-flow-col justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md shadow-blue-500/20 transition-all focus:outline-none"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Save Department</span>
        </button>
      </div>

    </div>
  </div>
)}
    </>
  );
};

export default DepartmentTabs;