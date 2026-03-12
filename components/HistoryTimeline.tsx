"use client";

import { useState } from "react";

export interface HistoryEntry {
  id: number;
  timestamp: Date;
  text: string;
  dimensions: {
    length: number;
    formality: number;
    complexity: number;
    energy: number;
    mood: number;
  };
}

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  currentText: string;
  onSelect: (entry: HistoryEntry) => void;
}

const dimensionLabels: Record<string, string> = {
  length: "Len",
  formality: "Form",
  complexity: "Comp",
  energy: "Nrg",
  mood: "Mood",
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function HistoryTimeline({
  entries,
  currentText,
  onSelect,
}: HistoryTimelineProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;

  const handleSelect = (entry: HistoryEntry) => {
    if (selectedId === entry.id) {
      setSelectedId(null);
      setCompareMode(false);
    } else {
      setSelectedId(entry.id);
      onSelect(entry);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-[#e2e8f0]/10 bg-[#16213e]/30 p-4">
        <h3 className="mb-2 text-sm font-medium text-[#e2e8f0]/50">History</h3>
        <p className="text-xs text-[#e2e8f0]/30">
          Adjust the sliders to start generating versions. Each change will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#e2e8f0]/10 bg-[#16213e]/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#e2e8f0]/50">
          History ({entries.length} version{entries.length !== 1 ? "s" : ""})
        </h3>
        {selectedId !== null && (
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              compareMode
                ? "bg-[#7c83ff] text-white"
                : "bg-[#16213e] text-[#7c83ff] hover:bg-[#7c83ff]/20"
            }`}
          >
            {compareMode ? "Hide Compare" : "Compare"}
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {entries.map((entry) => {
          const isSelected = selectedId === entry.id;
          return (
            <button
              key={entry.id}
              onClick={() => handleSelect(entry)}
              className={`flex shrink-0 flex-col gap-1.5 rounded-lg border p-3 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[#7c83ff]/60 bg-[#7c83ff]/10"
                  : "border-[#e2e8f0]/5 bg-[#16213e]/50 hover:border-[#e2e8f0]/15 hover:bg-[#16213e]/70"
              }`}
              style={{ minWidth: "160px" }}
            >
              <span className="text-[10px] font-mono text-[#e2e8f0]/40">
                {formatTime(entry.timestamp)}
              </span>
              <div className="flex flex-wrap gap-1">
                {Object.entries(entry.dimensions).map(([key, val]) => (
                  <span
                    key={key}
                    className="rounded bg-[#1a1a2e]/80 px-1.5 py-0.5 text-[10px] font-mono text-[#e2e8f0]/50"
                  >
                    {dimensionLabels[key]} {val}
                  </span>
                ))}
              </div>
              <span className="line-clamp-2 text-[11px] leading-4 text-[#e2e8f0]/30">
                {entry.text}
              </span>
            </button>
          );
        })}
      </div>

      {compareMode && selectedEntry && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#e2e8f0]/10 bg-[#1a1a2e]/60 p-4">
            <h4 className="mb-2 text-xs font-medium text-[#7c83ff]">
              Selected Version
            </h4>
            <p className="whitespace-pre-wrap text-xs leading-5 text-[#e2e8f0]/70">
              {selectedEntry.text}
            </p>
          </div>
          <div className="rounded-lg border border-[#e2e8f0]/10 bg-[#1a1a2e]/60 p-4">
            <h4 className="mb-2 text-xs font-medium text-[#e2e8f0]/50">
              Current Version
            </h4>
            <p className="whitespace-pre-wrap text-xs leading-5 text-[#e2e8f0]/70">
              {currentText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
