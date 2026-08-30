import { useReducer, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";

const GREETINGS = [
  "Welcome to DocPilot! I'm your digital assistant. Need answers from your company files? Just ask!",
  "Upload any PDF or document and I'll answer questions from it instantly — with exact page numbers.",
  "Your data stays private. I only answer from what you upload, never from the internet.",
];

export function HeroSection({ onGetStarted }) {
  const [state, dispatch] = useReducer(
    (s, action) => {
      switch (action.type) {
        case "RESET":  return { idx: s.idx, typing: true,  text: "" };
        case "APPEND": return { ...s, text: action.text };
        case "DONE":   return { ...s, typing: false };
        case "NEXT":   return { idx: (s.idx + 1) % GREETINGS.length, typing: true, text: "" };
        default:       return s;
      }
    },
    { idx: 0, typing: true, text: "" }
  );

  useEffect(() => {
    dispatch({ type: "RESET" });
    const words = GREETINGS[state.idx].split(" ");
    let i = 0;
    const iv = setInterval(() => {
      if (i < words.length) {
        dispatch({ type: "APPEND", text: words.slice(0, i + 1).join(" ") });
        i++;
      } else {
        dispatch({ type: "DONE" });
        clearInterval(iv);
        const t = setTimeout(() => dispatch({ type: "NEXT" }), 4000);
        return () => clearTimeout(t);
      }
    }, 38);
    return () => clearInterval(iv);
  }, [state.idx]);

  return (
    <section id="hero" className="relative z-10 pt-28 pb-20 px-6 sm:px-16 max-w-6xl mx-auto">

      {/* ── TOP ROW: Avatar + Speech Bubble ── */}
      <div className="flex items-start justify-center gap-8 mb-10 flex-wrap">

        {/* Robot Avatar */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative shrink-0"
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: "rgba(34,211,238,0.35)", transform: "scale(1.15)" }}
          />
          {/* Circle frame */}
          <div
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #22D3EE22, #6366f133)",
              border: "3px solid rgba(34,211,238,0.6)",
              boxShadow: "0 0 40px rgba(34,211,238,0.45), inset 0 0 30px rgba(34,211,238,0.08)",
            }}
          >
            {/* Inner cyan fill */}
            <div
              className="absolute inset-3 rounded-full"
              style={{ background: "linear-gradient(135deg,#22D3EE33,#38BDF822)" }}
            />
            {/* Robot icon */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <Bot
                className="w-16 h-16 sm:w-20 sm:h-20"
                style={{
                  color: "#22D3EE",
                  filter: "drop-shadow(0 0 16px rgba(34,211,238,0.8))",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mt-6"
          style={{ maxWidth: "360px" }}
        >
          {/* Bubble tail (points left toward robot) */}
          <div
            className="absolute -left-4 top-8 w-0 h-0"
            style={{
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderRight: "16px solid #fff",
            }}
          />
          {/* Bubble body */}
          <div
            className="rounded-2xl p-5 shadow-2xl"
            style={{ background: "#fff" }}
          >
            <p className="text-[14px] font-semibold text-[#0B0F1E] leading-relaxed mb-4">
              {state.text}
              {state.typing && (
                <span
                  className="inline-block w-1.5 h-4 ml-1 rounded-sm align-middle animate-pulse"
                  style={{ background: "#22D3EE" }}
                />
              )}
            </p>

            {/* Typing input pill */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "linear-gradient(90deg,#22D3EE,#38BDF8)" }}
            >
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
              <span className="text-[12px] font-semibold text-white">typing...</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── CENTER: Hero Text + CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3 }}
        className="text-center space-y-5"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="text-white">Welcome to, Easy</span>
          <br />
          <span
            style={{
              background: "linear-gradient(90deg,#22D3EE,#38BDF8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Chat Fast Solution With Our Chatbot
          </span>
        </h1>

        <p className="text-[15px] max-w-xl mx-auto leading-relaxed" style={{ color: "#94A3B8" }}>
          Upload your company documents, handbooks, or guides and get instant,
          accurate answers with exact page references — no tech setup required.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
          <button
            onClick={onGetStarted}
            className="px-7 py-3 rounded-full text-[14px] font-bold cursor-pointer transition-all"
            style={{
              border: "2px solid rgba(255,255,255,0.3)",
              color: "#fff",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#22D3EE";
              e.currentTarget.style.color = "#22D3EE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.color = "#fff";
            }}
          >
            Get Started
          </button>

          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-7 py-3 rounded-full text-[14px] font-bold text-white cursor-pointer transition-all"
            style={{
              background: "linear-gradient(90deg,#22D3EE,#38BDF8)",
              boxShadow: "0 0 24px rgba(34,211,238,0.45)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 40px rgba(34,211,238,0.65)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 24px rgba(34,211,238,0.45)")
            }
          >
            Get Premium
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
