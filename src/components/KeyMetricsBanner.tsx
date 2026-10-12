import React from 'react';
import { RasInputs, RasOverallOutputs } from '../types/ras';
import { formatNum } from '../utils/rasCalculations';
import { Droplet, Activity, Fish, Wind } from 'lucide-react';

interface KeyMetricsBannerProps {
  inputs: RasInputs;
  outputs: RasOverallOutputs;
}

export const KeyMetricsBanner: React.FC<KeyMetricsBannerProps> = ({
  inputs,
  outputs,
}) => {
  const { step1, step2, step5, governingFlowRate, dailyWaterRenewalPercent } = outputs;

  return (
    <div className="bg-slate-900 border-y border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Biomasa */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <Fish className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Biomasa & Volumen
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-white tabular-nums">
              {formatNum(step1.fishBiomass, 0)}{' '}
              <span className="text-xs font-sans text-slate-400">kg</span>
            </div>
            <span className="text-xs text-sky-300 font-mono">
              {formatNum(step1.tankVolume, 1)} m³ · {inputs.maxDensity} kg/m³
            </span>
          </div>
        </div>

        {/* Metric 2: Ración de Alimento */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Alimento Diario
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-amber-300 tabular-nums">
              {formatNum(step1.feedRateKgDay, 1)}{' '}
              <span className="text-xs font-sans text-slate-400">kg/día</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {inputs.feedRatePercent}% biomasa · {inputs.feedProteinPercent}% prot.
            </span>
          </div>
        </div>

        {/* Metric 3: Caudal Gobernante */}
        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/40 flex items-start gap-3 ring-1 ring-sky-500/20">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-sky-300 uppercase tracking-wider font-semibold block">
                Caudal Gobernante
              </span>
              <span className="text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 px-1 rounded">
                {governingFlowRate.governingFactor}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-sky-200 tabular-nums">
              {formatNum(governingFlowRate.flowRateLmin, 0)}{' '}
              <span className="text-xs font-sans text-sky-400">L/min</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {formatNum(governingFlowRate.flowRateM3hr, 1)} m³/h · {formatNum(governingFlowRate.turnoverPerHour, 2)} rev/h
            </span>
          </div>
        </div>

        {/* Metric 4: Agua Nueva (Control de Nitratos) */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Droplet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Agua Nueva (Recambio)
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-emerald-300 tabular-nums">
              {formatNum(step2.newWaterRequiredLday, 0)}{' '}
              <span className="text-xs font-sans text-slate-400">L/día</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono">
              {dailyWaterRenewalPercent.toFixed(1)}% estanque/día
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
