"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Code2,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Check,
  Terminal,
  Database,
  Workflow,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-slate-50 min-h-screen relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-violet-200/40 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[100px] animate-pulse delay-700" />
      </div>

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="text-xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              herizon
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#demo" className="hover:text-slate-900 transition-colors">
              Demo
            </a>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
            Sign in
          </button>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:pr-12"
            >
              <div className="inline-block mb-4 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                Ship faster, debug less
              </div>

              <h1
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Stop wrestling with{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    work-life chaos
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 300 8"
                    fill="none"
                  >
                    <path
                      d="M2 6C50 2 250 2 298 6"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Built for single parents and career returners who need actual
                help—not another to-do app. Coordinate childcare, track
                wellbeing, and manage finances without switching between 12
                different tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all"
                >
                  Start free trial
                  <ArrowRight size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:border-slate-400 transition-all"
                >
                  View demo
                </motion.button>
              </div>

              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <span className="text-slate-600">Free for 14 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <span className="text-slate-600">No credit card</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:-mr-24 lg:ml-12"
            >
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>

              <div className="relative">
                <img
                  src="/images/hero-product.png"
                  alt="Herizon Dashboard"
                  className="w-full rounded-2xl shadow-2xl border border-slate-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="w-full h-96 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center text-slate-500 text-sm border border-slate-200"
                >
                  Add hero-product.png to /public/images/
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">87%</div>
                    <div className="text-xs text-slate-600">
                      Less stress reported
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No bloat. No feature creep. Just the tools that actually matter
              when you're juggling work and life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Terminal, title: "Smart Scheduling", desc: "AI that actually learns your patterns. No more manual calendar tetris.", color: "violet" },
              { icon: Shield, title: "Verified Network", desc: "Background-checked helpers in your area. Not random strangers from the internet.", color: "indigo" },
              { icon: Database, title: "Finance Tracking", desc: "See exactly where your money goes. Budgeting that doesn't make you feel broke.", color: "blue" },
              { icon: Code2, title: "Mental Health Check-ins", desc: "Quick mood tracking. Optional therapy resources. Zero judgment.", color: "purple" },
              { icon: Workflow, title: "Task Automation", desc: "Recurring pickups, bill reminders, meal planning—set it once, forget it.", color: "pink" },
              { icon: Clock, title: "Emergency Backup", desc: "Last-minute childcare SOS? We've got your back with trusted contacts.", color: "orange" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon
                    size={24}
                    className={`text-${feature.color}-600`}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="py-24 px-6 bg-slate-900 text-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              How it actually works
            </h2>
            <p className="text-slate-400 text-lg">
              Four steps. No BS. Start managing your life in minutes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              {[
                { step: "01", title: "Sign up in 60 seconds", desc: "Email, password, done. No 47-field questionnaire." },
                { step: "02", title: "Import your calendar", desc: "Google Calendar sync. We pull in your existing chaos." },
                { step: "03", title: "Add your support network", desc: "Invite trusted contacts. Set permissions. They get notified." },
                { step: "04", title: "Let the system work", desc: "Smart alerts, auto-coordination, peace of mind." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  onViewportEnter={() => setActiveStep(i)}
                  className="flex gap-6 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        activeStep === i
                          ? "bg-violet-600 text-white scale-110"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {item.step}
                    </div>
                    {i < 3 && (
                      <div
                        className={`w-0.5 h-16 mt-2 transition-all ${
                          activeStep > i ? "bg-violet-600" : "bg-slate-800"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div className="relative lg:sticky lg:top-32">
              <div className="relative">
                <img
                  src="/images/workflow-demo.png"
                  alt="Workflow demonstration"
                  className="w-full rounded-xl shadow-2xl border border-slate-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="w-full h-96 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center text-slate-400 text-sm border border-slate-700"
                >
                  Add workflow-demo.png to /public/images/
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="demo"
        className="py-24 px-6 bg-gradient-to-br from-violet-50 to-indigo-50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white transform skew-x-12 translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2
                className="text-4xl font-bold mb-4 text-slate-900"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                See it in action
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Real dashboard. Real features. Not a marketing mockup that looks
                nothing like the actual product.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Live calendar sync across devices",
                  "One-tap emergency contact alerts",
                  "Budget tracking with actual insights",
                  "Private mood journaling",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <ChevronRight size={20} className="text-violet-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="text-violet-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Explore full demo
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative max-w-xl w-full"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-xl shadow-2xl border border-slate-200">
                  <img
                    src="/images/dashboard-screenshot.png"
                    alt="Dashboard Screenshot"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className="w-full h-96 bg-gradient-to-br from-white to-violet-50 rounded-xl flex items-center justify-center text-slate-500 text-sm border border-slate-200"
                  >
                    Add dashboard-screenshot.png to /public/images/
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-xl border border-slate-200 max-w-xs hidden sm:block"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-violet-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-slate-900">
                        Pickup confirmed
                      </div>
                      <div className="text-slate-600">
                        Sarah will get Emma at 3:30 PM
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-12 lg:p-16">
              <div>
                <h2
                  className="text-4xl font-bold mb-4 text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Ready to take back control?
                </h2>
                <p className="text-slate-300 text-lg mb-8">
                  Join 10,000+ parents who stopped drowning in daily logistics
                  and started living.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-xl"
                  >
                    Start free trial
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all"
                  >
                    Talk to sales
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-end">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <div className="text-3xl font-bold text-white mb-1">
                      10K+
                    </div>
                    <div className="text-slate-400 text-sm">Active users</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <div className="text-3xl font-bold text-white mb-1">
                      4.9
                    </div>
                    <div className="text-slate-400 text-sm">App rating</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <div className="text-3xl font-bold text-white mb-1">
                      95%
                    </div>
                    <div className="text-slate-400 text-sm">Satisfaction</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <div className="text-3xl font-bold text-white mb-1">
                      24/7
                    </div>
                    <div className="text-slate-400 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  herizon
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Practical tools for juggling work and life. No fluff.
              </p>
            </div>
            {["Product", "Company", "Legal"].map((title) => (
              <div key={title}>
                <h4 className="font-semibold text-slate-900 mb-3">{title}</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><a href="#" className="hover:text-slate-900">Features</a></li>
                  <li><a href="#" className="hover:text-slate-900">Pricing</a></li>
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2024 Herizon. Built for real people with real lives.
            </p>
            <div className="flex items-center gap-4">
              <Twitter size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
              <Github size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
              <Linkedin size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}