"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Heart, Coffee, Sun, ShieldCheck, Users, 
  ArrowRight, Wallet, Clock, Plus, Minus, 
  PlayCircle, Twitter, Github, Linkedin
} from "lucide-react";

export default function LandingPage() {
  // Keeps ESLint from flagging JSX member usage in setups without jsx-uses-vars.
  void motion;
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const faqs = [
    {
      question: "How does Herizon ensure my family's privacy?",
      answer: "We use private 'Circle' permissions. Only people you explicitly invite—like trusted family or verified guardians—can see your childcare schedules or financial targets."
    },
    {
      question: "Is the community network safe for single mothers?",
      answer: "Absolutely. Every community member and mentor undergoes a verification process. We prioritize creating a judgment-free, safe space for women to thrive."
    },
    {
      question: "Can I manage my finances without a bank sync?",
      answer: "Yes! While we offer secure syncing, you can also manually track your 'Fiscal Core' to maintain absolute control over your personal data."
    },
    {
      question: "What happens in case of a childcare emergency?",
      answer: "Our 'Emergency SOS' feature instantly alerts your pre-approved trusted contacts and nearby verified community nodes to coordinate help immediately."
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#FA9021]/30 overflow-x-hidden font-sans">
      
      {/* Dark Ambient Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FA9021]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#E87D0E]/10 blur-[150px] animate-pulse delay-1000" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter cursor-pointer flex items-center gap-2">
            <span className="text-white">herizon</span>
            <span className="text-[#FA9021]">.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          </div>

          <div className="flex items-center gap-6">
            <a href="/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white">Log in</a>
            <button 
              onClick={() => window.location.href="/Signup"}
              className="bg-[#FA9021] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#ff9f3f] transition-all">
              Join Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h4 className="text-[#E87D0E] font-bold text-lg md:text-xl uppercase tracking-widest mb-6">
                Supporting your independence
              </h4>

              <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight text-white">
                Find your balance.<br />
                <span className="text-[#FA9021]">Build your future.</span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed max-w-lg font-medium">
                Everything a single mother or career returner needs in one safe space. Coordinate childcare, track finances, and nurture your wellbeing.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <button className="bg-[#FA9021] text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#ff9f3f] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,144,33,0.3)]">
                  Get more details <ArrowRight size={18} />
                </button>
                <button className="border border-white/20 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:bg-white/5">
                  <PlayCircle size={18} className="text-[#FA9021]" /> View demo
                </button>
              </div>
            </motion.div>

            {/* Right Visual - CSS UI Dashboard Mockup (No Image Required) */}
            <motion.div style={{ rotateX, scale, perspective: 1000 }} className="relative hidden lg:flex items-center justify-center w-full">
              <div className="absolute inset-0 bg-[#FA9021]/15 blur-[120px] rounded-full" />
              
              <div className="relative z-10 w-full max-w-lg border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="w-full h-[450px] bg-[#0A0A0A] rounded-[2rem] border border-white/5 relative overflow-hidden flex flex-col shadow-inner">
                    
                    {/* Mock Dashboard Top Bar */}
                    <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2 bg-white/[0.02]">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-[#FA9021]/80 shadow-[0_0_10px_rgba(250,144,33,0.8)] animate-pulse" />
                    </div>

                    {/* Mock Dashboard Content */}
                    <div className="flex flex-1 p-6 gap-6">
                      {/* Sidebar Skeleton */}
                      <div className="w-1/4 flex flex-col gap-4">
                         <div className="h-3 w-2/3 bg-white/10 rounded-full mb-2" />
                         <div className="h-10 w-full bg-[#FA9021]/20 border border-[#FA9021]/30 rounded-xl" />
                         <div className="h-10 w-full bg-white/5 rounded-xl" />
                         <div className="h-10 w-full bg-white/5 rounded-xl" />
                      </div>

                      {/* Main Content Skeleton */}
                      <div className="w-3/4 flex flex-col gap-4">
                         <div className="flex justify-between items-center">
                            <div className="h-5 w-1/2 bg-white/10 rounded-full" />
                            <div className="h-8 w-8 rounded-full bg-[#FA9021]/10 flex items-center justify-center">
                              <Heart size={14} className="text-[#FA9021]" />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                              <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                              <div className="h-4 w-3/4 bg-[#FA9021] rounded-full" />
                            </div>
                            <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                              <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                              <div className="h-4 w-2/3 bg-white/20 rounded-full" />
                            </div>
                         </div>

                         {/* Mock Chart Area */}
                         <div className="flex-1 mt-2 bg-gradient-to-t from-[#FA9021]/10 to-transparent border border-white/5 rounded-2xl relative overflow-hidden flex items-end">
                           <div className="w-full h-1/2 border-t-2 border-[#FA9021] bg-[#FA9021]/20 rounded-t-[100%] absolute bottom-[-20px] scale-150" />
                         </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute -bottom-6 -left-6 bg-[#111] p-6 lg:p-8 rounded-[2rem] shadow-2xl border border-white/10 z-20">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#FA9021]/10 rounded-2xl flex items-center justify-center border border-[#FA9021]/20">
                    <ShieldCheck size={28} className="text-[#FA9021]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white tracking-tighter leading-none">100%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Privacy Safe</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 lg:px-12 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Everything you need to thrive</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">We've combined the tools you need into one seamless, supportive platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Coffee, title: "Smart Scheduling", desc: "Sync calendars and auto-coordinate childcare without the stress." },
              { icon: Wallet, title: "Financial Core", desc: "Track income, set budgets, and build long-term independence." },
              { icon: Sun, title: "Wellbeing Pulse", desc: "Daily mood check-ins and restorative mental health resources." },
              { icon: Users, title: "Trusted Network", desc: "Connect with verified guardians and mentors in your area." },
              { icon: ShieldCheck, title: "Absolute Privacy", desc: "Bank-level encryption ensures your family's data is yours alone." },
              { icon: Clock, title: "Emergency SOS", desc: "One tap to alert your trusted circle when you need urgent help." },
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} className="bg-[#0c0c0e] p-10 rounded-3xl border border-white/5 hover:border-[#FA9021]/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 text-[#FA9021] group-hover:scale-110 group-hover:bg-[#FA9021]/10 transition-all">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-12 text-white">
                How it works
              </h2>
              <div className="space-y-12">
                {[
                  { step: "01", title: "Sign up in 60 seconds", desc: "Email, password, done. No 47-field questionnaire." },
                  { step: "02", title: "Import your calendar", desc: "Google Calendar sync. We pull in your existing chaos." },
                  { step: "03", title: "Add your support network", desc: "Invite trusted contacts. Set permissions." },
                  { step: "04", title: "Let the system work", desc: "Smart alerts, auto-coordination, peace of mind." },
                ].map((item, i) => (
                  <motion.div key={i} onViewportEnter={() => setActiveStep(i)} className={`flex gap-8 transition-opacity duration-500 ${activeStep === i ? "opacity-100" : "opacity-30"}`}>
                    <div className={`text-4xl font-black font-mono transition-colors duration-500 ${activeStep === i ? "text-[#FA9021]" : "text-white/10"}`}>
                        {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                      <p className="text-gray-400 font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Another CSS UI Element instead of image */}
            <div className="sticky top-40 border border-white/10 rounded-[2.5rem] overflow-hidden bg-[#0c0c0e] shadow-[0_0_50px_rgba(250,144,33,0.1)] p-10 flex flex-col items-center justify-center min-h-[400px]">
               <div className="w-24 h-24 rounded-full border-4 border-[#FA9021] border-dashed animate-spin-slow flex items-center justify-center mb-8">
                 <ShieldCheck size={32} className="text-[#FA9021] animate-none" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">System Running</h3>
               <p className="text-gray-500 text-center">Your personalized resilience workflow is active.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 lg:px-12 bg-[#080808] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-400 font-medium">Everything you need to know about your support system.</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 rounded-3xl bg-[#0c0c0e] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full px-10 py-8 flex items-center justify-between text-left group">
                  <span className="text-xl font-bold text-white group-hover:text-[#FA9021] transition-colors">{faq.question}</span>
                  <div className={`p-2 rounded-full transition-colors ${openFaq === index ? "bg-[#FA9021] text-white" : "bg-white/5 text-gray-400"}`}>
                    {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-10 pb-8 text-gray-400 font-medium leading-relaxed">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[3rem] bg-[#0c0c0e] border border-white/10 p-16 lg:p-24 text-center overflow-hidden shadow-[0_0_80px_rgba(250,144,33,0.1)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
            
            <h2 className="text-5xl lg:text-7xl font-extrabold mb-8 text-white relative z-10">
              Take back control.
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 font-medium relative z-10">
              Join 10,000+ parents who stopped drowning in daily logistics and started living.
            </p>
            <button className="bg-[#FA9021] text-white px-14 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 hover:bg-[#ff9f3f] transition-all shadow-[0_0_30px_rgba(250,144,33,0.3)] relative z-10">
              Start free trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold tracking-tighter text-white">
            herizon<span className="text-[#FA9021]">.</span>
          </div>
          <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">
            © 2026 Resilience Operations
          </div>
          <div className="flex gap-8 text-gray-400">
            <Twitter size={20} className="hover:text-[#FA9021] cursor-pointer transition-colors" />
            <Github size={20} className="hover:text-[#FA9021] cursor-pointer transition-colors" />
            <Linkedin size={20} className="hover:text-[#FA9021] cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
}