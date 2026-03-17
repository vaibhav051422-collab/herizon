"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/TopBar";
import ChildcareHub from "../components/Dashboard/ChildCareHub";
import FiscalCore from "../components/Dashboard/FiscalCore";
import WellbeingTracker from "../components/Dashboard/WellbeingTracker";
import EmergencySOS from "../components/Dashboard/EmergencySOS";
import GuardianDashboard from "../components/guardian/GuardianDashboard";
import MentorDashboard from "../components/mentor/MentorDashboard";
import CircleManager from "../components/Dashboard/CircleManager";

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState(null);
  const [circleId, setCircleId] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await axios.get("http://localhost:5000/api/dashboard/init", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setCurrentRole(res.data.role?.toLowerCase() || "user");
          setCircleId(res.data.circleId || null);
          setInviteCode(res.data.inviteCode || "");
          setUserName(res.data.userName || "User");
          localStorage.setItem("circleId", res.data.circleId || "");
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to connect to server. Check Port 5000.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FA9021]">Syncing...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;

  return (
    <div className="flex min-h-screen bg-[#050505] text-white/90 relative overflow-hidden">
      <Sidebar role={currentRole} />

      <div className="flex-1 ml-80 flex flex-col min-h-screen">
        <Topbar role={currentRole} name={userName} />
        
        <main className="p-12 space-y-12">
          
          {/* 🔥 FINAL FIX: Remove !circleId check so code is ALWAYS visible for users */}
          {currentRole === "user" && (
            <CircleManager role={currentRole} currentInviteCode={inviteCode} />
          )}

          {currentRole === "user" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <header className="mb-10">
                <h1 className="text-6xl font-black mb-2">Hello, {userName}</h1>
                <p className="text-xl text-gray-500 font-bold">
                  {circleId ? "System Armed & Monitoring" : "Action Needed: Activate Your Circle"}
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ChildcareHub />
                <FiscalCore />
                <WellbeingTracker />
              </div>

              <div className="mt-12">
                <EmergencySOS circleId={circleId} userName={userName} />
              </div>
            </div>
          )}

          {/* Role-Based Dashboards */}
          {currentRole === "guardian" && <GuardianDashboard />}
          {currentRole === "mentor" && <MentorDashboard />}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;