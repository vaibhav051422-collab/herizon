import React from "react";
import { Clock, Baby } from "lucide-react";

const ChildcareHub = () => {
  return (
    <div className="group p-10 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-violet-500/40 transition-all duration-500 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <div className="p-4 bg-violet-500/10 rounded-2xl text-violet-400">
          <Baby size={32} />
        </div>
        <span className="text-sm font-bold text-violet-400 bg-violet-500/10 px-5 py-2 rounded-full uppercase tracking-widest">
          Coordination Hub
        </span>
      </div>
      
     
      <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">ChildCare Hub</h3>
      
      <div className="space-y-6">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-lg">
            <Clock size={20} className="text-violet-400" />
            <span className="text-white/70">School Pickup</span>
          </div>
          <span className="text-lg font-bold text-white">02:00 PM</span>
        </div>
        <button className="w-full py-5 bg-violet-500/10 text-violet-400 rounded-2xl text-sm font-bold uppercase tracking-[0.2em] hover:bg-violet-500/20 transition-all">
          View Reminders
        </button>
      </div>
    </div>
  );
};

export default ChildcareHub;