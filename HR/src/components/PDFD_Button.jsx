import React from 'react'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';

const PDFD_Button = ({data}) => {


    const downloadPDf= ()=>{
       
     let y =25;

    const addText=(label,value,bold=false )=>{
        
    doc.setFontSize(12);
            if (bold) doc.setFont(undefined, "bold");
      else doc.setFont(undefined, "normal");
        doc.text(`${label}`, 14, y);
      doc.text(`${value}`, 90, y);
        y += 8;
        }

        const doc= new jsPDF();
       
            if (data){
                console.log(data);
                
            }; 
            const line = ()=>{
            doc.line(14,y,200,y);
             y +=70;
            
            }
             const single_line = ()=>{
            doc.line(14,y,200,y);
             y +=10;
            
            }
            
     const tax = data.tax || 0;
       const insurance = data.insurance || 0;
       const late_deduction = data.lateDeduction || 0 ;
       const leave_deduction = data.leaveDeduction || 0 ;
       const others_Deduction = data.otherDeductions || 0 ;

        const totalDeduction = tax + insurance + leave_deduction + late_deduction + others_Deduction;
        const netSalary = data.grossSalary - totalDeduction;
        doc.setFontSize(20);
        doc.text("Payroll Report",14,15);

       autoTable(doc,{
           head: [["Field", "Value"]],
        body:[
        ["Employee Name", data.employeeName],
        ["Department", data.departmentName],
        ["Position", data.positionName],
        ["Gross Salary", `${data.grossSalary} KS`],
        ["Total Deduction", `${data.deductionAmount} KS`],
        ["Net Salary", `${data.netSalary} KS`],
        ["Payment Date", data.paymentDate],
      ],
        startY:25,
       })
        line();
     doc.text("Deduction Report",14,y);
     y+=5;
     single_line();
     doc.setFont(undefined, "normal");

    addText("Tax :", `${tax} KS`);
    addText("Insurance :", `${insurance} KS`);
    addText("Leave Deduction :", `${leave_deduction} KS`);
    addText("Late Deduction :", `${late_deduction} KS`);
    addText("Other Deduction :", `${others_Deduction} KS`);
    single_line();
    addText("Total Deduction :", `${totalDeduction} KS`, true);
     single_line();
    doc.setFontSize(14);
    addText("NET SALARY :", `${netSalary} KS`, true);
    doc.save(`${data.employeeName}_payroll.pdf`);
    }
 

  
  return (
    <div>
        
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
        onClick={()=>downloadPDf()}        
        >
            Print PDF

        </button>

    </div>
  )
}



export default PDFD_Button



