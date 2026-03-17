import React from "react";
import { HeartPulse, Sparkles } from "lucide-react";

const WellbeingTracker = () => {
  return (
    <div className="group p-10 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-rose-500/40 transition-all duration-500 shadow-2xl">
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
        
        {/* Larger wellness bars for better readability */}
        <div className="flex gap-3 h-16">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-2xl transition-all duration-700 ${
                i < 6 
                ? 'bg-gradient-to-t from-rose-500/50 to-rose-400/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
                : 'bg-white/5'
              }`} 
            />
          ))}
        </div>
        <p className="text-sm text-center text-white/30 font-bold uppercase tracking-[0.2em]">
          Activity pattern last 7 days
        </p>
      </div>
    </div>
  );
};

export default WellbeingTracker;