
import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import CRUD from "./CRUD";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8080/api";

const EmployeeTable = () => {
  const buttonRef = useRef(null);
  const rowRef = useRef(null);
  const activeRowRef = useRef(null);

  // =========================
  // Get logged-in user
  // =========================
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userRole = String(
    user?.role || user?.roles || user?.authority || ""
  )
    .trim()
    .toUpperCase();

  const isHR =
    userRole === "HR" ||
    userRole === "ROLE_HR";

  // =========================
  // States
  // =========================
  const [selectionMode, setSelectionMode] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    positionId: "",
    departmentId: "",
    status: "",
  });

  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const [popupPos, setPopupPos] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  const inputClass =
    "w-full border border-gray-300 px-3 py-1.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

 
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });



  const fetchEmployees = async () => {
    try {
      const authHeader = getAuthHeader();

      const [resEmp, resDept, resPos] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/findAllEmployees2`,
          authHeader
        ),

        axios.get(
          `${API_BASE_URL}/findDepartments`,
          authHeader
        ),

        axios.get(
          `${API_BASE_URL}/findPositions`,
          authHeader
        ),
      ]);

      setDepartments(resDept.data);
      setPositions(resPos.data);
      setData(resEmp.data);
    } catch (err) {
      console.error(
        "Failed to fetch employees:",
        err
      );
    }
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rowRef.current &&
        !rowRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsAdding(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    fetchEmployees();

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const statusOptions = [
    "ACTIVE",
    "LEAVE",
    "INACTIVE",
  ];

  
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete these employees?"
    );

    if (!isConfirmed) return;

    try {
      const ids = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);

      const res = await axios.delete(
        `${API_BASE_URL}/deleteEmployeesById`,
        {
          ...getAuthHeader(),
          data: ids,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text:
          res.data ||
          "Employees deleted successfully",
      });

      fetchEmployees();

      setSelectionMode(false);
      setRowSelection({});
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.response?.data ||
          error.message ||
          "Something went wrong",
      });
    }
  };

  const handleUpdate = async () => {
  
    if (!isHR) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text:
          "Only HR can update employee information.",
      });

      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/updateEmployee`,
        editData,
        getAuthHeader()
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text:
          res.data ||
          "Employee updated successfully",
      });

      setEditRowId(null);
      setEditData({});
      setPopupPos(null);
      setSelectedRow(null);
      setActiveRow(null);

      fetchEmployees();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data ||
          error.message ||
          "Something went wrong",
      });
    }
  };


  const handleSave = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to add this new employee?"
    );

    if (!isConfirmed) return;

    try {
      await axios.post(
        `${API_BASE_URL}/addEmployee`,
        newEmployee,
        getAuthHeader()
      );

      Swal.fire({
        icon: "success",
        title: "Added Employee",
        text: newEmployee.name,
      });

      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        departmentId: "",
        positionId: "",
        status: "",
      });

      setIsAdding(false);

      fetchEmployees();
    } catch (error) {
      console.error(
        "Failed to add employee:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Add Failed",
        text:
          error.response?.data ||
          "Failed to add employee",
      });
    }
  };

  
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
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
        accessorKey: "phone",
        header: "Phone",
      },

      {
        accessorKey: "positionTitle",
        header: "Position",
      },

      {
        accessorKey: "departmentName",
        header: "Department",
      },

      {
        accessorKey: "status",
        header: "Status",

        cell: (info) => {
          const val =
            info.getValue() || "";

          const isActive =
            val.toLowerCase() ===
            "active";

          return (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                isActive
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {val}
            </span>
          );
        },
      },
    ],
    []
  );

 
  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      globalFilter,
      rowSelection,
    },

    onRowSelectionChange:
      setRowSelection,

    onSortingChange:
      setSorting,

    onGlobalFilterChange:
      setGlobalFilter,

    enableRowSelection: true,

    getCoreRowModel:
      getCoreRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),

    getSortedRowModel:
      getSortedRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

     
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) =>
            setGlobalFilter(
              e.target.value
            )
          }
          className="text-sm w-full md:w-72 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <CRUD
          ref={buttonRef}

          buttonAdd={() =>
            setIsAdding(
              (prev) => !prev
            )
          }

          buttonDelete={() =>
            setSelectionMode(true)
          }
        />

      </div>

      <div className="overflow-x-auto relative">

      
        {selectionMode && (
          <div className="flex justify-center items-center gap-3 p-3 bg-red-50 border-b border-red-100">

            <h3 className="text-sm font-medium text-gray-800">
              {
                table
                  .getSelectedRowModel()
                  .rows.length
              }{" "}
              selected
            </h3>

            <button
              className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
              onClick={handleDelete}
            >
              Delete Selected
            </button>

            <button
              className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              onClick={() => {
                setSelectionMode(false);
                setRowSelection({});
              }}
            >
              Cancel
            </button>

          </div>
        )}

      
        <table className="w-full text-left border-collapse">

          <thead className="bg-gray-50 border-b border-gray-200">

            {table
              .getHeaderGroups()
              .map((headerGroup) => (
                <tr key={headerGroup.id}>

                  {selectionMode && (
                    <th className="px-4 text-center">

                      <input
                        type="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={
                          table.getToggleAllRowsSelectedHandler()
                        }
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />

                    </th>
                  )}

                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >

                        <div className="flex items-center gap-2">

                          {flexRender(
                            header
                              .column
                              .columnDef
                              .header,
                            header.getContext()
                          )}

                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[
                            header.column.getIsSorted()
                          ] ?? null}

                        </div>

                      </th>
                    )
                  )}

                </tr>
              ))}

          </thead>

          <tbody className="divide-y divide-gray-100">

            {/* =========================
                Inline Add Row
            ========================= */}
            {isAdding && (
              <tr
                ref={rowRef}
                className="bg-blue-50/40"
              >

                {selectionMode && (
                  <td />
                )}

                <td className="px-6 py-3 font-medium text-sm text-gray-400">
                  Auto
                </td>

                <td className="px-6 py-2">

                  <input
                    className={inputClass}
                    placeholder="Name"
                    value={
                      newEmployee.name
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        name:
                          e.target.value,
                      })
                    }
                  />

                </td>

                <td className="px-6 py-2">

                  <input
                    className={inputClass}
                    placeholder="Email"
                    value={
                      newEmployee.email
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        email:
                          e.target.value,
                      })
                    }
                  />

                </td>

                <td className="px-6 py-2">

                  <input
                    className={inputClass}
                    placeholder="Phone"
                    value={
                      newEmployee.phone
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        phone:
                          e.target.value,
                      })
                    }
                  />

                </td>

                <td className="px-6 py-2">

                  <select
                    className={inputClass}
                    value={
                      newEmployee.positionId
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        positionId:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select Position...
                    </option>

                    {positions.map(
                      (p) => (
                        <option
                          key={p.id}
                          value={p.id}
                        >
                          {p.title}
                        </option>
                      )
                    )}

                  </select>

                </td>

                <td className="px-6 py-2">

                  <select
                    className={inputClass}
                    value={
                      newEmployee.departmentId
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        departmentId:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select Department...
                    </option>

                    {departments.map(
                      (d) => (
                        <option
                          key={d.id}
                          value={d.id}
                        >
                          {d.name}
                        </option>
                      )
                    )}

                  </select>

                </td>

                <td className="px-6 py-2">

                  <select
                    className={inputClass}
                    value={
                      newEmployee.status
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        status:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">
                      Status...
                    </option>

                    {statusOptions.map(
                      (s) => (
                        <option
                          key={s}
                          value={s}
                        >
                          {s}
                        </option>
                      )
                    )}

                  </select>

                </td>

                <td className="px-6 py-2">

                  <button
                    onClick={
                      handleSave
                    }
                    className="w-full bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>

                </td>

              </tr>
            )}

            {/* =========================
                Table Rows
            ========================= */}
            {table
              .getRowModel()
              .rows
              .map((row) => {

                const actualDbId =
                  row.original.id;

                const isEditingThisRow =
                  editRowId ===
                  actualDbId;

                return (
                  <tr
                    key={row.id}

                    className={`hover:bg-blue-50/50 transition-colors duration-150 ${
                      isEditingThisRow
                        ? "bg-amber-50/40"
                        : ""
                    }`}

                    // =================================
                    // ONLY HR CAN OPEN UPDATE/CANCEL
                    // =================================
                    onClick={(e) => {

                      if (!isHR) {
                        return;
                      }

                      if (
                        isEditingThisRow
                      ) {
                        return;
                      }

                      const rect =
                        e.currentTarget.getBoundingClientRect();

                      setSelectedRow(row);

                      setPopupPos({
                        top:
                          rect.top,

                        left:
                          rect.left,

                        width:
                          rect.width,

                        height:
                          rect.height,
                      });

                    }}

                    onKeyDown={(e) => {

                      if (!isHR) {
                        return;
                      }

                      if (
                        e.key === "Enter"
                      ) {

                        e.preventDefault();

                        if (
                          window.confirm(
                            "Do you want to update Data?"
                          )
                        ) {
                          handleUpdate();
                        }

                      } else if (
                        e.key === "Escape"
                      ) {

                        setEditRowId(
                          null
                        );

                        setActiveRow(
                          null
                        );

                        setPopupPos(
                          null
                        );

                        setSelectedRow(
                          null
                        );
                      }

                    }}
                  >

                    {/* =========================
                        Selection Checkbox
                    ========================= */}
                    {selectionMode && (
                      <td
                        className="px-4 text-center"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >

                        <input
                          type="checkbox"
                          checked={
                            row.getIsSelected()
                          }
                          onChange={
                            row.getToggleSelectedHandler()
                          }
                          className="rounded border-gray-300 focus:ring-blue-500"
                        />

                      </td>
                    )}

                    {/* =========================
                        Cells
                    ========================= */}
                    {row
                      .getVisibleCells()
                      .map((cell) => {

                        const columnId =
                          cell.column.id;

                        return (
                          <td
                            key={cell.id}
                            className="px-6 py-4 text-sm text-gray-700"
                          >

                            {isEditingThisRow ? (

                              <div
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >

                                {/* Department */}
                                {columnId ===
                                "departmentName" ? (

                                  <select
                                    className={inputClass}
                                    value={
                                      editData.departmentId ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        departmentId:
                                          e.target.value,
                                      })
                                    }
                                  >

                                    <option value="">
                                      Select Department
                                    </option>

                                    {departments.map(
                                      (d) => (
                                        <option
                                          key={
                                            d.id
                                          }
                                          value={
                                            d.id
                                          }
                                        >
                                          {d.name}
                                        </option>
                                      )
                                    )}

                                  </select>

                                ) : columnId ===
                                  "positionTitle" ? (

                                  /* Position */

                                  <select
                                    className={inputClass}
                                    value={
                                      editData.positionId ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        positionId:
                                          e.target.value,
                                      })
                                    }
                                  >

                                    <option value="">
                                      Select Position
                                    </option>

                                    {positions.map(
                                      (p) => (
                                        <option
                                          key={
                                            p.id
                                          }
                                          value={
                                            p.id
                                          }
                                        >
                                          {p.title}
                                        </option>
                                      )
                                    )}

                                  </select>

                                ) : columnId ===
                                  "phone" ? (

                                  /* Phone */

                                  <input
                                    ref={
                                      activeRowRef
                                    }
                                    className={
                                      inputClass
                                    }
                                    value={
                                      editData[
                                        columnId
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        [columnId]:
                                          e.target.value,
                                      })
                                    }
                                  />

                                ) : columnId ===
                                  "status" ? (

                                  /* Status */

                                  <select
                                    className={inputClass}
                                    value={
                                      editData.status ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        status:
                                          e.target.value,
                                      })
                                    }
                                  >

                                    {statusOptions.map(
                                      (s) => (
                                        <option
                                          key={
                                            s
                                          }
                                          value={
                                            s
                                          }
                                        >
                                          {s}
                                        </option>
                                      )
                                    )}

                                  </select>

                                ) : columnId ===
                                  "id" ? (

                                  /* ID */

                                  <span className="font-semibold text-gray-500">
                                    {
                                      editData.id
                                    }
                                  </span>

                                ) : (

                                  /* Name / Email */

                                  <input
                                    className={
                                      inputClass
                                    }
                                    value={
                                      editData[
                                        columnId
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        [columnId]:
                                          e.target.value,
                                      })
                                    }
                                  />

                                )}

                              </div>

                            ) : (

                              flexRender(
                                cell.column
                                  .columnDef.cell,
                                cell.getContext()
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

        {/* =========================
            HR ONLY Action Popup
        ========================= */}
        {popupPos &&
          !activeRow &&
          isHR && (

            <div
              className="fixed flex gap-2 bg-white shadow-xl border border-gray-100 p-2 rounded-lg z-50 animate-in fade-in"

              style={{
                top:
                  popupPos.top +
                  popupPos.height /
                    2,

                left:
                  popupPos.left +
                  popupPos.width /
                    2,

                transform:
                  "translate(-50%, 90%)",
              }}
            >

              {/* =========================
                  UPDATE
              ========================= */}
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"

                onClick={(e) => {

                  e.stopPropagation();

                  if (!isHR) {
                    return;
                  }

                  const targetDbId =
                    selectedRow
                      .original.id;

                  setActiveRow(
                    targetDbId
                  );

                  setEditRowId(
                    targetDbId
                  );

                  setEditData({
                    ...selectedRow.original,
                  });

                  setTimeout(() => {
                    activeRowRef.current?.focus();
                  }, 100);

                }}
              >
                Update
              </button>

              {/* =========================
                  CANCEL
              ========================= */}
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"

                onClick={(e) => {

                  e.stopPropagation();

                  setEditRowId(
                    null
                  );

                  setPopupPos(
                    null
                  );

                  setSelectedRow(
                    null
                  );

                  setActiveRow(
                    null
                  );

                }}
              >
                Cancel
              </button>

            </div>
          )}

      </div>

      {/* =========================
          Pagination
      ========================= */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">

        <div className="text-sm text-gray-500">

          Showing{" "}

          <span className="font-medium">
            {
              table
                .getRowModel()
                .rows.length
            }
          </span>{" "}

          results

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              table.previousPage()
            }
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"

            disabled={
              !table.getCanPreviousPage()
            }
          >
            Previous
          </button>

          <button
            onClick={() =>
              table.nextPage()
            }
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"

            disabled={
              !table.getCanNextPage()
            }
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default EmployeeTable;



