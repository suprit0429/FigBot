import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, UploadCloud, FileText, Check } from "lucide-react";
import { cn } from "../utils/cn";

export function Step2UploadDoc({
  botData,
  documents = [],
  onAddDocument,
  updateBotData,
  onNext,
  onBack
}) {
  const selectedDocIds = botData.selectedDocIds || ["doc-1"];
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // null | number
  const [uploadFileName, setUploadFileName] = useState("");
  const fileInputRef = useRef(null);

  const toggleDoc = (id) => {
    const next = selectedDocIds.includes(id)
      ? selectedDocIds.filter((d) => d !== id)
      : [...selectedDocIds, id];
    updateBotData({ selectedDocIds: next, docsCount: next.length });
  };

  const handleFile = (file) => {
    if (!file) return;
    setUploadFileName(file.name);
    setUploadProgress(20);

    setTimeout(() => setUploadProgress(60), 600);
    setTimeout(() => setUploadProgress(90), 1200);
    setTimeout(() => {
      setUploadProgress(100);

      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.split(".").pop().toUpperCase(),
        chunks: Math.floor(Math.random() * 40) + 10,
        status: "Indexed",
        updatedAt: "Just now"
      };

      if (onAddDocument) {
        onAddDocument(newDoc);
      }

      updateBotData({
        selectedDocIds: [...selectedDocIds, newDoc.id],
        docsCount: selectedDocIds.length + 1
      });

      setTimeout(() => {
        setUploadProgress(null);
        setUploadFileName("");
      }, 1500);
    }, 1800);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Add Knowledge Base
        </h2>
        <p className="text-sm text-slate-400">
          Upload PDF or DOCX documents your chatbot will use to answer questions accurately.
        </p>
      </div>

      {/* Prominent Clean Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 group",
          isDragging
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900/90"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-105">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-200">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-400">
            Supports PDF, DOCX, or TXT files (up to 25MB)
          </p>
        </div>

        {/* Single clear progress bar during upload */}
        {uploadProgress !== null && (
          <div className="w-full max-w-sm mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300 truncate max-w-[200px]">
                {uploadFileName}
              </span>
              <span className="text-indigo-400 font-mono">
                {uploadProgress === 100 ? "Ready!" : `${uploadProgress}%`}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Available Documents List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">
            Select Documents for this Bot
          </h3>
          <span className="text-xs text-slate-400">
            {selectedDocIds.length} selected
          </span>
        </div>

        <div className="space-y-2">
          {documents.map((doc) => {
            const isSelected = selectedDocIds.includes(doc.id);

            return (
              <div
                key={doc.id}
                onClick={() => toggleDoc(doc.id)}
                className={cn(
                  "p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs select-none",
                  isSelected
                    ? "bg-indigo-600/10 border-indigo-500/60 text-slate-100"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                      isSelected
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "border-slate-700 bg-slate-950"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>

                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />

                  <div className="truncate">
                    <span className="font-medium text-slate-200 truncate block">
                      {doc.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {doc.size} • {doc.type}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-emerald-400 font-medium">
                  Indexed
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={selectedDocIds.length === 0}
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md transition-all cursor-pointer"
        >
          <span>Next: Customize & Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Step2UploadDoc;
