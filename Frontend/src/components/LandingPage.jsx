import LandingNavbar      from "./LandingNavbar";
import HeroSection        from "./HeroSection";
import FeatureSection     from "./FeatureSection";
import ReviewSection      from "./ReviewSection";
import HowItWorksSection  from "./HowItWorksSection";
import LandingFooter      from "./LandingFooter";

export function LandingPage({ onOpenAuth, onGetStarted }) {
  const go = () => (onGetStarted ? onGetStarted() : onOpenAuth("signup"));

  return (
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0B0F1E 0%, #111625 60%, #0D1530 100%)",
      }}
    >
      {/* Subtle dot-grid texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(34,211,238,0.028) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Fixed navbar — sits above all content */}
      <LandingNavbar onOpenAuth={onOpenAuth} />

      {/* All sections stack below the fixed bar */}
      <main>
        <HeroSection onGetStarted={go} />

        <FeatureSection onGetStarted={go} />

        <ReviewSection />

        <HowItWorksSection />
      </main>

      <LandingFooter />
    </div>
  );
}

export default LandingPage;
