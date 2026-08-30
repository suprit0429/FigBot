import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter Plan",
    monthly: 19,
    yearly: 15,
    features: [
      "Suitable for Personal Users",
      "3 document bots",
      "50MB storage",
      "Standard response time",
      "Limited to business hours",
    ],
    highlight: false,
  },
  {
    name: "Pro Plan",
    monthly: 49,
    yearly: 39,
    features: [
      "Suitable for Power Users",
      "Unlimited bots",
      "5GB storage",
      "Priority fast responses",
      "Unlimited business hours",
    ],
    highlight: true,
  },
  {
    name: "Business Plan",
    monthly: 99,
    yearly: 79,
    features: [
      "Suitable for Large Teams",
      "Unlimited bots + users",
      "50GB storage",
      "Dedicated response cluster",
      "Unlimited business hours",
    ],
    highlight: false,
  },
];

export function CTASection({ onGetStarted }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="relative z-10 py-20 px-6 sm:px-16 max-w-6xl mx-auto"
    >
      {/* Heading */}
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Plans Designed Around You
        </h2>
        <p className="text-[14px]" style={{ color: "#94A3B8" }}>
          Start free. Upgrade when you need more power.
        </p>

        {/* Monthly / Yearly toggle */}
        <div className="flex items-center justify-center mt-2">
          <div
            className="relative flex items-center gap-1 p-1 rounded-full"
            style={{ background: "#1B2234" }}
          >
            {["Monthly", "Yearly"].map((opt, i) => {
              const active = (i === 1) === yearly;
              return (
                <button
                  key={opt}
                  onClick={() => setYearly(i === 1)}
                  className="relative px-5 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-all z-10"
                  style={{
                    color: active ? "#0B0F1E" : "#94A3B8",
                    background: active
                      ? "linear-gradient(90deg,#22D3EE,#38BDF8)"
                      : "transparent",
                    boxShadow: active
                      ? "0 0 16px rgba(34,211,238,0.35)"
                      : "none",
                  }}
                >
                  {opt}
                  {i === 1 && (
                    <span
                      className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: active
                          ? "rgba(11,15,30,0.25)"
                          : "rgba(34,211,238,0.12)",
                        color: active ? "#0B0F1E" : "#22D3EE",
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
      </div>

      {/* 3-card tier layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        {PLANS.map((plan, idx) => {
          const price = yearly ? plan.yearly : plan.monthly;
          const period = yearly ? "yr" : "mo";

          if (plan.highlight) {
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="relative rounded-2xl p-7 md:-mt-6 md:shadow-2xl"
                style={{
                  background: "linear-gradient(145deg,#22D3EE,#38BDF8)",
                  boxShadow: "0 0 50px rgba(34,211,238,0.4)",
                }}
              >
                {/* Popular badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mb-5"
                  style={{ background: "rgba(11,15,30,0.25)", color: "#0B0F1E" }}
                >
                  ✦ Most Popular
                </div>

                <h3 className="text-[16px] font-bold text-[#0B0F1E] mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black text-[#0B0F1E]">
                    ${price}
                  </span>
                  <span className="text-[13px] font-semibold text-[#0B0F1E]/70 mb-1">
                    /{period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#0B0F1E] font-medium">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#0B0F1E]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className="w-full py-3 rounded-xl text-[14px] font-bold cursor-pointer transition-all"
                  style={{
                    background: "#0B0F1E",
                    color: "#22D3EE",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#111625")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#0B0F1E")
                  }
                >
                  Select Plan
                </button>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="rounded-2xl p-7"
              style={{ background: "#1B2234" }}
            >
              <h3 className="text-[16px] font-bold text-white mb-1">
                {plan.name}
              </h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">${price}</span>
                <span className="text-[13px] font-semibold text-[#64748b] mb-1">
                  /{period}
                </span>
              </div>

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#94A3B8]">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22D3EE" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-all"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#22D3EE";
                  e.currentTarget.style.color = "#22D3EE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                Select Plan
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default CTASection;
