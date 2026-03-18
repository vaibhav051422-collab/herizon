"use client";
import React, { useState } from "react";
import { HeartPulse, Sparkles, MessageSquare, Link } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const WellbeingTracker = ({ circleId, userName }) => {
  const [mentorCodeInput, setMentorCodeInput] = useState("");

  const handleMentorHelp = async () => {
    if (!mentorCodeInput.trim()) {
      alert("PLEASE PASTE A MENTOR CODE TO CONNECT");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // 🔥 STEP 1: Connect to the Mentor using the pasted code
      const connectRes = await axios.post("http://localhost:5000/api/mentor/connect", {
        mentorCodePaste: mentorCodeInput.trim(),
        circleId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (connectRes.data.success) {
        // 🔥 STEP 2: Create a Help Task (VC Request)
        const taskRes = await axios.post("http://localhost:5000/api/tasks/create", {
          title: `${userName} IS ASKING FOR A VC`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "mentor_vc", 
          circleId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (taskRes.data.success) {
          alert(`CONNECTED TO ${connectRes.data.mentorName.toUpperCase()}. SIGNAL BROADCASTED.`);
          setMentorCodeInput(""); // Clear field after success
        }
      }
    } catch (err) {
      console.error("MENTOR CONNECTION FAILED", err);
      alert(err.response?.data?.message || "CONNECTION ERROR");
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

      <div className="space-y-4 mt-10">
        {/* 🔥 NEW: MENTEE CODE INPUT FIELD */}
        <div className="relative group/input">
          <input 
            type="text" 
            placeholder="PASTE MENTOR CODE HERE" 
            value={mentorCodeInput}
            onChange={(e) => setMentorCodeInput(e.target.value.toUpperCase())}
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-rose-500/50 transition-all font-bold uppercase text-[10px] tracking-widest placeholder:text-white/10"
          />
          <Link size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-rose-500 transition-colors" />
        </div>

        <button 
          onClick={handleMentorHelp}
          className="w-full py-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-black transition-all"
        >
          <MessageSquare size={16} /> Connect & Get Help
        </button>
      </div>
    </div>
  );
};

export default WellbeingTracker;