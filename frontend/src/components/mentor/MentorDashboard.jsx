"use client";
import React, { useState, useEffect } from "react";
import { 
  Video, Users, BookOpen, Clock, 
  TrendingUp, ArrowRight, FileText, UploadCloud 
} from "lucide-react";

const MentorDashboard = () => {
  const [userName, setUserName] = useState("Dr. Sarah");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER - Bold and prominent */}
      <header className="space-y-4">
        <h1 className="text-5xl font-black tracking-tight text-white leading-tight">
          Welcome back, {userName} 💡
        </h1>
        <p className="text-xl text-white/50 font-bold max-w-3xl">
          Empowering 4 mentees this month with financial and wellbeing guidance.
        </p>
      </header>

      {/* TOP 3 PILLARS (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* PILLAR 1: Upcoming Sessions (Orange Accent) */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-[2rem] p-10 hover:border-[#FA9021]/30 transition-all shadow-lg group flex flex-col justify-between min-h-[320px]">
          
          <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-[#FA9021]/10 rounded-2xl flex items-center justify-center border border-[#FA9021]/20 group-hover:bg-[#FA9021]/20 transition-all">
              <Video size={32} className="text-[#FA9021]" />
            </div>
            {/* Standardized Bold Badge */}
            <span className="px-4 py-2 bg-[#050505] border border-[#FA9021]/30 rounded-full text-xs font-black text-[#FA9021] uppercase tracking-[0.2em]">
              Next Meeting
            </span>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-white mb-6">Upcoming Session</h3>
            
            {/* Big Box-in-Box layout */}
            <div className="bg-[#050505] border border-white/5 rounded-3xl p-6 flex flex-col gap-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Financial Planning</span>
                <span className="text-lg font-black text-white">04:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FA9021] uppercase tracking-[0.2em] mt-2">
                <Clock size={16} className="text-[#FA9021]" /> Today • With Maya
              </div>
            </div>

            {/* Standardized Big Button */}
            <button className="w-full py-5 rounded-2xl border border-transparent bg-[#FA9021]/10 text-sm font-black uppercase tracking-[0.2em] text-[#FA9021] hover:bg-[#FA9021]/20 transition-all cursor-pointer">
              Join Video Room
            </button>
          </div>
        </div>

        {/* PILLAR 2: Mentee Roster (Indigo Accent) */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-[2rem] p-10 hover:border-indigo-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[320px]">
          
          <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
              <Users size={32} className="text-indigo-500" />
            </div>
            <span className="px-4 py-2 bg-[#050505] border border-indigo-500/30 rounded-full text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">
              Roster
            </span>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-white mb-6">Active Mentees</h3>
            
            {/* Big Box-in-Box layout */}
            <div className="bg-[#050505] border border-white/5 rounded-3xl p-6 flex items-center justify-between mb-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white leading-none">4</span>
                  <span className="text-xl font-bold text-gray-600">/5</span>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">Slots Filled</p>
              </div>
              <div className="flex -space-x-4">
                {/* Bigger Avatars */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-4 border-[#050505] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-${100 - (i * 15)}`} />
                ))}
              </div>
            </div>

            <button className="w-full py-5 rounded-2xl border border-white/5 bg-transparent text-sm font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
              Manage Roster
            </button>
          </div>
        </div>

        {/* PILLAR 3: Resource Hub (Teal Accent) */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-[2rem] p-10 hover:border-teal-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[320px]">
          
          <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/20 group-hover:bg-teal-500/20 transition-all">
              <BookOpen size={32} className="text-teal-500" />
            </div>
            <span className="px-4 py-2 bg-[#050505] border border-teal-500/30 rounded-full text-xs font-black text-teal-500 uppercase tracking-[0.2em]">
              Library
            </span>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-white mb-6">Resource Hub</h3>
            
            {/* Big Box-in-Box List */}
            <div className="bg-[#050505] border border-white/5 rounded-3xl p-6 flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-4 text-base text-gray-300 font-bold">
                  <FileText size={20} className="text-teal-500" /> Budget_Template.pdf
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-4 text-base text-gray-300 font-bold">
                  <FileText size={20} className="text-teal-500" /> Wellbeing_Guide.pdf
                </span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl border border-transparent bg-teal-500/10 text-sm font-black uppercase tracking-[0.2em] text-teal-500 hover:bg-teal-500/20 transition-all cursor-pointer">
              <UploadCloud size={20} /> Upload New
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM BANNER: Mentorship Impact */}
      <section className="pt-8">
        <div className="bg-gradient-to-r from-purple-900/10 via-[#0c0c0e] to-[#0c0c0e] border border-white/5 rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex items-center justify-center shrink-0">
              <TrendingUp size={40} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-3">Impact Overview</h3>
              <p className="text-gray-400 text-lg font-bold max-w-2xl">
                Your guidance has successfully helped 12 mothers achieve their 90-day financial independence goals this quarter.
              </p>
            </div>
          </div>

          <button className="relative z-10 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center gap-3 shrink-0 cursor-pointer">
            View Analytics <ArrowRight size={20} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default MentorDashboard;