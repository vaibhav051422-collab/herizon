"use client";
import React, { useState, useEffect } from "react";
import { 
  Video, Clock, MessageSquare, ExternalLink, 
  AlertCircle, CheckCircle2, Shield, Copy, Hash
} from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const MentorDashboard = ({ tasks = [], circleId }) => {
  const [userName, setUserName] = useState("Mentor");
  const [myMentorCode, setMyMentorCode] = useState("LOADING...");
  const [activeRequest, setActiveRequest] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/init", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(res.data.userName);
       
        setMyMentorCode(res.data.myMentorCode || "NOT_ASSIGNED");
        
        if (res.data.circleId) {
          socket.emit("join-circle", res.data.circleId);
        }
      } catch (err) {
        console.error("FAILED TO FETCH MENTOR DATA");
      }
    };

    fetchMentorData();

    // Initial check for existing VC tasks
    const helpRequest = tasks.find(t => t.type === "mentor_vc");
    if (helpRequest) setActiveRequest(helpRequest);

   
    socket.on("new-help-alert", (data) => {
      setActiveRequest(data);
      new Audio("/notification.mp3").play().catch(() => {});
    });

    socket.on("new-mentee-request", (data) => {
      alert(`NEW CONNECTION: ${data.menteeName} HAS LINKED TO YOUR CODE`);
    });

    return () => { 
      socket.off("new-help-alert"); 
      socket.off("new-mentee-request");
    };
  }, [tasks, circleId]);

  const initiateMeeting = () => {
    window.open("https://meet.google.com/new", "_blank");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myMentorCode);
    alert("MENTOR CODE COPIED TO CLIPBOARD");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER WITH MENTOR CODE */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">
            Consultation Center, {userName} 🛡️
          </h1>
          <p className="text-xl text-white/50 font-bold uppercase tracking-widest">
            Awaiting Support Signals from the Network
          </p>
        </div>

        
        <div 
          onClick={copyCode}
          className="bg-[#FA9021]/10 border border-[#FA9021]/30 p-6 rounded-[2rem] cursor-pointer hover:bg-[#FA9021]/20 transition-all group"
        >
          <p className="text-[10px] font-black text-[#FA9021] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
             Your Mentor Code
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
              {myMentorCode}
            </span>
            <Copy size={18} className="text-white/20 group-hover:text-[#FA9021] transition-colors" />
          </div>
        </div>
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

            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
              {activeRequest ? "Immediate Guidance Required" : "System on Standby"}
            </h3>
            
            <p className="text-lg text-white/40 font-bold max-w-xl mb-10 leading-relaxed uppercase tracking-widest text-[11px]">
              {activeRequest 
                ? `${activeRequest.userName} HAS LINKED TO YOUR UNIT AND REQUESTED A LIVE CONSULTATION.` 
                : "NO ACTIVE HELP REQUESTS. SHARE YOUR MENTOR CODE TO CONNECT WITH MENTEES."}
            </p>
          </div>

          {activeRequest && (
            <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={initiateMeeting}
                className="flex-1 py-6 bg-[#FA9021] text-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#FA9021]/20"
              >
                <Video size={20} /> Initiate Google Meet
              </button>
              <button 
                onClick={() => setActiveRequest(null)}
                className="px-10 py-6 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* PILLAR 2: STATUS & SECURITY */}
        <div className="space-y-8">
          <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <h4 className="text-sm font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
              <Shield size={16} /> Session Integrity
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-white uppercase tracking-widest">VC Encryption</span>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">Secure</span>
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-sm font-black text-white/20 uppercase tracking-[0.3em] mb-6">Recent Activity</h4>
            <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] italic">
              No history logged in this cycle.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorDashboard;