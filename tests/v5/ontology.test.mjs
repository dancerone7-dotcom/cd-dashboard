import assert from 'node:assert/strict';
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
  assert.equal(hipIr0.position, 'supine');
  assert.equal(hipIr0.positionDetail, 'hip_at_0_degrees');
  assert.equal(hipIr90.position, 'supine');
  assert.equal(hipIr90.positionDetail, 'hip_at_90_degrees');
  assert.equal(shoulderErSupine.motionMode, 'passive');
  assert.equal(shoulderErSupine.position, 'supine');
  assert.equal(shoulderErProne.motionMode, 'active');
  assert.equal(shoulderErProne.position, 'prone');
  assert.equal(shoulderErProne.positionDetail, 'shoulder_at_90_degrees');
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
