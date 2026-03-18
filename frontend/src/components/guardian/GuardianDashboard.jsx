"use client";
import React, { useState, useEffect } from "react";
import { 
  MapPin, Activity, ShieldCheck, CheckCircle2, 
  Clock, AlertTriangle, ArrowRight, XCircle, Unlink
} from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const GuardianDashboard = () => {
  const [userName, setUserName] = useState("Guardian");
  const [isOnline, setIsOnline] = useState(true);
  const [sosAlert, setSosAlert] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [circleId, setCircleId] = useState(null);
  const [tasks, setTasks] = useState([]); 
  const [isLoaded, setIsLoaded] = useState(false);

  const coordinationTasks = tasks.filter(task => {
    const isNotVC = task.type !== "mentor_vc";
    const isNotDummyVC = !task.title?.toLowerCase().includes("asking for a vc");
    const hasValidTitle = task.title && task.title !== "User";
    return isNotVC && isNotDummyVC && hasValidTitle;
  });

  const fetchTasks = async (cid) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/tasks/${cid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) { console.error("Fetch tasks failed"); }
  };

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/init", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(res.data.userName);
        setIsOnline(res.data.isOnline); 
        
        if (res.data.circleId) {
          setCircleId(res.data.circleId);
          socket.emit("join-circle", res.data.circleId);
          fetchTasks(res.data.circleId);
        }
      } catch (err) { console.error("Init failed"); }
      finally { setIsLoaded(true); }
    };

    fetchInitData();

    socket.on("new-task-alert", (newTask) => {
      setTasks(prev => [newTask, ...prev]);
    });

    socket.on("receive-sos", (data) => {
      setSosAlert(data);
      new Audio("/emergency_alarm.mp3").play().catch(() => {});
    });

    return () => { 
      socket.off("receive-sos"); 
      socket.off("new-task-alert");
    };
  }, []);

  // 🔥 NEW: UNLINK LOGIC
  const handleUnlink = async () => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO UNLINK FROM THIS UNIT?")) return;
    try {
      const token = localStorage.getItem("token");
      // Backend api for leaving circle
      await axios.post("http://localhost:5000/api/circle/leave", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCircleId(null);
      setTasks([]);
      alert("✅ UNIT UNLINKED SUCCESSFULLY");
    } catch (err) { alert("UNLINK FAILED"); }
  };

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = !isOnline;
      await axios.post("http://localhost:5000/api/availability", 
        { isOnline: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsOnline(newStatus);
    } catch (err) { alert("Status update failed"); }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/task/action", 
        { taskId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) { alert("Task action failed"); }
  };

  const handleJoin = async () => {
    if (inviteCode.length < 6) return alert("Please enter a 6-digit code");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/circle/join", 
        { inviteCode: inviteCode.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.circleId) {
        setCircleId(res.data.circleId);
        socket.emit("join-circle", res.data.circleId);
        fetchTasks(res.data.circleId);
        alert("✅ LINKED SUCCESSFULLY!");
      }
    } catch (err) { alert(err.response?.data?.message || "Invalid Code"); }
  };

  if (!isLoaded) return null;

  const currentTask = coordinationTasks[0];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {sosAlert && (
        <div className="fixed inset-0 z-[999] bg-rose-600 flex items-center justify-center p-6 animate-pulse">
          <div className="bg-black/90 border-4 border-white rounded-[3rem] p-12 max-w-2xl w-full text-center space-y-8 shadow-2xl">
            <AlertTriangle size={80} className="text-rose-500 mx-auto animate-bounce" />
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter">Emergency SOS</h2>
            <p className="text-2xl text-white/80 font-bold uppercase tracking-widest">{sosAlert.userName} In Distress!</p>
            <button onClick={() => setSosAlert(null)} className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest">Acknowledge</button>
          </div>
        </div>
      )}

      <header className="space-y-4">
        <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">Ready to Assist, {userName} 🛡️</h1>
        <p className="text-xl text-white/50 font-bold uppercase tracking-widest">Active and supporting families in your network.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-4">
        
        <div className="bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-8 hover:border-[#FA9021]/30 transition-all shadow-lg group flex flex-col justify-between min-h-[350px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-[#FA9021]/10 rounded-xl flex items-center justify-center border border-[#FA9021]/20"><MapPin size={26} className="text-[#FA9021]" /></div>
            
            {!circleId ? (
              <div className="flex items-center gap-3">
                <input type="text" placeholder="CODE" maxLength={6} onChange={(e) => setInviteCode(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-lg text-white outline-none w-32 focus:border-[#FA9021] font-bold text-center" />
                <button onClick={handleJoin} className="bg-[#FA9021] text-black font-bold px-5 py-3 rounded-xl hover:scale-105 transition-all text-sm uppercase">LINK</button>
              </div>
            ) : ( 
              /* 🔥 UPDATED: Added Unlink Button instead of static text */
              <button 
                onClick={handleUnlink}
                className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 hover:text-black transition-all"
              >
                <Unlink size={12} /> Unlink Unit
              </button>
            )}
          </div>
          
          <div>
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Active Missions</h3>
            {currentTask ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex items-center justify-between text-gray-200 font-bold">
                    <div className="flex items-center gap-3"><Clock size={18} className="text-[#FA9021]" /> <span className="uppercase tracking-widest text-sm">{currentTask.title}</span></div>
                    <span className="text-sm text-white font-black">{currentTask.time}</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleTaskAction(currentTask._id, 'completed')} className="flex-1 py-5 rounded-2xl border border-transparent bg-[#FA9021]/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#FA9021] hover:bg-[#FA9021] hover:text-black transition-all">Accept</button>
                  <button onClick={() => handleTaskAction(currentTask._id, 'decline')} className="flex-1 py-5 rounded-2xl border border-white/10 bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-white/5 transition-all">Decline</button>
                </div>
              </div>
            ) : (
              <div className="p-12 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-center leading-relaxed">No Active Coordination <br /> Signals Detected</p>
              </div>
            )}
          </div>
        </div>

        {/* ... Rest of the components (Availability and Trust) same as before */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-8 hover:border-emerald-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[350px]">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20"><Activity size={26} className="text-emerald-500" /></div>
          <div>
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Status</h3>
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex items-center justify-between mb-5">
              <div className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest ${isOnline ? 'text-emerald-500' : 'text-gray-500'}`}>
                 <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} /> 
                 {isOnline ? "Active" : "Standby"}
              </div>
              <button onClick={toggleAvailability} className={`w-14 h-8 rounded-full p-1.5 transition-colors ${isOnline ? "bg-emerald-500/20" : "bg-gray-800"}`}>
                <div className={`w-5 h-5 rounded-full transition-transform duration-300 ${isOnline ? "bg-emerald-500 translate-x-6" : "bg-gray-400 translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-8 hover:border-purple-500/30 transition-all shadow-lg group flex flex-col justify-between min-h-[350px]">
          <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20"><ShieldCheck size={26} className="text-purple-500" /></div>
          <div>
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Verified</h3>
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-4 text-xs text-gray-400 font-black uppercase tracking-[0.2em]"><CheckCircle2 size={20} className="text-purple-500" /> Secure Node</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuardianDashboard;