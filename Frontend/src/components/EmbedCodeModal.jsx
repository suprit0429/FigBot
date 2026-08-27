import React, { useState } from "react";
import { X, Copy, Check, Code2, Globe, ShieldCheck } from "lucide-react";

export function EmbedCodeModal({ isOpen, onClose, bot, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !bot) return null;

  const embedScript = `<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="${bot.id}" data-theme="${bot.themeMode || "dark"}" data-accent="${bot.themeColor || "#6366F1"}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    if (onShowToast) onShowToast("Embed script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 space-y-5 p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Embed {bot.name || "Chatbot"}
              </h3>
              <p className="text-xs text-slate-400">
                1-line script integration for your web app
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Script Box */}
        <div className="space-y-2 text-xs">
          <p className="text-slate-400">
            Paste this single line of code right before the closing{" "}
            <code className="text-slate-300 font-mono">&lt;/body&gt;</code> tag of your website:
          </p>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
              {embedScript}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Integration compatibility info */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" /> Works on HTML, React, Webflow, Shopify
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> SSL Verified
          </span>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmbedCodeModal;
