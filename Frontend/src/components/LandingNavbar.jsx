import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Features",    id: "features" },
  { label: "How It Works", id: "showcase" },
];

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function LandingNavbar({ onOpenAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        background: "rgba(248,250,252,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(148,163,184,0.25)",
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <button
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          aria-label="Go to top"
        >
          {/* Blue D letterform icon */}
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2563EB, #0284C7)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(37,99,235,0.30)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 2h4.5C10.54 2 13 4.46 13 7.5S10.54 13 7.5 13H3V2z"
                fill="white"
              />
              <rect x="3" y="2" width="2" height="11" rx="0.5" fill="rgba(37,99,235,0.4)" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "15px",
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            FiBot
            <span style={{ color: "var(--blue)" }}>.ai</span>
          </span>
        </button>

        {/* ── Center nav (desktop) ── */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="link-underline text-[13px] font-medium cursor-pointer"
              style={{ color: "#64748B" }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── Right actions (desktop) ── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenAuth("signin")}
            className="btn-ghost-light px-4 py-1.5 rounded-full text-[13px]"
          >
            Sign in
          </button>
          <button
            onClick={() => onOpenAuth("signup")}
            className="btn-primary px-5 py-2 text-[13px]"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
            }}
          >
            Get started →
          </button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-1.5 cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ color: "#64748B" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
            style={{
              borderTop: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(248,250,252,0.97)",
            }}
          >
            <div className="px-6 pb-5 pt-3 space-y-1">
              {NAV_LINKS.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => { scrollToSection(id); setMobileOpen(false); }}
                  className="block w-full text-left py-2.5 text-[14px] font-medium cursor-pointer link-underline"
                  style={{ color: "#64748B" }}
                >
                  {label}
                </button>
              ))}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => { onOpenAuth("signin"); setMobileOpen(false); }}
                  className="btn-ghost-light flex-1 py-2.5 rounded-lg text-[13px]"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { onOpenAuth("signup"); setMobileOpen(false); }}
                  className="btn-primary flex-1 py-2.5 text-[13px]"
                  style={{ borderRadius: "8px" }}
                >
                  Get started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default LandingNavbar;
