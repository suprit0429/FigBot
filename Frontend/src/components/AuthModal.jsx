import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Bot,
  ArrowRight,
  ShieldCheck,
  Check,
  KeyRound,
  ArrowLeft
} from "lucide-react";

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onAuthSuccess,
  onShowToast
}) {
  const [mode, setMode] = useState(initialMode); // "signin" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Synchronize mode if initialMode prop changes
  const [prevModeProp, setPrevModeProp] = useState(initialMode);
  if (prevModeProp !== initialMode) {
    setPrevModeProp(initialMode);
    setMode(initialMode);
    setErrorMsg("");
    setForgotSent(false);
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-700", text: "text-slate-500" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;

    if (score === 1) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    if (score === 2) return { score: 2, label: "Medium", color: "bg-amber-500", text: "text-amber-400" };
    return { score: 3, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }

    if (mode === "forgot") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setForgotSent(true);
        if (onShowToast) onShowToast("Password reset link sent to your email.");
      }, 600);
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup" && !agreeTerms) {
      setErrorMsg("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userName = mode === "signup" && fullName.trim() ? fullName.trim() : (email.split("@")[0] || "Arpita");
      const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
      
      onAuthSuccess({
        name: capitalizedName,
        email: email
      });
      onClose();
    }, 750);
  };

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        name: provider === "github" ? "GitHub Developer" : "Google Workspace User",
        email: provider === "github" ? "dev@github.com" : "user@gmail.com"
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.22)] z-10 overflow-hidden text-slate-100"
      >
        {/* Subtle Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-600/30 text-white mx-auto">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <span>DocPilot AI</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Enterprise
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === "signin" && "Welcome back! Sign in to manage your AI RAG bots."}
              {mode === "signup" && "Start building autonomous document bots in 60 seconds."}
              {mode === "forgot" && "Recover your account credentials."}
            </p>
          </div>
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        {mode !== "forgot" && (
          <div className="relative flex p-1 bg-slate-950 border border-slate-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
              }}
              className={`relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer z-10 ${
                mode === "signin" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode === "signin" && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute inset-0 bg-indigo-600 rounded-lg shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
              }}
              className={`relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer z-10 ${
                mode === "signup" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode === "signup" && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute inset-0 bg-indigo-600 rounded-lg shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Create Account</span>
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === "forgot" ? (
            /* Forgot Password Screen */
            <motion.div
              key="forgot-screen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {forgotSent ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-emerald-300">
                    Reset Link Dispatched
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We sent instructions to <span className="font-mono text-white">{email}</span>. Please check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setForgotSent(false);
                    }}
                    className="w-full py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all mt-2"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Send Password Reset Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg("");
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 pt-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            /* Sign In / Sign Up Screen */
            <motion.div
              key="auth-fields"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-sm group"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span className="truncate">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-sm group"
                >
                  <svg className="w-4 h-4 shrink-0 fill-slate-200 group-hover:fill-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span className="truncate">GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider shrink-0">
                  or continue with email
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name Field (Sign Up Only) */}
                {mode === "signup" && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Arpita Sharma"
                        className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Work Email Field */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setErrorMsg("");
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Real-time Password Strength Meter (Sign Up Only) */}
                  {mode === "signup" && password.length > 0 && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Security Strength:</span>
                        <span className={`font-semibold ${strength.text}`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            strength.score >= 1 ? strength.color : "bg-transparent"
                          }`}
                          style={{ width: "33.3%" }}
                        />
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            strength.score >= 2 ? strength.color : "bg-transparent"
                          }`}
                          style={{ width: "33.3%" }}
                        />
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            strength.score >= 3 ? strength.color : "bg-transparent"
                          }`}
                          style={{ width: "33.4%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me (Sign In) or Terms Agreement (Sign Up) */}
                {mode === "signin" ? (
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-[11px] text-slate-400 cursor-pointer select-none"
                    >
                      Keep me signed in for 30 days
                    </label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 mt-0.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="text-[11px] text-slate-400 cursor-pointer select-none leading-tight"
                    >
                      I agree to the{" "}
                      <span className="text-indigo-400 hover:underline">Terms</span> and{" "}
                      <span className="text-indigo-400 hover:underline">Privacy Policy</span>.
                    </label>
                  </div>
                )}

                {/* Error Message */}
                {errorMsg && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === "signin" ? "Sign In to Workspace" : "Create Free Account"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Footer Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SOC-2 Ready &bull; Isolated Vector VPC &bull; TLS 1.3</span>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthModal;
