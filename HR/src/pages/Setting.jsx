import React, { useState } from 'react';
import axios from 'axios';
import { User, Camera, Loader2, CheckCircle2, AlertCircle, Save, RotateCcw, ShieldCheck, Mail, Smile } from 'lucide-react';
import { resizeAvatar } from '../js/image_Upload';
import Swal from 'sweetalert2';

const Setting = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  // Safely parse initial user data
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [status, setStatus] = useState(user.status === "ACTIVE");
  const TOKEN = localStorage.getItem("token");

  const getImage = (image) => {
    if (!image) return null;
    if (image.startsWith("data:image")) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  const [imagePreview, setImagePreview] = useState(getImage(user?.image));
  const [saveImage, setSaveImage] = useState(getImage(user?.image));
  const [form, setForm] = useState({
    nickname: user?.nickname || "",
    username: user?.username || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await resizeAvatar(file);
      setImagePreview(base64);
      setSaveImage(base64);
    } catch (err) {
      console.error("Upload failed:", err);
      setFeedback({ type: 'error', message: 'Failed to process image.' });
    }
  };

  const updateData = async () => {
    setFeedback({ type: null, message: '' });
    setLoading(true);

    const startTime = Date.now();
    const pureBase64 = saveImage ? saveImage.split(",")[1] : null;
    const newStatus = status ? "ACTIVE" : "INACTIVE";

    try {
      if (user.status !== newStatus) {
        await axios.patch(
          "http://localhost:8080/api/updateUserStatus",
          {
            userId: Number(user.userId),
            status: newStatus
          },
          {
            headers: { Authorization: `Bearer ${TOKEN}` }
          }
        );
      }

      const res = await axios.patch(
        "http://localhost:8080/api/updateUserInfo",
        {
          userId: user.userId,
          username: form.username,
          nickname: form.nickname,
          image: pureBase64,
        },
        {
          headers: { Authorization: `Bearer ${TOKEN}` }
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...res.data,
          status: newStatus
        })
      );

      setFeedback({
        type: 'success',
        message: 'Profile settings saved successfully!'
      });
     

    } catch (error) {
      console.error("Update failed:", error);
      setFeedback({
        type: 'error',
        message: 'Failed to update profile settings. Please try again.'
      });
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  const handleCancel = () => {
    setForm({
      nickname: user?.nickname || "",
      username: user?.username || ""
    });
    setStatus(user?.status === "ACTIVE");
    setImagePreview(getImage(user?.image));
    setSaveImage(getImage(user?.image));
    setFeedback({ type: null, message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-3 border border-gray-100">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-gray-700">Saving changes...</p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your public profile and workspace status parameters.</p>
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <div className={`p-4 rounded-xl border flex items-center space-x-3 text-sm font-medium transition-all ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
          
          {/* Avatar & Photo Upload */}
          <div className="p-6 sm:p-8">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Profile Picture</h2>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-inner bg-gray-50 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start space-y-2">
                <label className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <span>Change Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={loading} />
                </label>
                <p className="text-xs text-gray-400">JPG, PNG or GIF. Resized automatically.</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Personal Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nickname" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Display Nickname
                </label>
                <div className="relative">
                  <Smile className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="nickname"
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g. Alex"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="username"
                    type="email"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="alex@company.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Preference */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Employee Status</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Toggle your visibility and active status within the workspace.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  status ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {status ? 'Active' : 'Inactive'}
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-checked={status}
                  onClick={() => !loading && setStatus(!status)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    status ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      status ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-gray-50/50 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={updateData}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition-all focus:outline-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Setting;