import React from 'react';
import { RasInputs, RasStep3Outputs } from '../types/ras';
import { InputRow } from './InputRow';
import { OutputRow } from './OutputRow';

interface Step3Props {
  inputs: RasInputs;
  outputs: RasStep3Outputs;
  onChange: (updates: Partial<RasInputs>) => void;
}

export const Step3Biofilter: React.FC<Step3Props> = ({
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
              Paso 3 de 5 · Dimensionamiento Biológico
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Dimensionamiento Físico del Biofiltro Nitrificante
            </h2>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            Cálculo de volumen de medio, costos y geometría del reactor
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Ingrese la cinética de nitrificación y especificaciones del sustrato plástico/biológico en{' '}
          <strong className="text-amber-300 font-semibold">amarillo</strong>. Se calculará
          el área superficial necesaria, volumen de empaque, costo de inversión y diámetro del tanque en{' '}
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
            label="Tasa estimada de nitrificación del biofilm"
            sublabel="Rendimiento biológico por metro cuadrado de soporte"
            value={inputs.nitrificationRate}
            unit="g TAN/m²/día"
            min={0.1}
            max={1.5}
            step={0.05}
            onChange={(val) => onChange({ nitrificationRate: val })}
          />

          <InputRow
            label="Superficie específica del medio soporte (SSA)"
            sublabel="Área superficial activa por metro cúbico de medio (ej. MBBR Kaldnes K1/K3, microburbujas, etc.)"
            value={inputs.mediaSpecificArea}
            unit="m²/m³"
            min={100}
            max={1200}
            step={10}
            onChange={(val) => onChange({ mediaSpecificArea: val })}
          />

          <InputRow
            label="Precio unitario del medio biológico"
            sublabel="Costo de adquisición por m³ de sustrato plástico"
            value={inputs.mediaUnitPrice}
            unit="USD/m³"
            min={50}
            max={800}
            step={10}
            onChange={(val) => onChange({ mediaUnitPrice: val })}
          />

          <InputRow
            label="Profundidad / Altura del lecho del medio (H)"
            sublabel="Altura del lecho empaquetado o lecho móvil en el reactor"
            value={inputs.mediaDepth}
            unit="m"
            min={0.5}
            max={4.0}
            step={0.05}
            onChange={(val) => onChange({ mediaDepth: val })}
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
            <span className="text-xs text-sky-300/80 font-mono">Dimensionamiento</span>
          </div>

          <OutputRow
            label="Superficie activa de nitrificación requerida"
            sublabel="Área total de biopelícula necesaria para oxidar la carga de TAN"
            value={outputs.activeSurfaceRequiredM2}
            unit="m²"
            decimals={0}
            formula="= TAN Biofiltro / (Tasa Nitrificación / 1000)"
            isPrimary
          />

          <OutputRow
            label="Volumen total de medio biológico"
            sublabel="Volumen neto de sustrato que se debe adquirir"
            value={outputs.totalMediaVolumeM3}
            unit="m³"
            decimals={2}
            formula="= Superficie Requerida / Superficie Específica"
            isPrimary
          />

          <OutputRow
            label="Costo total de inversión en medio biológico"
            sublabel="Presupuesto estimado de adquisición de biomedia"
            value={outputs.mediaCostUSD}
            unit="USD"
            decimals={2}
            formula="= Precio Unitario * Volumen Medio"
            isPrimary
          />

          <OutputRow
            label="Área transversal o basal del biofiltro"
            sublabel="Área de huella en planta del tanque del biofiltro"
            value={outputs.biofilterFaceAreaM2}
            unit="m²"
            decimals={2}
            formula="= Volumen Medio / Profundidad"
          />

          <OutputRow
            label="Diámetro del biofiltro circular"
            sublabel="Diámetro interno para reactor cilíndrico"
            value={outputs.biofilterDiameterM}
            unit="m"
            decimals={2}
            formula="= 2 * √ (Área Basal / π)"
            isPrimary
          />

          {/* Tarjeta de Ingeniería Técnica */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-slate-200 font-semibold">
              <span>Especificación del Tanque Biofiltro:</span>
              <span className="font-mono text-sky-400">
                Ø {outputs.biofilterDiameterM.toFixed(2)} m × {inputs.mediaDepth.toFixed(2)} m H
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Para albergar los {outputs.totalMediaVolumeM3.toFixed(1)} m³ de material soporte se
              requiere un reactor circular con {outputs.biofilterFaceAreaM2.toFixed(1)} m² de área
              de sección horizontal ({outputs.biofilterDiameterM.toFixed(2)} m de diámetro). Si se
              diseña como lecho móvil (MBBR) con factor de llenado del 50-60%, el volumen hidráulico
              total del tanque biofiltro será de aproximadamente {(outputs.totalMediaVolumeM3 / 0.55).toFixed(1)} m³.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
