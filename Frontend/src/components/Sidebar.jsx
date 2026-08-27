import React from "react";
import {
  LayoutDashboard,
  Bot,
  Sparkles,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  HardDrive
} from "lucide-react";
import { cn } from "../utils/cn";

export function Sidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}) {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "chatbots", label: "Chatbots", icon: Bot, badge: "12" },
    { id: "wizard", label: "Create Bot Wizard", icon: Sparkles, highlight: true },
    { id: "styling", label: "Appearance", icon: Palette },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] bg-slate-900/60 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-20 select-none",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Navigation Items */}
      <div className="p-3 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative text-left",
                isActive
                  ? "bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-indigo-400" : "text-slate-400"
                )}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
              )}

              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quota Meter & Collapse Toggle */}
      <div className="p-3 space-y-2 border-t border-slate-800">
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-slate-400">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Vector Quota
              </span>
              <span className="text-cyan-400 font-mono">73%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: "73%" }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>184 / 500 Docs</span>
              <span>1.2M Tokens</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors text-xs gap-2"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
