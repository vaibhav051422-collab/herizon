"use client";
import React, { useState } from 'react';

const CircleManager = ({ role, currentInviteCode }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(currentInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (role !== 'user') return null; // Sirf Mother/User ko dikhao

  return (
    <div className="bg-[#111] border border-[#FA9021]/20 p-6 rounded-2xl mb-8 flex items-center justify-between">
      <div>
        <h3 className="text-[#FA9021] font-black uppercase text-sm tracking-widest mb-1">Your Resilience Code</h3>
        <p className="text-gray-400 text-sm">Share this with your trusted guardians to link them to your network.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-3xl font-mono font-black text-white tracking-tighter bg-black px-4 py-2 rounded-lg border border-white/10">
          {currentInviteCode || "GENERATING..."}
        </span>
        <button 
          onClick={copyCode}
          className="bg-[#FA9021] text-black font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform"
        >
          {copied ? "COPIED!" : "COPY CODE"}
        </button>
      </div>
    </div>
  );
};

export default CircleManager;