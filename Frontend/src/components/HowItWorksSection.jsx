import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Upload your document",
    description:
      "Drop in a PDF, Word file, or plain text. FiBot parses the content, splits it into semantic chunks, and builds a searchable index - no configuration, no schema design.",
    detail: "Supports PDF, DOCX, TXT, MD up to 500MB",
  },
  {
    number: "02",
    title: "Tune your bot's personality",
    description:
      "Set a greeting, pick a widget color that matches your brand, choose a name. Takes 90 seconds. No prompt engineering degree required.",
    detail: "Fully white-labelable - name, avatar, colors, copy",
  },
  {
    number: "03",
    title: "Copy one line of code. Ship it.",
    description:
      "Paste a single <script> tag into your site's HTML. The chatbot widget appears immediately - styled, CORS-safe, and ready to answer questions from your document.",
    detail: "Works on React, HTML, Webflow, WordPress, Framer",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="showcase"
      className="relative z-10 py-20 px-6 sm:px-10"
      style={{ maxWidth: "1100px", margin: "0 auto" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="mb-14"
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--blue)" }}
        >
          How it works
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#0F172A",
            letterSpacing: "-0.025em",
            maxWidth: "440px",
          }}
        >
          From PDF to live chatbot in under 5 minutes.
        </h2>
      </motion.div>

      {/* ── Steps — vertical timeline ── */}
      <div className="relative">
        {/* Connecting line */}
        <div
          aria-hidden
          className="absolute hidden lg:block top-0 left-[42px] bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, rgba(37,99,235,0.20), transparent)" }}
        />

        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex gap-8 items-start"
              style={{ paddingBottom: i < STEPS.length - 1 ? "40px" : 0 }}
            >
              {/* Step badge */}
              <div className="relative shrink-0 z-10">
                <div
                  className="w-[56px] h-[56px] flex items-center justify-center rounded-xl"
                  style={{
                    background: i === 0
                      ? "linear-gradient(135deg, #2563EB, #0284C7)"
                      : "#FFFFFF",
                    border: i === 0 ? "none" : "1px solid rgba(148,163,184,0.35)",
                    color: i === 0 ? "white" : "#94A3B8",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    fontWeight: 700,
                    boxShadow: i === 0
                      ? "0 4px 16px rgba(37,99,235,0.30)"
                      : "0 1px 3px rgba(15,23,42,0.06)",
                  }}
                >
                  {step.number}
                </div>
              </div>

              {/* Step content */}
              <div
                className="flex-1 pb-8"
                style={{
                  borderBottom: i < STEPS.length - 1 ? "1px solid rgba(148,163,184,0.20)" : "none",
                }}
              >
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "17px",
                    fontWeight: 600,
                    color: "#0F172A",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="mb-3 max-w-lg"
                  style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7 }}
                >
                  {step.description}
                </p>
                <span
                  className="inline-block text-[10px] font-mono px-2.5 py-1 rounded-md"
                  style={{
                    background: "#EFF6FF",
                    border: "1px solid rgba(37,99,235,0.20)",
                    color: "#2563EB",
                  }}
                >
                  {step.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-16 grid grid-cols-3 overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(148,163,184,0.25)",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        }}
      >
        {[
          { val: "< 5 min", label: "Average setup time" },
          { val: "15M+", label: "Queries answered" },
          { val: "Zero", label: "Prompt engineering" },
        ].map(({ val, label }, i) => (
          <div
            key={label}
            className="flex flex-col items-center py-7 px-4 text-center"
            style={{
              borderRight: i < 2 ? "1px solid rgba(148,163,184,0.20)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.025em",
              }}
            >
              {val}
            </span>
            <span style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Final CTA banner (dark blue anchor) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-16 relative overflow-hidden rounded-2xl px-8 py-12 text-center"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #0B192C 50%, #1E3A5F 100%)",
          boxShadow: "0 24px 64px rgba(15,23,42,0.20), 0 4px 16px rgba(37,99,235,0.15)",
        }}
      >
        {/* Blue glow orb */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 65%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(2,132,199,0.20) 0%, transparent 65%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div className="relative z-10 space-y-5">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "#38BDF8" }}
          >
            Get started today
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Turn your first document into a{" "}
            <span className="text-gradient-blue">live chatbot</span>
            {" "}today.
          </h3>
          <p style={{ fontSize: "14px", color: "#94A3B8", maxWidth: "440px", margin: "0 auto" }}>
            Free to start. No credit card. Deployed in minutes.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <button
              className="btn-primary px-8 py-3 text-[14px] font-semibold"
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 18px rgba(37,99,235,0.35)",
              }}
            >
              Start for free →
            </button>
            <button
              className="px-6 py-3 text-[14px] font-medium cursor-pointer transition-colors"
              style={{
                color: "#94A3B8",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.20)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.20)";
              }}
            >
              See pricing
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HowItWorksSection;
