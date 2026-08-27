import React from "react";
import { Bot, Search, Sparkles, Command, ShieldCheck, Bell } from "lucide-react";

export function Navbar({ onOpenSearch, onCreateBotClick, onOpenNotifications }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand & Workspace Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">
              DocPilot <span className="text-cyan-400">AI</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded">
              Workspace
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400">
            No-Code AI Chatbot Builder & RAG Widgets
          </p>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
            <span>Search bots or documents...</span>
          </div>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-850 border border-slate-700 rounded">
            <Command className="w-3 h-3 inline" /> K
          </kbd>
        </button>
      </div>

      {/* Right Side: Health Badge, Actions, Profile */}
      <div className="flex items-center gap-3">
        {/* System Health Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>RAG Engine: Healthy 99.9%</span>
        </div>

        {/* Quick New Bot Action */}
        <button
          type="button"
          onClick={onCreateBotClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Bot</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
            A
          </div>
          <span className="hidden xl:block text-xs font-medium text-slate-200">
            Arpita
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
