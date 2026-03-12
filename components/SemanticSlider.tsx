"use client";

interface SemanticSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}

export default function SemanticSlider({
  label,
  value,
  onChange,
  minLabel,
  maxLabel,
}: SemanticSliderProps) {
  const percentage = value;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#e2e8f0]/80">{label}</span>
        <span className="rounded-full bg-[#16213e] px-2.5 py-0.5 text-xs font-mono text-[#7c83ff]">
          {value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input w-full cursor-pointer"
          style={
            {
              "--slider-pct": `${percentage}%`,
            } as React.CSSProperties
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#e2e8f0]/40">{minLabel}</span>
        <span className="text-xs text-[#e2e8f0]/40">{maxLabel}</span>
      </div>

      <style jsx>{`
        .slider-input {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(
            to right,
            #7c83ff 0%,
            #7c83ff var(--slider-pct),
            #16213e var(--slider-pct),
            #16213e 100%
          );
          outline: none;
          transition: background 0.1s ease;
        }
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #7c83ff;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(124, 131, 255, 0.4);
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .slider-input::-webkit-slider-thumb:hover {
          box-shadow: 0 0 14px rgba(124, 131, 255, 0.7);
          transform: scale(1.15);
        }
        .slider-input::-webkit-slider-thumb:active {
          transform: scale(1.25);
          box-shadow: 0 0 20px rgba(124, 131, 255, 0.8);
        }
        .slider-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #7c83ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(124, 131, 255, 0.4);
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .slider-input::-moz-range-thumb:hover {
          box-shadow: 0 0 14px rgba(124, 131, 255, 0.7);
          transform: scale(1.15);
        }
        .slider-input::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
