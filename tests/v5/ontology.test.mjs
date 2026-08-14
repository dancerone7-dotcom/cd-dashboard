import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  loadOntology,
  renderCoverageReport,
  renderSourceCrosswalk,
  resolveSourceName,
  validateOntology,
} from '../../scripts/validate-v5-ontology.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REQUIRED_SURFACE_COUNTS = Object.freeze({
  pca_master: 49,
  prom_orthopedic: 39,
  cpet_tracker: 18,
  dexa_tracker: 18,
  v4_vald: 14,
  v4_timed_stance: 2,
});
const REQUIRED_COMPLETION_STATES = Object.freeze([
  'measured',
  'not_measured',
  'skipped',
  'contraindicated',
  'pain_limited',
  'unable',
  'redundant',
]);
const REQUIRED_SOURCE_PROTOCOL_FIELDS = Object.freeze([
  'position',
  'motionMode',
  'equipment',
  'trialCount',
  'lateralityConvention',
  'selectedOutput',
  'aggregationRule',
]);
const PROM_SOURCE_ROWS = Object.freeze([
  ['prom-shoulder-er-supine', 'Shoulder ER', 'Supine', 'Shoulder'],
  ['prom-shoulder-ir-supine', 'Shoulder IR', 'Supine', 'Shoulder'],
  ['prom-shoulder-flexion-supine', 'Shoulder Flexion', 'Supine', 'Shoulder'],
  ['prom-active-shoulder-er-at-90-prone', 'Shoulder ER @ 90° (active)', 'Prone', 'Shoulder'],
  ['prom-active-shoulder-ir-at-90-prone', 'Shoulder IR @ 90° (active)', 'Prone', 'Shoulder'],
  ['prom-active-shoulder-flexion-prone', 'Shoulder Flexion (active)', 'Prone', 'Shoulder'],
  ['prom-shoulder-extension-active-passive', 'Shoulder Extension (active/passive)', 'Prone', 'Shoulder'],
  ['prom-hip-flexion', 'Hip Flexion', 'Supine', 'Hip'],
  ['prom-hip-er-at-90', 'Hip ER @ 90°', 'Supine', 'Hip'],
  ['prom-hip-ir-at-90', 'Hip IR @ 90°', 'Supine', 'Hip'],
  ['prom-hip-er-at-0', 'Hip ER @ 0°', 'Prone', 'Hip'],
  ['prom-hip-ir-at-0', 'Hip IR @ 0°', 'Prone', 'Hip'],
  ['prom-active-seated-hip-er', 'Hip ER (active)', 'Seated', 'Hip'],
  ['prom-active-seated-hip-ir', 'Hip IR (active)', 'Seated', 'Hip'],
  ['prom-hip-abduction', 'Hip Abduction', 'Supine', 'Hip'],
  ['prom-hip-extension', 'Hip Extensions', 'Prone', 'Hip'],
  ['prom-faber', 'FABER Test', 'Supine', 'Hip'],
  ['prom-thomas', 'Thomas Test', 'Other Table', 'Hip'],
  ['prom-ober', 'Side Lying Ober’s Test', 'Other Table', 'Hip'],
  ['prom-knee-extension', 'Knee Extension', 'Supine', 'Knee / tibia'],
  ['prom-knee-flexion', 'Knee Flexion', 'Supine', 'Knee / tibia'],
  ['prom-tibial-er-ir-passive', 'Tibial ER/IR', 'Supine', 'Knee / tibia'],
  ['prom-tibial-er-ir-active', 'Tibial ER/IR (active)', 'Seated', 'Knee / tibia'],
  ['prom-ankle-dorsiflexion', 'Ankle Dorsiflexion (Active and Knee to Wall)', 'Standing', 'Foot / ankle'],
  ['prom-ankle-inversion-eversion', 'Ankle Inversion/Eversion (active)', 'Seated', 'Foot / ankle'],
  ['prom-talocrural-assessment', 'Foot- Talocrural', 'Supine', 'Foot / ankle'],
  ['prom-subtalar-assessment', 'Foot- Subtalar', 'Supine', 'Foot / ankle'],
  ['prom-mid-foot-assessment', 'Mid-Foot', 'Supine', 'Foot / ankle'],
  ['prom-1st-ray-assessment', 'Foot- 1st Ray', 'Supine', 'Foot / ankle'],
  ['prom-general-foot-ankle-assessment', 'Foot- Ankle', 'Supine', 'Foot / ankle'],
  ['prom-calf-raise', 'Ankle Calf Raise', 'Standing', 'Foot / ankle'],
  ['prom-lumbar-rotation', 'Lumbar Rotation', 'Prone', 'Spine / trunk'],
  ['prom-quadruped-lumbar-locked-thoracic-rotation', 'Quadruped Lumbar Locked T-Spine Rotation', 'Prone', 'Spine / trunk'],
  ['prom-thoracic-lumbar-vertebral-spring-mobility', 'Thoracic/Lumbar Vertebral Spring Mobility', 'Prone', 'Spine / trunk'],
  ['prom-prone-press-up', 'Prone Press Up', 'Prone', 'Spine / trunk'],
  ['prom-straight-leg-raise', 'Straight Leg Raise', 'Supine', 'Other screens'],
  ['prom-active-straight-leg-raise', 'Active Straight Leg Raise', 'Supine', 'Other screens'],
  ['prom-half-kneeling-balance', 'Half-Kneeling Balance', 'Standing', 'Other screens'],
  ['prom-si-laslett-cluster', 'SI Laslet Cluster Tests', 'Other Table', 'Other screens'],
]);

function clone(value) {
  return structuredClone(value);
}

function expectErrorCode(ontology, code) {
  const result = validateOntology(ontology);
  assert.ok(
    result.errors.some((error) => error.code === code),
    `Expected ${code}; received ${result.errors.map((error) => error.code).join(', ') || 'no errors'}`,
  );
}

function gitBlobHash(bytes) {
  return createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
}

test('the complete V5-00 ontology validates with the required known-source coverage', async () => {
  const ontology = await loadOntology(ROOT);
  const result = validateOntology(ontology);

  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.definitionCount, 140);
  assert.deepEqual(result.summary.surfaceCounts, REQUIRED_SURFACE_COUNTS);
  assert.deepEqual(result.summary.sourceCounts, {
    pca_field: 51,
    manual_orthopedic_exam: 39,
    cpet: 18,
    dexa: 18,
    vald_forcedecks: 5,
    vald_forceframe: 8,
    vald_dynamo: 1,
    dari: 0,
  });
  assert.equal(result.summary.knownSourceRowCount, 140);
  assert.equal(result.summary.sourceInventoryRecordCount, 140);
  assert.equal(result.summary.positionCanonicalizationCount, 3);
});

test('every known source row resolves exactly once and unknown labels require import review', async () => {
  const ontology = await loadOntology(ROOT);
  const definitionsByRow = new Map();
  for (const definition of ontology.definitions) {
    for (const rowId of definition.inventoryRowIds) {
      const matches = definitionsByRow.get(rowId) ?? [];
      matches.push(definition.id);
      definitionsByRow.set(rowId, matches);
    }
  }

  for (const row of ontology.knownSourceRows) {
    assert.deepEqual(definitionsByRow.get(row.id), [row.expectedDefinitionId], row.id);
    assert.deepEqual(
      resolveSourceName(ontology, {
        sourceSystemId: row.sourceSystemId,
        sourceLabel: row.sourceLabel,
      }),
      { status: 'resolved', definitionId: row.expectedDefinitionId, matchType: 'canonical' },
      row.id,
    );
  }

  assert.deepEqual(
    resolveSourceName(ontology, {
      sourceSystemId: 'pca_field',
      sourceLabel: 'PRI Functional Squattt',
    }),
    { status: 'import_review', reason: 'unknown_source_label' },
  );
});

test('source-scoped exact aliases cover the approved spelling variants without fuzzy matching', async () => {
  const ontology = await loadOntology(ROOT);
  const expected = ontology.definitions.find((definition) => definition.slug === 'pca-pri-functional-squat');
  const proneT = ontology.definitions.find((definition) => definition.slug === 'pca-prone-isometric-t');

  for (const sourceLabel of ['PRI Functional Sqaut', 'PRI Functional Squat']) {
    assert.deepEqual(resolveSourceName(ontology, { sourceSystemId: 'pca_field', sourceLabel }), {
      status: 'resolved',
      definitionId: expected.id,
      matchType: sourceLabel === 'PRI Functional Squat' ? 'canonical' : 'alias',
    });
  }
  for (const sourceLabel of ['Prone T', 'Prone Isometric T', 'Prone Isometric “T”']) {
    assert.equal(
      resolveSourceName(ontology, { sourceSystemId: 'pca_field', sourceLabel }).definitionId,
      proneT.id,
    );
  }
  assert.equal(
    resolveSourceName(ontology, { sourceSystemId: 'manual_orthopedic_exam', sourceLabel: 'Prone T' }).status,
    'import_review',
  );
});

test('clinically distinct positions and active/passive modes remain separate definitions', async () => {
  const ontology = await loadOntology(ROOT);
  const hipIr0 = ontology.definitions.find((definition) => definition.slug === 'prom-hip-ir-at-0');
  const hipIr90 = ontology.definitions.find((definition) => definition.slug === 'prom-hip-ir-at-90');
  const shoulderErSupine = ontology.definitions.find((definition) => definition.slug === 'prom-shoulder-er-supine');
  const shoulderErProne = ontology.definitions.find(
    (definition) => definition.slug === 'prom-active-shoulder-er-at-90-prone',
  );

  assert.notEqual(hipIr0.id, hipIr90.id);
  assert.equal(hipIr0.position, 'prone');
  assert.equal(hipIr0.positionDetail, 'hip_at_0_degrees');
  assert.equal(hipIr90.position, 'supine');
  assert.equal(hipIr90.positionDetail, 'hip_at_90_degrees');
  assert.equal(shoulderErSupine.motionMode, 'passive');
  assert.equal(shoulderErSupine.position, 'supine');
  assert.equal(shoulderErProne.motionMode, 'active');
  assert.equal(shoulderErProne.position, 'prone');
  assert.equal(shoulderErProne.positionDetail, 'shoulder_at_90_degrees');
});

test('all 39 pROM rows preserve the authoritative source label, position, and category independently', async () => {
  const ontology = await loadOntology(ROOT);
  assert.equal(PROM_SOURCE_ROWS.length, 39);
  const definitionsBySlug = new Map(ontology.definitions.map((definition) => [definition.slug, definition]));
  const sourceRecordsByDefinition = new Map(
    ontology.sourceInventoryRecords.map((record) => [record.definitionId, record]),
  );

  for (const [slug, originalLabel, positionLabel, categoryLabel] of PROM_SOURCE_ROWS) {
    const definition = definitionsBySlug.get(slug);
    const sourceRecord = sourceRecordsByDefinition.get(definition.id);
    assert.equal(sourceRecord.originalLabel, originalLabel, `${slug} label`);
    assert.equal(sourceRecord.positionLabel, positionLabel, `${slug} source position`);
    assert.equal(sourceRecord.categoryLabel, categoryLabel, `${slug} category`);
    assert.equal(sourceRecord.sourceSurface, 'prom_orthopedic');
    assert.equal(sourceRecord.sourceSystemId, 'manual_orthopedic_exam');
  }

  assert.equal(sourceRecordsByDefinition.get(definitionsBySlug.get('prom-hip-er-at-0').id).positionLabel, 'Prone');
  assert.equal(sourceRecordsByDefinition.get(definitionsBySlug.get('prom-hip-ir-at-0').id).positionLabel, 'Prone');
  assert.equal(
    ontology.sourceSnapshots.find((snapshot) => snapshot.id === 'source-snapshot.prom-current-supplement-2026-08-13').captureState,
    'pending_master_reconciliation',
  );
  assert.deepEqual(
    resolveSourceName(ontology, {
      sourceSystemId: 'manual_orthopedic_exam',
      sourceLabel: 'Hip IR @ 0°',
    }),
    { status: 'resolved', definitionId: definitionsBySlug.get('prom-hip-ir-at-0').id, matchType: 'source_original' },
  );
});

test('source and canonical positions may differ only through an explicit pending or approved mapping', async () => {
  const ontology = await loadOntology(ROOT);
  const quadruped = ontology.definitions.find(
    (definition) => definition.slug === 'prom-quadruped-lumbar-locked-thoracic-rotation',
  );
  const sourceRecord = ontology.sourceInventoryRecords.find((record) => record.definitionId === quadruped.id);

  assert.equal(sourceRecord.positionLabel, 'Prone');
  assert.equal(quadruped.position, 'quadruped');
  assert.deepEqual(quadruped.canonicalization.position, {
    sourceValue: 'Prone',
    canonicalValue: 'quadruped',
    note: 'The tracker groups this row under Prone, while the original test label explicitly identifies a quadruped test position.',
    approvalState: 'pending',
  });

  const undocumented = clone(ontology);
  delete undocumented.definitions.find((definition) => definition.id === quadruped.id).canonicalization;
  expectErrorCode(undocumented, 'UNDOCUMENTED_POSITION_CANONICALIZATION');
});

test('validator detects rewritten source position, motion wording, label, and explicit unit metadata', async () => {
  const ontology = await loadOntology(ROOT);
  const hipIr0 = ontology.definitions.find((definition) => definition.slug === 'prom-hip-ir-at-0');
  const row = ontology.knownSourceRows.find((candidate) => candidate.expectedDefinitionId === hipIr0.id);

  const positionMutated = clone(ontology);
  positionMutated.knownSourceRows.find((candidate) => candidate.id === row.id).sourceMetadata.positionLabel = 'Supine';
  expectErrorCode(positionMutated, 'SOURCE_METADATA_MISMATCH');

  const rawPositionMutated = clone(ontology);
  rawPositionMutated.sourceInventoryRecords.find((record) => record.definitionId === hipIr0.id).positionLabel = 'Supine';
  expectErrorCode(rawPositionMutated, 'SOURCE_METADATA_MISMATCH');

  const motionMutated = clone(ontology);
  motionMutated.knownSourceRows.find(
    (candidate) => candidate.expectedDefinitionId === 'atd.prom.004',
  ).sourceMetadata.explicitMotionWording = null;
  expectErrorCode(motionMutated, 'SOURCE_METADATA_MISMATCH');

  const labelMutated = clone(ontology);
  labelMutated.knownSourceRows.find((candidate) => candidate.id === row.id).sourceMetadata.originalLabel = 'Hip IR at zero';
  expectErrorCode(labelMutated, 'SOURCE_METADATA_MISMATCH');

  const unitMutated = clone(ontology);
  unitMutated.knownSourceRows.find(
    (candidate) => candidate.expectedDefinitionId === 'atd.v4-vald.003',
  ).sourceMetadata.explicitUnitWording = null;
  expectErrorCode(unitMutated, 'SOURCE_METADATA_MISMATCH');

  const sourceProtocolPositionMutated = clone(ontology);
  sourceProtocolPositionMutated.sourceInventoryRecords.find(
    (record) => record.definitionId === hipIr0.id,
  ).sourceProtocolMetadata.position = 'supine';
  expectErrorCode(sourceProtocolPositionMutated, 'SOURCE_PROTOCOL_FIELD_REWRITTEN');

  const inventedProtocolDetail = clone(ontology);
  inventedProtocolDetail.protocolVersions.find(
    (version) => version.protocolId === hipIr0.protocolId && version.version === hipIr0.protocolVersion,
  ).equipment = 'goniometer';
  expectErrorCode(inventedProtocolDetail, 'SOURCE_PROTOCOL_FIELD_REWRITTEN');

  const provenanceMutated = clone(ontology);
  provenanceMutated.protocolVersions.find(
    (version) => version.protocolId === hipIr0.protocolId && version.version === hipIr0.protocolVersion,
  ).provenance = 'research paper';
  expectErrorCode(provenanceMutated, 'MEASUREMENT_PROVENANCE_REWRITTEN');
});

test('source-established protocol fields survive and unresolved protocol-owner fields are never invented', async () => {
  const ontology = await loadOntology(ROOT);
  const recordsByDefinition = new Map(ontology.sourceInventoryRecords.map((record) => [record.definitionId, record]));
  const versionsByKey = new Map(
    ontology.protocolVersions.map((version) => [`${version.protocolId}@${version.version}`, version]),
  );

  for (const definition of ontology.definitions) {
    const record = recordsByDefinition.get(definition.id);
    const version = versionsByKey.get(`${definition.protocolId}@${definition.protocolVersion}`);
    assert.ok(record.sourceProtocolMetadata, `${definition.id} source protocol metadata`);
    for (const field of REQUIRED_SOURCE_PROTOCOL_FIELDS) {
      assert.ok(Object.hasOwn(record.sourceProtocolMetadata, field), `${definition.id} source protocol field ${field}`);
      assert.ok(Object.hasOwn(version, field), `${definition.id} protocol field ${field}`);
      assert.equal(version[field], record.sourceProtocolMetadata[field], `${definition.id} protocol field ${field}`);
      if (version[field] === null) assert.ok(version.pendingFields.includes(field), `${definition.id} pending ${field}`);
    }
    for (const field of ['protocolOwner', 'approvalDate']) {
      assert.ok(Object.hasOwn(version, field), `${definition.id} ${field}`);
      assert.equal(version[field], null, `${definition.id} ${field}`);
      assert.ok(version.pendingFields.includes(field), `${definition.id} pending ${field}`);
    }

    if (record.unambiguousCanonicalUnitId === null && definition.canonicalUnitId !== null) {
      assert.deepEqual(definition.canonicalization?.unit, {
        sourceValue: null,
        canonicalValue: definition.canonicalUnitId,
        note: 'Canonical unit interpretation is not explicit in the captured source metadata and remains pending protocol-owner confirmation.',
        approvalState: 'pending',
      });
    }
    if (record.sourceProtocolMetadata.position === null && !['not_applicable', 'other'].includes(definition.position)) {
      assert.equal(definition.canonicalization?.position?.sourceValue, null, `${definition.id} pending position source`);
      assert.equal(definition.canonicalization?.position?.canonicalValue, definition.position, `${definition.id} pending position value`);
      assert.equal(definition.canonicalization?.position?.approvalState, 'pending', `${definition.id} pending position approval`);
    }
    if (record.sourceProtocolMetadata.motionMode === null && definition.motionMode !== 'not_applicable') {
      assert.equal(definition.canonicalization?.motionMode?.sourceValue, null, `${definition.id} pending motion source`);
      assert.equal(definition.canonicalization?.motionMode?.canonicalValue, definition.motionMode, `${definition.id} pending motion value`);
      assert.equal(definition.canonicalization?.motionMode?.approvalState, 'pending', `${definition.id} pending motion approval`);
    }
    if (record.unambiguousLateralityModel === null && definition.lateralityModel !== 'none') {
      assert.equal(definition.canonicalization?.lateralityModel?.sourceValue, null, `${definition.id} pending laterality source`);
      assert.equal(definition.canonicalization?.lateralityModel?.canonicalValue, definition.lateralityModel, `${definition.id} pending laterality value`);
      assert.equal(definition.canonicalization?.lateralityModel?.approvalState, 'pending', `${definition.id} pending laterality approval`);
    }
  }
});

test('measurement provenance stays source-specific and separate from research or forecast provenance', async () => {
  const ontology = await loadOntology(ROOT);
  assert.ok(ontology.sourceSystems.every((source) => source.provenanceKind === 'measurement_source'));
  assert.ok(ontology.sourceSnapshots.every((snapshot) => snapshot.provenanceKind === 'measurement_source_snapshot'));
  assert.ok(ontology.protocolVersions.every((version) => version.provenanceKind === 'measurement_protocol'));

  const definitionsById = new Map(ontology.definitions.map((definition) => [definition.id, definition]));
  for (const row of ontology.knownSourceRows.filter((candidate) => candidate.surface === 'v4_vald')) {
    const definition = definitionsById.get(row.expectedDefinitionId);
    const originalLabel = row.sourceMetadata.originalLabel;
    if (originalLabel.includes('ForceDecks')) assert.equal(definition.sourceSystemId, 'vald_forcedecks');
    if (originalLabel.includes('ForceFrame')) assert.equal(definition.sourceSystemId, 'vald_forceframe');
    if (originalLabel.includes('DynaMo')) assert.equal(definition.sourceSystemId, 'vald_dynamo');
    assert.notEqual(definition.sourceSystemId, 'vald');
  }
  for (const row of ontology.knownSourceRows.filter((candidate) => candidate.surface === 'v4_timed_stance')) {
    assert.equal(definitionsById.get(row.expectedDefinitionId).sourceSystemId, 'pca_field');
  }

  const serialized = JSON.stringify({
    sourceSystems: ontology.sourceSystems,
    sourceSnapshots: ontology.sourceSnapshots,
    sourceInventoryRecords: ontology.sourceInventoryRecords,
    protocolVersions: ontology.protocolVersions,
  });
  assert.equal(/research|forecast|declineModel/i.test(serialized), false);
  assert.deepEqual(JSON.parse(JSON.stringify(ontology.sourceInventoryRecords)), ontology.sourceInventoryRecords);
});

test('frozen V3 and V4 review files remain byte-identical', async () => {
  const rootIndex = await readFile(path.join(ROOT, 'index.html'));
  const reviewIndex = await readFile(path.join(ROOT, 'v4-review/index.html'));
  assert.equal(gitBlobHash(rootIndex), '25bd28dec25850295691585aba6a3b2e3d09d351');
  assert.equal(gitBlobHash(reviewIndex), '4be9b4f9a671b91abbfe98e69386cacdcb27cc78');
});

test('completion states preserve missing and clinical non-completion without numeric zero', async () => {
  const ontology = await loadOntology(ROOT);
  assert.deepEqual(ontology.completionStates.map((state) => state.id), REQUIRED_COMPLETION_STATES);
  assert.ok(ontology.completionStates.every((state) => state.impliesNumericZero === false));
});

test('validator rejects broken ontology identity and foreign-key integrity', async () => {
  const ontology = await loadOntology(ROOT);

  const duplicateId = clone(ontology);
  duplicateId.definitions[1].id = duplicateId.definitions[0].id;
  expectErrorCode(duplicateId, 'DUPLICATE_DEFINITION_ID');

  const duplicateSlug = clone(ontology);
  duplicateSlug.definitions[1].slug = duplicateSlug.definitions[0].slug;
  expectErrorCode(duplicateSlug, 'DUPLICATE_DEFINITION_SLUG');

  const unknownSource = clone(ontology);
  unknownSource.definitions[0].sourceSystemId = 'unknown_source';
  expectErrorCode(unknownSource, 'UNKNOWN_SOURCE_SYSTEM');

  const unknownUnit = clone(ontology);
  unknownUnit.definitions[0].canonicalUnitId = 'unknown_unit';
  expectErrorCode(unknownUnit, 'UNKNOWN_UNIT');

  const unknownProtocol = clone(ontology);
  unknownProtocol.definitions[0].protocolVersion = '999.0';
  expectErrorCode(unknownProtocol, 'UNKNOWN_PROTOCOL_VERSION');

  const invalidLaterality = clone(ontology);
  invalidLaterality.definitions[0].lateralityModel = 'sometimes';
  expectErrorCode(invalidLaterality, 'INVALID_LATERALITY');

  const requiredLateralityRemoved = clone(ontology);
  requiredLateralityRemoved.definitions.find((definition) => definition.slug === 'prom-shoulder-er-supine').lateralityModel = 'none';
  expectErrorCode(requiredLateralityRemoved, 'LATERALITY_REQUIRED');
});

test('validator rejects unresolved or multiply mapped known rows and alias collisions', async () => {
  const ontology = await loadOntology(ROOT);
  const rowId = ontology.knownSourceRows[0].id;

  const unresolved = clone(ontology);
  unresolved.definitions.find((definition) => definition.inventoryRowIds.includes(rowId)).inventoryRowIds = [];
  expectErrorCode(unresolved, 'KNOWN_ROW_UNRESOLVED');

  const multiple = clone(ontology);
  multiple.definitions[1].inventoryRowIds.push(rowId);
  expectErrorCode(multiple, 'KNOWN_ROW_MULTIPLE');

  const collision = clone(ontology);
  collision.aliases.push({
    sourceSystemId: 'pca_field',
    sourceLabel: 'PRI Functional Sqaut',
    definitionId: collision.definitions[1].id,
    matchType: 'exact',
  });
  expectErrorCode(collision, 'ALIAS_COLLISION');
});

test('validator protects required distinctions, exact VALD provenance, and patient-data exclusion', async () => {
  const ontology = await loadOntology(ROOT);

  const collapsed = clone(ontology);
  collapsed.definitions.find((definition) => definition.slug === 'prom-hip-ir-at-0').position = 'supine_hip_90';
  expectErrorCode(collapsed, 'DISTINCTION_LOST');

  const activePassiveLost = clone(ontology);
  activePassiveLost.definitions.find(
    (definition) => definition.slug === 'prom-active-shoulder-er-at-90-prone',
  ).motionMode = 'passive';
  expectErrorCode(activePassiveLost, 'DISTINCTION_LOST');

  const generalized = clone(ontology);
  generalized.definitions.find((definition) => definition.slug === 'v4-cmj-power-wkg').sourceSystemId = 'pca_field';
  expectErrorCode(generalized, 'VALD_SOURCE_GENERALIZED');

  const patientData = clone(ontology);
  patientData.definitions[0].patientName = 'Example Patient';
  expectErrorCode(patientData, 'PATIENT_DATA_DETECTED');
});

test('generated coverage and source crosswalk documentation are current', async () => {
  const ontology = await loadOntology(ROOT);
  const coverage = await readFile(path.join(ROOT, 'docs/v5/ONTOLOGY_COVERAGE.md'), 'utf8');
  const crosswalk = await readFile(path.join(ROOT, 'docs/v5/SOURCE_FIELD_CROSSWALK.md'), 'utf8');

  assert.equal(coverage, renderCoverageReport(ontology));
  assert.equal(crosswalk, renderSourceCrosswalk(ontology));
});
