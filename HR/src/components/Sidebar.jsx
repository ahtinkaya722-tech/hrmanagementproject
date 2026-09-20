import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ClipboardDocumentListIcon ,MegaphoneIcon} from "@heroicons/react/24/outline";

import { useEffect } from "react";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Employees",
    path: "/employees",
    icon: UsersIcon,
  },
  {
    name: "Departments",
    path: "/departments",
    icon: BuildingOfficeIcon,
  },
  {
    name: "Positions",
    path: "/position",
    icon: BriefcaseIcon,
  },
  {
    name: "Task",
    path: "/task",
    icon: ClockIcon,
  },
  {
    name: "Leave",
    path: "/leave",
    icon: CalendarDaysIcon,
  },
  {
    name: "Payroll",
    path: "/payroll",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: DocumentChartBarIcon,
  },
  {
    name: "Settings",
    path: "/setting",
    icon: Cog6ToothIcon,
  },
 
];



const Sidebar = () => {


  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role?.toLowerCase() === "hr" 

const sidebarmenus = [
...menus,...(isAdmin?[{
      name: "Request Leaves",
    path: "/request_leave",
    icon: ClipboardDocumentListIcon,

},{
     name: "Announcements",
    path: "/Announcements",
    icon: MegaphoneIcon,

}]:[])
  
];
  

  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const logout = async () => {
    const result = await Swal.fire({
      title: "Logout Account?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
      window.location.reload();
    }
  };

  // Phone menus
  const mobileMenus = [
    menus[0], // Dashboard
    menus[1], // Employees
    menus[4], // Task
    menus[5], // Leave
    menus[7], // Reports
  ];

  return (
    <>
      {/* =========================================
          DESKTOP SIDEBAR
      ========================================= */}
      <aside
        className="
          hidden
          md:block
          fixed
          left-0
          top-15
          z-50
          w-64
          min-h-screen
          bg-slate-900
          text-white
          font-bold
        "
      >
        {/* Logo / Title */}
        <div className="text-center pt-5">
          <h1 className="text-3xl">Sidebar</h1>
        </div>

        {/* Menu */}
        <nav className="mt-4">
          {sidebarmenus.map((m) => {
            const Icon = m.icon;

            return (
              <Link
                key={m.name}
                to={m.path}
                onClick={() => setSelected(m.name)}
                className={`
                  flex
                  items-center
                  px-5
                  py-3
                  gap-3
                  cursor-pointer
                  hover:bg-slate-800
                  transition
                  duration-200
                  ${selected === m.name ? "font-bold bg-slate-700" : ""}
                `}
              >
                <Icon className="w-6 h-6" />

                <span>{m.name}</span>
              </Link>
            );
          })}
            <div className="border-t border-slate-700 mt-2 pt-2">
    <button
      onClick={logout}
      className="
        flex
        items-center
        gap-3
        w-full
        px-5
        py-3
        cursor-pointer
        hover:bg-red-600
        transition
        duration-200
      "
    >
      <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
      <span>Logout</span>
    </button>
  </div>
        </nav>

       

      </aside>

      {/* =========================================
          MOBILE BOTTOM NAVIGATION
      ========================================= */}
      <aside
        className="
          md:hidden
          fixed
          bottom-0
          left-0
          z-50
          w-full
          h-16
          bg-slate-900
          text-white
          border-t
          border-slate-700
        "
      >
        <nav className="flex items-center justify-around h-full">
          {sidebarmenus.map((m) => {
            const Icon = m.icon;

            return (
              <Link
                key={m.name}
                to={m.path}
                onClick={() => setSelected(m.name)}
                className={`
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-0.5
                  h-full
                  min-w-[55px]
                  px-1
                  text-[10px]
                  transition
                  duration-200
                  ${
                    selected === m.name
                      ? "text-white bg-slate-700"
                      : "text-slate-400 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />

                <span>{m.name}</span>
              </Link>
            );
          })}

          {/* Mobile Logout */}
          <button
            onClick={logout}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-0.5
              h-full
              min-w-[55px]
              px-1
              text-[10px]
              text-slate-400
              hover:text-white
              hover:bg-red-600
              transition
              duration-200
            "
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />

            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
