import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Info,
  Play,
  Square,
} from "lucide-react";
import { greetingClock, getImage } from "../js/utilityFile";
import { stats } from "../js/utilityFile";
import { getAttendanceRecords } from "../js/attendancet_Table_Data";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import A_Table from "../components/A_Table";
import Swal from "sweetalert2";

const Attendance = () => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceRecords,setAttendanceRecord]= useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const greeting = greetingClock();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const getTodayDate = ()=>{
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth()+1).padStart(2,'0');
    const day = String(today.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
  }
    const getAuthHeaderAndParams = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  params: {
    id: user?.employeeId,
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
  },
});


const getToday = ()=>({
headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  params: {
    id: user?.employeeId,
    todayDate: getTodayDate(),
  },
});

const API_BASE_URL = "http://localhost:8080/api5";

const fetchAttendanceData = async () => {
  try {
    if (!user?.employeeId) {
      console.log("Employee ID is not available yet");
      return;
    }

    const res = await axios.get(
      `${API_BASE_URL}/getAttendanceData`,
      getAuthHeaderAndParams()
    );

    setAttendanceRecord(res.data)
const todayRecord = res.data.find((record) => {
  return record.date === getTodayDate();
});
console.log(getTodayDate());

console.log("Today record is:", todayRecord?.checkIn);

setCheckInTime(todayRecord?.checkIn || null);
setCheckOutTime(todayRecord?.checkOut || null);

    console.log("this is record:", res.data);
  } catch (err) {
    console.error("Failed to fetch attendance record", err);
  }
};



  const localTime = currentTime?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = currentTime?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatActionTime = (date) => {
    const now = new Date();
    if (!date) return "";
    const [hour,minute] = date.split(":");
    return new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  Number(hour),
  Number(minute)
).toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});
  
  }

  const handleCheckIn = async () => {

       try {
    const res = await axios.post(
      `${API_BASE_URL}/checkIn`,
      {},
      getToday()
    );
    console.log(res.data);
    
    await Swal.fire({
  title: "Check-in Successful!",
  text: "Your attendance has been recorded.",
  icon: "success"
});

await fetchAttendanceData();

  

  } catch (error) {
    Swal.fire({
  title: "Check-in Failed!",
  text: error.response?.data || "Something went wrong.",
  icon: "error",
  confirmButtonText: "Try Again"
});
  }






  };

 const handleCheckOut = async () => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/checkOut`,
      {},
      getToday()
    );

    console.log(res.data);

    await Swal.fire({
      title: "Check-out Successful!",
      text: "Your attendance has been recorded.",
      icon: "success",
    });

    await fetchAttendanceData();

  } catch (error) {
    Swal.fire({
      title: "Check-out Failed!",
      text: error.response?.data || "Something went wrong.",
      icon: "error",
      confirmButtonText: "Try Again",
    });
  }
};

  useEffect(()=>{

    
    fetchAttendanceData();
  },[])

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex items-center gap-4">
        <Clock className="text-blue-600" size={42} />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
          <p className="mt-1 text-sm text-slate-600">
            Check your attendance, clock in/out and view your working hours.
          </p>
        </div>
      </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">

      <section className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-blue-50 to-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <img
              src={getImage(user.image)}
              alt={user.nickname || "Employee"}
              className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm sm:h-20 sm:w-20"
            />
            <div>
              <p className="text-lg font-semibold text-slate-900">{greeting}</p>
              <h2 className="text-xl font-bold text-slate-900">
                {user.nickname || "Employee Name"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {user.position || "Employee"}
                {user.department ? ` · ${user.department}` : ""}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[auto_auto_auto] md:items-center">
            {/* time showing part */}
            <div className="border-b border-blue-200 pb-5 text-center md:border-b-0 md:border-r md:pb-0 md:pr-8">
              <p className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {localTime}
              </p>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600">
                <CalendarDays size={16} />
                {formattedDate}
              </p>
            </div>

            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleCheckIn}
                  disabled={Boolean(checkInTime)}
                  className="flex min-h-20 items-center justify-center gap-3 rounded-lg bg-emerald-600 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-500"
                >
                  <Play size={18} fill="currentColor" />
                  <span>
                    <span className="block">Clock In</span>
                    <span className="mt-1 block text-xs font-normal text-emerald-50">
                      {checkInTime
                        ? `Clocked in at ${formatActionTime(checkInTime)}`
                        : "Not clocked in yet"}
                    </span>
                  </span>
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={!checkInTime || Boolean(checkOutTime)}
                  className="flex min-h-20 items-center justify-center gap-3 rounded-lg border border-blue-200 bg-red-400 px-5 py-4 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-600"
                >
                  <Square size={18} fill="currentColor" />
                  <span>
                    <span className="block">Clock Out</span>
                    <span className="mt-1 block text-xs font-normal">
                      {checkOutTime
                        ? `Clocked out at ${formatActionTime(checkOutTime)}`
                        : "Not clocked out yet"}
                    </span>
                  </span>
                </button>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Info size={16} className="shrink-0 text-blue-600" />
                Click the button to record your attendance.
              </p>
            </div>

            

          
          </div>
        </div>
      </section>
           <div className="grid grid-cols-2 gap-3" >
              {
               stats.map((item)=>{
                const Icon = item.icon;
                  return (
                      <article
              key={item.title}
              className={`rounded-xl border p-4 shadow-,d ${item.style}`}
            >
              <Icon size={22} />
              <p className="mt-3 text-sm">{item.title}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.note}</p>
            </article>
                  )

               })
              }


           </div>


        </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr] mt-3 ">

             
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
  <h2 className="mb-2 text-lg font-bold text-slate-900">
    Attendance Calendar
  </h2>

  <p className="mb-4 text-sm text-slate-500">
    Select a date to view your attendance.
  </p>

  <Calendar
    onChange={setSelectedDate}
    value={selectedDate}
    className="attendance-calendar"
  />

  <div className="mt-5 rounded-lg bg-blue-50 p-4">
    <p className="text-sm font-medium text-slate-600">
      Selected Date
    </p>

    <p className="mt-1 font-bold text-slate-900">
      {selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </div>
</section>

<div><A_Table records={attendanceRecords}/> </div>

          </div>

     
    </div>
    
  );
};

export default Attendance;