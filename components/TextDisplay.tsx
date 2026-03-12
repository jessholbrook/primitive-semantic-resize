"use client";

import { useEffect, useState } from "react";

interface TextDisplayProps {
  text: string;
  isLoading: boolean;
}

export default function TextDisplay({ text, isLoading }: TextDisplayProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (text !== displayText) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayText(text);
        setIsTransitioning(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [text, displayText]);

  return (
    <div className="relative min-h-[200px] rounded-xl border border-[#e2e8f0]/10 bg-[#16213e]/60 p-6 backdrop-blur-sm">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#16213e]/40 backdrop-blur-[2px]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#7c83ff] [animation-delay:0ms]" />
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#7c83ff] [animation-delay:150ms]" />
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#7c83ff] [animation-delay:300ms]" />
            </div>
            <span className="text-sm text-[#e2e8f0]/60">Reshaping text...</span>
          </div>
        </div>
      )}

      <p
        className="whitespace-pre-wrap text-base leading-7 tracking-wide transition-all duration-300 ease-in-out"
        style={{
          opacity: isTransitioning || isLoading ? 0.3 : 1,
          transform:
            isTransitioning || isLoading
              ? "translateY(4px)"
              : "translateY(0px)",
        }}
      >
        {displayText}
      </p>
    </div>
  );
}
