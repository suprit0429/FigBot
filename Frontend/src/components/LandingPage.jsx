import LandingNavbar     from "./LandingNavbar";
import HeroSection       from "./HeroSection";
import FeatureSection    from "./FeatureSection";
import ReviewSection     from "./ReviewSection";
import HowItWorksSection from "./HowItWorksSection";
import LandingFooter     from "./LandingFooter";

export function LandingPage({ onOpenAuth, onGetStarted }) {
  const go = () => (onGetStarted ? onGetStarted() : onOpenAuth("signup"));

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(175deg, #F8FAFC 0%, #F1F5F9 40%, #F8FAFC 100%)",
        fontFamily: "var(--font-body)",
        color: "var(--text-primary)",
      }}
    >
      {/* ── Ambient radial glow — top center (sky blue mesh) ── */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,242,254,0.70) 0%, transparent 70%)",
        }}
      />
      {/* ── Soft left accent orb ── */}
      <div
        aria-hidden
        className="fixed pointer-events-none z-0"
        style={{
          top: "20%",
          left: "-12%",
          width: "420px",
          height: "420px",
          background: "radial-gradient(circle, rgba(219,234,254,0.55) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* ── Soft right accent orb ── */}
      <div
        aria-hidden
        className="fixed pointer-events-none z-0"
        style={{
          top: "60%",
          right: "-8%",
          width: "340px",
          height: "340px",
          background: "radial-gradient(circle, rgba(186,230,253,0.45) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <LandingNavbar onOpenAuth={onOpenAuth} />

      <main className="relative z-10">
        <HeroSection onGetStarted={go} />
        <ReviewSection />
        <FeatureSection onGetStarted={go} />
        <HowItWorksSection />
      </main>

      <LandingFooter />
    </div>
  );
}

export default LandingPage;
