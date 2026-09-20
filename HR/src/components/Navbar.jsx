import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { User } from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

 
  const imageSrc = user?.image
    ? user.image.startsWith("data:image")
      ? user.image
      : `data:image/jpeg;base64,${user.image}`
    : null;

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 sm:px-6">
      
      <div className="h-full grid grid-cols-[auto_1fr] items-center gap-4">
        
   
        <div className="grid grid-flow-col items-center gap-3 auto-cols-max">
          <div className="w-2.5 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 whitespace-nowrap">
            HR Management
          </h2>
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