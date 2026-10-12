import React, { useState } from 'react';
import { RasInputs, RasOverallOutputs } from '../types/ras';
import { formatNum } from '../utils/rasCalculations';
import { generatePdfReport } from '../utils/generatePdfReport';
import { Download, Printer, Copy, Check, X, ShieldAlert } from 'lucide-react';

interface SummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: RasInputs;
  outputs: RasOverallOutputs;
}

export const SummaryReportModal: React.FC<SummaryReportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  outputs,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const { step1, step2, step3, step4, step5, governingFlowRate, dailyWaterRenewalPercent } = outputs;

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      generatePdfReport(inputs, outputs);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const reportText = `
============================================================
CÁLCULO RAS — REPORTE TÉCNICO DE DIMENSIONAMIENTO
Ing. en Acuicultura José Ernesto Muñoz Núñez
WhatsApp: +56 9 8299 7625
Fecha: ${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL')}
============================================================

DICTAMEN HIDRÁULICO GOBERNANTE:
- Caudal de diseño del sistema: ${formatNum(governingFlowRate.flowRateLmin, 0)} L/min (${formatNum(governingFlowRate.flowRateM3hr, 1)} m³/h | ${formatNum(governingFlowRate.flowRateGpm, 0)} GPM)
- Factor gobernante limitante: ${governingFlowRate.governingFactor === 'O2' ? 'Oxígeno Disuelto (O₂)' : governingFlowRate.governingFactor === 'TAN' ? 'Nitrógeno Amoniacal Total (TAN)' : 'Sólidos Suspendidos Totales (SST)'}
- Tasa de recambio en estanque: ${formatNum(governingFlowRate.turnoverPerHour, 2)} recambios/hora (HRT: ${formatNum(governingFlowRate.hrtMinutes, 1)} min)
- Agua nueva de reemplazo (Control Nitratos): ${formatNum(step2.newWaterRequiredLday, 0)} L/día (${dailyWaterRenewalPercent.toFixed(1)}% del estanque/día)

1. PASO 1: DIMENSIONAMIENTO DE TANQUE Y BIOMASA DE SALMONES
- Profundidad de agua (h): ${inputs.tankDepth} m
- Radio del tanque (r): ${inputs.tankRadius} m (Diámetro: ${(inputs.tankRadius * 2).toFixed(2)} m)
- Volumen de agua neto: ${formatNum(step1.tankVolume, 2)} m³
- Densidad de cultivo: ${inputs.maxDensity} kg/m³
- Población: ${inputs.fishCount.toLocaleString('es-CL')} peces
- Biomasa total: ${formatNum(step1.fishBiomass, 1)} kg
- Peso promedio por pez: ${formatNum(step1.fishWeight, 1)} g
- Tasa de alimentación (${inputs.feedRatePercent}% biomasa): ${formatNum(step1.feedRateKgDay, 2)} kg/día

2. PASO 2: BALANCE DE NITROGENO AMONIACAL TOTAL (TAN)
- Proteína del alimento: ${inputs.feedProteinPercent}%
- Producción de TAN: ${formatNum(step2.tanProductionKgDay, 2)} kg/día (${formatNum(step2.tanFromFeedPercent, 2)}% del alimento)
- TAN tras nitrificación pasiva (${inputs.passiveNitrificationPercent}%): ${formatNum(step2.tanAfterPassiveKgDay, 3)} kg/día
- Límite máximo de nitrato NO3-N: ${inputs.maxNitrateN} mg/L
- Agua nueva requerida: ${formatNum(step2.newWaterRequiredLday, 0)} L/día
- Carga neta de TAN al biofiltro: ${formatNum(step2.tanAvailableBiofilterKgDay, 3)} kg/día
- Caudal de recirculación por TAN: ${formatNum(step2.flowRateTAN_Lmin, 0)} L/min (${formatNum(step2.flowRateTAN_M3hr, 1)} m³/h)

3. PASO 3: DIMENSIONAMIENTO FÍSICO DEL BIOFILTRO
- Tasa nitrificación biológica biofilm: ${inputs.nitrificationRate} g TAN/m²/día
- Superficie activa requerida: ${formatNum(step3.activeSurfaceRequiredM2, 0)} m²
- Superficie específica medio (SSA): ${inputs.mediaSpecificArea} m²/m³
- Volumen total de medio soporte: ${formatNum(step3.totalMediaVolumeM3, 2)} m³
- Inversión en medio ($${inputs.mediaUnitPrice}/m³): $${formatNum(step3.mediaCostUSD, 2)} USD
- Profundidad de lecho (H): ${inputs.mediaDepth} m
- Área transversal de fondo: ${formatNum(step3.biofilterFaceAreaM2, 2)} m²
- Diámetro del reactor: ${formatNum(step3.biofilterDiameterM, 2)} m

4. PASO 4: BALANCE DE SÓLIDOS SUSPENDIDOS TOTALES (SST)
- Tasa de heces/sólidos (${inputs.feedToSolidsPercent}% alim.): ${formatNum(step4.wasteSolidsProducedKgDay, 2)} kg/día
- Remoción en trampa gravitacional (${inputs.particleTrapPercent}%): ${formatNum(step4.wasteSolidsProducedKgDay - step4.solidsAfterParticleTrapKgDay, 2)} kg/día
- Sólidos retenidos en filtro mecánico: ${formatNum(step4.solidsRemainingEffluentKgDay, 2)} kg/día
- Concentración deseada SST: ${inputs.desiredSS} mg/L
- Caudal de recirculación por SST: ${formatNum(step4.flowRateSS_Lmin, 0)} L/min (${formatNum(step4.flowRateSS_M3hr, 1)} m³/h)

5. PASO 5: BALANCE DE OXÍGENO DISUELTO (O₂)
- Filtro biológico: ${inputs.submergedFilter ? 'Sumergido (consume O₂ del agua)' : 'Percolador (toma O₂ del aire)'}
- Consumo por alimentación (${inputs.oxygenPerFeedPercent}%): ${formatNum(step5.oxygenUsedFeedKgDay, 2)} kg/día
- Consumo nitrificación pasiva: ${formatNum(step5.oxygenPassiveNitrKgDay, 2)} kg/día
- Consumo nitrificación biofiltro: ${formatNum(step5.oxygenBiofilterNitrKgDay, 2)} kg/día
- Demanda total de O₂ del sistema: ${formatNum(step5.totalOxygenUsedKgDay, 2)} kg/día
- Oxígeno suministro: ${inputs.suppliedO2} mg/L | Oxígeno tanque: ${inputs.desiredTankO2} mg/L
- Caudal de recirculación por O₂: ${formatNum(step5.flowRateO2_Lmin, 0)} L/min (${formatNum(step5.flowRateO2_M3hr, 1)} m³/h)

Aviso legal: Los cálculos presentados en este documento son únicamente de carácter técnicos y se basan en los datos proporcionados por el usuario a la fecha de su ejecución. Este resultado no constituye una asesoría vinculante. El emisor no se hace responsable por errores, omisiones o decisiones tomadas con base en esta información. Se recomienda verificar
`;

    navigator.clipboard.writeText(reportText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const legalNotice =
    'Aviso legal: Los cálculos presentados en este documento son únicamente de carácter técnicos y se basan en los datos proporcionados por el usuario a la fecha de su ejecución. Este resultado no constituye una asesoría vinculante. El emisor no se hace responsable por errores, omisiones o decisiones tomadas con base en esta información. Se recomienda verificar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header con Logo, Nombre de la App y Nombre del Ingeniero */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 border-2 border-sky-400/50 shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/logo.png"
                alt="Logo Calculo RAS - Ing. José Ernesto Muñoz Núñez"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  Calculo RAS — Reporte Técnico Oficial
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Ing. en Acuicultura José Ernesto Muñoz Núñez ·{' '}
                <a
                  href="https://wa.me/56982997625"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline font-mono"
                >
                  WhatsApp: +56 9 8299 7625
                </a>
              </p>
            </div>
          </div>

          {/* Action buttons: PDF Download, Print, Copy */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-xs font-bold text-slate-950 transition-all shadow-md shadow-sky-950/50 cursor-pointer disabled:opacity-50"
              title="Descargar reporte en formato PDF"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Imprimir reporte"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Copiar texto al portapapeles"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Tarjeta de Resumen Dictamen Hidráulico Gobernador */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/10 border-2 border-sky-400/50 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider">
                Dictamen Hidráulico Gobernador del Sistema
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white mt-1 tabular-nums">
                {formatNum(governingFlowRate.flowRateLmin, 0)}{' '}
                <span className="text-base sm:text-lg font-sans text-sky-300">L/min</span>{' '}
                <span className="text-sm sm:text-base font-mono text-slate-400">
                  ({formatNum(governingFlowRate.flowRateM3hr, 1)} m³/h · {formatNum(governingFlowRate.flowRateGpm, 0)} GPM)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Factor Limitante Gobernador:{' '}
                <strong className="text-sky-300">
                  {governingFlowRate.governingFactor === 'O2'
                    ? 'Oxígeno Disuelto (O₂)'
                    : governingFlowRate.governingFactor === 'TAN'
                    ? 'Nitrógeno Amoniacal Total (TAN)'
                    : 'Sólidos Suspendidos Totales (SST)'}
                </strong>{' '}
                · Tasa de recambio en estanque: <strong>{formatNum(governingFlowRate.turnoverPerHour, 2)} rev/h</strong> (HRT: {formatNum(governingFlowRate.hrtMinutes, 1)} min)
              </p>
            </div>
            <div className="sm:text-right sm:border-l sm:border-sky-500/30 sm:pl-5 shrink-0">
              <span className="text-xs text-slate-400 block font-medium">Agua de Reemplazo Fresca</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">
                {formatNum(step2.newWaterRequiredLday, 0)} L/día
              </span>
              <span className="text-xs text-slate-300 block mt-0.5">
                {dailyWaterRenewalPercent.toFixed(1)}% del estanque/día
              </span>
            </div>
          </div>

          {/* Grid de los 5 Pasos Técnicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Paso 1 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Paso 1: Tanque y Biomasa de Salmones
              </h4>
              <ul className="text-xs space-y-1.5 font-mono text-slate-300">
                <li>• Volumen neto tanque: <strong className="text-sky-300">{formatNum(step1.tankVolume, 2)} m³</strong></li>
                <li>• Biomasa total soportada: <strong className="text-sky-300">{formatNum(step1.fishBiomass, 0)} kg</strong></li>
                <li>• Densidad de cultivo: <strong className="text-slate-200">{inputs.maxDensity} kg/m³</strong></li>
                <li>• Población de peces: <strong className="text-slate-200">{inputs.fishCount.toLocaleString('es-CL')}</strong> ({formatNum(step1.fishWeight, 1)} g/pez)</li>
                <li>• Ración diaria alimento: <strong className="text-sky-300">{formatNum(step1.feedRateKgDay, 2)} kg/día</strong></li>
              </ul>
            </div>

            {/* Paso 2 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Paso 2: Balance de Masa de TAN
              </h4>
              <ul className="text-xs space-y-1.5 font-mono text-slate-300">
                <li>• Producción diaria TAN: <strong className="text-sky-300">{formatNum(step2.tanProductionKgDay, 2)} kg/d</strong> ({formatNum(step2.tanFromFeedPercent, 2)}% alim)</li>
                <li>• TAN tras nitr. pasiva: <strong className="text-sky-300">{formatNum(step2.tanAfterPassiveKgDay, 3)} kg/d</strong></li>
                <li>• Carga neta a biofiltro: <strong className="text-sky-300">{formatNum(step2.tanAvailableBiofilterKgDay, 3)} kg/d</strong></li>
                <li>• Caudal requerido por TAN: <strong className="text-sky-300">{formatNum(step2.flowRateTAN_Lmin, 0)} L/min</strong> ({formatNum(step2.flowRateTAN_M3hr, 1)} m³/h)</li>
              </ul>
            </div>

            {/* Paso 3 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Paso 3: Dimensionamiento Físico del Biofiltro
              </h4>
              <ul className="text-xs space-y-1.5 font-mono text-slate-300">
                <li>• Superficie activa de biofilm: <strong className="text-sky-300">{formatNum(step3.activeSurfaceRequiredM2, 0)} m²</strong></li>
                <li>• Volumen total de biomedia: <strong className="text-sky-300">{formatNum(step3.totalMediaVolumeM3, 2)} m³</strong></li>
                <li>• Inversión en medio: <strong className="text-emerald-400">${formatNum(step3.mediaCostUSD, 2)} USD</strong></li>
                <li>• Diámetro reactor circular: <strong className="text-sky-300">{formatNum(step3.biofilterDiameterM, 2)} m</strong> (H={inputs.mediaDepth} m)</li>
              </ul>
            </div>

            {/* Paso 4 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Paso 4: Balance de Sólidos Suspendidos (SST)
              </h4>
              <ul className="text-xs space-y-1.5 font-mono text-slate-300">
                <li>• Sólidos residuales generados: <strong className="text-sky-300">{formatNum(step4.wasteSolidsProducedKgDay, 2)} kg/d</strong></li>
                <li>• Sólidos a retener por filtro: <strong className="text-sky-300">{formatNum(step4.solidsRemainingEffluentKgDay, 2)} kg/d</strong></li>
                <li>• Concentración objetivo SST: <strong className="text-slate-200">{inputs.desiredSS} mg/L</strong></li>
                <li>• Caudal por sólidos SST: <strong className="text-sky-300">{formatNum(step4.flowRateSS_Lmin, 0)} L/min</strong> ({formatNum(step4.flowRateSS_M3hr, 1)} m³/h)</li>
              </ul>
            </div>

            {/* Paso 5 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 md:col-span-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Paso 5: Balance de Oxígeno Disuelto (O₂)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                <ul className="space-y-1.5">
                  <li>• O₂ respiración peces: <strong className="text-sky-300">{formatNum(step5.oxygenUsedFeedKgDay, 2)} kg/d</strong></li>
                  <li>• O₂ nitrificación biofiltro: <strong className="text-sky-300">{formatNum(step5.oxygenBiofilterNitrKgDay, 2)} kg/d</strong></li>
                  <li>• Demanda bioquímica total O₂: <strong className="text-sky-300">{formatNum(step5.totalOxygenUsedKgDay, 2)} kg/d</strong></li>
                </ul>
                <ul className="space-y-1.5">
                  <li>• O₂ suministro / estanque: <strong className="text-slate-200">{inputs.suppliedO2} / {inputs.desiredTankO2} mg/L</strong></li>
                  <li>• Caudal recirculación por O₂: <strong className="text-sky-300">{formatNum(step5.flowRateO2_Lmin, 0)} L/min</strong> ({formatNum(step5.flowRateO2_M3hr, 1)} m³/h)</li>
                  <li>• Caudal en GPM: <strong className="text-sky-300">{formatNum(step5.flowRateO2_gpm, 0)} gpm</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Aviso Legal Obligatorio a Pie del Reporte */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed italic">
              {legalNotice}
            </p>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>Calculo RAS · Ing. en Acuicultura José Ernesto Muñoz Núñez</span>
            <span className="text-slate-600">|</span>
            <a
              href="https://wa.me/56982997625"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300"
            >
              WhatsApp +56 9 8299 7625
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
