import React, { useEffect, useState } from "react";
import "../css/Member_And_Task.css";
import axios from "axios";

const Reports = () => {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const TOKEN = localStorage.getItem("token");

      if (!TOKEN) {
        setError("No token found. Please login again.");
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        };

        const [membersRes, tasksRes] = await Promise.all([
          axios.get(
            "http://localhost:8080/api/membersForTask",
            config
          ),
          axios.get(
            "http://localhost:8080/api/membersTask",
            config
          ),
        ]);

        setMembers(membersRes.data);
        setTasks(tasksRes.data);

        console.log("Members:", membersRes.data);
        console.log("Tasks:", tasksRes.data);

      } catch (err) {
        console.error("API Error:", err);

        console.error(
          "Status:",
          err.response?.status
        );

        console.error(
          "Response:",
          err.response?.data
        );

        setError(
          err.response?.data?.message ||
          "Failed to load data."
        );
      }
    };

    fetchData();
  }, []);

  // -------------------------
  // Filter members by role
  // -------------------------

  const hr = members.filter(
    (m) => m.role?.toLowerCase() === "hr"
  );

  const media = members.filter(
    (m) => m.role?.toLowerCase() === "media"
  );

  const employee = members.filter(
    (m) => m.role?.toLowerCase() === "employee"
  );

  const sale = members.filter(
    (m) => m.role?.toLowerCase() === "sale"
  );

  // -------------------------
  // Get selected member tasks
  // -------------------------

  const memberTasks = tasks.filter(
    (task) =>
      Number(task.userId) === Number(selected?.id)
  );

  return (
    <div className="dashboard">

      {/* Error */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* =====================
          LEFT PANEL
      ====================== */}

      <div className="left-panel">

        {/* HR */}
        {hr.length > 0 && (
          <>
            <h3>HR</h3>

            {hr.map((member) => (
              <p
                key={member.id}
                className={`member-item ${
                  selected?.id === member.id
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelected(member)}
              >
                {member.name}
              </p>
            ))}
          </>
        )}

        {/* Media */}
        {media.length > 0 && (
          <>
            <h3>Media</h3>

            {media.map((member) => (
              <p
                key={member.id}
                className={`member-item ${
                  selected?.id === member.id
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelected(member)}
              >
                {member.name}
              </p>
            ))}
          </>
        )}

        {/* Employee */}
        {employee.length > 0 && (
          <>
            <h3>Employee</h3>

            {employee.map((member) => (
              <p
                key={member.id}
                className={`member-item ${
                  selected?.id === member.id
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelected(member)}
              >
                {member.name}
              </p>
            ))}
          </>
        )}

        {/* Sale */}
        {sale.length > 0 && (
          <>
            <h3>Sale</h3>

            {sale.map((member) => (
              <p
                key={member.id}
                className={`member-item ${
                  selected?.id === member.id
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelected(member)}
              >
                {member.name}
              </p>
            ))}
          </>
        )}

      </div>

      {/* =====================
          WORKSPACE
      ====================== */}

      <div className="workspace-content">

        <button
          className="btn btn-primary"
          onClick={() => {
            // Add member logic here
          }}
        >
          Add Member
        </button>

        {/* No member selected */}
        {!selected ? (
          <div className="empty-state">
            <p>Select a member to view tasks</p>
          </div>
        ) : (
          <>
            {/* Member name */}
            <h2 className="member-heading">
              {selected.nickname || selected.name}
            </h2>

            {/* No tasks */}
            {memberTasks.length === 0 ? (
              <div className="empty-state">
                <p>There is no task yet.</p>
              </div>
            ) : (
              <div className="tasks-container">

                {memberTasks.map((task) => {

                  const priority =
                    task.priority?.toLowerCase() || "normal";

                  return (
                    <div
                      key={task.taskId}
                      className={`task-card ${priority}`}
                    >

                      <div className="task-card-header">
                        <div
                          className={`status-indicator ${priority}`}
                        ></div>
                      </div>

                      <div className="task-card-body">

                        <span className="task-meta-title">
                          {task.dueDate}{" "}
                          {task.title && (
                            <>: ({task.title})</>
                          )}
                        </span>

                        <p className="task-desc-short">
                          {task.desc
                            ? task.desc
                                .split("\n")
                                .map((line, index) => (
                                  <span key={index}>
                                    {line}
                                    <br />
                                  </span>
                                ))
                            : "No details"}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};

export default Reports;