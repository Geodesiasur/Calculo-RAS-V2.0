import React from 'react';

interface InputRowProps {
  label: string;
  sublabel?: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  isPercentage?: boolean;
}

export const InputRow: React.FC<InputRowProps> = ({
  label,
  sublabel,
  value,
  unit,
  min = 0,
  max = 1000,
  step = 0.1,
  onChange,
  isPercentage = false,
}) => {
  const displayVal = isPercentage ? Number((value).toFixed(2)) : value;

  return (
    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-400/30 hover:border-amber-400/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Parámetro de Entrada" />
            <label className="text-sm font-semibold text-amber-200">
              {label}
            </label>
          </div>
          {sublabel && <p className="text-xs text-slate-400 mt-0.5 pl-4">{sublabel}</p>}
        </div>

        <div className="flex items-center gap-2 pl-4 sm:pl-0">
          <div className="relative">
            <input
              type="number"
              value={Number.isNaN(value) ? '' : value}
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                onChange(isNaN(parsed) ? 0 : parsed);
              }}
              className="w-28 sm:w-32 px-3 py-1.5 text-right font-mono text-sm font-bold bg-slate-900 border border-amber-400/50 rounded-lg text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 tabular-nums shadow-inner"
            />
          </div>
          <span className="text-xs font-mono font-medium text-amber-300/80 min-w-[3.5rem]">
            {unit}
          </span>
        </div>
      </div>

      {/* Slider for quick interactive tuning */}
      <div className="flex items-center gap-3 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayVal}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300"
        />
      </div>
    </div>
  );
};
