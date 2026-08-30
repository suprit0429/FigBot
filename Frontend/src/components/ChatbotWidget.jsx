import { useState } from "react";
import {
  Bot,
  Sparkles,
  MessageSquare,
  Headphones,
  CircleDot,
  Send,
  X,
  RotateCcw,
  ShieldCheck,
  Check,
  Copy
} from "lucide-react";
import { cn } from "../utils/cn";

export function ChatbotWidget({
  headerTitle = "Support Assistant",
  themeColor = "#6366F1",
  themeMode = "dark",
  avatar = "bot",
  avatarUrl = "",
  placeholder = "Ask a question...",
  greeting = "Hi there! How can I help you today?",
  rounding = "rounded",
  position = "bottom-right",
  isFloating = false,
  isOpen = true,
  onClose,
  className
}) {
  const isLight = themeMode === "light";
  const [copiedId, setCopiedId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "bot",
      text: greeting,
      timestamp: "Just now"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const roundingClasses = {
    sharp: "rounded-none",
    rounded: "rounded-2xl",
    pill: "rounded-3xl"
  };

  const inputRoundingClasses = {
    sharp: "rounded-none",
    rounded: "rounded-xl",
    pill: "rounded-full"
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6"
  };

  const renderAvatar = (size = "md") => {
    const sizeClasses = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt="Avatar"
          className={cn(sizeClasses, "rounded-full object-cover border border-white/20")}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      );
    }

    if (avatar === "bot") return <Bot className="w-4 h-4" />;
    if (avatar === "sparkles") return <Sparkles className="w-4 h-4" />;
    if (avatar === "message") return <MessageSquare className="w-4 h-4" />;
    if (avatar === "headset") return <Headphones className="w-4 h-4" />;
    if (avatar === "dot") return <CircleDot className="w-4 h-4" />;

    return <span>{avatar || "🤖"}</span>;
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const userText = inputVal.trim();
    setInputVal("");
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "user", text: userText, timestamp: "Now" }
    ]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Based on your documents, full coverage and support are active for your workspace.";
      if (userText.toLowerCase().includes("leave") || userText.toLowerCase().includes("pto")) {
        reply = "Full-time employees receive 16 weeks of paid parental leave and flexible annual PTO.";
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: reply,
          timestamp: "Now",
          citations: [{ docName: "Handbook.pdf" }]
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const chatWindowElement = (
    <div
      className={cn(
        "flex flex-col overflow-hidden shadow-2xl transition-all duration-200 h-[500px] w-full max-w-sm sm:max-w-md",
        roundingClasses[rounding] || "rounded-2xl",
        isLight
          ? "bg-white text-slate-900 border border-slate-200"
          : "bg-slate-900 text-slate-100 border border-slate-800",
        isFloating && "fixed z-50",
        isFloating && (position === "bottom-left" ? "bottom-24 left-6" : "bottom-24 right-6"),
        className
      )}
    >
      {/* Window Header */}
      <div
        className="px-4 py-3.5 flex items-center justify-between text-white shadow-sm select-none"
        style={{
          backgroundColor: themeColor,
          background: `linear-gradient(135deg, ${themeColor}, ${themeColor}ee)`
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            {renderAvatar("sm")}
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight line-clamp-1">
              {headerTitle}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] text-white/80 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>Online • Instant Answers</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/80">
          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: "init",
                  sender: "bot",
                  text: greeting,
                  timestamp: "Just now"
                }
              ])
            }
            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {(onClose || isFloating) && (
            <button
              type="button"
              onClick={onClose || (() => setIsPopupOpen(false))}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div
        className={cn(
          "flex-1 p-4 overflow-y-auto space-y-3",
          isLight ? "bg-slate-50/60" : "bg-slate-950/40"
        )}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5 max-w-[88%]",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {!isUser && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 text-white shadow-sm mt-0.5"
                  style={{ backgroundColor: themeColor }}
                >
                  {renderAvatar("sm")}
                </div>
              )}

              <div className="space-y-1">
                <div
                  style={{ backgroundColor: isUser ? themeColor : undefined }}
                  className={cn(
                    "p-3 text-xs leading-relaxed transition-all shadow-sm relative group",
                    roundingClasses[rounding] || "rounded-2xl",
                    isUser
                      ? "text-white rounded-tr-none"
                      : isLight
                      ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.id === "init" ? greeting : msg.text}</p>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 right-1 p-1 text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {!isUser && msg.citations && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Source: {msg.citations[0].docName}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 mr-auto">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 text-white"
              style={{ backgroundColor: themeColor }}
            >
              {renderAvatar("sm")}
            </div>
            <div
              className={cn(
                "p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs shadow-sm",
                isLight
                  ? "bg-white border border-slate-200 text-slate-500"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              )}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]"
                style={{ backgroundColor: themeColor }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]"
                style={{ backgroundColor: themeColor }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: themeColor }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div
          className={cn(
            "px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t",
            isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800/80"
          )}
        >
          {["Healthcare benefits", "Parental leave policy"].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputVal(prompt);
              }}
              className={cn(
                "px-2.5 py-1 text-[11px] rounded-full whitespace-nowrap transition-colors shrink-0 border cursor-pointer",
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              )}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        className={cn(
          "p-3 flex items-center gap-2 border-t",
          isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800"
        )}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex-1 px-3.5 py-2.5 text-xs focus:outline-none transition-all border",
            inputRoundingClasses[rounding] || "rounded-xl",
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500"
              : "bg-slate-900 border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-indigo-500"
          )}
        />

        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          style={{
            backgroundColor: inputVal.trim() && !isTyping ? themeColor : undefined
          }}
          className={cn(
            "p-2.5 transition-all text-white shadow-sm focus:outline-none",
            inputRoundingClasses[rounding] || "rounded-xl",
            inputVal.trim() && !isTyping
              ? "hover:opacity-90 active:scale-95 cursor-pointer"
              : isLight
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Branding */}
      <div
        className={cn(
          "py-1 text-center text-[10px] select-none font-medium border-t",
          isLight
            ? "bg-slate-50 text-slate-400 border-slate-100"
            : "bg-slate-950 text-slate-500 border-slate-850"
        )}
      >
        ⚡ Powered by <span className="font-semibold">DocPilot AI</span>
      </div>
    </div>
  );

  // If used as a floating widget on the page
  if (isFloating) {
    return (
      <div className={cn("fixed z-40", positionClasses[position] || "bottom-6 right-6")}>
        {/* Floating Bubble Launcher */}
        <button
          type="button"
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          style={{
            backgroundColor: themeColor,
            boxShadow: `0 8px 24px -4px ${themeColor}66`
          }}
          className={cn(
            "w-14 h-14 flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20",
            rounding === "sharp" ? "rounded-lg" : rounding === "rounded" ? "rounded-2xl" : "rounded-full"
          )}
          aria-label={isPopupOpen ? "Close chatbot" : "Open chatbot"}
        >
          {isPopupOpen ? <X className="w-6 h-6" /> : renderAvatar("md")}
        </button>

        {/* Floating Window */}
        {isPopupOpen && chatWindowElement}
      </div>
    );
  }

  // If used inline (in Step 3 or preview)
  if (!isOpen) return null;
  return chatWindowElement;
}

export default ChatbotWidget;
