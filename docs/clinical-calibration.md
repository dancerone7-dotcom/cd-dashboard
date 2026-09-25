# Clinical calibration and protocol register

Status: **approved for team review and demo use with graded targets (model 4.1, 2026-09-24; decline recalibrated in model 4.7, 2026-09-24; strength targets and status reframed in model 4.8, sub-items and time-framed goals in model 4.9, ForceFrame knee norms in 4.9.1, ForceFrame Proficient = VALD 75th percentile in 4.9.2, decline rates rebuilt from a six-part literature review in 4.10, Dan's decisions on its open items in 4.10.1, the stop line from the detraining literature in 4.11, the patient page, data coverage and the goal library in 4.12, 2026-09-25)**. This is not clinical-use approval. This file records target values, their grades, and operational definitions.

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

## Model 4.12: one patient page, a clinician view and a three-step build (2026-09-25)

Dan's direction: make it clear to a patient where they are now, where they need to be, and their top strengths and weaknesses; streamline the dashboard views; make the team's workflow obvious; brand it as Early Medical.

- **Two views.** The patient page is one scrolling page in the Early Medical report style (Canva master template): goals at a glance, where you are today, strengths and opportunities with the capacity wheel, the next one to three years, and goal by goal. The clinician view keeps priorities, trajectories, every measured capacity and the goal audit. The older A, B and R layouts are gone.
- **Strengths and opportunities.** The top four of each, ranked by how many goals they affect and by how far they sit above or below what those goals need at the target age. Each shows its percentile for age where published norms exist, or the Early Medical standard for age.
- **Build in three steps:** patient, goals (with search and "What it needs" for each goal), then test results, then the report.
- **Goal builder.** Start from a library activity or tick what the activity involves. Each test copies the rule a built-in goal uses, and the coach can change or remove any target. Saved goals keep their recipe and rebuild on import.
- **Goal results are unchanged from 4.11:** test member A 3 / 7 / 0, test member B 1 / 1 / 8, all-Proficient check 110 of 594 short.

## Model 4.12: data coverage, every test Early Medical collects (2026-09-25)

Dan's request: make sure nothing EM collects that matters for a CD is missed. Checked against the EM Notion templates (PCA Standards, 62 tests; pROM tracker, 36 rows; DEXA tracker, 19 rows; CPET tracker, 18 rows), the report generator's parsers (CPET, DEXA, DARI CSV and JSON, PT intake, Injury Resilience Assessment workbook), the VALD tests EM runs, and the one-day assessment schedule.

| Source | Already an input | Added | Left out, and why |
|---|---|---|---|
| PCA (62 tests) | All but one | | Plyo push-up: the PCA records it without a standard, and no study ties it to a daily task. The chest pass covers upper-body power |
| pROM tracker (36 rows) | Hip flexion, hip IR and ER at 90°, hip abduction, hip extension, knee flexion, straight-leg raise, knee-to-wall, shoulder flexion, T-spine rotation | Shoulder IR and ER at 90° (typical range by age and sex, and decline, from Fleisig 2023: DARI capture of 6,635 people). Knee extension range (full = within 5° of straight) | Provocation and joint-play tests (SI cluster, FABER, Ober, Thomas, prone press-up, spring test, active SLR, foot and ankle joint mobility, tibial rotation, hip rotation at 0°, lumbar rotation, shoulder extension): no age norm tied to a task. A positive one is logged as a finding |
| DEXA tracker (19 rows) | ALMI, FFMI, lowest central T-score | Body fat % (healthy range by age and sex: Gallagher 2000, Table 4). Lowest central Z-score, which is the one read under 50 or before menopause (ISCD 2019); the T-score loses its low-bone-mass label under 50 | Visceral fat: no settled cut-point for DXA VAT mass, and it stays on the DEXA report. Regional lean mass and symmetry: strength tests already use the weaker side. Forearm (33% radius): not a central site; ISCD uses it only when hip or spine can't be read |
| CPET tracker (18 rows) | VO₂max, VO₂ at zone 2 (LT1); zone 2 as a share of VO₂max is shown | Heart rate recovery at 1 minute: 12 beats or less carries higher risk (Cole 1999, walking cool-down; 18 if recovery was lying down, Watanabe 2001) | HRmax, max fat oxidation, resting lactate: health context with no task link. METs, W/kg and absolute VO₂max: derived from VO₂max. Zone 2 heart rate, power, speed and incline: training zones, not capacity |
| DARI | | Shoulder rotation (the Fleisig norms are DARI data). Asymmetries and compensations are logged as findings | Motion age and the quality, performance, athleticism and vulnerability scores: proprietary composites not tied to a task. DARI and goniometer angles are not interchangeable, so note the source |
| Ortho exam (Injury Resilience Assessment) | | Highlights, reporting, injury history, key performance inhibitors, posture and treadmill notes are logged as findings | The output and capacity table repeats the VALD inputs |
| VALD | CMJ power, single-leg jump, pogo and drop-jump RSI, sit-to-stand power, belt squat, ForceFrame hip, knee and shoulder ER, calf, grip | | Single-leg and quiet-stance sway: the plate logs fixed 30-s trials, so the stopwatch hold stays the input. Shoulder IR strength and the ER:IR ratio: a throwing-athlete marker, to revisit with the throwing goals. CMJ height and eccentric metrics: power is the input. DynaMo shoulder and hip: not comparable to ForceFrame |
| SFMA, gait, respiration | Squat, toe touch, rotation and gait grades; DNS 3-month | Painful or dysfunctional patterns are logged as findings | |

**Findings to keep in mind.** Test results ends with a findings list: body area, side, type (pain or symptoms, past injury or surgery, limited motion, movement pattern), source and a short note. A finding never changes a result. Every goal whose tests load that area lists it, on the patient page (with a "Things to keep in mind" panel under today's results) and in the clinician view. Findings travel with the exported file.

**Test results step.** Body composition and heart rate recovery stay visible when "Only show tests these goals use" is on, and any entered result stays visible (dimmed if no selected goal uses it).

**Goal results are unchanged.** The new inputs are context, or not yet used by a goal. Test members: A 3 / 7 / 0; B 1 / 1 / 8. All-Proficient check: 110 of 594 short. All demo patients match.

**Open for Dan:**
- The PCA broad jump is single-leg; the tool's input is labeled "Broad jump". Confirm which one the team enters.
- Shoulder IR and ER range will join the throwing, striking and overhead goals when the activity library lands.
- Knee extension range is context only for now. It could join the walking and stair goals: standing on a bent knee raises the quadriceps demand steeply as the angle grows (Perry 1975), and more than 5° short of straight is the usual clinical cut for a flexion contracture.
- Visceral fat stays off the CD page unless you want it shown without a cut-point.

## Model 4.12: goal library, 55 activities from the activity-demand review (2026-09-25)

The goal builder's "Start from an activity" list holds 55 activities people want to keep doing into their 80s: 16 sports, 14 snow and water, 12 walking, climbing and cycling, 5 mind-body and dance, and 8 home and travel. Demand profiles are graded 7 A, 25 B and 23 C, and 246 of 248 citations were re-checked against Europe PMC. Only 7 activities have demand data measured in adults over 60; most targets at 80–90 are extrapolations.

**Aerobic targets.** Each activity keeps the review's numbers while the coach leaves its METs and minutes unchanged; changing either falls back to the builder's duration rule.

- Oxygen cost: measured older-adult data first, then the Older Adult Compendium (MET60+ × 2.7), then the Adult Compendium (MET × 3.5 × 0.76 for self-paced activities; × 1.0 at a fixed pace, × 1.08 walking at a set speed). The 0.76 is the median older/adult cost ratio across 18 activities listed in both Compendiums.
- Share of VO₂max by bout: 0.75 up to 20 minutes, 0.70 for 20–45, 0.65 for 45–75, 0.58 for 75–150 minutes of stop-and-go sport, 0.55 for 2–3 hours, 0.47–0.50 all day. Mode ceilings: swimming 0.85, fins 0.92, arm paddling 0.75. LT1 at the cost × 1.05 (× 1.10 past 2 hours; not for bouts under 5 minutes).
- Example: slow-pitch softball costs 13.3 mL/kg/min (5.0 METs × 3.5 × 0.76) at 58% of VO₂max, so VO₂max 23 and LT1 14 at the goal age (grade C).

**Tests.** The review's 4–8 ranked tests per activity. Each takes its target from the built-in goal whose demand it matches, or else the first built-in goal that uses it, so library goals are judged like built-in ones. PCA rep and hold tests that no goal sets a target for (push-ups, planks, dead hang, chin-ups, Copenhagen, eyes-closed balance) are tracked against the standard for age and don't set the result. A stand-in named by the review (goblet squat, dumbbell external rotation) is entered under its main test, and steps in automatically when the main test is missing.

**New targets:**

| Test | Target at the goal age | Used for | Grade |
|---|---|---|---|
| Shoulder internal rotation, 90/90 | ≥ 45° (flag under 35°) | Throwing | C: Roy 2009 (60+, passive) averages 62°, about 53° at 90 at −4° a decade |
| Shoulder external rotation, 90/90 | ≥ 75° (flag under 65°) | Throwing | C: Roy 2009 averages 84°, about 75° at 90 |
| Hip internal rotation (lead hip) | ≥ 30° | Swinging a club, bat or racquet | B: 31° in pain-free golfers against 21° with low back pain (Murray 2009; Vad 2004) |

Shoulder rotation falls about 4° a decade each after 55 (total arc about 8°; Fleisig 2023 and Roy 2009 agree), half that for people who keep up mobility work. Rotation screening did not predict injury in softball, tennis or volleyball (Pozzi 2020), so these are capacity targets, not injury screens.

**Built-in goals against the review.** Built-in VO₂max targets sit close to the review's matching activities. Tennis/padel/pickleball is 25 against doubles 26, pickleball 25 and padel 27, but singles tennis needs 37. Golf carrying is 27 (review 27), dance 22.5 (23 to 24), horseback 17 (18), open-water swim 32 (35), laps 28 (31), kayak 27 (30), surf 29 (32) and downhill ski 23 (26). The built-in dog walk is a 60-minute trail walk with a 60-lb dog (24); the review's 30–40 minute walk needs 17.

**Open for Dan:**
- Align the built-in goals with the review's aerobic numbers? Open-water swim, laps, kayak, surf and downhill ski would rise by 2 to 3.5 mL/kg/min. Tennis stays about the same unless it is split into singles and doubles.
- Tests the review would add: a water-competency pass (swim, tread, exit), a sitting-rising or timed floor-transfer test, a cardiac-clearance flag for scuba, snorkeling, open water, skiing, hunting and singles tennis (most deaths of older participants there are cardiac), the shoulder ER:IR strength ratio from the ForceFrame test (≥ 0.80), a 10-m sprint, NordBord eccentric hamstring, and choice stepping reaction time.
- Source files: the full review (report and JSON) is kept locally with the other 2026-09-25 literature reviews, not in this repository.

## Model 4.11: the "if you stop" line follows the detraining literature (2026-09-25)

Dan's direction: match the literature as closely as possible, but keep it realistic for Early Medical's population (coached, mostly training a year or more, tested on VALD isometric devices). The grey line shows the same patient if they stop training today: a first-year drop, then the general-population decline, never more slowly than the keep-training line.

| | First-year drop | After year 1 | Basis | Grade |
|---|---|---|---|---|
| Strength | 30% of the surplus above the median for age and sex, 4–12%, where norms exist (VALD, grip); 8% otherwise; +2 points from age 75 | General rate | Isometric strength falls 5–12% after short programs (vs 10–20% by 1RM). After a year of training: ~0% isometric loss a year after stopping, 82% of the advantage over controls kept at 7 years (Leuven, Kennis 2013); +9–24% above baseline 3 years after stopping 2 years of training (Smith 2003) | C |
| Power | 8%; hop and drop-jump reactivity 11% | General power rate | Power detrains no faster than strength in year one; rapid force a little faster (Bosquet 2013) | C |
| VO₂max and LT1 | Half the surplus above the median for age and sex, 8–18% | 1.2× the general rate while still above a typical person's path, then the general rate | Masters athletes lost 9–18% in 2–3 months, then levelled off (Coyle 1984); the half-surplus rule predicts 16% vs 15% observed. 1.2× reproduces four long-term cohorts of athletes who stopped (−4% to +9%); former athletes stay ~20% above sedentary peers for 10–22 years | B–C |

- The old 15% first-year strength loss came from short programs in previously sedentary older adults, measured by 1RM on the training machines. It was too large for long-term trainers tested isometrically.
- Examples at 60 (180-lb man): knee extension at the median drops 4% in year one, at the 75th percentile 7%, near the top 12%. Grip at 120 lb drops about 5%. VO₂max 45 drops 17%; VO₂max 30 drops 8%.
- Goal status is unchanged: the grey line never sets status. Test members: A 3 / 7 / 0; B 1 / 1 / 8. All-Proficient check: 110 of 594 short.
- Gaps: no study followed masters lifters who stopped or used VALD tests; few data for ages 40–55 or women over 75. EM members' own retests after breaks of 3 months or more would be the best check.
- Source review: session scratchpad `audit/lit2_detraining.md` (study table with PMIDs and derivations).

## Model 4.10.1: Dan's decisions on the 4.10 open items (2026-09-25)

- **Git history:** Dan chose to keep the old commits as they are. The current doc keeps neutral labels for test members.
- **Balance, uneven terrain and sport:** the target at 90 is now about 11 s, the top quarter for people in their 80s (Springer 2007, from the published mean and SD). It was 15 s, the PCA 80–90 Proficient level, which under realistic decline needed more today than the 60-s test can time. Applies to tennis, the mountain hike, skiing, surfing and kicking. The 10-s everyday targets and the 30-s balance goal are unchanged. For age 90 itself the top quarter is lower, about 6–7 s (extrapolated), so 11 s keeps some reserve.
- **Stand-in tests are judged today** against the PCA Proficient standard for the patient's age, like the rep and hold stand-ins. Before, a stand-in aimed for the PCA 80–90 standard applied at exactly 90 while the patient was projected on within-person decline, which asked for more than Proficient today; for example, test member A's dumbbell external rotation needed 18.9 lb against 15 lb Proficient for that age. The PCA Proficient-by-age values for the stand-in lifts (belt squat, 30-s chair stand, back, front and goblet squat, kettlebell deadlift, landmine press) come from the PCA Standards pulled 2026-09-24; their 80–90 values match PCA-2026-09-03.
- **Grip norms by exact age:** VALD pools its DynaMo grip norms into two bands (20–59 and 60+) and won't share the age mix. Grip now uses Dodds 2014: 12 British studies, about 50,000 people, with mean and SD every 5 years and no skew, interpolated by age. Past 90, the 90 values carry down at the review's rate.
  - At 55, the 75th percentile is 116 lb for men (VALD's pooled 20–59 band said 130).
  - Grip targets at 90: the 75th percentile at 70 (98 lb men, 60 lb women) carried to 90 on the keep-training decline, about 59 lb and 37 lb (4.10: 62 / 38).
  - The dog walk needs the larger of that and the dog's 60-lb pull.
- **Results:**
  - Test members: A 3 on track / 7 opportunities / 0 need data; B 1 / 1 / 8.
  - Demo patients: unchanged from 4.10.
  - All-Proficient check: 110 of 594 short (4.10: 147). The remaining shortfalls are balance at 65 and fixed loads such as the 60-lb dog pull for women.

## Model 4.10: decline rates rebuilt from a six-part literature review (2026-09-25)

Dan's direction: keep the PCA Proficient standards where they sit above the 75th percentile; for 60 and older, set the equivalent standard from the best evidence on decline by age and sex; make every rate of decline realistic and a good target. Six reviews were run in parallel (lower-limb strength by muscle, grip and upper body, power and endurance, aerobic fitness, balance / range of motion / body composition, and training status). Each is kept with its study tables, PMIDs and arithmetic.

**Two curves, never mixed**
- **Projections** follow within-person (longitudinal) studies, because people followed over time decline faster after 70 than age-group comparisons suggest: the people still tested at 90 are the survivors.
- **Age standards** ("75th percentile for your age") past VALD's last age band follow cross-sectional 75th-percentile curves. The 75th percentile falls about 5% more slowly than the median (48 lower-limb comparisons; 2.4 million grip tests).
- Extending norms with longitudinal rates, or projecting patients on cross-sectional slopes, is off by up to 2x after 85.

**Strength, projections (% lost per year at 45 / 55 / 65 / 75 / 85 / 95)**

| Curve | Men | Women | Basis |
|---|---|---|---|
| Legs, keeps training | 0.65 / 0.9 / 1.3 / 2.0 / **3.4 / 3.8** | 0.9 / 1.0 / **1.3 / 1.9 / 3.1 / 3.4** | Healthy-volunteer cohorts to 84 (Leuven, BLSA, Winegard); from 85, 0.85x the general rate (active men in Newcastle 85+) |
| Legs, general | 0.85 / 1.25 / 1.8 / 3.2 / **4.0 / 4.5** | 0.75 / 1.1 / 1.65 / 2.65 / **3.6 / 4.0** | Health ABC to 80; past 85 from grip (Newcastle 85+, Leiden 85-plus) |
| Grip and upper body, keeps training | 0.3 / 0.65 / 1.05 / 1.7 / **3.4 / 4.25** | 0.4 / 0.7 / 0.9 / 1.85 / **3.2 / 3.8** | 0.8x the general rate (SHARE vigorous exercisers; Newcastle 85+) |
| Grip and upper body, general | **0.4 / 0.8 / 1.3 / 2.1 / 4.0 / 5.0** | **0.5 / 0.9 / 1.1 / 2.3 / 3.8 / 4.5** | Median of 11+ cohorts; the old curve was too steep before 75 and too gentle after 80 |

- **Muscle-specific rates** (both lines, as a multiple of the knee rate): knee flexion 0.95, hip abduction 0.9, hip adduction 1.1, calf 1.0 (grade C; no long-term hip studies exist).
- **Rotator cuff:** men at the grip rate; women 0.6x the grip rate to 75, reaching it by 85 (women's arm strength barely changed over 5–10 years in Hughes 2001 and BLSA; no age trend in women's external rotation once cuff tears were excluded, Kim 2009).
- **Share kept from 60 to 90, keeps training:** legs 0.51 (men) / 0.53 (women); grip 0.54 / 0.55. General: legs 0.41 / 0.46; grip 0.48 / 0.49.
- **Training mostly buys level, not slope:** elite master lifters lose the same % per year as controls with a ~20-year head start (Pearson 2002); a year of training lifted strength for 7 years without changing the later slope (Kennis 2013).

**Power**
- Keeps training (masters athletes keep their age-norm percentile): men 1.2 / 1.4 / 1.7 / 2.2 / **3.7 / 4.2**, women 1.1 / 1.3 / 1.6 / 2.0 / **3.4 / 3.8** at 45–95. From 85 it is 1.1x the leg-strength rate, because power falls faster than strength wherever both are measured and no power data run past ~80.
- General: 2.2 / 2.4 (men / women) at 65, 3.5 / 3.1 at 75, 4.4 / 4.0 at 85.
- Reactive (hops, drop jumps) 1.5x power; women's medicine-ball throws 0.8x power; sit-to-stand power from the Baltasar-Fernandez 8-year cohort.

**Aerobic fitness**
- General VO₂max rates pool BLSA (Fleg 2005, weighted double), HUNT, ACLS, SHIP, Hollenberg, Stathokostas and Generation 100: men 0.95 / 1.4 / 1.75 / 2.55 / 2.85 / 3.2 and women 0.9 / 1.25 / 1.45 / 1.85 / 2.1 / 2.5 %/yr at 45–95.
- Keeps training: 0.65x the general rate to 65, 0.9x at 75, 1.0x from 85. After about 70, training buys a higher level, not a slower decline (Generation 100 consistent trainers lost 1.8–2.8%/yr at 71–82).
- LT1 falls at 0.6x the VO₂max rate and stays at or below 85% of projected VO₂max. When that cap binds, the LT1 row now names the VO₂max it takes.
- If training stops: year one loses half the surplus above the median for age (5–20%), then 1.2x the general rate.
- **Short-term time frames for aerobic tests:** VO₂max trains less than strength (previously inactive adults gain ~15–25% over 5–12 months, HERITAGE and Kohrt 1991; people already training 5–10%). VO₂max and LT1 goals use +10% within a year, +20% in 1–3 years and +30% in 3–5 years, halved when VO₂max is already at or above the 75th percentile for age. Other tests keep +10 / +25 / +50%.

**Balance, range of motion, body composition**
- **Single-leg balance, eyes open:** PCA standards to 70 (45 / 35 / 20 s), then about 10 s in the 80s and 7 s at 90 (Springer 2007; PRIMOS; TMIG). The old 15-s value for the 80s sits near the 75th percentile, the others near the median. From 60 to 90 people keep about 15–20% of their time; training raises the level (about +5 s) but not the slope. Floor 1 s.
- **Eyes closed** has its own curve: about 4.5%/yr from 40 to 70, then 3%/yr, floor 2 s.
- **Goals past the test limit:** EM times single-leg balance to 60 s. When a balance goal would need more than that today (often 80+ s for a 15-s target at 90), it reads "past the 60 s test limit" with a plain explanation, not a number to build to.
- **Range of motion:** half the typical rate stays for patients who keep up mobility work (Dan, 4.6). The review found no study longer than a year showing that mobility work slows the slope, only that it raises the level, so this remains a grade-C "keeps up mobility work" scenario. Typical rates after 70 were corrected: hip flexion 4° per decade (was 6°, which came from a standing trunk-plus-hip arc), shoulder flexion 5° (was 7°; survivors followed 8 years lost little, Bassey 1998). If training stops, the typical rate applies and the training gain (about 4°, 1.5 cm knee-to-wall) is lost.
- **Lean mass:** ALMI falls about 0.3%/yr at 40–60, 0.5 in the 60s, 0.75 (men) / 0.6 (women) in the 70s and about 0.95 / 0.8 in the 80s (Health ABC; Gallagher 2000). FFMI about 0.2 / 0.3 / 0.4 %/yr in the 60s / 70s / 80s (Hughes 2002).

**Age standards past VALD's bands (75th percentile for age, absolute force)**

| Test (anchor age) | 60 | 70 | 80 | 90 |
|---|---|---|---|---|
| Knee extension and calf (50), men / women | 0.90 / 0.90 | 0.79 / 0.79 | 0.68 / 0.66 | 0.56 / 0.52 |
| Knee flexion (50) | 0.91 / 0.91 | 0.80 / 0.80 | 0.69 / 0.67 | 0.57 / 0.54 |
| Hip abduction (55) | 0.95 / 0.95 | 0.85 / 0.84 | 0.74 / 0.71 | 0.62 / 0.58 |
| Hip adduction (55) | 0.94 / 0.94 | 0.82 / 0.81 | 0.69 / 0.66 | 0.55 / 0.52 |
| Shoulder rotation (55) | 0.97 / 0.98 | 0.86 / 0.90 | 0.72 / 0.76 | 0.57 / 0.58 |
| Grip (70) | 1.14 / 1.12 | 1.00 / 1.00 | 0.83 / 0.82 | 0.66 / 0.63 |

- Legs: a cross-sectional knee curve (McKay 2017; Mizuno 2021; Danneskiold-Samsøe 2009; Harbo 2012) x each muscle's ratio x 0.95. Grip: Dodds 2014 British centiles (12 studies, ~50,000 people). Shoulder: grip's decline to the power 0.9 (men), 0.7 to 75 then 1.0 (women).
- **VALD's DynaMo "60+" grip band** pools ages; a pooled 60–79 sample's 75th percentile equals the age-specific one at about 70 (Dodds). It is now read as the level at 70, so a 62-year-old's standard is 12% higher than the band value and an 85-year-old's 25% lower. Worth asking VALD for the band's age mix.

**Targets**
- Isolated strength targets stay the VALD 75th percentile carried to the target age on the keep-training line, relabeled in plain words: "top-quarter strength, kept up by training to 90." A person at the 75th percentile at 70 who declines at the typical rate lands near the median for 90-year-olds, so staying in the top quarter is a better-than-typical outcome, not the expected course.
- New values at 90 (180-lb man / 145-lb woman): knee extension 0.20 / 0.19 × BW (was 0.22 / 0.21); knee flexion 0.13 / 0.12; calf 0.65 / 0.62 (was 0.70 / 0.69); hip abduction 0.25 / 0.22; hip adduction 0.22 / 0.20; shoulder external rotation 0.10 / 0.09; grip 62 / 38 lb (was 63 / 37; men's value also used for fixed loads).
- The range around each projection widens with age, by up to 1.6x for target ages 75–85 and beyond: at 85–90, individual 4–5-year changes run from gains to twice the average loss.

**Results**
- **Test member A:** 3 on track / 7 opportunities / 0 need data (unchanged); 5 with short-term goals (was 6). The walk now needs VO₂max 46 (was 38) because trained people's VO₂max after 70 falls at close to the typical rate.
- **Test member B:** 1 / 1 / 8 (unchanged). The hike needs VO₂max 72 (was 59), now labeled a long-term stretch.
- **Demo patients:** balanced 2/8, aerobic-strength-limited 0/10, strength-aerobic-limited 2/8, power-balance-limited 0/10, female-mixed 5/5 (was 6/4), older-resilient 5/5 (was 7/3), older-deconditioned 0/10. The new misses are near misses (loaded step-up at 95–98% of its target) and the 30-s balance goal.
- **All-Proficient check:** 147 of 594 checks short (4.9.2: 111). The extra misses are 30 balance checks for 65-year-olds at the PCA 35-s standard (they project to about 7 s at 90, below the 10- and 15-s task targets), 3 step-down and 3 suitcase carry. Grip passes once "Proficient" uses VALD's 75th percentile for age.

**Open for Dan**
- **Balance targets at 90:** 15 s (hike, tennis) and 30 s (the balance goal) at 90 need 80+ s and 160+ s today under realistic decline, past what the 60-s test can time. Options: lower the 15-s target, time the test to 120 s, or track eyes-closed balance for people at the limit.
- **PCA 80–90 standards used as stand-in targets are cross-sectional.** They are applied at exactly 90, not at the band's middle (85), and paired with a longitudinal projection. For example, test member A's dumbbell external rotation stand-in needs 18.9 lb now, above PCA Proficient for that age (15 lb). Reading the band value as the level at 85 and carrying it on the same curve (as the VALD targets are) would lower stand-in targets at 90 by about 15%.
- **Stopping training:** the 15% first-year strength loss may be large for long-term trainers, whose advantage lasts for years after stopping (Kennis 2013).
- **Terminal decline** (the last 1–2 years of life) is left out of the lines and named in the "how to read this" text.

## Model 4.9.2: Proficient on ForceFrame tests is the VALD 75th percentile (2026-09-25)

Dan's rule: on ForceFrame tests, Proficient is the VALD 75th percentile. There are two exceptions: a selected goal whose task needs more, or higher house norms for EM patients from Chris Hart, who is driving the ForceFrame integration.

- **Calf target:** re-anchored on VALD's ForceFrame seated plantarflexion norms (VALD Hub, pulled 2026-09-25), replacing Kanayama 2023.
  - The 75th percentile at 40–59 (pooled by VALD) is 1,116 N for men and 830 N for women.
  - Carried to 90 on the keep-training decline, that is about 0.70 × BW for a 180-lb man and 0.69 for a 145-lb woman.
  - Full distribution at 40–59 (25th / 50th / 75th / 90th): men 678 / 900 / 1,116 / 1,343 N; women 438 / 631 / 830 / 1,019 N. At 25 the 75th percentile is 1,333 N (men) and 1,080 N (women).
- **Stand-ins:** a stand-in for a 75th-percentile strength target now aims for its own PCA Proficient level for 80–90 on every goal. Test member A's goblet squat, for example, now aims for 15% BW; before, the position mapping put it at 9%.
- **VALD Hub norms are absolute force only.** No body-weight-relative norms exist; every other metric name was rejected.
- **Current PCA standards on the ForceFrame scale:**

  | Standard | Reference body weight | Force | VALD percentile |
  |---|---|---|---|
  | Calf, men, Proficient 1.8 × BW (40–50) | 84 kg | about 1,480 N | about the 95th |
  | Calf, men, Proficient 1.6 × BW (50–60) | 84 kg | — | about the 89th |
  | Calf, women, Proficient 1.45 × BW (40–50) | 68 kg | — | about the 86th |
  | Calf, women, Proficient 1.3 × BW (50–60) | 68 kg | — | about the 79th |
  | Knee extension, men, Proficient | 84 kg | — | 96th–97th (see 4.9.1) |
  | Knee extension, women, Proficient | 68 kg | — | 94th–95th |

- **Proposed for the PCA (pending Dan and Chris Hart):** grade ForceFrame tests by VALD percentile for age and sex, the way the PCA already grades hip ad/ab and shoulder rotation:
  - Proficient at or above the 75th;
  - Developing from the 25th to the 75th;
  - Deficient below the 25th.
  - VALD's ForceFrame norms stop at 59, so patients 60 and older need an age slope, as the report generator already uses for hip and shoulder.
- **Goal counts** for both test members and the demo patients are unchanged.

## Model 4.9.1: ForceFrame knee norms from the VALD Hub (2026-09-25)

The knee targets now anchor on VALD's own ForceFrame norms. They were pulled live from the VALD Hub on 2026-09-25: Health population, MaxForce, the same query contract the report generator uses. They replace the DynaMo handheld table used as a stand-in in 4.8.

| Test | VALD band | Men 75th | Women 75th | Anchor age |
|---|---|---|---|---|
| Knee extension, seated 90° | 40–59, pooled | 349 N | 247 N | 50 |
| Knee flexion, prone | men 50–59; women 40–59 | 198 N | 150 N | 55 men, 50 women |

- **VALD's bands:** knee extension is pooled across 40–59 for both sexes. Knee flexion has separate 40–49 and 50–59 bands for men and one 40–59 band for women. Norms stop at 59.
- **Full distributions pulled** (25th / 50th / 75th / 90th percentile):
  - knee extension at 40–59: men 204 / 265 / 349 / 434 N; women 137 / 188 / 247 / 319 N;
  - at 25: men's 75th percentile 412 N, women's 302 N.
- **New targets at 90:**
  - knee extension: 0.22 × BW for a 180-lb man and 0.21 for a 145-lb woman (was 0.29 / 0.26);
  - knee flexion: 0.13 (was 0.14 / 0.12).
- **ForceFrame reads well below DynaMo.** The DynaMo 60+ 75th percentile (396 N men) is higher than ForceFrame's 40–59 value (349 N). On the right device, test member B's knee extension is above the 90th percentile, not the 60th–70th estimated from DynaMo. That knee now clears at 90 with a 37% margin.
- **Katayama & Yamasaki's belt-fixed dynamometer reads about 2.5× ForceFrame.** Healthy men in their 40s–50s average 0.77 × BW there, against a ForceFrame median of about 0.31. Their stairs threshold (0.50) lands near 0.20 on ForceFrame, close to the new target.
- **The PCA knee standards look like they were set on a higher-reading device.**
  - On ForceFrame, PCA Proficient for men (0.65 × BW at 50–60 and 0.73 at 40–50, for an 84-kg man) sits at the 96th–97th percentile.
  - For women (0.55 and 0.61 at 68 kg) it sits at the 94th–95th.
  - If EM tests knee extension on ForceFrame, PCA "Proficient" currently means the top 5% of VALD's Health population.
- **Results:** test member A (knee judged via the goblet squat) and the demo patients' goal counts are unchanged.

## Model 4.9: sub-items, time-framed short-term goals and component audit (2026-09-25)

Dan's direction:
- The model should illustrate how training now protects quality of life later.
- Declines should be realistic by age, by current level and by the CD target age (80, 85 or 90).
- Short-term targets should be based on age and sex, with a sensible time frame, and should show their effect on the goals.
- Every component needs sub-items, so a goal never shows a missing variable when a related test was done.
- Each goal should be an itemized list, most important component first.

1. **Sub-items for every component.** After the component's own test and the projected stand-ins, each component falls back in order to:
   - **Rep and hold tests,** judged against the PCA Proficient standard for the patient's age today. They can't be projected to 90 reliably. Proficient is the same "strong for your age" level that the 75th-percentile targets build on: a 75th-percentile patient who keeps training lands on the target.
   - **Movement screens:** the goal is Proficient on the screen.
   - **Aerobic base estimated as 60% of VO₂max.** That is a conservative share: test member A's measured LT1 is 71% of VO₂max.

   | Component | Sub-items, in order |
   |---|---|
   | Knee extension | belt squat, chair stand, back squat, front squat, goblet squat; split squat, wall sit; squat quality |
   | Knee flexion | deadlift |
   | Hip abduction | side plank, Copenhagen; pelvic control on one leg |
   | Hip adduction | Copenhagen |
   | Calf strength | calf raises |
   | Grip | dead hang |
   | Rotator cuff | dumbbell external rotation; prone T |
   | Deadlift | kettlebell deadlift; Sorensen; hinge quality |
   | Suitcase carry | side plank, dead hang |
   | Loaded step-up | rear-foot-elevated split squat, split squat; single-leg step-down quality |
   | Step-down | single-leg step-down quality, split squat |
   | Sit-to-stand power and chair stand | each other; squat quality |
   | Overhead press | landmine press; push-ups |
   | Loaded row | inverted row, chin-ups |
   | Isometric bench | push-ups |
   | Pallof hold | side plank; standing rotation quality |
   | Hip flexion | squat quality, PRI squat, toe touch |
   | Ankle dorsiflexion | squat quality, PRI squat |
   | Knee flexion range | squat quality |
   | Straight-leg raise | toe touch |
   | Trunk rotation | standing rotation quality |
   | Hip extension range | gait quality |
   | Aerobic base | VO₂max estimate |

   - These components have no related test and still show as untested: shoulder flexion, upper-back extension, hip rotation and abduction range, pogo hops, rotational throw, jumps and VO₂max itself.
   - The PCA Proficient-by-age values not already in the tool come from the live Notion PCA Standards (checked 2026-09-24): split squat, inverted row, chin-ups, plank, wall sit, Copenhagen, prone T and rear-foot-elevated split squat.
2. **Each goal is an itemized list, most important first:** hard prerequisites first, then by weight.
   - Stand-ins say what they replace.
   - Untested components list every test that would count.
3. **Short-term goals have a time frame sized to the lift,** because training gains taper:
   - up to +10%: within a year;
   - up to +25%: 1–3 years;
   - up to +50%: 3–5 years;
   - beyond that: a long-term stretch.
   - Rep, hold and screen stand-ins get 1–3 years and show the gap in their own units (+21 reps), not a percentage.
4. **Age and sex context for aerobic goals:** VO₂max today and the goal are placed in EM's performance groups (Mandsager 2018 cut points by decade and sex, as in the patient report).
5. **Effect of the short-term goals.**
   - The overview says how many goals would be on track if the short-term goals are reached. A goal counts only when nothing is untested and no lift is a long-term stretch.
   - Each goal page says whether reaching the goals puts it on track, or which test remains a long-term stretch.
6. **Glide charts** add a grey line for "if training stops after reaching the goal": the general decline plus the first-year loss.
7. **Component audit (all 36 goals):**
   - Horseback riding adds hip adduction, since the inner thighs grip the horse.
   - The 10 km row adds knee extension, since most stroke power comes from the leg drive.
   - The other goals' components were judged relevant as set.
8. **Decline check (unchanged in this version).**
   - Rates rise with age and apply from the patient's current age to their own CD target age.
   - The rate doesn't depend on how strong the patient is today. Relative decline is broadly similar across baseline levels, so a higher level mostly buys a 10–20-year head start (research review, 2026-09-24).
   - Men's leg strength kept from 45 / 55 / 65 / 75 to age 90: 48 / 52 / 58 / 68% if they keep training, 30 / 33 / 39 / 50% if they stop. To age 80: 63 / 68 / 76 / 90% and 44 / 48 / 56 / 72%.

**Sniff test:**
- **Test member A:** 3 on track (floor rise, chair rise, carrying a child), 7 opportunities, 0 need more data. Reaching the short-term goals makes it 6.
  - VO₂max: 38 for the walk (+14%, 1–3 years), 40 for tennis (+19%, 1–3 years), 54 for the hike (+62%, a long-term stretch).
  - Aerobic base for the hike: +37%, 3–5 years.
  - Left calf raises: 6 now, 27 needed (Proficient for 50–59).
  - Single-leg step-down quality: Deficient now; the goal is Proficient.
  - Rotator cuff: dumbbell external rotation 13 lb (+4%, within a year).
- **Test member B:** 1 on track, 1 opportunity (the hike: VO₂max +7% and aerobic base +5%, both within a year), 8 need more data. Range of motion, loaded lifts, balance and hops aren't recorded.
- **Demo patients:** 0–7 on track today, 3–9 once the short-term goals are reached.

## Model 4.8: 75th-percentile strength targets, opportunities and short-term goals (2026-09-25)

Dan's direction, 2026-09-25:
- Grip targets for fixed loads are the same for men and women.
- Isolated muscle force tests use the VALD resources and age-projected decline for 75th-percentile targets.
- Targets should be a stretch but realistic. Sniff-test with two real members, kept local: a long-term member (test member A) and a top performer (test member B).
- Falling short on one test shouldn't read as "unable at 90". Show the glide path, and give every metric a short-term goal for the next 1–3 years.

1. **Isolated muscle force tests aim for the 75th percentile at 90.**
   - **Anchor:** the VALD 75th percentile in the oldest band VALD reports. Source: VALD Hub Normative Data Reports, Allied-Health population, captured 2026-06-16, in em-report-generator `data/vald-norms-library.json`.

     | Test | VALD band | Men | Women |
     |---|---|---|---|
     | Knee extension | DynaMo seated, 60+ | 396 N | 271 N |
     | Knee flexion | DynaMo prone, 60+ | 199 N | 126 N |
     | Hip abduction | ForceFrame, 50–60 | 373 N | 268 N |
     | Hip adduction | ForceFrame, 50–60 | 384 N | 270 N |
     | Shoulder external rotation | ForceFrame, 50–60 | 154 N | 93 N |
     | Grip | DynaMo, 60+ | 460 N | 275 N |

   - **Calf:** VALD's seated calf norms stop at 59, so calf uses the report generator's fallback. That is Kanayama 2023, ages 75+, mean + 0.674 SD: 1.08 × BW for men and 1.00 for women.
   - **Carried to 90 on the keep-training decline,** the same curve the patient is projected on. A patient at the 75th percentile in that band who keeps training lands exactly on the target.
     - The report generator carries the same anchors forward with Stoll 2000's cross-sectional slopes. Those are gentler than within-person decline.
     - Pairing them with a longitudinal patient projection would put the target above what even a 99th-percentile patient reaches. Test member B's hip abduction is an example: about the VALD 99th percentile.
   - **Divided by the patient's body weight,** because VALD norms are absolute force.
   - **One target per test for every goal.** There is no longer an everyday/demanding split.

   | Target at 90 | 180-lb man | 145-lb woman | Before |
   |---|---|---|---|
   | Knee extension | 0.29 × BW | 0.26 | 0.35 everyday, 0.45 demanding |
   | Knee flexion | 0.14 | 0.12 | 0.16 |
   | Hip abduction | 0.24 | 0.24 | 0.22–0.25 |
   | Shoulder external rotation | 0.11 | 0.08 | 0.15–0.16, no source |
   | Calf | 0.79 | 0.76 | 0.75 / 0.60 everyday, 1.05 / 0.85 demanding |
   | Grip | 63 lb | 37 lb | 60 / 35 (weakness cut-off) |

   - **Why the knee target moved.** The 0.35 / 0.45 thresholds came from Katayama & Yamasaki's belt-fixed dynamometer.
     - That device reads about 1.8× higher than VALD at the same age. Healthy men in their 80s average 0.49 there and about 0.26 on VALD.
     - On VALD, 0.35 at 90 sits around the 90th percentile for men and well above it for women, which is why almost nobody cleared it.
     - The new target is close to the level at which every one of Katayama's hospital patients managed stairs, once the scale difference is allowed for.
   - **Stand-ins** for these tests sit at the matching PCA 80–90 level, never below the Developing start. That start is where the VALD 75th percentile at 90 falls for knee strength.
2. **Grip for fixed loads is the same for men and women.**
   - This covers the dog walk (a 60-lb dog) and weapon handling (recoil). Target: the men's 75th percentile at 90, about 63 lb, which also covers a 60-lb dog's pull.
   - Every other grip target is general hand strength and uses the 75th percentile by sex.
3. **"Won't clear" is now "Opportunity."**
   - A goal is still on track only when every test clears at 90.
   - A projected shortfall is shown as an opportunity with a short-term goal, not a verdict.
   - Opportunity is amber, not red.
4. **A short-term goal (next 1–3 years) for every test.**
   - Formula: target ÷ the share kept from today to 90 on the keep-training line. For range of motion it is target + degrees lost.
   - The table shows "build to X" when today is below the goal and "hold at least X" when it is above.
   - Tracked rep and hold tests: Proficient for their age.
   - The clinician capacity table shows each measure's goal against the hardest target among the selected goals.
5. **Glide-path charts** appear on each goal page for tests projected short. Each chart shows three things:
   - today's path, red dashed;
   - the path after building to the short-term goal over about two years and then gliding on the same decline, green;
   - what the goal needs at 90.

**Sniff test (the default 10 goals):**
- **Test member A** (long-term member):
  - Model 4.7: 0 on track, 5 won't clear, 5 need data. Model 4.8: 0 on track, 5 opportunities, 5 need data.
  - Strength clears: deadlift, grip, and the goblet squat standing in for knee strength.
  - VO₂max is an opportunity. Short-term goals: 38 for the walk (+14%), 40 for tennis (+20%), 54 for the hike (+62%).
  - The other opportunities are aerobic base for the hike (32) and the dumbbell external rotation stand-in (13 lb, +5%).
- **Test member B** (top performer):
  - Model 4.7: 0 on track, 9 won't clear, 1 needs data. Model 4.8: 1 on track, 1 opportunity, 8 need data.
  - Every strength test on record clears at 90. The one shortfall is VO₂max for the mountain hike: short-term goal 59 (+7%).
  - The goals that need data are missing range of motion, loaded lifts, LT1, balance and hop RSI. None of these are in the member's records.
- **Demo patients:** 0–7 of 10 on track (model 4.7: 0–3).
- **All-Proficient synthetic patient:** 99 of 552 strength checks short (model 4.7: 180). Knee extension accounts for none of them (model 4.7: 81). The rest:
  - demanding-goal loaded tests set at the 80–90 Proficient standard;
  - fixed loads for lighter patients, including women's grip for the dog walk;
  - calf strength for Proficient women, about 4% short, because the published calf norm has a smaller sex gap than EM's PCA bands.

**Open:**
- The static VALD library has no ForceFrame knee norms. The knee anchors are DynaMo seated extension and prone flexion: same positions, different device. Pull the ForceFrame knee norms from the VALD Hub to replace them.
- The age mix of the DynaMo "60+" band is unknown. The anchor age is set at 65.
- At older ages, EM's PCA knee bands and VALD disagree. The PCA 80–90 Proficient standard for men is 0.45 × BW; the VALD 75th percentile carried to 90 is 0.29.
- Shoulder external rotation is entered as force ÷ body weight but labeled Nm/kg.

## Model 4.7: projections assume the patient keeps training (2026-09-24)

Dan replaced the 4.5 rule. Strength shouldn't assume people keep their level for age; it should decline from where they are now at the rate of someone who stays active, not sedentary. He approved four decisions.

1. **Red line: "if you keep training."** Training mostly sets the level, not the yearly rate. Masters lifters and trained groups lose about the same % per year as untrained people, from a higher start (Pearson 2002; Kennis 2013; Ireland 2022).
   - Strength: healthy-cohort slopes through the 60s (Alcazar 2023; Hughes 2001; Rantanen 1998), then about 2/3 of the general rate from 70 (Health ABC; active men in Newcastle 85+, Granic 2016).
   - Power: about twice the strength rate (Pearson 2002; Alcazar 2023). Reactive tests run at 1.2× power; there is no long-term data for them.
   - Sit-to-stand power and the 30-s chair stand: the 8-year cohort rate, about 1%/yr in the late 60s and 2%/yr from 75 (Baltasar-Fernandez 2026).
   - VO₂max: 0.7× the typical longitudinal rate (Fleg 2005). In HUNT, active adults lost 9% per decade and inactive adults 16% (Letnes 2020). LT1 runs at 0.75× the VO₂max rate.
   - Unchanged: balance follows published age norms (the PCA balance standards), and range of motion declines at half the typical rate (4.6).

   | Share kept from 55 to 90 | Keep training, men / women | Stop training, men / women | Model 4.4, men / women |
   |---|---|---|---|
   | Leg strength | 0.52 / 0.56 | 0.33 / 0.38 | 0.39 / 0.45 |
   | Grip and upper body | 0.57 / 0.55 | 0.40 / 0.45 | 0.47 / 0.54 |
   | Power | 0.41 / 0.44 | 0.28 / 0.33 | 0.33 / 0.39 |
   | Sit-to-stand power | 0.57 / 0.59 | 0.49 / 0.50 | n/a |
   | VO₂max | 0.62 / 0.66 | 0.43 / 0.46 | 0.50 / 0.55 |
   | LT1 | 0.70 / 0.73 | 0.51 / 0.54 | 0.60 / 0.64 |

2. **Knee-extension targets are set by the task, the same for men and women.** Body weight is already in the measure.
   - 0.35 × BW for everyday goals: chair rise, carrying a child, festival, chores, soft sand, gardening, bowling, cycling, 3-mile walk.
   - 0.45 × BW for stairs, getting up from the floor and demanding goals: floor rise, stairs with 25 lb, tennis, kicking, 5 km run, skiing.
   - Source: Katayama & Yamasaki 2017, Fig. 3. Among hospital rehab patients, 95% walked on their own at 0.35–0.39 × BW and all did above 0.40. Healthy people in their 80s average 0.49 (men) and 0.39 (women) (Table 1).
   - **Consequence: Proficient is the floor, not the finish line.** A Proficient 55-year-old man goes from 0.65 to 0.34 × BW at 90; a woman goes from 0.55 to 0.31. To clear everyday goals at 90, a 55-year-old needs about 0.67 (men) or 0.62 (women) now; demanding goals need about 0.86 and 0.80.
   - **Stand-in targets follow the knee target.** A stand-in (belt squat, chair stand, squats) now sits at the same point between the PCA 80–90 Developing start and Proficient as the target it stands in for. For men that is a third of the way for everyday goals and Proficient for demanding goals. For women it is Proficient for everyday goals and twice the Developing-to-Proficient step for demanding goals. Other stand-ins keep the old rule: Developing start for everyday goals, Proficient for demanding ones.

3. **Rep and hold tests are tracked, not scored.** Push-ups, inverted rows, chin-ups, split squats, calf raises, planks, side planks, Sorensen, wall sit, dead hang, Copenhagen and similar tests no longer decide goals or stand in for other tests. Against a fixed body-weight load, reps and hold times fall much faster than strength, by amounts that differ by muscle (Nuzzo 2024). So they can't be projected to 90 reliably. They stay on each goal as supporting measures, compared with the PCA standard for age at each re-test.
   - Where a goal had no strength test for that capacity, one was added at the same PCA 80–90 level as the rep test it replaces:
     - calf strength (isometric plantarflexion): festival, soft sand and 3-mile walk at 0.75 / 0.60 × BW (Developing start); 5 km run at 1.05 / 0.85 (Proficient);
     - loaded row: yacht, 500 m swim, 10 km row and kayak at 10 / 7% BW per hand (Developing start); ocean swim and surfing at 16 / 13% (Proficient);
     - isometric bench press: surfing at 1.65 / 1.20 × BW (Proficient).
   - Where the goal already had a strength test for that capacity, the rep or hold test now only supports it:
     - split squat for floor rise and bowling (knee strength decides);
     - Sorensen for carrying a child and the car seat (the deadlift decides);
     - dead hang for jars (grip decides);
     - side plank for horseback riding (hip strength decides);
     - wall sit for skiing (knee strength decides);
     - calf raise for dancing (calf strength decides).
   - Trunk holds (sexual expression, yacht, kayak, yoga, 10 km row) now only support. No strength test replaces them.
   - The 30-s chair stand still counts. It is a timed test that tracks sit-to-stand power.

4. **Grey line: "if you stop."** Each goal radar, test table and printed page now shows the same person at 90 if they stop training. The grey line does not change goal status.
   - About 15% of strength, power and aerobic fitness fades in the first year:
     - older adults lose 14–18% of strength by 5–7 months (Lemmer 2000; Henwood & Taaffe 2008);
     - trained men near 60 lose about 16% of VO₂max in 3 months, and the loss then levels off (Schulman 1996; Coyle 1984);
     - power is lost no faster than strength (Bosquet 2013 meta-analysis).
   - After that first year, decline follows the general-population rates of model 4.4, and never runs slower than the keep-training line.
   - Range of motion falls at the full typical rate.
   - Sit-to-stand keeps its cohort rate, since that cohort is already a general population.
   - Balance has no stop model, so the grey and red lines match.
   - Caveat: the detraining studies are small (7–38 people) and mostly newly trained. Long-term trainees probably keep more.

**Also in 4.7:**
- **Fixed-load reserve cap removed.** The 4.5 cap existed only for Dan's old rule. Targets are load × reserve ÷ body weight again. The change only matters for light patients: a 30-lb child with a 1.25 reserve is 31% of a 120-lb woman's body weight.
- **Grip for the dog walk and weapon handling stays 63 / 37 lb.** It is now justified as the 75th percentile at 90 rather than as a cap.
- **LT1 cap.** LT1 is capped at 85% of VO₂max projected on the same line; before, the cap used the typical VO₂max line.
- **Calibration check.** A synthetic patient exactly Proficient on every PCA test (ages 45, 55 and 65, both sexes) fails 180 of 552 strength checks:
  - knee extension: 81;
  - demanding-goal targets set at the 80–90 Proficient standard: calf, row, bench, step-up, step-down, the rotator-cuff stand-in, and the Pallof hold for the dog walk;
  - fixed loads for the lighter patient.
- **Demo patients.** They now read 0–3 of 10 goals on track, mostly limited by knee extension.
- **Open for Dan:**
  - Rotator-cuff targets (0.15–0.16 Nm/kg) have no published source and now fail most patients.
  - Grip targets for fixed external loads, such as the dog walk, differ by sex although the load doesn't.
- The tool reads 4.4–4.6 exports and recomputes them on 4.7.

## Model 4.6: range of motion declines at half the typical rate (2026-09-24)

Dan approved modeling ROM decline at half the typical rate.
- **Typical loss per decade** (Soucie 2011; Roach & Miles 1991; Stathokostas 2013; McBride 2026; thoracic values are expert estimates):

  | Measure | Before 70 | After 70 |
  |---|---|---|
  | Hip flexion | 1.5° | 6° |
  | Knee flexion | 1.5° | 3° |
  | Hip extension | 1° | 2° |
  | Hip IR, ER, abduction | 1.5° | 3° |
  | Shoulder flexion | 2° | 7° |
  | Thoracic rotation | 2° | 3° |
  | Thoracic extension | 1° | 2° |
  | Knee-to-wall | 0.5 cm (before 60) | 1.25 cm (after 60) |
  | Straight-leg raise | 0 | 0 |

- **The tool uses half these rates**, in degrees (cm for knee-to-wall), not percent. That is the assumption for a patient who keeps doing mobility work. The evidence doesn't back general activity here: it explains almost none of the variation in ROM loss, and targeted mobility work regains about 2–4° in trials of people aged 60–88. Grade C.
- **Consequence:** ROM that sits exactly at a target today now falls a few degrees short at 90. A patient needs that margin now to clear.
- **Measurement caveat:** clinic hip-flexion readings include about 15° of pelvic tilt compared with motion-capture task angles (Beneck 2018). ROM targets stay grade C until the protocol is matched.

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
- **Evidence caveat (documented, not modeled).** Longitudinal studies show untrained people lose rep counts, holds and balance faster than the PCA age bands imply: roughly 2× for push-ups and trunk holds, and 2–3× for single-leg stance. So for strength and movement tests the red line means "keeps the current level for age", which is what training aims for. Aerobic fitness follows typical decline. (Superseded by model 4.7.)
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
