import React from 'react';
import { RasInputs, RasStep4Outputs } from '../types/ras';
import { InputRow } from './InputRow';
import { OutputRow } from './OutputRow';

interface Step4Props {
  inputs: RasInputs;
  outputs: RasStep4Outputs;
  onChange: (updates: Partial<RasInputs>) => void;
}

export const Step4SolidsBalance: React.FC<Step4Props> = ({
  inputs,
  outputs,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
              Paso 4 de 5 · Filtración Mecánica
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Balance de Masa de Sólidos Suspendidos Totales (SST)
            </h2>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            Filtración mecánica (Filtros de tambor rotatorio, decantadores, trampas)
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Defina la producción de heces/sólidos y la tecnología de separación en{' '}
          <strong className="text-amber-300 font-semibold">amarillo</strong>. El sistema calculará
          la masa de sólidos a capturar y el caudal de recirculación mecánica en{' '}
          <strong className="text-sky-300 font-semibold">azul</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* PARÁMETROS DE ENTRADA (AMARILLO) */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-amber-500/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">
                Parámetros de Entrada (Usuario)
              </h3>
            </div>
            <span className="text-xs text-amber-300/80 font-mono">4 Variables</span>
          </div>

          <InputRow
            label="Porcentaje estimado de alimento convertido en desecho sólido"
            sublabel="Fracción fecal y partículas finas no digeridas (típico 20-30%)"
            value={inputs.feedToSolidsPercent}
            unit="%"
            min={10}
            max={40}
            step={1}
            isPercentage
            onChange={(val) => onChange({ feedToSolidsPercent: val })}
          />

          <InputRow
            label="Concentración deseada de SST en el estanque"
            sublabel="Límite máximo de turbidez/sólidos para salud branquial del salmón (ej. < 25 mg/L)"
            value={inputs.desiredSS}
            unit="mg/L"
            min={5}
            max={60}
            step={1}
            onChange={(val) => onChange({ desiredSS: val })}
          />

          <InputRow
            label="Porcentaje removido por trampa de partículas (Fondo / Drenaje doble)"
            sublabel="Separación gravitatoria previa en el cono central o caja colectora"
            value={inputs.particleTrapPercent}
            unit="%"
            min={0}
            max={50}
            step={1}
            isPercentage
            onChange={(val) => onChange({ particleTrapPercent: val })}
          />

          <InputRow
            label="Eficiencia del filtro mecánico (Tambor rotatorio, perlas, etc.)"
            sublabel="Eficiencia de remoción por paso de caudal a través de la malla (mallas de 40 a 60 micras)"
            value={inputs.solidsFilterEfficiencyPercent}
            unit="%"
            min={20}
            max={90}
            step={5}
            isPercentage
            onChange={(val) => onChange({ solidsFilterEfficiencyPercent: val })}
          />
        </div>

        {/* VARIABLES CRÍTICAS CALCULADAS (AZUL) */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-sky-500/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-sky-200">
                Variables Críticas Calculadas
              </h3>
            </div>
            <span className="text-xs text-sky-300/80 font-mono">Balance SST</span>
          </div>

          <OutputRow
            label="Sólidos residuales totales producidos"
            sublabel="Masa total de sólidos generados cada día por la biomasa"
            value={outputs.wasteSolidsProducedKgDay}
            unit="kg/día"
            decimals={2}
            formula="= Tasa Alimento * % Desecho Sólido"
            isPrimary
          />

          <OutputRow
            label="Sólidos restantes tras trampa de partículas"
            sublabel="Carga de sólidos que continúa en suspensión hacia el filtro"
            value={outputs.solidsAfterParticleTrapKgDay}
            unit="kg/día"
            decimals={2}
            formula="= Sólidos Producidos * (1 - % Trampa)"
          />

          <OutputRow
            label="Sólidos restantes tras remoción por efluente de recambio"
            sublabel="Carga que debe ser retenida activamente por el filtro mecánico"
            value={outputs.solidsRemainingEffluentKgDay}
            unit="kg/día"
            decimals={2}
            formula="= Sólidos Tras Trampa - (SST Deseado * Agua Nueva / 1,000,000)"
          />

          {/* CAUDAL DE DISEÑO POR SÓLIDOS */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-400/40 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Caudal Requerido para Remoción de SST
              </span>
              <span className="text-xs font-mono text-sky-400">
                = Sólidos Efluente / (Eficiencia * Conc. SST)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20">
                <span className="text-[11px] text-slate-400 block">Caudal L/min</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateSS_Lmin.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">L/min</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20">
                <span className="text-[11px] text-slate-400 block">Caudal L/hr</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateSS_Lhr.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">L/hr</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block">Caudal Galones/min</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateSS_gpm.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">GPM</span>
              </div>
            </div>

            <div className="text-xs text-sky-200/90 font-mono pt-1">
              Caudal Diario Total: {outputs.flowRateSS_Lday.toLocaleString('es-CL', { maximumFractionDigits: 0 })} L/día ({outputs.flowRateSS_M3hr.toFixed(1)} m³/hr)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
