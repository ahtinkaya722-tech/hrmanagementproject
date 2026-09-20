import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  X,
  Calendar,
  Clock,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { resizeAvatar } from "../js/image_Upload";

const Leave = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const TOKEN = localStorage.getItem("token");

  const [leaveData, setLeaveData] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [requestLeave, setRequestLeave] = useState([]);

  const [leaveBalance, setLeaveBalance] = useState({
    totalAvailableDay: 0,
    usedLeave: 0,
    remainingDay: 0,
  });

  const [formData, setFormData] = useState({
    employeeId: user.employeeId || "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    images: [],
  });

  // =========================
  // HANDLE IMAGE UPLOAD
  // =========================
  const handleImage = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      const base64List = await Promise.all(
        files.map((file) => resizeAvatar(file))
      );

      setImagePreview((prev) => [
        ...prev,
        ...base64List,
      ]);

      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          ...base64List,
        ],
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const handleRemoveImage = (deleteIndex) => {
    setImagePreview((prev) =>
      prev.filter(
        (_, index) => index !== deleteIndex
      )
    );

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, index) => index !== deleteIndex
      ),
    }));
  };

  // =========================
  // FETCH ALL LEAVE DATA
  // =========================
  const fetchLeaveTypes = async () => {
    try {
    

      const [
        resTypes,
        resBalance,
        resRequests,
      ] = await Promise.all([
        // Leave Types
        axios.get(
          "http://localhost:8080/api3/requestLeaveType",
          {
            headers:  {
        Authorization: `Bearer ${TOKEN}`,
          },
          }
        ),

        // Leave Balance
        axios.get(
          "http://localhost:8080/api3/leaveBalance",
          {
headers:  {
        Authorization: `Bearer ${TOKEN}`,
          },
            params: {
              employeeId: user.employeeId,
            },
          }
        ),

        // Leave Requests
        axios.get(
          "http://localhost:8080/api3/findLeaveRequestByEmployeeId",
          {
              headers:  {
           Authorization: `Bearer ${TOKEN}`,
          },
            params: {
              employeeId: user.employeeId,
            },
          }
        ),
      ]);

      console.log(
        "LEAVE TYPES =",
        resTypes.data
      );

      console.log(
        "LEAVE BALANCE =",
        resBalance.data
      );

      console.log(
        "LEAVE REQUESTS =",
        resRequests.data
      );

      setLeaveData(
        resTypes.data || []
      );

      // Handle object OR array response
      const balance = Array.isArray(
        resBalance.data
      )
        ? resBalance.data[0]
        : resBalance.data;

      setLeaveBalance(
        balance || {
          totalAvailableDay: 0,
          usedLeave: 0,
          remainingDay: 0,
        }
      );

      setRequestLeave(
        resRequests.data || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch leave data:",
        error
      );

      if (error.response) {
        console.log(
          "STATUS =",
          error.response.status
        );

        console.log(
          "RESPONSE =",
          error.response.data
        );
      }
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (TOKEN && user.employeeId) {
      fetchLeaveTypes();
    }
  }, []);

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT LEAVE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Submit Leave Request?",
      text: "Are you sure you want to submit this leave request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/api3/addLeaveForm",
        formData,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      await Swal.fire({
        title: "Success!",
        text:
          typeof res.data === "string"
            ? res.data
            : "Leave request submitted successfully.",
        icon: "success",
      });

      // Reset form
      setFormData({
        employeeId: user.employeeId || "",
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
        images: [],
      });

      setImagePreview([]);

      // Refresh data
      fetchLeaveTypes();
    } catch (error) {
      console.error(
        "Submit leave error:",
        error
      );

      if (error.response) {
        console.log(
          "STATUS =",
          error.response.status
        );

        console.log(
          "RESPONSE =",
          error.response.data
        );
      }

      Swal.fire({
        title: "Error!",
        text: "Failed to submit leave request.",
        icon: "error",
      });
    }
  };

  // =========================
  // SELECTED LEAVE TYPE
  // =========================
  const selectedLeaveType = leaveData.find(
    (data) =>
      String(data.id) ===
      String(formData.leaveTypeId)
  );

  // =========================
  // STATUS BADGE
  // =========================
  const leaveStatusBadge = (status) => {
    const styles = {
      PENDING:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",

      APPROVED:
        "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",

      REJECTED:
        "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    };

    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
          styles[status] ||
          "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  // =========================
  // IMAGE SOURCE
  // =========================
  const getImageSrc = (base64String) => {
    if (!base64String) return null;

    if (Array.isArray(base64String)) {
      base64String = base64String[0];
    }

    if (!base64String) return null;

    return base64String.startsWith("data:image")
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;
  };

  // =========================
  // LEAVE STATS
  // =========================
  const leaveStats = [
    {
      label: "Total Casual Leave",
      count: leaveBalance.totalAvailableDay,
      color: "emerald",
    },
    {
      label: "Used Leave",
      count: leaveBalance.usedLeave,
      color: "amber",
    },
    {
      label: "Remaining Leave",
      count: leaveBalance.remainingDay,
      color: "blue",
    },
  ];

  // =========================
  // COLORS
  // =========================
  const colorStyles = {
    emerald: {
      bg: "bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/20",
      border:
        "border-emerald-200/60 dark:border-emerald-800/40",
      text:
        "text-emerald-900 dark:text-emerald-200",
      badgeBg:
        "bg-emerald-100 dark:bg-emerald-900/60",
      badgeText:
        "text-emerald-700 dark:text-emerald-300",
      accent: "bg-emerald-500",
    },

    amber: {
      bg: "bg-amber-50/50 hover:bg-amber-50 dark:bg-amber-950/20",
      border:
        "border-amber-200/60 dark:border-amber-800/40",
      text:
        "text-amber-900 dark:text-amber-200",
      badgeBg:
        "bg-amber-100 dark:bg-amber-900/60",
      badgeText:
        "text-amber-700 dark:text-amber-300",
      accent: "bg-amber-500",
    },

    blue: {
      bg: "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20",
      border:
        "border-blue-200/60 dark:border-blue-800/40",
      text:
        "text-blue-900 dark:text-blue-200",
      badgeBg:
        "bg-blue-100 dark:bg-blue-900/60",
      badgeText:
        "text-blue-700 dark:text-blue-300",
      accent: "bg-blue-500",
    },
  };

  return (
    <div className="px-4 md:px-10 py-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Leave Management
        </h1>

        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          Manage your leave requests and monitor available balances.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {leaveStats.map((item) => {
          const styles =
            colorStyles[item.color];

          return (
            <div
              key={item.label}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${styles.bg} ${styles.border}`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accent}`}
              />

              <div className="flex items-center justify-between gap-3 pl-1">
                <span
                  className={`font-semibold text-sm tracking-wide ${styles.text}`}
                >
                  {item.label}
                </span>

                <span
                  className={`inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 text-sm font-bold rounded-full transition-colors ${styles.badgeBg} ${styles.badgeText}`}
                >
                  {item.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="mt-8 space-y-8">

        {/* Leave Application Form */}
        <div className="max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Apply For Leave
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >

            {/* Leave Type */}
            <div className="relative w-full">

              <label
                htmlFor="leaveTypeId"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Leave Type
              </label>

              <div className="relative">

                <select
                  id="leaveTypeId"
                  name="leaveTypeId"
                  value={formData.leaveTypeId}
                  onChange={handleChange}
                  required
                  className="w-full h-11 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 pr-10 text-sm text-slate-900 dark:text-slate-100 font-medium transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >

                  <option
                    value=""
                    disabled
                  >
                    Select Leave Type
                  </option>

                  {leaveData.map((data) => (
                    <option
                      key={data.id}
                      value={data.id}
                    >
                      {data.leaveTypeName}
                    </option>
                  ))}

                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>

              </div>
            </div>

            {/* Start Date */}
            <div className="relative w-full">

              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 text-sm text-slate-900 dark:text-slate-100 font-medium transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />

            </div>

            {/* End Date */}
            <div className="relative w-full">

              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                min={formData.startDate}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 text-sm text-slate-900 dark:text-slate-100 font-medium transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />

            </div>

            {/* Reason */}
            <div className="lg:col-span-3">

              <label
                htmlFor="reason"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Reason
              </label>

              <textarea
                name="reason"
                id="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Explain the reason for your leave request..."
                rows={3}
                maxLength={255}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
              />

            </div>

            {/* Medical Image Upload */}
            {selectedLeaveType?.leaveTypeName
              ?.toLowerCase()
              .includes("medical") && (
              <div className="lg:col-span-3">

                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Attach Documents / Medical Certificate
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImage}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950/40 dark:file:text-emerald-300 cursor-pointer"
                />

              </div>
            )}

            {/* Image Preview */}
            {imagePreview &&
              imagePreview.length > 0 && (
                <div className="lg:col-span-3 space-y-2">

                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Selected Images ({imagePreview.length})
                  </p>

                  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">

                    {imagePreview.map(
                      (src, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm"
                        >

                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />

                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center items-center">

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(
                                  index
                                )
                              }
                              className="p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-md transform hover:scale-110"
                            >
                              <X className="w-4 h-4" />
                            </button>

                          </div>
                        </div>
                      )
                    )}

                  </div>
                </div>
              )}

            {/* Submit */}
            <div className="lg:col-span-3 flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              >
                Submit Request
              </button>

            </div>

          </form>
        </div>

        {/* Recent Requests */}
        <div className="max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">

            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Recent Leave Requests (
              {requestLeave?.length || 0}
              )
            </h2>

          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">

            {requestLeave.length > 0 ? (
              requestLeave.map(
                (req, index) => {
                  const imgSrc =
                    getImageSrc(
                      req.images
                    );

                  return (
                    <div
                      key={
                        req.id || index
                      }
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >

                      <div className="flex items-center gap-4">

                        {imgSrc ? (
                          <div className="w-14 h-14 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">

                            <img
                              src={imgSrc}
                              alt="Attachment"
                              className="object-cover w-full h-full"
                            />

                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 shrink-0">

                            <ImageIcon className="w-5 h-5 mb-0.5" />

                            <span className="text-[10px] font-medium">
                              No Doc
                            </span>

                          </div>
                        )}

                        <div>

                          <div className="flex items-center gap-2">

                            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                              {req.leaveType
                                ?.leaveTypeName ||
                                "Leave Request"}
                            </span>

                            {leaveStatusBadge(
                              req.status
                            )}

                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {req.reason}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">

                        <Calendar className="w-3.5 h-3.5 text-slate-400" />

                        <span>
                          {req.startDate}
                        </span>

                        <span className="text-slate-400">
                          to
                        </span>

                        <span>
                          {req.endDate}
                        </span>

                      </div>

                    </div>
                  );
                }
              )
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No leave requests found.
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Leave;