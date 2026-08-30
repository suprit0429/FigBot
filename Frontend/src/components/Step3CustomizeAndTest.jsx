import { useState } from "react";
import ChatbotWidget from "./ChatbotWidget";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Sparkles,
  Sun,
  Moon,
  Bot,
  MessageSquare,
  Headphones,
  CircleDot,
  Check,
  Copy,
  Code2,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "../utils/cn";

export function Step3CustomizeAndTest({
  botData = {},
  onUpdateBotData,
  onBack,
  onComplete,
  onShowToast
}) {
  const [copied, setCopied] = useState(false);

  const colorPresets = [
    { name: "Indigo", hex: "#6366F1" },
    { name: "Cyan", hex: "#06B6D4" },
    { name: "Emerald", hex: "#10B981" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Rose", hex: "#F43F5E" },
    { name: "Amber", hex: "#F59E0B" }
  ];

  const iconPresets = [
    { id: "bot", label: "Bot", icon: Bot },
    { id: "sparkles", label: "Sparkles", icon: Sparkles },
    { id: "message", label: "Bubble", icon: MessageSquare },
    { id: "headset", label: "Support", icon: Headphones },
    { id: "dot", label: "Minimal", icon: CircleDot }
  ];

  const roundingOptions = [
    { id: "sharp", label: "Sharp" },
    { id: "rounded", label: "Rounded" },
    { id: "pill", label: "Pill / Full" }
  ];

  const themeMode = botData.themeMode || "dark";
  const themeColor = botData.themeColor || "#6366F1";
  const avatar = botData.avatar || "bot";
  const avatarUrl = botData.avatarUrl || "";
  const headerTitle = botData.headerTitle || botData.name || "Support Assistant";
  const greeting = botData.greeting || "Hi there! How can I help you today?";
  const placeholder = botData.placeholder || "Ask a question...";
  const position = botData.position || "bottom-right";
  const rounding = botData.rounding || "rounded";

  // Real-time generated 1-line embed script snippet
  const embedScript = `<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="${botData.id || "bot-live"}" data-theme="${themeMode}" data-accent="${themeColor}" data-position="${position}" data-rounding="${rounding}" async></script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    if (onShowToast) onShowToast("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore confetti errors in unsupported environments
    }
    if (onShowToast) onShowToast("🎉 Chatbot created and ready to use!");
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Customize, Test & Deploy
        </h2>
        <p className="text-sm text-slate-400">
          Adjust your chatbot's appearance on the left and test its live responses on the right.
        </p>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: 1-Click Styling Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* 1. Theme Mode */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              1. Theme Mode
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateBotData({ themeMode: "dark" })}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer",
                  themeMode === "dark"
                    ? "bg-slate-800 border-indigo-500 text-white shadow-sm ring-2 ring-indigo-500/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                )}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateBotData({ themeMode: "light" })}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer",
                  themeMode === "light"
                    ? "bg-slate-100 border-indigo-500 text-slate-900 shadow-sm ring-2 ring-indigo-500/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                )}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* 2. Brand Accent Color */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Brand Color
              </span>
              <span className="text-xs font-mono text-slate-400">{themeColor}</span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {colorPresets.map((c) => {
                const isSelected = themeColor?.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateBotData({ themeColor: c.hex })}
                    className={cn(
                      "p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer",
                      isSelected
                        ? "bg-slate-800 border-white/80 scale-105 shadow-sm"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">{c.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => onUpdateBotData({ themeColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={themeColor}
                onChange={(e) => onUpdateBotData({ themeColor: e.target.value })}
                placeholder="#6366F1"
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              />
              <span className="text-xs text-slate-500">Custom Hex</span>
            </div>
          </div>

          {/* 3. Avatar Icon & Custom Logo */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              3. Launcher Icon
            </span>
            <div className="grid grid-cols-5 gap-2">
              {iconPresets.map((preset) => {
                const Icon = preset.icon;
                const isSelected = !avatarUrl && avatar === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onUpdateBotData({ avatar: preset.id, avatarUrl: "" })}
                    className={cn(
                      "p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-all cursor-pointer",
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{preset.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Custom Logo URL (optional):</span>
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => onUpdateBotData({ avatarUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Text Customization */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              4. Text & Messaging
            </span>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Header Title</label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => onUpdateBotData({ headerTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Welcome Greeting</label>
              <textarea
                rows={2}
                value={greeting}
                onChange={(e) => onUpdateBotData({ greeting: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* 5. Positioning & Rounding */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              5. Position & Rounding
            </span>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "bottom-right", label: "Bottom Right" },
                { id: "bottom-left", label: "Bottom Left" }
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => onUpdateBotData({ position: pos.id })}
                  className={cn(
                    "p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer text-center",
                    position === pos.id
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  )}
                >
                  {pos.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {roundingOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateBotData({ rounding: opt.id })}
                  className={cn(
                    "p-2 rounded-xl border text-xs transition-all cursor-pointer text-center font-medium",
                    rounding === opt.id
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Simulator + Embed Script (6 cols) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-20">
          {/* Live Simulator Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Interactive Preview</span>
              </span>
              <span>Instant Sync</span>
            </div>

            <div className="flex justify-center">
              <ChatbotWidget
                headerTitle={headerTitle}
                themeColor={themeColor}
                themeMode={themeMode}
                avatar={avatar}
                avatarUrl={avatarUrl}
                greeting={greeting}
                placeholder={placeholder}
                rounding={rounding}
                position={position}
                isFloating={false}
              />
            </div>
          </div>

          {/* 1-Line Embed Script Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Copy 1-Line Embed Script</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Production Ready</span>
            </div>

            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {embedScript}
              </pre>

              <button
                type="button"
                onClick={handleCopyCode}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1 text-[11px] font-medium cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions: Back & Finish */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
            </button>

            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Deploy Bot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3CustomizeAndTest;
