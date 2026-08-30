import { useState, useRef, useEffect } from "react";
import { Bot, Search, Sparkles, Command, Bell, LogOut, ChevronDown, User, Shield } from "lucide-react";

export function Navbar({
  user = { name: "Arpita", email: "arpita@example.com" },
  onSignOut,
  onOpenSearch,
  onCreateBotClick,
  onOpenNotifications
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand & Workspace Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-indigo-600/25">
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
          <span>RAG Engine: 99.9%</span>
        </div>

        {/* Quick New Bot Action */}
        <button
          type="button"
          onClick={onCreateBotClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all shadow-indigo-600/20 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Bot</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile Avatar Dropdown */}
        <div className="relative pl-2 border-l border-slate-800" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer focus:outline-none"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              {initial}
            </div>
            <span className="hidden xl:block text-xs font-medium text-slate-200">
              {user?.name || "Arpita"}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-800/80">
                <p className="text-xs font-semibold text-slate-100 truncate">{user?.name || "Arpita"}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || "arpita@example.com"}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full w-fit">
                  <Shield className="w-2.5 h-2.5" />
                  <span>Workspace Admin</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenNotifications?.();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800/70 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
