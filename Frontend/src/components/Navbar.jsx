import { useState, useRef, useEffect } from "react";
import { Search, Command, Bell, LogOut, ChevronDown, User, Shield } from "lucide-react";

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
    if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header
      className="sticky top-0 z-30 h-14 px-4 sm:px-6 flex items-center justify-between"
      style={{
        background: "rgba(248,250,252,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(148,163,184,0.25)",
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Brand ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2563EB, #0284C7)",
              borderRadius: "7px",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 2h4.5C10.54 2 13 4.46 13 7.5S10.54 13 7.5 13H3V2z" fill="white" />
              <rect x="3" y="2" width="2" height="11" rx="0.5" fill="rgba(37,99,235,0.3)" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                }}
              >
                FiBot<span style={{ color: "var(--blue)" }}>.ai</span>
              </span>
              <span
                className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded"
                style={{
                  background: "#EFF6FF",
                  color: "#2563EB",
                  border: "1px solid rgba(37,99,235,0.20)",
                }}
              >
                Workspace
              </span>
            </div>
            <p className="hidden md:block text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
              Document-grounded chatbot builder
            </p>
          </div>
        </div>
      </div>

      {/* ── Center: Search bar ── */}
      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs group transition-all"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(148,163,184,0.35)",
            color: "#94A3B8",
            borderRadius: "8px",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(37,99,235,0.35)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(148,163,184,0.35)")}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search bots or documents…</span>
          </div>
          <kbd
            className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono"
            style={{
              background: "#F1F5F9",
              border: "1px solid rgba(148,163,184,0.35)",
              color: "#94A3B8",
              borderRadius: "4px",
            }}
          >
            <Command className="w-3 h-3 inline" /> K
          </kbd>
        </button>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-2.5">
        {/* RAG status */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium rounded-full"
          style={{
            background: "#ECFDF5",
            border: "1px solid rgba(16,185,129,0.20)",
            color: "#10B981",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#10B981" }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#10B981" }} />
          </span>
          RAG Engine · 99.9%
        </div>

        {/* New Bot */}
        <button
          type="button"
          onClick={onCreateBotClick}
          className="btn-primary hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer"
          style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(37,99,235,0.20)" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Bot
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="p-2 cursor-pointer transition-colors rounded-lg"
          title="Notifications"
          style={{ color: "#94A3B8" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F1F5F9";
            e.currentTarget.style.color = "#64748B";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#94A3B8";
          }}
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile dropdown */}
        <div
          className="relative pl-2"
          style={{ borderLeft: "1px solid rgba(148,163,184,0.30)" }}
          ref={dropdownRef}
        >
          <button
            type="button"
            onClick={() => setIsDropdownOpen((p) => !p)}
            className="flex items-center gap-2 p-1 cursor-pointer focus:outline-none transition-all rounded-lg"
            aria-expanded={isDropdownOpen}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              className="w-7 h-7 flex items-center justify-center text-[12px] font-bold rounded-lg"
              style={{
                background: "linear-gradient(135deg, #2563EB, #0284C7)",
                color: "white",
              }}
            >
              {initial}
            </div>
            <span className="hidden xl:block text-[12px] font-medium" style={{ color: "#475569" }}>
              {user?.name || "Arpita"}
            </span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              style={{ color: "#94A3B8" }}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 py-2 animate-slide-down z-50"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(148,163,184,0.30)",
                borderRadius: "12px",
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
              }}
            >
              <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(148,163,184,0.20)" }}>
                <p className="text-[12px] font-semibold truncate" style={{ color: "#0F172A" }}>
                  {user?.name || "Arpita"}
                </p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: "#94A3B8" }}>
                  {user?.email || "arpita@example.com"}
                </p>
                <div
                  className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider w-fit px-2 py-0.5 rounded"
                  style={{
                    background: "#EFF6FF",
                    border: "1px solid rgba(37,99,235,0.20)",
                    color: "#2563EB",
                  }}
                >
                  <Shield className="w-2.5 h-2.5" />
                  Admin
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => { setIsDropdownOpen(false); onOpenNotifications?.(); }}
                  className="w-full px-4 py-2 text-left text-[12px] flex items-center gap-2.5 cursor-pointer transition-colors"
                  style={{ color: "#475569" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <User className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  Account Settings
                </button>
                <button
                  type="button"
                  onClick={() => { setIsDropdownOpen(false); onSignOut?.(); }}
                  className="w-full px-4 py-2 text-left text-[12px] flex items-center gap-2.5 cursor-pointer transition-colors"
                  style={{ color: "#EF4444" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
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
