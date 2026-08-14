# V5 Assessment Source Inventory
## Minimum known-source ontology coverage for V5-00

Status: architecture input. This register defines the minimum known source surface that V5-00 must cover. It is not the completed ontology, a protocol approval, or a clinical scoring specification.

The inventory preserves the source labels currently documented in the PCA data-model audit and the explicit protocol labels in the frozen V4 review implementation. V5-00 must assign stable test-definition IDs, units, result types, laterality, motion modes, positions, aliases and versioned protocol references without silently dropping any row.

Unspecified protocol details must not be inferred. In particular, a V4 VALD product/test label does not establish equipment setup, patient position, laterality, trial selection, sampling configuration, software version, normative dataset or approval state. Those protocol-owner fields remain `pending` until supplied and ratified.

## Coverage summary

| Source surface | Minimum known items | Coverage rule |
|---|---:|---|
| PCA Tracker (MASTER) | 49 tests | Every enumerated source test must resolve to exactly one canonical test definition or an explicit versioned variant. |
| pROM / orthopedic tracker | 39 tests | Laterality, active/passive state, position, pain and qualitative findings must survive ingestion. |
| CPET tracker | 18 metrics | All metrics are ingestible even when they do not affect CD clearance. |
| DEXA tracker | 18 metrics | Site and side distinctions must remain intact; ingestion completeness does not imply CD relevance. |
| Current V4 VALD mappings | 14 definitions | Preserve the exact product/test provenance shown below; all unspecified protocol-owner fields are pending. |
| Current V4 timed-stance protocols | 2 definitions | Preserve as timed stance in seconds, not as VALD centre-of-pressure output. Capture SOP approval remains pending. |

Total minimum non-VALD tracker surface: **124 explicitly enumerated tests/metrics**.

## 1. PCA Tracker (MASTER) — 49 tests

### Double Leg — 7

1. PRI Functional Squat
2. Bodyweight Squat
3. Wall Sit
4. Goblet Squat
5. Front Squat
6. Back Squat
7. Vertical Jump

### Hinge — 6

1. Toe Touch
2. Toe Touch Opposite Foot Reach
3. Hip Hinge with Dowel
4. KB Deadlift
5. Relative Deadlift
6. Broad Jump

### Locomotion — 7

1. Toe Dexterity
2. 1st Toe Flexion
3. Toes 2–5 Flexion
4. Half-Kneeling Dorsiflexion
5. Standing Rotation
6. Single-Leg Calf Raise
7. Gait Analysis

### Single Leg — 8

1. Trendelenburg
2. Fukuda Step Test
3. Bodyweight Split Squat
4. Eccentric Step Down
5. Loaded Step-Up
6. Single-Leg Vertical Jump
7. Single-Leg Broad Jump
8. Single-Leg Pogos

### Trunk — 9

1. DNS 3-Month
2. Posterior Mediastinum Expansion
3. Standing Hip Hike
4. Heel-to-Wall Plank
5. Side Plank
6. Copenhagen Plank
7. Weighted Plank
8. Suitcase Carry
9. Pallof Hold

### Upper Pull — 6

1. Prone Isometric T / Prone T variants
2. Cuff Strength / DB External Rotation
3. Grip Dynamometer
4. Passive Hang
5. Chin-Up
6. Weighted Chin-Up

### Upper Push — 6

1. Elevated Push-Up
2. Wall Push-Up
3. Loaded Bench Press
4. Unilateral Push
5. Push-Up on Force Plate
6. Plyometric Push-Up

PCA source fields also include objective criteria, subjective criteria, result, status, notes, date tested and test level. Those fields are part of the ingestion surface even though they are not additional test definitions.

## 2. pROM / orthopedic tracker — 39 tests

### Shoulder — 7

1. Shoulder ER, supine
2. Shoulder IR, supine
3. Shoulder flexion, supine
4. Active shoulder ER at 90°, prone
5. Active shoulder IR at 90°, prone
6. Active shoulder flexion, prone
7. Shoulder extension, active/passive

### Hip — 12

1. Hip flexion
2. Hip ER at 90°
3. Hip IR at 90°
4. Hip ER at 0°
5. Hip IR at 0°
6. Active seated hip ER
7. Active seated hip IR
8. Hip abduction
9. Hip extension
10. FABER
11. Thomas
12. Ober

### Knee / tibia — 4

1. Knee extension
2. Knee flexion
3. Tibial ER/IR, passive
4. Tibial ER/IR, active

### Foot / ankle — 8

1. Ankle dorsiflexion
2. Ankle inversion/eversion
3. Talocrural assessment
4. Subtalar assessment
5. Mid-foot assessment
6. 1st ray assessment
7. General foot/ankle assessment
8. Calf raise

### Spine / trunk — 4

1. Lumbar rotation
2. Quadruped lumbar-locked thoracic rotation
3. Thoracic/lumbar vertebral spring mobility
4. Prone press-up

### Other screens — 4

1. Straight-leg raise
2. Active straight-leg raise
3. Half-kneeling balance
4. SI Laslett cluster

For each applicable row, V5-00 and V5-01 must preserve left/right, active/passive, test position, numeric ROM, qualitative restriction, pain and manual-screen context. The inventory does not authorize collapsing those distinctions into one scalar.

## 3. CPET tracker — 18 metrics

1. VO2max relative
2. VO2max absolute
3. VO2 at Zone 2
4. Percent of VO2max at Zone 2
5. Zone 2 heart rate
6. Zone 2 bike power
7. Zone 2 treadmill speed
8. Zone 2 treadmill incline
9. METs at VO2max
10. METs at Zone 2 from metabolic cart
11. METs at Zone 2 from device
12. METs from bike
13. METs from treadmill
14. Watts/kg
15. Heart-rate max
16. Heart-rate recovery
17. Maximum fat oxidation
18. Resting lactate

Task relevance is assigned later. No CPET metric becomes a CD threshold merely because it is present in the ontology.

## 4. DEXA tracker — 18 metrics

1. Bodyweight
2. Body-fat percentage
3. Visceral adipose tissue (VAT)
4. Appendicular lean mass index (ALMI)
5. Fat-free mass index (FFMI)
6. Left-arm lean mass
7. Right-arm lean mass
8. Left-leg lean mass
9. Right-leg lean mass
10. Lean-mass symmetry
11. Lumbar-spine T-score
12. Lumbar-spine Z-score
13. Left-femur T-score
14. Left-femur Z-score
15. Right-femur T-score
16. Right-femur Z-score
17. Forearm 33% radius T-score
18. Forearm 33% radius Z-score

DEXA ingestion completeness and CD relevance remain separate. DEXA context does not become a generic task-clearance gate.

## 5. Explicit current V4 VALD/protocol definitions

These are migration seeds from the frozen V4 `MEASUREMENT_PROTOCOLS` register. The protocol text is preserved exactly. It is not expanded with inferred detail.

### VALD mappings — 14

| V4 metric key | Current explicit product/test provenance | V4 unit | Protocol-owner status |
|---|---|---|---|
| `hopRSI` | VALD ForceDecks · Single-Leg Pogos | m/s | Pending for all protocol fields not explicit in this label |
| `anklePF_xBW` | VALD ForceFrame · seated calf / ankle plantarflexion isometric | × BW | Pending for all protocol fields not explicit in this label |
| `cmjPower_WkG` | VALD ForceDecks · Countermovement Jump | W/kg | Pending for all protocol fields not explicit in this label |
| `dropJump_RSI` | VALD ForceDecks · Drop Jump | m/s | Pending for all protocol fields not explicit in this label |
| `beltSquatIso_xBW` | VALD ForceFrame · Belt Squat Isometric | × BW | Pending for all protocol fields not explicit in this label |
| `broadJump_cm` | VALD ForceDecks · Broad Jump | cm | Pending for all protocol fields not explicit in this label |
| `kneeFlex_xBW` | VALD ForceFrame · Knee Flexion Isometric | × BW | Pending for all protocol fields not explicit in this label |
| `slVertJump_cm` | VALD ForceDecks · Single-Leg Vertical Jump | cm | Pending for all protocol fields not explicit in this label |
| `hipAbd_xBW` | VALD ForceFrame · Hip Abduction Isometric | × BW | Pending for all protocol fields not explicit in this label |
| `hipAdd_xBW` | VALD ForceFrame · Hip Adduction Isometric | × BW | Pending for all protocol fields not explicit in this label |
| `kneeExt_xBW` | VALD ForceFrame · Knee Extension Isometric | × BW | Pending for all protocol fields not explicit in this label |
| `benchIso_xBW` | VALD ForceFrame · Bench Press Isometric | × BW | Pending for all protocol fields not explicit in this label |
| `grip_lb` | VALD DynaMo · Grip Strength | lb | Pending for all protocol fields not explicit in this label |
| `shoulderER_NmKg` | VALD ForceFrame · Shoulder External Rotation Isometric | Nm/kg | Pending for all protocol fields not explicit in this label |

### Timed-stance definitions — 2

| V4 metric key | Current explicit protocol text | V4 unit | Protocol-owner status |
|---|---|---|---|
| `balanceSL_EO_s` | Timed single-leg stance · firm surface · arms at sides · eyes open · 60 s cap · best of 2/side, enter weaker side · SOP approval pending | s | SOP approval pending |
| `balanceSL_EC_s` | Timed single-leg stance · firm surface · arms at sides · eyes closed · 60 s cap · best of 2/side, enter weaker side · SOP approval pending | s | SOP approval pending |

These two timed-stance definitions are not VALD centre-of-pressure measurements. If a future VALD balance or centre-of-pressure protocol is supplied, it must receive a distinct test definition and versioned protocol rather than being stored in these seconds-held fields.

## V5-00 coverage acceptance

V5-00 is not complete until validation proves:

1. all 49 PCA tests are represented;
2. all 39 pROM/orthopedic tests are represented;
3. all 18 CPET metrics are represented;
4. all 18 DEXA metrics are represented;
5. all 14 explicit V4 VALD mappings and both timed-stance definitions are represented;
6. no unspecified VALD protocol detail was invented;
7. every unresolved protocol-owner field is visibly pending;
8. every known source label resolves exactly once or produces an explicit import-review result;
9. source provenance and protocol version survive round trip;
10. missing, skipped, unable, pain-limited and redundant observations never become numeric zero.
