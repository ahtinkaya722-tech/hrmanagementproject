import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Swal from "sweetalert2";

const PositionTable = () => {
  const TOKEN = localStorage.getItem("token");

  // Table & Data State
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  // Inline Edit State
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [popupPos, setPopupPos] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  // Modal State
  const [addingBox, setAddingBox] = useState(false);
  const [addAccount, setAddAccount] = useState({
    employeeId: "",
    username: "",
    password: "",
    role: "Admin",
  });

  const popupRef = useRef(null);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8080/api/findEmployeesForPosition", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupPos(null);
        setSelectedRow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:8080/api/updateEmployee", editData, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: res.data || "Employee updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setEditRowId(null);
      setEditData({});
      setActiveRow(null);
      setPopupPos(null);
      fetchEmployees();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data || error.message,
      });
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Create Account?",
        text: "Create login credentials for this employee?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Create",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2563eb",
      });

      if (!result.isConfirmed) return;

      const response = await axios.post("http://localhost:8080/api/createAccount", addAccount, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: response.data,
        timer: 2000,
        showConfirmButton: false,
      });

      setAddingBox(false);
      fetchEmployees();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Account creation failed",
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => <span className="font-semibold text-gray-700">#{info.getValue()}</span>,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "acc",
        header: "User Acc",
        cell: (info) => {
          const val = info.getValue();
          return val === "Not Set" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              Not Set
            </span>
          ) : (
            <span className="font-medium text-gray-800">{val}</span>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <span className="capitalize font-medium text-gray-600">{info.getValue() || "N/A"}</span>
        ),
      },
      {
        accessorKey: "create_acc",
        header: "Account Action",
        cell: ({ row }) => {
          const employee = row.original;
          if (employee.acc === "Not Set") {
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAddAccount({
                    username: employee.email || "",
                    password: "",
                    role: "Admin",
                    employeeId: employee.id || "",
                  });
                  setAddingBox(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95"
              >
                + Add Account
              </button>
            );
          }
          return <span className="text-xs text-emerald-600 font-semibold">Account Active</span>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header Controls */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search Employee..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="text-sm w-full md:w-72 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
        />
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/80 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
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

          <tbody className="divide-y divide-gray-100 text-sm">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                  editRowId === row.id ? "bg-blue-50/60" : ""
                }`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.stopPropagation();
                  setSelectedRow(row);
                  setPopupPos({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    Swal.fire({
                      title: "Save Changes?",
                      text: "Confirm updating employee information.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, Update",
                    }).then((res) => {
                      if (res.isConfirmed) handleUpdate();
                    });
                  } else if (e.key === "Escape") {
                    setEditRowId(null);
                    setActiveRow(null);
                    setPopupPos(null);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const columnId = cell.column.id;

                  return (
                    <td key={cell.id} className="px-6 py-3.5 whitespace-nowrap">
                      {editRowId === row.id ? (
                        columnId === "role" ? (
                          <select
                            className="text-sm p-1.5 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={editData.departmentId || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, departmentId: e.target.value })
                            }
                          >
                            <option value="">Select Department</option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        ) : columnId === "create_acc" ? (
                          <span className="text-xs font-semibold text-gray-500">
                            Editing Row...
                          </span>
                        ) : (
                          <input
                            className="border border-gray-300 px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={editData[columnId] || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, [columnId]: e.target.value })
                            }
                          />
                        )
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Floating Quick Action Popup */}
        {popupPos && !activeRow && selectedRow?.original.acc !== "Not Set" && (
          <div
            ref={popupRef}
            className="fixed flex gap-2 bg-white shadow-xl border border-gray-100 p-1.5 rounded-xl z-40 animate-fade-in"
            style={{
              top: popupPos.top + popupPos.height / 2,
              left: popupPos.left + popupPos.width / 2,
              transform: "translate(-50%, 80%)",
            }}
          >
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-all shadow-xs"
              onClick={(e) => {
                e.stopPropagation();
                setActiveRow(selectedRow.id);
                setEditRowId(selectedRow.id);
                setEditData(selectedRow.original);
              }}
            >
              Update
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setEditRowId(null);
                setPopupPos(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Creation Modal */}
      {addingBox && (
        <div
          className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/40 backdrop-blur-xs"
          onClick={() => setAddingBox(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-gray-800">Create Account Credentials</h2>
              <button
                onClick={() => setAddingBox(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm bg-gray-50 text-gray-500 font-medium outline-none"
                  value={addAccount.username}
                  disabled
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={addAccount.password}
                  onChange={(e) => setAddAccount({ ...addAccount, password: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={addAccount.role}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setAddAccount({ ...addAccount, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="Media">Media</option>
                  <option value="HR">HR</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddingBox(false)}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="text-gray-500">
          Showing <span className="font-semibold text-gray-700">{table.getRowModel().rows.length}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3.5 py-1.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3.5 py-1.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionTable;