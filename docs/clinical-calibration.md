# Clinical calibration and protocol register

Status: **approved for team review and demo use with graded targets (model 4.1, 2026-09-24)**. This is not clinical-use approval. This file records target values, their grades, and operational definitions.

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

## Model 4.2 decline changes

- Each decline curve now continues through the target age. The earlier engine froze and damped the yearly loss past each family's evidence horizon, which made decline slow down in the 80s. Uncertainty past the horizon is carried by the widening range only.
- LT1 runs at 0.75× the VO₂max rates and is capped at 85% of projected VO₂max. Before this fix, projected LT1 exceeded VO₂max by age 90.
- Power runs at 1.2× and reactive capacity at 1.35× the leg-strength rates, and muscular endurance at 0.8×.

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
