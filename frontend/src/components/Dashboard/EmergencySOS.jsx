"use client";
import React, { useState, useEffect } from "react";
import { ShieldAlert, Heart } from "lucide-react";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000"); 

const EmergencySOS = () => {
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
   
    const circleId = localStorage.getItem("circleId");
    if (circleId) {
      socket.emit("join-circle", circleId);
    }
  }, []);

  const handleSOS = () => {
    const circleId = localStorage.getItem("circleId");
    const userName = localStorage.getItem("userName") || "User";

    if (!circleId) {
      alert("No Circle found! Please join a circle first.");
      return;
    }

    setIsSending(true);

    socket.emit("send-sos", {
      circleId,
      userName,
      location: "Current GPS Location",
    });

   
    setTimeout(() => {
      setIsSending(false);
      alert(" SOS Alert sent to all your Guardians!");
    }, 1500);
  };

  return (
    <div className="relative p-14 bg-[#0c0c0e] border border-rose-500/20 rounded-[3rem] overflow-hidden group shadow-2xl">
   
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-500/[0.03] blur-[150px] -z-10" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex items-center gap-12">
          <div className={`p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] text-rose-500 shadow-2xl shadow-rose-500/10 ${isSending ? 'animate-ping' : 'animate-pulse'}`}>
            <ShieldAlert size={56} />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tight">Emergency Support</h2>
            <p className="text-xl text-white/40 max-w-xl font-bold leading-relaxed">
              Tap to instantly notify your trusted guardians and community networks. Help is always within reach.
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSOS}
          disabled={isSending}
          className={`w-full lg:w-auto px-20 py-8 ${isSending ? 'bg-gray-700' : 'bg-gradient-to-r from-rose-600 to-[#FA9021]'} text-white rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-5 cursor-pointer disabled:cursor-not-allowed`}
        >
          <Heart size={28} fill={isSending ? "none" : "currentColor"} className={isSending ? "animate-spin" : ""} />
          {isSending ? "Sending Alert..." : "Send Alert"}
        </button>
      </div>
    </div>
  );
};

export default EmergencySOS;