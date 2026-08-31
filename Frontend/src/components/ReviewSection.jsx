import { motion } from "framer-motion";

const STATS = [
  { value: "6,560",  label: "Documents Indexed"  },
  { value: "5,890",  label: "Active Bots"         },
  { value: "★ 5.0",  label: "Avg Rating"           },
  { value: "300+",   label: "Teams Deployed"       },
  { value: "14ms",   label: "Avg Response Time"    },
  { value: "99.9%",  label: "Uptime SLA"           },
];

const TESTIMONIALS = [
  {
    quote: "We replaced 3 internal FAQ docs with one FiBot bot. Support tickets dropped 40% in the first week.",
    author: "Priya M.",
    role: "Head of Customer Success · Kiva Analytics",
    initial: "P",
  },
  {
    quote: "The page-citation feature is the killer detail. My team stopped second-guessing bot responses immediately.",
    author: "Tom R.",
    role: "Engineering Lead · Reachflow",
    initial: "T",
  },
  {
    quote: "Went from PDF upload to embedded bot in 8 minutes. That's genuinely impressive.",
    author: "Sana K.",
    role: "Product Manager · Foundable",
    initial: "S",
  },
];

export function ReviewSection() {
  const allStats = [...STATS, ...STATS];

  return (
    <section id="stats" className="relative z-10 py-16 overflow-hidden">

      {/* ── Scrolling stats strip — clean white panel ── */}
      <div
        className="relative mb-16"
        style={{
          borderTop: "1px solid rgba(148,163,184,0.25)",
          borderBottom: "1px solid rgba(148,163,184,0.25)",
          background: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        }}
      >
        {/* Fade edges */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #FFFFFF, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #FFFFFF, transparent)" }}
        />

        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {allStats.map(({ value, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-10 py-5 shrink-0"
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                  {label}
                </span>
              </div>
              {/* Vertical slate divider */}
              <span
                aria-hidden
                style={{
                  width: "1px",
                  height: "20px",
                  background: "rgba(148,163,184,0.35)",
                  marginLeft: "4px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div
        className="px-6 sm:px-10 grid grid-cols-1 md:grid-cols-3 gap-5"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex flex-col gap-4 p-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 1px 3px rgba(15,23,42,0.05), 0 4px 16px rgba(37,99,235,0.04)",
              borderRadius: i === 1 ? "18px" : i === 0 ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
            }}
          >
            {/* Quote mark */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3rem",
                lineHeight: 1,
                color: "#BFDBFE",
              }}
              aria-hidden
            >
              "
            </span>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#1E293B",
                flex: 1,
              }}
            >
              {t.quote}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center text-[12px] font-bold shrink-0 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #0284C7)",
                  color: "white",
                }}
              >
                {t.initial}
              </div>
              <div>
                <p className="text-[12px] font-semibold leading-tight" style={{ color: "#0F172A" }}>
                  {t.author}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
                  {t.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;
