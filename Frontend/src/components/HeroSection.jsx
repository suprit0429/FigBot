import { useReducer, useEffect } from "react";
import { motion } from "framer-motion";

// ── Realistic chat exchange in product preview ──
const CHAT_MESSAGES = [
  { role: "user", text: "What's our refund policy for SaaS subscriptions?" },
  { role: "bot", text: "Per Section 4.2 of your Terms of Service (page 12): customers may request a full refund within 14 days of initial purchase. Renewals are non-refundable.", page: "p.12" },
  { role: "user", text: "Can resellers access the API tier?" },
  { role: "bot", text: "Yes - resellers on the Business plan get API rate limits of 10,000 req/day. See the Partner Addendum, Clause 7 (page 31).", page: "p.31" },
];

function useTypewriter(text, active) {
  const [displayed, setDisplayed] = useReducer((_, a) => a, "");
  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [text, active]);
  return displayed;
}

function ChatBubble({ msg, index, animate }) {
  const isBot = msg.role === "bot";
  const text = useTypewriter(msg.text, isBot && animate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.1 }}
      className={`flex gap-2 ${isBot ? "items-start" : "items-start justify-end"}`}
    >
      {isBot && (
        <div
          className="shrink-0 w-6 h-6 flex items-center justify-center text-[10px] font-bold mt-0.5 rounded"
          style={{
            background: "linear-gradient(135deg, #2563EB, #0284C7)",
            color: "white",
          }}
        >
          D
        </div>
      )}
      <div
        className="max-w-[84%] px-3 py-2 text-[12px] leading-relaxed"
        style={{
          background: isBot ? "#F8FAFC" : "#2563EB",
          color: isBot ? "#1E293B" : "white",
          border: isBot ? "1px solid rgba(148,163,184,0.30)" : "none",
          borderRadius: isBot ? "4px 10px 10px 10px" : "10px 4px 10px 10px",
        }}
      >
        {text || msg.text}
        {isBot && animate && text.length < msg.text.length && (
          <span className="animate-blink inline-block w-0.5 h-3 ml-0.5 align-middle bg-blue-500 rounded-full" />
        )}
        {isBot && msg.page && (
          <span
            className="block mt-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded w-fit"
            style={{
              background: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid rgba(37,99,235,0.20)",
            }}
          >
            Source: {msg.page}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function HeroSection({ onGetStarted }) {
  return (
    <section
      id="hero"
      className="relative z-10 pt-32 pb-24 px-6 sm:px-10"
      style={{ maxWidth: "1100px", margin: "0 auto" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-12 lg:gap-16 items-center">

        {/* ── LEFT: Editorial headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-7"
        >
          {/* Category badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest rounded-full"
            style={{
              background: "#EFF6FF",
              border: "1px solid rgba(37,99,235,0.20)",
              color: "#2563EB",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#2563EB" }}
            />
            Document Intelligence
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              color: "#0F172A",
              letterSpacing: "-0.025em",
            }}
          >
            Your docs.{" "}
            <span className="text-gradient-blue">Instant</span>
            {" "}answers.
            <br />
            <span style={{ color: "#64748B" }}>No guessing.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="max-w-md leading-relaxed"
            style={{ fontSize: "15px", color: "#475569" }}
          >
            Upload a PDF, handbook, or internal guide. FiBot builds a chatbot
            that answers questions from it - citing the exact page, every time.
            Deploy to your site in under 5 minutes.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap pt-1">
            <button
              onClick={onGetStarted}
              className="btn-primary px-7 py-3 text-[14px] font-semibold"
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 18px rgba(37,99,235,0.30)",
              }}
            >
              Start for free →
            </button>
            <button
              onClick={() => document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-ghost-light px-6 py-3 text-[14px] rounded-lg"
            >
              See how it works
            </button>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-6 flex-wrap pt-2"
            style={{
              borderTop: "1px solid rgba(148,163,184,0.25)",
              paddingTop: "20px",
            }}
          >
            {[
              { val: "6,500+", label: "Documents indexed" },
              { val: "300+", label: "Teams deployed" },
              { val: "★ 5.0", label: "Avg. rating" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col">
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "18px",
                    color: "#0F172A",
                    lineHeight: 1,
                  }}
                >
                  {val}
                </span>
                <span style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Product preview card ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="relative animate-float"
        >
          {/* Ambient glow behind card */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.10) 0%, transparent 70%)",
              transform: "scale(1.15)",
              filter: "blur(24px)",
            }}
          />

          {/* Chat preview card */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(148,163,184,0.30)",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(15,23,42,0.10), 0 0 0 1px rgba(37,99,235,0.06), 0 4px 16px rgba(37,99,235,0.08)",
            }}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom: "1px solid rgba(148,163,184,0.20)",
                background: "#F8FAFC",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 flex items-center justify-center text-[11px] font-bold rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #0284C7)",
                    color: "white",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.30)",
                  }}
                >
                  D
                </div>
                <div>
                  <p
                    className="text-[12px] font-semibold leading-none"
                    style={{ color: "#0F172A" }}
                  >
                    FiBot Assistant
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
                    Trained on: Terms-of-Service.pdf
                  </p>
                </div>
              </div>
              <span
                className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full"
                style={{ background: "#ECFDF5", color: "#10B981" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#10B981" }}
                />
                Online
              </span>
            </div>

            {/* Chat body */}
            <div className="p-4 space-y-3" style={{ minHeight: "260px", background: "#FAFBFF" }}>
              {CHAT_MESSAGES.map((msg, i) => (
                <ChatBubble key={i} msg={msg} index={i} animate={i === 1 || i === 3} />
              ))}
            </div>

            {/* Input bar */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                borderTop: "1px solid rgba(148,163,184,0.20)",
                background: "#FFFFFF",
              }}
            >
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 text-[11px] rounded-lg"
                style={{
                  background: "#F1F5F9",
                  border: "1px solid rgba(148,163,184,0.25)",
                  color: "#94A3B8",
                }}
              >
                Ask anything about this document…
              </div>
              <button
                className="btn-primary w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                style={{ padding: 0 }}
                aria-label="Send"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 3l5 4-5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Floating citation badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="absolute -bottom-4 -right-4 px-3 py-2 rounded-lg"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(37,99,235,0.20)",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(37,99,235,0.12)",
            }}
          >
            <p className="text-[10px] font-semibold" style={{ color: "#2563EB" }}>
              📄 Source cited
            </p>
            <p className="text-[9px] mt-0.5" style={{ color: "#94A3B8" }}>
              Terms-of-Service.pdf · p.12
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
