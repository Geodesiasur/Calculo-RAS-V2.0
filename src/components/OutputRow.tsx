import React from 'react';
import { formatNum } from '../utils/rasCalculations';

interface OutputRowProps {
  label: string;
  sublabel?: string;
  value: number;
  unit: string;
  decimals?: number;
  formula?: string;
  isPrimary?: boolean;
}

export const OutputRow: React.FC<OutputRowProps> = ({
  label,
  sublabel,
  value,
  unit,
  decimals = 2,
  formula,
  isPrimary = false,
}) => {
  return (
    <div
      className={`p-3.5 rounded-xl transition-all ${
        isPrimary
          ? 'bg-sky-500/15 border-2 border-sky-400 shadow-lg shadow-sky-950/30 ring-1 ring-sky-400/30'
          : 'bg-sky-500/5 border border-sky-400/30 hover:border-sky-400/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" title="Cálculo Automático" />
            <span className={`text-sm font-semibold ${isPrimary ? 'text-sky-200 text-base' : 'text-slate-200'}`}>
              {label}
            </span>
          </div>
          {sublabel && <p className="text-xs text-slate-400 mt-0.5 pl-4">{sublabel}</p>}
          {formula && (
            <div className="mt-1 pl-4">
              <span className="text-[11px] font-mono text-sky-300/70 bg-slate-900/80 px-2 py-0.5 rounded border border-sky-500/20 inline-block">
                Fórmula: {formula}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 justify-end pl-4 sm:pl-0 shrink-0">
          <span
            className={`font-mono font-bold tracking-tight tabular-nums ${
              isPrimary
                ? 'text-2xl sm:text-3xl text-sky-300 drop-shadow-sm'
                : 'text-lg sm:text-xl text-sky-300'
            }`}
          >
            {formatNum(value, decimals)}
          </span>
          <span className="text-xs font-mono font-medium text-sky-400/80 min-w-[3.5rem]">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};
