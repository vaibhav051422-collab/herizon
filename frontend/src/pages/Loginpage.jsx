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
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid Email or Password");
      }
    } catch (error) {
      alert("System Offline: Could not reach the Resilience Engine.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#020202] font-sans relative overflow-hidden px-6">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="w-full max-w-lg p-12 lg:p-16 space-y-12 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl relative z-10 before:absolute before:inset-0 before:rounded-[3rem] before:bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(99,102,241,0.15)_0%,transparent_50%)] before:pointer-events-none"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-500 mb-4 border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter uppercase leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Identify User
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-medium">Authorized Entry Only</p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-full bg-white/5 p-1.5 border border-white/5">
          {['user', 'guardian', 'mentor'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-500 cursor-pointer ${
                role === r ? "bg-white text-black scale-[1.05] shadow-xl" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-6">Authorized Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name123@gmail.com"
                  className="block w-full rounded-full border border-white/10 bg-white/[0.03] py-5 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-6">Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-full border border-white/10 bg-white/[0.03] py-5 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            
            className="w-full flex items-center justify-center gap-3 rounded-full bg-white px-8 py-5 text-xs font-bold uppercase tracking-[0.3em] text-black shadow-xl hover:bg-indigo-600 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer"
            onClick={()=>window.location.href="/dashboard"}
          >
            Access Dashboard
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-700">
            No Identity?{" "}
            <button
              onClick={() => (window.location.href = "/Signup")}
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-8 hover:underline"
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