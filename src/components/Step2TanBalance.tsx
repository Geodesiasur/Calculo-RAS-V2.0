import React from 'react';
import { RasInputs, RasStep2Outputs } from '../types/ras';
import { InputRow } from './InputRow';
import { OutputRow } from './OutputRow';

interface Step2Props {
  inputs: RasInputs;
  outputs: RasStep2Outputs;
  onChange: (updates: Partial<RasInputs>) => void;
}

export const Step2TanBalance: React.FC<Step2Props> = ({
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
              Paso 2 de 5 · Calidad de Agua
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Balance de Masa de TAN (Nitrógeno Amoniacal Total)
            </h2>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            Regla de Timmons: 0.065 kg TAN / kg proteína de alimento
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Defina la calidad del alimento y límites biológicos en{' '}
          <strong className="text-amber-300 font-semibold">amarillo</strong>. El sistema calculará
          la producción de amonio, tasa de recambio de agua para nitratos y el caudal de recirculación en{' '}
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
            <span className="text-xs text-amber-300/80 font-mono">6 Variables</span>
          </div>

          <InputRow
            label="Contenido de proteína del alimento"
            sublabel="Porcentaje de proteína cruda de la dieta"
            value={inputs.feedProteinPercent}
            unit="%"
            min={20}
            max={65}
            step={1}
            isPercentage
            onChange={(val) => onChange({ feedProteinPercent: val })}
          />

          <InputRow
            label="Concentración deseada de TAN en agua de recirculación"
            sublabel="Límite máximo tolerable de TAN en el tanque"
            value={inputs.desiredTAN}
            unit="mg/L"
            min={0.2}
            max={5.0}
            step={0.1}
            onChange={(val) => onChange({ desiredTAN: val })}
          />

          <InputRow
            label="Nitrificación pasiva"
            sublabel="Oxidación espontánea en paredes, tuberías y tanque"
            value={inputs.passiveNitrificationPercent}
            unit="%"
            min={0}
            max={30}
            step={1}
            isPercentage
            onChange={(val) => onChange({ passiveNitrificationPercent: val })}
          />

          <InputRow
            label="Desnitrificación pasiva"
            sublabel="Reducción anóxica espontánea de nitratos a N2 gaseoso"
            value={inputs.passiveDenitrificationPercent}
            unit="%"
            min={0}
            max={20}
            step={1}
            isPercentage
            onChange={(val) => onChange({ passiveDenitrificationPercent: val })}
          />

          <InputRow
            label="Concentración máxima de Nitrógeno de Nitrato deseada"
            sublabel="Límite de NO3-N que define el caudal de agua de reemplazo"
            value={inputs.maxNitrateN}
            unit="mg/L"
            min={20}
            max={300}
            step={5}
            onChange={(val) => onChange({ maxNitrateN: val })}
          />

          <InputRow
            label="Eficiencia del biofiltro para remoción de TAN"
            sublabel="Tasa de remoción de TAN por paso por el biofiltro"
            value={inputs.biofilterEfficiencyPercent}
            unit="%"
            min={20}
            max={90}
            step={5}
            isPercentage
            onChange={(val) => onChange({ biofilterEfficiencyPercent: val })}
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
            <span className="text-xs text-sky-300/80 font-mono">Balance TAN</span>
          </div>

          <OutputRow
            label="Tasa de producción de TAN"
            sublabel="Amonio total generado diariamente por excreción y branquias"
            value={outputs.tanProductionKgDay}
            unit="kg/día"
            decimals={2}
            formula="= 0.065 * Tasa Alimento * % Proteína"
            isPrimary
          />

          <OutputRow
            label="% TAN respecto al alimento consumido"
            sublabel="Rendimiento de conversión de alimento a nitrógeno amoniacal"
            value={outputs.tanFromFeedPercent}
            unit="%"
            decimals={2}
            formula="= Tasa TAN / Tasa Alimento"
          />

          <OutputRow
            label="TAN disponible tras nitrificación pasiva"
            sublabel="Amonio remanente que sale del estanque hacia el tratamiento"
            value={outputs.tanAfterPassiveKgDay}
            unit="kg/día"
            decimals={3}
            formula="= Tasa TAN * (1 - Nitrificación Pasiva)"
          />

          <OutputRow
            label="Agua nueva requerida (Control de Nitratos)"
            sublabel="Recambio de agua fresca para no superar límite de nitratos"
            value={outputs.newWaterRequiredLday}
            unit="L/día"
            decimals={0}
            formula="= ((TAN Pasivo * 1,000,000 * (1 - Desnitr.)) / Max Nitrato)"
            isPrimary
          />

          <OutputRow
            label="TAN disponible para el biofiltro tras purga de efluente"
            sublabel="Carga neta de nitrógeno que debe procesar el lecho biológico"
            value={outputs.tanAvailableBiofilterKgDay}
            unit="kg/día"
            decimals={3}
            formula="= TAN Pasivo - (TAN Deseado / 1,000,000) * Agua Nueva"
          />

          {/* CAUDAL DE DISEÑO POR TAN */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-400/40 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Caudal Requerido para Remoción de TAN
              </span>
              <span className="text-xs font-mono text-sky-400">
                = TAN Biofiltro / (Eficiencia * Conc. TAN)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20">
                <span className="text-[11px] text-slate-400 block">Caudal L/min</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateTAN_Lmin.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">L/min</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20">
                <span className="text-[11px] text-slate-400 block">Caudal L/hr</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateTAN_Lhr.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">L/hr</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/20 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block">Caudal Galones/min</span>
                <span className="text-xl font-mono font-bold text-sky-300 tabular-nums">
                  {outputs.flowRateTAN_gpm.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-sky-400/80 block mt-0.5">GPM</span>
              </div>
            </div>

            <div className="text-xs text-sky-200/90 font-mono pt-1">
              Caudal Diario Total: {outputs.flowRateTAN_Lday.toLocaleString('es-CL', { maximumFractionDigits: 0 })} L/día ({outputs.flowRateTAN_M3hr.toFixed(1)} m³/hr)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
