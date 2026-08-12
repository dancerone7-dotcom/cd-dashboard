# Centenarian Decathlon V4 model audit

This document records the V4 implementation and validation state. It is a model-development artifact, not clinical advice and not a claim that any individual will achieve a goal.

## What changed

- Added five genuinely different live and PDF presentation modes: Simple, Action, Trajectory, Capacity wheel (prototype), and Clinician detail.
- Replaced whole-patient demo scaling with seven explicit deterministic native-unit patients. No named demo is calculated from the balanced sample, and the female profile is an independently specified synthetic patient. The balanced archetype preserves the origin/main sample measurements exactly.
- Added a support-priority pathway that is mathematically separate from task clearance. It combines current age/sex assessment context, selected-goal leverage, expected vulnerability, and forecast evidence confidence; action rows state whether they come from a calibrated task gap or assessment support that can never grant clearance.
- Added a goal-independent foundational assessment screen. Marked shoulder, hip, knee, foot/ankle, balance, movement-quality, or trunk findings can reach **What to work on first** even when none of the selected CD goals uses that measure. Early Medical standards are categorical current-assessment context: the highest source tier cleared is reported, with Proficient = zero foundational deficit, Developing = moderate priority severity, and Deficient = high priority severity. They are not treated as continuous injury-risk scales. NT-PAIN, NT-CONTRA, and NT-UNABLE are separate high-priority clinician-review findings, not performance deficiencies. None of these pathways predicts injury, diagnoses pathology, or changes task clearance.
- Added input/export support for age/sex-matched VALD percentiles. Where no numeric VALD percentile is supplied, the model does not infer one from the raw value. Early Medical current-age/sex bands and VALD percentiles are assessment context only, never longitudinal slopes or future task thresholds.
- Added an explicit metric-to-goal dependency map and perturbation tests for VO2max, deadlift, loaded step-up, grip, timed single-leg balance, and CMJ power.
- Added patient-specific calibration-breadth rules: complexity 1-2 requires 1 independent eligible observed dimension, complexity 3-4 requires 2, and complexity 5 requires 3 for a full clear.
- A dimension is calibration-eligible only when at least one scoreable requirement in that dimension is actually measured for this patient, resolves to a task threshold in the same units, and has at least **moderate** task-demand confidence and at least **moderate** task-to-test mapping confidence. Missing and low-confidence rows may inform subordinate context but cannot satisfy breadth. When a complexity 3-5 goal lacks breadth, the overall result remains **Partially calibrated** even when an ordinary contributor is below target; the below-target dimension is shown as a subordinate finding. A direct non-modeled gate with a direct measurement plus high task-demand and mapping confidence remains visible as a **Validated gate failure**.
- Corrected the 10,000 m row definition to 3:00/500 m and about 60 W using the Concept2 equation `watts = 2.80 / pace^3`, with pace in seconds per meter. VO2 and LT1 are support-only for this goal until an individual erg-power mapping is calibrated.
- Separated measurement source, task-demand source, mapping confidence, forecast source/confidence, and evidence horizon.
- Made fixed-load reserve multipliers and peak-to-sustained aerobic fractions named Early Medical clinical assumptions with broad uncertainty.
- Added observed age ranges, populations, sex support, extrapolation start ages, uncertainty multipliers, and late-life central-estimate damping to each forecast family.
- Preserved the privacy warning, local-only data handling, VALD protocol provenance, DEXA context-only use, missing-critical-data behavior, import/export, and LT1 support-only treatment.

## Before and after demos

The legacy demos were all generated from the same sample vector by a single scalar (`1.20`, `1.00`, `0.78`, `1.00`, or `0.72`). Five of six legacy profiles therefore shared the same headline measures. The first V4 pass still built named profiles by multiplying the same baseline by family and metric factors. The correction replaces that mechanism with seven complete native-unit measurement records.

| V4 archetype | Goal-status counts | Leading calibrated priorities | Headline measures |
|---|---|---|---|
| Balanced all-rounder | 3 clear, 23 partial, 10 trajectory | STS power; knee extension; shoulder ER | Deadlift; STS power; single-leg balance; VO2max; overhead press |
| Aerobic strong / strength limited | 3 clear, 23 partial, 10 trajectory | Knee extension; deadlift; STS power | STS power; balance; loaded step-up; overhead press; suitcase carry |
| Strength strong / aerobic limited | 1 clear, 2 line, 23 partial, 10 trajectory | VO2max; STS power; single-leg balance | Deadlift; STS power; suitcase carry; VO2max |
| Power strong / balance-reactive limited | 2 clear, 1 validated gate gap, 23 partial, 10 trajectory | Balance; deadlift; hip abduction | STS power; deadlift; balance; overhead press; VO2max |
| Female mixed, independent | 3 clear, 23 partial, 10 trajectory | Deadlift; VO2max; STS power | STS power; balance; overhead press; VO2max |
| Older resilient | 3 clear, 23 partial, 10 trajectory | VO2max; side plank; knee extension | Deadlift; STS power; balance; overhead press; VO2max |
| Older deconditioned | 2 clear, 1 validated gate gap, 23 partial, 10 trajectory | VO2max; knee extension; loaded step-up | STS power; overhead press; balance; loaded step-up |

Counts are consequences of the entered synthetic measurements and model rules. No target count of green, amber, or red goals is enforced.

## Sensitivity results

| Perturbation | Expected response observed | Unrelated clearance invariant |
|---|---|---|
| VO2max down 28% | Aerobic/endurance goal scores changed; row support changed | Jar opening and timed balance did not change |
| Deadlift down 80% | Child/pet floor lift and car-seat child clearance changed; household/garden/row support changed | 5 km, swimming, and unrelated balance clearance did not change |
| Loaded step-up down 28% | Loaded stairs clearance changed; terrain/adventure support changed | Jar opening and swimming clearance did not change |
| Grip down 28% | Jar/carry/handling support profiles changed | No readiness clearance changed |
| Timed single-leg balance down 28% | 30-second balance clearance changed; terrain/sport support changed | Unrelated upper-body clearance did not change |
| CMJ power down 28% | Dance, kicking, skiing, and surfing support profiles changed | Unrelated daily-task clearance did not change |

Separate support-priority perturbations lowered the measured value and, for VALD tests, the entered current age/sex percentile. Grip moved from support rank 7 to 1, CMJ power from 12 to 1, pogo RSI from 15 to 2, drop-jump RSI from 13 to 2, and knee extension remained rank 1 with a substantially higher priority score. Every goal's clearance zone and score remained unchanged in all five perturbations.

A separate goal-independent test selected only walking and timed balance, then introduced marked shoulder ER, cuff-endurance, and overhead-strength deficits. A shoulder measure entered the top five training priorities even though neither selected goal had a shoulder clearance dependency; both goals' readiness zones and scores were unchanged.

## Exact performance-task audit

| Goal | Primary definition | Mapping status |
|---|---|---|
| 5 km in 40 min | 5,000 m / 40 min = 125 m/min (7.5 km/h) | Direct pace; VO2 mapping remains a clinical assumption |
| Walk 3 miles in 60 min | 3.0 mph | Direct pace plus Compendium walking category; moderate mapping confidence |
| Cycle 10 miles in 60 min | 10 mph on flat pavement | Direct speed; low mapping confidence because bicycle, gearing, wind, and efficiency vary |
| Swim 500 m in 25 min | 20 m/min without stopping | Direct pace; low mapping confidence because stroke and conditions vary |
| Row 10,000 m in 60 min | 3:00/500 m = approximately 60 W | Direct Concept2 demand; VO2 and LT1 support-only without an individual erg-power conversion |

## Human-readable 36-goal audit register

Roles use `gate`, calibrated `contributor`, `support`, and `modifier`. The table below describes model structure; the downloadable and live register recalculates **eligible observed** dimensions for the current patient using the exact confidence rule above. “Partial” means the patient's measured, confidence-qualified demand dimensions are not broad enough for the goal's complexity. An ordinary below-target contributor is subordinate to that partial status; a direct high-confidence validated gate failure remains explicit.

The following snapshot uses the balanced reference patient. “Observed but ineligible” means the measurement is present but has low task-demand and/or mapping confidence, so it cannot satisfy breadth.

| Goal id | Complexity | Patient calibration | Eligible observed | Observed but ineligible |
|---|---:|---|---:|---|
| floor-rise | 3 | trajectory-only | 0/2 | - |
| carry-grandkids | 3 | partially calibrated | 0/2 | lift, carry |
| sexual-expression | 2 | calibrated | 1/1 | - |
| festival | 2 | partially calibrated | 0/1 | aerobic |
| car-seat-child | 4 | partially calibrated | 0/2 | lift, carry |
| dance | 3 | partially calibrated | 1/2 | - |
| open-jars | 1 | trajectory-only | 0/1 | - |
| touch-toes | 1 | trajectory-only | 0/1 | - |
| drive-errands | 2 | trajectory-only | 0/1 | - |
| chores | 4 | partially calibrated | 0/2 | aerobic |
| chair-rise | 2 | calibrated | 1/1 | - |
| beach-sand | 4 | partially calibrated | 1/2 | - |
| garden-2h | 4 | partially calibrated | 1/2 | - |
| dog-walk | 4 | partially calibrated | 0/2 | aerobic |
| overhead-bin | 3 | partially calibrated | 0/2 | upper-push |
| stairs-load | 4 | partially calibrated | 0/2 | lower-strength, carry |
| bowling | 3 | trajectory-only | 0/2 | - |
| weapon | 2 | trajectory-only | 0/1 | - |
| yacht | 4 | trajectory-only | 0/2 | - |
| football-kick | 4 | trajectory-only | 0/2 | - |
| tennis | 5 | partially calibrated | 0/3 | aerobic |
| ocean-swim | 5 | partially calibrated | 1/3 | - |
| snorkel-scuba | 5 | partially calibrated | 1/3 | - |
| horseback | 4 | partially calibrated | 1/2 | - |
| hike-pack | 5 | partially calibrated | 1/3 | - |
| ski-green | 5 | partially calibrated | 0/3 | aerobic |
| swim-500m | 4 | partially calibrated | 0/2 | aerobic |
| golf-18 | 5 | partially calibrated | 1/3 | carry |
| sprint-triathlon | 4 | partially calibrated | 1/2 | - |
| row-10k | 4 | trajectory-only | 0/2 | - |
| cycle-10mi | 3 | partially calibrated | 0/2 | aerobic |
| walk-3mi | 3 | partially calibrated | 1/2 | - |
| kayak | 4 | partially calibrated | 1/2 | - |
| yoga | 3 | trajectory-only | 0/2 | - |
| surf | 5 | partially calibrated | 0/3 | aerobic |
| balance-30s | 1 | calibrated | 1/1 | - |

The complete machine-readable register, including task formulas, sources, confidence fields, forecast family and horizon metadata, and remaining assumptions, is available from **Clinician detail -> Download JSON**.

## Forecast evidence horizons

- Aerobic: Fleg included adults aged 21-87; extrapolation begins at 88 and uncertainty widens thereafter.
- Lower-body strength: Hughes included adults initially aged 46-78; Health ABC evidence is concentrated in ages 70-79. Transfer to other tests and later ages remains uncertain.
- Power: Alcazar included 489 participants aged 19-68 **at baseline**, then reassessed them after a median 9.6 years (IQR 9.3-10.4). The paper does not report an exact oldest individual follow-up age, so the model stores baseline range and follow-up duration separately instead of claiming observations stop at 68. Its age-79 extrapolation control is a conservative modeling boundary derived from the baseline maximum plus approximately 10 years, not an asserted observed maximum; uncertainty remains deliberately wide. The reactive family inherits this only as an indirect transfer.
- LT1, upper-body strength, reactive capacity, muscular endurance, and timed balance remain lower-confidence family transfers or scenarios.
- ROM is held as measured context; DEXA remains context rather than a task-clearance input.

## Remaining clinical assumptions

1. Fixed external loads are exact task inputs, but reserve multipliers above those loads are Early Medical clinical assumptions.
2. Peak-VO2-to-sustainable-task fractions are Early Medical clinical assumptions and may vary by modality, training, disease, and individual efficiency.
3. Most complex sport and adventure goals still lack enough independent calibrated test dimensions; V4 reports these as partially calibrated or trajectory-only.
4. Grip, CMJ power, reactive tests, knee extension, and the broader foundational assessment screen can inform training priorities but do not grant clearance where no validated task threshold exists. A low screen result is not an injury-probability estimate. LT1 remains clinician support-only and is excluded from headline prioritization.
5. Late-life projections are scenarios, not observed individual trajectories. Central estimates are damped and uncertainty widens beyond each evidence horizon.
6. Task performance depends on skill, equipment, environment, pain, disease, injury, and behavior that this physical-capacity model does not fully represent.

## Validation and visual QA

- `node scripts/validate-model.mjs`: PASS - 36 goals, 83 metrics, 7 native-unit archetypes, 5 modes, headline diversity, clearance, goal-support and goal-independent foundational sensitivity, calibration breadth, evidence horizons, fixed demand, missing data, import/export, and 38-page print checks.
- Browser smoke tests: PASS - Reference (36 activities), Build report (36 goals, 10 assessment groups, 13 VALD percentile inputs), all five report modes, and all seven demo archetypes. All 35 archetype/mode combinations produced the intended structural mode and non-empty content.
- PDF render QA: PASS - corrected Action-mode 38-page fixture rendered at US Letter landscape; the foundational/support/task pathway summary and representative goal pages were visually inspected for clipping, overlap, and legibility.
- Final model-integrity pass: PASS - rechecked all five modes and seven archetypes with no console errors or non-finite output. The Action PDF summary initially placed a redundant scorecard beneath the fixed footer; the print-only layout was tightened, the scorecard removed from that summary, and the regenerated 38-page Letter landscape PDF was re-rendered and visually inspected on pages 1-4, 10, 19, 30, and 38 with no clipping or overlap.
- Screenshots: [Simple](qa-screenshots/simple.png), [Action](qa-screenshots/action.png), [Trajectory](qa-screenshots/trajectory.png), [Capacity wheel](qa-screenshots/capacity-wheel.png), [Clinician detail](qa-screenshots/clinician-detail.png), [Reference](qa-screenshots/reference.png), [Build report](qa-screenshots/build-report.png), [goal-independent shoulder screen](qa-screenshots/foundational-shoulder-screen.png), and the seven `demo-*.png` archetype captures.
- Final-integrity screenshots: [Simple](qa-screenshots/final-integrity-simple.png), [Action](qa-screenshots/final-integrity-action.png), [Clinician detail](qa-screenshots/final-integrity-clinician-detail.png), [Reference](qa-screenshots/final-integrity-reference.png), and [Build report](qa-screenshots/final-integrity-build-report.png).
