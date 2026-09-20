import React, { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone, Clock, Inbox, Sparkles } from "lucide-react";

const Announcement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnnouncementLists = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:8080/api/findAllAnnouncementLists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data || []);
      } catch (error) {
        console.error("Error fetching announcement data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementLists();
  }, [token]);

  // Safe Date Filtering
  const recentAnnouncementLists = data.filter((a) => {
    if (!a.createdTime) return true;
    const createdDay = new Date(a.createdTime);
    const expireDate = new Date(createdDay.getTime() + 7 * 24 * 60 * 60 * 1000);
    return new Date() <= expireDate;
  });

  // Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section (Grid Layout) */}
        <div className="grid grid-cols-[1fr_auto] items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-flow-col auto-cols-max items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
                Announcements
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Stay up to date with company news and recent broadcasts.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-grid grid-flow-col items-center gap-1.5 px-3 py-1 bg-amber-100/60 text-amber-800 text-xs font-semibold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Last 7 Days</span>
          </span>
        </div>

    
        {loading ? (
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse grid grid-rows-[auto_1fr] gap-3"
              >
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentAnnouncementLists.length === 0 ? (
       
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm grid justify-items-center gap-3">
            <div className="p-4 bg-gray-50 rounded-full text-gray-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              No Recent Announcements
            </h3>
            <p className="text-xs text-gray-500 max-w-sm">
              There are no active announcements broadcasted in the past 7 days.
            </p>
          </div>
        ) : (
      
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAnnouncementLists.map((a, index) => (
              <div
                key={a.id || index}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-300 overflow-hidden grid grid-rows-[auto_1fr] gap-3"
              >
        
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 group-hover:bg-amber-500 transition-colors" />

                <div className="pl-2 grid gap-3">
           
                  <div className="grid grid-cols-[1fr_auto] items-start gap-2">
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors leading-snug">
                      {a.title}
                    </h2>

                    {a.createdTime && (
                      <div className="grid grid-flow-col items-center gap-1 text-xs font-medium text-gray-400 shrink-0 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(a.createdTime)}</span>
                      </div>
                    )}
                  </div>

              
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {a.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcement;