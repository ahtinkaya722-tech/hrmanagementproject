import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AsyncCompiler } from 'sass'
import PayrollTable from '../components/PayrollTable';
import Payroll_EditForm from '../components/Payroll_EditForm';
import Swal from 'sweetalert2';



const Payroll = () => {
    const TOKEN = localStorage.getItem("token");
    const [data, setData] = useState();
    const [payrollList, setPayrollList] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedRow, setSelectedRow] = useState(null);
    const [payroll,setPayroll]=useState(false);
    const [editMode, setEditMode] = useState(false);
    const [insertButton,setInsertButton]=useState(false);
    const [missingData,setMissingData]=useState([]);
    const formatMoney = (value) => {
        return new Intl.NumberFormat("en-US").format(value)
    }

       const checkPayroll= async()=>{
        const res = await axios.get(
         `http://localhost:8080/api1/checkPayroll?month=${month}&year=${year}`,
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    }
        );

        console.log("Check Payroll Data:", res.data);
        
        setPayroll(res.data);

        return res.data;
    }
const generatePayroll = async () => {
    try {

        const res = await axios.post(
            `http://localhost:8080/api1/payroll_generate?month=${Number(month)}&year=${Number(year)}`
        );

        await checkPayroll();
        await fetchData();

        Swal.fire({
            icon: "success",
            title: "Payroll Generated",
            text: res.data || "Payroll generated successfully"
        });

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Failed",
            text: error.response?.data || error.message || "Something went wrong"
        });

    }
};


const addMissingData = async () => {

        const result = await Swal.fire({
        title: "Are you sure?",
        text: "Will Be Added Missing Employees",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Add these",
        cancelButtonText: "Cancel",
        })

        if(result.isConfirmed){
              try {
      const res=   await axios.post(
            `http://localhost:8080/api1/payroll_addMissingData?month=${month}&year=${year}`, missingData,
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    }
        );  

      
        await refreshPayroll();

        Swal.fire({
            icon:"success",
            title:"Missing employees added"
        });

          } catch (error) {
       console.log(error);
             }

        }

    }

    const fetchData = async () => {
        try {
            const [res_PayrollData, res_TableData] = await Promise.all([
                axios.get('http://localhost:8080/api1/payrollData',
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    }),
                axios.get('http://localhost:8080/api1/payrollTableData',
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    })
            ]);



            const filterMonthData = res_TableData.data.filter((item) => {
                return (
                    
                    Number(item.month) === Number(month) &&
                    Number(item.year) ===  Number(year)
                    
                    
                    
                );

            })
            const filterMonthDataAllDepartment = res_PayrollData.data.filter((item) => {
                return (
                    Number(item.month) === Number(month)  &&
                    Number(item.year) ===  Number(year)
              
                );
            });
         


            setPayrollList(filterMonthData);
            setData(filterMonthDataAllDepartment[0] || {});
        } catch (error) {
            console.log(error);
            return
        }

    }

      const fetchMissingData = async () => {
            try{
                const res= await axios.get(`http://localhost:8080/api1/payrollMissingData?month=${month}&year=${year}`,
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
             
                setMissingData(res.data);
                if(res.data.length>0){
                    setInsertButton(true);
                }else{
                 setInsertButton(false);
                }
            }catch(error){
                console.log(error);
            }    
      
     
     
        }   

const refreshPayroll = async () => {
    await fetchData();
    await checkPayroll();
    await fetchMissingData();
};
 useEffect(() => {
      
        fetchData();
        checkPayroll();
        fetchMissingData();

        
  },[month,year]);


   
    return (
        <div className='bg-gray-50  md:p-8 min-h-screen font-sans'>
            {/* Header Section */}
            <div className="mb-2 animate-slide-up">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Payroll Management <span className='text-blue-400 font-bold text-4xl'>{year}</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500  font-medium">
                    Generate and manage monthly employee salaries
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 max-w-7xl animate-slide-up">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="font-medium text-xs text-gray-400 uppercase tracking-wider">Total Employees</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">{data?.totalEmployees}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="font-medium text-xs text-gray-400 uppercase tracking-wider">Total Net Salary</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatMoney(data?.totalNetSalary)} KS</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="font-medium text-xs text-gray-400 uppercase tracking-wider">Total Deduction</p>
                    <p className="text-xl font-bold text-rose-600 mt-1">{formatMoney(data?.totalDeduction)} KS</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="font-medium text-xs text-gray-400 uppercase tracking-wider">Total Gross</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">{formatMoney(data?.totalGross)} KS</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="font-medium text-xs text-gray-400 uppercase tracking-wider">Pending Payroll</p>
                    <p className="text-xl font-bold text-amber-500 mt-1">{data?.pending || 0}</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="mb-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm inline-flex flex-col sm:flex-row sm:items-center gap-3 animate-slide-up">
                <label htmlFor="month-select" className="font-semibold text-sm text-gray-700">
                    Select Month:
                </label>
                <select
                    id="month-select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full sm:w-52 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    {[
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ].map((name, index) => (
                        <option key={index} value={index + 1}>
                            {name}
                        </option>
                    ))}
                </select>
                {
                  !payroll && (
                      <button
           onClick={generatePayroll}
            className="bg-blue-600 text-white px-4 py-2 rounded animate-slide-up"
                  >
            Generate Payroll
              </button>
                )
                }{
                  payroll && insertButton&&  (
                      <button
           onClick={() =>  addMissingData()}
            className="bg-red-600 text-white px-4 py-2 rounded animate-slide-up"
                  >
                    Add Missing Data
              </button>
                )
                }
            </div>

            {/* Table Section wrapper for responsiveness */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {editMode ? (
                    <Payroll_EditForm selectedRow={selectedRow} onCancel={() => { setEditMode(false) }} onRefresh={() => refreshPayroll()} />
                ) : (
                    <PayrollTable data={payrollList} onEdit={(row) => { setSelectedRow(row), setEditMode(true) }} onRefresh={refreshPayroll}   />
                )}



            </div>
        </div>
    )
}

export default Payroll
