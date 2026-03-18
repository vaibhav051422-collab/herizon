"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Plus } from "lucide-react"; 
import { io } from "socket.io-client";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ChildcareHub from "../components/Dashboard/ChildCareHub"; 
import FiscalCore from "../components/Dashboard/FiscalCore";
import WellbeingTracker from "../components/Dashboard/WellbeingTracker";
import EmergencySOS from "../components/Dashboard/EmergencySOS";
import GuardianDashboard from "../components/guardian/GuardianDashboard";
import MentorDashboard from "../components/mentor/MentorDashboard";
import CircleManager from "../components/Dashboard/CircleManager";

// Backend URL matches your server settings
const socket = io("http://localhost:5000");

const Dashboard = () => {
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState(null);
  const [circleId, setCircleId] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({ title: "", time: "", date: "Today" });

  const fetchTasks = useCallback(async (cid) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/tasks/${cid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }
        const res = await axios.get("http://localhost:5000/api/dashboard/init", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          const cid = res.data.circleId || null;
          setCurrentRole(res.data.role?.toLowerCase() || "user");
          setCircleId(cid);
          setInviteCode(res.data.inviteCode || "");
          setUserName(res.data.userName || "User");
          
          if (cid) { 
            // 🔥 Room Sync: Important for both User and Mentor
            socket.emit("join-circle", cid); 
            fetchTasks(cid); 
          }
          if (res.data.userId) socket.emit("join-circle", res.data.userId);
        }
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchData();

    socket.on("task-update", (data) => {
      const newNotif = {
        id: Date.now(),
        message: data.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      if (circleId) fetchTasks(circleId); 
    });

    socket.on("new-task-alert", (newTask) => {
      setTasks(prev => [...prev, newTask]); 
    });

    // 🔥 MENTOR VC REQUEST LISTENER
    socket.on("new-help-alert", (helpData) => {
      const newNotif = {
        id: Date.now(),
        message: `${helpData.userName} requested a Video Session`,
        time: helpData.time,
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);

      if (currentRole === "mentor") {
         setTasks(prev => [helpData, ...prev]); 
      }
    });

    return () => {
      socket.off("task-update");
      socket.off("new-task-alert");
      socket.off("new-help-alert");
    };
  }, [circleId, fetchTasks, currentRole]);

  const handlePostTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/tasks/create", 
        { ...taskData, circleId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setIsModalOpen(false);
        setTaskData({ title: "", time: "", date: "Today" });
      }
    } catch (err) { console.error(err); }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FA9021] font-black animate-pulse italic text-2xl uppercase tracking-widest">Initialising...</div>;

  const renderOverview = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12">
      {currentRole === "user" && (
        <>
          <CircleManager role={currentRole} currentInviteCode={inviteCode} />
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-6xl font-black mb-2 uppercase italic tracking-tighter">Hello, {userName}</h1>
              <p className="text-xl text-gray-500 font-bold uppercase tracking-widest">System Armed & Monitoring</p>
            </div>
            {circleId && (
              <button onClick={() => setIsModalOpen(true)} className="bg-[#FA9021] text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 uppercase text-xs tracking-[0.2em] shadow-lg">
                <Plus size={18} /> New Request
              </button>
            )}
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ChildcareHub tasks={tasks} /> 
            <FiscalCore tasks={tasks} /> 
            {/* 🔥 Props passed to ensure button works */}
            <WellbeingTracker circleId={circleId} userName={userName} />
          </div>

          <div className="mt-12">
            <EmergencySOS circleId={circleId} userName={userName} />
          </div>
        </>
      )}

      {currentRole === "guardian" && (
        <GuardianDashboard 
          tasks={tasks} 
          setTasks={setTasks} 
          userName={userName} 
          circleId={circleId} 
        />
      )}

      {currentRole === "mentor" && (
        // 🔥 Mentor needs circleId to join the socket room
        <MentorDashboard tasks={tasks} circleId={circleId} />
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-white/90 relative overflow-hidden font-sans">
      <Sidebar role={currentRole} tasks={tasks} />
      <div className="flex-1 ml-80 flex flex-col min-h-screen">
        <Topbar userName={userName} notifications={notifications} setNotifications={setNotifications} />
        <main className="p-12">
          {location.pathname === "/dashboard" ? renderOverview() : <Outlet context={{ tasks, circleId }} />}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full space-y-8 shadow-2xl text-center">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">New Mission<span className="text-[#FA9021]">.</span></h2>
            <form onSubmit={handlePostTask} className="space-y-6">
              <input type="text" placeholder="TITLE (E.G. SCHOOL PICKUP)" required className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FA9021] outline-none font-black uppercase text-xs tracking-widest" onChange={(e) => setTaskData({...taskData, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="TIME (02:00 PM)" required className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FA9021] outline-none font-black uppercase text-xs tracking-widest" onChange={(e) => setTaskData({...taskData, time: e.target.value})} />
                <input type="text" placeholder="DATE (TODAY)" className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FA9021] outline-none font-black uppercase text-xs tracking-widest" onChange={(e) => setTaskData({...taskData, date: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#FA9021] text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;