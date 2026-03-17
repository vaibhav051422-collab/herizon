"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/TopBar";

import ChildcareHub from "../components/Dashboard/ChildCareHub";
import FiscalCore from "../components/Dashboard/FiscalCore";
import WellbeingTracker from "../components/Dashboard/WellbeingTracker";
import EmergencySOS from "../components/Dashboard/EmergencySOS";

import GuardianDashboard from "../components/guardian/GuardianDashboard";
import MentorDashboard from "../components/mentor/MentorDashboard";

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");

    if (!token || !storedRole) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    setCurrentRole(storedRole.toLowerCase());
    setIsLoading(false);
  }, []);

  // Loading Screen (Matches Dark/Orange Theme)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#FA9021] font-black uppercase tracking-widest animate-pulse">
        Verifying Identity & Access Level...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white/90 font-sans selection:bg-[#FA9021]/30 relative overflow-hidden">
      
      {/* Dark Ambient Background Glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FA9021]/5 blur-[120px]" />
      </div>

      {/* Pass role to Sidebar so it can adjust its links */}
      <Sidebar role={currentRole} />

      <div className="flex-1 ml-72 flex flex-col min-h-screen relative z-10">
        
        {/* Pass role to Topbar so it can adjust profile details */}
        <Topbar role={currentRole} />
        
        <main className="p-12 space-y-12 animate-in fade-in duration-700">
          
          {/* ==========================================
              IF ROLE IS 'USER' (Mother/Caregiver)
              ========================================== */}
          {currentRole === "user" && (
            <>
              <header className="space-y-3">
                <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight flex items-center gap-3">
                  Good Morning, Maya <span className="text-[#FA9021]">☀</span>
                </h1>
                <p className="text-lg text-gray-400 font-medium max-w-2xl">
                  Your unified foundation for long-term independence.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <ChildcareHub />
                <FiscalCore />
                <WellbeingTracker />
              </div>

              <section className="pt-8">
                <EmergencySOS />
              </section>
            </>
          )}

          {/* ==========================================
              IF ROLE IS 'GUARDIAN'
              ========================================== */}
          {currentRole === "guardian" && (
            <GuardianDashboard />
          )}

          {/* ==========================================
              IF ROLE IS 'MENTOR'
              ========================================== */}
          {currentRole === "mentor" && (
            <MentorDashboard />
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;