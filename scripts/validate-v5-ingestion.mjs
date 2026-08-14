import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadOntology, validateOntology } from './validate-v5-ontology.mjs';
import { ingestObservation } from '../src/v5/ingestion/observation-ingestion.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturesFile = JSON.parse(
  await readFile(path.join(ROOT, 'tests/v5/fixtures/observation-ingestion.json'), 'utf8'),
);
const ontology = await loadOntology(ROOT);
const ontologyValidation = validateOntology(ontology);
assert.deepEqual(ontologyValidation.errors, [], 'V5-00 must remain valid before ingestion validation');

const results = [];
for (const fixture of fixturesFile.fixtures) {
  const result = ingestObservation(fixture.input, { ontology });
  assert.equal(result.status, fixture.expected.status, fixture.id);
  assert.deepEqual(result.rawInput, fixture.input, `${fixture.id} raw input`);
  assert.equal(hasForbiddenModelField(result), false, `${fixture.id} crossed the observation-layer boundary`);
  if (result.status === 'normalized') {
    assert.equal(result.testDefinitionId, fixture.expected.definitionId, `${fixture.id} definition`);
    assert.equal(result.observations.length, fixture.expected.observations.length, `${fixture.id} observation count`);
    for (const observation of result.observations) {
      assert.equal(observation.patientId, fixture.input.patientId, `${fixture.id} patient link`);
      assert.equal(observation.assessmentId, fixture.input.assessmentId, `${fixture.id} assessment link`);
      assert.equal(observation.testDefinitionId, fixture.expected.definitionId, `${fixture.id} test link`);
      assert.ok(observation.sourceProvenance.sourceInventoryRecordId, `${fixture.id} source inventory link`);
      assert.ok(observation.sourceProvenance.sourceSnapshotId, `${fixture.id} source snapshot link`);
      assert.ok(observation.sourceProvenance.protocolId, `${fixture.id} protocol link`);
      assert.ok(observation.sourceProvenance.protocolVersion, `${fixture.id} protocol version link`);
      if (observation.completionState !== 'measured' && observation.completionState !== 'pain_limited') {
        assert.equal(observation.numericValue, null, `${fixture.id} non-measurement numeric value`);
      }
    }
  } else {
    assert.equal(result.observations.length, 0, `${fixture.id} review emitted an observation`);
    assert.equal(result.review.code, fixture.expected.reviewCode, `${fixture.id} review code`);
  }
  results.push({
    fixture: fixture.id,
    status: result.status,
    definitionId: result.testDefinitionId,
    observationCount: result.observations.length,
    reviewCode: result.review?.code ?? null,
  });
}

const statusCounts = Object.fromEntries(
  [...new Set(results.map((result) => result.status))].map((status) => [
    status,
    results.filter((result) => result.status === status).length,
  ]),
);
process.stdout.write(`${JSON.stringify({
  schemaVersion: fixturesFile.schemaVersion,
  ontologyDefinitionCount: ontologyValidation.summary.definitionCount,
  fixtureCount: results.length,
  statusCounts,
  results,
}, null, 2)}\n`);

function hasForbiddenModelField(value) {
  if (Array.isArray(value)) return value.some(hasForbiddenModelField);
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(
    ([key, child]) => /^(capacity(Id|State)?|goal(Id|Requirement)?|projection(Result)?|declineModel)$/i.test(key)
      || hasForbiddenModelField(child),
  );
}
