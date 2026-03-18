"use client";
import React from "react";
import { Activity, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

const FiscalCore = ({ tasks = [] }) => {
  // 1. LOGIC: Case-insensitive counting (Ensuring 'Completed' or 'completed' both work)
  const totalTasks = tasks.length;
  
  const completedTasks = tasks.filter(t => 
    t.status && t.status.toLowerCase() === "completed"
  ).length;

  const pendingTasks = totalTasks - completedTasks;
  
  // 2. CALCULATION: Network Efficiency %
  const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="group p-10 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-emerald-500/40 transition-all duration-500 shadow-2xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="p-4 bg-emerald-400/10 rounded-2xl text-emerald-400">
            <Activity size={32} />
          </div>
          <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-5 py-2 rounded-full uppercase tracking-widest">
            Network Pulse
          </span>
        </div>
        
        <div className="mb-10">
          <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-bold mb-3">
            Active Requests
          </p>
          <div className="text-5xl font-bold text-white tracking-tighter leading-none">
            {pendingTasks} <span className="text-emerald-500 text-2xl font-medium tracking-normal ml-2">Active</span>
          </div>
          
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-wider">
              <CheckCircle2 size={14} className={`transition-colors ${completedTasks > 0 ? "text-emerald-400" : "text-white/20"}`} /> 
              {completedTasks} Handled
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-wider">
              <Clock size={14} className="text-violet-400" /> {totalTasks} Total
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-1000 ease-out" 
            style={{ width: `${efficiency}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-base font-medium">
          <span className="text-white/40 uppercase tracking-widest">
            {efficiency}% Efficiency
          </span>
          <ArrowUpRight size={20} className="text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default FiscalCore;