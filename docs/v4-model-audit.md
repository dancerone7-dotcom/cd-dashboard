# Centenarian Decathlon V4 model audit

This document records the V4 implementation and validation state. It is a model-development artifact, not clinical advice and not a claim that any individual will achieve a goal.

## What changed

- Added five genuinely different live and PDF presentation modes: Simple, Action, Trajectory, Capacity wheel (prototype), and Clinician detail.
- Replaced whole-patient demo scaling with seven deterministic, non-uniform archetypes. The balanced archetype preserves the origin/main sample measurements exactly.
- Added an explicit metric-to-goal dependency map and perturbation tests for VO2max, deadlift, loaded step-up, grip, timed single-leg balance, and CMJ power.
- Added calibration-breadth rules: complexity 1-2 requires 1 independent calibrated dimension, complexity 3-4 requires 2, and complexity 5 requires 3 for a full clear.
- Corrected the 10,000 m row definition to 3:00/500 m and about 60 W using the Concept2 equation `watts = 2.80 / pace^3`, with pace in seconds per meter. VO2 and LT1 are support-only for this goal until an individual erg-power mapping is calibrated.
- Separated measurement source, task-demand source, mapping confidence, forecast source/confidence, and evidence horizon.
- Made fixed-load reserve multipliers and peak-to-sustained aerobic fractions named Early Medical clinical assumptions with broad uncertainty.
- Added observed age ranges, populations, sex support, extrapolation start ages, uncertainty multipliers, and late-life central-estimate damping to each forecast family.
- Preserved the privacy warning, local-only data handling, VALD protocol provenance, DEXA context-only use, missing-critical-data behavior, import/export, and LT1 support-only treatment.

## Before and after demos

The legacy demos were all generated from the same sample vector by a single scalar (`1.20`, `1.00`, `0.78`, `1.00`, or `0.72`). Five of six legacy profiles therefore shared the same headline measures: Deadlift, Sit-to-stand relative power, VO2max, Single-leg balance, and Loaded step-up. The V4 profiles vary capacity families and selected metrics independently.

| V4 archetype | Goal-status counts | Leading calibrated priorities | Headline measures |
|---|---|---|---|
| Balanced all-rounder | 6 clear, 9 line, 8 partial, 3 gap, 10 trajectory | VO2max; seated overhead press | Single-leg balance; suitcase carry; deadlift; VO2max; seated overhead press |
| Aerobic strong / strength limited | 4 clear, 3 line, 15 partial, 4 gap, 10 trajectory | Suitcase carry; loaded step-up; seated overhead press | Single-leg balance; deadlift; sit-to-stand power; loaded step-up; suitcase carry; seated overhead press |
| Strength strong / aerobic limited | 6 clear, 1 line, 2 partial, 17 gap, 10 trajectory | VO2max | Single-leg balance; suitcase carry; deadlift; VO2max |
| Power strong / balance-reactive limited | 5 clear, 9 line, 8 partial, 4 gap, 10 trajectory | VO2max; single-leg balance; seated overhead press | Deadlift; sit-to-stand power; single-leg balance; VO2max; seated overhead press |
| Female mixed, independent | 4 clear, 7 line, 12 partial, 3 gap, 10 trajectory | Suitcase carry; seated overhead press; loaded step-up | Single-leg balance; deadlift; sit-to-stand power; seated overhead press; suitcase carry; loaded step-up |
| Older resilient | 7 clear, 1 line, 17 partial, 1 gap, 10 trajectory | Seated overhead press | Single-leg balance; suitcase carry; deadlift; seated overhead press |
| Older deconditioned | 5 clear, 6 line, 4 partial, 11 gap, 10 trajectory | VO2max; single-leg balance | Suitcase carry; deadlift; sit-to-stand power; VO2max; single-leg balance |

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

## Exact performance-task audit

| Goal | Primary definition | Mapping status |
|---|---|---|
| 5 km in 40 min | 5,000 m / 40 min = 125 m/min (7.5 km/h) | Direct pace; VO2 mapping remains a clinical assumption |
| Walk 3 miles in 60 min | 3.0 mph | Direct pace plus Compendium walking category; moderate mapping confidence |
| Cycle 10 miles in 60 min | 10 mph on flat pavement | Direct speed; low mapping confidence because bicycle, gearing, wind, and efficiency vary |
| Swim 500 m in 25 min | 20 m/min without stopping | Direct pace; low mapping confidence because stroke and conditions vary |
| Row 10,000 m in 60 min | 3:00/500 m = approximately 60 W | Direct Concept2 demand; VO2 and LT1 support-only without an individual erg-power conversion |

## Human-readable 36-goal audit register

Roles use `gate`, calibrated `contributor`, `support`, and `modifier`. “Partial” means the available calibrated demand is not broad enough for the goal's complexity, even when measured reserve is otherwise adequate.

| Goal id | Complexity | Calibration | Dimensions | Gates | Contributors | Support measures |
|---|---:|---|---:|---|---|---|
| floor-rise | 3 | trajectory-only | 0/2 | - | - | kneeExt, STS power, back squat, ankle DF, hip flexion |
| carry-grandkids | 3 | calibrated | 2/2 | deadlift, suitcase carry | - | grip, knee extension, Pallof hold |
| sexual-expression | 2 | calibrated | 1/1 | - | VO2max | hip flexion, hip IR, plank, LT1 |
| festival | 2 | calibrated | 1/1 | - | VO2max | LT1, calf raises, knee extension, balance |
| car-seat-child | 4 | calibrated | 2/2 | deadlift, suitcase carry | - | thoracic rotation, knee extension, grip, Pallof hold |
| dance | 3 | partial | 1/2 | - | VO2max | LT1, CMJ power, balance, thoracic rotation, calf raises |
| open-jars | 1 | trajectory-only | 0/1 | - | - | grip, shoulder ER, Pallof hold |
| touch-toes | 1 | trajectory-only | 0/1 | - | - | hip flexion, SLR, balance, ankle DF |
| drive-errands | 2 | trajectory-only | 0/1 | - | - | STS power, thoracic rotation, hip flexion, suitcase carry |
| chores | 4 | partial | 1/2 | - | VO2max | LT1, deadlift, suitcase carry, overhead press, knee extension, plank |
| chair-rise | 2 | calibrated | 1/1 | STS power | - | knee extension, hip flexion, ankle DF |
| beach-sand | 4 | partial | 1/2 | - | VO2max | LT1, plantarflexion, calf raises, knee extension, balance, ankle DF |
| garden-2h | 4 | partial | 1/2 | - | VO2max | LT1, deadlift, knee extension, plank, hip flexion, suitcase carry |
| dog-walk | 4 | partial | 1/2 | - | VO2max | LT1, grip, loaded step-up, plantarflexion, balance, Pallof hold |
| overhead-bin | 3 | partial | 1/2 | overhead press | - | shoulder flexion, shoulder ER, grip, thoracic extension |
| stairs-load | 4 | calibrated | 2/2 | loaded step-up | suitcase carry | knee extension, step-down, balance, ankle DF |
| bowling | 3 | trajectory-only | 0/2 | - | - | rotational throw, balance, grip, knee extension |
| weapon | 2 | trajectory-only | 0/1 | - | - | grip, shoulder ER, Pallof hold, balance |
| yacht | 4 | trajectory-only | 0/2 | - | - | balance, grip, loaded row, plank, loaded step-up |
| football-kick | 4 | trajectory-only | 0/2 | - | - | single-leg jump, CMJ power, knee extension, hip abduction, balance, rotational throw |
| tennis | 5 | partial | 1/3 | - | VO2max | LT1, drop-jump RSI, knee extension, balance, rotational throw, shoulder ER |
| ocean-swim | 5 | partial | 1/3 | - | VO2max | LT1, loaded row, shoulder flexion, shoulder ER, plank |
| snorkel-scuba | 5 | partial | 1/3 | - | VO2max | LT1, plantarflexion, plank, loaded step-up, deadlift |
| horseback | 4 | partial | 1/2 | - | VO2max | side plank, hip abduction, balance, grip, LT1 |
| hike-pack | 5 | partial | 1/3 | - | VO2max | LT1, loaded step-up, step-down, plantarflexion, balance, ankle DF |
| ski-green | 5 | partial | 1/3 | - | VO2max | LT1, knee extension, step-down, CMJ power, balance, hip abduction |
| swim-500m | 4 | partial | 1/2 | - | VO2max | LT1, loaded row, shoulder flexion, shoulder ER, plank |
| golf-18 | 5 | partial | 2/3 | - | VO2max, suitcase carry | LT1, rotational throw, thoracic rotation, balance, grip |
| sprint-triathlon | 4 | partial | 1/2 | - | VO2max | LT1, pogo RSI, knee extension, plantarflexion, calf raises |
| row-10k | 4 | trajectory-only | 0/2 | - | - | VO2max, LT1, loaded row, deadlift, plank, grip |
| cycle-10mi | 3 | partial | 1/2 | - | VO2max | LT1, knee extension, knee flexion, plank |
| walk-3mi | 3 | partial | 1/2 | - | VO2max | LT1, plantarflexion, calf raises, knee extension, balance |
| kayak | 4 | partial | 1/2 | - | VO2max | LT1, loaded row, thoracic rotation, plank, grip |
| yoga | 3 | trajectory-only | 0/2 | - | - | hip flexion, shoulder flexion, thoracic rotation, balance, side plank |
| surf | 5 | partial | 1/3 | - | VO2max | LT1, loaded row, push-up, CMJ power, balance, shoulder flexion |
| balance-30s | 1 | calibrated | 1/1 | timed single-leg balance | - | hip abduction, plantarflexion |

The complete machine-readable register, including task formulas, sources, confidence fields, forecast family and horizon metadata, and remaining assumptions, is available from **Clinician detail -> Download JSON**.

## Forecast evidence horizons

- Aerobic: Fleg included adults aged 21-87; extrapolation begins at 88 and uncertainty widens thereafter.
- Lower-body strength: Hughes included adults initially aged 46-78; Health ABC evidence is concentrated in ages 70-79. Transfer to other tests and later ages remains uncertain.
- Power: Alcazar included adults aged 19-68 over 10 years; extrapolation begins at 69 and is deliberately wide.
- LT1, upper-body strength, reactive capacity, muscular endurance, and timed balance remain lower-confidence family transfers or scenarios.
- ROM is held as measured context; DEXA remains context rather than a task-clearance input.

## Remaining clinical assumptions

1. Fixed external loads are exact task inputs, but reserve multipliers above those loads are Early Medical clinical assumptions.
2. Peak-VO2-to-sustainable-task fractions are Early Medical clinical assumptions and may vary by modality, training, disease, and individual efficiency.
3. Most complex sport and adventure goals still lack enough independent calibrated test dimensions; V4 reports these as partially calibrated or trajectory-only.
4. Grip, CMJ power, reactive tests, and LT1 inform support/prioritization but do not grant clearance where no validated task threshold exists.
5. Late-life projections are scenarios, not observed individual trajectories. Central estimates are damped and uncertainty widens beyond each evidence horizon.
6. Task performance depends on skill, equipment, environment, pain, disease, injury, and behavior that this physical-capacity model does not fully represent.

## Validation and visual QA

- `node scripts/validate-model.mjs`: PASS - 36 goals, 83 metrics, 7 archetypes, 5 modes, sensitivity, calibration breadth, evidence horizons, fixed demand, missing data, import/export, and 38-page print checks.
- Browser smoke tests: PASS - Reference, Build report, all five report modes, and all seven demo archetypes; no console errors or warnings.
- PDF render QA: PASS - five mode-specific 38-page PDFs rendered at US Letter landscape; summaries and representative goal pages visually inspected after the overflow correction.
- Screenshots: [Simple](qa-screenshots/simple.png), [Action](qa-screenshots/action.png), [Trajectory](qa-screenshots/trajectory.png), [Capacity wheel](qa-screenshots/capacity-wheel.png), [Clinician detail](qa-screenshots/clinician-detail.png), [Reference](qa-screenshots/reference.png), and [Build report](qa-screenshots/build-report.png).
