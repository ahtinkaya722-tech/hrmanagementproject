import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddAnnouncements = () => {
  const TOKEN = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Publish Announcement?",
      text: "Are you sure you want to broadcast this announcement to users?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg px-4 py-2 font-medium',
        cancelButton: 'rounded-lg px-4 py-2 font-medium',
      }
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api4/addAnnouncement",
        formData,
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );

      await Swal.fire({
        title: "Success!",
        text: typeof res.data === "string" ? res.data : "Announcement published successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        customClass: { popup: 'rounded-xl' }
      });

      setFormData({
        title: "",
        content: "",
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to publish announcement.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        customClass: { popup: 'rounded-xl' }
      });
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-8 py-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Create Announcement</h1>
            <p className="text-blue-100 text-xs mt-0.5">Share updates, news, and notifications across the platform.</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Title Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-400 font-medium">
              {formData.title.length}/255
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              maxLength={255}
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Scheduled System Maintenance on Friday"
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Content Input */}
        <div>
          <label htmlFor="content" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Details & Body <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows="6"
            required
            value={formData.content}
            onChange={handleChange}
            placeholder="Write clear and complete information about this announcement..."
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-y"
          ></textarea>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setFormData({ title: '', content: '' })}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Clear Fields
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              "Publish Now"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAnnouncements;