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

// Backend Connection
const socket = io("http://localhost:5000");

const Dashboard = () => {
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState(null);
  const [circleId, setCircleId] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({ title: "", time: "", date: "Today" });

  const fetchTasks = useCallback(async (cid) => {
    if (!cid) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/tasks/${cid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) { console.error("Task fetch failed", err); }
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
          const uid = res.data.userId || null;
          
          setCurrentRole(res.data.role?.toLowerCase() || "user");
          setCircleId(cid);
          setUserId(uid);
          setInviteCode(res.data.inviteCode || "");
          setUserName(res.data.userName || "User");
          
        
          if (cid) { 
            socket.emit("join-circle", cid); 
            fetchTasks(cid); 
          }
          
         
          if (uid) {
            socket.emit("join-circle", uid);
          }
        }
      } catch (err) { console.error("Init failed", err); } 
      finally { setIsLoading(false); }
    };

    fetchData();

    socket.on("task-update", (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        message: data.message,
        time: "Just Now",
        read: false
      }, ...prev]);
      if (circleId) fetchTasks(circleId); 
    });

    socket.on("new-task-alert", (newTask) => {
      setTasks(prev => [newTask, ...prev]); 
    });

    // 🔥] SYNC: Proper Identity Handling for Help Alerts
    socket.on("new-help-alert", (helpData) => {
      setNotifications(prev => [{
        id: Date.now(),
        message: `🚨 ALERT: ${helpData.userName} needs a VC Session!`,
        time: helpData.time,
        read: false
      }, ...prev]);

      
      if (currentRole === "mentor") {
         setTasks(prev => [helpData, ...prev]); 
      }
    });

   
    socket.on("receive-vc-link", (data) => {
      alert(`🚀 BRIDGE ESTABLISHED: ${data.mentorName} sent a meet link. Check notifications.`);
      setNotifications(prev => [{
        id: Date.now(),
        message: `${data.mentorName}: Click to join VC`,
        link: data.meetLink,
        read: false
      }, ...prev]);
    });

    return () => {
      socket.off("task-update");
      socket.off("new-task-alert");
      socket.off("new-help-alert");
      socket.off("receive-vc-link");
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
    } catch (err) { alert("Mission Broadcast Failed"); }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FA9021] font-black italic text-2xl animate-pulse uppercase tracking-[0.5em]">System Loading...</div>;

  const renderOverview = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12">
      {currentRole === "user" && (
        <>
          <CircleManager role={currentRole} currentInviteCode={inviteCode} />
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-6xl font-black mb-2 uppercase italic tracking-tighter">Hello, {userName}</h1>
              <p className="text-xl text-white/30 font-bold uppercase tracking-[0.3em]">Guardian Network Status: Active</p>
            </div>
            {circleId && (
              <button onClick={() => setIsModalOpen(true)} className="bg-[#FA9021] text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(250,144,33,0.3)] hover:scale-105 transition-all">
                <Plus size={18} /> New Request
              </button>
            )}
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ChildcareHub tasks={tasks} /> 
            <FiscalCore tasks={tasks} /> 
            <WellbeingTracker circleId={circleId} userName={userName} />
          </div>

          <div className="mt-12">
            <EmergencySOS circleId={circleId} userName={userName} />
          </div>
        </>
      )}

      {currentRole === "guardian" && (
        <GuardianDashboard tasks={tasks} setTasks={setTasks} userName={userName} circleId={circleId} />
      )}

      {currentRole === "mentor" && (
        <MentorDashboard tasks={tasks} circleId={circleId} />
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-white/90 relative font-sans">
      <Sidebar role={currentRole} tasks={tasks} />
      <div className="flex-1 ml-80 flex flex-col min-h-screen">
        <Topbar userName={userName} notifications={notifications} setNotifications={setNotifications} />
        <main className="p-12">
          {location.pathname === "/dashboard" ? renderOverview() : <Outlet context={{ tasks, circleId }} />}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-[3rem] p-12 max-w-md w-full space-y-8 shadow-2xl">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Broadcast Mission<span className="text-[#FA9021]">.</span></h2>
            <form onSubmit={handlePostTask} className="space-y-6">
              <input type="text" placeholder="TASK (E.G. MEDICINE RESTOCK)" required className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FA9021] outline-none font-bold uppercase text-[10px] tracking-widest" onChange={(e) => setTaskData({...taskData, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="TIME" required className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FA9021] outline-none font-bold uppercase text-[10px] tracking-widest" onChange={(e) => setTaskData({...taskData, time: e.target.value})} />
                <input type="text" placeholder="DATE" className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FA9021] outline-none font-bold uppercase text-[10px] tracking-widest" onChange={(e) => setTaskData({...taskData, date: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">Abort</button>
                <button type="submit" className="flex-1 py-5 bg-[#FA9021] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;