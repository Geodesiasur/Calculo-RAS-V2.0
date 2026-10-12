import React from 'react';
import { RasInputs, RasStep1Outputs } from '../types/ras';
import { InputRow } from './InputRow';
import { OutputRow } from './OutputRow';

interface Step1Props {
  inputs: RasInputs;
  outputs: RasStep1Outputs;
  onChange: (updates: Partial<RasInputs>) => void;
}

export const Step1TankBiomass: React.FC<Step1Props> = ({
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
              Paso 1 de 5 · Dimensionamiento
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Tamaño del Tanque y Biomasa de Salmones
            </h2>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            Geometría cilíndrica de tanque circular con fondo plano/cónico
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Ingrese los parámetros geométricos del estanque y de la población en{' '}
          <strong className="text-amber-300 font-semibold">amarillo</strong> para calcular
          automáticamente el volumen, biomasa total, peso individual y ración diaria de alimento en{' '}
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
            <span className="text-xs text-amber-300/80 font-mono">5 Variables</span>
          </div>

          <InputRow
            label="Profundidad de agua del estanque (h)"
            sublabel="Altura efectiva de la columna de agua"
            value={inputs.tankDepth}
            unit="m"
            min={0.5}
            max={6.0}
            step={0.05}
            onChange={(val) => onChange({ tankDepth: val })}
          />

          <InputRow
            label="Radio del estanque (r)"
            sublabel={`Diámetro resultante: ${(inputs.tankRadius * 2).toFixed(2)} m`}
            value={inputs.tankRadius}
            unit="m"
            min={1.0}
            max={15.0}
            step={0.05}
            onChange={(val) => onChange({ tankRadius: val })}
          />

          <InputRow
            label="Densidad máxima de cultivo"
            sublabel="Densidad objetivo de peces por metro cúbico"
            value={inputs.maxDensity}
            unit="kg/m³"
            min={10}
            max={120}
            step={1}
            onChange={(val) => onChange({ maxDensity: val })}
          />

          <InputRow
            label="Número de peces (Población)"
            sublabel="Cantidad de ejemplares en el estanque"
            value={inputs.fishCount}
            unit="peces"
            min={500}
            max={100000}
            step={500}
            onChange={(val) => onChange({ fishCount: Math.round(val) })}
          />

          <InputRow
            label="Tasa de alimentación (% peso corporal)"
            sublabel="Porcentaje de la biomasa total alimentada al día"
            value={inputs.feedRatePercent}
            unit="%"
            min={0.2}
            max={5.0}
            step={0.1}
            isPercentage
            onChange={(val) => onChange({ feedRatePercent: val })}
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
            <span className="text-xs text-sky-300/80 font-mono">Instantáneo</span>
          </div>

          <OutputRow
            label="Volumen del estanque"
            sublabel="Capacidad neta de agua del tanque de cultivo"
            value={outputs.tankVolume}
            unit="m³"
            decimals={2}
            formula="= Profundidad * (π * Radio²)"
            isPrimary
          />

          <OutputRow
            label="Biomasa total de peces"
            sublabel="Masa viva total soportada en el estanque"
            value={outputs.fishBiomass}
            unit="kg"
            decimals={1}
            formula="= Volumen * Densidad de Cultivo"
            isPrimary
          />

          <OutputRow
            label="Peso promedio individual del pez"
            sublabel="Gramaje representativo de cada ejemplar"
            value={outputs.fishWeight}
            unit="gramos"
            decimals={1}
            formula="= 1000 * Biomasa / Número de Peces"
          />

          <OutputRow
            label="Tasa de alimentación diaria (Ración)"
            sublabel="Alimento seco suministrado cada 24 horas"
            value={outputs.feedRateKgDay}
            unit="kg/día"
            decimals={2}
            formula="= Biomasa * (Tasa Alimentación % / 100)"
            isPrimary
          />

          {/* Resumen visual de sección */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Relación geométrica y volumétrica:</span>
              <span className="font-mono text-sky-400">
                {(outputs.tankVolume * 1000).toLocaleString('es-CL')} Litros
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              El volumen cilíndrico de {outputs.tankVolume.toFixed(1)} m³ permite alojar{' '}
              {inputs.fishCount.toLocaleString('es-CL')} salmones de aproximadamente{' '}
              {outputs.fishWeight.toFixed(0)} g cada uno a una densidad de {inputs.maxDensity} kg/m³.
              Esta ración de {outputs.feedRateKgDay.toFixed(1)} kg/día de alimento balanceado alimentará los siguientes balances de masa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
