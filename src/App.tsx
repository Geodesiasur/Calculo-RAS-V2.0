import React, { useState, useMemo } from 'react';
import { RasInputs } from './types/ras';
import {
  INITIAL_RAS_INPUTS,
  calculateFullRas,
} from './utils/rasCalculations';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { KeyMetricsBanner } from './components/KeyMetricsBanner';
import { Step1TankBiomass } from './components/Step1TankBiomass';
import { Step2TanBalance } from './components/Step2TanBalance';
import { Step3Biofilter } from './components/Step3Biofilter';
import { Step4SolidsBalance } from './components/Step4SolidsBalance';
import { Step5OxygenBalance } from './components/Step5OxygenBalance';
import { RasFlowDiagram } from './components/RasFlowDiagram';
import { SummaryReportModal } from './components/SummaryReportModal';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [inputs, setInputs] = useState<RasInputs>(INITIAL_RAS_INPUTS);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isCascadeView, setIsCascadeView] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Recálculo automático e instantáneo de toda la cascada matemática RAS
  const outputs = useMemo(() => calculateFullRas(inputs), [inputs]);

  const handleInputChange = (updates: Partial<RasInputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setInputs(INITIAL_RAS_INPUTS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Header con Contrato Top Bar */}
      <Navbar
        activeStep={activeStep}
        onSelectStep={setActiveStep}
        onOpenReport={() => setIsReportOpen(true)}
        isCascadeView={isCascadeView}
        onToggleCascadeView={setIsCascadeView}
      />

      {/* 2. Barra de Herramientas: Presets, Leyenda y Vista */}
      <Toolbar
        onSelectPreset={setInputs}
        onResetToDefault={handleReset}
        isCascadeView={isCascadeView}
        onToggleCascadeView={setIsCascadeView}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />

      {/* 3. Cinta de Telemetría Global de Métricas Clave */}
      <KeyMetricsBanner inputs={inputs} outputs={outputs} />

      {/* 4. Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCascadeView ? (
          /* MODO HOJA COMPLETA EN CASCADA (TODOS LOS 5 PASOS + DIAGRAMA) */
          <div className="space-y-12">
            <section id="step-1" className="scroll-mt-24">
              <Step1TankBiomass
                inputs={inputs}
                outputs={outputs.step1}
                onChange={handleInputChange}
              />
            </section>

            <section id="step-2" className="scroll-mt-24 pt-6 border-t border-slate-800">
              <Step2TanBalance
                inputs={inputs}
                outputs={outputs.step2}
                onChange={handleInputChange}
              />
            </section>

            <section id="step-3" className="scroll-mt-24 pt-6 border-t border-slate-800">
              <Step3Biofilter
                inputs={inputs}
                outputs={outputs.step3}
                onChange={handleInputChange}
              />
            </section>

            <section id="step-4" className="scroll-mt-24 pt-6 border-t border-slate-800">
              <Step4SolidsBalance
                inputs={inputs}
                outputs={outputs.step4}
                onChange={handleInputChange}
              />
            </section>

            <section id="step-5" className="scroll-mt-24 pt-6 border-t border-slate-800">
              <Step5OxygenBalance
                inputs={inputs}
                outputs={outputs.step5}
                onChange={handleInputChange}
              />
            </section>

            <section id="flow-diagram" className="scroll-mt-24 pt-6 border-t border-slate-800">
              <RasFlowDiagram outputs={outputs} />
            </section>
          </div>
        ) : (
          /* MODO PASO A PASO GUIADO */
          <div className="space-y-8">
            {activeStep === 1 && (
              <Step1TankBiomass
                inputs={inputs}
                outputs={outputs.step1}
                onChange={handleInputChange}
              />
            )}

            {activeStep === 2 && (
              <Step2TanBalance
                inputs={inputs}
                outputs={outputs.step2}
                onChange={handleInputChange}
              />
            )}

            {activeStep === 3 && (
              <Step3Biofilter
                inputs={inputs}
                outputs={outputs.step3}
                onChange={handleInputChange}
              />
            )}

            {activeStep === 4 && (
              <Step4SolidsBalance
                inputs={inputs}
                outputs={outputs.step4}
                onChange={handleInputChange}
              />
            )}

            {activeStep === 5 && (
              <Step5OxygenBalance
                inputs={inputs}
                outputs={outputs.step5}
                onChange={handleInputChange}
              />
            )}

            {activeStep === 6 && (
              <RasFlowDiagram outputs={outputs} />
            )}

            {/* Navegación entre pasos */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeStep === 1
                    ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-900'
                    : 'text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Paso {activeStep} de 6</span>
              </div>

              {activeStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(prev + 1, 6))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-sm shadow-sky-950/40"
                >
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ver Reporte Final</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 5. Footer con información de autoría técnica y aviso legal */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo Calculo RAS"
                className="w-9 h-9 object-contain rounded-lg border border-sky-400/30 bg-slate-900"
              />
              <div className="flex flex-col">
                <span className="font-bold text-slate-200 text-sm">Calculo RAS (V2.0)</span>
                <span className="text-slate-400 text-xs">
                  Ing. en Acuicultura José Ernesto Muñoz Núñez
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <a
                href="https://wa.me/56982997625"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <span>WhatsApp: +56 9 8299 7625</span>
              </a>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                Descargar Reporte PDF
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-900 text-[11px] text-slate-500 italic leading-relaxed text-center sm:text-left">
            Aviso legal: Los cálculos presentados en este documento son únicamente de carácter técnicos y se basan en los datos proporcionados por el usuario a la fecha de su ejecución. Este resultado no constituye una asesoría vinculante. El emisor no se hace responsable por errores, omisiones o decisiones tomadas con base en esta información. Se recomienda verificar
          </div>
        </div>
      </footer>

      {/* 6. Modal de Reporte / Memorando Técnico */}
      <SummaryReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        inputs={inputs}
        outputs={outputs}
      />
    </div>
  );
}
