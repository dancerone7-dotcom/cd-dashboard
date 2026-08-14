# CD Tool V5 — Architecture Brief
## Replacement architecture for the post-review rebuild

> **Instruction to Codex:** Read this file in full before writing code. V4 is a prototype/reference implementation. Do not extend the V4 monolith into V5.

---

# 1. Kickoff message

```text
Read docs/CD_TOOL_V5_ARCHITECTURE.md in full before doing anything.

V4 proved the concept but its metric model is too shallow relative to the actual
Early Medical physical-capacity assessment.

The physical assessment includes:
- a multi-level PCA movement/performance battery,
- a separate bilateral pROM / orthopedic assessment,
- CPET,
- DEXA,
- VALD ForceDecks,
- VALD ForceFrame,
- VALD DynaMo / dynamometry,
- and field/qualitative observations.

The key V5 architectural rule is:

RAW ASSESSMENT OBSERVATION
    -> CAPACITY STATE
        -> CD GOAL REQUIREMENT

Modeled future capacity is a separate result:

CAPACITY STATE + DECLINE MODEL + TRAJECTORY + TARGET AGE
    -> PROJECTION RESULT

Do not map every raw test directly to CD goals.
Do not create a giant weighted score.
Do not build the spider plot yet.

Before writing code:
1. inspect the current repository,
2. explain the V4 data flow from raw metric to goal status,
3. compare it with the V5 model below,
4. list every V4 concept that can be migrated unchanged,
5. list every concept that needs replacement,
6. propose the smallest safe migration path.

Do not write UI code in this pass.
Do not change V4.
```

---

# 2. Product model

A patient defines the activities they want to preserve at their chosen marginal-decade age.

The tool must:

1. ingest the complete physical assessment,
2. preserve the raw measurements and clinical observations,
3. interpret those observations into meaningful physical capacities,
4. map those capacities to patient-specific CD goals,
5. project capacities only where a defensible decline model exists,
6. identify the highest-leverage limiting capacities,
7. retain important foundational/orthopedic findings even when they are not CD drivers,
8. explain every conclusion back to its underlying evidence.

There is no single composite longevity score.

---

# 3. Critical separation of concepts

These concepts may never be conflated:

### Test definition
What did we perform?

### Observation
What happened when this patient performed the test?

### Capacity
What meaningful physical quality does that evidence inform?

### Capacity state
What was this patient's capacity at the actual assessment?

### Assessment standard and context
How does the current observation or capacity compare with a compatible current-assessment reference for this patient's demographic and protocol context?

### Goal definition
What reusable/canonical life task and requirement set has been defined and reviewed?

### Goal requirement
How does that capacity relate to this specific life task?

### Decline model
How might that capacity change with age under a stated training trajectory?

### Projection result
What modeled future value results from applying a resolved decline model and explicit trajectory to the assessed capacity state?

Task demand, current-assessment context, and longitudinal decline evidence are separate data sources.

---

# 4. Domain model

## Patient

```ts
type Patient = {
  id: string
  name: string
  dob: string
  sex: 'male' | 'female'
  programTier: 'platinum' | 'gold' | 'silver'

  // Validated numeric domain value. 80, 85 and 90 may be offered as UI
  // presets or policy defaults, but are not the only representable ages.
  marginalDecadeTargetAge: number

  defaultTrajectory:
    | 'sedentary'
    | 'maintain'
    | 'specific'
}
```

`marginalDecadeTargetAge` must be a finite validated numeric age. Validation must use the patient's age at the projection origin and the current product/clinical policy; UI presets such as 80, 85 and 90 do not narrow the stored domain type.

Do not assume exactly ten CD goals.

---

## Assessment

```ts
type Assessment = {
  id: string
  patientId: string
  startedOn: string

  protocolVersion: string
  location: string | null
  dayCount: number | null
}
```

---

## AssessmentTestDefinition

```ts
type AssessmentTestDefinition = {
  id: string
  slug: string
  displayName: string

  domain:
    | 'aerobic'
    | 'body_composition'
    | 'strength'
    | 'power'
    | 'reactivity'
    | 'endurance'
    | 'balance'
    | 'mobility'
    | 'movement_quality'
    | 'orthopedic_screen'

  sourceSystem:
    | 'dexa'
    | 'cpet'
    | 'vald_forcedecks'
    | 'vald_forceframe'
    | 'vald_dynamo'
    | 'dari'
    | 'field'
    | 'manual_exam'
    | 'subjective'

  resultType:
    | 'scalar'
    | 'bilateral_scalar'
    | 'ordinal'
    | 'binary'
    | 'qualitative'
    | 'performance_task'

  canonicalUnit: string | null

  laterality:
    | 'none'
    | 'left_right'
    | 'bilateral'

  motionMode:
    | 'not_applicable'
    | 'active'
    | 'passive'
    | 'active_and_passive'
    | 'isometric'
    | 'dynamic'

  position:
    | 'not_applicable'
    | 'supine'
    | 'prone'
    | 'seated'
    | 'standing'
    | 'half_kneeling'
    | 'quadruped'
    | 'other'

  protocolId: string
  protocolVersion: string
}
```

---

## AssessmentObservation

```ts
type AssessmentObservation = {
  id: string
  patientId: string
  assessmentId: string
  testDefinitionId: string

  measuredAt: string | null

  side: 'left' | 'right' | 'bilateral' | 'none'

  motionMode:
    | 'active'
    | 'passive'
    | 'isometric'
    | 'dynamic'
    | 'not_applicable'

  numericValue: number | null
  unit: string | null

  ordinalValue: string | null

  // Always preserve the unparsed source value.
  rawText: string | null

  painPresent: boolean | null
  painContext: string | null

  compensation: string | null
  qualityGrade: string | null

  completionState:
    | 'measured'
    | 'not_measured'
    | 'skipped'
    | 'contraindicated'
    | 'pain_limited'
    | 'unable'
    | 'redundant'

  notes: string | null
}
```

Never represent missing, skipped or unable as zero.

---

## Capacity

```ts
type Capacity = {
  id: string
  slug: string
  displayName: string

  domain:
    | 'aerobic'
    | 'strength'
    | 'power'
    | 'reactivity'
    | 'endurance'
    | 'balance'
    | 'mobility'
    | 'movement_control'
    | 'body_composition'
    | 'orthopedic'

  stateType:
    | 'direct_measure'
    | 'derived'
    | 'clinician_interpreted'

  canonicalUnit: string | null
  higherIsBetter: boolean | null

  declineClass: string | null
}
```

Examples:
- peak aerobic capacity
- sustainable aerobic capacity
- lower-body power
- knee-extensor strength
- hip rotational mobility
- foot/ankle mobility
- shoulder/scapular capacity
- single-leg control
- reactive strength
- trunk endurance
- grip / upper-pull capacity

---

## TestToCapacityMap

```ts
type TestToCapacityMap = {
  testDefinitionId: string
  capacityId: string

  role:
    | 'direct_measure'
    | 'supporting_evidence'
    | 'constraint'
    | 'clinical_context'

  aggregationMethod:
    | 'direct'
    | 'weaker_side'
    | 'best_trial'
    | 'mean'
    | 'rule_based'
    | 'clinician_interpreted'

  weight: number | null

  evidenceGrade: 'A' | 'B' | 'C'
  evidenceNote: string
  sourceRef: string | null
}
```

No arbitrary weight is allowed just because the schema supports one.

---

## CapacityState

```ts
type CapacityState = {
  id: string
  patientId: string
  assessmentId: string
  capacityId: string

  numericValue: number | null
  unit: string | null

  interpretation:
    | 'strong'
    | 'adequate'
    | 'developing'
    | 'limited'
    | 'clinical_review'
    | 'insufficient_data'

  confidence:
    | 'high'
    | 'moderate'
    | 'low'

  observationIds: string[]

  derivation:
    | 'direct'
    | 'deterministic'
    | 'clinician_interpreted'
}
```

A clinician-interpreted capacity does not receive a fake numeric score solely to make a visualization possible.

`CapacityState` describes the patient at the actual assessment. A future modeled value is never stored as another `CapacityState`; it is a `ProjectionResult` derived from this state.

---

## AssessmentStandard

An assessment standard provides current-assessment interpretation only. It is not a CD task demand and is not a longitudinal decline model.

```ts
type AssessmentStandard = {
  id: string
  slug: string
  displayName: string

  compatibleCapacityIds: string[]
  compatibleTestDefinitionIds: string[]

  ageApplicability: {
    minimumAge: number | null
    maximumAge: number | null
  }

  sexApplicability: Array<'male' | 'female'>

  protocolCompatibility: Array<{
    protocolId: string
    protocolVersion: string | null
  }>

  interpretationType:
    | 'percentile'
    | 'tier'

  sourceType:
    | 'normative'
    | 'internal'

  version: string

  provenance: {
    sourceRef: string
    publisherOrOwner: string
    populationDescription: string | null
    effectiveDate: string | null
  }
}
```

A standard must identify at least one compatible capacity or test definition. Compatibility, demographic coverage and protocol version must be checked before it can generate assessment context. A null compatible protocol version is allowed only when the standard explicitly documents that it is protocol-independent; it is not a wildcard for unknown compatibility.

---

## AssessmentContext

`AssessmentContext` records the current-assessment interpretation produced by applying one compatible `AssessmentStandard` to one assessed capacity state or observation.

```ts
type AssessmentContext = {
  id: string
  patientId: string
  assessmentId: string

  standardId: string
  standardVersion: string

  capacityStateId: string | null
  observationId: string | null

  percentile: number | null
  tier: string | null
  interpretation: string | null

  demographicContext: {
    age: number
    sex: 'male' | 'female'
  }

  protocolContext: {
    protocolId: string
    protocolVersion: string
  } | null

  provenance: {
    sourceRef: string
    sourceType: 'normative' | 'internal'
  }
}
```

Exactly one of `capacityStateId` or `observationId` must identify the interpreted assessment result. The stored demographic and protocol context makes stale or incompatible assessment context detectable. A percentile or tier calculated for a different age, sex, test or protocol context cannot silently remain active. Assessment context may inform current interpretation, planning and foundational review, but it cannot become a task threshold or longitudinal slope.

---

## CDGoalDefinition

Reusable/canonical task definitions are separate from the goals selected or authored for a specific patient.

```ts
type CDGoalDefinition = {
  id: string
  slug: string
  displayName: string
  description: string
  requirementIds: string[]
  evidenceVersion: string
  approvalState: 'approved' | 'provisional' | 'retired'
}
```

The definition owns the reusable task decomposition and evidence version. Approval applies to that definition and requirement set, not to a patient's selection of the goal. An `approved` definition may be eligible for clearance subject to its requirement-level evidence and calibration rules. A `provisional` definition remains visible for review/planning but cannot create definitive clearance. A `retired` definition remains auditable for historical records but cannot be newly selected.

---

## CDGoal

```ts
type CDGoal = {
  id: string
  patientId: string

  definitionId: string | null

  label: string
  slug: string

  origin:
    | 'picked'
    | 'custom'
    | 'coach_added'

  whyText: string

  isNonNegotiable: boolean

  rank: number | null

  createdAt: string
  retiredAt: string | null

  subsumesGoalIds: string[]
}
```

`whyText` is required.

There is no fixed goal count.

A picked canonical goal references a `CDGoalDefinition`. A custom patient goal may have `definitionId: null` until its task decomposition is reviewed. A goal without a reviewed definition may be retained and discussed, but it cannot silently inherit canonical requirements or receive fabricated clearance.

---

## GoalRequirement

```ts
type GoalRequirement = {
  id: string
  goalDefinitionId: string
  capacityId: string

  role:
    | 'primary_driver'
    | 'contributor'
    | 'constraint'
    | 'context'

  thresholdValue: number | null
  thresholdUnit: string | null

  weight: number | null

  taskDemandEvidenceGrade:
    | 'A'
    | 'B'
    | 'C'

  mappingEvidenceGrade:
    | 'A'
    | 'B'
    | 'C'

  evidenceNote: string
  sourceRef: string | null
}
```

`GoalRequirement` belongs to the reusable `CDGoalDefinition`. Patient-specific evaluation resolves a patient's `CDGoal.definitionId` to its versioned requirement set. Definition approval state and requirement-level evidence determine whether each relationship is eligible for clearance or only planning/context. Requirements are not duplicated or silently modified merely because multiple patients select the same goal.

### Role rules

**primary_driver**
A defensible failure may determine that the goal is off track.

**contributor**
Meaningfully affects the task but does not create a hard fail without supporting logic.

**constraint**
Can limit expression of another capacity or affect training strategy.

**context**
Shown for interpretation only. Does not change CD clearance.

---

## CapacityDependency

```ts
type CapacityDependency = {
  upstreamCapacityId: string
  downstreamCapacityId: string

  relationship:
    | 'enables'
    | 'constrains'
    | 'modifies_interpretation'

  evidenceGrade:
    | 'A'
    | 'B'
    | 'C'

  note: string
}
```

Use this sparingly.

Do not infer deterministic injury probability.

---

## DeclineModel

```ts
type DeclineModel = {
  id: string

  capacityId: string | null
  declineClass: string | null

  trajectory:
    | 'sedentary'
    | 'maintain'
    | 'specific'

  curveType:
    | 'linear'
    | 'exponential'
    | 'piecewise'

  ratePerDecade: number | null
  params: unknown | null

  populationBasis:
    | 'sedentary_cohort'
    | 'active_cohort'
    | 'mixed'
    | 'expert_prior'

  evidenceGrade:
    | 'A'
    | 'B'
    | 'C'

  sourceRef: string
}
```

Resolution order:

1. exact capacity + trajectory,
2. decline class + trajectory,
3. explicit null projection with reason.

Never silently apply a generic decline rate.

---

## ProjectionResult

Projection is an explicit derivation from an actual assessed capacity state. It does not mutate or replace that `CapacityState`.

```ts
type ProjectionResult = {
  id: string
  capacityId: string
  sourceCapacityStateId: string

  fromAge: number
  toAge: number

  trajectory:
    | 'sedentary'
    | 'maintain'
    | 'specific'

  projectedValue: number | null
  unit: string | null
  pctRetained: number | null

  uncertaintyRange: {
    low: number
    high: number
  } | null

  modelUsed: {
    declineModelId: string
    resolution:
      | 'exact_capacity'
      | 'decline_class'
  } | null

  evidenceGrade: 'A' | 'B' | 'C' | null

  populationBasis:
    | 'sedentary_cohort'
    | 'active_cohort'
    | 'mixed'
    | 'expert_prior'
    | null

  extrapolationState:
    | 'within_observed_horizon'
    | 'beyond_observed_horizon'
    | 'unresolved'

  nullReason: string | null
}
```

Architecture rule:

`CapacityState + DeclineModel + trajectory + target age -> ProjectionResult`

If no exact-capacity or decline-class model resolves, `projectedValue`, `pctRetained`, `uncertaintyRange` and `modelUsed` are null, `extrapolationState` is `unresolved`, and `nullReason` is required.

---

# 5. Ingestion contract

V5 must ingest all tracked assessment data even when it does not affect CD scoring.

The minimum known-source ontology coverage is enumerated in [`docs/v5/V5_ASSESSMENT_SOURCE_INVENTORY.md`](v5/V5_ASSESSMENT_SOURCE_INVENTORY.md):

- 49 PCA tests,
- 39 pROM/orthopedic tests,
- 18 CPET metrics,
- 18 DEXA metrics,
- 14 explicit current V4 VALD protocol mappings,
- 2 explicit current V4 timed-stance protocol definitions.

This is a minimum coverage register, not proof that every source or protocol version has been supplied. Unknown rows still enter import review. Unspecified VALD protocol-owner fields remain pending and may not be inferred.

## Sources

### PCA Tracker
Must support:
- objective performance values,
- qualitative results,
- status,
- compensation,
- subjective assessment,
- skip/omit/redundant states,
- protocol level.

### pROM / orthopedic tracker
Must support:
- left/right,
- active/passive,
- test position,
- numeric ROM,
- qualitative restriction,
- pain,
- manual orthopedic screens.

### CPET
Must support at minimum the tracker surface:
- VO2max absolute and relative
- VO2 at Zone 2
- % VO2max at Zone 2
- Zone 2 HR
- Zone 2 modality output
- METs
- watts/kg
- HR max
- HR recovery
- max fat oxidation
- resting lactate

### DEXA
Must support:
- bodyweight
- body-fat %
- VAT
- ALMI
- FFMI
- regional lean mass
- lean-mass symmetry
- site-specific T-scores
- site-specific Z-scores

### VALD
Preserve exact system/test provenance.

Examples:
- ForceDecks — jump/hop/balance
- ForceFrame — isolated isometric strength
- DynaMo — grip / dynamometry

Measurement source and research/forecast source are separate.

---

# 6. Import normalization

Actual tracker data contain human-entered text.

The ingestion layer must include:

## Test alias registry

```ts
TEST_ALIASES = {
  'PRI Functional Sqaut': 'pri_functional_squat',
  'PRI Functional Squat': 'pri_functional_squat',
  'Prone T': 'prone_t_isometric',
  'Prone Isometric “T”': 'prone_t_isometric'
}
```

No silent fuzzy matching.

Unknown test strings enter an explicit import-review state.

## Result parser

Preserve `rawText`.

Normalize only when unambiguous.

Examples:

`29.8lb, 27.3lb`
may become bilateral observations only if the side order is known from the protocol/source.

`Left: 25x5, Right:25x5`
may be parsed explicitly.

`Skip`, `Omit`, `Redundant`
are completion states, not numeric results.

Ambiguous strings remain unparsed and require review.

---

# 7. Analytic pathways

Every observation can be retained without being scored.

A capacity can participate in:

## CD clearance
Only qualified task mappings.

## CD planning priority
Drivers + relevant contributors.

## Foundational / orthopedic opportunity
Important whole-assessment deficits outside CD clearance.

## Clinical context
Visible, but no scoring effect.

## Prescription context
Useful for training prescription without serving as a CD threshold.

Do not conflate these pathways.

---

# 8. Driver synthesis engine

The engine ranks **capacities**, never raw tests.

Required output:

```ts
type DriverExplanation = {
  capacityId: string

  impactedGoalIds: string[]
  impactedGoalCount: number
  selectedGoalCount: number

  directBlockerGoalIds: string[]

  currentDeficit: number | null
  projectedDeficit: number | null

  mappingConfidence:
    | 'high'
    | 'moderate'
    | 'low'

  supportingObservationIds: string[]

  whyRankedHere: string[]
}
```

## Ranking order

1. validated direct blockers,
2. goal breadth,
3. current deficit severity,
4. projected vulnerability,
5. role,
6. mapping confidence.

Do not make goal breadth a tiebreaker only.

Do not let multiple correlated tests from the same region inflate the rank by being counted as separate independent weaknesses.

---

# 9. Projection engine

Pure, dependency-free module.

```ts
project({
  sourceCapacityState,
  capacity,
  fromAge,
  toAge,
  trajectory
}) -> ProjectionResult
```

Rules:

- exponential default where appropriate,
- linear supported,
- piecewise supported,
- values cannot become negative,
- no increase from a decline-only model,
- explicit null if no model resolves,
- capacity-specific model before decline-class fallback.

The source `CapacityState` remains the actual assessed state. All future modeled values, uncertainty, evidence and extrapolation metadata live in `ProjectionResult`.

The UI must always state the selected trajectory:

- Sedentary
- Keep doing what you're doing
- Train specifically

No projection may be shown without the assumption visible.

---

# 10. Status

Single source of truth.

Default proposal:

- On track
- At risk
- Off track

Final taxonomy remains configurable pending leadership ratification.

Do not reintroduce ambiguous `On track` vs `Tracking`.

Incomplete data and insufficient model calibration are not performance statuses.

They are separate model/data states.

---

# 11. Patient-facing hierarchy

## Landing dashboard
- custom patient goals
- why text
- non-negotiables
- status
- top three strengths
- top three highest-leverage opportunities
- foundational/orthopedic opportunities below the fold

## Goal detail
- per-goal spider plot
- current values
- thresholds
- projections
- selected trajectory
- capacity explanations

## Capacity deep dive
- every underlying assessment observation
- longitudinal history
- three trajectories
- every dependent CD goal
- evidence provenance
- clinician notes

---

# 12. Spider plot

The spider plot operates on capacities, not raw tests.

For each eligible capacity:

`ratio = value / threshold`

where directionality is handled correctly.

- target = green ring at 1.0
- today = blue
- target-age projection = red

Sequential reveal:
1. green,
2. blue,
3. red.

Red inside green = projected gap.

A capacity without a defensible normalized task threshold must not receive an invented radar coordinate.

Above 10 axes, use a bar layout.

---

# 13. Foundational layer

Preserve this from V4.

A significant weakness outside the patient's active CD goal mappings can surface as a foundational/orthopedic opportunity.

Examples:
- shoulder weakness in a patient with no shoulder-heavy selected goal,
- substantial sagittal-plane deficit in a patient whose goals are mostly rotational.

Rules:
- does not automatically turn unrelated CD goals red,
- does not produce an injury-risk percentage,
- does not imply deterministic injury probability.

---

# 14. V5 implementation tickets

## V5-00 — Build assessment ontology

Before writing UI:

- use `docs/v5/V5_ASSESSMENT_SOURCE_INVENTORY.md` as the minimum known-source coverage register,
- canonicalize all PCA MASTER tests,
- canonicalize pROM/orthopedic tests,
- canonicalize CPET fields,
- canonicalize DEXA fields,
- canonicalize VALD/system-specific fields,
- assign source system,
- assign unit,
- assign result type,
- assign laterality,
- assign motion mode,
- assign position,
- define aliases,
- version protocols.

### Acceptance

- all 49 enumerated PCA tests are represented,
- all 39 enumerated pROM/orthopedic tests are represented,
- all 18 enumerated CPET metrics are represented,
- all 18 enumerated DEXA metrics are represented,
- every explicitly enumerated current V4 VALD/protocol definition is represented without invented protocol detail,
- unresolved protocol-owner fields are visibly pending,
- every known current tracker row resolves to exactly one test definition,
- unknown names fail into review,
- no source field is silently dropped,
- test provenance survives round trip.

---

## V5-01 — Build observation ingestion

Write failing tests first.

Fixtures must include:
- bilateral numeric result,
- active/passive ROM,
- pain at end range,
- qualitative orthopedic restriction,
- `Skip`,
- `Omit`,
- `Redundant`,
- DARI/device reference,
- normal scalar CPET,
- DEXA site-specific result.

### Acceptance

- normalized structured output,
- raw text preserved,
- missing never becomes zero,
- ambiguous parsing produces review state,
- unit conversion centralized.

---

## V5-02 — Build capacity layer

Before implementation, produce the proposed capacity taxonomy for clinical review.

### Acceptance

- every direct V4 metric maps to a V5 capacity,
- raw tests can support one or more capacities,
- capacity can cite every supporting observation,
- no composite score without documented derivation,
- clinician-interpreted capacities clearly labeled.

---

## V5-03 — Build CD requirement graph

Create reusable `CDGoalDefinition` records and map capacities to their versioned `GoalRequirement` records as:
- primary driver,
- contributor,
- constraint,
- context.

### Acceptance

- every relationship carries evidence,
- hard clearance cannot be created by low-confidence support,
- task demand fixed independent of patient age/sex,
- no population norm becomes a task threshold.
- patient `CDGoal` records reference definitions without duplicating canonical requirements,
- a custom goal with `definitionId: null` cannot receive fabricated clearance.

---

## V5-04 — Build driver synthesis

### Acceptance

For a patient, engine returns:
- top capacities,
- X of N goals impacted,
- direct blocker goals,
- supporting observations,
- current/projected deficit,
- mapping confidence,
- explanation for rank.

Add regression:
A moderate deficit affecting many goals outranks a similar isolated deficit unless the isolated deficit is a validated direct blocker.

---

## V5-05 — Projection engine

Implement only after capacity IDs are stable.

Return a `ProjectionResult` linked to its source `CapacityState`; never store the modeled future value as a new capacity state. Unresolved models return an explicit null result and reason.

---

## V5-06 — Current/future and status

Every projected result shows:
- today,
- unit,
- date,
- goal threshold,
- target-age result,
- trajectory,
- evidence,
- extrapolation state or explicit unresolved reason.

---

## V5-07 — Spider plot

Do not begin until V5-00 through V5-04 are approved.

---

# 15. First Codex deliverable

The first Codex session does **not** write implementation code.

It returns:

1. current V4 architecture map,
2. V4 → V5 entity mapping,
3. proposed repository/module structure,
4. migration plan,
5. risks,
6. open clinical decisions,
7. list of assumptions it would otherwise have made.

Then stop for review.
