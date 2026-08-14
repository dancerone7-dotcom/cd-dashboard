# PCA → Centenarian Decathlon Data-Model Audit
## V1 — Post-meeting architecture audit

### Purpose

The current V4 Centenarian Decathlon dashboard proved the presentation concept, but it does not represent the Early Medical physical-capacity assessment at the same resolution at which the assessment is actually performed.

The core V5 design objective is:

> Ingest the full assessment, preserve the raw clinical evidence, derive interpretable physical capacities from that evidence, and then identify which capacities are the most important drivers of the patient's selected Centenarian Decathlon goals.

The model must **not** treat every raw assessment test as an independent CD input. Doing that would double-count correlated findings and produce an opaque weighted score.

The required architecture is:

**Assessment test / observation → capacity state → CD goal requirement**

with a separate pathway for foundational/orthopedic findings that matter clinically but should not determine unrelated CD goal clearance.

---

# 1. Source audit

## 1.1 PCA Tracker (MASTER)

The master PCA tracker currently spans these populated assessment categories:

- Double Leg
- Hinge
- Locomotion
- Single Leg
- Trunk
- Upper Pull
- Upper Push

Examples include:

### Double Leg
- PRI Functional Squat
- Bodyweight Squat
- Wall Sit
- Goblet Squat
- Front Squat
- Back Squat
- Vertical Jump

### Hinge
- Toe Touch
- Toe Touch Opposite Foot Reach
- Hip Hinge with Dowel
- KB Deadlift
- Relative Deadlift
- Broad Jump

### Locomotion
- Toe Dexterity
- 1st Toe Flexion
- Toes 2–5 Flexion
- Half-Kneeling Dorsiflexion
- Standing Rotation
- Single-Leg Calf Raise
- Gait Analysis

### Single Leg
- Trendelenburg
- Fukuda Step Test
- Bodyweight Split Squat
- Eccentric Step Down
- Loaded Step-Up
- Single-Leg Vertical Jump
- Single-Leg Broad Jump
- Single-Leg Pogos

### Trunk
- DNS 3-Month
- Posterior Mediastinum Expansion
- Standing Hip Hike
- Heel-to-Wall Plank
- Side Plank
- Copenhagen Plank
- Weighted Plank
- Suitcase Carry
- Pallof Hold

### Upper Pull
- Prone Isometric T / Prone T variants
- Cuff Strength / DB External Rotation
- Grip Dynamometer
- Passive Hang
- Chin-Up
- Weighted Chin-Up

### Upper Push
- Elevated Push-Up
- Wall Push-Up
- Loaded Bench Press
- Unilateral Push
- Push-Up on Force Plate
- Plyometric Push-Up

The tracker also stores objective criteria, subjective criteria, result, status, notes, date tested and test level.

## 1.2 pROM and Orthopedic Tracker

This is a separate and materially richer orthopedic layer. It contains bilateral and/or active/passive observations across multiple positions.

### Shoulder
- Shoulder ER, supine
- Shoulder IR, supine
- Shoulder flexion, supine
- Active shoulder ER at 90°, prone
- Active shoulder IR at 90°, prone
- Active shoulder flexion, prone
- Shoulder extension, active/passive

### Hip
- Hip flexion
- Hip ER at 90°
- Hip IR at 90°
- Hip ER at 0°
- Hip IR at 0°
- Active seated hip ER
- Active seated hip IR
- Hip abduction
- Hip extension
- FABER
- Thomas
- Ober

### Knee / tibia
- Knee extension
- Knee flexion
- Tibial ER/IR, passive
- Tibial ER/IR, active

### Foot / ankle
- Ankle dorsiflexion
- Ankle inversion/eversion
- Talocrural assessment
- Subtalar assessment
- Mid-foot assessment
- 1st ray assessment
- General foot/ankle assessment
- Calf raise

### Spine / trunk
- Lumbar rotation
- Quadruped lumbar-locked thoracic rotation
- Thoracic/lumbar vertebral spring mobility
- Prone press-up

### Other screens
- Straight-leg raise
- Active straight-leg raise
- Half-kneeling balance
- SI Laslett cluster

This tracker demonstrates why a single scalar such as `hipIR_deg` or `shoulderFlexion_deg` is insufficient as the raw-data model.

A single joint can have:
- left and right values,
- active and passive values,
- different test positions,
- pain at end range,
- qualitative restrictions,
- and multiple related orthopedic tests.

Those distinctions must survive ingestion.

## 1.3 CPET Tracker

The CPET tracker includes more than VO2max alone:

- VO2max relative
- VO2max absolute
- VO2 at Zone 2
- Percent of VO2max at Zone 2
- Zone 2 heart rate
- Zone 2 bike power
- Zone 2 treadmill speed
- Zone 2 treadmill incline
- METs at VO2max
- METs at Zone 2 from metabolic cart
- METs at Zone 2 from device
- METs from bike
- METs from treadmill
- Watts/kg
- Heart-rate max
- Heart-rate recovery
- Maximum fat oxidation
- Resting lactate

Not all of these should determine CD clearance. They should all be ingestible and available for longitudinal/deep-dive interpretation.

## 1.4 DEXA Tracker

The DEXA tracker includes:

- Bodyweight
- Body-fat %
- VAT
- ALMI
- FFMI
- Lean mass left/right arm
- Lean mass left/right leg
- Lean-mass symmetry
- Lumbar-spine T- and Z-scores
- Left/right femur T- and Z-scores
- Forearm 33% radius T- and Z-scores

Again, ingestion completeness and CD relevance are separate questions.

---

# 2. Evidence from real tracker use

A historical patient tracker shows that real entries are not clean scalar database values. Examples include:

- `29.8lb, 27.3lb`
- `Left: 25x5, Right:25x5; Left: 45x5, Right:45x5`
- `Right: 60 sec, Left: 60 seconds (less fatiguing)`
- `Skip`
- `Omit`
- `Redundant`
- `Done (DARI)`
- qualitative orthopedic restrictions

The pROM tracker likewise contains entries such as:

- one side restricted and one side clean,
- different values at 0° vs 90° joint position,
- active vs passive differences,
- pain at end range,
- foot-segment restrictions,
- vertebral mobility observations.

Therefore V5 ingestion needs:
1. structured fields,
2. preservation of the original raw text,
3. protocol/test aliases,
4. explicit not-tested reasons,
5. protocol versioning.

Do not assume existing tracker text is already normalized.

---

# 3. Main V4 gap

V4 has many useful metrics, but its model is primarily:

**one metric → one goal requirement**

Examples of the simplification include concepts such as:
- one hip IR value,
- one shoulder flexion value,
- one ankle dorsiflexion value,
- one gait grade,
- one standing-rotation grade.

The actual assessment is closer to:

**multiple raw observations → interpretation of an underlying capacity → relationship to one or more CD goals**

Example:

### Shoulder rotational capacity

Possible evidence:
- passive shoulder ER,
- passive shoulder IR,
- active ER at 90°,
- active IR at 90°,
- shoulder flexion,
- cuff force,
- cuff endurance,
- pain,
- thoracic rotation,
- movement quality.

The CD goal should usually depend on **shoulder/scapular capacity**, not on eight independent shoulder test scores.

If all eight raw observations are separately weighted against the CD goal, the model double-counts one region and becomes opaque.

---

# 4. Required V5 domain model

## 4.1 AssessmentTestDefinition

Defines what was performed.

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

## 4.2 AssessmentObservation

Preserves what happened during the actual test.

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

Original text must be retained even after parsing.

## 4.3 Capacity

A patient-understandable physical quality.

Examples:
- Peak aerobic capacity
- Sustainable aerobic capacity
- Knee-extensor strength
- Hip rotational mobility
- Foot/ankle mobility
- Shoulder/scapular capacity
- Single-leg control
- Lower-body power
- Reactive strength
- Trunk endurance
- Grip / upper-pull capacity

```ts
type Capacity = {
  id: string
  slug: string
  displayName: string
  domain: string

  stateType:
    | 'direct_measure'
    | 'derived'
    | 'clinician_interpreted'

  higherIsBetter: boolean | null
  canonicalUnit: string | null
  declineClass: string | null
}
```

## 4.4 TestToCapacityMap

This is the missing middle layer.

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

Do not assign a mathematical weight when there is no defensible reason to do so.

## 4.5 CapacityState

Computed per patient per assessment.

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

  confidence: 'high' | 'moderate' | 'low'
  observationIds: string[]

  derivation:
    | 'direct'
    | 'deterministic'
    | 'clinician_interpreted'
}
```

For a clinician-interpreted capacity, do not manufacture a pseudo-numeric score simply to make charting easier.

## 4.6 GoalRequirement

CD goals should primarily connect to capacities.

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

  taskDemandEvidenceGrade: 'A' | 'B' | 'C'
  mappingEvidenceGrade: 'A' | 'B' | 'C'

  sourceRef: string | null
  evidenceNote: string
}
```

### Role semantics

**Primary driver**
- A defensible failure can directly threaten goal clearance.

**Contributor**
- Meaningfully affects the goal but should not independently create a hard fail unless the model supports that inference.

**Constraint**
- Can limit expression of another capacity or alter training strategy.
- Example: severe ankle mobility restriction constraining step-down/step-up mechanics.

**Context**
- Relevant to discussion but not CD clearance.

## 4.7 CapacityDependency

Optional but important for clinical reasoning.

```ts
type CapacityDependency = {
  upstreamCapacityId: string
  downstreamCapacityId: string

  relationship:
    | 'enables'
    | 'constrains'
    | 'modifies_interpretation'

  evidenceGrade: 'A' | 'B' | 'C'
  note: string
}
```

This allows the model to express:
- mobility can constrain force expression,
- pain can invalidate performance interpretation,
- balance/control can affect sport-task execution,

without pretending those relationships are deterministic injury probabilities.

---

# 5. Capture everything; score selectively

Every assessment observation should be ingestible.

Every observation should **not** automatically affect CD status.

Each observation/capacity should be eligible for one or more analytic pathways:

### A. CD clearance
Only evidence-qualified primary drivers and contributors with defensible task mapping.

### B. CD planning priority
Can include direct drivers plus relevant supporting capacities.

### C. Foundational / orthopedic opportunity
Can surface important findings outside the selected CD goals.

### D. Clinical context
Visible in deep dive, but no mathematical effect on CD status.

### E. Prescription context
Useful for exercise prescription even when it is not a CD threshold.
Example: Zone 2 HR and modality output.

This separation is mandatory.

---

# 6. Driver synthesis

The product question is:

> Across everything measured in the PCA, which underlying capacities are most responsible for limiting this patient's selected CD goals?

Do **not** rank raw tests against one another.

Rank **capacities**.

## Recommended transparent ranking order

### Tier 1 — validated direct blockers
A primary driver that fails a defensible threshold receives priority regardless of breadth.

### Tier 2 — broad multi-goal opportunities
Among non-blockers, prioritize:
1. number/proportion of active CD goals affected,
2. deficit severity,
3. future vulnerability,
4. role,
5. mapping confidence.

### Tier 3 — foundational constraints
Significant whole-assessment weaknesses outside CD clearance remain separate.

Do not collapse all of these into a single "longevity score."

## Driver explanation object

The engine should be able to return:

```ts
type DriverExplanation = {
  capacityId: string

  impactedGoalIds: string[]
  impactedGoalCount: number
  selectedGoalCount: number

  directBlockerGoalIds: string[]

  currentDeficit: number | null
  projectedDeficit: number | null

  mappingConfidence: 'high' | 'moderate' | 'low'

  supportingObservationIds: string[]

  whyRankedHere: string[]
}
```

A patient-facing result can then say:

**Knee-extensor strength**
- Impacts 6 of 10 selected goals
- Directly constrains 1 goal
- Below the required reserve for 2 goals
- Supported by ForceFrame + step-up evidence

A clinician can open the underlying observations.

---

# 7. Spider/radar plot implication

The spider plot must operate at the **capacity layer**, not the raw-test layer.

For a seven-component tennis goal, the axes might be:

- Peak aerobic capacity
- Sustainable aerobic capacity
- Reactive capacity
- Single-leg balance/control
- Lower-body power
- Upper-body power
- Shoulder/scapular capacity

Do not create separate radar axes for:
- passive ER,
- active ER,
- passive IR,
- active IR,
- cuff force,
- cuff endurance,
- thoracic rotation

unless the CD task specification itself truly requires those as independent task demands.

Those observations should live underneath the shoulder/scapular capacity axis.

### Radar display

For each capacity with a defensible threshold:

`normalized = patient value / goal threshold`

- green = threshold ring, always 1.0
- blue = today
- red = projected at marginal-decade age
- red inside green = projected gap

If a capacity is clinically important but cannot be normalized to a defensible goal threshold, show it in the capacity detail rather than inventing a radar radius.

---

# 8. Protocol/version drift

The audit found evidence that patient trackers can differ from the current master naming or test set.

Therefore:

- every observation references a `testDefinitionId`, not a test-name string,
- `protocolVersion` is mandatory,
- ingestion has an alias registry,
- raw source text is retained,
- unmatched test names fail loudly into an import-review queue,
- no silent fuzzy matching.

Example alias handling:

```ts
TEST_ALIASES = {
  'PRI Functional Sqaut': 'pri_functional_squat',
  'PRI Functional Squat': 'pri_functional_squat',
  'Prone T': 'prone_t_isometric',
  'Prone Isometric “T”': 'prone_t_isometric'
}
```

Aliases resolve source naming; they do not change clinical meaning.

---

# 9. V4 disposition

## Keep
- evidence-qualified task thresholds
- separation of task demand vs decline source
- no fabricated threshold rule
- VALD provenance
- DEXA as context rather than generic CD gate
- foundational/orthopedic pathway
- missing-data safeguards
- forecast uncertainty
- goal breadth in planning hierarchy
- patient/simple vs clinician/deep-dive separation

## Modify
- metric model
- goal decomposition
- driver ranking source universe
- capacity wheel → per-goal spider plot
- status taxonomy
- projection assumptions
- current-value presentation
- longitudinal architecture

## Retire
- treating the current 83-metric V4 dictionary as the complete assessment ontology
- one-scalar representation of complex joint/orthopedic capacity
- raw test → CD goal as the dominant mapping architecture
- fixed requirement that every patient has exactly 10 goals
- ambiguous On Track vs Tracking terminology

---

# 10. Build order

Do not build new UI before this sequence is complete.

## V5-00 — Assessment ontology
- canonical test definitions
- source-system mapping
- protocol versions
- aliases
- units
- laterality
- active/passive
- structured not-tested reasons

## V5-01 — Observation ingestion
- PCA tracker
- pROM tracker
- CPET
- DEXA
- VALD exports
- other dynamometry/field exports

## V5-02 — Capacity layer
- define capacity taxonomy
- test-to-capacity mappings
- deterministic vs clinician-interpreted derivations
- confidence/provenance

## V5-03 — CD requirement graph
- capacity → goal
- primary/contributor/constraint/context
- evidence grades
- thresholds

## V5-04 — Driver synthesis
- direct blockers
- multi-goal breadth
- severity
- future vulnerability
- explanation object
- foundational pathway separate

## V5-05 — Projection engine
- sedentary / maintain / specific
- capacity-specific → decline-class fallback → explicit null
- linear/exponential/piecewise
- population basis
- evidence grades

## V5-06 — Patient/current-future outputs
- measured today
- threshold
- projected
- date
- trajectory assumption
- status taxonomy

## V5-07 — Per-goal spider plot
Only after the capacity and requirement layers are stable.

---

# 11. Acceptance test for the architecture

Before any new UI is approved, the system must be able to answer this query for a real patient:

> Why is this capacity one of this patient's top three training priorities?

with a deterministic, auditable response containing:

1. the capacity,
2. the raw observations supporting it,
3. which CD goals it affects,
4. its role in each goal,
5. current state,
6. task threshold where defensible,
7. projection where defensible,
8. evidence confidence,
9. why it ranks above the next capacity,
10. any important foundational/orthopedic findings kept separate from CD clearance.

If the system cannot answer all ten, the model is not yet ready for patient-facing prioritization.
