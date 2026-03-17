"use client";
import React, { useState, useEffect } from "react";
import { 
  MapPin, Activity, ShieldCheck, CheckCircle2, 
  Clock, AlertTriangle, ArrowRight, XCircle
} from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";

// Backend URL matches your server settings
const socket = io("http://localhost:4001");

const GuardianDashboard = () => {
  const [userName, setUserName] = useState("Guardian");
  const [isOnline, setIsOnline] = useState(true);
  const [sosAlert, setSosAlert] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [circleId, setCircleId] = useState(null);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4001/api/dashboard/init", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(res.data.userName);
        setIsOnline(res.data.isOnline); // Database se status fetch karega
        if (res.data.circleId) {
          setCircleId(res.data.circleId);
          socket.emit("join-circle", res.data.circleId);
        }
      } catch (err) { console.error("Init failed"); }
    };

    fetchInitData();

    socket.on("receive-sos", (data) => {
      setSosAlert(data);
      const audio = new Audio("/emergency_alarm.mp3");
      audio.play().catch(e => console.log("Audio play blocked"));
    });

    return () => { socket.off("receive-sos"); };
  }, []);

  // 1. Availability Toggle Function
  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = !isOnline;
      await axios.post("http://localhost:4001/api/availability", 
        { isOnline: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsOnline(newStatus);
    } catch (err) { alert("Status update failed"); }
  };

  // 2. Task Action Function (Accept/Decline)
  const handleTaskAction = async (taskId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4001/api/task/action", 
        { taskId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Task ${action}ed!`);
      // Optional: Yahan task ko local state se filter karke hide kar sakte hain
    } catch (err) { alert("Task action failed"); }
  };

  const handleJoin = async () => {
    if (inviteCode.length < 6) return alert("Please enter a 6-digit code");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:4001/api/circle/join", 
        { inviteCode: inviteCode.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.circleId) {
        localStorage.setItem("circleId", res.data.circleId);
        setCircleId(res.data.circleId);
        socket.emit("join-circle", res.data.circleId);
        alert("✅ Linked Successfully!");
        window.location.reload(); 
      }
    } catch (err) { alert(err.response?.data?.message || "Invalid Code"); }
  };

  return (
    <>
      {/* EMERGENCY SOS OVERLAY */}
      {sosAlert && (
        <div className="fixed inset-0 z-[999] bg-rose-600 flex items-center justify-center p-6 animate-pulse">
          <div className="bg-black/90 border-4 border-white rounded-[3rem] p-12 max-w-2xl w-full text-center space-y-8 shadow-[0_0_100px_rgba(255,255,255,0.3)]">
            <div className="flex justify-center">
               <div className="p-8 bg-rose-500 rounded-full animate-bounce">
                  <AlertTriangle size={80} className="text-white" />
               </div>
            </div>
            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Emergency SOS</h2>
            <p className="text-2xl text-white/80 font-bold">
               <span className="text-rose-500 uppercase">{sosAlert.userName || "Distress"}</span> triggered a signal!
            </p>
            <div className="flex gap-4">
              <button onClick={() => setSosAlert(null)} className="flex-1 py-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      <header className="space-y-4">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">Ready to Assist, {userName} 🛡️</h1>
        <p className="text-xl text-white/50 font-medium max-w-3xl">Active and supporting families in your network.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-4">
        {/* PILLAR 1: Active Requests */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:border-[#FA9021]/30 transition-all shadow-lg group flex flex-col justify-between min-h-[280px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-[#FA9021]/10 rounded-xl flex items-center justify-center border border-[#FA9021]/20"><MapPin size={26} className="text-[#FA9021]" /></div>
            {!circleId ? (
              <div className="flex items-center gap-3">
                <input type="text" placeholder="CODE" maxLength={6} onChange={(e) => setInviteCode(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-lg text-white outline-none w-32 focus:border-[#FA9021] font-mono text-center" />
                <button onClick={handleJoin} className="bg-[#FA9021] text-black font-black px-5 py-3 rounded-xl hover:scale-105 transition-all text-sm uppercase">LINK</button>
              </div>
            ) : ( <span className="px-4 py-2 bg-[#050505] border border-[#FA9021]/30 rounded-full text-[11px] font-black text-[#FA9021] uppercase tracking-widest">Linked</span> )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Pending Task</h3>
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex flex-col gap-2 mb-6">
              <div className="flex items-center justify-between text-gray-200 font-bold">
                <div className="flex items-center gap-3"><Clock size={18} className="text-[#FA9021]" /> School Pickup</div>
                <span className="text-sm text-white">02:00 PM</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleTaskAction('task_1', 'Accept')} className="flex-1 py-4 rounded-2xl border border-transparent bg-[#FA9021]/10 text-sm font-bold uppercase tracking-widest text-[#FA9021]">Accept</button>
              <button onClick={() => handleTaskAction('task_1', 'Decline')} className="flex-1 py-4 rounded-2xl border border-white/10 bg-transparent text-sm font-bold uppercase tracking-widest text-gray-400">Decline</button>
            </div>
          </div>
        </div>

        {/* PILLAR 2: Network Status */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[280px]">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20"><Activity size={26} className="text-emerald-500" /></div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Availability</h3>
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex items-center justify-between mb-5">
              <div className={`flex items-center gap-3 text-base font-bold ${isOnline ? 'text-emerald-500' : 'text-gray-500'}`}>
                 <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} /> 
                 {isOnline ? "Online & Ready" : "Standby Mode"}
              </div>
              {/* Added onClick for Toggle Availability */}
              <button onClick={toggleAvailability} className={`w-12 h-7 rounded-full p-1 transition-colors ${isOnline ? "bg-emerald-500/20" : "bg-gray-800"}`}>
                <div className={`w-4.5 h-4.5 rounded-full transition-transform ${isOnline ? "bg-emerald-500 translate-x-5" : "bg-gray-400 translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* PILLAR 3: Community Trust */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[280px]">
          <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20"><ShieldCheck size={26} className="text-purple-500" /></div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Community Trust</h3>
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-4 text-base text-gray-300 font-medium"><CheckCircle2 size={20} className="text-purple-500" /> Background Checked</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuardianDashboard;