import React from 'react';
import { RasOverallOutputs } from '../types/ras';
import { formatNum } from '../utils/rasCalculations';

interface RasFlowDiagramProps {
  outputs: RasOverallOutputs;
}

export const RasFlowDiagram: React.FC<RasFlowDiagramProps> = ({ outputs }) => {
  const { step1, step2, step3, step4, step5, governingFlowRate, dailyWaterRenewalPercent } = outputs;

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
            Esquema Hidráulico y Balance en Circuito Cerrado
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Diagrama de Proceso RAS y Comparativa de Caudales Críticos
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            Recambio agua nueva: <strong className="text-sky-300">{dailyWaterRenewalPercent.toFixed(1)}% / día</strong>
          </span>
        </div>
      </div>

      {/* COMPARATIVA DE LOS 3 CAUDALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Caudal O2 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            governingFlowRate.governingFactor === 'O2'
              ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Caudal por Oxígeno (O₂)
            </span>
            {governingFlowRate.governingFactor === 'O2' && (
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                Gobernante ★
              </span>
            )}
          </div>
          <div className="text-2xl font-mono font-bold text-sky-300 mt-2 tabular-nums">
            {formatNum(step5.flowRateO2_Lmin, 0)} <span className="text-xs font-sans text-slate-400">L/min</span>
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
            <span>{formatNum(step5.flowRateO2_M3hr, 1)} m³/hr</span>
            <span>{formatNum(step5.flowRateO2_gpm, 0)} GPM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            Demanda total: {formatNum(step5.totalOxygenUsedKgDay, 2)} kg O₂/día para peces y nitrificación.
          </p>
        </div>

        {/* Caudal TAN */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            governingFlowRate.governingFactor === 'TAN'
              ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Caudal por TAN (Amonio)
            </span>
            {governingFlowRate.governingFactor === 'TAN' && (
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                Gobernante ★
              </span>
            )}
          </div>
          <div className="text-2xl font-mono font-bold text-sky-300 mt-2 tabular-nums">
            {formatNum(step2.flowRateTAN_Lmin, 0)} <span className="text-xs font-sans text-slate-400">L/min</span>
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
            <span>{formatNum(step2.flowRateTAN_M3hr, 1)} m³/hr</span>
            <span>{formatNum(step2.flowRateTAN_gpm, 0)} GPM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            Carga al biofiltro: {formatNum(step2.tanAvailableBiofilterKgDay, 2)} kg TAN/día a 50% eficiencia.
          </p>
        </div>

        {/* Caudal SST */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            governingFlowRate.governingFactor === 'SST'
              ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3. Caudal por Sólidos (SST)
            </span>
            {governingFlowRate.governingFactor === 'SST' && (
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                Gobernante ★
              </span>
            )}
          </div>
          <div className="text-2xl font-mono font-bold text-sky-300 mt-2 tabular-nums">
            {formatNum(step4.flowRateSS_Lmin, 0)} <span className="text-xs font-sans text-slate-400">L/min</span>
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
            <span>{formatNum(step4.flowRateSS_M3hr, 1)} m³/hr</span>
            <span>{formatNum(step4.flowRateSS_gpm, 0)} GPM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            Sólidos a retirar: {formatNum(step4.solidsRemainingEffluentKgDay, 2)} kg SST/día por filtración.
          </p>
        </div>
      </div>

      {/* DIAGRAMA VECTORIAL SVG INTERACTIVO */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
        <div className="min-w-[760px] text-center space-y-3">
          <svg viewBox="0 0 940 310" className="w-full h-auto max-h-[310px]">
            {/* Definitions for arrow markers */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-fresh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
              </marker>
            </defs>

            {/* Circuit Lines */}
            {/* Tanque -> Sólidos */}
            <path d="M 255 145 L 320 145" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
            {/* Sólidos -> Biofiltro */}
            <path d="M 480 145 L 545 145" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
            {/* Biofiltro -> Oxigenador */}
            <path d="M 705 145 L 770 145" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
            {/* Oxigenador -> Retorno al Tanque (Bucle Superior) */}
            <path d="M 840 85 L 840 45 L 175 45 L 175 85" fill="none" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
            {/* Entrada de Agua Nueva */}
            <path d="M 35 145 L 90 145" stroke="#34d399" strokeWidth="3" strokeDasharray="4 4" markerEnd="url(#arrow-fresh)" />
            {/* Purga / Efluente hacia drenaje */}
            <path d="M 175 210 L 175 265" stroke="#f87171" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow)" />

            {/* BLOQUE 1: TANQUE DE BIOMASA (Todo el texto 100% dentro del marco) */}
            <rect x="90" y="85" width="165" height="125" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="172" y="108" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">Tanque de Biomasa</text>
            <text x="172" y="126" textAnchor="middle" fill="#94a3b8" fontSize="10.5">{formatNum(step1.tankVolume, 1)} m³ | {formatNum(step1.fishBiomass, 0)} kg</text>
            <text x="172" y="144" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Alim: {formatNum(step1.feedRateKgDay, 1)} kg/d</text>
            <text x="172" y="162" textAnchor="middle" fill="#38bdf8" fontSize="10">DO: 7.0 mg/L | TAN: 2.0 mg/L</text>
            <text x="172" y="180" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">Agua Nueva: {formatNum(step2.newWaterRequiredLday, 0)} L/d</text>

            {/* BLOQUE 2: FILTRO MECÁNICO DE SÓLIDOS */}
            <rect x="320" y="85" width="160" height="125" rx="12" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="400" y="108" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">Filtro de Sólidos</text>
            <text x="400" y="126" textAnchor="middle" fill="#94a3b8" fontSize="11">Tambor Rotatorio</text>
            <text x="400" y="146" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="600">SST: {formatNum(step4.wasteSolidsProducedKgDay, 1)} kg/d</text>
            <text x="400" y="165" textAnchor="middle" fill="#38bdf8" fontSize="10">Q: {formatNum(step4.flowRateSS_Lmin, 0)} L/min</text>
            <text x="400" y="182" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Eficiencia: 50%</text>

            {/* BLOQUE 3: BIOFILTRO NITRIFICANTE */}
            <rect x="545" y="85" width="160" height="125" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="625" y="108" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">Biofiltro Nitrificante</text>
            <text x="625" y="126" textAnchor="middle" fill="#94a3b8" fontSize="11">Volumen: {formatNum(step3.totalMediaVolumeM3, 1)} m³</text>
            <text x="625" y="146" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Carga: {formatNum(step2.tanAvailableBiofilterKgDay, 2)} kg TAN/d</text>
            <text x="625" y="165" textAnchor="middle" fill="#38bdf8" fontSize="10">Ø {formatNum(step3.biofilterDiameterM, 2)} m × {formatNum(step3.totalMediaVolumeM3 / step3.biofilterFaceAreaM2, 2)} m</text>
            <text x="625" y="182" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">Q: {formatNum(step2.flowRateTAN_Lmin, 0)} L/min</text>

            {/* BLOQUE 4: OXIGENACIÓN */}
            <rect x="770" y="85" width="145" height="125" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="842" y="108" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">Oxigenación</text>
            <text x="842" y="126" textAnchor="middle" fill="#94a3b8" fontSize="11">Cono / LHO</text>
            <text x="842" y="146" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">{formatNum(step5.totalOxygenUsedKgDay, 1)} kg O₂/d</text>
            <text x="842" y="165" textAnchor="middle" fill="#38bdf8" fontSize="10">Suministro: 14 mg/L</text>
            <text x="842" y="182" textAnchor="middle" fill="#fbbf24" fontSize="9.5">Q: {formatNum(step5.flowRateO2_Lmin, 0)} L/min</text>

            {/* ETIQUETA EN FLECHA DE AGUA NUEVA (Fuera del recuadro, encima de la flecha) */}
            <text x="60" y="136" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">+ Agua</text>

            {/* ETIQUETA PURGA EFLUENTE (Debajo del tanque) */}
            <text x="175" y="280" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">Purga Efluente (Nitratos)</text>
            <text x="175" y="293" textAnchor="middle" fill="#94a3b8" fontSize="9">{formatNum(step2.newWaterRequiredLday, 0)} L/d</text>

            {/* RETORNO GOBERNANTE (Encima de la tubería superior) */}
            <text x="500" y="36" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
              Retorno Recirculado Gobernador: {formatNum(governingFlowRate.flowRateLmin, 0)} L/min ({formatNum(governingFlowRate.flowRateM3hr, 1)} m³/hr)
            </text>
          </svg>
        </div>
      </div>

      {/* CONCLUSIONES TÉCNICAS */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-slate-100 flex items-center gap-2">
          <span className="text-amber-400">●</span> Dictamen Hidráulico del Sistema
        </h4>
        <p className="text-slate-400 leading-relaxed">
          El caudal gobernante es determinado por la variable de{' '}
          <strong className="text-amber-300">
            {governingFlowRate.governingFactor === 'O2'
              ? 'Oxígeno Disuelto (O₂)'
              : governingFlowRate.governingFactor === 'TAN'
              ? 'Nitrógeno Amoniacal Total (TAN)'
              : 'Sólidos Suspendidos Totales (SST)'}
          </strong>{' '}
          con un flujo de{' '}
          <strong className="text-sky-300">
            {formatNum(governingFlowRate.flowRateLmin, 0)} L/min ({formatNum(governingFlowRate.flowRateM3hr, 1)} m³/hr)
          </strong>.
          Esto equivale a{' '}
          <strong className="text-slate-200">
            {formatNum(governingFlowRate.turnoverPerHour, 2)} recambios por hora
          </strong>{' '}
          del estanque de cultivo (Tiempo de Retención Hidráulica HRT de{' '}
          <strong className="text-slate-200">{formatNum(governingFlowRate.hrtMinutes, 1)} minutos</strong>).
        </p>
      </div>
    </div>
  );
};
