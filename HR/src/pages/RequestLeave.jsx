import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  Clock,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Paperclip,
  Check,
  X,
  Eye,
  Download,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const RequestLeave = () => {
  // =========================
  // STATE
  // =========================
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [images, setImages] = useState([]);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Lightbox State
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  const TOKEN = localStorage.getItem("token");

  // =========================
  // FETCH DATA
  // =========================
  const fetchLeaveRequestData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api3/findAllLeaveRequest",
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      setLeaveRequest(res.data);

      if (res.data.length > 0) {
        setSelectedRequest(res.data[0]);
        const initialImg = getImageSrc(res.data[0].images);
        setImages(initialImg ? [initialImg] : []);
      }
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
    }
  };

  useEffect(() => {
    fetchLeaveRequestData();
  }, []);

  // Keyboard navigation for image modal (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePreviewImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // =========================
  // RENDER STATUS BADGE
  // =========================
  const renderStatus = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  // =========================
  // STATUS DOT
  // =========================
  const renderDot = (status) => {
    if (status === "APPROVED") {
      return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />;
    }
    if (status === "REJECTED") {
      return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />;
    }
    return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />;
  };


  const filteredRequests = leaveRequest.filter((request) => {
    const matchesStatus =
      statusFilter === "ALL" || request.status === statusFilter;

    const search = searchQuery.toLowerCase();
    const matchesSearch =
      request.employeeName?.toLowerCase().includes(search) ||
      request.leaveType?.toLowerCase().includes(search) ||
      request.departmentName?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });


  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // CALCULATE DAYS
  // =========================
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };

  const rejectRequest = async (id) => {

      const res = await axios.patch("http://localhost:8080/api3/reject", {},{
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          params: {
            leaveRequestId: id,
          },
        });
        console.log(res.data);
        
        fetchLeaveRequestData();


  }
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

  const handleSubmit = async (e, leaveRequestId) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Approve Leave Request?",
      text: "Are you sure you want to approve this leave request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-semibold px-5 py-2.5",
        cancelButton: "rounded-xl font-semibold px-5 py-2.5",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.put(
        "http://localhost:8080/api3/ApproveLeaveRequest",
        {},
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          params: {
            leaveRequestId: leaveRequestId,
          },
        }
      );

      await Swal.fire({
        title: "Success!",
        text: typeof res.data === "string" ? res.data : "Leave Request Approved.",
        icon: "success",
        customClass: { popup: "rounded-2xl" },
      });

      fetchLeaveRequestData();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit leave request.",
        icon: "error",
        customClass: { popup: "rounded-2xl" },
      });
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6 relative">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Leave Requests
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Review and manage employee leave submissions
        </p>
      </div>

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm overflow-hidden min-h-[620px]">
        {/* ================================================= */}
        {/* LEFT COLUMN - REQUEST LIST */}
        {/* ================================================= */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 flex flex-col">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee, leave type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-slate-100/70 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:bg-white transition-all pr-8"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Request List Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[550px]">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No leave requests found
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your search or filter options.
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => {
                const isSelected =
                  selectedRequest?.leaveRequestId === request.leaveRequestId;
                const totalDays = calculateDays(
                  request.startDate,
                  request.endDate
                );

                return (
                  <div
                    key={request.leaveRequestId}
                    onClick={() => {
                      handleSelectRequest(request);
                      const imgSrc = getImageSrc(request.images);
                      setImages(imgSrc ? [imgSrc] : []);
                    }}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? "bg-white border-l-slate-900 shadow-sm"
                        : "border-l-transparent hover:bg-slate-100/50"
                    }`}
                  >
                    {/* Header: Name + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {request.employeeName || "Unknown Employee"}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {request.departmentName || "No Department"}
                        </p>
                      </div>
                      {renderStatus(request.status)}
                    </div>

                    {/* Leave Type & Dates */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold">
                        {renderDot(request.status)}
                        <span>{request.leaveType || "Leave"}</span>
                      </div>
                      <span className="text-slate-400 font-medium">
                        {totalDays} day{totalDays !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="mt-1.5 text-[11px] text-slate-400 pl-4">
                      {formatDate(request.startDate)} → {formatDate(request.endDate)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT COLUMN - REQUEST DETAILS */}
        {/* ================================================= */}
        <div className="lg:col-span-7 bg-white flex flex-col justify-between">
          {selectedRequest ? (
            <div className="h-full flex flex-col justify-between">
              {/* Header Info */}
              <div>
                <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-slate-800 text-lg shadow-sm">
                      {selectedRequest.employeeName
                        ? selectedRequest.employeeName.charAt(0)
                        : "E"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedRequest.employeeName}
                      </h2>
                     
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {selectedRequest.departmentName || "No Department"}
                      </p>
                    </div>
                  </div>
                  {renderStatus(selectedRequest.status)}
                </div>

                {/* Details Scroll Area */}
                <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[480px]">
                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Leave Type
                      </span>
                      <p className="text-sm font-bold text-slate-800">
                        {selectedRequest.leaveType || "General Leave"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Duration
                      </span>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {calculateDays(
                          selectedRequest.startDate,
                          selectedRequest.endDate
                        )}{" "}
                        Day(s)
                      </p>
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-400 uppercase block tracking-wider text-[10px] mb-0.5">
                        Selected Dates
                      </span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {formatDate(selectedRequest.startDate)} →{" "}
                        {formatDate(selectedRequest.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Reason Block */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Reason for Request
                    </span>
                    <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                      {selectedRequest.reason || "No reason provided."}
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Attachments
                    </span>
                    {images.length === 0 ? (
                      <div className="p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                        <Paperclip className="w-4 h-4" /> No attached files
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            onClick={() => setActivePreviewImage(image)}
                            className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer group shadow-sm transition-transform hover:scale-[1.02]"
                          >
                            <img
                              src={image}
                              alt={`attachment-${index}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            {/* Hover Eye Overlay */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-6 h-6" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submission Meta */}
                  <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Requested on:{" "}
                    {formatDate(
                      selectedRequest.requestedAt || selectedRequest.createdAt
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "PENDING" && (
                <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
                  <button onClick={()=>rejectRequest(selectedRequest.leaveRequestId)}
                    type="button"
                    className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100 text-sm font-semibold transition-all inline-flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Reject  {selectedRequest.leaveRequestId} 
                  </button>

                  <button
                    type="button"
                    onClick={(e) =>
                      handleSubmit(e, selectedRequest.leaveRequestId)
                    }
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold transition-all shadow-sm inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Blank State */
            <div className="h-full min-h-[550px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Select a leave request
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Choose an item from the sidebar on the left to review its full details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* IMAGE PREVIEW LIGHTBOX MODAL */}
      {/* ================================================= */}
      {activePreviewImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setActivePreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Attachment Preview
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={activePreviewImage}
                  download="leave-attachment"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActivePreviewImage(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="p-2 overflow-auto flex items-center justify-center bg-slate-950/90 max-h-[80vh]">
              <img
                src={activePreviewImage}
                alt="Enlarged Attachment"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestLeave;