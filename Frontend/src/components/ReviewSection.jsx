import { motion } from "framer-motion";

const STATS = [
  { value: "6,560", label: "Documents Indexed" },
  { value: "5,890", label: "Active Bots"       },
  { value: "5.0",   label: "Star Rating"        },
  { value: "300+",  label: "Teams Deployed"     },
];

export function ReviewSection() {
  return (
    <section id="stats" className="relative z-10 py-10 px-6 sm:px-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl px-8 py-8"
        style={{ background: "#1B2234" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 divide-x divide-white/5">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center px-4">
              <span
                className="text-4xl font-black tracking-tight"
                style={{ color: "#fff" }}
              >
                {value}
              </span>
              <span
                className="text-[12px] font-medium mt-1"
                style={{ color: "#64748b" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default ReviewSection;
