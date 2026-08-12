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
  CALIBRATION_BREADTH,DEPENDENCY_MAP,GOAL_AUDIT_REGISTER,DEMO_ARCHETYPES,
  components,scoreableReqs,supportReqs,supportComponents,modelInputCount,goalEvaluation,
  capacityTrajectories,capacitySummaryHTML,limiterSynthesis,
  projectCapacity,projectBandAt,resolveRequirement,buildPrintDoc,dashboardSnapshot,applyImportedData,
  reportModeHTML,archetypeMetrics,createArchetypePatient,
  setSelectedGoals(ids){selectedGoals=new Set(ids);},setReportMode(mode){HERO=mode;},
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
check(Object.keys(M.DEMO_ARCHETYPES).length===7,'Expected seven deterministic V4 demo archetypes.');
check(M.MET_CONVENTION.mlKgMinPerMET===3.5,'Task-demand MET convention must remain the fixed adult 3.5 mL/kg/min value.');
check(Object.values(M.TASK_DEMAND_EVIDENCE).every(e=>['A','B','C'].includes(e.grade)),'Every Compendium task mapping must carry an A/B/C evidence grade.');
check(!/\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(/.test(html),'Dashboard must not transmit entered clinical data over the network.');
check(html.includes('role="tablist"')&&html.includes('aria-selected="true"'),'Dashboard navigation must expose accessible tab semantics.');
check(html.includes('exported JSON and PDFs contain the health data entered here'),'Builder must show the export privacy warning.');

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
const lt1Headline=M.capacitySummaryHTML(M.capacityTrajectories(allGoals));
check(!/lt1|sustainable aerobic capacity/i.test(lt1Headline),'LT1 must not appear in headline capacity prioritization.');
check(html.includes('Clinician detail: all measured capacities'),'The report must retain the clinician capacity deep dive.');
const demoGoalIds=new Set(M.dashboardSnapshot().goals);
const demoHeadline=M.capacityTrajectories(allGoals.filter(g=>demoGoalIds.has(g.id))).filter(x=>x.metric!=='lt1_vo2');
const demoSummary=M.capacitySummaryHTML(demoHeadline);
check((demoSummary.match(/class="caprankitem"/g)||[]).length<=6,'Patient headline must show no more than three strengths and three opportunities.');
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
  const breadth=M.CALIBRATION_BREADTH[complexity],dimensions=new Set(scoreable.map(r=>r.group||r.cat)).size;
  const evalNow=M.goalEvaluation(act,M.components(act.reqs));
  check(!(evalNow.zone==='clear'&&dimensions<breadth),`${item.profile}: full clearance was granted with ${dimensions}/${breadth} calibrated dimensions.`);
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

/* Missing critical measurements and missing body weight cannot pass. */
for(const item of M.CATALOG){
  const act=M.ACTIVITIES[item.profile],gates=M.scoreableReqs(act).filter(r=>r.role==='gate'||r.critical);
  for(const gate of gates){const prior=M.PATIENT.metrics[gate.metric];M.PATIENT.metrics[gate.metric]=null;const ev=M.goalEvaluation(act,M.components(act.reqs));check(ev.zone==='incomplete',`${item.profile}: missing critical ${gate.metric} did not produce Incomplete.`);M.PATIENT.metrics[gate.metric]=prior;}
}
M.PATIENT.bodyWeight_lb=null;
for(const item of M.CATALOG){const act=M.ACTIVITIES[item.profile];if(M.scoreableReqs(act).some(r=>r.reqKind==='fixed_load_pctBW'))check(M.goalEvaluation(act,M.components(act.reqs)).zone==='incomplete',`${item.profile}: missing body weight did not produce Incomplete.`);}
M.PATIENT.bodyWeight_lb=original.bw;M.syncAge();

/* Seven deterministic archetypes: distinct vectors, status profiles, and headlines. */
const archetypeVectors=[],statusVectors=new Set(),headlineSets=new Set(),archetypeResults=[];
for(const key of Object.keys(M.DEMO_ARCHETYPES)){
  const patient=M.createArchetypePatient(key),vector=Object.entries(patient.metrics).filter(([,v])=>typeof v==='number').map(([,v])=>v);archetypeVectors.push(vector);M.setPatient(patient);
  const statuses=M.CATALOG.map(item=>M.goalEvaluation(M.ACTIVITIES[item.profile],M.components(M.ACTIVITIES[item.profile].reqs)).zone),statusCounts=statuses.reduce((a,z)=>(a[z]=(a[z]||0)+1,a),{});statusVectors.add(statuses.join('|'));
  const headline=M.capacitySummaryHTML(M.capacityTrajectories(allGoals));headlineSets.add([...headline.matchAll(/<b>(.*?)<\/b>/g)].map(x=>x[1]).join('|'));
  const priorities=M.limiterSynthesis(allGoals).slice(0,3).map(x=>x.metric);
  archetypeResults.push({key,statuses:Object.entries(statusCounts).map(([status,count])=>`${status}:${count}`).join(' · '),priorities:priorities.join(', ')||'none'});
  for(const item of M.CATALOG){const act=M.ACTIVITIES[item.profile],parts=M.components(act.reqs),ev=M.goalEvaluation(act,parts);check(validZones.has(ev.zone),`${key}/${item.profile}: invalid status ${ev.zone}.`);check(ev.score==null||finite(ev.score),`${key}/${item.profile}: non-finite readiness score.`);for(const part of parts)check(['raw','projRaw','projLo','projHi','req','projPct'].every(prop=>finite(part[prop])),`${key}/${item.profile}/${part.r.metric}: non-finite component output.`);}
}
for(let i=0;i<archetypeVectors.length;i++)for(let j=i+1;j<archetypeVectors.length;j++)check(archetypeVectors[i].some((v,k)=>Math.abs(v-archetypeVectors[j][k])>1e-9),`Archetype vectors ${i} and ${j} are identical.`);
for(const [key,profile] of Object.entries(M.DEMO_ARCHETYPES)){const factors=Object.values(profile.familyFactors).filter((v,i,a)=>a.indexOf(v)===i);check(key==='balanced'||factors.length>=4,`${key}: family pattern is too uniform.`);}
check(JSON.stringify(M.archetypeMetrics('balanced'))===JSON.stringify(M.BASELINE_METRICS),'Balanced archetype must preserve the origin/main sample measurements exactly.');
check(statusVectors.size>=4,`Demo goal-status vectors are insufficiently distinct (${statusVectors.size}/4).`);
check(headlineSets.size>=4,`Demo headline sets are insufficiently distinct (${headlineSets.size}/4).`);

/* Five modes must be structurally different and preserve their selected PDF mode. */
M.setPatient(M.createArchetypePatient('balanced'));M.setSelectedGoals(M.GOALS.map(g=>g.id));
const modes={C:'simple',A:'action',B:'trajectory',R:'capacity-wheel',D:'clinician-detail'},modeHTML=[];
for(const [mode,label] of Object.entries(modes)){const out=M.reportModeHTML(mode,allGoals);modeHTML.push(out);check(out.includes(`data-report-mode="${label}"`),`${label}: live mode marker missing.`);M.setReportMode(mode);const pdf=M.buildPrintDoc();check(pdf.includes(`data-report-mode="${label}"`)&&pdf.includes(`data-pdf-report-mode="${label}"`),`${label}: PDF did not preserve selected mode.`);check((pdf.match(/<section class="ppage/g)||[]).length===38,`${label}: full PDF fixture is not 38 pages.`);check(!pdf.includes('<div class="auditwrap">'),`${label}: PDF includes an overflow-prone live audit table.`);}
check(new Set(modeHTML).size===5,'Patient presentation modes are not structurally distinct.');

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

/* Late-life uncertainty must widen beyond the observed horizon. */
for(const family of ['aero','lower_strength','power','balance']){const h=M.EVIDENCE_HORIZONS[family],within=M.projectBandAt(100,family,'male',50,Math.max(55,h.extrapolationStartAge-1)),beyond=M.projectBandAt(100,family,'male',50,Math.min(105,h.extrapolationStartAge+15)),rel=a=>(a[1]-a[0])/Math.max(1e-9,(a[1]+a[0])/2);check(rel(beyond)>rel(within),`${family}: uncertainty did not widen beyond evidence horizon.`);}

/* Export/import round-trip and import filtering. */
const snapshot=JSON.parse(JSON.stringify(M.dashboardSnapshot()));
check(snapshot.modelVersion==='4.0','Export snapshot has the wrong model version.');
check(Object.keys(snapshot.metrics).length===Object.keys(M.PATIENT.metrics).length,'Export snapshot omitted assessment metrics.');
check(Array.isArray(snapshot.goals)&&snapshot.goals.length>0,'Export snapshot omitted selected goals.');
M.applyImportedData(snapshot);
check(M.PATIENT.name===snapshot.patient.name&&M.PATIENT.sex===snapshot.patient.sex,'Export/import round-trip changed patient identity fields.');
M.applyImportedData({patient:{name:'<bad> A',sex:'other',age:55,marginalDecadeAge:90,bodyWeight_lb:175},metrics:{vo2:Infinity,unknown_metric:123},goals:['walk-3mi','not-a-goal']});
check(!M.PATIENT.name.includes('<'),'Imported display text was not sanitized.');
check(M.PATIENT.metrics.vo2==null,'Non-finite imported metric was not rejected.');
check(!('unknown_metric' in M.PATIENT.metrics),'Unknown imported metric was not rejected.');

/* Full print document: cover + summary + all 36 goal pages. */
M.setSelectedGoals(M.GOALS.map(g=>g.id));
const printDoc=M.buildPrintDoc();
check((printDoc.match(/<section class="ppage/g)||[]).length===38,'Full print document must contain 38 pages (cover, summary, 36 goals).');
check(!/\b(?:NaN|Infinity)\b/.test(printDoc),'Full print document contains NaN or Infinity.');

console.log('Centenarian Decathlon model audit');
console.table(rows);
console.log('\nDemo archetypes');console.table(archetypeResults);
console.log('\nSensitivity');console.dir(sensitivity,{depth:4});
if(errors.length){console.error(`\nFAIL (${errors.length})`);for(const error of errors)console.error(`- ${error}`);process.exitCode=1;}
else console.log(`\nPASS · ${rows.length} goals · ${Object.keys(M.METRICS).length} metrics · 7 archetypes · 5 modes · sensitivity, calibration-breadth, evidence-horizon, fixed-demand, missing-data, export/import, and ${38}-page print checks`);
