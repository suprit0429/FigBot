const LINKS = {
  Product: ["Features", "How It Works", "Changelog"],
  Developers: ["API Reference", "Embed Guide", "Status Page"],
  Company: ["About", "Blog", "Privacy Policy", "Terms of Service"],
};

export function LandingFooter() {
  return (
    <footer
      className="relative z-10"
      style={{
        background: "#F8FAFC",
        borderTop: "1px solid rgba(148,163,184,0.30)",
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10"
      >
        {/* ── Brand column ── */}
        <div className="space-y-5">
          {/* Wordmark */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #2563EB, #0284C7)",
                borderRadius: "7px",
                boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 2h4.5C10.54 2 13 4.46 13 7.5S10.54 13 7.5 13H3V2z" fill="white" />
                <rect x="3" y="2" width="2" height="11" rx="0.5" fill="rgba(37,99,235,0.3)" />
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
              FiBot<span style={{ color: "var(--blue)" }}>.ai</span>
            </span>
          </div>

          <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.7, maxWidth: "240px" }}>
            Turn any document into a chatbot your team can trust - with exact citations, not hallucinations.
          </p>

          {/* System status */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold rounded-full"
            style={{
              background: "#ECFDF5",
              border: "1px solid rgba(16,185,129,0.20)",
              color: "#10B981",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#10B981" }}
            />
            All systems operational
          </div>
        </div>

        {/* ── Link columns ── */}
        {Object.entries(LINKS).map(([heading, items]) => (
          <div key={heading} className="space-y-4">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#CBD5E1" }}
            >
              {heading}
            </p>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <button
                    className="link-underline text-[13px] cursor-pointer text-left"
                    style={{ color: "#64748B" }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(148,163,184,0.20)" }}
      >
        <p style={{ fontSize: "11px", color: "#94A3B8" }}>
          © {new Date().getFullYear()} FiBot AI, Inc. · All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Twitter", "GitHub", "LinkedIn"].map((s) => (
            <button
              key={s}
              className="link-underline text-[11px] cursor-pointer"
              style={{ color: "#94A3B8" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
