import React, { useState } from "react";
import Step1BotDetails from "./Step1BotDetails";
import Step2UploadDoc from "./Step2UploadDoc";
import Step3CustomizeAndTest from "./Step3CustomizeAndTest";
import { Check } from "lucide-react";
import { cn } from "../utils/cn";

export function CreateBotWizard({
  documents = [],
  onAddDocument,
  onComplete,
  onShowToast,
  initialData
}) {
  const [step, setStep] = useState(1);
  const [botData, setBotData] = useState(
    initialData || {
      id: `bot-${Date.now()}`,
      name: "",
      domain: "Customer Support",
      avatar: "bot",
      avatarUrl: "",
      themeColor: "#6366F1",
      themeMode: "dark",
      headerTitle: "Support Assistant",
      greeting: "Hi there! How can I help you today?",
      placeholder: "Ask a question...",
      position: "bottom-right",
      rounding: "rounded",
      selectedDocIds: ["doc-1"]
    }
  );

  const steps = [
    { num: 1, title: "1. Details" },
    { num: 2, title: "2. Knowledge" },
    { num: 3, title: "3. Customize & Deploy" }
  ];

  const updateBotData = (patch) => {
    setBotData((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="space-y-8 py-2">
      {/* 3-Step Clean Progress Bar */}
      <div className="max-w-md mx-auto py-2">
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 80}%` }}
          />

          {steps.map((s) => {
            const isCompleted = s.num < step;
            const isActive = s.num === step;

            return (
              <div
                key={s.num}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => setStep(s.num)}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-200 border",
                    isCompleted
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : isActive
                      ? "bg-slate-900 border-indigo-500 text-indigo-400 ring-4 ring-indigo-500/10 font-bold scale-105"
                      : "bg-slate-900 border-slate-800 text-slate-500 group-hover:border-slate-700 group-hover:text-slate-300"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  ) : (
                    <span>{s.num}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "absolute top-11 text-xs font-medium whitespace-nowrap",
                    isActive
                      ? "text-slate-100 font-semibold"
                      : isCompleted
                      ? "text-slate-300"
                      : "text-slate-500"
                  )}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-6" />
      </div>

      {/* Active Step */}
      {step === 1 && (
        <Step1BotDetails
          botData={botData}
          updateBotData={updateBotData}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2UploadDoc
          botData={botData}
          documents={documents}
          onAddDocument={onAddDocument}
          updateBotData={updateBotData}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3CustomizeAndTest
          botData={botData}
          onUpdateBotData={updateBotData}
          onBack={() => setStep(2)}
          onComplete={() => onComplete(botData)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

export default CreateBotWizard;
