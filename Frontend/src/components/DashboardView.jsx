import React, { useState } from "react";
import BotCard from "./BotCard";
import { Plus, Bot, FileText, MessageSquare, Search } from "lucide-react";

export function DashboardView({
  bots = [],
  documentsCount = 5,
  onCreateNewBot,
  onTestBot,
  onEditBot,
  onEmbedBot,
  onDeleteBot
}) {
  const [search, setSearch] = useState("");

  const filteredBots = bots.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 py-2">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            AI Workspace Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build, test, and embed autonomous chatbots trained on your documents.
          </p>
        </div>

        {/* Large Prominent Action Button */}
        <button
          type="button"
          onClick={onCreateNewBot}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Bot</span>
        </button>
      </div>

      {/* 3 Clear Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Bots
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-slate-100 font-mono">
              {bots.length}
            </div>
            <p className="text-xs text-slate-500">Deployed across your web apps</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Indexed Documents
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-slate-100 font-mono">
              {documentsCount}
            </div>
            <p className="text-xs text-slate-500">Source PDFs & DOCX files grounded</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Conversations
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-slate-100 font-mono">
              5,340
            </div>
            <p className="text-xs text-slate-500">User queries answered with citations</p>
          </div>
        </div>
      </div>

      {/* Bot Cards Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              Your Chatbots
            </h3>
            <p className="text-xs text-slate-400">
              Select a chatbot to test its answers or embed it into your app.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chatbots..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Grid of BotCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onTest={onTestBot}
              onEdit={onEditBot}
              onEmbed={onEmbedBot}
              onDelete={onDeleteBot}
            />
          ))}
        </div>

        {filteredBots.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-sm text-slate-400">No chatbots found.</p>
            <button
              type="button"
              onClick={onCreateNewBot}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Your First Bot</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardView;
