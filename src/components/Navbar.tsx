import React, { useState } from 'react';
import { FileText, ZoomIn } from 'lucide-react';
import { LogoLightboxModal } from './LogoLightboxModal';

interface NavbarProps {
  activeStep: number;
  onSelectStep: (step: number) => void;
  onOpenReport: () => void;
  isCascadeView: boolean;
  onToggleCascadeView: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeStep,
  onSelectStep,
  onOpenReport,
  isCascadeView,
  onToggleCascadeView,
}) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const steps = [
    { id: 1, label: '1. Tanque & Biomasa' },
    { id: 2, label: '2. Balance TAN' },
    { id: 3, label: '3. Biofiltro' },
    { id: 4, label: '4. Sólidos SST' },
    { id: 5, label: '5. Oxígeno' },
    { id: 6, label: 'Esquema & Flujo' },
  ];

  const whatsappNumber = '+56982997625';
  const whatsappUrl = `https://wa.me/56982997625?text=${encodeURIComponent(
    'Hola Ing. José Ernesto Muñoz Núñez, le contacto desde la aplicación Cálculo RAS.'
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* LADO IZQUIERDO: Logo Grande en HD + Identidad del Software e Ingeniero */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Contenedor del Logo con fondo blanco para máximo contraste y nitidez */}
            <div
              onClick={() => setIsLogoModalOpen(true)}
              className="relative group cursor-pointer shrink-0"
              title="Haga clic para ver el logo en pantalla completa y explorar sus detalles"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl bg-white p-1.5 shadow-2xl shadow-sky-950/70 border-2 border-sky-400/60 group-hover:border-sky-300 group-hover:scale-105 transition-all duration-200 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo Calculo RAS - Ing. en Acuicultura José Ernesto Muñoz Núñez"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>

              {/* Indicador de lupa para invitar a ver en HD */}
              <div className="absolute -bottom-1 -right-1 bg-sky-500 hover:bg-sky-400 text-slate-950 p-1 rounded-full shadow-lg border border-white/80 group-hover:scale-110 transition-transform">
                <ZoomIn className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Datos del software y profesional */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-none">
                  Calculo RAS <span className="text-sky-400 text-lg sm:text-xl font-bold">(V2.0)</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 hidden lg:inline-block">
                  Salmónidos
                </span>
              </div>

              <span className="text-xs sm:text-sm font-semibold text-sky-300 tracking-tight mt-1">
                Ing. en Acuicultura José Ernesto Muñoz Núñez
              </span>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
                Dimensionamiento Integral de Sistemas de Recirculación
              </span>
            </div>
          </div>

          {/* LADO DERECHO: Menú de pasos agrandado y destacado, con los dos botones directamente debajo */}
          <div className="flex flex-col xl:items-end gap-2.5 w-full xl:w-auto">
            {/* 1. Menú de los 6 pasos: Letra más grande, destacada y subrayada al estar activa */}
            <nav className="flex items-center gap-2 sm:gap-4 md:gap-5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
              {steps.map((st) => {
                const isActive = !isCascadeView && activeStep === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      onToggleCascadeView(false);
                      onSelectStep(st.id);
                    }}
                    className={`whitespace-nowrap shrink-0 text-sm sm:text-base font-bold transition-all py-1.5 px-1 cursor-pointer border-b-[3px] ${
                      isActive
                        ? 'text-sky-300 border-sky-400 drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]'
                        : 'text-slate-300 hover:text-white border-transparent hover:border-slate-600'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </nav>

            {/* 2. Botones de acción justo DEBAJO del menú de pasos: WhatsApp (Verde) y Reporte Técnico (Azul) */}
            <div className="flex items-center gap-3 xl:justify-end flex-wrap pt-0.5">
              {/* Botón WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Contacto y Comentarios por WhatsApp (${whatsappNumber})`}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] active:bg-[#007a5e] text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 border border-emerald-300/40 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {/* Ícono Oficial de WhatsApp */}
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0 text-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Contacto y Comentarios</span>
              </a>

              {/* Botón Reporte Técnico */}
              <button
                onClick={onOpenReport}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00b0ff] hover:bg-[#38bdf8] active:bg-[#0284c7] text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-sky-950/50 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                <span>Reporte Técnico</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Zoom de Alta Resolución para inspeccionar detalles del logo */}
      <LogoLightboxModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </>
  );
};
