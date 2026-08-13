#!/usr/bin/env node
import fs from 'node:fs/promises';
import vm from 'node:vm';

const dashboardPath=new URL('../index.html',import.meta.url);
const html=await fs.readFile(dashboardPath,'utf8');
const match=html.match(/<script>([\s\S]*?)<\/script>/);
if(!match)throw new Error('Inline dashboard script not found.');
const stopAt=match[1].indexOf('$("#tabSeg").addEventListener');
if(stopAt<0)throw new Error('Dashboard initialization marker not found.');
const demoStart=match[1].indexOf('const DEMO_ARCHETYPES=');
const demoEnd=match[1].indexOf('(function(){const ds=',demoStart);
if(demoStart<0||demoEnd<0)throw new Error('V4 demo archetype block not found.');

const source=`${match[1].slice(0,stopAt)}
${match[1].slice(demoStart,demoEnd)}
globalThis.__MODEL__={
  ACTIVITIES,CATALOG,GOALS,METRICS,METRIC_GROUPS,PATIENT,BASELINE_METRICS,
  DECLINE_CURVES,FAMILY_BAND,FORECAST_EVIDENCE,EVIDENCE_HORIZONS,MEASUREMENT_PROTOCOLS,
  TASK_DEMAND_EVIDENCE,TASK_GRADE_UNCERTAINTY,EXACT_PERFORMANCE_TASKS,THRESHOLDS_AWAITING_CALIBRATION,MET_CONVENTION,
  CALIBRATION_BREADTH,CALIBRATION_ELIGIBILITY_RULE,DEPENDENCY_MAP,GOAL_AUDIT_REGISTER,DEMO_ARCHETYPES,GRADE_OPTIONS,VALD_PERCENTILE_METRICS,EM_ASSESSMENT_BANDS,FOUNDATIONAL_SCREEN,
  components,scoreableReqs,supportReqs,supportComponents,calibrationEligibleRequirement,validatedDirectGate,modelInputCount,goalEvaluation,goalAuditRecord,currentGoalAuditRegister,
  capacityTrajectories,capacitySummaryHTML,limiterSynthesis,assessmentContext,supportPrioritySynthesis,foundationalPrioritySynthesis,trainingPrioritySynthesis,goalTrainingPrioritySynthesis,patientGoalOutlook,patientStory,foundationalSummaryHTML,goalPrioritiesHTML,trajectoryRowsHTML,capacityWheelDimensions,
  projectCapacity,projectBandAt,resolveRequirement,buildPrintDoc,dashboardSnapshot,applyImportedData,
  reportModeHTML,archetypeMetrics,createArchetypePatient,randomDemoPatient,
  setSelectedGoals(ids){selectedGoals=new Set(ids);},setReportMode(mode){HERO=mode;trajectoryExpanded=false;},setTrajectoryExpanded(value){trajectoryExpanded=!!value;},
  setPatient(patient){const copy=JSON.parse(JSON.stringify(patient));for(const key of Object.keys(PATIENT))delete PATIENT[key];Object.assign(PATIENT,copy);syncAge();},getPatient(){return PATIENT;},syncAge
};`;
const context={console,Math,Date,JSON,Set,Map,Object,Array,Number,String,Boolean,RegExp,isFinite,parseFloat,parseInt,Blob:class{},COPY:{scope:()=>''}};
context.globalThis=context;
vm.runInNewContext(source,context,{filename:'index.inline.js'});
const M=context.__MODEL__;
const errors=[];
const check=(condition,message)=>{if(!condition)errors.push(message);};
const finite=value=>Number.isFinite(Number(value));
const validRoles=new Set(['gate','capacity','support','modifier']);
const validReqKinds=new Set([undefined,null,'fixed_load_pctBW','aerobic_vo2','aerobic_lt1']);
const validZones=new Set(['clear','borderline','partial','gap','incomplete','uncalibrated']);
const rows=[];

check(M.CATALOG.length===36,`Expected 36 canonical goals; found ${M.CATALOG.length}.`);
check(Object.keys(M.ACTIVITIES).length===36,`Expected 36 activity definitions; found ${Object.keys(M.ACTIVITIES).length}.`);
check(Object.keys(M.METRICS).length===83,`Expected 83 assessment metrics; found ${Object.keys(M.METRICS).length}.`);
check(M.GOAL_AUDIT_REGISTER.length===36,'The machine-readable goal audit register must contain all 36 goals.');
check(M.CALIBRATION_ELIGIBILITY_RULE.minimumTaskDemandConfidence==='moderate'&&M.CALIBRATION_ELIGIBILITY_RULE.minimumMappingConfidence==='moderate','Calibration eligibility rule must require at least moderate task-demand and mapping confidence.');
check(Object.keys(M.DEMO_ARCHETYPES).length===7,'Expected seven deterministic V4 demo archetypes.');
check(M.MET_CONVENTION.mlKgMinPerMET===3.5,'Task-demand MET convention must remain the fixed adult 3.5 mL/kg/min value.');
check(Object.values(M.TASK_DEMAND_EVIDENCE).every(e=>['A','B','C'].includes(e.grade)),'Every Compendium task mapping must carry an A/B/C evidence grade.');
check(!/\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(/.test(html),'Dashboard must not transmit entered clinical data over the network.');
check(html.includes('role="tablist"')&&html.includes('aria-selected="true"'),'Dashboard navigation must expose accessible tab semantics.');
check(html.includes('exported JSON and PDFs contain the health data entered here'),'Builder must show the export privacy warning.');
const namedDemoBlock=html.slice(html.indexOf('const DEMO_ARCHETYPES='),html.indexOf('function randomDemoPatient'));
check(!/familyFactors|metricFactors/.test(namedDemoBlock),'Named demo code still contains factor-based derivation.');
check(!/Needs attention/.test(html),'Unsupported qualitative demo value remains.');
check(html.includes('demoGrades=GRADE_OPTIONS.slice(0,3)'),'Random demos must restrict qualitative grades to tested result values.');
check(html.includes('shown separately from goal priorities')&&html.includes('do not change a goal outlook')&&/do(?:es|) not predict injury/.test(html),'Assessment-priority pathways are not visibly separated from goal outlooks and injury prediction.');

const grouped=M.METRIC_GROUPS.flatMap(([,keys])=>keys);
for(const metric of Object.keys(M.METRICS))check(grouped.filter(key=>key===metric).length===1,`${metric}: must appear in exactly one assessment group.`);
for(const metric of grouped)check(!!M.METRICS[metric],`${metric}: grouped assessment metric is undefined.`);
const lt1Uses=Object.values(M.ACTIVITIES).flatMap(act=>(act.reqs||[]).filter(r=>r.metric==='lt1_vo2'));
check(!!M.METRICS.lt1_vo2&&grouped.includes('lt1_vo2'),'LT1 must remain available in the canonical clinician assessment library.');
check(lt1Uses.length>0&&lt1Uses.every(r=>r.role==='support'),'Every LT1 activity use must remain clinician-supporting rather than scoreable.');
check(Object.values(M.ACTIVITIES).every(act=>!M.scoreableReqs(act).some(r=>r.metric==='lt1_vo2')),'LT1 must not contribute to CD readiness scoring.');
for(const [metric,meta] of Object.entries(M.METRICS)){
  check(!!M.DECLINE_CURVES[meta.family],`${metric}: missing decline family ${meta.family}.`);
  check(!!M.FORECAST_EVIDENCE[meta.family],`${metric}: missing forecast evidence for ${meta.family}.`);
  if(meta.src?.startsWith('VALD'))check((meta.measurementSource||'').includes('·'),`${metric}: VALD measurement must name an explicit test protocol.`);
}
for(const [family,horizon] of Object.entries(M.EVIDENCE_HORIZONS)){
  check(!!horizon.observedAgeRange&&!!horizon.sourcePopulation&&!!horizon.supportedAgeBands&&!!horizon.sexSupport,`${family}: evidence horizon metadata is incomplete.`);
  check(finite(horizon.extrapolationStartAge)&&finite(horizon.uncertaintyMultiplier),`${family}: extrapolation controls are not finite.`);
}

const allGoals=M.GOALS.filter(g=>g.profileId);
const lt1Headline=M.capacitySummaryHTML(M.patientStory(allGoals));
check(!/lt1|sustainable aerobic capacity/i.test(lt1Headline),'LT1 must not appear in headline capacity prioritization.');
check(html.includes('Clinician detail: all measured capacities'),'The report must retain the clinician capacity deep dive.');
const demoGoalIds=new Set(M.dashboardSnapshot().goals);
const demoStory=M.patientStory(allGoals.filter(g=>demoGoalIds.has(g.id))),demoSummary=M.capacitySummaryHTML(demoStory);
check((demoSummary.match(/data-story-priority=/g)||[]).length<=3,'Simple patient headline must show no more than three goal priorities.');
check((demoSummary.match(/class="caprankitem"/g)||[]).length<=6,'Patient headline must remain concise.');
check(!/% retained|% of hardest calibrated need|Avg decline/i.test(demoSummary),'Patient headline must omit technical reserve and trajectory detail.');
const demoPrintSummary=M.buildPrintDoc().match(/<section class="ppage pp-summary">([\s\S]*?)<\/section>/)?.[1]||'';
check((demoPrintSummary.match(/class="scq qcat /g)||[]).length<=6,'PDF headline must show no more than three strengths and three opportunities.');
for(const metric of ['balanceSL_EO_s','balanceSL_EC_s']){
  check(!M.MEASUREMENT_PROTOCOLS[metric].startsWith('VALD'),`${metric}: seconds held must not be labeled as a VALD CoP result.`);
  check(M.MEASUREMENT_PROTOCOLS[metric].includes('enter weaker side')&&M.MEASUREMENT_PROTOCOLS[metric].includes('SOP approval pending'),`${metric}: timed-stance protocol must name the aggregation rule and approval state.`);
}
const balanceRequirement=M.ACTIVITIES['balance-30s'].reqs.find(r=>r.metric==='balanceSL_EO_s');
check(balanceRequirement?.req===30&&M.METRICS.balanceSL_EO_s.unit==='s','Single-leg balance must use a fixed 30-second target in seconds.');
check(M.projectCapacity(48,'balance','male',54,90,1)<48,'Single-leg balance must apply the balance-family age-decline model to seconds held.');
for(const metric of ['ankleDF_cm','shoulderFlexion_deg','thoracicExt_deg','thoracicRot_deg','hipFlexion_deg','hipIR_deg','hamstringSLR_deg'])check(M.METRICS[metric].family==='none',`${metric}: ROM must remain context-only until longitudinal calibration.`);

for(const item of M.CATALOG){
  const act=M.ACTIVITIES[item.profile];
  check(!!act,`${item.profile}: missing activity definition.`);
  if(!act)continue;
  const reqs=act.reqs||[],scoreable=M.scoreableReqs(act),support=M.supportReqs(act),modifiers=reqs.filter(r=>r.role==='modifier');
  const duplicated=[...new Set(reqs.map(r=>r.metric).filter(Boolean).filter((metric,index,all)=>all.indexOf(metric)!==index))];
  check(!duplicated.length,`${item.profile}: duplicate metrics ${duplicated.join(', ')}.`);
  for(const r of reqs){
    check(!!M.METRICS[r.metric],`${item.profile}: undefined metric ${r.metric}.`);
    check(validRoles.has(r.role),`${item.profile}/${r.metric}: invalid role ${r.role}.`);
    check(validReqKinds.has(r.reqKind),`${item.profile}/${r.metric}: invalid requirement kind ${r.reqKind}.`);
  }
  for(const r of scoreable){
    const resolved=M.resolveRequirement(r),meta=M.METRICS[r.metric];
    check(r.basis==='task'||r.basis==='research',`${item.profile}/${r.metric}: scoreable threshold has non-defensible basis ${r.basis}.`);
    check(!!(r.taskSource||r.src||r.evi),`${item.profile}/${r.metric}: scoreable threshold lacks a task source.`);
    check(resolved.req==null||resolved.unit===meta.unit,`${item.profile}/${r.metric}: resolved unit ${resolved.unit} does not match ${meta.unit}.`);
    if(r.reqKind?.startsWith('aerobic')){
      check(!!r.taskSource,`${item.profile}/${r.metric}: aerobic demand lacks Compendium mapping.`);
      check(['A','B','C'].includes(r.taskEvidenceGrade),`${item.profile}/${r.metric}: aerobic demand lacks a task-evidence grade.`);
      check((+r.demandUncertainty||0)>=(M.TASK_GRADE_UNCERTAINTY[r.taskEvidenceGrade]||.35),`${item.profile}/${r.metric}: demand uncertainty is too narrow for task evidence ${r.taskEvidenceGrade}.`);
    }
  }
  const inputs=M.modelInputCount(act),complexity=Number(act.complexity);
  const [min,max]=complexity<=2?[3,5]:complexity===3?[4,6]:[5,7];
  check(inputs>=min&&inputs<=max,`${item.profile}: complexity ${complexity} should use ${min}–${max} model inputs; found ${inputs}.`);
  const breadth=M.CALIBRATION_BREADTH[complexity];
  const evalNow=M.goalEvaluation(act,M.components(act.reqs));
  check(!(evalNow.zone==='clear'&&evalNow.calibratedDimensions<breadth),`${item.profile}: full clearance was granted with ${evalNow.calibratedDimensions}/${breadth} eligible observed dimensions.`);
  const auditNow=M.goalAuditRecord(M.GOALS.find(g=>g.id===item.profile));
  check(auditNow.calibrationStatus===evalNow.calibrationStatus&&auditNow.calibratedDimensions.join('|')===evalNow.eligibleObservedDimensions.join('|'),`${item.profile}: audit register and goal evaluation disagree on eligible observed dimensions.`);
  rows.push({id:item.profile,complexity,inputs,gates:scoreable.filter(r=>r.role==='gate'||r.critical).length,scoreable:scoreable.length,support:support.length,modifiers:modifiers.length});
}

/* Fixed-load multipliers and peak-to-sustained aerobic fractions are assumptions, not hidden constants. */
for(const [id,act] of Object.entries(M.ACTIVITIES))for(const r of act.reqs||[]){
  if(r.reqKind==='fixed_load_pctBW'){
    check(!!r.reserveAssumption&&r.reserveAssumption.sourceType==='Early Medical clinical assumption',`${id}/${r.metric}: fixed-load reserve must be a named clinical assumption.`);
    check(!('reserve' in (r.reqArgs||{})),`${id}/${r.metric}: reserve multiplier remains hidden in reqArgs.`);
    check((+r.demandUncertainty||0)>=.20,`${id}/${r.metric}: fixed-load uncertainty is too narrow.`);
  }
  if(r.reqKind==='aerobic_vo2')check(!!r.sustainableFractionAssumption&&r.sustainableFractionAssumption.sourceType==='Early Medical clinical assumption',`${id}/${r.metric}: sustainable fraction is not transparent.`);
}

/* Exact performance tasks must retain their direct distance/time or pace definition. */
check(M.ACTIVITIES['row-10k'].taskDemandValue===60&&M.ACTIVITIES['row-10k'].taskDemandFormula.includes('2.80'),'Row 10k must use Concept2 3:00/500 m = 60 W math.');
check(!/104 W|100–149 W/.test(M.ACTIVITIES['row-10k'].taskDemandFormula+M.ACTIVITIES['row-10k'].taskDemandSource+JSON.stringify(M.TASK_DEMAND_EVIDENCE['row-10k'])),'Legacy 104 W / 100–149 W row demand remains.');
check(M.ACTIVITIES['row-10k'].reqs.filter(r=>r.metric==='vo2'||r.metric==='lt1_vo2').every(r=>r.role==='support'),'Rower aerobic mapping must stay support-only without an individual erg-power conversion.');
for(const id of ['sprint-triathlon','walk-3mi','cycle-10mi','swim-500m','row-10k'])check(!!M.ACTIVITIES[id].taskDefinition&&!!M.ACTIVITIES[id].taskDemandFormula&&!!M.ACTIVITIES[id].taskDemandConfidence,`${id}: exact task definition audit is incomplete.`);

check([...M.THRESHOLDS_AWAITING_CALIBRATION].every(key=>{const [id,metric]=key.split('|');const r=M.ACTIVITIES[id]?.reqs?.find(x=>x.metric===metric);return r?.role==='support'&&r.req==null&&!r.critical;}),'A threshold awaiting calibration is still scoreable.');

/* Fixed tasks must not move when only age or sex changes. */
const original={sex:M.PATIENT.sex,age:M.PATIENT.age,target:M.PATIENT.marginalDecadeAge,bw:M.PATIENT.bodyWeight_lb};
for(const act of Object.values(M.ACTIVITIES))for(const r of M.scoreableReqs(act)){
  M.PATIENT.sex='male';M.PATIENT.age=40;M.PATIENT.marginalDecadeAge=90;const a=M.resolveRequirement(r).req;
  M.PATIENT.sex='female';M.PATIENT.age=75;M.PATIENT.marginalDecadeAge=100;const b=M.resolveRequirement(r).req;
  check((a==null&&b==null)||Math.abs(a-b)<1e-10,`${act.name}/${r.metric}: task demand changes with patient age or sex.`);
}
Object.assign(M.PATIENT,original);M.syncAge();

/* Calibration breadth is patient-specific, observed, and confidence-qualified. */
const calibrationBaseline=JSON.parse(JSON.stringify(M.getPatient()));
const breadthFixture={name:'Observed breadth fixture',complexity:4,reqs:[
  {cat:'Aerobic',label:'Aerobic capacity',metric:'vo2',unit:'mL/kg/min',dir:'higher_better',req:45,role:'capacity',weight:1,group:'aerobic',basis:'task',src:'fixture',taskDemandConfidence:'high',mappingConfidence:'high'},
  {cat:'Strength',label:'Loaded step-up',metric:'loadedStepup_pctBW',unit:'% BW',dir:'higher_better',req:25,role:'capacity',weight:.2,group:'strength',basis:'task',src:'fixture',taskDemandConfidence:'high',mappingConfidence:'high'}
]};
M.PATIENT.metrics.vo2=60;M.PATIENT.metrics.loadedStepup_pctBW=null;
const missingNoncritical=M.goalEvaluation(breadthFixture,M.components(breadthFixture.reqs));
check(missingNoncritical.zone==='partial'&&missingNoncritical.calibratedDimensions===1&&missingNoncritical.observedDimensions===1,'Missing noncritical measurement satisfied calibration breadth or escaped Partial.');
const lowConfidenceFixture={name:'Low-confidence breadth fixture',complexity:4,reqs:breadthFixture.reqs.map((r,index)=>index?{...r,mappingConfidence:'low'}:{...r})};
M.PATIENT.metrics.loadedStepup_pctBW=50;
const lowConfidence=M.goalEvaluation(lowConfidenceFixture,M.components(lowConfidenceFixture.reqs));
check(lowConfidence.zone==='partial'&&lowConfidence.calibratedDimensions===1&&lowConfidence.observedDimensions===2&&lowConfidence.ineligibleObservedDimensions.includes('strength'),'Low-confidence mapping independently satisfied full calibration breadth.');
const underCalibratedFixture={name:'Under-calibrated complex fixture',complexity:4,reqs:[
  {...breadthFixture.reqs[0],req:70},
  {...breadthFixture.reqs[1],mappingConfidence:'low'}
]};
const underCalibrated=M.goalEvaluation(underCalibratedFixture,M.components(underCalibratedFixture.reqs));
check(underCalibrated.zone==='partial'&&underCalibrated.word==='Partially calibrated'&&/aerobic dimension below target/.test(underCalibrated.cap),'Under-calibrated complex goal with one low contributor was labeled as an overall Gap or lost its subordinate finding.');
const directGateFixture={name:'Validated gate fixture',complexity:3,reqs:[
  {cat:'Balance',label:'Single-leg balance',metric:'balanceSL_EO_s',unit:'s',dir:'higher_better',req:30,role:'gate',critical:true,weight:1,group:'balance',basis:'task',src:'fixture',confidence:'direct',taskDemandConfidence:'high',mappingConfidence:'high'},
  {...breadthFixture.reqs[1],mappingConfidence:'low'}
]};
M.PATIENT.metrics.balanceSL_EO_s=10;
const directGateFailure=M.goalEvaluation(directGateFixture,M.components(directGateFixture.reqs));
check(directGateFailure.zone==='gap'&&directGateFailure.word==='Validated gate failure'&&/direct, confidence-qualified task gate/.test(directGateFailure.cap),'Direct validated gate failure was hidden by partial-calibration precedence.');
M.setPatient(calibrationBaseline);
const baselineAudit=M.currentGoalAuditRegister();
check(baselineAudit.length===36&&baselineAudit.every(r=>r.calibrationEligibilityRule===M.CALIBRATION_ELIGIBILITY_RULE.description),'Live GOAL_AUDIT_REGISTER does not document the exact confidence-qualified observed eligibility rule.');
check(baselineAudit.every(r=>{const act=M.ACTIVITIES[r.goalId],ev=M.goalEvaluation(act,M.components(act.reqs));return r.calibrationStatus===ev.calibrationStatus&&r.calibratedDimensions.join('|')===ev.eligibleObservedDimensions.join('|');}),'Live GOAL_AUDIT_REGISTER is not derived from the same eligible observed dimensions as scoring.');

/* Missing critical measurements and missing body weight cannot pass. */
for(const item of M.CATALOG){
  const act=M.ACTIVITIES[item.profile],gates=M.scoreableReqs(act).filter(r=>r.role==='gate'||r.critical);
  for(const gate of gates){const prior=M.PATIENT.metrics[gate.metric];M.PATIENT.metrics[gate.metric]=null;const ev=M.goalEvaluation(act,M.components(act.reqs));check(ev.zone==='incomplete',`${item.profile}: missing critical ${gate.metric} did not produce Incomplete.`);M.PATIENT.metrics[gate.metric]=prior;}
}
M.PATIENT.bodyWeight_lb=null;
for(const item of M.CATALOG){const act=M.ACTIVITIES[item.profile];if(M.scoreableReqs(act).some(r=>r.reqKind==='fixed_load_pctBW'))check(M.goalEvaluation(act,M.components(act.reqs)).zone==='incomplete',`${item.profile}: missing body weight did not produce Incomplete.`);}
M.PATIENT.bodyWeight_lb=original.bw;M.syncAge();

/* Seven deterministic archetypes: independent native-unit patients with diverse outputs. */
const archetypeVectors=[],statusVectors=new Set(),headlineSets=new Set(),strengthFirst=new Set(),opportunityFirst=new Set(),priorityFirst=new Set(),strengthSets=new Set(),opportunitySets=new Set(),prioritySets=new Set(),archetypeResults=[];
for(const key of Object.keys(M.DEMO_ARCHETYPES)){
  const profile=M.DEMO_ARCHETYPES[key],patient=M.createArchetypePatient(key),numericEntries=Object.entries(patient.metrics).filter(([,v])=>typeof v==='number'),vector=numericEntries.map(([,v])=>v);archetypeVectors.push(vector);M.setPatient(patient);
  check(profile.metrics&&typeof profile.metrics==='object'&&!('familyFactors' in profile)&&!('metricFactors' in profile),`${key}: named archetype must be an explicit native-unit patient, not a factor recipe.`);
  check(Object.keys(patient.metrics).length===Object.keys(M.BASELINE_METRICS).length,`${key}: native-unit profile must include every original sample measure.`);
  for(const [metric,value] of Object.entries(patient.metrics)){const meta=M.METRICS[metric];check(!!meta,`${key}: unknown metric ${metric}.`);if(meta?.kind==='grade')check(M.GRADE_OPTIONS.includes(value),`${key}/${metric}: illegal qualitative value ${value}.`);else check(finite(value)&&(meta.lo==null||value>=meta.lo)&&(meta.hi==null||value<=meta.hi),`${key}/${metric}: ${value} is outside legal native-unit range.`);}
  const statuses=M.CATALOG.map(item=>M.goalEvaluation(M.ACTIVITIES[item.profile],M.components(M.ACTIVITIES[item.profile].reqs)).zone),statusCounts=statuses.reduce((a,z)=>(a[z]=(a[z]||0)+1,a),{});statusVectors.add(statuses.join('|'));
  const traj=M.capacityTrajectories(allGoals),story=M.patientStory(allGoals,traj),headline=M.capacitySummaryHTML(story),strengthMetrics=story.topStrengths.map(x=>x.metric),opportunityMetrics=story.wholeBodyOpportunities.map(x=>x.metric).slice(0,3),priorityMetrics=story.topTrainingPriorities.map(x=>x.metric).slice(0,3);headlineSets.add([...headline.matchAll(/<b>(.*?)<\/b>/g)].map(x=>x[1]).join('|'));strengthSets.add(strengthMetrics.join('|'));opportunitySets.add(opportunityMetrics.join('|'));prioritySets.add(priorityMetrics.join('|'));if(strengthMetrics[0])strengthFirst.add(strengthMetrics[0]);if(opportunityMetrics[0])opportunityFirst.add(opportunityMetrics[0]);if(priorityMetrics[0])priorityFirst.add(priorityMetrics[0]);
  archetypeResults.push({key,statuses:Object.entries(statusCounts).map(([status,count])=>`${status}:${count}`).join(' · '),strengths:strengthMetrics.join(', ')||'none',opportunities:opportunityMetrics.join(', ')||'none',priorities:priorityMetrics.join(', ')||'none'});
  for(const item of M.CATALOG){const act=M.ACTIVITIES[item.profile],parts=M.components(act.reqs),ev=M.goalEvaluation(act,parts);check(validZones.has(ev.zone),`${key}/${item.profile}: invalid status ${ev.zone}.`);check(ev.score==null||finite(ev.score),`${key}/${item.profile}: non-finite readiness score.`);for(const part of parts)check(['raw','projRaw','projLo','projHi','req','projPct'].every(prop=>finite(part[prop])),`${key}/${item.profile}/${part.r.metric}: non-finite component output.`);}
}
for(let i=0;i<archetypeVectors.length;i++)for(let j=i+1;j<archetypeVectors.length;j++)check(archetypeVectors[i].some((v,k)=>Math.abs(v-archetypeVectors[j][k])>1e-9),`Archetype vectors ${i} and ${j} are identical.`);
check(JSON.stringify(M.archetypeMetrics('balanced'))===JSON.stringify(M.BASELINE_METRICS),'Balanced archetype must preserve the origin/main sample measurements exactly.');
check(statusVectors.size>=3,`Demo goal-status vectors are insufficiently distinct (${statusVectors.size}/3); stricter observed-breadth rules legitimately keep many complex goals Partial.`);
check(headlineSets.size>=4,`Demo headline sets are insufficiently distinct (${headlineSets.size}/4).`);
check(strengthSets.size>=5&&strengthFirst.size>=2,`Demo top strengths lack meaningful diversity (${strengthSets.size} sets; ${strengthFirst.size} first-ranked measures).`);
check(opportunitySets.size>=5&&opportunityFirst.size>=3,`Demo opportunities lack meaningful diversity (${opportunitySets.size} sets; ${opportunityFirst.size} first-ranked measures).`);
check(prioritySets.size>=4&&priorityFirst.size>=2,`Demo action priorities lack meaningful diversity (${prioritySets.size} sets; ${priorityFirst.size} first-ranked measures).`);
check(archetypeResults.filter(result=>result.strengths.split(', ').includes('relDeadlift_pctBW')).length<=5,'Fewer than two physiologically distinct demos omit deadlift from the strength headline.');
check([...M.GRADE_OPTIONS.slice(3)].every(code=>/^NT-/.test(code)),'Non-testing grade options must be explicit NT reason codes.');
for(let i=0;i<100;i++)for(const [metric,value] of Object.entries(M.randomDemoPatient().metrics))if(M.METRICS[metric]?.kind==='grade')check(M.GRADE_OPTIONS.slice(0,3).includes(value),`Random demo assigned non-testing result ${value} to ${metric}.`);

/* Five modes must be structurally different and preserve their selected PDF mode. */
M.setPatient(M.createArchetypePatient('balanced'));M.setSelectedGoals(M.GOALS.map(g=>g.id));
const modes={C:'simple',A:'action',B:'trajectory',R:'capacity-wheel',D:'clinician-detail'},modeHTML=[];
const canonicalStory=M.patientStory(allGoals),patientForbidden=/Partially calibrated|eligible observed dimensions|validated gate failure|mapping confidence|confidence-qualified observed dimensions/i;
const canonicalOrder=M.goalTrainingPrioritySynthesis(allGoals,M.capacityTrajectories(allGoals)).filter(item=>item.metric!=='lt1_vo2').slice(0,12).map(item=>item.metric);
check(JSON.stringify(canonicalStory.topTrainingPriorities.map(item=>item.metric))===JSON.stringify(canonicalOrder),'Patient story must preserve the first 12 items from the existing goal-priority synthesis ordering.');
const expectedPriorityMetrics=(mode,story)=>mode==='C'?story.topTrainingPriorities.slice(0,3).map(item=>item.metric):mode==='A'?story.topTrainingPriorities.map(item=>item.metric):mode==='B'?story.topTrainingPriorities.filter(item=>finite(item.raw)&&finite(item.projected)).slice(0,8).map(item=>item.metric):mode==='R'?M.capacityWheelDimensions(story).filter(item=>item.kind==='priority').map(item=>item.metric):[];
const expectedStrengthMetrics=(mode,story)=>mode==='C'||mode==='A'?story.topStrengths.map(item=>item.metric):mode==='R'?M.capacityWheelDimensions(story).filter(item=>item.kind==='strength').map(item=>item.metric):[];
const readStory=(out,kind)=>[...out.matchAll(new RegExp(`data-story-${kind}="([^"]+)"`,'g'))].map(match=>match[1]);
for(const [mode,label] of Object.entries(modes)){const out=M.reportModeHTML(mode,allGoals);modeHTML.push(out);check(out.includes(`data-report-mode="${label}"`),`${label}: live mode marker missing.`);if(mode!=='D'){const priorityRead=readStory(out,'priority'),strengthRead=readStory(out,'strength'),priorityExpected=expectedPriorityMetrics(mode,canonicalStory),strengthExpected=expectedStrengthMetrics(mode,canonicalStory);check(JSON.stringify(priorityRead)===JSON.stringify(priorityExpected),`${label}: displayed goal priorities changed the canonical order or presentation limit.`);check(JSON.stringify(strengthRead)===JSON.stringify(strengthExpected),`${label}: displayed strengths do not match this mode's canonical-story subset.`);for(const item of canonicalStory.wholeBodyOpportunities)check(out.includes(`data-story-foundation="${item.metric}"`),`${label}: canonical whole-body opportunity ${item.metric} is missing.`);check(!patientForbidden.test(out),`${label}: model-development language leaked into the patient view.`);check(/Highest-leverage priorities for your goals|Goal priorities/.test(out)&&/Whole-body opportunities to protect training capacity/.test(out),`${label}: goal priorities and whole-body opportunities are not visually separated.`);}M.setReportMode(mode);const pdf=M.buildPrintDoc();check(pdf.includes(`data-report-mode="${label}"`)&&pdf.includes(`data-pdf-report-mode="${label}"`),`${label}: PDF did not preserve selected mode.`);check((pdf.match(/<section class="ppage/g)||[]).length===39,`${label}: full PDF fixture is not 39 pages.`);check(pdf.includes('data-pdf-priority-section="full"'),`${label}: PDF omitted the dedicated full-priority section.`);check(!pdf.includes('<div class="auditwrap">'),`${label}: PDF includes an overflow-prone live audit table.`);if(mode!=='D')check(!patientForbidden.test(pdf),`${label}: model-development language leaked into the patient PDF.`);}
const actionHTML=M.reportModeHTML('A',allGoals),actionRanks=[...actionHTML.matchAll(/data-priority-rank="(\d+)"/g)].map(match=>+match[1]);
check(actionRanks.length<=12&&actionRanks.every((rank,index)=>rank===index+1),'Action must show up to 12 consecutive priorities without reordering.');
check(actionHTML.includes('data-priority-tier="highest"')&&(!canonicalStory.topTrainingPriorities[4]||actionHTML.includes('data-priority-tier="secondary"'))&&(!canonicalStory.topTrainingPriorities[8]||actionHTML.includes('data-priority-tier="monitor"')),'Action priority presentation tiers are incomplete.');
for(const item of canonicalStory.topTrainingPriorities){const count=item.goalIds?.length||item.goalsN||0;check(actionHTML.includes(`data-story-priority="${item.metric}" data-priority-rank=`)&&actionHTML.includes(`data-goal-count="${count}"`),`${item.metric}: Action rationale omitted its selected-goal count.`);check(actionHTML.includes(`data-priority-pathway="${item.pathway}"`),`${item.metric}: Action rationale omitted direct/support pathway context.`);if(item.assessmentContextText)check(actionHTML.includes(item.assessmentContextText),`${item.metric}: Action rationale omitted current assessment context.`);if(finite(item.projectedVulnerability))check(actionHTML.includes(`${Math.round(item.projectedVulnerability)}% modeled decline by ${M.getPatient().marginalDecadeAge}`),`${item.metric}: Action rationale omitted projected vulnerability.`);}
check(readStory(M.reportModeHTML('C',allGoals),'priority').length<=3,'Simple must remain limited to three goal priorities.');
check(M.capacityWheelDimensions(canonicalStory).length<=8,'Capacity Wheel must contain no more than eight axes.');
const trajectoryDefault=M.reportModeHTML('B',allGoals),trajectoryExpected=canonicalStory.topTrainingPriorities.filter(item=>finite(item.raw)&&finite(item.projected));
check(readStory(trajectoryDefault,'priority').length<=8,'Trajectory default must contain no more than eight goal priorities.');
if(trajectoryExpected.length>8){check(trajectoryDefault.includes('id="trajectoryToggle"')&&trajectoryDefault.includes('aria-expanded="false"'),'Trajectory must offer a control to reveal the remaining priorities.');M.setTrajectoryExpanded(true);const trajectoryFull=M.reportModeHTML('B',allGoals);check(JSON.stringify(readStory(trajectoryFull,'priority'))===JSON.stringify(trajectoryExpected.slice(0,12).map(item=>item.metric)),'Expanded Trajectory must reveal all available priorities up to 12 without reordering.');check(trajectoryFull.includes('aria-expanded="true"'),'Expanded Trajectory control state is not exposed.');M.setTrajectoryExpanded(false);}
check(new Set(modeHTML).size===5,'Patient presentation modes are not structurally distinct.');
check(/eligible observed dimensions|mapping confidence/i.test(M.reportModeHTML('D',allGoals)),'Clinician Detail lost exact calibration and mapping language.');
check(canonicalStory.topTrainingPriorities.every(item=>!canonicalStory.wholeBodyOpportunities.some(f=>f.metric===item.metric)||item.kind==='priority'),'Patient story pathways were not kept separate.');
for(const key of Object.keys(M.DEMO_ARCHETYPES)){M.setPatient(M.createArchetypePatient(key));const story=M.patientStory(allGoals);for(const mode of ['C','A','B','R']){const out=M.reportModeHTML(mode,allGoals);check(JSON.stringify(readStory(out,'priority'))===JSON.stringify(expectedPriorityMetrics(mode,story)),`${key}/${mode}: goal priorities do not match the mode-specific canonical subset.`);check(JSON.stringify(readStory(out,'strength'))===JSON.stringify(expectedStrengthMetrics(mode,story)),`${key}/${mode}: strengths do not match the mode-specific canonical subset.`);for(const item of story.wholeBodyOpportunities)check(out.includes(`data-story-foundation="${item.metric}"`),`${key}/${mode}: canonical foundation ${item.metric} is missing.`);check(!patientForbidden.test(out),`${key}/${mode}: model-development language leaked into the patient view.`);}}
M.setPatient(M.createArchetypePatient('balanced'));

/* Metric-to-goal sensitivity: only declared clearance dependencies may change. */
M.setPatient(M.createArchetypePatient('balanced'));
const sensitivity={};
for(const [metric,fraction] of Object.entries({vo2:.72,relDeadlift_pctBW:.20,loadedStepup_pctBW:.72,grip_lb:.72,balanceSL_EO_s:.72,cmjPower_WkG:.72})){
  const baseline=JSON.parse(JSON.stringify(M.getPatient())),before=Object.fromEntries(M.GOALS.map(g=>{const act=M.ACTIVITIES[g.id];return [g.id,M.goalEvaluation(act,M.components(act.reqs)).score];})),supportBefore=Object.fromEntries(M.GOALS.map(g=>[g.id,M.supportComponents(M.ACTIVITIES[g.id]).find(x=>x.r.metric===metric)?.proj??null]));
  const changed=JSON.parse(JSON.stringify(baseline));changed.metrics[metric]*=fraction;M.setPatient(changed);
  const after=Object.fromEntries(M.GOALS.map(g=>{const act=M.ACTIVITIES[g.id];return [g.id,M.goalEvaluation(act,M.components(act.reqs)).score];})),supportAfter=Object.fromEntries(M.GOALS.map(g=>[g.id,M.supportComponents(M.ACTIVITIES[g.id]).find(x=>x.r.metric===metric)?.proj??null]));
  const deps=M.DEPENDENCY_MAP[metric]||{clearanceGoals:[],supportGoals:[]},changedClearance=[];
  for(const g of M.GOALS){const declared=deps.clearanceGoals.includes(g.id),didChange=(before[g.id]==null)!=(after[g.id]==null)||(before[g.id]!=null&&Math.abs(before[g.id]-after[g.id])>1e-8);if(didChange)changedClearance.push(g.id);check(declared||!didChange,`${metric}: unrelated goal ${g.id} clearance score changed.`);}
  if(deps.clearanceGoals.length){const directResponded=deps.clearanceGoals.some(id=>{const act=M.ACTIVITIES[id],part=M.components(act.reqs).find(c=>c.r.metric===metric);return !!part&&finite(part.projPct);});check(changedClearance.length>0||directResponded,`${metric}: no declared clearance dependency responded.`);}
  if(deps.supportGoals.length)check(deps.supportGoals.some(id=>supportBefore[id]!=null&&Math.abs(supportBefore[id]-supportAfter[id])>1e-8),`${metric}: support profile did not respond.`);
  sensitivity[metric]={clearanceChanged:changedClearance,supportChanged:deps.supportGoals.filter(id=>supportBefore[id]!=null&&Math.abs(supportBefore[id]-supportAfter[id])>1e-8)};M.setPatient(baseline);
}
check(!(M.DEPENDENCY_MAP.vo2?.clearanceGoals||[]).includes('open-jars')&&!(M.DEPENDENCY_MAP.vo2?.clearanceGoals||[]).includes('balance-30s'),'VO₂ must not clear jar opening or single-leg balance.');
check(!(M.DEPENDENCY_MAP.relDeadlift_pctBW?.clearanceGoals||[]).includes('sprint-triathlon'),'Deadlift must not clear the 5 km goal.');
check((M.DEPENDENCY_MAP.loadedStepup_pctBW?.clearanceGoals||[]).includes('stairs-load'),'Loaded step-up must directly affect loaded stairs.');
check(!(M.DEPENDENCY_MAP.grip_lb?.clearanceGoals||[]).length,'Grip remains support/prioritization only; it must not grant readiness clearance.');
check((M.DEPENDENCY_MAP.balanceSL_EO_s?.clearanceGoals||[]).includes('balance-30s'),'Timed single-leg balance must directly affect the balance goal.');
check(!(M.DEPENDENCY_MAP.cmjPower_WkG?.clearanceGoals||[]).includes('open-jars'),'CMJ must not clear unrelated daily tasks.');
check(M.assessmentContext('grip_lb')?.kind==='percentile','Grip assessment context must use an entered age/sex-matched VALD percentile.');
const gripRaw=M.PATIENT.metrics.grip_lb,gripPct=M.PATIENT.assessmentPercentiles.grip_lb,gripContextBefore=M.assessmentContext('grip_lb');M.PATIENT.metrics.grip_lb=gripRaw*.5;const gripContextRawOnly=M.assessmentContext('grip_lb');check(gripContextRawOnly.percentile===gripPct&&gripContextRawOnly.deficit===gripContextBefore.deficit,'Raw VALD value must not be converted into an invented percentile.');M.PATIENT.metrics.grip_lb=gripRaw;
const stsContext=M.assessmentContext('stsPower_Wkg');check(stsContext?.kind==='native-band'&&/current-assessment band/.test(stsContext.label),'Early Medical native-unit band must be current-assessment context.');
for(const [metric,sexBands] of Object.entries(M.EM_ASSESSMENT_BANDS))for(const [sex,bands] of Object.entries(sexBands))for(const [band,values] of Object.entries(bands)){
  const probe=JSON.parse(JSON.stringify(M.getPatient())),[lo]=band.split('-').map(Number),proficient=values[2];probe.sex=sex;probe.age=lo+5;probe.metrics[metric]=proficient;M.setPatient(probe);const context=M.assessmentContext(metric);check(context?.level==='Proficient'&&context.deficit===0&&context.severity===0,`${metric}/${sex}/${band}: a Proficient EM result generated a foundational deficit.`);
}
M.setPatient(M.createArchetypePatient('balanced'));
const categoricalMetric='stsPower_Wkg',categoricalBaseline=JSON.parse(JSON.stringify(M.getPatient())),categoricalBand=M.EM_ASSESSMENT_BANDS[categoricalMetric][M.PATIENT.sex][`${Math.floor(M.PATIENT.age/10)*10}-${Math.floor(M.PATIENT.age/10)*10+10}`];
M.PATIENT.metrics[categoricalMetric]=categoricalBand[2];check(M.assessmentContext(categoricalMetric).level==='Proficient'&&M.assessmentContext(categoricalMetric).deficit===0,'Proficient EM tier did not produce zero foundational deficit.');
M.PATIENT.metrics[categoricalMetric]=categoricalBand[1];check(M.assessmentContext(categoricalMetric).level==='Developing'&&M.assessmentContext(categoricalMetric).deficit===45,'Developing EM tier did not produce categorical priority severity.');
M.PATIENT.metrics[categoricalMetric]=Math.min(...categoricalBand)-.01;check(M.assessmentContext(categoricalMetric).level==='Deficient'&&M.assessmentContext(categoricalMetric).deficit===100,'Deficient EM tier did not produce categorical priority severity.');
M.setPatient(categoricalBaseline);
const contextAge=M.PATIENT.age;M.PATIENT.age=92;M.syncAge();check(M.assessmentContext('stsPower_Wkg')==null,'Early Medical 80-90 band was silently extended beyond its age coverage.');M.PATIENT.age=contextAge;M.syncAge();

/* Support-priority sensitivity: measured context may reorder training, never clearance. */
const supportSensitivity={};M.setPatient(M.createArchetypePatient('balanced'));M.setSelectedGoals(M.GOALS.map(g=>g.id));
for(const metric of ['grip_lb','cmjPower_WkG','hopRSI','dropJump_RSI','kneeExt_xBW']){
  check(!(M.DEPENDENCY_MAP[metric]?.clearanceGoals||[]).length,`${metric}: support sensitivity requires a support-only metric.`);
  const baseline=JSON.parse(JSON.stringify(M.getPatient())),beforeClearance=Object.fromEntries(M.GOALS.map(g=>{const act=M.ACTIVITIES[g.id];return [g.id,M.goalEvaluation(act,M.components(act.reqs))];})),beforePriorities=M.supportPrioritySynthesis(allGoals),beforeItem=beforePriorities.find(x=>x.metric===metric),changed=JSON.parse(JSON.stringify(baseline));
  changed.metrics[metric]=Math.max(M.METRICS[metric].lo??0,changed.metrics[metric]*.55);if(M.VALD_PERCENTILE_METRICS.has(metric))changed.assessmentPercentiles[metric]=8;M.setPatient(changed);
  const afterClearance=Object.fromEntries(M.GOALS.map(g=>{const act=M.ACTIVITIES[g.id];return [g.id,M.goalEvaluation(act,M.components(act.reqs))];})),afterPriorities=M.supportPrioritySynthesis(allGoals),afterItem=afterPriorities.find(x=>x.metric===metric),beforeRank=beforePriorities.findIndex(x=>x.metric===metric),afterRank=afterPriorities.findIndex(x=>x.metric===metric);
  check(!!afterItem&&afterItem.priority>(beforeItem?.priority||0),`${metric}: poorer assessment context did not increase support priority.`);
  check(afterRank>=0&&(beforeRank<0||afterRank<beforeRank||afterItem.priority>(beforeItem?.priority||0)*1.25),`${metric}: changing measured support did not meaningfully change prioritization.`);
  for(const g of M.GOALS){const a=beforeClearance[g.id],b=afterClearance[g.id];check(a.zone===b.zone&&((a.score==null&&b.score==null)||(a.score!=null&&b.score!=null&&Math.abs(a.score-b.score)<1e-10)),`${metric}: support-only context changed ${g.id} clearance.`);}
  supportSensitivity[metric]={beforeRank:beforeRank<0?null:beforeRank+1,afterRank:afterRank+1,beforePriority:beforeItem?.priority||0,afterPriority:afterItem.priority};M.setPatient(baseline);
}
check(!/task threshold|pass\/fail|clearance/i.test(JSON.stringify(M.EM_ASSESSMENT_BANDS)),'Assessment context bands contain task-clearance semantics.');

/* Goal-independent foundation screen: marked shoulder weakness must surface without clearance effects. */
check(['shoulderER_NmKg','cuffExtRot_lb','ohPress_pctBW'].every(metric=>metric in M.FOUNDATIONAL_SCREEN),'Foundational screen does not cover the shoulder-strength pattern.');
M.setPatient(M.createArchetypePatient('balanced'));M.setSelectedGoals(['walk-3mi','balance-30s']);
const shoulderBaseline=JSON.parse(JSON.stringify(M.getPatient())),shoulderBefore=Object.fromEntries(['walk-3mi','balance-30s'].map(id=>{const act=M.ACTIVITIES[id];return [id,M.goalEvaluation(act,M.components(act.reqs))];})),shoulderChanged=JSON.parse(JSON.stringify(shoulderBaseline));
shoulderChanged.metrics.shoulderER_NmKg=.08;shoulderChanged.metrics.cuffExtRot_lb=3;shoulderChanged.metrics.ohPress_pctBW=4;shoulderChanged.assessmentPercentiles.shoulderER_NmKg=5;M.setPatient(shoulderChanged);
const shoulderFoundation=M.foundationalPrioritySynthesis(),shoulderPriorities=M.trainingPrioritySynthesis(M.GOALS.filter(g=>['walk-3mi','balance-30s'].includes(g.id))),shoulderMetrics=['shoulderER_NmKg','cuffExtRot_lb','ohPress_pctBW'],shoulderAfter=Object.fromEntries(['walk-3mi','balance-30s'].map(id=>{const act=M.ACTIVITIES[id];return [id,M.goalEvaluation(act,M.components(act.reqs))];}));
check(shoulderFoundation.some(item=>shoulderMetrics.includes(item.metric)&&item.severity>=60),'Marked shoulder weakness did not enter the goal-independent foundational screen.');
check(shoulderPriorities.slice(0,5).some(item=>shoulderMetrics.includes(item.metric)&&(item.pathway==='foundational'||item.pathway==='combined')),'Marked shoulder weakness did not reach What to work on first when selected goals had no shoulder dependency.');
check(/shoulder/i.test(M.foundationalSummaryHTML())&&M.foundationalSummaryHTML().includes('do not predict injury'),'Marked shoulder weakness is not summarized outside the Action-only priority list.');
const shoulderGoals=M.GOALS.filter(g=>['walk-3mi','balance-30s'].includes(g.id));for(const mode of ['C','A','B','R'])check(/Whole-body opportunities to protect training capacity/.test(M.reportModeHTML(mode,shoulderGoals))&&/shoulder/i.test(M.reportModeHTML(mode,shoulderGoals)),`Marked shoulder weakness is hidden in live ${mode} mode.`);check(/Foundational assessment concerns/.test(M.reportModeHTML('D',shoulderGoals)),`Marked shoulder weakness is hidden in live clinician detail.`);for(const mode of ['C','A','B','R','D']){M.setReportMode(mode);check(/shoulder/i.test(M.buildPrintDoc()),`Marked shoulder weakness is hidden in ${mode} PDF summary.`);}
check(['walk-3mi','balance-30s'].every(id=>{const a=shoulderBefore[id],b=shoulderAfter[id];return a.zone===b.zone&&((a.score==null&&b.score==null)||(a.score!=null&&b.score!=null&&Math.abs(a.score-b.score)<1e-10));}),'Goal-independent shoulder screen changed CD task clearance.');
check(!shoulderMetrics.some(metric=>(M.DEPENDENCY_MAP[metric]?.clearanceGoals||[]).some(id=>id==='walk-3mi'||id==='balance-30s')),'Shoulder screening test accidentally selected goals with shoulder clearance dependencies.');
const ntPatient=JSON.parse(JSON.stringify(shoulderBaseline));ntPatient.metrics.slControl_grade='NT-PAIN';ntPatient.metrics.hipHike_grade='NT-TIME';M.setPatient(ntPatient);const ntScreen=M.foundationalPrioritySynthesis();
check(ntScreen.some(item=>item.metric==='slControl_grade'&&item.context.kind==='clinical-review'&&item.pathway==='clinical-review'&&item.context.deficit==null),'NT-PAIN did not surface as a separate high-priority clinician-review finding.');
check(M.trainingPrioritySynthesis(M.GOALS.filter(g=>['walk-3mi','balance-30s'].includes(g.id))).slice(0,5).some(item=>item.metric==='slControl_grade'&&item.pathway==='clinical-review'),'NT-PAIN did not prioritize clinician review appropriately.');
check(/Clinician review findings/.test(M.foundationalSummaryHTML())&&/not performance deficiencies/.test(M.foundationalSummaryHTML()),'NT clinical-review state is not visibly separated from performance deficiency.');
check(!ntScreen.some(item=>item.metric==='hipHike_grade'),'NT-TIME was misclassified as a measured weakness or clinical-risk finding.');
M.setPatient(shoulderBaseline);M.setSelectedGoals(M.GOALS.map(g=>g.id));M.setReportMode('A');

/* Late-life uncertainty must widen beyond the observed horizon. */
for(const family of ['aero','lower_strength','power','balance']){const h=M.EVIDENCE_HORIZONS[family],within=M.projectBandAt(100,family,'male',50,Math.max(55,h.extrapolationStartAge-1)),beyond=M.projectBandAt(100,family,'male',50,Math.min(105,h.extrapolationStartAge+15)),rel=a=>(a[1]-a[0])/Math.max(1e-9,(a[1]+a[0])/2);check(rel(beyond)>rel(within),`${family}: uncertainty did not widen beyond evidence horizon.`);}
check(M.EVIDENCE_HORIZONS.power.baselineAgeRange==='19–68 years'&&/9\.6 years/.test(M.EVIDENCE_HORIZONS.power.followUpDuration)&&/not reported/.test(M.EVIDENCE_HORIZONS.power.oldestFollowUpAge)&&!/extrapolation starts 69/i.test(M.EVIDENCE_HORIZONS.power.observedAgeRange),'Power evidence horizon treats baseline age 68 as the end of longitudinal observation.');

/* Export/import round-trip and import filtering. */
const snapshot=JSON.parse(JSON.stringify(M.dashboardSnapshot()));
check(snapshot.modelVersion==='4.0','Export snapshot has the wrong model version.');
check(Object.keys(snapshot.metrics).length===Object.keys(M.PATIENT.metrics).length,'Export snapshot omitted assessment metrics.');
check(JSON.stringify(snapshot.assessmentPercentiles)===JSON.stringify(M.PATIENT.assessmentPercentiles),'Export snapshot omitted or changed assessment percentiles.');
check(Array.isArray(snapshot.goals)&&snapshot.goals.length>0,'Export snapshot omitted selected goals.');
M.applyImportedData(snapshot);
check(M.PATIENT.name===snapshot.patient.name&&M.PATIENT.sex===snapshot.patient.sex,'Export/import round-trip changed patient identity fields.');
check(JSON.stringify(M.PATIENT.assessmentPercentiles)===JSON.stringify(snapshot.assessmentPercentiles),'Export/import round-trip changed assessment percentiles.');
M.applyImportedData({patient:{name:'<bad> A',sex:'other',age:55,marginalDecadeAge:90,bodyWeight_lb:175},metrics:{vo2:Infinity,unknown_metric:123},goals:['walk-3mi','not-a-goal']});
check(!M.PATIENT.name.includes('<'),'Imported display text was not sanitized.');
check(M.PATIENT.metrics.vo2==null,'Non-finite imported metric was not rejected.');
check(!('unknown_metric' in M.PATIENT.metrics),'Unknown imported metric was not rejected.');

/* Full print document: cover + summary + full priorities + all 36 goal pages. */
M.setSelectedGoals(M.GOALS.map(g=>g.id));
const printDoc=M.buildPrintDoc();
check((printDoc.match(/<section class="ppage/g)||[]).length===39,'Full print document must contain 39 pages (cover, summary, priorities, 36 goals).');
const printPrioritySection=printDoc.match(/<section class="ppage pp-priorities">([\s\S]*?)<footer class="pfoot">/)?.[1]||'';
check((printPrioritySection.match(/data-story-priority=/g)||[]).length===Math.min(12,M.patientStory(allGoals).topTrainingPriorities.length),'Dedicated PDF section must contain the full goal-priority list up to 12.');
check((printPrioritySection.match(/class="action-gap"/g)||[]).length===Math.min(12,M.patientStory(allGoals).topTrainingPriorities.length),'Dedicated PDF section must retain selected-goal counts for every priority.');
check(!/data-story-foundation=/.test(printPrioritySection),'Foundational opportunities must not fill the dedicated goal-priority ranking.');
check(!/\b(?:NaN|Infinity)\b/.test(printDoc),'Full print document contains NaN or Infinity.');

console.log('Centenarian Decathlon model audit');
console.table(rows);
console.log('\nDemo archetypes');console.table(archetypeResults);
console.log('\nClearance dependency sensitivity');console.dir(sensitivity,{depth:4});
console.log('\nSupport-priority sensitivity');console.dir(supportSensitivity,{depth:4});
if(errors.length){console.error(`\nFAIL (${errors.length})`);for(const error of errors)console.error(`- ${error}`);process.exitCode=1;}
else console.log(`\nPASS · ${rows.length} goals · ${Object.keys(M.METRICS).length} metrics · 7 native-unit archetypes · 5 modes · 12-rank presentation tiers, trajectory expansion, headline diversity, clearance, goal-support and goal-independent foundational sensitivity, calibration-breadth, evidence-horizon, fixed-demand, missing-data, export/import, and ${39}-page print checks`);
