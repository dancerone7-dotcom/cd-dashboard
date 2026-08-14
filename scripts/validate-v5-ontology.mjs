import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
const ONTOLOGY_DIR = path.join('src', 'v5', 'ontology');

const FILES = Object.freeze({
  definitions: 'assessment-test-definitions.json',
  sourceSystems: 'source-systems.json',
  protocols: 'protocols.json',
  protocolVersions: 'protocol-versions.json',
  aliases: 'test-aliases.json',
  units: 'units.json',
  completionStates: 'completion-states.json',
  sourceInventory: 'source-inventory.json',
});

const SURFACE_ORDER = Object.freeze([
  'pca_master',
  'prom_orthopedic',
  'cpet_tracker',
  'dexa_tracker',
  'v4_vald',
  'v4_timed_stance',
]);

const EXPECTED_SURFACE_COUNTS = Object.freeze({
  pca_master: 49,
  prom_orthopedic: 39,
  cpet_tracker: 18,
  dexa_tracker: 18,
  v4_vald: 14,
  v4_timed_stance: 2,
});

const LATERALITY_MODELS = new Set(['none', 'left_right', 'bilateral']);
const MOTION_MODES = new Set([
  'not_applicable',
  'active',
  'passive',
  'active_and_passive',
  'isometric',
  'dynamic',
]);
const POSITIONS = new Set([
  'not_applicable',
  'supine',
  'prone',
  'seated',
  'standing',
  'half_kneeling',
  'quadruped',
  'other',
]);
const RESULT_TYPES = new Set([
  'scalar',
  'bilateral_scalar',
  'ordinal',
  'binary',
  'qualitative',
  'performance_task',
]);
const CLINICAL_DOMAINS = new Set([
  'aerobic',
  'body_composition',
  'strength',
  'power',
  'reactivity',
  'endurance',
  'balance',
  'mobility',
  'movement_quality',
  'orthopedic_screen',
]);
const REQUIRED_COMPLETION_STATES = Object.freeze([
  'measured',
  'not_measured',
  'skipped',
  'contraindicated',
  'pain_limited',
  'unable',
  'redundant',
]);
const SOURCE_METADATA_FIELDS = Object.freeze([
  'originalLabel',
  'sourceSurface',
  'sourceSystemId',
  'positionLabel',
  'categoryLabel',
  'explicitMotionWording',
  'explicitUnitWording',
  'originalRowIdentifier',
  'sourceSnapshotId',
]);
const SOURCE_PROTOCOL_FIELDS = Object.freeze([
  'position',
  'motionMode',
  'equipment',
  'trialCount',
  'lateralityConvention',
  'selectedOutput',
  'aggregationRule',
  'setupDetails',
  'timeCapSeconds',
  'captureSopApprovalState',
]);
const SOURCE_POSITION_TO_CANONICAL = new Map([
  ['Supine', 'supine'],
  ['Prone', 'prone'],
  ['Seated', 'seated'],
  ['Standing', 'standing'],
  ['Other Table', 'other'],
]);

function addError(errors, code, message) {
  errors.push({ code, message });
}

function duplicateValues(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = item?.[key];
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

function countBy(items, key, initialKeys = []) {
  const result = Object.fromEntries(initialKeys.map((initialKey) => [initialKey, 0]));
  for (const item of items) {
    const value = item[key];
    result[value] = (result[value] ?? 0) + 1;
  }
  return result;
}

function protocolKey(protocolId, version) {
  return `${protocolId}@${version}`;
}

function findPatientData(value, currentPath = '$', findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findPatientData(item, `${currentPath}[${index}]`, findings));
    return findings;
  }
  if (!value || typeof value !== 'object') return findings;

  for (const [key, child] of Object.entries(value)) {
    if (/^(patient(id|name|email|dob|dateofbirth)|mrn|medicalrecordnumber)$/i.test(key)) {
      findings.push(`${currentPath}.${key}`);
    }
    findPatientData(child, `${currentPath}.${key}`, findings);
  }
  return findings;
}

async function readJson(root, filename) {
  const filePath = path.join(root, ONTOLOGY_DIR, filename);
  return JSON.parse(await readFile(filePath, 'utf8'));
}

export async function loadOntology(root = DEFAULT_ROOT) {
  const [definitionsFile, sourceSystemsFile, protocolsFile, protocolVersionsFile, aliasesFile, unitsFile, completionStatesFile, sourceInventoryFile] =
    await Promise.all([
      readJson(root, FILES.definitions),
      readJson(root, FILES.sourceSystems),
      readJson(root, FILES.protocols),
      readJson(root, FILES.protocolVersions),
      readJson(root, FILES.aliases),
      readJson(root, FILES.units),
      readJson(root, FILES.completionStates),
      readJson(root, FILES.sourceInventory),
    ]);

  return {
    schemaVersion: definitionsFile.schemaVersion,
    knownSourceRows: definitionsFile.knownSourceRows,
    definitions: definitionsFile.definitions,
    sourceSystems: sourceSystemsFile.sourceSystems,
    protocols: protocolsFile.protocols,
    protocolVersions: protocolVersionsFile.protocolVersions,
    aliases: aliasesFile.aliases,
    units: unitsFile.units,
    completionStates: completionStatesFile.completionStates,
    sourceSnapshots: sourceInventoryFile.sourceSnapshots,
    sourceInventoryRecords: sourceInventoryFile.sourceInventoryRecords,
  };
}

export function resolveSourceName(ontology, { sourceSystemId, sourceLabel }) {
  const candidates = [];
  for (const row of ontology.knownSourceRows ?? []) {
    if (row.sourceSystemId === sourceSystemId && row.sourceLabel === sourceLabel) {
      candidates.push({ definitionId: row.expectedDefinitionId, matchType: 'canonical' });
    }
    if (row.sourceSystemId === sourceSystemId && row.sourceMetadata?.originalLabel === sourceLabel) {
      candidates.push({ definitionId: row.expectedDefinitionId, matchType: 'source_original' });
    }
  }
  for (const alias of ontology.aliases ?? []) {
    if (alias.sourceSystemId === sourceSystemId && alias.sourceLabel === sourceLabel) {
      candidates.push({ definitionId: alias.definitionId, matchType: 'alias' });
    }
  }

  const definitionIds = [...new Set(candidates.map((candidate) => candidate.definitionId))];
  if (definitionIds.length === 0) return { status: 'import_review', reason: 'unknown_source_label' };
  if (definitionIds.length > 1) return { status: 'import_review', reason: 'ambiguous_source_label' };

  const canonical = candidates.find((candidate) => candidate.matchType === 'canonical');
  return {
    status: 'resolved',
    definitionId: definitionIds[0],
    matchType: canonical ? 'canonical' : candidates.some((candidate) => candidate.matchType === 'source_original') ? 'source_original' : 'alias',
  };
}

function canonicalMotionFromSourceWording(wording) {
  if (!wording) return null;
  const normalized = wording.toLowerCase().replaceAll(' ', '');
  if (normalized === 'active/passive') return 'active_and_passive';
  if (normalized === 'active') return 'active';
  if (normalized === 'passive') return 'passive';
  if (normalized === 'isometric') return 'isometric';
  if (normalized === 'dynamic') return 'dynamic';
  return null;
}

export function validateOntology(ontology) {
  const errors = [];
  const definitions = ontology.definitions ?? [];
  const rows = ontology.knownSourceRows ?? [];
  const sourceSystems = ontology.sourceSystems ?? [];
  const units = ontology.units ?? [];
  const protocols = ontology.protocols ?? [];
  const protocolVersions = ontology.protocolVersions ?? [];
  const aliases = ontology.aliases ?? [];
  const completionStates = ontology.completionStates ?? [];
  const sourceSnapshots = ontology.sourceSnapshots ?? [];
  const sourceInventoryRecords = ontology.sourceInventoryRecords ?? [];

  for (const id of duplicateValues(definitions, 'id')) {
    addError(errors, 'DUPLICATE_DEFINITION_ID', `Duplicate assessment definition ID: ${id}`);
  }
  for (const slug of duplicateValues(definitions, 'slug')) {
    addError(errors, 'DUPLICATE_DEFINITION_SLUG', `Duplicate assessment definition slug: ${slug}`);
  }
  for (const id of duplicateValues(sourceSystems, 'id')) {
    addError(errors, 'DUPLICATE_SOURCE_SYSTEM_ID', `Duplicate source-system ID: ${id}`);
  }
  for (const id of duplicateValues(units, 'id')) {
    addError(errors, 'DUPLICATE_UNIT_ID', `Duplicate unit ID: ${id}`);
  }
  for (const id of duplicateValues(protocols, 'id')) {
    addError(errors, 'DUPLICATE_PROTOCOL_ID', `Duplicate protocol ID: ${id}`);
  }
  const protocolVersionCounts = new Map();
  for (const version of protocolVersions) {
    const key = protocolKey(version.protocolId, version.version);
    protocolVersionCounts.set(key, (protocolVersionCounts.get(key) ?? 0) + 1);
  }
  for (const [key, count] of protocolVersionCounts) {
    if (count > 1) addError(errors, 'DUPLICATE_PROTOCOL_VERSION', `Duplicate protocol/version: ${key}`);
  }
  for (const id of duplicateValues(rows, 'id')) {
    addError(errors, 'DUPLICATE_KNOWN_ROW_ID', `Duplicate known-source row ID: ${id}`);
  }
  for (const id of duplicateValues(sourceInventoryRecords, 'id')) {
    addError(errors, 'DUPLICATE_SOURCE_INVENTORY_ID', `Duplicate source-inventory record ID: ${id}`);
  }
  for (const id of duplicateValues(sourceSnapshots, 'id')) {
    addError(errors, 'DUPLICATE_SOURCE_SNAPSHOT_ID', `Duplicate source-snapshot ID: ${id}`);
  }

  const sourceIds = new Set(sourceSystems.map((source) => source.id));
  const unitIds = new Set(units.map((unit) => unit.id));
  const definitionIds = new Set(definitions.map((definition) => definition.id));
  const protocolIds = new Set(protocols.map((protocol) => protocol.id));
  const versionKeys = new Set(protocolVersions.map((version) => protocolKey(version.protocolId, version.version)));
  const sourceSnapshotIds = new Set(sourceSnapshots.map((snapshot) => snapshot.id));
  for (const source of sourceSystems) {
    if (source.provenanceKind !== 'measurement_source') {
      addError(errors, 'INVALID_MEASUREMENT_PROVENANCE_KIND', `${source.id} is not typed as measurement-source provenance`);
    }
  }
  for (const snapshot of sourceSnapshots) {
    if (!snapshot.id || !snapshot.displayName || !snapshot.scope || !snapshot.captureState) {
      addError(errors, 'INCOMPLETE_SOURCE_SNAPSHOT', `${snapshot.id || '<source snapshot>'} lacks required capture metadata`);
    }
    if (snapshot.provenanceKind !== 'measurement_source_snapshot') {
      addError(errors, 'INVALID_MEASUREMENT_PROVENANCE_KIND', `${snapshot.id} is not typed as a measurement-source snapshot`);
    }
  }

  for (const definition of definitions) {
    const prefix = definition.id || '<definition without ID>';
    for (const field of [
      'id',
      'slug',
      'displayName',
      'clinicalDomain',
      'sourceSystemId',
      'resultType',
      'lateralityModel',
      'motionMode',
      'position',
      'protocolId',
      'protocolVersion',
    ]) {
      if (definition[field] === undefined || definition[field] === null || definition[field] === '') {
        addError(errors, 'MISSING_REQUIRED_FIELD', `${prefix} is missing ${field}`);
      }
    }
    if (!Object.hasOwn(definition, 'canonicalUnitId')) {
      addError(errors, 'MISSING_REQUIRED_FIELD', `${prefix} is missing canonicalUnitId (use explicit null when unresolved)`);
    }
    if (!sourceIds.has(definition.sourceSystemId)) {
      addError(errors, 'UNKNOWN_SOURCE_SYSTEM', `${prefix} references unknown source ${definition.sourceSystemId}`);
    }
    if (definition.canonicalUnitId !== null && !unitIds.has(definition.canonicalUnitId)) {
      addError(errors, 'UNKNOWN_UNIT', `${prefix} references unknown unit ${definition.canonicalUnitId}`);
    }
    if (!RESULT_TYPES.has(definition.resultType)) {
      addError(errors, 'INVALID_RESULT_TYPE', `${prefix} has invalid result type ${definition.resultType}`);
    }
    if (!CLINICAL_DOMAINS.has(definition.clinicalDomain)) {
      addError(errors, 'INVALID_CLINICAL_DOMAIN', `${prefix} has invalid clinical domain ${definition.clinicalDomain}`);
    }
    if (!LATERALITY_MODELS.has(definition.lateralityModel)) {
      addError(errors, 'INVALID_LATERALITY', `${prefix} has invalid laterality ${definition.lateralityModel}`);
    }
    if (!MOTION_MODES.has(definition.motionMode)) {
      addError(errors, 'INVALID_MOTION_MODE', `${prefix} has invalid motion mode ${definition.motionMode}`);
    }
    if (!POSITIONS.has(definition.position)) {
      addError(errors, 'INVALID_POSITION', `${prefix} has invalid position ${definition.position}`);
    }
    if (!protocolIds.has(definition.protocolId)) {
      addError(errors, 'UNKNOWN_PROTOCOL', `${prefix} references unknown protocol ${definition.protocolId}`);
    }
    if (!versionKeys.has(protocolKey(definition.protocolId, definition.protocolVersion))) {
      addError(
        errors,
        'UNKNOWN_PROTOCOL_VERSION',
        `${prefix} references unknown protocol/version ${protocolKey(definition.protocolId, definition.protocolVersion)}`,
      );
    }
  }

  for (const protocol of protocols) {
    if (!sourceIds.has(protocol.sourceSystemId)) {
      addError(errors, 'UNKNOWN_SOURCE_SYSTEM', `${protocol.id} references unknown source ${protocol.sourceSystemId}`);
    }
  }
  for (const version of protocolVersions) {
    if (!protocolIds.has(version.protocolId)) {
      addError(errors, 'UNKNOWN_PROTOCOL', `Protocol version references unknown protocol ${version.protocolId}`);
    }
    if (!['pending', 'approved', 'retired'].includes(version.approvalState)) {
      addError(errors, 'INVALID_APPROVAL_STATE', `${protocolKey(version.protocolId, version.version)} has invalid approval state`);
    }
    if (version.position !== null && !POSITIONS.has(version.position)) {
      addError(errors, 'INVALID_POSITION', `${protocolKey(version.protocolId, version.version)} has invalid position ${version.position}`);
    }
    if (version.motionMode !== null && !MOTION_MODES.has(version.motionMode)) {
      addError(errors, 'INVALID_MOTION_MODE', `${protocolKey(version.protocolId, version.version)} has invalid motion mode ${version.motionMode}`);
    }
    if (!version.provenance) {
      addError(errors, 'MISSING_PROTOCOL_PROVENANCE', `${protocolKey(version.protocolId, version.version)} lacks provenance`);
    }
    if (version.provenanceKind !== 'measurement_protocol') {
      addError(errors, 'INVALID_MEASUREMENT_PROVENANCE_KIND', `${protocolKey(version.protocolId, version.version)} is not typed as a measurement protocol`);
    }
    for (const field of ['protocolOwner', 'approvalDate']) {
      if (!Object.hasOwn(version, field) || version[field] !== null || !(version.pendingFields ?? []).includes(field)) {
        addError(errors, 'PROTOCOL_OWNER_FIELD_NOT_PENDING', `${protocolKey(version.protocolId, version.version)} must keep ${field} explicitly null and pending`);
      }
    }
    for (const field of version.pendingFields ?? []) {
      if (!Object.hasOwn(version, field)) {
        addError(errors, 'PENDING_PROTOCOL_FIELD_DROPPED', `${protocolKey(version.protocolId, version.version)} lists missing pending field ${field}`);
      } else if (version[field] !== null && version[field] !== 'pending') {
        addError(errors, 'PENDING_PROTOCOL_FIELD_RESOLVED_SILENTLY', `${protocolKey(version.protocolId, version.version)} marks non-pending ${field} as pending`);
      }
    }
  }

  const protocolsById = new Map(protocols.map((protocol) => [protocol.id, protocol]));
  for (const definition of definitions) {
    const protocol = protocolsById.get(definition.protocolId);
    if (protocol && protocol.sourceSystemId !== definition.sourceSystemId) {
      addError(errors, 'PROTOCOL_SOURCE_MISMATCH', `${definition.id} and ${protocol.id} do not share a source system`);
    }
  }

  const definitionsByRow = new Map();
  for (const definition of definitions) {
    for (const rowId of definition.inventoryRowIds ?? []) {
      const matches = definitionsByRow.get(rowId) ?? [];
      matches.push(definition);
      definitionsByRow.set(rowId, matches);
    }
  }
  for (const row of rows) {
    const matches = definitionsByRow.get(row.id) ?? [];
    if (matches.length === 0) {
      addError(errors, 'KNOWN_ROW_UNRESOLVED', `${row.id} does not resolve to a definition`);
    } else if (matches.length > 1) {
      addError(errors, 'KNOWN_ROW_MULTIPLE', `${row.id} resolves to ${matches.length} definitions`);
    } else if (matches[0].id !== row.expectedDefinitionId) {
      addError(errors, 'KNOWN_ROW_WRONG_DEFINITION', `${row.id} resolves to ${matches[0].id}, expected ${row.expectedDefinitionId}`);
    }
    if (row.lateralityRequired && matches.length === 1 && matches[0].lateralityModel === 'none') {
      addError(errors, 'LATERALITY_REQUIRED', `${row.id} requires laterality but ${matches[0].id} uses none`);
    }
    if (row.expectedSourceSystemId && matches.length === 1 && matches[0].sourceSystemId !== row.expectedSourceSystemId) {
      const code = row.surface === 'v4_vald' ? 'VALD_SOURCE_GENERALIZED' : 'SOURCE_SYSTEM_MISMATCH';
      addError(errors, code, `${row.id} must retain source ${row.expectedSourceSystemId}`);
    }
  }
  for (const [rowId] of definitionsByRow) {
    if (!rows.some((row) => row.id === rowId)) {
      addError(errors, 'UNKNOWN_INVENTORY_ROW', `Definition references unknown inventory row ${rowId}`);
    }
  }

  const sourceRecordsById = new Map(sourceInventoryRecords.map((record) => [record.id, record]));
  const sourceRecordUseCounts = new Map();
  for (const row of rows) {
    const record = sourceRecordsById.get(row.sourceInventoryRecordId);
    if (!record) {
      addError(errors, 'SOURCE_INVENTORY_UNRESOLVED', `${row.id} does not reference a source-inventory record`);
      continue;
    }
    sourceRecordUseCounts.set(record.id, (sourceRecordUseCounts.get(record.id) ?? 0) + 1);
    if (record.definitionId !== row.expectedDefinitionId) {
      addError(errors, 'SOURCE_INVENTORY_DEFINITION_MISMATCH', `${row.id} source record points to ${record.definitionId}`);
    }
    if (record.sourceSurface !== row.surface || record.sourceSystemId !== row.sourceSystemId) {
      addError(errors, 'SOURCE_METADATA_MISMATCH', `${row.id} source surface or system was rewritten`);
    }
    if (!record.originalLabel) {
      addError(errors, 'SOURCE_LABEL_MISSING', `${record.id} does not preserve an original source label`);
    }
    if (!sourceSnapshotIds.has(record.sourceSnapshotId)) {
      addError(errors, 'UNKNOWN_SOURCE_SNAPSHOT', `${record.id} references unknown snapshot ${record.sourceSnapshotId}`);
    }
    for (const field of SOURCE_METADATA_FIELDS) {
      if (!Object.hasOwn(record, field) || !Object.hasOwn(row.sourceMetadata ?? {}, field)) {
        addError(errors, 'SOURCE_METADATA_DROPPED', `${row.id} does not preserve source field ${field}`);
      } else if (row.sourceMetadata[field] !== record[field]) {
        addError(errors, 'SOURCE_METADATA_MISMATCH', `${row.id} rewrites source field ${field}`);
      }
    }

    if (!record.sourceProtocolMetadata || typeof record.sourceProtocolMetadata !== 'object') {
      addError(errors, 'SOURCE_PROTOCOL_METADATA_DROPPED', `${record.id} lacks independent source protocol metadata`);
    } else {
      const sourceProtocolKeys = Object.keys(record.sourceProtocolMetadata).sort();
      const expectedProtocolKeys = [...SOURCE_PROTOCOL_FIELDS].sort();
      if (JSON.stringify(sourceProtocolKeys) !== JSON.stringify(expectedProtocolKeys)) {
        addError(errors, 'SOURCE_PROTOCOL_METADATA_DROPPED', `${record.id} does not preserve the complete source protocol field set`);
      }
    }
    if (!Object.hasOwn(record, 'unambiguousLateralityModel')) {
      addError(errors, 'SOURCE_LATERALITY_METADATA_DROPPED', `${record.id} lacks explicit source laterality interpretation state`);
    }

    const definition = definitions.find((candidate) => candidate.id === row.expectedDefinitionId);
    if (!definition) continue;
    const protocolVersion = protocolVersions.find(
      (version) => version.protocolId === definition.protocolId && version.version === definition.protocolVersion,
    );
    if (record.sourceProtocolMetadata && protocolVersion) {
      for (const field of SOURCE_PROTOCOL_FIELDS) {
        if (!Object.hasOwn(protocolVersion, field)) {
          addError(errors, 'SOURCE_PROTOCOL_FIELD_DROPPED', `${definition.id} protocol drops source field ${field}`);
        } else if (protocolVersion[field] !== record.sourceProtocolMetadata[field]) {
          addError(errors, 'SOURCE_PROTOCOL_FIELD_REWRITTEN', `${definition.id} rewrites source protocol field ${field}`);
        }
        if (record.sourceProtocolMetadata[field] === null && !(protocolVersion.pendingFields ?? []).includes(field)) {
          addError(errors, 'UNRESOLVED_PROTOCOL_FIELD_NOT_PENDING', `${definition.id} must keep unresolved ${field} pending`);
        }
      }
      if (protocolVersion.provenance !== record.originalLabel || protocolVersion.sourceSystemId !== record.sourceSystemId) {
        addError(errors, 'MEASUREMENT_PROVENANCE_REWRITTEN', `${definition.id} protocol provenance does not match its raw measurement source`);
      }
    }
    if (record.unambiguousCanonicalUnitId !== null) {
      if (!unitIds.has(record.unambiguousCanonicalUnitId)) {
        addError(errors, 'UNKNOWN_UNIT', `${record.id} maps explicit unit wording to unknown unit ${record.unambiguousCanonicalUnitId}`);
      } else if (definition.canonicalUnitId !== record.unambiguousCanonicalUnitId) {
        addError(errors, 'EXPLICIT_UNIT_MISMATCH', `${definition.id} does not preserve explicit source unit ${record.explicitUnitWording}`);
      }
    } else if (definition.canonicalUnitId !== null) {
      const mapping = definition.canonicalization?.unit;
      if (
        !mapping
        || mapping.sourceValue !== null
        || mapping.canonicalValue !== definition.canonicalUnitId
        || mapping.approvalState !== 'pending'
        || typeof mapping.note !== 'string'
        || mapping.note.trim().length === 0
      ) {
        addError(errors, 'UNDOCUMENTED_UNIT_CANONICALIZATION', `${definition.id} assigns an unstated canonical unit without a pending mapping`);
      }
    }
    const sourceMotion = canonicalMotionFromSourceWording(record.explicitMotionWording);
    if (sourceMotion && definition.motionMode !== sourceMotion) {
      addError(errors, 'EXPLICIT_MOTION_MISMATCH', `${definition.id} does not preserve explicit source motion ${record.explicitMotionWording}`);
    } else if (!sourceMotion && definition.motionMode !== 'not_applicable') {
      const mapping = definition.canonicalization?.motionMode;
      if (
        !mapping
        || mapping.sourceValue !== null
        || mapping.canonicalValue !== definition.motionMode
        || mapping.approvalState !== 'pending'
        || typeof mapping.note !== 'string'
        || mapping.note.trim().length === 0
      ) {
        addError(errors, 'UNDOCUMENTED_MOTION_CANONICALIZATION', `${definition.id} assigns an unstated motion mode without a pending mapping`);
      }
    }
    if (record.positionLabel !== null || record.sourceProtocolMetadata?.position !== null) {
      const directCanonicalPosition = record.positionLabel !== null
        ? SOURCE_POSITION_TO_CANONICAL.get(record.positionLabel)
        : record.sourceProtocolMetadata.position;
      const mappingSourceValue = record.positionLabel ?? record.sourceProtocolMetadata.position;
      if (!directCanonicalPosition) {
        addError(errors, 'UNKNOWN_SOURCE_POSITION', `${record.id} has unsupported source position ${mappingSourceValue}`);
      } else if (definition.position !== directCanonicalPosition) {
        const mapping = definition.canonicalization?.position;
        const mappingValid = mapping
          && mapping.sourceValue === mappingSourceValue
          && mapping.canonicalValue === definition.position
          && typeof mapping.note === 'string'
          && mapping.note.trim().length > 0
          && ['pending', 'approved'].includes(mapping.approvalState);
        if (!mappingValid) {
          addError(errors, 'UNDOCUMENTED_POSITION_CANONICALIZATION', `${definition.id} changes ${mappingSourceValue} to ${definition.position} without a valid mapping`);
        } else {
          if (mapping.approvalState === 'approved' && protocolVersion?.approvalState !== 'approved') {
            addError(errors, 'UNSUPPORTED_CANONICALIZATION_APPROVAL', `${definition.id} position mapping is approved without an approved protocol`);
          }
          if (protocolVersion?.approvalState !== 'approved' && mapping.approvalState !== 'pending') {
            addError(errors, 'CANONICALIZATION_MUST_BE_PENDING', `${definition.id} position mapping must remain pending`);
          }
        }
      }
    } else if (!['not_applicable', 'other'].includes(definition.position)) {
      const mapping = definition.canonicalization?.position;
      if (
        !mapping
        || mapping.sourceValue !== null
        || mapping.canonicalValue !== definition.position
        || mapping.approvalState !== 'pending'
        || typeof mapping.note !== 'string'
        || mapping.note.trim().length === 0
      ) {
        addError(errors, 'UNDOCUMENTED_POSITION_CANONICALIZATION', `${definition.id} assigns an unstated position without a pending mapping`);
      }
    }
    if (record.unambiguousLateralityModel !== null) {
      if (record.unambiguousLateralityModel !== definition.lateralityModel) {
        addError(errors, 'EXPLICIT_LATERALITY_MISMATCH', `${definition.id} does not preserve source-established laterality`);
      }
    } else if (definition.lateralityModel !== 'none') {
      const mapping = definition.canonicalization?.lateralityModel;
      if (
        !mapping
        || mapping.sourceValue !== null
        || mapping.canonicalValue !== definition.lateralityModel
        || mapping.approvalState !== 'pending'
        || typeof mapping.note !== 'string'
        || mapping.note.trim().length === 0
      ) {
        addError(errors, 'UNDOCUMENTED_LATERALITY_CANONICALIZATION', `${definition.id} assigns unstated laterality without a pending mapping`);
      }
    }
  }
  for (const record of sourceInventoryRecords) {
    const count = sourceRecordUseCounts.get(record.id) ?? 0;
    if (count === 0) addError(errors, 'SOURCE_INVENTORY_UNUSED', `${record.id} is not mapped to a known source row`);
    if (count > 1) addError(errors, 'SOURCE_INVENTORY_MULTIPLE', `${record.id} is mapped ${count} times`);
  }

  const exactNames = new Map();
  const addExactName = (sourceSystemId, sourceLabel, definitionId, kind) => {
    const key = `${sourceSystemId}\u0000${sourceLabel}`;
    const existing = exactNames.get(key) ?? [];
    existing.push({ definitionId, kind });
    exactNames.set(key, existing);
  };
  rows.forEach((row) => addExactName(row.sourceSystemId, row.sourceLabel, row.expectedDefinitionId, 'canonical'));
  rows.forEach((row) => {
    if (row.sourceMetadata?.originalLabel) {
      addExactName(row.sourceSystemId, row.sourceMetadata.originalLabel, row.expectedDefinitionId, 'source_original');
    }
  });
  for (const alias of aliases) {
    if (alias.matchType !== 'exact') {
      addError(errors, 'NON_EXACT_ALIAS', `${alias.sourceSystemId}:${alias.sourceLabel} is not exact`);
    }
    if (!sourceIds.has(alias.sourceSystemId)) {
      addError(errors, 'UNKNOWN_SOURCE_SYSTEM', `Alias references unknown source ${alias.sourceSystemId}`);
    }
    if (!definitionIds.has(alias.definitionId)) {
      addError(errors, 'UNKNOWN_ALIAS_DEFINITION', `Alias references unknown definition ${alias.definitionId}`);
    }
    const definition = definitions.find((candidate) => candidate.id === alias.definitionId);
    if (definition && definition.sourceSystemId !== alias.sourceSystemId) {
      addError(errors, 'ALIAS_SOURCE_MISMATCH', `${alias.sourceLabel} crosses source-system scope`);
    }
    addExactName(alias.sourceSystemId, alias.sourceLabel, alias.definitionId, 'alias');
  }
  for (const [key, matches] of exactNames) {
    if (new Set(matches.map((match) => match.definitionId)).size > 1) {
      addError(errors, 'ALIAS_COLLISION', `${key.replace('\u0000', ':')} resolves to multiple definitions`);
    }
  }

  const completionIds = completionStates.map((state) => state.id);
  if (JSON.stringify(completionIds) !== JSON.stringify(REQUIRED_COMPLETION_STATES)) {
    addError(errors, 'INVALID_COMPLETION_STATES', 'Completion-state registry does not match the approved seven states and order');
  }
  for (const state of completionStates) {
    if (state.impliesNumericZero !== false) {
      addError(errors, 'COMPLETION_STATE_ZERO', `${state.id} must not imply numeric zero`);
    }
  }

  const bySlug = new Map(definitions.map((definition) => [definition.slug, definition]));
  const requiredDistinctions = [
    ['prom-hip-er-at-0', { motionMode: 'passive', position: 'prone', positionDetail: 'hip_at_0_degrees' }],
    ['prom-hip-ir-at-0', { motionMode: 'passive', position: 'prone', positionDetail: 'hip_at_0_degrees' }],
    ['prom-hip-ir-at-90', { motionMode: 'passive', position: 'supine', positionDetail: 'hip_at_90_degrees' }],
    ['prom-shoulder-er-supine', { motionMode: 'passive', position: 'supine' }],
    ['prom-active-shoulder-er-at-90-prone', { motionMode: 'active', position: 'prone', positionDetail: 'shoulder_at_90_degrees' }],
  ];
  for (const [slug, expected] of requiredDistinctions) {
    const definition = bySlug.get(slug);
    if (!definition || Object.entries(expected).some(([key, value]) => definition[key] !== value)) {
      addError(errors, 'DISTINCTION_LOST', `${slug} no longer preserves its approved motion/position distinction`);
    }
  }
  const distinctionIds = requiredDistinctions.map(([slug]) => bySlug.get(slug)?.id).filter(Boolean);
  if (new Set(distinctionIds).size !== requiredDistinctions.length) {
    addError(errors, 'DISTINCTION_LOST', 'Required active/passive or position variants share a canonical ID');
  }

  const patientDataFindings = findPatientData(ontology);
  if (patientDataFindings.length) {
    addError(errors, 'PATIENT_DATA_DETECTED', `Patient-data-shaped fields found at ${patientDataFindings.join(', ')}`);
  }

  const surfaceCounts = Object.fromEntries(SURFACE_ORDER.map((surface) => [surface, 0]));
  for (const row of rows) surfaceCounts[row.surface] = (surfaceCounts[row.surface] ?? 0) + 1;
  for (const [surface, expected] of Object.entries(EXPECTED_SURFACE_COUNTS)) {
    if (surfaceCounts[surface] !== expected) {
      addError(errors, 'SURFACE_COUNT_MISMATCH', `${surface} has ${surfaceCounts[surface] ?? 0}; expected ${expected}`);
    }
  }
  if (definitions.length !== 140) {
    addError(errors, 'DEFINITION_COUNT_MISMATCH', `Canonical definition count is ${definitions.length}; expected 140`);
  }
  if (sourceInventoryRecords.length !== 140) {
    addError(errors, 'SOURCE_INVENTORY_COUNT_MISMATCH', `Source-inventory count is ${sourceInventoryRecords.length}; expected 140`);
  }

  const pendingProtocolFields = protocolVersions.flatMap((version) =>
    (version.pendingFields ?? []).map((field) => ({
      protocolId: version.protocolId,
      version: version.version,
      field,
    })),
  );

  return {
    errors,
    summary: {
      definitionCount: definitions.length,
      knownSourceRowCount: rows.length,
      surfaceCounts,
      sourceCounts: countBy(definitions, 'sourceSystemId', sourceSystems.map((source) => source.id)),
      aliasCount: aliases.length,
      protocolCount: protocols.length,
      protocolVersionCount: protocolVersions.length,
      pendingProtocolFieldCount: pendingProtocolFields.length,
      sourceInventoryRecordCount: sourceInventoryRecords.length,
      positionCanonicalizationCount: definitions.filter(
        (definition) => definition.canonicalization?.position?.sourceValue !== null
          && definition.canonicalization?.position?.sourceValue !== undefined,
      ).length,
      pendingPositionInterpretationCount: definitions.filter(
        (definition) => definition.canonicalization?.position?.sourceValue === null,
      ).length,
    },
    pendingProtocolFields,
  };
}

function md(value) {
  if (value === null || value === undefined || value === '') return '—';
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function renderCoverageReport(ontology) {
  const result = validateOntology(ontology);
  const lines = [
    '# V5 Assessment Ontology Coverage',
    '',
    '> Generated by `scripts/validate-v5-ontology.mjs --write-docs`. Do not edit by hand.',
    '',
    'V5-00 catalogs assessment inputs only. It does not assign capacity meaning, CD goal relationships, task thresholds, decline models, or training priority.',
    '',
    '## Coverage',
    '',
    '| Known source surface | Canonical definitions | Required |',
    '|---|---:|---:|',
  ];
  for (const surface of SURFACE_ORDER) {
    lines.push(`| ${surface} | ${result.summary.surfaceCounts[surface]} | ${EXPECTED_SURFACE_COUNTS[surface]} |`);
  }
  lines.push(
    `| **Total** | **${result.summary.definitionCount}** | **140** |`,
    '',
    '## Definitions by exact source system',
    '',
    '| Source system | Definitions |',
    '|---|---:|',
  );
  for (const source of ontology.sourceSystems) {
    lines.push(`| ${source.displayName} (` + '`' + `${source.id}` + '`' + `) | ${result.summary.sourceCounts[source.id]} |`);
  }
  const sourceRecordsByDefinition = new Map(ontology.sourceInventoryRecords.map((record) => [record.definitionId, record]));
  const promSourceRecords = ontology.sourceInventoryRecords.filter((record) => record.sourceSurface === 'prom_orthopedic');
  const promPositionCounts = countBy(promSourceRecords, 'positionLabel');
  const positionCanonicalizations = ontology.definitions.filter(
    (definition) => definition.canonicalization?.position?.sourceValue !== null
      && definition.canonicalization?.position?.sourceValue !== undefined,
  );
  lines.push(
    '',
    '## Independent source fidelity',
    '',
    `- Raw source-inventory records: ${result.summary.sourceInventoryRecordCount}`,
    `- pROM/orthopedic source rows audited: ${promSourceRecords.length}`,
    `- pROM source Position values: Supine ${promPositionCounts.Supine ?? 0}; Prone ${promPositionCounts.Prone ?? 0}; Seated ${promPositionCounts.Seated ?? 0}; Standing ${promPositionCounts.Standing ?? 0}; Other Table ${promPositionCounts['Other Table'] ?? 0}`,
    `- Documented source-to-canonical position mappings: ${result.summary.positionCanonicalizationCount}`,
    `- Pending canonical positions where the captured source does not establish position: ${result.summary.pendingPositionInterpretationCount}`,
    '- The raw source label, source Position value, category, explicit motion wording, explicit unit wording, original row identifier and source-established protocol fields are stored separately from the canonical definition.',
    '- Measurement-source, measurement-snapshot and measurement-protocol provenance are explicitly typed and remain separate from research or forecast provenance.',
    '',
    '| Original source label | Source position | Canonical position | Approval | Canonicalization note |',
    '|---|---|---|---|---|',
  );
  for (const definition of positionCanonicalizations) {
    const record = sourceRecordsByDefinition.get(definition.id);
    const mapping = definition.canonicalization.position;
    lines.push(`| ${md(record?.originalLabel)} | ${md(mapping.sourceValue)} | ${md(mapping.canonicalValue)} | ${md(mapping.approvalState)} | ${md(mapping.note)} |`);
  }
  lines.push(
    '',
    '## Exact aliases',
    '',
    '| Source system | Exact source label | Canonical definition ID |',
    '|---|---|---|',
  );
  for (const alias of ontology.aliases) {
    lines.push(`| ${md(alias.sourceSystemId)} | ${md(alias.sourceLabel)} | ${md(alias.definitionId)} |`);
  }
  lines.push(
    '',
    'Unknown labels are not fuzzy-matched. They return the explicit `import_review` state.',
    '',
    '## Protocol status',
    '',
    `- Protocols: ${result.summary.protocolCount}`,
    `- Protocol versions: ${result.summary.protocolVersionCount}`,
    `- Pending protocol-owner fields: ${result.summary.pendingProtocolFieldCount}`,
    '- Pending fields remain null or otherwise explicitly unresolved; source labels were not expanded into unstated setup details.',
    '',
    '| Protocol/version | Approval | Pending fields |',
    '|---|---|---|',
  );
  for (const version of ontology.protocolVersions) {
    lines.push(`| ${md(protocolKey(version.protocolId, version.version))} | ${md(version.approvalState)} | ${md((version.pendingFields ?? []).join(', '))} |`);
  }
  const nullUnitDefinitions = ontology.definitions.filter((definition) => definition.canonicalUnitId === null);
  const explicitUnitRecords = ontology.sourceInventoryRecords.filter((record) => record.explicitUnitWording !== null);
  lines.push(
    '',
    '## Explicitly unresolved source units',
    '',
    `${explicitUnitRecords.length} source rows contain explicit unit wording; each is retained in raw metadata and checked against its canonical unit.`,
    '',
    `${nullUnitDefinitions.length} definitions use an explicit null canonical unit because the approved inventory does not establish one. This includes all 49 PCA performance rows plus source rows whose output unit or scoring method still requires protocol-owner confirmation. The row-level nulls are visible in the source crosswalk.`,
    '',
    '## Completion states',
    '',
  );
  for (const state of ontology.completionStates) {
    lines.push(`- ` + '`' + state.id + '`' + ` — ${state.description}`);
  }
  lines.push('', 'None of these states implies numeric zero.', '');
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

export function renderSourceCrosswalk(ontology) {
  const definitionsById = new Map(ontology.definitions.map((definition) => [definition.id, definition]));
  const sourceRecordsById = new Map(ontology.sourceInventoryRecords.map((record) => [record.id, record]));
  const lines = [
    '# V5 Assessment Source Field Crosswalk',
    '',
    '> Generated by `scripts/validate-v5-ontology.mjs --write-docs`. Do not edit by hand.',
    '',
    'This crosswalk audits source-label coverage. A row here establishes identity and provenance only; it does not establish capacity meaning, task relevance, or clinical interpretation.',
    '',
    '| Source | Inventory label | Original source label | Original row ID | Category | Source position label | Source protocol position | Canonical test ID | Source system | Explicit motion | Source protocol motion | Canonical motion | Explicit unit | Canonical unit | Laterality | Source selected output | Canonical position | Position mapping | Protocol/version |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
  ];
  for (const row of ontology.knownSourceRows) {
    const definition = definitionsById.get(row.expectedDefinitionId);
    const sourceRecord = sourceRecordsById.get(row.sourceInventoryRecordId);
    const mapping = definition?.canonicalization?.position;
    lines.push(
      `| ${md(row.surface)} | ${md(row.sourceLabel)} | ${md(sourceRecord?.originalLabel)} | ${md(sourceRecord?.originalRowIdentifier)} | ${md(sourceRecord?.categoryLabel)} | ${md(sourceRecord?.positionLabel)} | ${md(sourceRecord?.sourceProtocolMetadata?.position)} | ${md(definition?.id)} | ${md(definition?.sourceSystemId)} | ${md(sourceRecord?.explicitMotionWording)} | ${md(sourceRecord?.sourceProtocolMetadata?.motionMode)} | ${md(definition?.motionMode)} | ${md(sourceRecord?.explicitUnitWording)} | ${md(definition?.canonicalUnitId)} | ${md(definition?.lateralityModel)} | ${md(sourceRecord?.sourceProtocolMetadata?.selectedOutput)} | ${md([definition?.position, definition?.positionDetail].filter(Boolean).join(' · '))} | ${md(mapping ? `${mapping.approvalState}: ${mapping.note}` : null)} | ${md(definition ? protocolKey(definition.protocolId, definition.protocolVersion) : null)} |`,
    );
  }
  lines.push('');
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

export async function writeGeneratedDocs(ontology, root = DEFAULT_ROOT) {
  const docsDir = path.join(root, 'docs', 'v5');
  await mkdir(docsDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(docsDir, 'ONTOLOGY_COVERAGE.md'), renderCoverageReport(ontology), 'utf8'),
    writeFile(path.join(docsDir, 'SOURCE_FIELD_CROSSWALK.md'), renderSourceCrosswalk(ontology), 'utf8'),
  ]);
}

async function main() {
  const writeDocs = process.argv.includes('--write-docs');
  const ontology = await loadOntology(DEFAULT_ROOT);
  const result = validateOntology(ontology);
  if (writeDocs && result.errors.length === 0) await writeGeneratedDocs(ontology, DEFAULT_ROOT);
  const pendingByField = {};
  for (const pending of result.pendingProtocolFields) {
    pendingByField[pending.field] = (pendingByField[pending.field] ?? 0) + 1;
  }
  process.stdout.write(`${JSON.stringify({ errors: result.errors, summary: result.summary, pendingProtocolFieldsByName: pendingByField }, null, 2)}\n`);
  if (result.errors.length) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.stack || error);
    process.exitCode = 1;
  });
}
