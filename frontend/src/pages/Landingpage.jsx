"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Code2, Zap, Shield, Clock, ArrowRight, Check, Terminal,
  Database, Workflow, ChevronRight, Github, Twitter, Linkedin,
} from "lucide-react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[140px] animate-pulse delay-1000" />
      </div>

      
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent uppercase tracking-widest">
              herizon
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          </div>
          <button 
          onClick={()=>window.location.href="/Signup"}
          className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]">
            Sign in
          </button>
        </div>
      </nav>

    
      <section className="pt-48 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-6 px-4 py-1 border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">
                AI-Native Operations for Life
              </div>

              <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Stop wrestling with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-600">
                  work-life chaos
                </span>
              </h1>

              <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-lg">
                Built for single parents and career returners who need actual
                help—not another to-do app. Coordinate childcare, track
                wellbeing, and manage finances through a unified, intelligent core.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-white text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
                >
                  Start free trial <ArrowRight size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ bg: "rgba(255,255,255,0.1)" }}
                  className="border border-white/10 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all"
                >
                  View demo
                </motion.button>
              </div>
            </motion.div>

         
            <motion.div
              style={{ rotateX, scale, perspective: 1000 }}
              className="relative hidden lg:block group"
            >
             \
              <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 border border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-3 shadow-2xl overflow-hidden transition-all duration-700 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_60px_rgba(99,102,241,0.3)]">
               
                <img
                  src="/images/hero-product.png"
                  alt="Herizon Dashboard"
                  className="w-full rounded-[1.8rem] transition-all duration-700 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.01]"
                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                />
                <div style={{ display: "none" }} className="w-full h-96 bg-black flex items-center justify-center text-gray-500 text-xs tracking-widest uppercase">
                  Product Core Interface
                </div>
              </div>

              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="absolute -bottom-8 -left-8 bg-black/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)] z-20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <Zap size={20} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-[20px] font-bold text-white tracking-tighter">87%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stability Increase</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

     
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Terminal, title: "Smart Scheduling", desc: "AI that actually learns your patterns. No more manual calendar tetris.", color: "indigo" },
              { icon: Shield, title: "Verified Network", desc: "Background-checked helpers in your area. Not random strangers.", color: "indigo" },
              { icon: Database, title: "Finance Tracking", desc: "See exactly where your money goes. Budgeting that doesn't make you feel broke.", color: "indigo" },
              { icon: Code2, title: "Mental Health Check-ins", desc: "Quick mood tracking. Optional therapy resources. Zero judgment.", color: "indigo" },
              { icon: Workflow, title: "Task Automation", desc: "Recurring pickups, bill reminders, meal planning—set it once, forget it.", color: "indigo" },
              { icon: Clock, title: "Emergency Backup", desc: "Last-minute childcare SOS? We've got your back with trusted contacts.", color: "indigo" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-10 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-3xl hover:bg-white/[0.05] transition-all hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] group"
              >
                <div className="text-indigo-500 mb-8 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-200 mb-4">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="workflow" className="py-32 px-6 border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-12 tracking-tighter uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                How it works
              </h2>
              <div className="space-y-12">
                {[
                  { step: "01", title: "Sign up in 60 seconds", desc: "Email, password, done. No 47-field questionnaire." },
                  { step: "02", title: "Import your calendar", desc: "Google Calendar sync. We pull in your existing chaos." },
                  { step: "03", title: "Add your support network", desc: "Invite trusted contacts. Set permissions." },
                  { step: "04", title: "Let the system work", desc: "Smart alerts, auto-coordination, peace of mind." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    onViewportEnter={() => setActiveStep(i)}
                    className={`flex gap-8 transition-opacity duration-500 ${activeStep === i ? "opacity-100" : "opacity-30"}`}
                  >
                    <div className={`text-4xl font-bold font-mono transition-colors duration-500 ${activeStep === i ? "text-indigo-500" : "text-white/10"}`}>
                        {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-widest mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="sticky top-40 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.1)] group bg-black/40">
               <img src="/images/workflow-demo.png" alt="Workflow" className="opacity-40 grayscale group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] bg-gradient-to-b from-indigo-900/40 to-black border border-white/10 p-16 lg:p-24 text-center overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.15)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <h2 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tighter uppercase relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Take back control
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 font-light relative z-10">
              Join 10,000+ parents who stopped drowning in daily logistics and started living.
            </p>
            <button className="bg-white text-black px-12 py-6 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] relative z-10">
              Start free trial
            </button>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-xl font-bold tracking-tighter uppercase text-white/50">herizon</div>
          <div className="text-[10px] uppercase tracking-[0.5em] text-gray-600">
            © 2026 Resilience Operations Platform
          </div>
          <div className="flex gap-8 text-gray-500">
            <Twitter size={18} className="hover:text-white cursor-pointer transition-colors" />
            <Github size={18} className="hover:text-white cursor-pointer transition-colors" />
            <Linkedin size={18} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}