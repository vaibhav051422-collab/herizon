"use client";
import React, { useState, useEffect } from "react";
import { 
  Video, Clock, MessageSquare, ExternalLink, 
  AlertCircle, CheckCircle2, Shield
} from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";

// Dashboard se match karne ke liye port 5000
const socket = io("http://localhost:5000");

const MentorDashboard = ({ tasks = [], circleId }) => { // 🔥 Destructured circleId from props
  const [userName, setUserName] = useState("Mentor");
  const [activeRequest, setActiveRequest] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    // 🔥 1. Join Room: Important! Mentor must be in the circle room to hear alerts
    if (circleId) {
      socket.emit("join-circle", circleId);
      console.log("Mentor joined circle room:", circleId);
    }

    // 2. Initial Load: Check if any VC request already exists in the tasks array
    const helpRequest = tasks.find(t => 
      t.type === "mentor_vc" || 
      t.title?.toLowerCase().includes("vc") || 
      t.title?.toLowerCase().includes("mentor")
    );
    if (helpRequest) setActiveRequest(helpRequest);

    // 3. Real-time: Listen for new help alerts
    socket.on("new-help-alert", (data) => {
      console.log("New VC request received:", data);
      setActiveRequest(data);
      // Optional notification sound
      new Audio("/notification.mp3").play().catch(() => {});
    });

    return () => { 
      socket.off("new-help-alert"); 
    };
  }, [tasks, circleId]); // Added circleId to dependency array

  const initiateMeeting = () => {
    const meetLink = "https://meet.google.com/new"; 
    window.open(meetLink, "_blank");
  };

  const dismissRequest = () => {
    setActiveRequest(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Consultation Center, {userName} 🛡️
        </h1>
        <p className="text-xl text-white/50 font-bold uppercase tracking-widest">
          Ready to initiate professional guidance sessions
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4">
        
        {/* PILLAR 1: LIVE HELP REQUEST */}
        <div className={`lg:col-span-2 border rounded-[3rem] p-10 transition-all duration-500 shadow-2xl flex flex-col justify-between min-h-[400px] ${
          activeRequest 
          ? "bg-[#FA9021]/5 border-[#FA9021]/30 shadow-[#FA9021]/10" 
          : "bg-[#0c0c0e] border-white/5"
        }`}>
          <div>
            <div className="flex justify-between items-start mb-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-colors ${
                activeRequest ? "bg-[#FA9021]/20 border-[#FA9021]/40" : "bg-white/5 border-white/10"
              }`}>
                <Video size={32} className={activeRequest ? "text-[#FA9021]" : "text-white/20"} />
              </div>
              {activeRequest && (
                <span className="px-6 py-2 bg-[#FA9021] text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                  Request Active
                </span>
              )}
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              {activeRequest ? "Immediate Guidance Required" : "System on Standby"}
            </h3>
            
            <p className="text-lg text-white/40 font-medium max-w-xl mb-10 leading-relaxed">
              {activeRequest 
                ? `${activeRequest.userName} is facing a challenge and requested a live consultation. Click below to generate a secure Google Meet link.` 
                : "No active help requests at the moment. You will be notified when a mentee triggers the 'Get Mentor Help' signal."}
            </p>
          </div>

          {activeRequest && (
            <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={initiateMeeting}
                className="flex-1 py-6 bg-[#FA9021] text-black rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#FA9021]/20"
              >
                <Video size={20} /> Initiate Google Meet
              </button>
              <button 
                onClick={dismissRequest}
                className="px-10 py-6 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* PILLAR 2: STATUS & SECURITY */}
        <div className="space-y-8">
          <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <h4 className="text-sm font-bold text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
              <Shield size={16} /> Session Integrity
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">VC Encryption</span>
              <span className="text-xs font-bold text-emerald-500 uppercase">Secure</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Identity</span>
              <span className="text-xs font-bold text-emerald-500 uppercase">Verified</span>
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-sm font-bold text-white/20 uppercase tracking-[0.3em] mb-6">Recent Activity</h4>
            <div className="space-y-4">
              <p className="text-xs font-bold text-white/10 uppercase tracking-widest leading-relaxed">
                Waiting for the first session of this cycle to be logged.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorDashboard;