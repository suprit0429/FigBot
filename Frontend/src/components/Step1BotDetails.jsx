import React from "react";
import { ArrowRight } from "lucide-react";

export function Step1BotDetails({ botData, updateBotData, onNext }) {
  const purposes = [
    {
      id: "Customer Support",
      label: "Customer Support",
      greeting: "Hello! How can I help you with your support inquiry today?"
    },
    {
      id: "FAQ",
      label: "FAQ Assistant",
      greeting: "Hi there! Feel free to ask any frequently asked questions about our services."
    },
    {
      id: "Policy Assistant",
      label: "Policy Assistant",
      greeting: "Hello! I am your internal policy and compliance guide. What policy details do you need?"
    },
    {
      id: "Custom",
      label: "Custom Bot",
      greeting: "Hello! Ask me anything about your uploaded documents."
    }
  ];

  const handlePurposeChange = (e) => {
    const selected = purposes.find((p) => p.id === e.target.value);
    updateBotData({
      domain: e.target.value,
      greeting: selected ? selected.greeting : botData.greeting
    });
  };

  const isFormValid = botData.name?.trim().length > 1;

  return (
    <div className="max-w-xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Create Your Chatbot
        </h2>
        <p className="text-sm text-slate-400">
          Give your bot a name and choose what it will help users with.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        {/* Bot Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200">
            Bot Name
          </label>
          <input
            type="text"
            autoFocus
            value={botData.name || ""}
            onChange={(e) => updateBotData({ name: e.target.value })}
            placeholder="e.g. Acme Support Assistant"
            className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Purpose Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200">
            Bot Purpose
          </label>
          <select
            value={botData.domain || "Customer Support"}
            onChange={handlePurposeChange}
            className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none cursor-pointer transition-all"
          >
            {purposes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 pt-1">
            Presets configure the bot's default tone and starting greeting.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md transition-all cursor-pointer"
        >
          <span>Next: Add Knowledge Base</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Step1BotDetails;
