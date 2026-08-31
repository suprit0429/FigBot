import { motion } from "framer-motion";

export function BotCard({ bot, index = 0, onTest, onEdit, onEmbed, onDelete }) {
  const initial = bot.name ? bot.name.charAt(0).toUpperCase() : "B";
  const accentColor = bot.themeColor || "#2563EB";

  const radiusMap = [
    "4px 14px 14px 14px",
    "14px",
    "14px 4px 14px 14px",
  ];
  const borderRadius = radiusMap[index % 3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group card-white flex flex-col justify-between transition-all duration-200"
      style={{
        borderRadius,
        padding: "20px",
        fontFamily: "var(--font-body)",
        minHeight: index % 3 === 0 ? "200px" : "180px",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          {/* Avatar initial */}
          <div
            className="shrink-0 w-9 h-9 flex items-center justify-center text-[13px] font-bold rounded-lg"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
              border: `1px solid ${accentColor}25`,
            }}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <h4
              className="truncate leading-tight"
              style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}
            >
              {bot.name}
            </h4>
            <span
              className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-md"
              style={{
                background: "#F1F5F9",
                color: "#64748B",
                border: "1px solid rgba(148,163,184,0.30)",
              }}
            >
              {bot.domain || "Assistant"}
            </span>
          </div>
        </div>

        {/* Delete */}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(bot.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 transition-all cursor-pointer rounded-lg"
            title="Delete bot"
            style={{ color: "#CBD5E1" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EF4444";
              e.currentTarget.style.background = "#FEF2F2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#CBD5E1";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.5 7a1 1 0 001 1h5a1 1 0 001-1l.5-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Docs count */}
      <div
        className="flex items-center gap-1.5 mb-5 text-[11px]"
        style={{ color: "#94A3B8" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="2" y="1" width="7" height="9" rx="1" />
          <path d="M4 4h3M4 6h3M4 8h2" />
        </svg>
        {bot.docsCount || 2} documents linked
      </div>

      {/* ── Actions ── */}
      <div
        className="flex items-center justify-between gap-2 pt-4"
        style={{ borderTop: "1px solid rgba(148,163,184,0.20)" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTest?.(bot)}
            className="text-[11px] font-medium link-underline cursor-pointer"
            style={{ color: "#64748B" }}
          >
            Test
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(bot)}
            className="text-[11px] font-medium link-underline cursor-pointer"
            style={{ color: "#64748B" }}
          >
            Customize
          </button>
        </div>

        <button
          type="button"
          onClick={() => onEmbed?.(bot)}
          className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold cursor-pointer"
          style={{ borderRadius: "6px" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 2 1 6 4 10" />
            <polyline points="8 2 11 6 8 10" />
          </svg>
          Embed
        </button>
      </div>
    </motion.div>
  );
}

export default BotCard;
