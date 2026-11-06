export let attendance_data = [
  {
    id: 6,
    date: "2026-10-19",
    checkIn: "",
    checkOut: "",
    workingHour: "8h 30m",
    status: "Present",
  },
  {
    id: 5,
    date: "2026-10-18",
    checkIn: "08:45 AM",
    checkOut: "05:00 PM",
    workingHour: "8h 15m",
    status: "Late",
  },
  {
    id: 4,
    date: "2026-10-17",
    checkIn: "08:25 AM",
    checkOut: "05:10 PM",
    workingHour: "8h 45m",
    status: "Present",
  },
  {
    id: 3,
    date: "2026-10-16",
    checkIn: "--",
    checkOut: "--",
    workingHour: "0h",
    status: "Absent",
  },
  {
    id: 2,
    date: "2026-10-15",
    checkIn: "09:15 AM",
    checkOut: "05:00 PM",
    workingHour: "7h 45m",
    status: "Late",
  },
  {
    id: 1,
    date: "2026-10-14",
    checkIn: "08:30 AM",
    checkOut: "--",
    workingHour: "In progress",
    status: "Present",
  },
];


export const attendance_data_header = [

        {
    name: "Check In"
    },    {
    name:"Check Out"
    },    {
    name: "Working Hour"
    },    {
    name: "Status"
    },
]

export const getAttendanceRecords = (records = attendance_data)=>{

  const new_Date = new Date();
  const year = new_Date.getFullYear();
  const month = String(new_Date.getMonth()+1).padStart(2,"0");
  const date =String(new_Date.getDate()).padStart(2,"0");
  const today = `${year}-${month}-${date}`;

  
const today_Date_Exit = records.some((record)=>record.date === today);

if(today_Date_Exit){
  return records;
}

const new_id= Math.max(0,...records.map((data)=>data.id))+1;
return[
  {
    
    id: new_id,
    date: today,
    checkIn: "",
    checkOut: "",
    workingHour: "8h 30m",
    status: "Present"
  },
  ...records

]

}