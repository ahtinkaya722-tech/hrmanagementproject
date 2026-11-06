import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { User } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Navbar = ({sideBarMode,setSideBarMode}) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();
  
  const imageSrc = user?.image
    ? user.image.startsWith("data:image")
      ? user.image
      : `data:image/jpeg;base64,${user.image}`
    : null;

    const handleSwtich = (sideBarMode) => {
      const newMode = !sideBarMode;
      setSideBarMode(newMode);
      localStorage.setItem("sideBarMode",  newMode ? "school" : "hr");
      if(newMode){
        navigate("/school/dashboard");
      }else{
      navigate("/dashboard");
      }
    };

  return (

   
    <header className="sticky top-0 z-30 h-16 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 sm:px-6">
      
      <div className="h-full grid grid-cols-[auto_1fr] items-center gap-4">
        
   
        <div className="grid grid-flow-col items-center gap-3 auto-cols-max">
          <div className= {`w-2.5 h-6  rounded-full ${sideBarMode ? "bg":""}`} />
         
         
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 whitespace-nowrap">
             {sideBarMode ? ( <>School Management</> ):(<> HR Management</> )  }   
          </h2>
          <button
  type="button"
  onClick={() => handleSwtich(sideBarMode)}
  title="Switch Management System"
  className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 border border-gray-200 transition-all duration-300"
>
 <RefreshCw
  className={`w-4 h-4 transition-transform duration-500 ${
    sideBarMode ? "rotate-180" : "rotate-0"
  }`}
/>
</button>
        </div>

      
        <div className="grid grid-flow-col items-center justify-end gap-3 auto-cols-max">
          
        
          {user?.role && (
            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100 capitalize whitespace-nowrap">
              {user.role}
            </span>
          )}

       
          <div className="grid grid-flow-col items-center gap-2.5 bg-gray-50 hover:bg-gray-100 p-1.5 pr-3 rounded-full border border-gray-100 transition-colors">
       
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs overflow-hidden">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-blue-600" />
              )}
            </div>

     
            <span className="text-xs sm:text-sm font-semibold text-gray-800 capitalize whitespace-nowrap">
              {user?.username || user?.nickname || "Guest"}
            </span>

          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;