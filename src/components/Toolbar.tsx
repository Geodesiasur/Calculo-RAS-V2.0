import React from 'react';
import { PRESETS } from '../utils/rasCalculations';
import { RasInputs } from '../types/ras';
import { RotateCcw, LayoutList, Layers } from 'lucide-react';

interface ToolbarProps {
  onSelectPreset: (inputs: RasInputs) => void;
  onResetToDefault: () => void;
  isCascadeView: boolean;
  onToggleCascadeView: (val: boolean) => void;
  activeStep: number;
  onSelectStep: (step: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSelectPreset,
  onResetToDefault,
  isCascadeView,
  onToggleCascadeView,
  activeStep,
  onSelectStep,
}) => {
  return (
    <div className="bg-slate-950/90 border-b border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Leyenda Visual de Colores (Requisito clave del usuario) */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/40 px-2.5 py-1 rounded-md text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-semibold">Amarillo:</span>
            <span className="text-slate-300">Entradas del Usuario</span>
          </div>

          <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-400/40 px-2.5 py-1 rounded-md text-sky-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="font-semibold">Azul:</span>
            <span className="text-slate-300">Cálculo Automático</span>
          </div>
        </div>

        {/* Presets & Modo de Vista */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Escenario:</span>
            <select
              onChange={(e) => {
                const found = PRESETS.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found.inputs);
              }}
              defaultValue="salmon-growout-standard"
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Vista: Paso a Paso vs Hoja Completa */}
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-700 rounded-lg">
            <button
              type="button"
              onClick={() => onToggleCascadeView(false)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                !isCascadeView
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Vista de pestañas paso a paso"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Paso a Paso</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleCascadeView(true)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                isCascadeView
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Ver los 5 pasos simultáneamente en cascada"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hoja Completa</span>
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={onResetToDefault}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Restaurar valores iniciales de la planilla de cálculo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
