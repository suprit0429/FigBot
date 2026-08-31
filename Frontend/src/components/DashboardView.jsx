import { useState } from "react";
import BotCard from "./BotCard";
import { Search } from "lucide-react";

const KPI_CARDS = (bots, documentsCount) => [
  {
    label: "Active bots",
    value: bots.length,
    note: "Deployed across your properties",
    accent: "#2563EB",
    tall: true,
  },
  {
    label: "Indexed documents",
    value: documentsCount,
    note: "PDFs & Docs your bots can cite from",
    accent: "#0284C7",
    tall: false,
  },
  {
    label: "Queries answered",
    value: "5,340",
    note: "With source citations attached",
    accent: "#10B981",
    tall: false,
  },
];

export function DashboardView({
  bots = [],
  documentsCount = 5,
  onCreateNewBot,
  onTestBot,
  onEditBot,
  onEmbedBot,
  onDeleteBot,
}) {
  const [search, setSearch] = useState("");
  const filteredBots = bots.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.domain.toLowerCase().includes(search.toLowerCase())
  );
  const kpis = KPI_CARDS(bots, documentsCount);

  return (
    <div className="space-y-10 py-2" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Header ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: "1px solid rgba(148,163,184,0.25)" }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 2.5vw, 1.9rem)",
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Your bots, docs, and answers -
            <span style={{ color: "var(--blue)" }}> in one place.</span>
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "#64748B" }}>
            Build, test, and embed chatbots trained on your documents.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNewBot}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold shrink-0 cursor-pointer"
          style={{ borderRadius: "8px", boxShadow: "0 4px 14px rgba(37,99,235,0.25)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          New Bot
        </button>
      </div>

      {/* ── KPI Cards — staggered heights with left accent border ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-2 transition-all duration-200"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(148,163,184,0.35)",
              borderLeft: `3px solid ${kpi.accent}`,
              borderRadius: i === 0
                ? "4px 18px 18px 18px"
                : i === 2
                ? "18px 4px 18px 18px"
                : "12px",
              padding: i === 0 ? "28px 24px" : "22px 24px",
              marginTop: i === 0 ? "-8px" : 0,
              boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              {kpi.label}
            </span>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: i === 0 ? "3rem" : "2.25rem",
                fontWeight: 900,
                color: kpi.accent,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {kpi.value}
            </div>
            <p className="text-[11px]" style={{ color: "#94A3B8" }}>
              {kpi.note}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bots section ── */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#0F172A",
                letterSpacing: "-0.01em",
              }}
            >
              Your chatbots
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>
              Test answers, adjust styling, or grab the embed snippet.
            </p>
          </div>
          <div className="relative">
            <Search
              className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#94A3B8" }}
            />
            <input
              type="text"
              placeholder="Search bots…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-[12px] w-full sm:w-48 transition-all"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(148,163,184,0.35)",
                color: "#0F172A",
                borderRadius: "8px",
                outline: "none",
                boxShadow: "var(--shadow-sm)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(37,99,235,0.40)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(148,163,184,0.35)")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBots.map((bot, i) => (
            <BotCard
              key={bot.id}
              bot={bot}
              index={i}
              onTest={onTestBot}
              onEdit={onEditBot}
              onEmbed={onEmbedBot}
              onDelete={onDeleteBot}
            />
          ))}
        </div>

        {filteredBots.length === 0 && (
          <div
            className="text-center py-14 space-y-3"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(148,163,184,0.30)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="text-[13px]" style={{ color: "#94A3B8" }}>
              No bots match your search.
            </p>
            <button
              type="button"
              onClick={onCreateNewBot}
              className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold"
              style={{ borderRadius: "8px" }}
            >
              Create your first bot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardView;
