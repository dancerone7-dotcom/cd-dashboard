const KILOGRAM_TO_POUND = 2.20462262185;

const UNIT_TOKENS = new Map([
  ['°', 'degree'],
  ['degree', 'degree'],
  ['degrees', 'degree'],
  ['s', 'second'],
  ['sec', 'second'],
  ['second', 'second'],
  ['seconds', 'second'],
  ['rep', 'repetition'],
  ['reps', 'repetition'],
  ['lb', 'pound'],
  ['lbs', 'pound'],
  ['pound', 'pound'],
  ['pounds', 'pound'],
  ['kg', 'kilogram'],
  ['% bw', 'percent_bodyweight'],
  ['× bw', 'multiple_bodyweight'],
  ['x bw', 'multiple_bodyweight'],
  ['w', 'watt'],
  ['w/kg', 'watt_per_kilogram'],
  ['ml/kg/min', 'milliliter_per_kilogram_minute'],
  ['l/min', 'liter_per_minute'],
  ['met', 'met'],
  ['mets', 'met'],
  ['bpm', 'beat_per_minute'],
  ['% grade', 'treadmill_incline_percent'],
  ['t-score', 't_score'],
  ['z-score', 'z_score'],
  ['percentile', 'percentile'],
  ['%', 'percent'],
  ['kg/m²', 'kilogram_per_square_meter'],
  ['kg/m2', 'kilogram_per_square_meter'],
  ['cm', 'centimeter'],
  ['m/s', 'meter_per_second'],
  ['nm/kg', 'newton_meter_per_kilogram'],
]);

const CONVERSIONS = new Map([
  ['kilogram:pound', { id: 'kilogram_to_pound', apply: (value) => value * KILOGRAM_TO_POUND }],
  ['pound:kilogram', { id: 'pound_to_kilogram', apply: (value) => value / KILOGRAM_TO_POUND }],
  ['percent_bodyweight:multiple_bodyweight', { id: 'percent_bodyweight_to_multiple_bodyweight', apply: (value) => value / 100 }],
  ['multiple_bodyweight:percent_bodyweight', { id: 'multiple_bodyweight_to_percent_bodyweight', apply: (value) => value * 100 }],
]);

export function resolveUnitToken(token) {
  if (typeof token !== 'string') return null;
  const normalized = token.trim().replaceAll(/\s+/g, ' ').toLowerCase();
  return UNIT_TOKENS.get(normalized) ?? null;
}

export function convertUnit(value, fromUnit, toUnit) {
  if (!Number.isFinite(value)) {
    return { status: 'review', reason: 'invalid_numeric_value', fromUnit, toUnit };
  }
  if (fromUnit === toUnit) {
    return { status: 'unchanged', value, unit: toUnit, conversionId: null };
  }
  const conversion = CONVERSIONS.get(`${fromUnit}:${toUnit}`);
  if (!conversion) {
    return { status: 'review', reason: 'unsupported_unit_conversion', fromUnit, toUnit };
  }
  return {
    status: 'converted',
    value: conversion.apply(value),
    unit: toUnit,
    conversionId: conversion.id,
  };
}
