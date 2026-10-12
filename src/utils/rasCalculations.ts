import {
  RasInputs,
  RasOverallOutputs,
  RasPreset,
  RasStep1Outputs,
  RasStep2Outputs,
  RasStep3Outputs,
  RasStep4Outputs,
  RasStep5Outputs,
} from '../types/ras';

/**
 * Valores iniciales y de referencia provistos por el Ing. José Ernesto Muñoz Núñez
 * según los estándares de diseño RAS (Timmons et al.).
 */
export const INITIAL_RAS_INPUTS: RasInputs = {
  // 2.1 Tamaño del Tanque y Biomasa
  tankDepth: 2.10, // m
  tankRadius: 5.51, // m (Radio que genera aprox. 200 m^3)
  maxDensity: 60, // kg/m^3
  fishCount: 20000, // unidades
  feedRatePercent: 1.5, // % peso vivo

  // 2.2 Balance de TAN
  feedProteinPercent: 45, // % proteína
  desiredTAN: 2.0, // mg/L
  passiveNitrificationPercent: 10, // %
  passiveDenitrificationPercent: 0, // %
  maxNitrateN: 150, // mg/L
  biofilterEfficiencyPercent: 50, // %

  // 2.3 Dimensionamiento del Biofiltro
  nitrificationRate: 0.40, // g TAN/m^2/día
  mediaSpecificArea: 200, // m^2/m^3
  mediaUnitPrice: 200.00, // USD/m^3
  mediaDepth: 1.65, // m

  // 2.4 Balance de Sólidos SST
  feedToSolidsPercent: 25, // %
  desiredSS: 25, // mg/L
  particleTrapPercent: 0, // %
  solidsFilterEfficiencyPercent: 50, // %

  // 2.5 Balance de Oxígeno
  submergedFilter: true, // 1 = Sí (Sumergido)
  oxygenPerFeedPercent: 30, // %
  desiredTankO2: 7.0, // mg/L
  suppliedO2: 14.0, // mg/L
};

export const PRESETS: RasPreset[] = [
  {
    id: 'salmon-growout-standard',
    name: 'Salmón Engorda Estándar (Caso Guía)',
    description: 'Parámetros base del manual: 20,000 salmones de 600g, 200 m³, 60 kg/m³, 45% proteína.',
    inputs: {...INITIAL_RAS_INPUTS},
  },
  {
    id: 'salmon-smolt-post-smolt',
    name: 'Post-Smolt Salmón Atlántico (120g - 250g)',
    description: 'Fase intermedia de agua dulce/mar: 35 kg/m³, alimento 48% proteína, mayor tasa de alimentación (2.2%).',
    inputs: {
      ...INITIAL_RAS_INPUTS,
      tankDepth: 2.5,
      tankRadius: 4.5,
      maxDensity: 40,
      fishCount: 25000,
      feedRatePercent: 2.2,
      feedProteinPercent: 48,
      desiredTAN: 1.5,
      passiveNitrificationPercent: 12,
      maxNitrateN: 100,
      biofilterEfficiencyPercent: 55,
      nitrificationRate: 0.45,
      mediaSpecificArea: 300,
      mediaUnitPrice: 230,
      mediaDepth: 1.8,
      feedToSolidsPercent: 22,
      desiredSS: 15,
      particleTrapPercent: 15,
      solidsFilterEfficiencyPercent: 60,
      submergedFilter: true,
      oxygenPerFeedPercent: 32,
      desiredTankO2: 8.0,
      suppliedO2: 15.0,
    },
  },
  {
    id: 'salmon-harvest-density',
    name: 'Salmón Cosecha Alta Densidad (75 kg/m³)',
    description: 'Fase final de cosecha intensiva: estanque de gran escala 450 m³, 75 kg/m³, alta demanda de O2.',
    inputs: {
      ...INITIAL_RAS_INPUTS,
      tankDepth: 3.0,
      tankRadius: 6.91,
      maxDensity: 75,
      fishCount: 10000,
      feedRatePercent: 1.0,
      feedProteinPercent: 42,
      desiredTAN: 2.0,
      passiveNitrificationPercent: 10,
      maxNitrateN: 150,
      biofilterEfficiencyPercent: 50,
      nitrificationRate: 0.40,
      mediaSpecificArea: 200,
      mediaUnitPrice: 200,
      mediaDepth: 2.0,
      feedToSolidsPercent: 25,
      desiredSS: 25,
      particleTrapPercent: 10,
      solidsFilterEfficiencyPercent: 65,
      submergedFilter: true,
      oxygenPerFeedPercent: 28,
      desiredTankO2: 7.0,
      suppliedO2: 16.0,
    },
  },
  {
    id: 'trout-fingerlings',
    name: 'Alevinaje y Juveniles de Trucha (80g)',
    description: 'Etapa temprana: alimento de 50% proteína, tasa de alimentación 3.0%, filtro percolador no sumergido.',
    inputs: {
      ...INITIAL_RAS_INPUTS,
      tankDepth: 1.5,
      tankRadius: 3.5,
      maxDensity: 30,
      fishCount: 22000,
      feedRatePercent: 3.0,
      feedProteinPercent: 50,
      desiredTAN: 1.0,
      passiveNitrificationPercent: 8,
      maxNitrateN: 80,
      biofilterEfficiencyPercent: 60,
      nitrificationRate: 0.50,
      mediaSpecificArea: 350,
      mediaUnitPrice: 250,
      mediaDepth: 1.5,
      feedToSolidsPercent: 28,
      desiredSS: 12,
      particleTrapPercent: 20,
      solidsFilterEfficiencyPercent: 70,
      submergedFilter: false, // Trickling filter (no consume O2 de la columna líquida)
      oxygenPerFeedPercent: 35,
      desiredTankO2: 8.5,
      suppliedO2: 13.5,
    },
  },
];

export function calculateStep1(inputs: RasInputs): RasStep1Outputs {
  const { tankDepth, tankRadius, maxDensity, fishCount, feedRatePercent } = inputs;
  
  // Volumen = B6 * (PI() * (B7 * B7))
  const tankVolume = tankDepth * (Math.PI * Math.pow(tankRadius, 2));
  
  // Biomasa = B8 * B9
  const fishBiomass = tankVolume * maxDensity;
  
  // Peso individual (g) = 1000 * B10 / B11
  const fishWeight = fishCount > 0 ? (1000 * fishBiomass) / fishCount : 0;
  
  // Tasa de alimentación (kg/día) = B10 * B13
  const feedRateKgDay = fishBiomass * (feedRatePercent / 100);

  return {
    tankVolume,
    fishBiomass,
    fishWeight,
    feedRateKgDay,
  };
}

export function calculateStep2(
  inputs: RasInputs,
  step1: RasStep1Outputs
): RasStep2Outputs {
  const {
    feedProteinPercent,
    desiredTAN,
    passiveNitrificationPercent,
    passiveDenitrificationPercent,
    maxNitrateN,
    biofilterEfficiencyPercent,
  } = inputs;

  const { feedRateKgDay } = step1;

  // B19: Tasa prod. TAN = 0.065 * FeedRate * (FeedProtein / 100)
  const tanProductionKgDay = 0.065 * feedRateKgDay * (feedProteinPercent / 100);

  // B20: % TAN respecto a alimento = B19 / B14
  const tanFromFeedPercent = feedRateKgDay > 0 ? (tanProductionKgDay / feedRateKgDay) * 100 : 0;

  // B23: TAN tras nitrificación pasiva = B19 * (1 - B22)
  const tanAfterPassiveKgDay = tanProductionKgDay * (1 - passiveNitrificationPercent / 100);

  // B26: Agua nueva requerida (L/día) = ((B23 * 1000000 * (1 - B24)) / B25)
  const safeMaxNitrate = Math.max(maxNitrateN, 0.01);
  const newWaterRequiredLday =
    (tanAfterPassiveKgDay * 1_000_000 * (1 - passiveDenitrificationPercent / 100)) / safeMaxNitrate;
  const newWaterRequiredM3day = newWaterRequiredLday / 1000;

  // B27: TAN disponible para biofiltro = B23 - (B21 / 1000000) * B26
  const tanInEffluentKgDay = (desiredTAN / 1_000_000) * newWaterRequiredLday;
  const tanAvailableBiofilterKgDay = Math.max(tanAfterPassiveKgDay - tanInEffluentKgDay, 0);

  // B29: Caudal requerido para remover TAN (L/día) = B27 / (B28 * (B21 / 1000000))
  const safeBioEfficiency = Math.max(biofilterEfficiencyPercent / 100, 0.01);
  const safeDesiredTAN = Math.max(desiredTAN, 0.01);
  const flowRateTAN_Lday =
    tanAvailableBiofilterKgDay / (safeBioEfficiency * (safeDesiredTAN / 1_000_000));

  // B30: Caudal L/min = B29 / 1440
  const flowRateTAN_Lmin = flowRateTAN_Lday / 1440;

  // B31: Caudal gal/min = B30 / 3.785
  const flowRateTAN_gpm = flowRateTAN_Lmin / 3.785;

  // B32: Caudal L/hr = B29 / 24
  const flowRateTAN_Lhr = flowRateTAN_Lday / 24;
  const flowRateTAN_M3hr = flowRateTAN_Lhr / 1000;

  return {
    tanProductionKgDay,
    tanFromFeedPercent,
    tanAfterPassiveKgDay,
    newWaterRequiredLday,
    newWaterRequiredM3day,
    tanAvailableBiofilterKgDay,
    flowRateTAN_Lday,
    flowRateTAN_Lmin,
    flowRateTAN_gpm,
    flowRateTAN_Lhr,
    flowRateTAN_M3hr,
  };
}

export function calculateStep3(
  inputs: RasInputs,
  step2: RasStep2Outputs
): RasStep3Outputs {
  const { nitrificationRate, mediaSpecificArea, mediaUnitPrice, mediaDepth } = inputs;
  const { tanAvailableBiofilterKgDay } = step2;

  // B36: Superficie activa requerida (m^2) = B27 / (B35 / 1000)
  const safeNitrificationRate = Math.max(nitrificationRate, 0.01);
  const activeSurfaceRequiredM2 = tanAvailableBiofilterKgDay / (safeNitrificationRate / 1000);

  // B38: Volumen total de medio (m^3) = B36 / B37
  const safeSpecificArea = Math.max(mediaSpecificArea, 1);
  const totalMediaVolumeM3 = activeSurfaceRequiredM2 / safeSpecificArea;

  // B40: Costo de medio (USD) = B39 * B38
  const mediaCostUSD = mediaUnitPrice * totalMediaVolumeM3;

  // B42: Área transversal de sección (m^2) = B38 / B41
  const safeMediaDepth = Math.max(mediaDepth, 0.1);
  const biofilterFaceAreaM2 = totalMediaVolumeM3 / safeMediaDepth;

  // B43: Diámetro del biofiltro cilíndrico (m) = 2 * SQRT(B42 / 3.1416)
  const biofilterDiameterM = 2 * Math.sqrt(biofilterFaceAreaM2 / Math.PI);

  return {
    activeSurfaceRequiredM2,
    totalMediaVolumeM3,
    mediaCostUSD,
    biofilterFaceAreaM2,
    biofilterDiameterM,
  };
}

export function calculateStep4(
  inputs: RasInputs,
  step1: RasStep1Outputs,
  step2: RasStep2Outputs
): RasStep4Outputs {
  const {
    feedToSolidsPercent,
    desiredSS,
    particleTrapPercent,
    solidsFilterEfficiencyPercent,
  } = inputs;

  const { feedRateKgDay } = step1;
  const { newWaterRequiredLday } = step2;

  // B48: Sólidos residuales producidos (kg/día) = B14 * B47
  const wasteSolidsProducedKgDay = feedRateKgDay * (feedToSolidsPercent / 100);

  // B51: Sólidos tras trampa de partículas = B48 * (1 - B50)
  const solidsAfterParticleTrapKgDay =
    wasteSolidsProducedKgDay * (1 - particleTrapPercent / 100);

  // B52: Sólidos restantes tras remoción por efluente = B51 - (B49 * B26 / 1000000)
  const solidsInEffluentKgDay = (desiredSS * newWaterRequiredLday) / 1_000_000;
  const solidsRemainingEffluentKgDay = Math.max(
    solidsAfterParticleTrapKgDay - solidsInEffluentKgDay,
    0
  );

  // B54: Caudal para remover SST (L/día) = B52 / (B53 * (B49 / 1000000))
  const safeSolidsEfficiency = Math.max(solidsFilterEfficiencyPercent / 100, 0.01);
  const safeDesiredSS = Math.max(desiredSS, 0.01);
  const flowRateSS_Lday =
    solidsRemainingEffluentKgDay / (safeSolidsEfficiency * (safeDesiredSS / 1_000_000));

  // B55: L/min = B54 / 1440
  const flowRateSS_Lmin = flowRateSS_Lday / 1440;

  // B56: gpm = B55 / 3.785
  const flowRateSS_gpm = flowRateSS_Lmin / 3.785;

  // B57: L/hr = B54 / 24
  const flowRateSS_Lhr = flowRateSS_Lday / 24;
  const flowRateSS_M3hr = flowRateSS_Lhr / 1000;

  return {
    wasteSolidsProducedKgDay,
    solidsAfterParticleTrapKgDay,
    solidsRemainingEffluentKgDay,
    flowRateSS_Lday,
    flowRateSS_Lmin,
    flowRateSS_gpm,
    flowRateSS_Lhr,
    flowRateSS_M3hr,
  };
}

export function calculateStep5(
  inputs: RasInputs,
  step1: RasStep1Outputs,
  step2: RasStep2Outputs
): RasStep5Outputs {
  const { submergedFilter, oxygenPerFeedPercent, desiredTankO2, suppliedO2 } = inputs;
  const { feedRateKgDay } = step1;
  const { tanProductionKgDay, tanAfterPassiveKgDay, tanAvailableBiofilterKgDay } = step2;

  // B62: Oxígeno consumido por alimento (kg/día) = B14 * B61
  const oxygenUsedFeedKgDay = feedRateKgDay * (oxygenPerFeedPercent / 100);

  // B65: Oxígeno consumido por nitrificación pasiva = (B19 - B23) * 4.57
  // Factor estequiométrico 4.57 g O2 / g NH4-N oxidado
  const oxygenPassiveNitrKgDay = (tanProductionKgDay - tanAfterPassiveKgDay) * 4.57;

  // B66: Oxígeno consumido por nitrificación en biofiltro = B60 * B27 * 4.57
  const filterFactor = submergedFilter ? 1 : 0;
  const oxygenBiofilterNitrKgDay = filterFactor * tanAvailableBiofilterKgDay * 4.57;

  // B67: Oxígeno total consumido (kg/día) = B62 + B65 + B66
  const totalOxygenUsedKgDay =
    oxygenUsedFeedKgDay + oxygenPassiveNitrKgDay + oxygenBiofilterNitrKgDay;

  // B68: Caudal estimado por balance de O2 = B67 / ((B64 - B63) / 1000000)
  const deltaO2 = Math.max(suppliedO2 - desiredTankO2, 0.1);
  const flowRateO2_Lday = totalOxygenUsedKgDay / (deltaO2 / 1_000_000);

  // B69: L/min = B68 / 1440
  const flowRateO2_Lmin = flowRateO2_Lday / 1440;

  // B70: gpm = B69 / 3.785
  const flowRateO2_gpm = flowRateO2_Lmin / 3.785;

  // B71: L/hr = B68 / 24
  const flowRateO2_Lhr = flowRateO2_Lday / 24;
  const flowRateO2_M3hr = flowRateO2_Lhr / 1000;

  return {
    oxygenUsedFeedKgDay,
    oxygenPassiveNitrKgDay,
    oxygenBiofilterNitrKgDay,
    totalOxygenUsedKgDay,
    flowRateO2_Lday,
    flowRateO2_Lmin,
    flowRateO2_gpm,
    flowRateO2_Lhr,
    flowRateO2_M3hr,
  };
}

export function calculateFullRas(inputs: RasInputs): RasOverallOutputs {
  const step1 = calculateStep1(inputs);
  const step2 = calculateStep2(inputs, step1);
  const step3 = calculateStep3(inputs, step2);
  const step4 = calculateStep4(inputs, step1, step2);
  const step5 = calculateStep5(inputs, step1, step2);

  // Determinación del caudal gobernante (Limiting Flow Rate)
  const rates = [
    { factor: 'O2' as const, rate: step5.flowRateO2_Lmin, lDay: step5.flowRateO2_Lday },
    { factor: 'TAN' as const, rate: step2.flowRateTAN_Lmin, lDay: step2.flowRateTAN_Lday },
    { factor: 'SST' as const, rate: step4.flowRateSS_Lmin, lDay: step4.flowRateSS_Lday },
  ];

  rates.sort((a, b) => b.rate - a.rate);
  const governing = rates[0];

  const governingM3hr = (governing.lDay / 24) / 1000;
  const tankVolume = Math.max(step1.tankVolume, 0.01);
  const turnoverPerHour = governingM3hr / tankVolume;
  const hrtMinutes = turnoverPerHour > 0 ? 60 / turnoverPerHour : 0;

  const tankVolumeLiters = tankVolume * 1000;
  const dailyWaterRenewalPercent =
    tankVolumeLiters > 0 ? (step2.newWaterRequiredLday / tankVolumeLiters) * 100 : 0;

  return {
    step1,
    step2,
    step3,
    step4,
    step5,
    governingFlowRate: {
      governingFactor: governing.factor,
      flowRateLmin: governing.rate,
      flowRateM3hr: governingM3hr,
      flowRateGpm: governing.rate / 3.785,
      flowRateLday: governing.lDay,
      turnoverPerHour,
      hrtMinutes,
    },
    dailyWaterRenewalPercent,
  };
}

/** Formateador numérico de ingeniería con separadores de miles y decimales */
export function formatNum(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '—';
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}
