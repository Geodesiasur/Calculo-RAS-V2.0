import React from 'react';
import { RasInputs, RasStep5Outputs } from '../types/ras';
import { InputRow } from './InputRow';
import { OutputRow } from './OutputRow';

interface Step5Props {
  inputs: RasInputs;
  outputs: RasStep5Outputs;
  onChange: (updates: Partial<RasInputs>) => void;
}

export const Step5OxygenBalance: React.FC<Step5Props> = ({
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
              Paso 5 de 5 · Oxigenación
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Balance de Masa de Oxígeno Disuelto (O₂)
            </h2>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            Estequiometría: 4.57 kg O₂ / kg TAN nitrificado + Respiración de peces
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Defina el tipo de biofiltro y concentraciones de O₂ en{' '}
          <strong className="text-amber-300 font-semibold">amarillo</strong>. Se calculará
          el consumo total de oxígeno (peces + biofiltro) y el caudal hidráulico necesario para abastecerlo en{' '}
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

          {/* Selector de Filtro Sumergido (1=Sí, 0=No) */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-400/30 hover:border-amber-400/60 transition-colors">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <label className="text-sm font-semibold text-amber-200">
                    ¿Filtro biológico sumergido?
                  </label>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 pl-4">
                  1 = Sí (MBBR sumergido, consume O₂ del agua) / 0 = No (Percolador, toma O₂ del aire)
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-amber-400/40">
                <button
                  type="button"
                  onClick={() => onChange({ submergedFilter: true })}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                    inputs.submergedFilter
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-amber-300 hover:text-white'
                  }`}
                >
                  1 = Sí (Sumergido)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ submergedFilter: false })}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                    !inputs.submergedFilter
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-amber-300 hover:text-white'
                  }`}
                >
                  0 = No (Percolador)
                </button>
              </div>
            </div>
          </div>

          <InputRow
            label="Oxígeno consumido por kg de alimento (Cociente O₂/Alimento)"
            sublabel="Metabolismo basal y tasa metabólica de natación (típico 0.25 - 0.40)"
            value={inputs.oxygenPerFeedPercent}
            unit="% (kg O₂/kg Alim)"
            min={15}
            max={50}
            step={1}
            isPercentage
            onChange={(val) => onChange({ oxygenPerFeedPercent: val })}
          />

          <InputRow
            label="Concentración deseada de O₂ en el estanque"
            sublabel="Nivel mínimo de oxígeno disuelto objetivo en el agua de cultivo"
            value={inputs.desiredTankO2}
            unit="mg/L"
            min={5.0}
            max={10.0}
            step={0.1}
            onChange={(val) => onChange({ desiredTankO2: val })}
          />

          <InputRow
            label="Concentración de O₂ disuelto suministrado al estanque"
            sublabel="Oxígeno en el afluente oxigenado (conos de oxigenación, LHO, etc.)"
            value={inputs.suppliedO2}
            unit="mg/L"
            min={9.0}
            max={25.0}
            step={0.5}
            onChange={(val) => onChange({ suppliedO2: val })}
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
            <span className="text-xs text-sky-300/80 font-mono">Demanda & Caudal</span>
          </div>

          <OutputRow
            label="Oxígeno consumido por alimentación de peces"
            sublabel="Respiración y metabolismo inducido por ingesta de salmones"
            value={outputs.oxygenUsedFeedKgDay}
            unit="kg/día"
            decimals={2}
            formula="= Tasa Alimento * % O2 Alimento"
          />

          <OutputRow
            label="Oxígeno consumido por nitrificación pasiva"
            sublabel="Oxidación biológica periférica: 4.57 kg O₂ por kg TAN nitrificado"
            value={outputs.oxygenPassiveNitrKgDay}
            unit="kg/día"
            decimals={2}
            formula="= (TAN Total - TAN Pasivo) * 4.57"
          />

          <OutputRow
            label="Oxígeno consumido por nitrificación en biofiltro"
            sublabel={
              inputs.submergedFilter
                ? 'El biofiltro sumergido consume O₂ del flujo recirculado'
                : 'Filtro no sumergido (toma O₂ del aire ambiental)'
            }
            value={outputs.oxygenBiofilterNitrKgDay}
            unit="kg/día"
            decimals={2}
            formula="= Filtro Sumergido * TAN Biofiltro * 4.57"
          />

          <OutputRow
            label="Oxígeno total consumido por el sistema RAS"
            sublabel="Demanda bioquímica total de oxígeno que debe suministrarse cada 24 hrs"
            value={outputs.totalOxygenUsedKgDay}
            unit="kg/día"
            decimals={2}
            formula="= O₂ Peces + O₂ Nitr. Pasiva + O₂ Biofiltro"
            isPrimary
          />

          {/* CAUDAL DE DISEÑO POR OXÍGENO */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-400/40 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Caudal Requerido por Suministro de O₂
              </span>
              <span className="text-xs font-mono text-sky-400">
                = O₂ Total / ((O₂ Suministrado - O₂ Estanque) / 10⁶)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20">
                <span className="text-[11px] text-slate-400 block">Caudal L/min</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateO2_Lmin.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">L/min</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20">
                <span className="text-[11px] text-slate-400 block">Caudal L/hr</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateO2_Lhr.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">L/hr</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block">Caudal Galones/min</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateO2_gpm.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">GPM</span>
              </div>
            </div>

            <div className="text-xs text-sky-200/90 font-mono pt-1">
              Caudal Diario Total: {outputs.flowRateO2_Lday.toLocaleString('es-CL', { maximumFractionDigits: 0 })} L/día ({outputs.flowRateO2_M3hr.toFixed(1)} m³/hr)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
