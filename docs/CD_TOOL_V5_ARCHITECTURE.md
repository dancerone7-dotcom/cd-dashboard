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

### Goal requirement
How does that capacity relate to this specific life task?

### Decline model
How might that capacity change with age under a stated training trajectory?

### Assessment standard
How does the current result compare with an age/sex or internal assessment context?

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

  marginalDecadeTargetAge: 80 | 85 | 90

  defaultTrajectory:
    | 'sedentary'
    | 'maintain'
    | 'specific'
}
```

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

---

## CDGoal

```ts
type CDGoal = {
  id: string
  patientId: string

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

---

## GoalRequirement

```ts
type GoalRequirement = {
  id: string
  cdGoalId: string
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

# 5. Ingestion contract

V5 must ingest all tracked assessment data even when it does not affect CD scoring.

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
  currentValue,
  capacity,
  fromAge,
  toAge,
  trajectory
}) -> {
  projectedValue,
  pctRetained,
  modelUsed,
  evidenceGrade,
  populationBasis,
  reason
}
```

Rules:

- exponential default where appropriate,
- linear supported,
- piecewise supported,
- values cannot become negative,
- no increase from a decline-only model,
- explicit null if no model resolves,
- capacity-specific model before decline-class fallback.

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

Map capacities to goals as:
- primary driver,
- contributor,
- constraint,
- context.

### Acceptance

- every relationship carries evidence,
- hard clearance cannot be created by low-confidence support,
- task demand fixed independent of patient age/sex,
- no population norm becomes a task threshold.

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

---

## V5-06 — Current/future and status

Every projected result shows:
- today,
- unit,
- date,
- goal threshold,
- target-age result,
- trajectory,
- evidence.

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
