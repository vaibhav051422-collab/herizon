"use client";
import React, { useState, useRef } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

const LoginForm = () => {
  const [role, setRole] = useState("user"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Sending role along with email and password to backend
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }), // ROLE INCLUDED HERE
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2. Storing both token and role in localStorage
        localStorage.setItem("token", data.token);
        
        // If your backend doesn't return the role in 'data', you can store the state 'role'.
        // Ideally, backend should return it like data.role
        localStorage.setItem("userRole", data.role || role); 
        localStorage.setItem("userName", data.name || "User"); // Store name if available
        
        // 3. Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        alert(data.message || `Invalid Credentials for role: ${role.toUpperCase()}`);
      }
    } catch {
      alert("System Offline: Could not reach the Resilience Engine.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#050505] font-sans relative overflow-hidden px-6">
      
    
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FA9021]/10 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#E87D0E]/10 blur-[150px] animate-pulse delay-1000" />
      </div>

      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="w-full max-w-xl p-12 lg:p-16 space-y-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 before:absolute before:inset-0 before:rounded-[3.5rem] before:bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(250,144,33,0.15)_0%,transparent_50%)] before:pointer-events-none transition-all duration-500 hover:border-white/10"
      >
        
       
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#FA9021]/10 text-[#FA9021] mb-2 border border-[#FA9021]/20 shadow-[0_0_30px_rgba(250,144,33,0.2)]">
            <ShieldCheck size={44} />
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tighter uppercase leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Identify User
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-[0.4em] font-bold">Authorized Entry Only</p>
        </div>

      
        <div className="grid grid-cols-3 gap-3 rounded-full bg-white/5 p-2 border border-white/10">
          {['user', 'guardian', 'mentor'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-4 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-500 cursor-pointer ${
                role === r ? "bg-white text-black scale-[1.02] shadow-2xl" : "text-white/30 hover:text-white hover:bg-white/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-8">
            
           
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-widest ml-8">Authorized Email</label>
              <div className="relative group">
                <Mail className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-white/20 group-focus-within:text-[#FA9021] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@herizon.com"
                  className="block w-full rounded-full border border-white/10 bg-white/[0.05] py-6 pl-16 pr-8 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#FA9021]/50 transition-all text-lg"
                  required
                />
              </div>
            </div>

          
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-widest ml-8">Security Cipher</label>
              <div className="relative group">
                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-white/20 group-focus-within:text-[#FA9021] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-full border border-white/10 bg-white/[0.05] py-6 pl-16 pr-8 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#FA9021]/50 transition-all text-lg"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 rounded-full bg-[#FA9021] px-10 py-6 text-sm font-black uppercase tracking-[0.3em] text-white shadow-[0_0_20px_rgba(250,144,33,0.3)] hover:bg-[#ff9f3f] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer"
          >
            Access Dashboard
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </form>

        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            No Identity?{" "}
            <button
              onClick={() => (window.location.href = "/Signup")}
              className="text-[#FA9021] hover:text-[#ff9f3f] transition-colors hover:underline cursor-pointer"
            >
              Initialize Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;