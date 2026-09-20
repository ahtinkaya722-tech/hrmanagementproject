import React, { useState, useEffect, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import PDFD_Button from "./PDFD_Button";

const PayrollTable = ({ data ,onEdit}) => {
  
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,

    });
    const formatMoney = (value) =>
        new Intl.NumberFormat("en-US").format(value || 0);



    const columns = useMemo(() => [
        {
            accessorKey: "employeeName",
            header: "Employee",
        },
        {
            accessorKey: "departmentName",
            header: "Department",
        },
        {
            accessorKey: "positionName",
            header: "Position",
        },
        {
            accessorKey: "grossSalary",
            header: "Gross Salary",
            cell: ({ row }) => (
                <span>
                    {formatMoney(row.original.grossSalary)} KS
                </span>
            ),
        },
        {
            accessorKey: "deductionAmount",
            header: "Deduction",
            cell: ({ row }) => (
                <span className="text-red-600 font-medium">
                    {formatMoney(row.original.deductionAmount)} KS
                </span>
            ),
        },
        {
            accessorKey: "netSalary",
            header: "Net Salary",
            cell: ({ row }) => (
                <span className="text-green-600 font-semibold">
                    {formatMoney(row.original.netSalary)} KS
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;

                return (
                    <span
                        className={`px-5 py-3 rounded-lg text-xs font-semibold
                        ${status === "PAID"
                                ? "bg-green-100 text-green-700 "
                                : status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {status === "PAID"? "Paid" : "Pending"}
                    </span>
                );
            },
        },
        {
            accessorKey: "paymentDate",
            header: "Payment Date",
            cell: ({ row }) => row.original.paymentDate || "-",
        },
        {
            id: "action",
            header: "Action",
            cell: ({row}) => (
             <div className="flex items-center gap-2">
    {/* View Button */}
    <button className="inline-flex items-center justify-center bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 shadow-sm active:scale-[0.97] transition-all duration-150 text-xs">
        View
    </button>
    
    {/* Edit Button */}
    <button 
        onClick={() => onEdit(row.original)} 
        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow-sm shadow-blue-500/10 active:scale-[0.97] transition-all duration-150 text-xs"
    >
        Edit
    </button>
 
    {/* PDF Button Wrap */}
    {/* Make sure inside <PDFD_Button />, your inner button utilizes a height/padding that matches py-1.5 (approx 32px tall overall) */}
    <div className="inline-flex active:scale-[0.97] transition-transform duration-150">
        <PDFD_Button data={row.original}/>
    </div>
</div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: data || [],
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white  animate-slide-up">
            <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}

                                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center gap-2">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                        {{
                                            asc: " asc",
                                            desc: " desc",
                                        }[header.column.getIsSorted()] ?? null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className="hover:bg-gray-50 transition"
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className="px-6 py-4 text-sm"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {data?.length == 0 && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-10 text-gray-500"
                            >
                                No payroll data found.
                            </td>
                        </tr>
                    )}



                </tbody>

            </table>
            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium">{table.getRowModel().rows.length}</span>{" "}
                    results
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => table.nextPage()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollTable;