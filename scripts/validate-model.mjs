#!/usr/bin/env node
import fs from 'node:fs/promises';
import vm from 'node:vm';

const dashboardPath=new URL('../index.html',import.meta.url);
const html=await fs.readFile(dashboardPath,'utf8');
const match=html.match(/<script>([\s\S]*?)<\/script>/);
if(!match)throw new Error('Inline dashboard script not found.');
const stopAt=match[1].indexOf('$("#tabSeg").addEventListener');
if(stopAt<0)throw new Error('Dashboard initialization marker not found.');

const source=`${match[1].slice(0,stopAt)}
globalThis.__MODEL__={
  ACTIVITIES,CATALOG,GOALS,METRICS,METRIC_GROUPS,PATIENT,BASELINE_METRICS,
  DECLINE_CURVES,FAMILY_BAND,FORECAST_EVIDENCE,MEASUREMENT_PROTOCOLS,
  TASK_DEMAND_EVIDENCE,TASK_GRADE_UNCERTAINTY,THRESHOLDS_AWAITING_CALIBRATION,MET_CONVENTION,
  components,scoreableReqs,supportReqs,modelInputCount,goalEvaluation,
  projectCapacity,resolveRequirement,buildPrintDoc,dashboardSnapshot,applyImportedData,
  setSelectedGoals(ids){selectedGoals=new Set(ids);},syncAge
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
const validZones=new Set(['clear','borderline','gap','incomplete','uncalibrated']);
const rows=[];

check(M.CATALOG.length===36,`Expected 36 canonical goals; found ${M.CATALOG.length}.`);
check(Object.keys(M.ACTIVITIES).length===36,`Expected 36 activity definitions; found ${Object.keys(M.ACTIVITIES).length}.`);
check(Object.keys(M.METRICS).length===83,`Expected 83 assessment metrics; found ${Object.keys(M.METRICS).length}.`);
check(M.MET_CONVENTION.mlKgMinPerMET===3.5,'Task-demand MET convention must remain the fixed adult 3.5 mL/kg/min value.');
check(Object.values(M.TASK_DEMAND_EVIDENCE).every(e=>['A','B','C'].includes(e.grade)),'Every Compendium task mapping must carry an A/B/C evidence grade.');
check(!/\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(/.test(html),'Dashboard must not transmit entered clinical data over the network.');
check(html.includes('role="tablist"')&&html.includes('aria-selected="true"'),'Dashboard navigation must expose accessible tab semantics.');
check(html.includes('exported JSON and PDFs contain the health data entered here'),'Builder must show the export privacy warning.');

const grouped=M.METRIC_GROUPS.flatMap(([,keys])=>keys);
for(const metric of Object.keys(M.METRICS))check(grouped.filter(key=>key===metric).length===1,`${metric}: must appear in exactly one assessment group.`);
for(const metric of grouped)check(!!M.METRICS[metric],`${metric}: grouped assessment metric is undefined.`);
for(const [metric,meta] of Object.entries(M.METRICS)){
  check(!!M.DECLINE_CURVES[meta.family],`${metric}: missing decline family ${meta.family}.`);
  check(!!M.FORECAST_EVIDENCE[meta.family],`${metric}: missing forecast evidence for ${meta.family}.`);
  if(meta.src?.startsWith('VALD'))check((meta.measurementSource||'').includes('·'),`${metric}: VALD measurement must name an explicit test protocol.`);
}
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
  rows.push({id:item.profile,complexity,inputs,gates:scoreable.filter(r=>r.role==='gate'||r.critical).length,scoreable:scoreable.length,support:support.length,modifiers:modifiers.length});
}

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

/* Representative input sets: every component and score must stay finite. */
for(const scenario of [{scale:1.2,sex:'male',age:52},{scale:1,sex:'female',age:57},{scale:.78,sex:'male',age:66},{scale:.72,sex:'female',age:72}]){
  M.PATIENT.sex=scenario.sex;M.PATIENT.age=scenario.age;M.PATIENT.marginalDecadeAge=90;M.PATIENT.bodyWeight_lb=scenario.sex==='female'?145:175;
  for(const [metric,value] of Object.entries(M.BASELINE_METRICS))M.PATIENT.metrics[metric]=typeof value==='number'?value*scenario.scale:value;
  M.syncAge();
  for(const item of M.CATALOG){const act=M.ACTIVITIES[item.profile],parts=M.components(act.reqs),ev=M.goalEvaluation(act,parts);check(validZones.has(ev.zone),`${item.profile}: invalid status ${ev.zone}.`);check(ev.score==null||finite(ev.score),`${item.profile}: non-finite readiness score.`);for(const part of parts)check(['raw','projRaw','projLo','projHi','req','projPct'].every(key=>finite(part[key])),`${item.profile}/${part.r.metric}: non-finite component output.`);}
}

/* Export/import round-trip and import filtering. */
const snapshot=JSON.parse(JSON.stringify(M.dashboardSnapshot()));
check(snapshot.modelVersion==='3.2','Export snapshot has the wrong model version.');
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
if(errors.length){console.error(`\nFAIL (${errors.length})`);for(const error of errors)console.error(`- ${error}`);process.exitCode=1;}
else console.log(`\nPASS · ${rows.length} goals · ${Object.keys(M.METRICS).length} metrics · fixed-demand, missing-data, scenario, export/import, and ${38}-page print checks`);
