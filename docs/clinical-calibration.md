# Clinical calibration and protocol register

Status: **approved for team review and demo use with graded targets (model 4.1, 2026-09-24; decline recalibrated in model 4.5, 2026-09-24)**. This is not clinical-use approval. This file records target values, their grades, and operational definitions.

## Status rule (model 4.1)

Every target counts. A goal is **On track** only when every one of its tests is projected to clear its target at the marginal-decade age. Any projected miss means **Won’t clear**, and the report names the tests that fall short. A goal with missing tests and no projected miss shows **Needs more data**, naming what is missing.

Each target carries a grade for how firm the number is:

- **A — task standard:** set by the task itself or a close published match (for example, 30 seconds for the 30-second balance goal, or a Compendium grade-A aerobic demand).
- **B — research-based:** adapted from published research or a closely related task, including fixed external loads converted with a planning reserve.
- **C — clinical estimate:** the team’s best current number, still being validated. This includes the 22 targets listed below whose test protocol is not yet validated.

Grades are shown on every target in the report’s test table and in the clinician audit. A target moves up a grade when a named clinician documents the task definition, measurement protocol, population, source or validation cohort, accepted uncertainty, and approval date.

## Target rule (model 4.2): not physically limited

Each target is the level at which that capacity stops limiting the task at the marginal-decade age. Sources, in order of preference:

1. **The task itself:** the real load (a 20-lb laundry basket, a 40-lb bag of soil, a 10-lb-per-hand overhead bag), the stair riser (7 in) or the task's MET cost, plus a stated reserve.
2. **Published functional cut-offs:**
   - Knee extension (× BW, hand-held dynamometry): 0.35 to rise from a 40-cm seat, 0.40 for continuous walking, 0.50 for stairs (Yamasaki 2002; Katayama & Yamasaki 2017).
   - Grip: below 27 kg (men) or 16 kg (women) is weak (EWGSOP2, Cruz-Jentoft 2019).
   - Relative sit-to-stand power: below 2.6 W/kg (men) or 2.1 (women) is low (Alcazar 2021). 1.1 / 1.0 W/kg is only the minimum to stand up at all.
   - Single-leg stance: under 5 s marks higher injurious-fall risk (Vellas 1997). Mean at 80–99 is 6.2 s (Springer 2007). Targets are 6 s for even ground, 10 s for dressing on one leg or soft/moving ground, 15 s for uneven terrain and sport, and 30 s for the 30-second balance goal.
3. **Otherwise, the PCA's own 80–90 standard for the patient's sex:** the start of Developing (not Deficient) for everyday goals, Proficient for demanding goals (tennis, mountain hike, ski, surf, 5 km run, ocean swim, SCUBA, kicking).

Targets from sex-specific cut-offs carry separate values for men and women. Task-derived targets are the same for both.

## Model 4.5: decline calibrated to the PCA standards (2026-09-24)

**Dan's rule:** someone who scores Proficient on every PCA test for their age today should have the strength to meet the strength-based targets of their CD goals at 90, unless strong evidence shows a task needs more than Proficient.

- **Decline.** Each PCA test now declines along its own Proficient standard, band to band. A band's value sits at its first year and the 80–90 value lands at 90, so a Proficient result today meets the 80–90 Proficient standard at 90.
  - **Source:** the live PCA Standards database. All 744 rows were checked on 2026-09-24, and all 648 load-rate values match the standards.
  - **Proxies for tests without numeric PCA bands:**
    - hip abduction/adduction and knee flexion follow the knee-extension bands;
    - shoulder ER follows the cuff DB external rotation bands;
    - jumps, throws and pogos follow sit-to-stand power;
    - the chin-over-bar hold follows the dead hang;
    - the single-leg bridge and contralateral hold follow the plank;
    - eyes-closed balance follows eyes-open balance.
  - **Grip** tracks the Dodds 2014 75th centile (PMID 25474696).
  - **VO₂max and LT1** keep longitudinal decline (Fleg 2005). The 2026-09-24 literature review judged it about right: 60→90 retention 0.53 in the model vs 0.50 (0.44–0.60) in the evidence, for men.
- **Calibration check.** A synthetic patient exactly Proficient on every PCA test clears every strength target except the exceptions below. The check covered ages 35–75, both sexes and three body weights per sex (3,300 checks).
- **Targets capped at the 80–90 Proficient standard.** In each case the evidence wasn't strong enough to require more than Proficient.
  - Knee extension:
    - 0.50 × BW (floor rise, stairs, tennis, kicking, 5 km) and 0.55 (skiing) became 0.45 for men and 0.35 for women.
    - 0.40 for walking-type goals became 0.35 for women.
    - Katayama & Yamasaki 2017 report 0.40 and 0.50 as the levels above which every hospital-rehab patient walked or climbed stairs independently. They are not minimums.
  - Grip for the dog walk and weapon handling: 70 / 45 lb (clinical estimate) became 63 / 37 lb, the Dodds 75th percentile at 90.
  - The planning reserve on fixed loads (×1.25–1.5) can no longer push a target above the 80–90 Proficient standard. The bare external load stays the floor.
- **Exceptions kept, because the evidence is strong.**
  - The 30-second balance goal: 30 s is the task itself, while Proficient at 80–90 is 15 s.
  - A fixed external load above the Proficient standard for a light patient: that is physics. For example, 40 lb of dive gear is 32% of a 125-lb patient's body weight.
- **Toe flexion:** the live PCA standard is now the same at every age. 1st toe is 4 / 7 / 10% BW; toes 2–5 are 2 / 3.5 / 5% BW.
- **Aerobic targets.** Each goal now stores the task's absolute oxygen cost for an older adult: 2024 Older Adult Compendium MET60+ × 2.7, or measured older-adult data, rather than adult MET × 3.5.
  - **Sustainable fraction by duration:**

    | Duration or pattern | Fraction |
    |---|---|
    | 2+ h, mostly standing | 0.45 |
    | 2–4 h | 0.50–0.55 |
    | 90 min of play | 0.60 |
    | 1 h | 0.65 |
    | ≤45 min | 0.72–0.75 |
    | 40-min race effort | 0.85 |

  - **Mode factors:** swimming 0.85, fins 0.9, arm paddling 0.75, surfing 0.8.
  - **LT1 margin:** 1.10 for tasks of 2 h or more.
  - **Code fixes:**
    - racquet: measured doubles pickleball;
    - horseback: riding at a walk;
    - rowing: 60 W;
    - snorkeling: 5.0;
    - cycling: about 60 W at 10 mph.
  - **VO₂max targets at 90:**

    | Direction | Goal: old → new |
    |---|---|
    | Down | 5 km run 35 → 33.5; gardening 20.5 → 20; dance 29 → 22.5; tennis/padel/pickleball 30 → 25; cycling 33 → 26; chores 21 → 17.7; horseback 18.5 → 16.7; skiing 27 → 23 |
    | Up | 3-mile walk 19.6 → 23.8; golf 23 → 27; hike 30 → 34; rowing 23 → 27; soft sand 23 → 26; ocean swim 30 → 32; surfing 25 → 29; sexual activity 15 → 16.7; festival 15 → 18.9; snorkeling 25 → 27.8; kayak 25.7 → 27.3; dog walk 22.5 → 23.8 |

  - **Full sources:** `research_aerobic_demands` (2026-09-24 audit).
- **Range-of-motion and balance targets (task data from motion-analysis studies):**
  - Knee flexion: floor rise 115 → 120° and gardening 115 → 120°. Kneeling reaches ≥120° (Galvin 2019); kneeling and crouching use 120–149° (Rowe 2000).
  - Hip flexion: chair or toilet rise 100 → 110° (toilet 112.6°, Sah 2022) and gardening 105 → 110° (Hyodo 2017 crouching, plus pelvic tilt in a clinic measure).
  - Ankle dorsiflexion for tying shoes: 7 → 4 cm knee-to-wall. Dressing uses 3–13° (Hyodo 2017).
  - Thoracic rotation for driving: 35 → 30°. Blind-spot checks use 10–18° of trunk rotation (Chen 2015).
  - Single-leg balance for stairs with 25 lb: 6 → 10 s (Araujo 2022 10-s test; PCA 80–90 Developing).
  - Demanding balance targets stay at 15 s, the 80–90 Proficient standard. The 20-s figures in the literature are health-risk cut-offs, not task demands.
- **Range of motion is still held flat to 90.** The literature shows decline: about 1–2° per decade before 70, then faster for hip flexion (−6°/decade), shoulder flexion (−7°) and ankle dorsiflexion (−1.25 cm). Straight-leg raise holds steady. Whether to model this, and on which track (typical, or maintained for patients who do mobility work), is an open decision for Dan.
- **Evidence caveat (documented, not modeled).** Longitudinal studies show untrained people lose rep counts, holds and balance faster than the PCA age bands imply: roughly 2× for push-ups and trunk holds, and 2–3× for single-leg stance. So for strength and movement tests the red line means "keeps the current level for age", which is what training aims for. Aerobic fitness follows typical decline.
- **Also in 4.5:**
  - stand-in tests count toward the goals they stand in for;
  - exact ties clear;
  - the tool reads 4.4 exports.

## Model 4.2 decline changes

- Each decline curve now continues through the target age. The earlier engine froze and damped the yearly loss past each family's evidence horizon, which made decline slow down in the 80s. Uncertainty past the horizon is carried by the widening range only.
- LT1 runs at 0.75× the VO₂max rates and is capped at 85% of projected VO₂max. Before this fix, projected LT1 exceeded VO₂max by age 90.
- Power runs at 1.2× and reactive capacity at 1.35× the leg-strength rates, and muscular endurance at 0.8×.

## Model 4.4 stand-in tests, capped holds and not-tested codes

- **Stand-ins:** when a goal's ideal test was not done, the next test the patient has stands in, best first (capacity map draft 1). Example: knee extension → belt squat → 30-s chair stand → squat chain. A stand-in's target is the PCA 80–90 standard for the patient's sex: the start of Developing for everyday goals, Proficient for demanding goals. The report says which test stood in.
- **NT codes (PCA):** NT-UNABLE is a result and reads below target ("unable today"). NT-PAIN, NT-CONTRA, NT-ELIG, NT-TIME and NT-EQUIP mean no result, so a stand-in is used. Codes travel in the exported JSON as `notTested`.
- **Capped holds:** wall sit, heel-to-wall plank, Sorensen, side plank and calf raises stop at the band bar, and single-leg balance at 45 s. A result at the bar is a lower bound. If even the capped value clears the target at 90, it clears. If not, a stand-in is tried; if none settles it, the test shows "at the test limit, re-test longer to confirm" as a watch item, not a miss.

## Model 4.3 goal inputs

Tests were swapped or dropped so each goal uses the highest-impact tests Early Medical already measures (PCA, pROM tracker, VALD), with one test per capacity:
- **Added from the PCA and pROM tracker:** 30-second chair stand (chair rise), knee flexion range (floor rise, gardening), hip extension range (walking), hip external rotation (sexual expression), hip abduction range (horseback).
- **Swapped in:**
  - Sorensen hold: lifting a child, car seat, rowing.
  - Split squat: floor rise, bowling.
  - Dead hang: jars.
  - Inverted row: swimming, paddling, yacht, surf.
  - Wall sit: skiing.
  - Single-leg pogos: tennis. The drop jump is not in the PCA battery.
  - Seated calf strength: dance.
- **Dropped:**
  - Duplicate tests: a second calf test (beach, dog walk, 5 km, walking) and CMJ where a single-leg jump is used (kicking).
  - Tests that don't limit the task: planks in chores, cycling, swimming and rowing; balance on flat ground or two feet; grip for rowing and kayaking; Pallof hold for jars.
  - LT1 for efforts under about 45 minutes (5 km, 500 m swim) and at 3 METs.
- A goal whose own test is the task (the timed 30-second stance) is on track when that test clears; other tests below target show as "watch".

## Task-demand evidence grades

- **A — close operational match:** the Compendium activity, speed, load, or duration closely matches the stated task.
- **B — related match:** a close activity or one valid option within the goal is used; the model applies at least 25% demand uncertainty.
- **C — broad proxy:** a composite or variable task is represented by a broad activity proxy; the model applies at least 35% demand uncertainty and downweights it in cross-goal prioritization.

| Goal mapping | Grade | Fixed aerobic convention | Clinical decision still needed |
|---|---:|---|---|
| Sexual expression | B | 3.0 MET, general moderate effort | Confirm intended intensity and duration |
| Festival / outdoor gathering | C | 2.8 MET, mostly standing with slow walking | Define walking, standing, terrain, breaks, and weather |
| Partner dance | B | 6.0 MET recreational ballroom dance | Confirm dance style and break allowance |
| Household chores | C | 4.0 MET moderate household-work proxy | Define the required chore set and work/rest pattern |
| Beach-sand walk | A | 4.5 MET walking on sand | Confirm sand firmness and grade |
| Gardening | A | 3.8 MET moderate gardening | Confirm kneeling, carrying, and break allowance |
| Dog hike | C | 4.5 MET trail/dog-walking proxy | Define terrain and leash-force events |
| Tennis / padel / pickleball | C | 6.0 MET doubles-tennis proxy | Split sports or approve a conservative shared definition |
| Ocean swim | B | 6.0 MET open-water swimming | Define distance, current, water temperature, and supervision |
| Snorkel or SCUBA | B | 5.0 MET snorkeling, lower-demand valid option | Split the two activities if SCUBA readiness is scored |
| Horseback riding | B | 3.8 MET horseback riding at a walk (level pasture) | Define gait, mounting, and assistance |
| Uneven-terrain hike | B | 6.0 MET cross-country hiking | Define grade, footing, and carried load |
| 500 m swim | B | 5.8 MET slow recreational freestyle | Confirm stroke and pool/open-water context |
| 18-hole golf carrying clubs | A | 4.3 MET carrying clubs | Confirm course grade and cart prohibition |
| 5 km in 40 minutes | A | 7.8 MET running 4.3–4.8 mph | None beyond standard course definition |
| 10,000 m row in one hour | A | 7.5 MET ergometer 100–149 W | Confirm ergometer and damper conventions |
| 10-mile cycle in one hour | A | 6.8 MET cycling 10–11.9 mph | Confirm bike type, wind, and stop rules |
| 3-mile walk under one hour | A | 3.8 MET walking 2.8–3.4 mph | Confirm firm, level formed path |
| Kayaking | B | 5.0 MET moderate kayaking | Define craft, water, wind, and duration |
| Surfing | C | 5.0 MET, surfing paddling demand (competitive code) | Define paddling, pop-up, wave, and burst demands |

Source convention: the [2024 Adult Compendium](https://pacompendium.com/adult-compendium/) uses a standard adult MET; its terms page defines 1 MET as approximately 3.5 mL/kg/min. These are task-demand conventions, not age-adjusted patient values.

## Targets graded C pending protocol validation

These 22 values were held out of scoring before model 4.1. They now count toward goal status like every other target and are graded **C (clinical estimate)** until the protocol validation in the last column is done.

| Goal | Metric | Candidate | Why it was proposed | Approval evidence required |
|---|---|---:|---|---|
| Floor rise | Sit-to-stand relative power | 1.6 W/kg | Floor rise exceeds chair-rise demand | Task-specific floor-transfer validation |
| Floor rise | Hip flexion | 110° | Substantial flexion is expected | Standardized ROM protocol plus floor-transfer validation |
| Sexual expression | Hip flexion | 105° | Positional option | Operational task definition and validation |
| Sexual expression | Hip internal rotation | 20° | Rotational options may reduce compensation | Operational task definition and validation |
| Child from car seat | Thoracic rotation | 40° | Access requires trunk rotation | Standardized car-seat task study |
| Partner dance | Thoracic rotation | 40° | Supports partner movement | Dance-style definition and validation |
| Tie shoes / dress | Hip flexion | 105° | Principal reach range | Standardized dressing task study |
| Drive and run errands | Sit-to-stand relative power | 1.4 W/kg | Repeated vehicle transfers | Vehicle-height and repetition validation |
| Drive and run errands | Thoracic rotation | 35° | Driving and transfers require rotation | Standardized driving/transfer study |
| Drive and run errands | Hip flexion | 100° | Car-seat transfer range | Vehicle-height validation |
| Chair rise | Hip flexion | 100° | Efficient forward excursion | Chair-height and technique validation |
| Gardening | Hip flexion | 105° | Bending and kneeling | Defined gardening task study |
| Overhead luggage | Thoracic extension | 30° | Limits compensatory lumbar extension | Standardized overhead-placement study |
| Golf | Thoracic rotation | 45° | Golf swing rotation | Task- and protocol-specific validation |
| Kayak | Thoracic rotation | 45° | Paddle efficiency | Defined craft and stroke validation |
| Yoga | Hip flexion | 115° | Common poses need substantial flexion | Pose-set definition and validation |
| Yoga | Thoracic rotation | 45° | Twisting poses | Pose-set definition and validation |
| Overhead luggage | Shoulder flexion | 150° | Near-full elevation | Luggage-height and technique validation |
| Ocean swim | Shoulder flexion | 150° | Stroke recovery and entry | Stroke-specific validation |
| 500 m swim | Shoulder flexion | 150° | Stroke recovery and entry | Stroke-specific validation |
| Yoga | Shoulder flexion | 155° | Overhead poses | Pose-set definition and validation |
| Surfing | Shoulder flexion | 150° | Repeated paddling excursion | Surf task validation |

The internal standards workbook is a read-only source reference. Its Notes sheet explicitly labels several internal targets as provisional and says age-80–90 values extrapolated beyond source cohorts should be treated as provisional.

## Balance protocol decision

Project direction: single-leg balance is standardized as **seconds held**. The task target and the age-decline scenario both remain in seconds. The 30-second goal therefore compares projected timed-stance seconds directly with a fixed 30-second target. These fields are not labeled as VALD CoP outputs.

Proposed capture SOP for those seconds fields: firm surface, arms at sides, eyes open or closed as labeled, 60-second cap, best of two trials per side, and enter the weaker side. The metric choice is settled; the capture details remain visibly marked `SOP approval pending` until the clinical protocol owner ratifies them.

VALD ForceDecks supports Quiet Stand, Single Leg Stand, and Single Leg Range of Stability; it also requires explicit choices for eyes open/closed, stable/unstable surface, full concentration/secondary task, and exercise length. Its outputs include CoP excursion, range, area, and mean velocity. If Early Medical adopts ForceDecks CoP, add a distinct CoP metric and protocol rather than storing it in a seconds-held field. See VALD’s [Centre of Pressure measurement guide](https://support.vald.com/hc/en-au/articles/5000001373209-Centre-of-Pressure-Measurement-with-ForceDecks).

## Required signoff

| Role | Name | Decision | Date |
|---|---|---|---|
| Project owner | dancerone7-dotcom | Approved for team review and demo deployment only; not clinical-use approval | 2026-08-11 |
| Clinical owner | Dan (dancerone7-dotcom) | Approved every target counting toward goal status for team review and demo use, each graded A/B/C (most are C, clinical estimates). Not clinical-use approval | 2026-09-24 |
| Assessment/VALD protocol owner | _required_ | _pending_ | _pending_ |
| Technical reviewer | _required_ | _pending_ | _pending_ |
