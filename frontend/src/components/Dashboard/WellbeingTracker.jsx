"use client";
import React from "react";
import { HeartPulse, Sparkles, MessageSquare } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const WellbeingTracker = ({ circleId, userName }) => {

  // 🔥 Socket logic to notify mentor
  const handleMentorHelp = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/tasks/create", {
        title: `${userName} is asking for a VC`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "mentor_vc", // Identification tag
        circleId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Mentor ko socket alert bhejna
        socket.emit("mentor-help-request", {
          userName,
          circleId,
          message: "Requesting an immediate video consultation"
        });
        alert("Help signal broadcasted to Mentor. Standby for link.");
      }
    } catch (err) {
      console.error("Mentor request failed", err);
    }
  };

  return (
    <div className="group p-10 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-rose-500/40 transition-all duration-500 shadow-2xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400">
            <HeartPulse size={32} />
          </div>
          <span className="text-sm font-bold text-rose-400 bg-rose-500/10 px-5 py-2 rounded-full uppercase tracking-widest">
            Support System
          </span>
        </div>
        
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white tracking-tight">Wellness Level</h3>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> Balanced
            </span>
          </div>
          
          <div className="flex gap-3 h-16">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-2xl transition-all duration-700 ${
                  i < 6 
                  ? 'bg-gradient-to-t from-rose-500/50 to-rose-400/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
                  : 'bg-white/5'
                }`} 
              />
            ))}
          </div>
          <p className="text-sm text-center text-white/30 font-bold uppercase tracking-[0.2em]">
            Activity pattern last 7 days
          </p>
        </div>
      </div>

      {/* 🔥 NEW: GET MENTOR HELP BUTTON */}
      <button 
        onClick={handleMentorHelp}
        className="w-full mt-10 py-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-black transition-all"
      >
        <MessageSquare size={16} /> Get Mentor Help
      </button>
    </div>
  );
};

export default WellbeingTracker;