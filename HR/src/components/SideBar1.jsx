
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
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

// HR Management Menus
const hrMenus = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Attendance", path: "/attendance", icon: ClockIcon },
  { name: "Employees", path: "/employees", icon: UsersIcon },
  { name: "Departments", path: "/departments", icon: BuildingOfficeIcon },
  { name: "Positions", path: "/position", icon: BriefcaseIcon },
  { name: "Task", path: "/task", icon: ClockIcon },
  { name: "Leave", path: "/leave", icon: CalendarDaysIcon },
  { name: "Payroll", path: "/payroll", icon: CurrencyDollarIcon },
  { name: "Reports", path: "/reports", icon: DocumentChartBarIcon },
  { name: "Settings", path: "/setting", icon: Cog6ToothIcon },
];

// School Management Menus
const schoolMenus = [
  { name: "Dashboard", path: "/school/dashboard", icon: HomeIcon },
  { name: "Students", path: "/school/students", icon: UsersIcon },
  { name: "Teachers", path: "/school/teachers", icon: AcademicCapIcon },
  { name: "Classes", path: "/school/classes", icon: BuildingOfficeIcon },
  { name: "Subjects", path: "/school/subjects", icon: BookOpenIcon },
  { name: "Attendance", path: "/school/attendance", icon: ClipboardDocumentCheckIcon },
  { name: "Parents", path: "/school/parents", icon: UserGroupIcon },
  { name: "Announcements", path: "/school/announcements", icon: MegaphoneIcon },
  { name: "Reports", path: "/school/reports", icon: DocumentChartBarIcon },
  { name: "Settings", path: "/school/settings", icon: Cog6ToothIcon },
];

const Sidebar = ({ sideBarMode, setSideBarMode }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdmin = user?.role?.toLowerCase() === "hr";

  const isSchool = sideBarMode;

  // Theme configuration
  const theme = isSchool
    ? {
        sidebar: "bg-[#1b9729]",
        hover: "hover:bg-[#147520]",
        active: "bg-[#147520]",
        border: "border-[#126d1d]",
        text: "text-white",
        inactive: "text-green-100",
        logout: "hover:bg-red-600",
      }
    : {
        sidebar: "bg-slate-900",
        hover: "hover:bg-slate-800",
        active: "bg-slate-700",
        border: "border-slate-700",
        text: "text-white",
        inactive: "text-slate-400",
        logout: "hover:bg-red-600",
      };

  // Select menus according to current system
  const sidebarmenus = isSchool
    ? schoolMenus
    : [
        ...hrMenus,
        ...(isAdmin
          ? [
              {
                name: "Request Leaves",
                path: "/request_leave",
                icon: ClipboardDocumentListIcon,
              },
              {
                name: "Announcements",
                path: "/Announcements",
                icon: MegaphoneIcon,
              },
            ]
          : []),
      ];

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
      localStorage.removeItem("user");
      navigate("/login");
      window.location.reload();
    }
  };

  const switchSystem = () => {
    const newMode = !sideBarMode;

    setSideBarMode(newMode);

    // Navigate to the appropriate dashboard
    navigate(newMode ? "/school/dashboard" : "/dashboard");
  };

  // Mobile menu
  const mobileMenus = isSchool
    ? schoolMenus.slice(0, 5)
    : [
        hrMenus[0],
        hrMenus[1],
        hrMenus[5],
        hrMenus[6],
        hrMenus[8],
      ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`
          hidden md:block fixed left-0 top-15 z-50
          w-64 min-h-screen ${theme.sidebar}
          text-white font-bold transition-colors duration-300
        `}
      >
        {/* Logo */}
        <div className="text-center pt-5">
          <h1 className="text-3xl">
            {isSchool ? "School" : "HR Management"}
          </h1>

          <p className="text-xs mt-1 opacity-75">
            Management System
          </p>
        </div>

        {/* System Switcher */}
        <div className="px-4 mt-5">
          <button
            onClick={switchSystem}
            className={`
              w-full rounded-lg px-3 py-2
              bg-white/15 hover:bg-white/25
              text-sm transition duration-200
              flex items-center justify-between
            `}
          >
            <span>
              {isSchool ? "School Management" : "HR Management"}
            </span>

            <span>⇄</span>
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="mt-4 pb-10">
          {sidebarmenus.map((m) => {
            const Icon = m.icon;
            const active = isActive(m.path);

            return (
              <Link
                key={m.name}
                to={m.path}
                className={`
                  flex items-center px-5 py-3 gap-3
                  cursor-pointer transition duration-200
                  ${theme.hover}
                  ${active ? `${theme.active} font-bold` : ""}
                `}
              >
                <Icon className="w-6 h-6" />
                <span>{m.name}</span>
              </Link>
            );
          })}

          {/* Logout */}
          <div className={`border-t ${theme.border} mt-3 pt-2`}>
            <button
              onClick={logout}
              className={`
                flex items-center gap-3 w-full
                px-5 py-3 cursor-pointer
                ${theme.logout} transition duration-200
              `}
            >
              <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <aside
        className={`
          md:hidden fixed bottom-0 left-0 z-50
          w-full h-16 ${theme.sidebar}
          text-white border-t ${theme.border}
        `}
      >
        <nav className="flex items-center justify-around h-full">
          {mobileMenus.map((m) => {
            const Icon = m.icon;
            const active = isActive(m.path);

            return (
              <Link
                key={m.name}
                to={m.path}
                className={`
                  flex flex-col items-center justify-center
                  gap-0.5 h-full min-w-[55px] px-1
                  text-[10px] transition duration-200
                  ${
                    active
                      ? `${theme.active} text-white`
                      : `${theme.inactive} hover:text-white`
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
            className={`
              flex flex-col items-center justify-center
              gap-0.5 h-full min-w-[55px] px-1
              text-[10px] ${theme.inactive}
              ${theme.logout}
            `}
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
