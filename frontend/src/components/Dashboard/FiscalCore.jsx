import React from "react";
import { Wallet, ArrowUpRight } from "lucide-react";

const FiscalCore = () => {
  return (
    <div className="group p-10 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-emerald-500/40 transition-all duration-500 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <div className="p-4 bg-emerald-400/10 rounded-2xl text-emerald-400">
          <Wallet size={32} />
        </div>
        <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-5 py-2 rounded-full uppercase tracking-widest">
          Financial Security
        </span>
      </div>
      
      <div className="mb-10">
        <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-bold mb-3">
          Est. Monthly Balance
        </p>
        {/* Main Balance: text-5xl for clear visibility */}
        <div className="text-5xl font-bold text-white tracking-tighter leading-none">
          $4,250.00
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 w-[70%] rounded-full shadow-[0_0_20px_rgba(52,211,153,0.3)]" />
        </div>
        <div className="flex justify-between items-center text-base font-medium">
          <span className="text-white/40 uppercase tracking-widest">70% of Goal</span>
          <ArrowUpRight size={20} className="text-emerald-400" />
        </div>
      </div>
    </div>
  );
};

export default FiscalCore;