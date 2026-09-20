import React from 'react'
import { useState, useEffect } from 'react'
import CountUpModule from "react-countup";
import axios from 'axios';
import Swal from 'sweetalert2';
const CountUp = CountUpModule.default || CountUpModule;

const Payroll_EditForm = ({ selectedRow, onCancel, onRefresh }) => {
    const TOKEN = localStorage.getItem("token");
    const [enableDeductions, setEnableDeductions] = useState(false);
    const [formData, setFormData] = useState(selectedRow);

    const toNumber = (value) => {
        const number = Number(value || 0);
        return Number.isFinite(number) ? number : 0;
    };

    const netSalary = toNumber(formData.grossSalary) - (
        toNumber(formData.tax) +
        toNumber(formData.insurance) +
        toNumber(formData.lateDeduction) +
        toNumber(formData.leaveDeduction) +
        toNumber(formData.otherDeductions)
    );

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`http://localhost:8080/api1/updatePayrollData`, formData,
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: res.data || "Payroll Data updated successfully",
            });
            onRefresh();
            onCancel();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.response?.data || error.message,
            });
        }
    }

    const handleDelete = async () => {

        const result = await Swal.fire({
        title: "Are you sure?",
        text: "This payroll data will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        })

        if(result.isConfirmed){
               try {
            

            const res = await axios.delete(`http://localhost:8080/api1/deletePayrollData/${formData.id}`,
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: res.data || "Payroll Data deleted successfully",
            });
           await onRefresh(); 
            onCancel();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: error.response?.data || error.message,
            });
        }
        }
     
    }
    useEffect(() => {

        console.log(formData?.id);
        

    }, [formData])


    return (
        <div className='animate-slide-up'>
            <form className="bg-white border border-slate-100 p-6 shadow-xl rounded-2xl max-w-full" onSubmit={(e) => e.preventDefault()}>

                {/* Back Button */}
                <button
                    onClick={onCancel}
                    className="mb-6 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-all duration-200 text-sm shadow-sm"
                >
                    ← Back to table
                </button>

                {/* Header */}
                <h1 className="text-2xl mb-6 font-bold text-slate-800 tracking-tight">
                    Payroll Edit Form For <span className="text-blue-600">{selectedRow.employeeName}</span>
                </h1>

                {/* Main 2-Column Layout */}
                <div className="grid grid-cols-2 gap-8">

                    {/* Left Column: Form Fields */}
                    <div className="space-y-4 grid-cols-1">
                        <div className="grid grid-cols-2 text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-medium">Employee Name</span>
                            <span className="text-slate-800 font-semibold">: {formData.employeeName}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-medium">Employee Position</span>
                            <span className="text-slate-800 font-semibold">: {formData.positionName}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-medium">Department Name</span>
                            <span className="text-slate-800 font-semibold">: {formData.departmentName}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-medium">Month</span>
                            <span className="text-slate-800 font-semibold">: {formData.month}</span>
                        </div>

                        {/* Payment Date Input */}
                        <div className="grid grid-cols-2 text-sm items-center">
                            <span className="text-slate-500 font-medium">Payment Date</span>
                            <div className="flex items-center gap-1">
                                : <input
                                    type="date"
                                    value={formData.paymentDate}
                                    className="ml-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium"
                                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Status Select */}
                        <div className="grid grid-cols-2 text-sm items-center">
                            <span className="text-slate-500 font-medium">Status</span>
                            <div className="flex items-center gap-1">
                                : <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={`ml-1 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider cursor-pointer border-none outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300 ${["draft", "pending"].includes(formData.status?.toLowerCase())
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-emerald-100 text-emerald-800"
                                        }`}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                </select>
                            </div>
                        </div>

                        {/* Deductions Toggle & Section */}
                        <div className="pt-2">
                            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 w-full mb-4 border border-slate-100">
                                <input
                                    type="checkbox"
                                    id="enableDeductions"
                                    checked={enableDeductions}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                                    onChange={(e) => setEnableDeductions(e.target.checked)}
                                />
                                <label htmlFor="enableDeductions" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                    Enable Deduction Inputs
                                </label>
                            </div>

                            {enableDeductions ? (
                                <div className="grid grid-cols-2 gap-3 animate-slide-up">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Tax</label>
                                        <input
                                            type="number"
                                            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            value={formData.tax}
                                            onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Insurance</label>
                                        <input
                                            type="number"
                                            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            value={formData.insurance}
                                            onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Other's Deductions</label>
                                        <input
                                            type="number"
                                            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            value={formData.otherDeductions}
                                            onChange={(e) => setFormData({ ...formData, otherDeductions: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Late Deductions</label>
                                        <input
                                            type="number"
                                            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            value={formData.lateDeduction}
                                            onChange={(e) => setFormData({ ...formData, lateDeduction: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Leave Deductions</label>
                                        <input
                                            type="number"
                                            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            value={formData.leaveDeduction}
                                            onChange={(e) => setFormData({ ...formData, leaveDeduction: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-emerald-600 block mb-1">Gross Salary</label>
                                        <input
                                            type="text"
                                            className="w-full border-2 border-emerald-200 bg-emerald-50/30 px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 "
                                            value={formData.grossSalary}
                                            onChange={(e) => setFormData({ ...formData, grossSalary: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-row justify-center items-end gap-4 max-w-2xl mx-auto animate-slide-up">
                                        {/* Gross Salary Input */}
                                        <div className="w-1/2">
                                            <label className="text-xs font-semibold text-emerald-600 block mb-1">
                                                Gross Salary
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border-2 border-emerald-200 bg-emerald-50/30 px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 focus:outline-none focus:border-emerald-400"
                                                value={formData.grossSalary}
                                                onChange={(e) => setFormData({ ...formData, grossSalary: e.target.value })}
                                            />
                                        </div>

                                        {/* Delete Button */}
                                        <div className="w-1/2">
                                            <button
                                                className="w-full border-2 border-rose-200 bg-rose-50/50 hover:bg-rose-100 px-3 py-2 rounded-lg text-sm font-bold text-rose-700 transition-colors"
                                                onClick={() => handleDelete()}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </>



                            )}
                        </div>
                    </div>

                    {/* Right Column: Calculations & Form Submit */}
                    <div className="grid-cols-1 text-center flex justify-center items-center animate-slide-up bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex flex-col items-center w-full max-w-xs">
                            <h2 className='font-bold text-slate-400 uppercase tracking-wider text-sm mb-2'>Net Salary Summary</h2>

                            <div className='font-black text-4xl text-slate-800 tracking-tight mb-8 flex items-center justify-center gap-1'>
                                <span className="text-emerald-500 font-medium text-3xl">+</span>
                                <CountUp
                                    end={netSalary}
                                    duration={0.5}
                                    separator=','
                                    preserveValue
                                />
                                <span className="text-lg font-bold text-slate-500 ml-1">KS</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => { handleUpdate() }}
                                className='w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98] transition-all duration-150 text-base'
                            >
                                Update Payroll Record
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default Payroll_EditForm;