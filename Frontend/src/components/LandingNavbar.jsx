import { useState } from "react";
import { Bot, ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",     id: "hero"     },
  { label: "Features", id: "features" },
  { label: "Stats",    id: "stats"    },
  { label: "Showcase", id: "showcase" },
];

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export function LandingNavbar({ onOpenAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        background: "rgba(11,15,25,0.80)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <button
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#22D3EE,#6366f1)" }}
          >
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-[15px] text-white tracking-tight">
            DocPilot
            <span style={{ color: "#22D3EE" }}>.</span>
            <span style={{ color: "#22D3EE" }}>ai</span>
          </span>
          {/* Cyan pulse dot */}
          <span
            className="relative flex h-2 w-2 ml-0.5"
          >
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#22D3EE" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: "#22D3EE" }}
            />
          </span>
        </button>

        {/* ── Center nav links (desktop) ── */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="text-[13px] font-medium cursor-pointer transition-colors duration-150"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#22D3EE")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Login pill */}
          <button
            onClick={() => onOpenAuth("signin")}
            className="px-4 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-all"
            style={{
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "#CBD5E1",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#22D3EE";
              e.currentTarget.style.color = "#22D3EE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "#CBD5E1";
            }}
          >
            Login
          </button>

          {/* Get Started cyan pill */}
          <button
            onClick={() => onOpenAuth("signup")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-bold text-white cursor-pointer transition-all"
            style={{
              background: "linear-gradient(90deg,#22D3EE,#38BDF8)",
              boxShadow: "0 0 16px rgba(34,211,238,0.3)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 28px rgba(34,211,238,0.55)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 16px rgba(34,211,238,0.3)")
            }
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-1.5 cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen
            ? <X className="w-5 h-5 text-white" />
            : <Menu className="w-5 h-5" style={{ color: "#94A3B8" }} />
          }
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-6 pb-5 pt-3 space-y-1"
          style={{
            borderColor: "rgba(255,255,255,0.05)",
            background: "rgba(11,15,25,0.97)",
          }}
        >
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => { scrollToSection(id); setMobileOpen(false); }}
              className="block w-full text-left py-2.5 text-[14px] font-medium cursor-pointer transition-colors"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#22D3EE")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
            >
              {label}
            </button>
          ))}
          <div className="flex gap-3 pt-3">
            <button
              onClick={() => { onOpenAuth("signin"); setMobileOpen(false); }}
              className="flex-1 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer"
              style={{
                border: "1.5px solid rgba(255,255,255,0.2)",
                color: "#CBD5E1",
                background: "transparent",
              }}
            >
              Login
            </button>
            <button
              onClick={() => { onOpenAuth("signup"); setMobileOpen(false); }}
              className="flex-1 py-2.5 rounded-full text-[13px] font-bold text-white cursor-pointer"
              style={{ background: "linear-gradient(90deg,#22D3EE,#38BDF8)" }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingNavbar;
