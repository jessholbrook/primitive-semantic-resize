"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SemanticSlider from "../components/SemanticSlider";
import TextDisplay from "../components/TextDisplay";
import HistoryTimeline, {
  HistoryEntry,
} from "../components/HistoryTimeline";

const DEFAULT_TEXT = `Hi team,

I'm excited to share that we're launching our new product, Beacon, next Thursday! This has been months in the making, and the whole team has done an incredible job bringing it together.

Beacon is a real-time collaboration dashboard that helps distributed teams stay aligned without endless meetings. Key features include live project timelines, async video check-ins, and smart notification batching.

We'll be doing a soft launch with our existing customers first, then opening up to the public the following week. Marketing has a full campaign ready to go, and support is prepped for the influx.

A few things I need from everyone before Thursday:
- Engineering: final QA pass on the onboarding flow
- Design: confirm the launch landing page is pixel-perfect
- Sales: update your demo scripts with the new feature set

Let's make this launch count. If you have questions, drop them in #beacon-launch.

Thanks,
Sarah`;

interface Dimensions {
  length: number;
  formality: number;
  complexity: number;
  energy: number;
  mood: number;
}

const DEFAULT_DIMENSIONS: Dimensions = {
  length: 50,
  formality: 50,
  complexity: 50,
  energy: 50,
  mood: 50,
};

const SLIDER_CONFIG = [
  { key: "length" as const, label: "Length", minLabel: "Tweet", maxLabel: "Essay" },
  { key: "formality" as const, label: "Formality", minLabel: "Text Message", maxLabel: "Legal Document" },
  { key: "complexity" as const, label: "Complexity", minLabel: "ELI5", maxLabel: "PhD Thesis" },
  { key: "energy" as const, label: "Energy", minLabel: "Exhausted", maxLabel: "Caffeinated" },
  { key: "mood" as const, label: "Mood", minLabel: "Pessimistic", maxLabel: "Optimistic" },
];

export default function Home() {
  const [originalText] = useState(DEFAULT_TEXT);
  const [currentText, setCurrentText] = useState(DEFAULT_TEXT);
  const [dimensions, setDimensions] = useState<Dimensions>(DEFAULT_DIMENSIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIdCounter, setHistoryIdCounter] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastDimsRef = useRef<string>(JSON.stringify(DEFAULT_DIMENSIONS));

  const fetchResizedText = useCallback(
    async (dims: Dimensions) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);

      try {
        const response = await fetch("/api/resize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: originalText, dimensions: dims }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        setCurrentText(data.text);

        setHistoryIdCounter((prev) => {
          const newId = prev + 1;
          setHistory((h) => [
            {
              id: newId,
              timestamp: new Date(),
              text: data.text,
              dimensions: { ...dims },
            },
            ...h,
          ]);
          return newId;
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Failed to resize:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [originalText]
  );

  useEffect(() => {
    const dimsString = JSON.stringify(dimensions);
    if (dimsString === lastDimsRef.current) return;
    lastDimsRef.current = dimsString;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResizedText(dimensions);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [dimensions, fetchResizedText]);

  const handleDimensionChange = (key: keyof Dimensions, value: number) => {
    setDimensions((prev) => ({ ...prev, [key]: value }));
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setCurrentText(entry.text);
  };

  const handleReset = () => {
    setDimensions(DEFAULT_DIMENSIONS);
    setCurrentText(DEFAULT_TEXT);
    lastDimsRef.current = JSON.stringify(DEFAULT_DIMENSIONS);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7c83ff] to-[#4f46e5]" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Semantic Resize
          </h1>
        </div>
        <p className="text-sm text-[#e2e8f0]/50">
          Reshape text across semantic dimensions. Drag the sliders to
          transform tone, length, complexity, and more.
        </p>
      </header>

      <section>
        <TextDisplay text={currentText} isLoading={isLoading} />
      </section>

      <section className="flex flex-col gap-1">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#e2e8f0]/50">Dimensions</h2>
          <button
            onClick={handleReset}
            className="rounded-md bg-[#16213e] px-3 py-1 text-xs font-medium text-[#e2e8f0]/50 transition-colors hover:bg-[#16213e]/80 hover:text-[#e2e8f0]/70"
          >
            Reset All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SLIDER_CONFIG.map((config) => (
            <SemanticSlider
              key={config.key}
              label={config.label}
              value={dimensions[config.key]}
              onChange={(v) => handleDimensionChange(config.key, v)}
              minLabel={config.minLabel}
              maxLabel={config.maxLabel}
            />
          ))}
        </div>
      </section>

      <section>
        <HistoryTimeline
          entries={history}
          currentText={currentText}
          onSelect={handleHistorySelect}
        />
      </section>
    </div>
  );
}
