import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import BotCard from "./components/BotCard";
import CreateBotWizard from "./components/CreateBotWizard";
import Step3CustomizeAndTest from "./components/Step3CustomizeAndTest";
import ChatbotWidget from "./components/ChatbotWidget";
import EmbedCodeModal from "./components/EmbedCodeModal";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";

import {
  Search,
  Plus,
  Sparkles,
  Key
} from "lucide-react";
import { initialBots, initialDocuments } from "./utils/mockData";
import "./App.css";

export function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("docpilot_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("signin");

  // Navigation & Workspace State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [bots, setBots] = useState(initialBots);
  const [documents, setDocuments] = useState(initialDocuments);

  // Active testing bot for Test and Styling tabs
  const [selectedBot, setSelectedBot] = useState(initialBots[0]);

  // Embed script modal
  const [embedModalBot, setEmbedModalBot] = useState(null);

  // Global search modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenAuth = (mode = "signin") => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem("docpilot_user", JSON.stringify(userData));
    } catch {
      // ignore storage errors
    }
    showToast(`Welcome back, ${userData.name}! Workspace loaded.`);
    setActiveTab("dashboard");
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("docpilot_user");
    } catch {
      // ignore storage errors
    }
    showToast("Signed out successfully.");
  };

  const handleCreateNewBot = () => {
    setActiveTab("wizard");
  };

  const handleTestBot = (bot) => {
    setSelectedBot(bot);
    setActiveTab("test");
  };

  const handleEditBot = (bot) => {
    setSelectedBot(bot);
    setActiveTab("styling");
  };

  const handleDeleteBot = (botId) => {
    setBots((prev) => prev.filter((b) => b.id !== botId));
    showToast("Chatbot removed from workspace.");
  };

  const handleCompleteWizard = (newBot) => {
    setBots((prev) => [
      {
        ...newBot,
        queries: 0,
        docsCount: newBot.selectedDocIds?.length || 1,
        status: "Active"
      },
      ...prev
    ]);
    setSelectedBot(newBot);
    setActiveTab("dashboard");
  };

  const handleAddDocument = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Added "${newDoc.name}" to knowledge base.`);
  };

  const searchResults = [
    ...bots.map((b) => ({
      type: "Chatbot",
      title: b.name,
      subtitle: `${b.domain} • ${b.docsCount || 2} documents`,
      action: () => {
        handleTestBot(b);
        setSearchModalOpen(false);
      }
    })),
    ...documents.map((d) => ({
      type: "Document",
      title: d.name,
      subtitle: `${d.size} • ${d.chunks} chunks`,
      action: () => {
        setSearchModalOpen(false);
      }
    }))
  ].filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If user is not authenticated, render the public Landing Page & Auth Modal
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onGetStarted={() => handleOpenAuth("signup")}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authInitialMode}
          onAuthSuccess={handleAuthSuccess}
          onShowToast={showToast}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs text-white flex items-center gap-2 animate-in fade-in duration-200">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // If user is authenticated, render the full workspace application
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onSignOut={handleSignOut}
        onOpenSearch={() => setSearchModalOpen(true)}
        onCreateBotClick={handleCreateNewBot}
        onOpenNotifications={() => showToast("DocPilot AI engine running at 99.9% uptime.")}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* 1. VIEW: DASHBOARD */}
            {activeTab === "dashboard" && (
              <DashboardView
                bots={bots}
                documentsCount={documents.length}
                onCreateNewBot={handleCreateNewBot}
                onTestBot={handleTestBot}
                onEditBot={handleEditBot}
                onEmbedBot={(b) => setEmbedModalBot(b)}
                onDeleteBot={handleDeleteBot}
              />
            )}

            {/* 2. VIEW: CHATBOTS LIST */}
            {activeTab === "chatbots" && (
              <div className="space-y-8 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                      All Chatbots
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Manage your active bots, customize appearance, and get embed codes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateNewBot}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Bot</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {bots.map((bot) => (
                    <BotCard
                      key={bot.id}
                      bot={bot}
                      onTest={handleTestBot}
                      onEdit={handleEditBot}
                      onEmbed={(b) => setEmbedModalBot(b)}
                      onDelete={handleDeleteBot}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. VIEW: CREATE BOT WIZARD (3-Step) */}
            {activeTab === "wizard" && (
              <CreateBotWizard
                documents={documents}
                onAddDocument={handleAddDocument}
                onComplete={handleCompleteWizard}
                onShowToast={showToast}
              />
            )}

            {/* 4. VIEW: APPEARANCE & STYLING */}
            {activeTab === "styling" && (
              <Step3CustomizeAndTest
                botData={selectedBot}
                onUpdateBotData={(patch) => {
                  const updated = { ...selectedBot, ...patch };
                  setSelectedBot(updated);
                  setBots((prev) =>
                    prev.map((b) => (b.id === selectedBot.id ? updated : b))
                  );
                }}
                onBack={() => setActiveTab("dashboard")}
                onComplete={() => {
                  showToast("Styling changes saved!");
                  setActiveTab("dashboard");
                }}
                onShowToast={showToast}
              />
            )}

            {/* 5. VIEW: TEST ASSISTANT */}
            {activeTab === "test" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">
                      Test Assistant: {selectedBot.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Test answer retrieval and source citations in real time.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Bot:</span>
                    <select
                      value={selectedBot.id}
                      onChange={(e) => {
                        const found = bots.find((b) => b.id === e.target.value);
                        if (found) setSelectedBot(found);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    >
                      {bots.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Step3CustomizeAndTest
                  botData={selectedBot}
                  onUpdateBotData={(patch) => {
                    const updated = { ...selectedBot, ...patch };
                    setSelectedBot(updated);
                    setBots((prev) =>
                      prev.map((b) => (b.id === selectedBot.id ? updated : b))
                    );
                  }}
                  onBack={() => setActiveTab("dashboard")}
                  onComplete={() => {
                    showToast("Bot test saved!");
                    setActiveTab("dashboard");
                  }}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* 6. VIEW: SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-2xl mx-auto py-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                    Workspace Settings
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Manage your API keys and team configurations.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Key className="w-4 h-4 text-indigo-400" />
                      <span>API Secret Key</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Use this key to authenticate REST API requests and programmatic widget embeds.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">docpilot_live_sk_8492xxxxxxxxxxxxxxxx</span>
                    <button
                      type="button"
                      onClick={() => showToast("API Key copied to clipboard.")}
                      className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Chatbot Widget Preview (Always Accessible in Workspace Bottom Right) */}
      <ChatbotWidget
        headerTitle={selectedBot.name || "Support Assistant"}
        themeColor={selectedBot.themeColor || "#6366F1"}
        themeMode={selectedBot.themeMode || "dark"}
        avatar={selectedBot.avatar || "bot"}
        greeting={selectedBot.greeting || "Hi there! How can I help you today?"}
        placeholder={selectedBot.placeholder || "Ask a question..."}
        rounding={selectedBot.rounding || "rounded"}
        position={selectedBot.position || "bottom-right"}
        isFloating={true}
      />

      {/* Embed Code Modal Dialog */}
      <EmbedCodeModal
        isOpen={!!embedModalBot}
        onClose={() => setEmbedModalBot(null)}
        bot={embedModalBot}
        onShowToast={showToast}
      />

      {/* ⌘K Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSearchModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-5 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search chatbot or document name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 pt-1">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.action}
                  className="p-2.5 rounded-lg hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[10px] text-slate-500">{item.subtitle}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs text-white flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
