import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function HomePage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        setHealth(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Could not connect to backend server');
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Background glowing gradient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[25%] w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[160px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/5 glass-panel px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-teal-400 p-[1px] shadow-glow-violet">
              <div className="w-full h-full bg-navy-900 rounded-xl flex items-center justify-center font-extrabold text-white text-lg tracking-wider">
                H
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              HIRE<span className="text-teal-400">LOOP</span>
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Phase 1: Project Setup & Database
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-violet-300 text-sm mb-6 border border-violet-500/20 shadow-glow-violet"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Full Stack Job Portal • Spring Boot 3 + React + MySQL</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight"
        >
          Welcome to <span className="glow-gradient-text">HIRELOOP</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mb-12"
        >
          Phase 1 is successfully initialized. Entities, JPA repositories, database schema, default admin seed, and React frontend foundation are ready.
        </motion.p>

        {/* Backend Health Check Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-xl glass-card rounded-2xl p-6 text-left mb-12"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <h3 className="font-semibold text-white">Backend Health Status</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">GET /api/health</span>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-400 py-3">
              <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              <span>Pinging Spring Boot backend API...</span>
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-300 text-sm">
              <p className="font-medium mb-1">Backend not responding yet</p>
              <p className="text-xs text-slate-400">Make sure Spring Boot is running on port 8080: <code className="text-slate-200">mvn spring-boot:run</code></p>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {health.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Service:</span>
                <span className="text-slate-200 font-medium">{health.service}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Version:</span>
                <span className="text-slate-200 font-mono">{health.version}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Phase 1 Deliverables Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
        >
          <div className="glass-card rounded-xl p-5 text-left">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
              <Database className="w-5 h-5 text-violet-400" />
            </div>
            <h4 className="font-semibold text-white mb-1">6 MySQL Entities</h4>
            <p className="text-xs text-slate-400">User, CandidateProfile, Company, Job, Application, and SavedJob with full JPA mappings and enums.</p>
          </div>

          <div className="glass-card rounded-xl p-5 text-left">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <h4 className="font-semibold text-white mb-1">Default Admin Seed</h4>
            <p className="text-xs text-slate-400">DataInitializer seeds default admin account (<code>admin@hireloop.com</code>) with BCrypt password encoding.</p>
          </div>

          <div className="glass-card rounded-xl p-5 text-left">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="font-semibold text-white mb-1">Vite + React UI</h4>
            <p className="text-xs text-slate-400">React Router, Axios interceptor, Tailwind CSS with custom glassmorphism, and Framer Motion ready.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 glass-panel px-6 py-4 text-center text-xs text-slate-500">
        Hireloop Job Portal • Phase 1 Complete
      </footer>
    </div>
  );
}
