import React, { useEffect, useState } from "react";
import "../css/Member_And_Task.css";
import axios from "axios";

const Reports = () => {
  // =========================
  // MONTH FILTER
  // =========================
  const [selectedMonth, setSelectedMonth] = useState("current");

  const months = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    months.push({
      value: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,
      label: date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    });
  }

  // =========================
  // STATES
  // =========================
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const TOKEN = localStorage.getItem("token");

    if (!TOKEN) {
      console.log("No token found");
      setError("No token found");
      return;
    }

    const fetchData = async () => {
      try {
        const [memberRes, taskRes] = await Promise.all([
          axios.get(
            "http://localhost:8080/api/membersForTask",
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          ),

          axios.get(
            "http://localhost:8080/api/membersTask",
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          ),
        ]);

        const memberData = memberRes.data;
        const taskData = taskRes.data;

        console.log("member_data:", memberData);
        console.log("task_data:", taskData);

        setMembers(memberData);
        setTasks(taskData);
        setError("");
      } catch (err) {
        console.error("Failed to fetch reports:", err);

        setError(
          err.response?.data ||
            err.message ||
            "Failed to load reports"
        );
      }
    };

    fetchData();
  }, []);

  // =========================
  // FILTER MEMBERS BY ROLE
  // =========================
  const hr =
    members.filter(
      (m) => m.role?.toLowerCase() === "hr"
    ) || [];

  const media =
    members.filter(
      (m) => m.role?.toLowerCase() === "media"
    ) || [];

  const employee =
    members.filter(
      (m) => m.role?.toLowerCase() === "employee"
    ) || [];

  const sale =
    members.filter(
      (m) => m.role?.toLowerCase() === "sale"
    ) || [];

  // =========================
  // FILTER TASKS BY MONTH
  // =========================
  const filteredTasks = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    const taskDate = new Date(task.dueDate);
    const now = new Date();

    // This Month
    if (selectedMonth === "current") {
      return (
        taskDate.getFullYear() === now.getFullYear() &&
        taskDate.getMonth() === now.getMonth()
      );
    }

    // Last Month
    if (selectedMonth === "last") {
      const lastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      return (
        taskDate.getFullYear() === lastMonth.getFullYear() &&
        taskDate.getMonth() === lastMonth.getMonth()
      );
    }

    // Specific Month
    const [year, month] = selectedMonth.split("-");

    return (
      taskDate.getFullYear() === Number(year) &&
      taskDate.getMonth() === Number(month) - 1
    );
  });

  // =========================
  // FILTER BY SELECTED MEMBER
  // =========================
  const member_Task = filteredTasks.filter(
    (task) =>
      Number(task.userId) === Number(selected?.id)
  );

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <div className="dashboard">
        {error && (
          <p className="text-red-500 mb-3">
            {error}
          </p>
        )}

        {/* =========================
            LEFT PANEL
        ========================= */}
        <div className="left-panel">
          {/* HR */}
          {hr.length > 0 && <h3>HR</h3>}

          {hr.map((m) => (
            <p
              key={m.id}
              className={`member-item ${
                selected?.id === m.id ? "active" : ""
              }`}
              onClick={() => setSelected(m)}
            >
              {m.name}
            </p>
          ))}

          {/* MEDIA */}
          {media.length > 0 && <h3>Media</h3>}

          {media.map((m) => (
            <p
              key={m.id}
              className={`member-item ${
                selected?.id === m.id ? "active" : ""
              }`}
              onClick={() => setSelected(m)}
            >
              {m.name}
            </p>
          ))}

          {/* EMPLOYEE */}
          {employee.length > 0 && <h3>Employee</h3>}

          {employee.map((m) => (
            <p
              key={m.id}
              className={`member-item ${
                selected?.id === m.id ? "active" : ""
              }`}
              onClick={() => setSelected(m)}
            >
              {m.name}
            </p>
          ))}

          {/* SALE */}
          {sale.length > 0 && <h3>Sale</h3>}

          {sale.map((m) => (
            <p
              key={m.id}
              className={`member-item ${
                selected?.id === m.id ? "active" : ""
              }`}
              onClick={() => setSelected(m)}
            >
              {m.name}
            </p>
          ))}
        </div>

        {/* =========================
            WORKSPACE
        ========================= */}
        <div className="workspace-content">

          {/* MONTH FILTER */}
          <div className="flex items-center gap-3 mb-5">
            <label
              htmlFor="month"
              className="text-sm font-semibold text-gray-700 whitespace-nowrap"
            >
              Select Month
            </label>

            <div className="relative">
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(e.target.value)
                }
                className="
                  appearance-none
                  w-52
                  px-4
                  py-2.5
                  pr-10
                  text-sm
                  font-medium
                  text-gray-800
                  bg-white
                  border
                  border-gray-300
                  rounded-lg
                  shadow-sm
                  outline-none
                  cursor-pointer
                  transition
                  duration-200
                  hover:border-gray-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >
                <option value="current">
                  This Month
                </option>

                <option value="last">
                  Last Month
                </option>

                <optgroup label="Months">
                  {months.map((month, index) => (
                    <option
                      key={`${month.value}-${index}`}
                      value={month.value}
                    >
                      {month.label}
                    </option>
                  ))}
                </optgroup>
              </select>

              <span
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  text-lg
                "
              >
                ▾
              </span>
            </div>
          </div>

          {/* =========================
              NO MEMBER SELECTED
          ========================= */}
          {!selected ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-slate-500">
              <div className="text-3xl mb-2">
                👤
              </div>

              <p className="text-base font-medium">
                Select a member to view tasks
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans">

              {/* MEMBER NAME */}
              <h2 className="text-2xl font-bold text-slate-800 pb-2 border-b border-slate-200">
                {selected.nickname || selected.name}
              </h2>

              {/* =========================
                  NO TASK
              ========================= */}
              {member_Task.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-slate-500">
                  <div className="text-3xl mb-2">
                    📋
                  </div>

                  <p className="text-base font-medium">
                    There is no task for this month.
                  </p>
                </div>
              ) : (
                /* =========================
                   TASK LIST
                ========================= */
                <div className="grid grid-cols-2 gap-3">
                  {member_Task.map((task) => (
                    <article
                      key={task.taskId}
                      className="
                        bg-white
                        border
                        border-slate-200
                        rounded-lg
                        p-5
                        shadow-sm
                        hover:shadow-md
                        hover:-translate-y-0.5
                        transition-all
                        duration-200
                      "
                    >
                      <div className="flex flex-col items-start gap-2">

                        {/* DATE + REPORT TYPE */}
                        <div className="min-w-fit flex gap-2 justify-center">

                          <span
                            className="
                              inline-block
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              text-blue-600
                              bg-blue-50
                              border
                              border-blue-100
                              rounded-md
                              text-center
                            "
                          >
                            {`${task.dueDate} • ${task.timeRange}`}
                          </span>

                          <div
                            className={`font-medium text-sm border px-2 py-1.5 rounded-lg ${
                              task.report_type === "morning"
                                ? "bg-green-50 text-green-400 border-green-200"
                                : task.report_type === "night"
                                ? "bg-red-50 text-red-400 border-red-200"
                                : "bg-gray-50 text-gray-400 border-gray-200"
                            }`}
                          >
                            {task.report_type}
                          </div>

                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-slate-700 text-sm leading-relaxed m-0">
                          {task.description ? (
                            task.description
                              .split("\n")
                              .map((line, index) => (
                                <span key={index}>
                                  {line}
                                  <br />
                                </span>
                              ))
                          ) : (
                            <span className="text-slate-400 italic">
                              No details provided
                            </span>
                          )}
                        </p>

                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;