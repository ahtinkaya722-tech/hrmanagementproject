import React, { useEffect, useState, useMemo, useRef } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";

import Swal from "sweetalert2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { attendance_data_header } from "../js/attendancet_Table_Data";
import { attendance_data } from "../js/attendancet_Table_Data";

const A_Table = ({ records }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
      },

      {
        accessorKey: "checkIn",
        header: "Check In",
      },

      {
        accessorKey: "checkOut",
        header: "Check Out",
      },

      
      {
        accessorKey: "workingHour",
        header: "Working Hour",
      },

      {
        accessorKey: "status",
        header: "Status",
        cell:(info) =>{
          const val = info.getValue() ?info.getValue().toLowerCase() : "not checked in";
       
          const valStyle= {
            present : "text-green-600 bg-green-100",
            late : "text-yellow-600 bg-yellow-100",
            absent : "text-red-600 bg-red-100",

          }
          return (
            
             <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
              valStyle[val]  
              }`}
            >
              {val}
            </span>

          )

        }
      },

    ],
    [],
  );

  const table = useReactTable({
      data: records ?? [],
    columns,

    state: {
      sorting,
      globalFilter,
      rowSelection,
    },

    onRowSelectionChange: setRowSelection,

    onSortingChange: setSorting,

    onGlobalFilterChange: setGlobalFilter,

    enableRowSelection: true,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
  

              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => {


            return (
              <tr
                key={row.id}
                className={`hover:bg-blue-50/50 transition-colors duration-150`}
          
              >
                {row.getVisibleCells().map((cell) => {
           

                  return (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                    
                        {
                      (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default A_Table;
