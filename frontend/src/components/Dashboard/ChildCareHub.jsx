"use client";
import React from "react";
import { Clock, Baby, Inbox } from "lucide-react";

const ChildcareHub = ({ tasks = [] }) => {
  // 🔥 Step 1: Filter logic to remove BOTH VC types and any dummy data
  const activeMissions = tasks.filter(task => {
    const isNotVC = task.type !== "mentor_vc";
    const isNotDummyVC = !task.title?.toLowerCase().includes("asking for a vc");
    const hasValidTitle = task.title && task.title !== "User"; // Filters empty/default titles
    
    return isNotVC && isNotDummyVC && hasValidTitle;
  });

  return (
    <div className="group p-10 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-violet-500/40 transition-all duration-500 shadow-2xl h-full flex flex-col justify-between">
      <div>
        {/* TOP BADGE */}
        <div className="flex items-center justify-between mb-10">
          <div className="p-4 bg-violet-500/10 rounded-2xl text-violet-400">
            <Baby size={32} />
          </div>
          <span className="text-[10px] font-black text-violet-400 bg-violet-500/10 px-5 py-2 rounded-full uppercase tracking-[0.4em] leading-none">
            Coordination
          </span>
        </div>

        {/* MAIN HEADING */}
        <h3 className="text-4xl font-black text-white mb-10 tracking-tighter italic uppercase leading-[0.9]">
          ChildCare <br /> 
          <span className="text-violet-500">Hub.</span>
        </h3>

        {/* TASK LIST: Added scroll and removed slice(0,2) */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {activeMissions.length > 0 ? (
            activeMissions.map((task, index) => (
              <div 
                key={task._id || index} 
                className="p-6 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between group-hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <Clock size={18} className="text-violet-500 shrink-0" />
                  <span className="text-white font-black uppercase text-[11px] tracking-[0.15em] truncate">
                    {task.title}
                  </span>
                </div>
                <span className="text-sm font-black text-white italic tracking-tighter shrink-0 ml-4">
                  {task.time}
                </span>
              </div>
            ))
          ) : (
            /* SYSTEM STANDBY: Shown when no real coordination tasks exist */
            <div className="p-10 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center opacity-30">
              <Inbox size={24} className="mb-2 text-gray-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 text-center">
                System Standby <br /> No Active Missions
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button className="w-full py-5 bg-violet-500/5 text-violet-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] hover:bg-violet-500/10 hover:text-white transition-all border border-white/5 hover:border-violet-500/30">
          View Reminders
        </button>
      </div>
    </div>
  );
};

export default ChildcareHub;