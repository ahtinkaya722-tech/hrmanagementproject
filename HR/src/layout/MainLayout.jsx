import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const [sideBarMode,setSideBarMode]=useState(()=>   {return localStorage.getItem("sideBarMode") === "school" ? true : false });
  useEffect(() => {
    const handleScroll = () => {

      if (window.scrollY > 50) {
        setShowAnnouncement(false);
      } else {
     
        setShowAnnouncement(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Navbar */}
      <Navbar setSideBarMode={setSideBarMode} sideBarMode= {sideBarMode}/>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar sideBarMode={sideBarMode} />

        {/* Main Content Area */}
        <main
          className="
            flex-1
            ml-0
            md:ml-64
            pt-16
            pb-20
            md:pb-6
            min-h-screen
            transition-all
            duration-300
          "
        >
          {/* Scroll-triggered Announcement Banner */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showAnnouncement
                ? "max-h-[500px] opacity-100 mb-4"
                : "max-h-0 opacity-0 mb-0 pointer-events-none"
            }`}
          >
            <div className="relative px-4 sm:px-6 md:px-8 pt-4">
              {/* Manual Close Button */}
              <button
                onClick={() => setShowAnnouncement(false)}
                className="absolute top-6 right-6 sm:right-8 z-10 p-1.5 text-gray-400 hover:text-gray-700 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
                aria-label="Dismiss Announcement"
              >
                <X className="w-4 h-4" />
              </button>

              <Announcement />
            </div>
          </div>

          {/* Page Body Content */}
          <div className="px-4 py-5 sm:px-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;