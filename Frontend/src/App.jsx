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
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
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
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 flex items-center gap-2.5 text-[12px] animate-slide-up"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(37,99,235,0.20)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
              color: '#0F172A',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ color: 'var(--blue)', fontSize: '14px' }}>◆</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // If user is authenticated, render the full workspace application
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onSignOut={handleSignOut}
        onOpenSearch={() => setSearchModalOpen(true)}
        onCreateBotClick={handleCreateNewBot}
        onOpenNotifications={() => showToast("FiBot AI engine running at 99.9% uptime.")}
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ background: '#F8FAFC' }}>
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.7rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      All Chatbots
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      Test, customize, and get embed codes for your active bots.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateNewBot}
                    className="btn-amber inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold shrink-0 cursor-pointer"
                    style={{ borderRadius: 'var(--radius-sharp)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Bot</span>
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
                <div
                  className="flex items-center justify-between pb-4"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Test: {selectedBot.name}
                    </h2>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Verify retrieval and page citations in real time.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Bot:</span>
                    <select
                      value={selectedBot.id}
                      onChange={(e) => {
                        const found = bots.find((b) => b.id === e.target.value);
                        if (found) setSelectedBot(found);
                      }}
                      className="text-[12px] px-3 py-1.5 focus:outline-none"
                      style={{
                        background: 'var(--bg-raised)',
                        border: '1px solid var(--border-mild)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-sharp)',
                      }}
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
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.7rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Workspace Settings
                  </h2>
                  <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    Manage API keys, team members, and billing.
                  </p>
                </div>

                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div className="space-y-1">
                    <h3
                      className="text-[13px] font-semibold flex items-center gap-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Key className="w-4 h-4" style={{ color: 'var(--amber)' }} />
                      API Secret Key
                    </h3>
                    <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                      Authenticate REST API requests and embed widgets programmatically.
                    </p>
                  </div>

                  <div
                    className="flex items-center justify-between p-3.5 text-[12px] font-mono"
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sharp)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>docpilot_live_sk_8492xxxxxxxxxxxxxxxx</span>
                    <button
                      type="button"
                      onClick={() => showToast("API Key copied to clipboard.")}
                      className="px-3 py-1 text-[11px] cursor-pointer transition-colors"
                      style={{
                        background: 'var(--bg-overlay)',
                        border: '1px solid var(--border-mild)',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-sharp)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-amber)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-mild)')}
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
            className="fixed inset-0"
            style={{ background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSearchModalOpen(false)}
          />
          <div
            className="relative w-full max-w-md overflow-hidden z-10 p-4 space-y-3 animate-scale-in"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(148,163,184,0.30)',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(15,23,42,0.15)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <div className="relative">
              <Search
                className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: '#94A3B8' }}
              />
              <input
                type="text"
                autoFocus
                placeholder="Search bots or documents…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[12px] focus:outline-none"
                style={{
                  background: '#F8FAFC',
                  border: '1px solid rgba(148,163,184,0.30)',
                  color: '#0F172A',
                  borderRadius: '8px',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(37,99,235,0.40)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.30)')}
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.action}
                  className="p-2.5 cursor-pointer flex items-center justify-between text-[12px] transition-colors rounded-lg"
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div className="font-semibold" style={{ color: '#0F172A' }}>{item.title}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>{item.subtitle}</div>
                  </div>
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded"
                    style={{
                      background: '#EFF6FF',
                      color: '#2563EB',
                      border: '1px solid rgba(37,99,235,0.20)',
                    }}
                  >
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
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 flex items-center gap-2.5 text-[12px] animate-slide-up"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(37,99,235,0.20)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
            color: '#0F172A',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span style={{ color: 'var(--blue)', fontSize: '14px' }}>◆</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
