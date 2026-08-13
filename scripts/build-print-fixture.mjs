#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const dashboardPath=new URL('../index.html',import.meta.url);
const html=await fs.readFile(dashboardPath,'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const style=html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if(!script||!style)throw new Error('Dashboard script or stylesheet not found.');
const scopeText=script.match(/scope:\(\)=>`([^`]+)`/)?.[1]||'Scope text unavailable.';
const stopAt=script.indexOf('$("#tabSeg").addEventListener');
if(stopAt<0)throw new Error('Dashboard initialization marker not found.');

const source=`${script.slice(0,stopAt)}
globalThis.__PRINT__={
  GOALS,PATIENT,BASELINE_METRICS,buildPrintDoc,
  selectAll(){selectedGoals=new Set(GOALS.map(g=>g.id));},
  setMode(mode){HERO=mode;}
};`;
const context={console,Math,Date,JSON,Set,Map,Object,Array,Number,String,Boolean,RegExp,isFinite,parseFloat,parseInt,Blob:class{},COPY:{scope:()=>scopeText}};
context.globalThis=context;
vm.runInNewContext(source,context,{filename:'index.inline.js'});
const model=context.__PRINT__;
model.PATIENT.name='Synthetic QA';
model.PATIENT.clinician='Release validation';
model.PATIENT.metrics=JSON.parse(JSON.stringify(model.BASELINE_METRICS));
model.selectAll();
model.setMode(process.argv[3]||'C');
const printDoc=model.buildPrintDoc();
const pageCount=(printDoc.match(/<section class="ppage/g)||[]).length;
if(pageCount!==39)throw new Error(`Expected 39 pages; generated ${pageCount}.`);
if(/\b(?:NaN|Infinity)\b/.test(printDoc))throw new Error('Print document contains a non-finite value.');

const outputPath=path.resolve(process.argv[2]||'tmp/print/cd-dashboard-full.html');
await fs.mkdir(path.dirname(outputPath),{recursive:true});
await fs.writeFile(outputPath,`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CD Dashboard synthetic print QA</title><style>${style}</style></head><body class="printing"><div id="printDoc" aria-hidden="false">${printDoc}</div></body></html>`);
console.log(`${pageCount}-page synthetic print fixture: ${outputPath}`);
