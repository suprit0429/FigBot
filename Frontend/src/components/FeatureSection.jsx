import { motion } from "framer-motion";
import { FileText, Brain, Mic, Zap, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Document Ingestion",
    description: "Upload PDFs, Word docs, or text files. We index them instantly.",
    color: "#22D3EE",
  },
  {
    icon: Brain,
    title: "Smart Neural RAG",
    description: "Retrieval-augmented answers grounded only in your files.",
    color: "#818cf8",
  },
  {
    icon: Mic,
    title: "Voice & Query Parsing",
    description: "Ask via text or voice — your assistant understands naturally.",
    color: "#f472b6",
  },
  {
    icon: Zap,
    title: "Instant Widget Deploy",
    description: "One copy-paste snippet to embed your bot on any website.",
    color: "#34d399",
  },
];

export function FeatureSection({ onGetStarted }) {
  return (
    <section
      id="features"
      className="relative z-10 py-16 px-6 sm:px-16 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* ── Left: 2×2 Card Grid ── */}
        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.09 }}
                className="flex flex-col gap-3 p-5 rounded-2xl cursor-default"
                style={{
                  background: "#1B2234",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${feat.color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: "#64748b" }}>
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Right: Heading + CTA ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 lg:pl-6"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Simplify Work,{" "}
            <br />
            <span style={{ color: "#22D3EE" }}>with Smarter Answers</span>
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "#94A3B8" }}>
            DocPilot AI connects directly to your documents and gives your team
            instant, accurate answers — complete with the exact page number every
            single time. No more digging through 100-page manuals.
          </p>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold text-white cursor-pointer transition-all"
            style={{
              background: "linear-gradient(90deg,#22D3EE,#38BDF8)",
              boxShadow: "0 0 22px rgba(34,211,238,0.35)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 38px rgba(34,211,238,0.55)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 22px rgba(34,211,238,0.35)")
            }
          >
            Try to Get Premium
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureSection;
