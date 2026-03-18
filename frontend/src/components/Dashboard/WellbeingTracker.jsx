"use client";
import React, { useState, useEffect } from "react";
import { HeartPulse, Sparkles, MessageSquare, Link, Video, X, ExternalLink } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

// Backend Connection
const socket = io("http://localhost:5000");

const WellbeingTracker = ({ circleId, userName }) => {
  const [mentorCodeInput, setMentorCodeInput] = useState("");
  const [incomingVCLink, setIncomingVCLink] = useState(null); 

  useEffect(() => {
    if (circleId) {
      console.log(`🔌 Joining mentor-support room: ${circleId}`);
      socket.emit("join-circle", circleId);
    }

   
    socket.on("receive-vc-link", (data) => {
      console.log("📡 INCOMING BRIDGE SIGNAL:", data);
      setIncomingVCLink(data);
      // Optional: Play a sound
      new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3").play().catch(() => {});
    });

    return () => {
      socket.off("receive-vc-link");
    };
  }, [circleId]);

 
  const handleMentorHelp = async () => {
    if (!mentorCodeInput.trim()) {
      alert("PLEASE PASTE A MENTOR CODE TO CONNECT");
      return;
    }

    if (!circleId) {
      alert(" PLEASE JOIN A CIRCLE FIRST.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const connectRes = await axios.post("http://localhost:5000/api/mentor/connect", {
        mentorCodePaste: mentorCodeInput.trim(),
        circleId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (connectRes.data.success) {
        const taskRes = await axios.post("http://localhost:5000/api/tasks/create", {
          title: `VC REQUESTED BY ${userName.toUpperCase()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "mentor_vc", 
          circleId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (taskRes.data.success) {
          alert(` SUCCESS: CONNECTED TO ${connectRes.data.mentorName.toUpperCase()}. MENTOR ALERTED.`);
          setMentorCodeInput(""); 
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "CONNECTION ERROR");
    }
  };

  return (
    <>
      <div className="group p-10 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-rose-500/40 transition-all duration-500 shadow-2xl flex flex-col justify-between h-full relative">
        {/* Header Section */}
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
                <div key={i} className={`flex-1 rounded-2xl transition-all duration-700 ${i < 6 ? 'bg-gradient-to-t from-rose-500/50 to-rose-400/20' : 'bg-white/5'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="space-y-4 mt-10">
          <input 
            type="text" 
            placeholder="PASTE MENTOR CODE" 
            value={mentorCodeInput}
            onChange={(e) => setMentorCodeInput(e.target.value.toUpperCase())}
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-rose-500/50 transition-all font-bold uppercase text-[10px] tracking-widest placeholder:text-white/10"
          />

          <button 
            onClick={handleMentorHelp}
            className="w-full py-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-black transition-all"
          >
            <MessageSquare size={18} /> Request Mentor VC
          </button>
        </div>
      </div>

      
      {incomingVCLink && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0c0c0e] border-2 border-rose-500/50 rounded-[3rem] p-12 max-w-md w-full text-center space-y-8 shadow-[0_0_100px_rgba(244,63,94,0.2)] relative">
            <button 
              onClick={() => setIncomingVCLink(null)}
              className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
               <Video size={48} className="text-black" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Live Support Active</h2>
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
                Mentor <span className="text-rose-400">{incomingVCLink.mentorName.toUpperCase()}</span> has established a secure bridge.
              </p>
            </div>

            <button 
              onClick={() => {
                window.open(incomingVCLink.meetLink, "_blank");
                setIncomingVCLink(null);
              }}
              className="w-full py-6 bg-rose-500 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(244,63,94,0.4)]"
            >
              <ExternalLink size={18} /> Join Meeting Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WellbeingTracker;