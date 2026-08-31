import { motion } from "framer-motion";

// ── Custom SVG icons ──
const IconIngest = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="2" width="12" height="16" rx="2" />
    <path d="M7 6h5M7 9h5M7 12h3" />
    <path d="M15 14l3 3m0 0l-3 3m3-3H13" />
  </svg>
);
const IconRAG = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="3" />
    <path d="M11 4v2M11 16v2M4 11h2M16 11h2M6.34 6.34l1.42 1.42M14.24 14.24l1.42 1.42M6.34 15.66l1.42-1.42M14.24 7.76l1.42-1.42" />
  </svg>
);
const IconEmbed = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 8 3 12 7 16" />
    <polyline points="15 8 19 12 15 16" />
    <line x1="11" y1="5" x2="9" y2="19" />
  </svg>
);
const IconCite = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2v-2M6 9V5a2 2 0 012-2h2a2 2 0 012 2v4M6 9h6" />
    <path d="M14 9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2M14 9V5a2 2 0 00-2-2" />
  </svg>
);

const FEATURES = [
  {
    Icon: IconIngest,
    tag: "Ingestion",
    title: "Reads PDFs, Word docs, and plain text - instantly.",
    description:
      "Drag in any file up to 500MB. FiBot parses, chunks, and indexes your content in seconds. No formatting needed, no pre-processing required.",
    large: true,
    exts: [".pdf", ".docx", ".txt", ".md"],
  },
  {
    Icon: IconRAG,
    tag: "Retrieval",
    title: "Answers grounded only in what you uploaded.",
    description:
      "Our RAG pipeline fetches only the most relevant passages before generating a response - so the bot never hallucinates or pulls from the internet.",
    large: false,
  },
  {
    Icon: IconCite,
    tag: "Citations",
    title: "Every answer includes an exact page number.",
    description:
      "Users always know where the answer came from. Every reply links back to a specific section of your source document.",
    large: false,
  },
  {
    Icon: IconEmbed,
    tag: "Deploy",
    title: "One <script> tag. Your bot lives on your site.",
    description:
      "Copy one line of code. The widget renders anywhere - React, plain HTML, Webflow, WordPress. Fully styled and CORS-ready.",
    large: false,
    wide: true,
  },
];

export function FeatureSection({ onGetStarted }) {
  const [tallFeat, ...rest] = FEATURES;
  const stacked = rest.filter((f) => !f.wide);
  const wide    = rest.filter((f) =>  f.wide);

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid rgba(148,163,184,0.35)",
    boxShadow: "0 1px 3px rgba(15,23,42,0.05), 0 4px 16px rgba(37,99,235,0.04)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const hoverOn = (e) => {
    e.currentTarget.style.borderColor = "rgba(37,99,235,0.30)";
    e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.10), 0 2px 8px rgba(15,23,42,0.06)";
  };
  const hoverOff = (e) => {
    e.currentTarget.style.borderColor = "rgba(148,163,184,0.35)";
    e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.05), 0 4px 16px rgba(37,99,235,0.04)";
  };

  return (
    <section
      id="features"
      className="relative z-10 py-20 px-6 sm:px-10"
      style={{ maxWidth: "1100px", margin: "0 auto" }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--blue)" }}
        >
          What it does
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#0F172A",
            letterSpacing: "-0.025em",
            maxWidth: "480px",
          }}
        >
          The shortest path from document to deployed chatbot.
        </h2>
      </motion.div>

      {/* ── Asymmetric grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-4 items-stretch">

        {/* TALL card — left */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="group flex flex-col justify-between p-8"
          style={{
            ...cardStyle,
            minHeight: "380px",
            borderRadius: "4px 18px 18px 18px",
          }}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
        >
          <div>
            <div
              className="w-10 h-10 flex items-center justify-center mb-5"
              style={{
                background: "#EFF6FF",
                color: "#2563EB",
                border: "1px solid rgba(37,99,235,0.15)",
                borderRadius: "8px",
              }}
            >
              <tallFeat.Icon />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--blue)" }}
            >
              {tallFeat.tag}
            </span>
            <h3
              className="mt-2 mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#0F172A",
                lineHeight: 1.25,
              }}
            >
              {tallFeat.title}
            </h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7 }}>
              {tallFeat.description}
            </p>
          </div>
          {/* File types */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {tallFeat.exts.map((ext) => (
              <span
                key={ext}
                className="px-2.5 py-1 text-[11px] font-mono"
                style={{
                  background: "#F1F5F9",
                  border: "1px solid rgba(148,163,184,0.40)",
                  color: "#64748B",
                  borderRadius: "6px",
                }}
              >
                {ext}
              </span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT column — stacked cards */}
        <div className="flex flex-col gap-4">
          {stacked.map((feat, i) => (
            <motion.div
              key={feat.tag}
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col gap-3 p-6 flex-1"
              style={{ ...cardStyle, borderRadius: "12px" }}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center shrink-0"
                  style={{
                    background: "#EFF6FF",
                    color: "#2563EB",
                    border: "1px solid rgba(37,99,235,0.15)",
                    borderRadius: "8px",
                  }}
                >
                  <feat.Icon />
                </div>
                <div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: "var(--blue)" }}
                  >
                    {feat.tag}
                  </span>
                  <h3
                    className="mt-0.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0F172A",
                      lineHeight: 1.3,
                    }}
                  >
                    {feat.title}
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.65 }}>
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Wide bottom card ── */}
      {wide.map((feat) => (
        <motion.div
          key={feat.tag}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="group mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6"
          style={{ ...cardStyle, borderRadius: "12px" }}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
        >
          <div
            className="w-10 h-10 flex items-center justify-center shrink-0"
            style={{
              background: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid rgba(37,99,235,0.15)",
              borderRadius: "8px",
            }}
          >
            <feat.Icon />
          </div>
          <div className="flex-1">
            <span
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "var(--blue)" }}
            >
              {feat.tag}
            </span>
            <h3
              className="mt-0.5 mb-1"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#0F172A",
              }}
            >
              {feat.title}
            </h3>
            <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.65 }}>
              {feat.description}
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="btn-primary shrink-0 px-5 py-2.5 text-[13px] font-semibold"
            style={{ borderRadius: "8px", boxShadow: "0 4px 14px rgba(37,99,235,0.25)" }}
          >
            Deploy now →
          </button>
        </motion.div>
      ))}
    </section>
  );
}

export default FeatureSection;
