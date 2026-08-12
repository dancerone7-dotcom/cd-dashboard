# Clinical calibration and protocol register

Status: **pending independent clinician approval**. This file records candidate values and operational definitions; it does not approve them for clinical scoring.

## Release rule

A candidate threshold may become scoreable only when a named clinician documents the task definition, measurement protocol, population, source or validation cohort, accepted uncertainty, and approval date. Until then the dashboard keeps it as a supporting trajectory and cannot produce a pass/fail result from it.

## Task-demand evidence grades

- **A — close operational match:** the Compendium activity, speed, load, or duration closely matches the stated task.
- **B — related match:** a close activity or one valid option within the goal is used; the model applies at least 25% demand uncertainty.
- **C — broad proxy:** a composite or variable task is represented by a broad activity proxy; the model applies at least 35% demand uncertainty and downweights it in cross-goal prioritization.

| Goal mapping | Grade | Fixed aerobic convention | Clinical decision still needed |
|---|---:|---|---|
| Sexual expression | B | 3.0 MET, general moderate effort | Confirm intended intensity and duration |
| Festival / outdoor gathering | C | 3.5 MET mixed standing/walking proxy | Define walking, standing, terrain, breaks, and weather |
| Partner dance | B | 6.0 MET recreational ballroom dance | Confirm dance style and break allowance |
| Household chores | C | 4.0 MET moderate household-work proxy | Define the required chore set and work/rest pattern |
| Beach-sand walk | A | 4.5 MET walking on sand | Confirm sand firmness and grade |
| Gardening | A | 3.8 MET moderate gardening | Confirm kneeling, carrying, and break allowance |
| Dog hike | C | 4.5 MET trail/dog-walking proxy | Define terrain and leash-force events |
| Tennis / padel / pickleball | C | 6.0 MET doubles-tennis proxy | Split sports or approve a conservative shared definition |
| Ocean swim | B | 6.0 MET open-water swimming | Define distance, current, water temperature, and supervision |
| Snorkel or SCUBA | B | 5.0 MET snorkeling, lower-demand valid option | Split the two activities if SCUBA readiness is scored |
| Horseback riding | B | 5.5 MET general horseback riding | Define gait, mounting, and assistance |
| Uneven-terrain hike | B | 6.0 MET cross-country hiking | Define grade, footing, and carried load |
| 500 m swim | B | 5.8 MET slow recreational freestyle | Confirm stroke and pool/open-water context |
| 18-hole golf carrying clubs | A | 4.3 MET carrying clubs | Confirm course grade and cart prohibition |
| 5 km in 40 minutes | A | 7.8 MET running 4.3–4.8 mph | None beyond standard course definition |
| 10,000 m row in one hour | Direct pace / C mapping | 3:00/500 m = approximately 60 W by the Concept2 pace-to-watts equation | Keep VO2 and LT1 support-only until individual erg-power conversion is calibrated; confirm ergometer and damper conventions |
| 10-mile cycle in one hour | A | 6.8 MET cycling 10–11.9 mph | Confirm bike type, wind, and stop rules |
| 3-mile walk under one hour | A | 3.8 MET walking 2.8–3.4 mph | Confirm firm, level formed path |
| Kayaking | B | 5.0 MET moderate kayaking | Define craft, water, wind, and duration |
| Surfing | C | 3.0 MET general surfing | Define paddling, pop-up, wave, and burst demands |

Source convention: the [2024 Adult Compendium](https://pacompendium.com/adult-compendium/) uses a standard adult MET; its terms page defines 1 MET as approximately 3.5 mL/kg/min. These are task-demand conventions, not age-adjusted patient values.

The rower is the exception to a category-first MET mapping: its primary demand is the exact Concept2 pace and power. Concept2 defines `watts = 2.80 / pace³`, where pace is seconds per meter; 180 seconds per 500 m therefore yields approximately 60 W. The dashboard does not convert that external power to an individual VO2 clearance threshold without a calibrated patient-specific equation.

## Candidate thresholds kept out of readiness scoring

These 22 values are preserved for review so the team does not lose prior work. Every row remains **supporting trajectory only**.

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
| Clinical owner | _required_ | _pending_ | _pending_ |
| Assessment/VALD protocol owner | _required_ | _pending_ | _pending_ |
| Technical reviewer | _required_ | _pending_ | _pending_ |
