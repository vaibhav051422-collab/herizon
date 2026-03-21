"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  Video, ExternalLink, Shield, Copy, Users, 
  UserCheck, RefreshCw, Send, X, Terminal
} from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");


const MenteeCard = ({ mentee }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [meetLink, setMeetLink] = useState("");

  const sendLink = async (id) => {
    if (!meetLink.trim() || !meetLink.includes("meet.google.com")) {
      return alert("PLEASE ENTER A VALID GOOGLE MEET LINK");
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/mentor/send-vc-link", 
        { menteeId: id, meetLink: meetLink.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("BRIDGE ESTABLISHED: LINK TRANSMITTED!");
      setShowLinkInput(false);
      setMeetLink("");
    } catch (err) { 
      console.error(err);
      alert("LINK SENDING FAILED - Check Backend Connection"); 
    }
  };

  return (
    <div className="bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-8 hover:border-[#FA9021]/40 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FA9021]/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-[#FA9021]/10 transition-all" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#FA9021]/20 transition-colors">
          <UserCheck className="text-white/30 group-hover:text-[#FA9021]" size={24} />
        </div>
      </div>

      <div className="relative z-10">
        <h4 className="text-3xl font-black text-white uppercase mb-1 tracking-tight group-hover:text-[#FA9021] transition-colors" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
          {mentee.name}
        </h4>
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-8">
            {mentee.email}
        </p>

        {!showLinkInput ? (
          <button 
            onClick={() => setShowLinkInput(true)}
            className="w-full py-5 bg-[#FA9021]/10 border border-[#FA9021]/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#FA9021] hover:bg-[#FA9021] hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <Video size={14} /> Start VC Session
          </button>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <input 
              type="text" 
              placeholder="PASTE GOOGLE MEET LINK HERE"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-[10px] text-white outline-none focus:border-[#FA9021] font-bold placeholder:text-white/10"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => sendLink(mentee._id)} 
                className="flex-1 py-4 bg-emerald-500 text-black rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Send size={12} /> Establish Bridge
              </button>
              <button 
                onClick={() => setShowLinkInput(false)} 
                className="px-5 py-4 bg-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/20 hover:text-rose-500 transition-all"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const MentorDashboard = () => {
  const [userName, setUserName] = useState("Mentor");
  const [myMentorCode, setMyMentorCode] = useState("LOADING...");
  const [activeRequest, setActiveRequest] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  //  Sync: Memoized fetcher for real-time updates
  const fetchMentees = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/mentor/mentees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentees(res.data); 
    } catch (err) { console.error("FETCH_ERROR:", err); }
  }, []);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/init", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserName(res.data.userName);
        setMyMentorCode(res.data.myMentorCode || "NOT_ASSIGNED");
        
        //  Sync: Ensure Mentor is in their private room
        if (res.data.userId) {
          socket.emit("join-circle", res.data.userId);
        }
        
        await fetchMentees();
        setIsLoaded(true);
      } catch (err) {
        console.error("INIT_ERROR:", err);
        setIsLoaded(true);
      }
    };

    fetchMentorData();

    //  Sync: Refresh list when new mentee links
    socket.on("new-mentee-request", () => {
        setTimeout(() => fetchMentees(), 1000);
    });

   
    socket.on("new-help-alert", (data) => {
      setActiveRequest(data);
      new Audio("/notification.mp3").play().catch(() => {});
    });

    return () => { 
      socket.off("new-help-alert"); 
      socket.off("new-mentee-request");
    };
  }, [fetchMentees]);

  const copyCode = () => {
    navigator.clipboard.writeText(myMentorCode);
    alert("MENTOR CODE COPIED!");
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      
     
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase italic">
            Command Center, <span className="text-[#FA9021]">{userName}</span> 🛡️
          </h1>
          <p className="text-xs text-white/40 font-black uppercase tracking-[0.5em] flex items-center gap-2">
            <Terminal size={14} className="text-[#FA9021]" /> Secure Mentorship Node • Status: Active
          </p>
        </div>

        <div onClick={copyCode} className="bg-[#FA9021]/5 border border-[#FA9021]/20 p-6 rounded-[2.5rem] cursor-pointer hover:bg-[#FA9021]/10 transition-all flex items-center gap-6">
          <div>
            <p className="text-[10px] font-black text-[#FA9021] uppercase tracking-[0.3em] mb-1">Your Mentor ID</p>
            <span className="text-3xl font-black text-white italic">{myMentorCode}</span>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl"><Copy size={20} className="text-[#FA9021]" /></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className={`lg:col-span-2 border rounded-[3.5rem] p-12 min-h-[400px] flex flex-col justify-between transition-all ${activeRequest ? "bg-[#FA9021]/10 border-[#FA9021]/50 shadow-[0_0_50px_rgba(250,144,33,0.1)]" : "bg-[#0c0c0e] border-white/5"}`}>
          <div className="space-y-8">
            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center ${activeRequest ? "bg-[#FA9021] text-black animate-pulse" : "bg-white/5 text-white/20"}`}>
              <Video size={40} />
            </div>
            <div>
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">
                {activeRequest ? "Signal Detected" : "Scanning Signals..."}
              </h3>
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-lg">
                {activeRequest 
                  ? `URGENT: ${activeRequest.userName.toUpperCase()} is requesting guidance. Establishing bridge required.` 
                  : "Awaiting incoming help signals. System status: ACTIVE."}
              </p>
            </div>
          </div>
          {activeRequest && (
            <div className="flex gap-5 mt-10">
              <button onClick={() => window.open("https://meet.google.com/new", "_blank")} className="flex-[2] py-7 bg-[#FA9021] text-black rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                <ExternalLink size={24} /> Create Meet Link
              </button>
              <button onClick={() => setActiveRequest(null)} className="flex-1 py-7 border border-white/10 text-white/40 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Dismiss</button>
            </div>
          )}
        </div>


        <div className="bg-[#0c0c0e] border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
               <Shield size={40} className="text-emerald-500" />
            </div>
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Secure Protocol</h4>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
              Encryption standards active for all bridge sessions. Connection is safe.
            </p>
        </div>
      </div>

      <section className="space-y-10 pt-10">
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-5">
              <Users className="text-[#FA9021]" size={32} /> Linked Mentees <span className="text-white/20">[{mentees.length}]</span>
            </h3>
            <button onClick={fetchMentees} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-white/40">
                <RefreshCw size={18} />
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {mentees.length > 0 ? mentees.map((mentee) => (
            <MenteeCard key={mentee._id} mentee={mentee} />
          )) : (
            <div className="col-span-full py-24 border-2 border-dashed border-white/5 rounded-[4rem] text-center opacity-30 italic font-black uppercase tracking-[0.5em]">
              No Connections Detected
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MentorDashboard;