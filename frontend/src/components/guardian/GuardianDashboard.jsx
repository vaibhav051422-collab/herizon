"use client";
import React, { useState, useEffect } from "react";
import { 
  MapPin, Activity, ShieldCheck, CheckCircle2, 
  Clock, AlertTriangle, ArrowRight 
} from "lucide-react";

const GuardianDashboard = () => {
  const [userName, setUserName] = useState("User");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Ready to Assist, {userName} 🛡️
        </h1>
        <p className="text-xl text-white/50 font-medium max-w-3xl">
          You are currently active and supporting 2 families in your trusted network.
        </p>
      </header>

      {/* TOP 3 PILLARS (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-4">
        
        {/* PILLAR 1: Active Requests */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:border-[#FA9021]/30 transition-all shadow-lg group flex flex-col justify-between min-h-[280px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-[#FA9021]/10 rounded-xl flex items-center justify-center border border-[#FA9021]/20 group-hover:bg-[#FA9021]/20 transition-all">
              <MapPin size={26} className="text-[#FA9021]" />
            </div>
            <span className="px-4 py-2 bg-[#050505] border border-[#FA9021]/30 rounded-full text-[11px] font-black text-[#FA9021] uppercase tracking-widest">
              Action Required
            </span>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Pending Task</h3>
            
            {/* Box-in-Box layout */}
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex flex-col gap-2 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-base text-gray-200 font-bold">
                  <Clock size={18} className="text-[#FA9021]" /> School Pickup
                </div>
                <span className="text-sm font-bold text-white">02:00 PM</span>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-7 mt-1">
                Maya's Kids • St. Jude High
              </span>
            </div>

            {/* Split Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 py-4 rounded-2xl border border-transparent bg-[#FA9021]/10 text-sm font-bold uppercase tracking-widest text-[#FA9021] hover:bg-[#FA9021]/20 transition-all">
                Accept
              </button>
              <button className="flex-1 py-4 rounded-2xl border border-white/10 bg-transparent text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                Decline
              </button>
            </div>
          </div>
        </div>

        {/* PILLAR 2: Network Status & Availability */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[280px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
              <Activity size={26} className="text-emerald-500" />
            </div>
            <span className="px-4 py-2 bg-[#050505] border border-emerald-500/20 rounded-full text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
              System Status
            </span>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Availability</h3>
            
            {/* Box-in-Box Toggle */}
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex items-center justify-between mb-5">
              <div className={`flex items-center gap-3 text-base font-bold ${isOnline ? 'text-emerald-500' : 'text-gray-500'}`}>
                 <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} /> 
                 {isOnline ? "Online & Ready" : "Standby Mode"}
              </div>
              
              <button 
                onClick={() => setIsOnline(!isOnline)} 
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${isOnline ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-gray-800 border border-gray-600"}`}
              >
                <div className={`w-4.5 h-4.5 rounded-full transition-transform ${isOnline ? "bg-emerald-500 translate-x-5" : "bg-gray-400 translate-x-0"}`} />
              </button>
            </div>
            
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              You will receive instant alerts for emergencies in your connected circles.
            </p>
          </div>
        </div>

        {/* PILLAR 3: Trust Score & Badges */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[280px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
              <ShieldCheck size={26} className="text-purple-500" />
            </div>
            <span className="px-4 py-2 bg-[#050505] border border-purple-500/20 rounded-full text-[11px] font-bold text-purple-500 uppercase tracking-widest">
              Security Level
            </span>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Community Trust</h3>
            
            {/* Box-in-Box List */}
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex flex-col gap-5">
              <div className="flex items-center gap-4 text-base text-gray-300 font-medium">
                 <CheckCircle2 size={20} className="text-purple-500" /> Background Checked
              </div>
              <div className="flex items-center gap-4 text-base text-gray-300 font-medium">
                 <CheckCircle2 size={20} className="text-purple-500" /> 15+ Tasks Completed
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM BANNER: Network Monitor */}
      <section className="pt-8">
        <div className="bg-gradient-to-r from-indigo-900/10 via-[#0c0c0e] to-[#0c0c0e] border border-white/5 rounded-3xl p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle size={36} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-3">Network Monitor Active</h3>
              <p className="text-gray-400 text-base font-medium max-w-2xl leading-relaxed">
                Your connection to the Resilience Ecosystem is stable. No active emergency SOS signals detected.
              </p>
            </div>
          </div>

          <button className="relative z-10 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-3 shrink-0 cursor-pointer">
            View Circle Log <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </>
  );
};

export default GuardianDashboard;