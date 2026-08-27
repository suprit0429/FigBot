import React from "react";
import { Play, Edit3, Code2, Trash2, FileText } from "lucide-react";

export function BotCard({ bot, onTest, onEdit, onEmbed, onDelete }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-5 shadow-sm group">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/10"
              style={{ backgroundColor: `${bot.themeColor || "#6366F1"}25` }}
            >
              {bot.avatar || "🤖"}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                {bot.name}
              </h4>
              <span className="inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {bot.domain || "Assistant"}
              </span>
            </div>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(bot.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
              title="Delete bot"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>{bot.docsCount || 2} documents linked</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onTest && onTest(bot)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Test</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(bot)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onEmbed && onEmbed(bot)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Embed</span>
        </button>
      </div>
    </div>
  );
}

export default BotCard;
