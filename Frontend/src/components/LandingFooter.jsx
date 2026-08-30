import { Bot } from "lucide-react";

const LINKS = {
  Product: ["Features", "How It Works", "Pricing", "Changelog"],
  Support: ["Help Center", "API Docs", "Status Page", "Contact Us"],
  Legal:   ["Privacy Policy", "Terms of Service", "Cookie Settings"],
};

export function LandingFooter() {
  return (
    <footer
      className="relative z-10 border-t mt-10"
      style={{
        background: "#080C18",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-16 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#22D3EE,#6366f1)" }}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[15px] text-white">
              DocPilot<span style={{ color: "#22D3EE" }}>.ai</span>
            </span>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: "#475569" }}>
            Turn any document into an AI assistant your team can use in minutes.
          </p>
          {/* System status */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.18)",
              color: "#34d399",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Running Smoothly
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, items]) => (
          <div key={heading} className="space-y-4">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#334155" }}
            >
              {heading}
            </p>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <button
                    className="text-[13px] cursor-pointer transition-colors text-left"
                    style={{ color: "#64748b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#22D3EE")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="border-t py-5" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <p
          className="text-center text-[11px] uppercase tracking-widest"
          style={{ color: "#1e293b" }}
        >
          © {new Date().getFullYear()} DocPilot AI · All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default LandingFooter;
