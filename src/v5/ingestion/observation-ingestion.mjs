import { convertUnit, resolveUnitToken } from './unit-conversion.mjs';

const INGESTION_SCHEMA_VERSION = '5.0.0-observation-ingestion-1';
const MOTION_MODES = new Set(['not_applicable', 'active', 'passive', 'active_and_passive', 'isometric', 'dynamic']);
const SIDES = new Set(['left', 'right', 'bilateral', null]);

const REVIEW_MESSAGES = Object.freeze({
  missing_trace_identifier: 'Patient, assessment and observation identifiers are required before an observation can be accepted.',
  unknown_source_label: 'No exact approved test label or alias exists for this source system.',
  ambiguous_source_label: 'The exact source label resolves to more than one canonical test definition.',
  missing_source_provenance: 'The canonical test does not have a complete source/protocol provenance record.',
  ambiguous_bilateral_order: 'Bilateral values lack explicit side labels or an approved source ordering.',
  missing_bilateral_side: 'A bilateral result requires an explicit side.',
  missing_motion_mode: 'An active/passive result requires an explicit motion mode.',
  ambiguous_pain_context: 'Pain context cannot be assigned safely to a specific result.',
  invalid_numeric_value: 'The numeric result is not finite or cannot be parsed unambiguously.',
  missing_numeric_unit: 'The numeric result does not include a source-established unit.',
  unknown_unit: 'The supplied unit is not an exact approved unit token.',
  unresolved_canonical_unit: 'The canonical output unit is still unresolved for this test.',
  unsupported_unit_conversion: 'No approved centralized conversion exists between the supplied and canonical units.',
  unsupported_result_shape: 'The source result cannot be normalized without guessing.',
});

export function ingestObservation(input, { ontology } = {}) {
  const rawInput = structuredClone(input);
  if (!hasText(input?.observationId) || !hasText(input?.patientId) || !hasText(input?.assessmentId)) {
    return reviewResult('import_review', 'missing_trace_identifier', rawInput);
  }
  if (!ontology) return reviewResult('import_review', 'missing_source_provenance', rawInput);

  const resolution = resolveExactSourceName(ontology, input.sourceSystemId, input.sourceLabel);
  if (resolution.status !== 'resolved') {
    return reviewResult('import_review', resolution.reason, rawInput);
  }

  const definition = ontology.definitions.find((candidate) => candidate.id === resolution.definitionId);
  const sourceRecord = ontology.sourceInventoryRecords.find((record) => record.definitionId === resolution.definitionId);
  const protocolVersion = definition && ontology.protocolVersions.find(
    (version) => version.protocolId === definition.protocolId && version.version === definition.protocolVersion,
  );
  if (!definition || !sourceRecord || !protocolVersion) {
    return reviewResult('import_review', 'missing_source_provenance', rawInput, resolution.definitionId);
  }

  const rawText = rawTextFor(input.rawValue);
  const completion = completionFromRawText(rawText);
  if (completion) {
    return normalizedResult(rawInput, definition, [buildObservation({
      input,
      definition,
      sourceRecord,
      protocolVersion,
      rawText,
      side: explicitSideFor(input, sourceRecord),
      motionMode: explicitMotionFor(input, definition),
      numericValue: null,
      unit: definition.canonicalUnitId,
      ordinalValue: null,
      painPresent: false,
      painContext: null,
      completionState: completion.state,
      sourceCompletionLabel: completion.label,
      suffix: completion.state,
    })]);
  }

  if (rawText === null || rawText.trim() === '') {
    return normalizedResult(rawInput, definition, [buildObservation({
      input,
      definition,
      sourceRecord,
      protocolVersion,
      rawText,
      side: explicitSideFor(input, sourceRecord),
      motionMode: explicitMotionFor(input, definition),
      numericValue: null,
      unit: definition.canonicalUnitId,
      ordinalValue: null,
      painPresent: false,
      painContext: null,
      completionState: 'not_measured',
      sourceCompletionLabel: null,
      suffix: 'not-measured',
    })]);
  }

  if (['qualitative', 'ordinal', 'performance_task', 'binary'].includes(definition.resultType)) {
    const qualitative = parseQualitative(rawText, input, definition, sourceRecord);
    if (qualitative.reviewCode) {
      return reviewResult('parse_review', qualitative.reviewCode, rawInput, definition.id);
    }
    return normalizedResult(rawInput, definition, [buildObservation({
      input,
      definition,
      sourceRecord,
      protocolVersion,
      rawText,
      side: qualitative.side,
      motionMode: qualitative.motionMode,
      numericValue: null,
      unit: definition.canonicalUnitId,
      ordinalValue: qualitative.value,
      painPresent: qualitative.painPresent,
      painContext: qualitative.painContext,
      completionState: qualitative.painPresent ? 'pain_limited' : 'measured',
      sourceCompletionLabel: null,
      suffix: qualitative.side ?? 'result',
    })]);
  }

  const parsed = parseNumericResults(rawText, input, definition, sourceRecord);
  if (parsed.reviewCode) {
    return reviewResult('parse_review', parsed.reviewCode, rawInput, definition.id);
  }

  const observations = [];
  for (const [index, result] of parsed.results.entries()) {
    const normalizedUnit = normalizeNumericUnit(result.value, result.unitToken, input.unit, definition, sourceRecord);
    if (normalizedUnit.reviewCode) {
      return reviewResult('parse_review', normalizedUnit.reviewCode, rawInput, definition.id);
    }
    observations.push(buildObservation({
      input,
      definition,
      sourceRecord,
      protocolVersion,
      rawText,
      side: result.side,
      motionMode: result.motionMode,
      numericValue: normalizedUnit.value,
      unit: normalizedUnit.unit,
      ordinalValue: null,
      painPresent: result.painPresent,
      painContext: result.painContext,
      completionState: result.painPresent ? 'pain_limited' : 'measured',
      sourceCompletionLabel: null,
      suffix: [result.side, result.motionMode, index].filter((value) => value !== null).join('-'),
    }));
  }
  return normalizedResult(rawInput, definition, observations);
}

function resolveExactSourceName(ontology, sourceSystemId, sourceLabel) {
  if (!hasText(sourceSystemId) || !hasText(sourceLabel)) return { status: 'review', reason: 'unknown_source_label' };
  const candidates = [];
  for (const row of ontology.knownSourceRows) {
    if (row.sourceSystemId !== sourceSystemId) continue;
    if (row.sourceLabel === sourceLabel || row.sourceMetadata?.originalLabel === sourceLabel) {
      candidates.push(row.expectedDefinitionId);
    }
  }
  for (const alias of ontology.aliases) {
    if (alias.sourceSystemId === sourceSystemId && alias.sourceLabel === sourceLabel && alias.matchType === 'exact') {
      candidates.push(alias.definitionId);
    }
  }
  const unique = [...new Set(candidates)];
  if (unique.length === 0) return { status: 'review', reason: 'unknown_source_label' };
  if (unique.length > 1) return { status: 'review', reason: 'ambiguous_source_label' };
  return { status: 'resolved', definitionId: unique[0] };
}

function parseNumericResults(rawText, input, definition, sourceRecord) {
  const segments = rawText.split(/\s*[,;]\s*/).filter((segment) => segment.length > 0);
  const painSegments = segments.filter((segment) => /^pain at end range$/i.test(segment));
  const valueSegments = segments.filter((segment) => !/^pain at end range$/i.test(segment));
  if (painSegments.length > 0 && valueSegments.length !== 1) return { reviewCode: 'ambiguous_pain_context' };

  if (definition.resultType === 'bilateral_scalar' && valueSegments.length === 1) {
    const numberCount = valueSegments[0].match(/[+-]?(?:\d+(?:\.\d*)?|\.\d+)/g)?.length ?? 0;
    if (numberCount > 1 && !/^(left|right)\b/i.test(valueSegments[0])) {
      return { reviewCode: 'ambiguous_bilateral_order' };
    }
  }

  const results = [];
  for (const segment of valueSegments) {
    const labeled = /^(left|right)(?:\s+(active|passive))?\s*:\s*(.+)$/i.exec(segment);
    const valueText = labeled ? labeled[3] : segment;
    const parsedValue = parseNumberAndUnit(valueText);
    if (!parsedValue) return { reviewCode: 'invalid_numeric_value' };

    const side = labeled?.[1]?.toLowerCase() ?? explicitSideFor(input, sourceRecord);
    if (!SIDES.has(side)) return { reviewCode: 'unsupported_result_shape' };
    if (definition.resultType === 'bilateral_scalar' && side === null) return { reviewCode: 'missing_bilateral_side' };

    const labeledMotion = labeled?.[2]?.toLowerCase() ?? null;
    const motionMode = labeledMotion ?? explicitMotionFor(input, definition);
    if (!MOTION_MODES.has(motionMode)) return { reviewCode: 'unsupported_result_shape' };
    if (definition.motionMode === 'active_and_passive' && !labeledMotion && !hasText(input.motionMode)) {
      return { reviewCode: 'missing_motion_mode' };
    }

    results.push({
      side,
      motionMode,
      value: parsedValue.value,
      unitToken: parsedValue.unitToken,
      painPresent: painSegments.length === 1 || input.painPresent === true,
      painContext: painSegments.length === 1 ? 'end_range' : input.painContext ?? null,
    });
  }
  return results.length ? { results } : { reviewCode: 'unsupported_result_shape' };
}

function parseQualitative(rawText, input, definition, sourceRecord) {
  const match = /^(left|right)(?:\s+(active|passive))?\s*:\s*(.+)$/i.exec(rawText);
  const side = match?.[1]?.toLowerCase() ?? explicitSideFor(input, sourceRecord);
  if (!SIDES.has(side)) return { reviewCode: 'unsupported_result_shape' };
  if (definition.lateralityModel === 'left_right' && side === null) return { reviewCode: 'missing_bilateral_side' };
  const labeledMotion = match?.[2]?.toLowerCase() ?? null;
  const motionMode = labeledMotion ?? explicitMotionFor(input, definition);
  if (!MOTION_MODES.has(motionMode)) return { reviewCode: 'unsupported_result_shape' };
  if (definition.motionMode === 'active_and_passive' && !labeledMotion && !hasText(input.motionMode)) {
    return { reviewCode: 'missing_motion_mode' };
  }
  const value = (match?.[3] ?? rawText).trim();
  if (!value) return { reviewCode: 'unsupported_result_shape' };
  const painAtEndRange = /(?:^|[;,]\s*)pain at end range$/i.test(value);
  return {
    side,
    motionMode,
    value: value.replace(/[;,]\s*pain at end range$/i, '').trim(),
    painPresent: painAtEndRange || input.painPresent === true,
    painContext: painAtEndRange ? 'end_range' : input.painContext ?? null,
  };
}

function parseNumberAndUnit(valueText) {
  const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*(.*?)$/.exec(valueText.trim());
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  return { value, unitToken: match[2].trim() || null };
}

function normalizeNumericUnit(value, parsedUnitToken, inputUnitToken, definition, sourceRecord) {
  const suppliedToken = parsedUnitToken ?? (hasText(inputUnitToken) ? inputUnitToken : null);
  let sourceUnit = suppliedToken ? resolveUnitToken(suppliedToken) : sourceRecord.unambiguousCanonicalUnitId;
  if (suppliedToken && !sourceUnit) return { reviewCode: 'unknown_unit' };
  if (!sourceUnit) return { reviewCode: 'missing_numeric_unit' };
  if (!definition.canonicalUnitId) return { reviewCode: 'unresolved_canonical_unit' };

  const converted = convertUnit(value, sourceUnit, definition.canonicalUnitId);
  if (converted.status === 'review') return { reviewCode: converted.reason };
  return { value: converted.value, unit: converted.unit };
}

function explicitSideFor(input, sourceRecord) {
  if (hasText(input.side)) return input.side.toLowerCase();
  if (/^left(?:-|\b)/i.test(sourceRecord.originalLabel)) return 'left';
  if (/^right(?:-|\b)/i.test(sourceRecord.originalLabel)) return 'right';
  return null;
}

function explicitMotionFor(input, definition) {
  if (hasText(input.motionMode)) return input.motionMode.toLowerCase();
  return definition.motionMode;
}

function completionFromRawText(rawText) {
  if (typeof rawText !== 'string') return null;
  const normalized = rawText.trim().toLowerCase();
  if (normalized === 'skip') return { state: 'skipped', label: 'Skip' };
  if (normalized === 'omit') return { state: 'skipped', label: 'Omit' };
  if (normalized === 'redundant') return { state: 'redundant', label: 'Redundant' };
  if (normalized === 'contraindicated') return { state: 'contraindicated', label: 'Contraindicated' };
  if (normalized === 'unable') return { state: 'unable', label: 'Unable' };
  if (normalized === 'not measured') return { state: 'not_measured', label: 'Not measured' };
  return null;
}

function buildObservation({
  input,
  definition,
  sourceRecord,
  protocolVersion,
  rawText,
  side,
  motionMode,
  numericValue,
  unit,
  ordinalValue,
  painPresent,
  painContext,
  completionState,
  sourceCompletionLabel,
  suffix,
}) {
  return {
    id: suffix ? `${input.observationId}.${suffix}` : input.observationId,
    patientId: input.patientId,
    assessmentId: input.assessmentId,
    testDefinitionId: definition.id,
    measuredAt: input.measuredAt ?? null,
    side,
    motionMode,
    numericValue,
    unit,
    ordinalValue,
    rawText,
    rawValue: structuredClone(input.rawValue),
    painPresent,
    painContext,
    compensation: input.compensation ?? null,
    qualityGrade: input.qualityGrade ?? null,
    completionState,
    sourceCompletionLabel,
    notes: input.notes ?? null,
    sourceProvenance: {
      provenanceKind: 'measurement_observation_source',
      sourceSystemId: input.sourceSystemId,
      sourceLabel: input.sourceLabel,
      sourceOriginalLabel: sourceRecord.originalLabel,
      sourceSurface: sourceRecord.sourceSurface,
      sourceInventoryRecordId: sourceRecord.id,
      sourceSnapshotId: sourceRecord.sourceSnapshotId,
      protocolId: definition.protocolId,
      protocolVersion: definition.protocolVersion,
      protocolApprovalState: protocolVersion.approvalState,
      deviceReference: input.deviceReference ? structuredClone(input.deviceReference) : null,
    },
  };
}

function normalizedResult(rawInput, definition, observations) {
  return {
    schemaVersion: INGESTION_SCHEMA_VERSION,
    status: 'normalized',
    rawInput,
    testDefinitionId: definition.id,
    observations,
    review: null,
  };
}

function reviewResult(status, code, rawInput, testDefinitionId = null) {
  return {
    schemaVersion: INGESTION_SCHEMA_VERSION,
    status,
    rawInput,
    testDefinitionId,
    observations: [],
    review: { code, message: REVIEW_MESSAGES[code] ?? 'Manual import review is required.' },
  };
}

function rawTextFor(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
