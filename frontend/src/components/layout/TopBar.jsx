"use client";
import React from "react";
import { Bell, Search, Activity, UserCircle } from "lucide-react";

const Topbar = ({ userName = "Maya" }) => {
  return (
    <header className="h-28 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl flex items-center justify-between px-12 sticky top-0 z-30" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
      
     
      <div className="relative group hidden md:block">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors" size={22} />
        <input 
          type="text" 
          placeholder="Search your ecosystem..." 
          className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-base text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 w-[400px] transition-all placeholder:text-white/20"
        />
      </div>

      <div className="flex items-center gap-10">
        
       
        <div className="hidden lg:flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 px-6 py-3 rounded-2xl shadow-lg shadow-violet-500/5">
          <Activity size={18} className="text-violet-400" />
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
            System: Optimized
          </span>
        </div>

        
        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-violet-500/40 transition-all relative group">
          <Bell size={24} />
          <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0a0a0c] group-hover:scale-125 transition-transform"></span>
        </button>

       
        <div className="flex items-center gap-5 pl-8 border-l border-white/10">
          <div className="text-right">
            <p className="text-lg font-bold text-white tracking-tight leading-none">
              {userName}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-2">
              Authorized User
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-rose-400 p-[2px] shadow-2xl shadow-violet-500/20">
            <div className="w-full h-full rounded-[0.8rem] bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
              <UserCircle size={32} className="text-white/70" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;