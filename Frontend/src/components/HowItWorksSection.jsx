import { motion } from "framer-motion";
import { Bot, Users, MessageCircle, Star } from "lucide-react";

const MINI_STATS = [
  { icon: Users,         value: "15M+",  label: "Users"    },
  { icon: MessageCircle, value: "30k+",  label: "Queries"  },
  { icon: Star,          value: "★ 5.0", label: "Rating"   },
];

export function HowItWorksSection() {
  return (
    <section
      id="showcase"
      className="relative z-10 py-16 px-6 sm:px-16 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ── Left: Text + Mini Stats ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Visual Vibes: More Than
            <br />
            <span style={{ color: "#22D3EE" }}>Just Messages.</span>
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "#94A3B8" }}>
            DocPilot AI doesn&apos;t just answer — it gives your team a living,
            breathing knowledge base. Watch answers arrive with exact sources,
            instant confidence, and zero guessing.
          </p>

          {/* Mini stats strip */}
          <div className="flex items-center gap-6 flex-wrap pt-2">
            {MINI_STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(34,211,238,0.12)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#22D3EE" }} />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-white leading-none">
                    {value}
                  </p>
                  <p className="text-[11px]" style={{ color: "#64748b" }}>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Glowing Bot Circle ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Outer ambient glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: "rgba(34,211,238,0.28)",
                transform: "scale(1.25)",
              }}
            />
            {/* Circle border */}
            <div
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 40% 30%, #22D3EE22 0%, #1B2234 80%)",
                border: "3px solid rgba(34,211,238,0.55)",
                boxShadow:
                  "0 0 50px rgba(34,211,238,0.4), inset 0 0 40px rgba(34,211,238,0.06)",
              }}
            >
              <Bot
                className="w-24 h-24 sm:w-28 sm:h-28"
                style={{
                  color: "#22D3EE",
                  filter: "drop-shadow(0 0 20px rgba(34,211,238,0.9))",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
