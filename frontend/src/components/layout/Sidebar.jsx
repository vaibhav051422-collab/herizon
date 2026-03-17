"use client";
import React from "react";
import { 
  LayoutDashboard, Baby, HeartPulse, Wallet, Users, LogOut,
  MapPin, Activity, ShieldAlert, Video, BookOpen
} from "lucide-react";

const Sidebar = ({ role }) => {
  const userRole = role || "user";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    { title: "Overview", icon: <LayoutDashboard size={22} />, roles: ["user", "guardian", "mentor"] },
    { title: "Childcare Hub", icon: <Baby size={22} />, roles: ["user"] },
    { title: "Fiscal Core", icon: <Wallet size={22} />, roles: ["user"] },
    { title: "Wellbeing", icon: <HeartPulse size={22} />, roles: ["user"] },
    { title: "Active Tasks", icon: <MapPin size={22} />, roles: ["guardian"] },
    { title: "Network Status", icon: <Activity size={22} />, roles: ["guardian"] },
    { title: "Video Sessions", icon: <Video size={22} />, roles: ["mentor"] },
    { title: "Mentee Roster", icon: <Users size={22} />, roles: ["mentor"] },
    { title: "Resource Library", icon: <BookOpen size={22} />, roles: ["mentor"] },
    { title: "Community Alerts", icon: <ShieldAlert size={22} />, roles: ["user", "guardian"] }
  ];

  return (
    <aside className="w-80 h-screen bg-[#080808]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 shadow-2xl transition-all duration-500">
      
      {/* Brand Logo Area - Increased Size & Weight */}
      <div className="h-28 flex flex-col justify-center px-10 border-b border-white/5">
        <h2 className="text-3xl font-black tracking-tighter text-white">
          herizon<span className="text-[#FA9021]">.</span>
        </h2>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">
          Empower. Balance. Thrive.
        </p>
      </div>

      {/* Dynamic Navigation Links - Scaled Up Typography */}
      <nav className="flex-1 px-6 py-10 space-y-3">
        {menuItems.filter(item => item.roles.includes(userRole)).map((item, index) => {
          const isActive = index === 0;

          return (
            <button 
              key={index} 
              className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer group ${
                isActive 
                  ? "bg-[#FA9021]/10 text-[#FA9021] border border-[#FA9021]/20 shadow-[0_10px_30px_rgba(250,144,33,0.15)]" 
                  : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#FA9021]" : "text-gray-500 group-hover:text-white"}`}>
                {item.icon}
              </span>
              <span className="whitespace-nowrap">{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign Out Button - Heavy & Impactful */}
      <div className="p-8 border-t border-white/5 bg-[#050505]/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.15em] text-gray-500 border border-transparent hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 cursor-pointer group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-all" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;