import React from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

interface LogoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoLightboxModal: React.FC<LogoLightboxModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-sky-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col items-center text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Cerrar vista detallada"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Detalle de Alta Resolución</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Emblema Oficial — Calculo RAS
          </h3>
          <p className="text-xs text-slate-400">
            Ing. en Acuicultura José Ernesto Muñoz Núñez
          </p>
        </div>

        {/* Big HD Logo Container */}
        <div className="bg-white rounded-2xl p-4 shadow-2xl border-4 border-sky-400/40 max-w-md w-full aspect-square flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo Oficial Calculo RAS en Alta Resolución"
            className="w-full h-full object-contain drop-shadow"
          />
        </div>

        {/* Description of Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 w-full pt-2">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-sky-400 font-bold block">1. Recirculación</span>
            <span>Flechas de ciclo continuo RAS</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-sky-400 font-bold block">2. Especie</span>
            <span>Salmón del Atlántico en cultivo</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-sky-400 font-bold block">3. Tanque & Tuberías</span>
            <span>Estanque circular y drenajes</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-sky-400 font-bold block">4. Monitoreo</span>
            <span>Telemetría (O₃, pH, Temp)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 pt-2">
          <a
            href="/logo.png"
            download="Logo_Calculo_RAS_Ing_Jose_Ernesto_Munoz.png"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-sky-950/50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Imagen HD</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
