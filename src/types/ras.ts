/**
 * Modelo de datos y tipos para el cálculo RAS (Recirculating Aquaculture System)
 * Desarrollado para Ing. en Acuicultura José Ernesto Muñoz Núñez
 */

export interface RasInputs {
  // Paso 1: Tamaño del Tanque y Biomasa
  tankDepth: number; // m (Profundidad de agua)
  tankRadius: number; // m (Radio del estanque)
  maxDensity: number; // kg/m^3 (Densidad máxima de cultivo)
  fishCount: number; // unidades (Número de peces)
  feedRatePercent: number; // % del peso corporal diario (ej. 1.5%)

  // Paso 2: Balance de Masa de TAN
  feedProteinPercent: number; // % proteína del alimento (ej. 45%)
  desiredTAN: number; // mg/L (Concentración TAN deseada en agua de recirculación)
  passiveNitrificationPercent: number; // % nitrificación pasiva en tuberías/tanque (ej. 10%)
  passiveDenitrificationPercent: number; // % desnitrificación pasiva (ej. 0%)
  maxNitrateN: number; // mg/L (Concentración máxima de Nitrógeno de Nitrato NO3-N deseada)
  biofilterEfficiencyPercent: number; // % eficiencia del biofiltro para remoción de TAN (ej. 50%)

  // Paso 3: Dimensionamiento del Biofiltro
  nitrificationRate: number; // g TAN / m^2 / día (Tasa estimada de nitrificación del medio)
  mediaSpecificArea: number; // m^2 / m^3 (Superficie específica del medio soporte)
  mediaUnitPrice: number; // USD / m^3 (Precio unitario del medio biológico)
  mediaDepth: number; // m (Profundidad / altura de empaque del lecho)

  // Paso 4: Balance de Sólidos Suspendidos Totales (SST)
  feedToSolidsPercent: number; // % estimado de alimento que se convierte en desecho sólido (ej. 25%)
  desiredSS: number; // mg/L (Concentración deseada de SST en el tanque)
  particleTrapPercent: number; // % removido por trampa de partículas / desagüe de doble drenaje
  solidsFilterEfficiencyPercent: number; // % eficiencia de remoción mecánica (filtro tambor rotatorio, etc.)

  // Paso 5: Balance de Oxígeno
  submergedFilter: boolean; // ¿Filtro sumergido? (1=Sí, 0=No / percolador)
  oxygenPerFeedPercent: number; // % kg O2 por kg de alimento (ej. 30%)
  desiredTankO2: number; // mg/L (Concentración deseada de O2 en el estanque)
  suppliedO2: number; // mg/L (Concentración de O2 disuelto suministrado en afluente)
}

export interface RasStep1Outputs {
  tankVolume: number; // m^3
  fishBiomass: number; // kg
  fishWeight: number; // g
  feedRateKgDay: number; // kg/día
}

export interface RasStep2Outputs {
  tanProductionKgDay: number; // kg/día
  tanFromFeedPercent: number; // % respecto al alimento
  tanAfterPassiveKgDay: number; // kg/día
  newWaterRequiredLday: number; // L/día
  newWaterRequiredM3day: number; // m^3/día
  tanAvailableBiofilterKgDay: number; // kg/día
  flowRateTAN_Lday: number; // L/día
  flowRateTAN_Lmin: number; // L/min
  flowRateTAN_gpm: number; // gal/min
  flowRateTAN_Lhr: number; // L/hr
  flowRateTAN_M3hr: number; // m^3/hr
}

export interface RasStep3Outputs {
  activeSurfaceRequiredM2: number; // m^2
  totalMediaVolumeM3: number; // m^3
  mediaCostUSD: number; // USD
  biofilterFaceAreaM2: number; // m^2
  biofilterDiameterM: number; // m
}

export interface RasStep4Outputs {
  wasteSolidsProducedKgDay: number; // kg/día
  solidsAfterParticleTrapKgDay: number; // kg/día
  solidsRemainingEffluentKgDay: number; // kg/día
  flowRateSS_Lday: number; // L/día
  flowRateSS_Lmin: number; // L/min
  flowRateSS_gpm: number; // gal/min
  flowRateSS_Lhr: number; // L/hr
  flowRateSS_M3hr: number; // m^3/hr
}

export interface RasStep5Outputs {
  oxygenUsedFeedKgDay: number; // kg/día
  oxygenPassiveNitrKgDay: number; // kg/día
  oxygenBiofilterNitrKgDay: number; // kg/día
  totalOxygenUsedKgDay: number; // kg/día
  flowRateO2_Lday: number; // L/día
  flowRateO2_Lmin: number; // L/min
  flowRateO2_gpm: number; // gal/min
  flowRateO2_Lhr: number; // L/hr
  flowRateO2_M3hr: number; // m^3/hr
}

export interface RasOverallOutputs {
  step1: RasStep1Outputs;
  step2: RasStep2Outputs;
  step3: RasStep3Outputs;
  step4: RasStep4Outputs;
  step5: RasStep5Outputs;
  governingFlowRate: {
    governingFactor: 'O2' | 'TAN' | 'SST';
    flowRateLmin: number;
    flowRateM3hr: number;
    flowRateGpm: number;
    flowRateLday: number;
    turnoverPerHour: number; // recambios de estanque por hora
    hrtMinutes: number; // tiempo de retención hidráulica en minutos
  };
  dailyWaterRenewalPercent: number; // % de recambio diario de agua nueva respecto al volumen del tanque
}

export interface RasPreset {
  id: string;
  name: string;
  description: string;
  inputs: RasInputs;
}
