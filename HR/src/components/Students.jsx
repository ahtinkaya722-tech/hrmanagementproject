
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const data = [
  {
    id: 1,
    studentCode: "STU001",
    name: "Aung Aung",
    gender: "Male",
    email: "aung@gmail.com",
    phoneNo: "09123456789",
    dateOfBirth: "2005-05-15",
  },
  {
    id: 2,
    studentCode: "STU002",
    name: "Su Su",
    gender: "Female",
    email: "susu@gmail.com",
    phoneNo: "09987654321",
    dateOfBirth: "2004-08-20",
  },
];

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "studentCode", header: "Student Code" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phoneNo", header: "Phone No" },
  { accessorKey: "dateOfBirth", header: "Date of Birth" },
];

function Students() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,

    state: {
      globalFilter,
      sorting,
    },

    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,

    globalFilterFn: "includesString",

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">

      {/* Header and Search */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Student Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Search, sort, and manage student records.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search students..."
          value={globalFilter ?? ""}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            table.setPageIndex(0);
          }}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:w-72"
        />
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {{
                        asc: "🔼",
                        desc: "🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-blue-50/50 even:bg-gray-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-800">
            {table.getFilteredRowModel().rows.length === 0
              ? 0
              : table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                1}
          </span>
          {" "}to{" "}
          <span className="font-medium text-gray-800">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>
          {" "}of{" "}
          <span className="font-medium text-gray-800">
            {table.getFilteredRowModel().rows.length}
          </span>
          {" "}students
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-2 text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

export default Students;
