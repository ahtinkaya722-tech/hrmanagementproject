import { CalendarDays, Clock, Info, Play } from "lucide-react";
export function greetingClock(){

    const time = new Date().getHours();
    let greeting = "Good Morning";

    if(time >= 12 ){
        let greeting = "Good Afternoon";
       return   greeting;
    }else if(time >= 15){
        let greeting = "Good Evening";
       return greeting;
    }
    return greeting;
}

export function getImage(image){

if(!image)return null;
if(image.startsWith("data:image"))return image;
return `data:image/jpeg;base64,${image}`

}

export const stats = [
  {
    title: "Total Working Hours",
    value: "32h",
    note: "This week",
    icon: CalendarDays,
    style: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    title: "Late Arrivals",
    value: "2",
    note: "This month",
    icon: Clock,
    style: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    title: "Absences",
    value: "1",
    note: "This month",
    icon: Info,
    style: "border-red-200 bg-red-50 text-red-700",
  },
  {
    title: "Overtime",
    value: "4h",
    note: "This month",
    icon: Play,
    style: "border-amber-200 bg-amber-50 text-amber-700",
  },
];