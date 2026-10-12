import { jsPDF } from 'jspdf';
import { RasInputs, RasOverallOutputs } from '../types/ras';
import { formatNum } from './rasCalculations';
import { LOGO_BASE64 } from './logoData';

export const generatePdfReport = (inputs: RasInputs, outputs: RasOverallOutputs): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm
  let currentY = margin;

  const legalNotice =
    'Aviso legal: Los cálculos presentados en este documento son únicamente de carácter técnicos y se basan en los datos proporcionados por el usuario a la fecha de su ejecución. Este resultado no constituye una asesoría vinculante. El emisor no se hace responsable por errores, omisiones o decisiones tomadas con base en esta información. Se recomienda verificar';

  const addHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      // 1. Logo de la aplicación con marco blanco y sombra sutil
      try {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, currentY, 32, 32, 2, 2, 'F');
        doc.addImage(LOGO_BASE64, 'JPEG', margin + 1, currentY + 1, 30, 30);
      } catch (e) {
        console.warn('Could not add logo image to PDF:', e);
      }

      // 2. Título principal: Reporte Técnico
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(14, 116, 144); // Cyan / Blue 700
      doc.text('Cálculo RAS — Reporte Técnico', margin + 36, currentY + 8);

      // Nombre del Ingeniero
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.text('Ing. en Acuicultura José Ernesto Muñoz Núñez', margin + 36, currentY + 15);

      // WhatsApp Contacto
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(22, 101, 52); // Emerald 800
      doc.text('WhatsApp Contacto: +56 9 8299 7625', margin + 36, currentY + 21);

      // Fecha de emisión
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(
        `Fecha de emisión: ${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`,
        margin + 36,
        currentY + 27
      );

      currentY += 36;

      // Línea divisoria superior
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 6;
    } else {
      // Sub-header para páginas subsiguientes
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Cálculo RAS — Reporte Técnico · Ing. José Ernesto Muñoz Núñez (+56 9 8299 7625)', margin, 11);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, 13, pageWidth - margin, 13);
      currentY = 18;
    }
  };

  const addFooterToAllPages = () => {
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      const footerY = pageHeight - 16;

      // Línea divisoria del pie
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

      // Aviso legal requerido en el pie
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      const splitLegal = doc.splitTextToSize(legalNotice, contentWidth - 25);
      doc.text(splitLegal, margin, footerY + 1.5);

      // Numeración de páginas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Pág. ${p} / ${totalPages}`, pageWidth - margin - 15, footerY + 4);
    }
  };

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 28) {
      doc.addPage();
      addHeader(false);
    }
  };

  // Construir Página 1
  addHeader(true);

  const { step1, step2, step3, step4, step5, governingFlowRate, dailyWaterRenewalPercent } = outputs;

  // 3. CUADRO DICTAMEN HIDRÁULICO GOBERNANTE
  const dictamenHeight = 31;
  doc.setFillColor(240, 249, 255); // Fondo Sky 50
  doc.setDrawColor(56, 189, 248); // Borde Sky 400
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, currentY, contentWidth, dictamenHeight, 2.5, 2.5, 'FD');

  // Encabezado del dictamen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(3, 105, 161); // Sky 700
  doc.text('DICTAMEN HIDRÁULICO GOBERNANTE DEL SISTEMA', margin + 5, currentY + 6);

  // Valor principal del caudal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(12, 74, 110); // Sky 900
  doc.text(
    `${formatNum(governingFlowRate.flowRateLmin, 0)} L/min   (${formatNum(governingFlowRate.flowRateM3hr, 1)} m³/h  |  ${formatNum(governingFlowRate.flowRateGpm, 0)} GPM)`,
    margin + 5,
    currentY + 13
  );

  // Columna Izquierda interna
  const factorName =
    governingFlowRate.governingFactor === 'O2'
      ? 'Oxígeno Disuelto (O2)'
      : governingFlowRate.governingFactor === 'TAN'
      ? 'Nitrógeno Amoniacal Total (TAN)'
      : 'Sólidos Suspendidos Totales (SST)';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Factor Limitante Gobernador: ', margin + 5, currentY + 19.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(3, 105, 161);
  doc.text(factorName, margin + 44, currentY + 19.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Tasa de Recambio: ${formatNum(governingFlowRate.turnoverPerHour, 2)} rev/h   (HRT: ${formatNum(governingFlowRate.hrtMinutes, 1)} min)`,
    margin + 5,
    currentY + 25.5
  );

  // Columna Derecha interna (Alineada a la derecha con padding de seguridad)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Agua de reemplazo fresca:', pageWidth - margin - 6, currentY + 19.5, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(5, 150, 105); // Emerald 700
  doc.text(
    `${formatNum(step2.newWaterRequiredLday, 0)} L/día (${dailyWaterRenewalPercent.toFixed(1)}% estanque/día)`,
    pageWidth - margin - 6,
    currentY + 25.5,
    { align: 'right' }
  );

  currentY += dictamenHeight + 5;

  // Función de renderizado estándar para secciones / pasos
  const renderSection = (
    title: string,
    inputsData: Array<[string, string]>,
    outputsData: Array<[string, string, boolean?]>
  ) => {
    const rowHeight = 5.2;
    const maxRows = Math.max(inputsData.length, outputsData.length);
    const boxHeight = 7.5 + maxRows * rowHeight + 3.5;

    checkPageBreak(boxHeight + 4);

    // Barra de título de la sección
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, currentY, contentWidth, 6.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin + 4, currentY + 4.6);

    currentY += 6.5;

    // Caja de contenido
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, contentWidth, boxHeight - 6.5, 'FD');

    // Dos columnas simétricas con 6 mm de separación central
    const colWidth = (contentWidth - 8) / 2; // 87 mm por columna
    const leftX = margin + 3; // 17 mm
    const rightX = margin + colWidth + 5; // 106 mm

    // Encabezado columna izquierda
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('Parámetros de Entrada (Usuario)', leftX + 1, currentY + 4.5);

    // Encabezado columna derecha
    doc.setTextColor(3, 105, 161); // Sky 700
    doc.text('Resultados Calculados', rightX + 1, currentY + 4.5);

    let rowY = currentY + 9;

    for (let i = 0; i < maxRows; i++) {
      // Elemento izquierdo
      if (i < inputsData.length) {
        const [label, val] = inputsData[i];
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(71, 85, 105);
        doc.text(label, leftX + 1, rowY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(val, leftX + colWidth - 4, rowY, { align: 'right' });
      }

      // Elemento derecho
      if (i < outputsData.length) {
        const [label, val, isImportant] = outputsData[i];
        doc.setFont('helvetica', isImportant ? 'bold' : 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(isImportant ? 'rgb(3, 105, 161)' : 'rgb(71, 85, 105)');
        doc.text(label, rightX + 1, rowY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isImportant ? 'rgb(2, 132, 199)' : 'rgb(15, 23, 42)');
        doc.text(val, rightX + colWidth - 4, rowY, { align: 'right' });
      }

      rowY += rowHeight;
    }

    currentY += boxHeight - 6.5 + 4.5;
  };

  // PASO 1
  renderSection(
    'PASO 1: DIMENSIONAMIENTO DE TANQUE Y BIOMASA DE SALMONES',
    [
      ['Profundidad de agua (h)', `${inputs.tankDepth} m`],
      ['Radio del estanque (r)', `${inputs.tankRadius} m (Ø ${(inputs.tankRadius * 2).toFixed(1)} m)`],
      ['Densidad máxima cultivo', `${inputs.maxDensity} kg/m³`],
      ['Número total de peces', `${inputs.fishCount.toLocaleString('es-CL')} peces`],
      ['Tasa de alimentación diaria', `${inputs.feedRatePercent}% biomasa/día`],
    ],
    [
      ['Volumen neto del estanque', `${formatNum(step1.tankVolume, 2)} m³`, true],
      ['Biomasa total de salmones', `${formatNum(step1.fishBiomass, 1)} kg`, true],
      ['Peso individual promedio', `${formatNum(step1.fishWeight, 1)} gramos`],
      ['Ración diaria de alimento', `${formatNum(step1.feedRateKgDay, 2)} kg/día`, true],
    ]
  );

  // PASO 2
  renderSection(
    'PASO 2: BALANCE DE NITROGENO AMONIACAL TOTAL (TAN)',
    [
      ['Proteína cruda del alimento', `${inputs.feedProteinPercent}%`],
      ['TAN deseado en estanque', `${inputs.desiredTAN} mg/L`],
      ['Nitrificación pasiva espontánea', `${inputs.passiveNitrificationPercent}%`],
      ['Desnitrificación pasiva', `${inputs.passiveDenitrificationPercent}%`],
      ['Nitrato NO3-N máximo deseado', `${inputs.maxNitrateN} mg/L`],
      ['Eficiencia remoción biofiltro', `${inputs.biofilterEfficiencyPercent}%`],
    ],
    [
      ['Tasa producción total de TAN', `${formatNum(step2.tanProductionKgDay, 2)} kg/día`, true],
      ['% TAN respecto al alimento', `${formatNum(step2.tanFromFeedPercent, 2)}%`],
      ['TAN tras nitrificación pasiva', `${formatNum(step2.tanAfterPassiveKgDay, 3)} kg/día`],
      ['Agua de reemplazo (Control NO3)', `${formatNum(step2.newWaterRequiredLday, 0)} L/día`, true],
      ['TAN neto disponible a biofiltro', `${formatNum(step2.tanAvailableBiofilterKgDay, 3)} kg/día`],
      ['Caudal recirculación por TAN', `${formatNum(step2.flowRateTAN_Lmin, 0)} L/min (${formatNum(step2.flowRateTAN_M3hr, 1)} m³/h)`, true],
    ]
  );

  // Salto de página para que Pasos 3, 4 y 5 queden holgados y nítidos en Página 2
  doc.addPage();
  addHeader(false);

  // PASO 3
  renderSection(
    'PASO 3: DIMENSIONAMIENTO FÍSICO DEL BIOFILTRO NITRIFICANTE',
    [
      ['Tasa de nitrificación del biofilm', `${inputs.nitrificationRate} g TAN/m²/día`],
      ['Superficie específica medio (SSA)', `${inputs.mediaSpecificArea} m²/m³`],
      ['Precio unitario del medio plástico', `$${inputs.mediaUnitPrice} USD/m³`],
      ['Altura / Profundidad de lecho (H)', `${inputs.mediaDepth} m`],
    ],
    [
      ['Superficie activa de biofilm req.', `${formatNum(step3.activeSurfaceRequiredM2, 0)} m²`, true],
      ['Volumen total de medio biológico', `${formatNum(step3.totalMediaVolumeM3, 2)} m³`, true],
      ['Inversión en medio soporte', `$${formatNum(step3.mediaCostUSD, 2)} USD`, true],
      ['Área transversal de fondo biofiltro', `${formatNum(step3.biofilterFaceAreaM2, 2)} m²`],
      ['Diámetro del reactor circular', `${formatNum(step3.biofilterDiameterM, 2)} m`, true],
    ]
  );

  // PASO 4
  renderSection(
    'PASO 4: BALANCE DE SÓLIDOS SUSPENDIDOS TOTALES (SST)',
    [
      ['Fracción de alimento en desecho sólido', `${inputs.feedToSolidsPercent}%`],
      ['Concentración deseada de SST', `${inputs.desiredSS} mg/L`],
      ['Remoción por trampa de partículas', `${inputs.particleTrapPercent}%`],
      ['Eficiencia del filtro mecánico (malla)', `${inputs.solidsFilterEfficiencyPercent}%`],
    ],
    [
      ['Sólidos producidos por peces', `${formatNum(step4.wasteSolidsProducedKgDay, 2)} kg/día`],
      ['Sólidos tras trampa de partículas', `${formatNum(step4.solidsAfterParticleTrapKgDay, 2)} kg/día`],
      ['Sólidos a retener por filtro', `${formatNum(step4.solidsRemainingEffluentKgDay, 2)} kg/día`],
      ['Caudal recirculación por SST', `${formatNum(step4.flowRateSS_Lmin, 0)} L/min (${formatNum(step4.flowRateSS_M3hr, 1)} m³/h)`, true],
    ]
  );

  // PASO 5 (Corregido según el diseño exacto del Paso 4, sin superposiciones ni símbolos corruptos)
  renderSection(
    'PASO 5: BALANCE DE OXÍGENO DISUELTO (O2)',
    [
      ['Tipo de filtro biológico', inputs.submergedFilter ? 'Sumergido' : 'Percolador'],
      ['Consumo O2 por alimento', `${inputs.oxygenPerFeedPercent}%`],
      ['Concentración deseada de O2', `${inputs.desiredTankO2} mg/L`],
      ['Concentración O2 suministrado', `${inputs.suppliedO2} mg/L`],
    ],
    [
      ['O2 consumido por peces', `${formatNum(step5.oxygenUsedFeedKgDay, 2)} kg/día`],
      ['O2 consumido por biofiltro', `${formatNum(step5.oxygenBiofilterNitrKgDay + step5.oxygenPassiveNitrKgDay, 2)} kg/día`],
      ['Demanda total O2 del sistema', `${formatNum(step5.totalOxygenUsedKgDay, 2)} kg/día`, true],
      ['Caudal recirculación por O2', `${formatNum(step5.flowRateO2_Lmin, 0)} L/min (${formatNum(step5.flowRateO2_M3hr, 1)} m³/h)`, true],
    ]
  );

  // 5. ESQUEMA DE FLUJO DEL PROCESO RAS (Al final de los textos)
  const diagHeight = 65;
  checkPageBreak(diagHeight + 8);

  // Barra de título del diagrama
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY, contentWidth, 6.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('ESQUEMA DE FLUJO Y BALANCE DE PROCESO RAS (CIRCUITO CERRADO)', margin + 4, currentY + 4.6);

  currentY += 6.5;

  // Fondo contenedor del diagrama
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, diagHeight, 'FD');

  const startDiagY = currentY;
  const bWidth = 38;
  const bHeight = 27;
  const bGap = (contentWidth - 4 * bWidth) / 3; // 10 mm entre cajas
  const boxY = startDiagY + 16;

  const x1 = margin; // 14
  const x2 = x1 + bWidth + bGap; // 62
  const x3 = x2 + bWidth + bGap; // 110
  const x4 = x3 + bWidth + bGap; // 158

  const cx1 = x1 + bWidth / 2;
  const cx4 = x4 + bWidth / 2;

  // Tubería superior de retorno recirculado (Oxigenador -> Tanque de Biomasa)
  const pipeY = startDiagY + 7;
  doc.setDrawColor(2, 132, 199); // Sky 600
  doc.setLineWidth(0.8);
  doc.line(cx4, boxY, cx4, pipeY); // sube desde caja 4
  doc.line(cx4, pipeY, cx1, pipeY); // cruza horizontal
  doc.line(cx1, pipeY, cx1, boxY); // baja a caja 1

  // Flecha en entrada superior al tanque
  doc.setFillColor(2, 132, 199);
  doc.triangle(cx1 - 1.8, boxY - 2.5, cx1 + 1.8, boxY - 2.5, cx1, boxY, 'F');

  // Texto centrado sobre la tubería de retorno
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(3, 105, 161);
  doc.text(
    `Retorno Recirculado Gobernador: ${formatNum(governingFlowRate.flowRateLmin, 0)} L/min (${formatNum(governingFlowRate.flowRateM3hr, 1)} m³/h | ${formatNum(governingFlowRate.flowRateGpm, 0)} GPM)`,
    margin + contentWidth / 2,
    pipeY - 2,
    { align: 'center' }
  );

  // Flechas horizontales entre cajas (inter-stage)
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.7);
  const midY = boxY + bHeight / 2;

  // Caja 1 -> Caja 2
  doc.line(x1 + bWidth, midY, x2, midY);
  doc.triangle(x2 - 2.5, midY - 1.5, x2 - 2.5, midY + 1.5, x2, midY, 'F');

  // Caja 2 -> Caja 3
  doc.line(x2 + bWidth, midY, x3, midY);
  doc.triangle(x3 - 2.5, midY - 1.5, x3 - 2.5, midY + 1.5, x3, midY, 'F');

  // Caja 3 -> Caja 4
  doc.line(x3 + bWidth, midY, x4, midY);
  doc.triangle(x4 - 2.5, midY - 1.5, x4 - 2.5, midY + 1.5, x4, midY, 'F');

  // DIBUJO DE LAS 4 CAJAS DE PROCESO
  // 1. Tanque de Biomasa (Todo el texto 100% dentro del marco)
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.5);
  doc.roundedRect(x1, boxY, bWidth, bHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('Tanque de Biomasa', cx1, boxY + 4.8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text(`${formatNum(step1.tankVolume, 1)} m³ | ${formatNum(step1.fishBiomass, 0)} kg`, cx1, boxY + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(180, 83, 9);
  doc.text(`Alim: ${formatNum(step1.feedRateKgDay, 1)} kg/d`, cx1, boxY + 14.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(3, 105, 161);
  doc.text(`DO: 7.0 mg/L | TAN: 2.0`, cx1, boxY + 19.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.setTextColor(5, 150, 105);
  doc.text(`Agua Nueva: ${formatNum(step2.newWaterRequiredLday, 0)} L/d`, cx1, boxY + 24, { align: 'center' });

  // 2. Filtro de Sólidos
  const cx2 = x2 + bWidth / 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(x2, boxY, bWidth, bHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('Filtro de Sólidos', cx2, boxY + 4.8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Tambor Rotatorio', cx2, boxY + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(220, 38, 38);
  doc.text(`SST: ${formatNum(step4.wasteSolidsProducedKgDay, 1)} kg/d`, cx2, boxY + 14.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(3, 105, 161);
  doc.text(`Q: ${formatNum(step4.flowRateSS_Lmin, 0)} L/min`, cx2, boxY + 19.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Eficiencia: 50%', cx2, boxY + 24, { align: 'center' });

  // 3. Biofiltro Nitrificante
  const cx3 = x3 + bWidth / 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(56, 189, 248);
  doc.roundedRect(x3, boxY, bWidth, bHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('Biofiltro Nitrificante', cx3, boxY + 4.8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text(`Volumen: ${formatNum(step3.totalMediaVolumeM3, 1)} m³`, cx3, boxY + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(180, 83, 9);
  doc.text(`Carga: ${formatNum(step2.tanAvailableBiofilterKgDay, 2)} kg TAN/d`, cx3, boxY + 14.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(3, 105, 161);
  doc.text(`Ø ${formatNum(step3.biofilterDiameterM, 2)} m × ${inputs.mediaDepth} m`, cx3, boxY + 19.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.setTextColor(3, 105, 161);
  doc.text(`Q: ${formatNum(step2.flowRateTAN_Lmin, 0)} L/min`, cx3, boxY + 24, { align: 'center' });

  // 4. Oxigenación
  const cx4_box = x4 + bWidth / 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(56, 189, 248);
  doc.roundedRect(x4, boxY, bWidth, bHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('Oxigenación', cx4_box, boxY + 4.8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Cono / LHO', cx4_box, boxY + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(3, 105, 161);
  doc.text(`O2: ${formatNum(step5.totalOxygenUsedKgDay, 1)} kg/d`, cx4_box, boxY + 14.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Suministro: ${inputs.suppliedO2} mg/L`, cx4_box, boxY + 19.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.setTextColor(180, 83, 9);
  doc.text(`Q: ${formatNum(step5.flowRateO2_Lmin, 0)} L/min`, cx4_box, boxY + 24, { align: 'center' });

  // Tubería inferior: Purga Efluente hacia drenaje
  const purgeY = boxY + bHeight;
  doc.setDrawColor(239, 68, 68); // Red 500
  doc.setLineWidth(0.6);
  doc.line(cx1, purgeY, cx1, purgeY + 8);
  doc.setFillColor(239, 68, 68);
  doc.triangle(cx1 - 1.5, purgeY + 8, cx1 + 1.5, purgeY + 8, cx1, purgeY + 10.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(220, 38, 38);
  doc.text(`Purga Efluente (Nitratos): ${formatNum(step2.newWaterRequiredLday, 0)} L/d`, cx1 + 4, purgeY + 9.5);

  // Nota técnica resumen en el pie del diagrama
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `* Esquema de recirculación continua en circuito cerrado. Gobernado por ${factorName} (${formatNum(governingFlowRate.turnoverPerHour, 2)} rev/h, HRT: ${formatNum(governingFlowRate.hrtMinutes, 1)} min).`,
    margin + 4,
    startDiagY + diagHeight - 3.5
  );

  currentY += diagHeight + 4;

  // Agregar pie de página con aviso legal a todas las páginas generadas
  addFooterToAllPages();

  // Guardar y descargar el archivo PDF
  const fileName = `Calculo_RAS_Reporte_Tecnico_Ing_Jose_Ernesto_Munoz_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
