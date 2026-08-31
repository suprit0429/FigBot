import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    yearly: 0,
    tagline: "For individuals exploring DocPilot on a side project.",
    features: [
      "3 document bots",
      "50 MB storage",
      "500 queries / month",
      "Standard response time",
      "Community support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 49,
    yearly: 39,
    tagline: "For teams that rely on document-grounded answers daily.",
    features: [
      "Unlimited bots",
      "5 GB storage",
      "50,000 queries / month",
      "Priority retrieval cluster",
      "API access + webhooks",
      "Email support, < 4hr SLA",
    ],
    cta: "Get Pro",
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    monthly: 99,
    yearly: 79,
    tagline: "For larger teams needing custom SLAs and SSO.",
    features: [
      "Unlimited bots + team seats",
      "50 GB storage",
      "Unlimited queries",
      "Dedicated RAG cluster",
      "SSO / SAML, audit logs",
      "Slack + dedicated support",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export function CTASection({ onGetStarted }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="relative z-10 py-20 px-6 sm:px-10"
      style={{ maxWidth: "1100px", margin: "0 auto" }}
    >
      {/* ── Header row — asymmetric: left desc, right toggle ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--amber)" }}
          >
            Pricing
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              maxWidth: "400px",
            }}
          >
            Pay for what you use. Stop when you don't.
          </h2>
        </div>

        {/* Billing toggle */}
        <div
          className="flex items-center p-1 gap-1 self-start sm:self-auto"
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sharp)",
          }}
        >
          {["Monthly", "Yearly"].map((opt, i) => {
            const active = (i === 1) === yearly;
            return (
              <button
                key={opt}
                onClick={() => setYearly(i === 1)}
                className="px-4 py-1.5 text-[12px] font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                style={{
                  background: active ? "var(--amber)" : "transparent",
                  color: active ? "#0E0D0B" : "var(--text-muted)",
                  borderRadius: "var(--radius-sharp)",
                }}
              >
                {opt}
                {i === 1 && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5"
                    style={{
                      background: active ? "rgba(14,13,11,0.2)" : "var(--amber-subtle)",
                      color: active ? "#0E0D0B" : "var(--amber)",
                      borderRadius: "2px",
                    }}
                  >
                    −20%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Pricing cards — staggered heights ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {PLANS.map((plan, idx) => {
          const price = yearly ? plan.yearly : plan.monthly;
          const isFree = price === 0;

          if (plan.highlight) {
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative"
                style={{
                  background: "var(--amber)",
                  borderRadius: "0 var(--radius-xl) var(--radius-xl) var(--radius-xl)",
                  padding: "32px 28px",
                  /* Extend upward */
                  marginTop: "-16px",
                  boxShadow: "0 20px 48px rgba(232,164,74,0.25), 0 0 0 1px rgba(232,164,74,0.3)",
                }}
              >
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-5 text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    background: "rgba(14,13,11,0.18)",
                    color: "#0E0D0B",
                    borderRadius: "var(--radius-sharp)",
                  }}
                >
                  ✦ Most popular
                </div>

                <h3
                  style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700, color: "#0E0D0B", marginBottom: "4px" }}
                >
                  {plan.name}
                </h3>
                <p style={{ fontSize: "12px", color: "rgba(14,13,11,0.65)", marginBottom: "20px", lineHeight: 1.5 }}>
                  {plan.tagline}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={price}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-end gap-1 mb-6"
                  >
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "#0E0D0B", lineHeight: 1, letterSpacing: "-0.03em" }}>
                      ${price}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(14,13,11,0.55)", marginBottom: "6px" }}>
                      /{yearly ? "yr" : "mo"}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[12px] font-medium" style={{ color: "#0E0D0B" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                        <path d="M2.5 7l3 3 6-6" stroke="#0E0D0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className="w-full py-3 text-[13px] font-bold cursor-pointer transition-all"
                  style={{
                    background: "#0E0D0B",
                    color: "var(--amber)",
                    border: "none",
                    borderRadius: "var(--radius-sharp)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1F1D19")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0E0D0B")}
                >
                  {plan.cta} →
                </button>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: idx === 0
                  ? "0 var(--radius-lg) var(--radius-lg) var(--radius-lg)"
                  : "var(--radius-lg) 0 var(--radius-lg) var(--radius-lg)",
                padding: "28px",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-amber)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            >
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.5 }}>
                {plan.tagline}
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={price}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-end gap-1 mb-6"
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                    {isFree ? "Free" : `$${price}`}
                  </span>
                  {!isFree && (
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                      /{yearly ? "yr" : "mo"}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                      <path d="M2.5 7l3 3 6-6" stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="btn-ghost w-full py-3 text-[13px] font-semibold"
                style={{ borderRadius: "var(--radius-sharp)" }}
              >
                {plan.cta} →
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Fine print */}
      <p className="text-center mt-8 text-[11px]" style={{ color: "var(--text-muted)" }}>
        No credit card required to start · Cancel anytime · Data deleted within 30 days of cancellation
      </p>
    </section>
  );
}

export default CTASection;
