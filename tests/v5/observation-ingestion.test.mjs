import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { loadOntology } from '../../scripts/validate-v5-ontology.mjs';
import { ingestObservation } from '../../src/v5/ingestion/observation-ingestion.mjs';
import { convertUnit, resolveUnitToken } from '../../src/v5/ingestion/unit-conversion.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureFile = JSON.parse(
  await readFile(path.join(ROOT, 'tests/v5/fixtures/observation-ingestion.json'), 'utf8'),
);

function assertSubset(actual, expected, context) {
  for (const [key, value] of Object.entries(expected)) {
    if (typeof value === 'number' && !Number.isInteger(value)) {
      assert.ok(Math.abs(actual[key] - value) < 1e-9, `${context}.${key}: ${actual[key]} != ${value}`);
    } else {
      assert.deepEqual(actual[key], value, `${context}.${key}`);
    }
  }
}

function containsForbiddenModelField(value) {
  if (Array.isArray(value)) return value.some(containsForbiddenModelField);
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(
    ([key, child]) => /^(capacity(Id|State)?|goal(Id|Requirement)?|projection(Result)?|declineModel)$/i.test(key)
      || containsForbiddenModelField(child),
  );
}

test('all required V5-01 fixtures preserve raw input and normalize or review deterministically', async () => {
  const ontology = await loadOntology(ROOT);
  for (const fixture of fixtureFile.fixtures) {
    const result = ingestObservation(fixture.input, { ontology });
    assert.equal(result.status, fixture.expected.status, fixture.id);
    assert.deepEqual(result.rawInput, fixture.input, `${fixture.id} raw input`);
    assert.equal(containsForbiddenModelField(result), false, `${fixture.id} must remain observation-only`);

    if (result.status === 'normalized') {
      assert.equal(result.testDefinitionId, fixture.expected.definitionId, `${fixture.id} definition`);
      assert.equal(result.observations.length, fixture.expected.observations.length, `${fixture.id} observation count`);
      fixture.expected.observations.forEach((expected, index) => {
        const observation = result.observations[index];
        assertSubset(observation, expected, `${fixture.id}[${index}]`);
        assert.equal(observation.patientId, fixture.input.patientId);
        assert.equal(observation.assessmentId, fixture.input.assessmentId);
        assert.equal(observation.testDefinitionId, fixture.expected.definitionId);
        assert.deepEqual(observation.rawValue, fixture.input.rawValue);
        assert.equal(observation.rawText, typeof fixture.input.rawValue === 'string' ? fixture.input.rawValue : String(fixture.input.rawValue));
        assert.equal(observation.sourceProvenance.sourceSystemId, fixture.input.sourceSystemId);
        assert.equal(observation.sourceProvenance.sourceLabel, fixture.input.sourceLabel);
        assert.ok(observation.sourceProvenance.sourceInventoryRecordId);
        assert.ok(observation.sourceProvenance.sourceSnapshotId);
        assert.ok(observation.sourceProvenance.protocolId);
        assert.ok(observation.sourceProvenance.protocolVersion);
        assert.deepEqual(observation.sourceProvenance.deviceReference, fixture.input.deviceReference ?? null);
      });
    } else {
      assert.equal(result.observations.length, 0, `${fixture.id} review must not emit an observation`);
      assert.equal(result.review.code, fixture.expected.reviewCode, `${fixture.id} review code`);
    }
  }
});

test('Skip, Omit and Redundant are completion states and missing values never become zero', async () => {
  const ontology = await loadOntology(ROOT);
  for (const id of ['skip-state', 'omit-state', 'redundant-state', 'blank-is-missing']) {
    const fixture = fixtureFile.fixtures.find((candidate) => candidate.id === id);
    const observation = ingestObservation(fixture.input, { ontology }).observations[0];
    assert.equal(observation.numericValue, null, id);
    assert.notEqual(observation.numericValue, 0, id);
  }
});

test('bilateral order is never guessed and unknown or fuzzy labels enter explicit import review', async () => {
  const ontology = await loadOntology(ROOT);
  const ambiguous = fixtureFile.fixtures.find((fixture) => fixture.id === 'ambiguous-human-text').input;
  assert.equal(ingestObservation(ambiguous, { ontology }).review.code, 'ambiguous_bilateral_order');

  const fuzzy = {
    ...fixtureFile.fixtures.find((fixture) => fixture.id === 'unknown-test-label').input,
    sourceLabel: 'Bodyweight squats',
  };
  assert.deepEqual(ingestObservation(fuzzy, { ontology }).review, {
    code: 'unknown_source_label',
    message: 'No exact approved test label or alias exists for this source system.',
  });
});

test('exact approved aliases resolve while source-system scope remains strict', async () => {
  const ontology = await loadOntology(ROOT);
  const aliasResult = ingestObservation({
    observationId: 'obs-alias',
    patientId: 'synthetic-patient-01',
    assessmentId: 'synthetic-assessment-01',
    sourceSystemId: 'pca_field',
    sourceLabel: 'PRI Functional Sqaut',
    rawValue: 'Skip',
  }, { ontology });
  assert.equal(aliasResult.status, 'normalized');
  assert.equal(aliasResult.testDefinitionId, 'atd.pca.001');

  const wrongSource = ingestObservation({
    observationId: 'obs-wrong-source',
    patientId: 'synthetic-patient-01',
    assessmentId: 'synthetic-assessment-01',
    sourceSystemId: 'cpet',
    sourceLabel: 'Left-femur T-score',
    rawValue: '-1.2 T-score',
  }, { ontology });
  assert.equal(wrongSource.status, 'import_review');
  assert.equal(wrongSource.review.code, 'unknown_source_label');
});

test('unit resolution and conversion are centralized, exact and reject unsupported conversions', () => {
  assert.equal(resolveUnitToken('°'), 'degree');
  assert.equal(resolveUnitToken('mL/kg/min'), 'milliliter_per_kilogram_minute');
  assert.equal(resolveUnitToken('T-score'), 't_score');
  assert.equal(resolveUnitToken('unsupported unit'), null);

  assert.deepEqual(convertUnit(40, 'kilogram', 'pound'), {
    status: 'converted',
    value: 88.184904874,
    unit: 'pound',
    conversionId: 'kilogram_to_pound',
  });
  assert.deepEqual(convertUnit(100, 'percent_bodyweight', 'multiple_bodyweight'), {
    status: 'converted',
    value: 1,
    unit: 'multiple_bodyweight',
    conversionId: 'percent_bodyweight_to_multiple_bodyweight',
  });
  assert.deepEqual(convertUnit(10, 'degree', 'second'), {
    status: 'review',
    reason: 'unsupported_unit_conversion',
    fromUnit: 'degree',
    toUnit: 'second',
  });
});

test('numeric fields without a source-established unit enter review instead of inheriting a pending canonical assumption', async () => {
  const ontology = await loadOntology(ROOT);
  const input = {
    observationId: 'obs-unit-missing',
    patientId: 'synthetic-patient-01',
    assessmentId: 'synthetic-assessment-01',
    sourceSystemId: 'cpet',
    sourceLabel: 'VO2max relative',
    rawValue: '42.6',
  };
  const result = ingestObservation(input, { ontology });
  assert.equal(result.status, 'parse_review');
  assert.equal(result.review.code, 'missing_numeric_unit');
  assert.deepEqual(result.rawInput, input);
});

test('accepted observations require patient and assessment trace identifiers', async () => {
  const ontology = await loadOntology(ROOT);
  const input = {
    observationId: 'obs-missing-trace',
    patientId: '',
    assessmentId: 'synthetic-assessment-01',
    sourceSystemId: 'cpet',
    sourceLabel: 'VO2max relative',
    rawValue: '42.6 mL/kg/min',
  };
  const result = ingestObservation(input, { ontology });
  assert.equal(result.status, 'import_review');
  assert.equal(result.review.code, 'missing_trace_identifier');
  assert.deepEqual(result.rawInput, input);
});
