(function(){
"use strict";
const LOCAL_STATE_KEYS=[
  "tf_equity_metric","tf_risk_mode","tf_compound_months","tf_current_balance",
  "tf_current_risk_percent","tf_risk_overrides","tf_sl_type_selection"
];
const SCHEMA="tf_multi_analyst_export_v1";
const TF_MOBILE_IMPORT_LOADING_KEY="tf_mobile_import_loading_v8";
const TF_MOBILE_IMPORT_LOADING_DETAIL_KEY="tf_mobile_import_loading_detail_v8";
const TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY="tf_mobile_import_expected_trades_v8";
const TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY="tf_mobile_import_expected_analysts_v8";
const TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY="tf_mobile_import_expected_summary_rows_v8";
const TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY="tf_mobile_import_expected_score_v8";

function tfMobileGetImportOverlay(){
  let el=document.getElementById("tf-mobile-import-loading");
  if(el)return el;
  el=document.createElement("div");
  el.id="tf-mobile-import-loading";
  el.className="tf-mobile-import-loading";
  el.setAttribute("role","status");
  el.setAttribute("aria-live","polite");
  el.innerHTML=`
    <div class="tf-mobile-import-loading-card">
      <div class="tf-mobile-import-spinner" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="tf-mobile-import-loading-title">Memuat Data</div>
      <div id="tf-mobile-import-loading-message" class="tf-mobile-import-loading-message">Menyiapkan import…</div>
      <div class="tf-mobile-import-loading-bar" aria-hidden="true"><i></i></div>
      <div id="tf-mobile-import-loading-detail" class="tf-mobile-import-loading-detail">Mohon tunggu. Jangan tutup aplikasi.</div>
    </div>`;
  document.body.appendChild(el);
  return el;
}
function tfMobileShowImportLoading(message,detail){
  const el=tfMobileGetImportOverlay();
  const msg=el.querySelector("#tf-mobile-import-loading-message");
  const det=el.querySelector("#tf-mobile-import-loading-detail");
  if(msg&&message)msg.textContent=message;
  if(det&&detail)det.textContent=detail;
  document.documentElement.classList.add("tf-mobile-import-busy");
  el.classList.add("show");
}
function tfMobileUpdateImportLoading(message,detail){
  const el=tfMobileGetImportOverlay();
  const msg=el.querySelector("#tf-mobile-import-loading-message");
  const det=el.querySelector("#tf-mobile-import-loading-detail");
  if(msg&&message)msg.textContent=message;
  if(det&&detail)det.textContent=detail;
}
function tfMobileHideImportLoading(){
  const el=document.getElementById("tf-mobile-import-loading");
  if(el)el.classList.remove("show");
  document.documentElement.classList.remove("tf-mobile-import-busy");
  try{
    sessionStorage.removeItem(TF_MOBILE_IMPORT_LOADING_KEY);
    sessionStorage.removeItem(TF_MOBILE_IMPORT_LOADING_DETAIL_KEY);
    sessionStorage.removeItem(TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY);
    sessionStorage.removeItem(TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY);
    sessionStorage.removeItem(TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY);
    sessionStorage.removeItem(TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY);
  }catch(e){}
}
function tfMobileResumeImportLoadingIfNeeded(){
  let shouldResume=false,detail="Menyiapkan data hasil import.";
  try{
    shouldResume=sessionStorage.getItem(TF_MOBILE_IMPORT_LOADING_KEY)==="1";
    detail=sessionStorage.getItem(TF_MOBILE_IMPORT_LOADING_DETAIL_KEY)||detail;
  }catch(e){}
  if(!shouldResume)return false;
  tfMobileShowImportLoading("Menyiapkan dashboard…",detail);
  return true;
}
function tfMobileFinishImportLoadingWhenReady(){
  let shouldFinish=false;
  try{shouldFinish=sessionStorage.getItem(TF_MOBILE_IMPORT_LOADING_KEY)==="1";}catch(e){}
  if(!shouldFinish)return;
  const intVal=(key,fallback=0)=>{try{const n=parseInt(sessionStorage.getItem(key)||"",10);return Number.isFinite(n)&&n>=0?n:fallback;}catch(e){return fallback;}};
  const expectedTrades=intVal(TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY,0);
  const expectedAnalysts=intVal(TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY,0);
  const expectedSummaryRows=intVal(TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY,0);
  const expectedScoreRecords=intVal(TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY,0);
  const started=Date.now();
  const count=selector=>{try{return document.querySelectorAll(selector).length;}catch(e){return 0;}};
  const check=()=>{
    const summaryRows=count("#summary-table tbody tr");
    const perfRows=count("#tf-perf-body-left tr")+count("#tf-perf-body-right tr");
    const monthlyRows=count("#monthly-body tr:not(.monthly-total-row)");
    const historyRows=count("#history-table tbody tr:not(.tf-start-balance-row)");
    const scoreRows=count("#tf-score-summary-body .tf-score-summary-row");
    const appReady=document.body.classList.contains("tf-mobile-app");
    const states=[
      ["Table 1",expectedSummaryRows>0?summaryRows>0:true],
      ["Performance",expectedAnalysts>0?perfRows>0:true],
      ["Table 2",expectedSummaryRows>0?monthlyRows>0:true],
      ["Table 3",expectedTrades>0?historyRows>0:true],
      ["Table 4",expectedScoreRecords>0?scoreRows>0:true]
    ];
    const required=states.filter(([name])=>name!=="Table 4"||expectedScoreRecords>0);
    const pending=required.filter(([,ok])=>!ok).map(([name])=>name);
    if(appReady&&required.every(([,ok])=>ok)){
      tfMobileUpdateImportLoading("Data siap","Semua tabel sudah selesai dimuat.");
      setTimeout(tfMobileHideImportLoading,250);
      return;
    }
    const elapsed=Date.now()-started;
    if(elapsed>2500&&typeof window.tfMobileRecoverRenderV31==="function")window.tfMobileRecoverRenderV31("loader");
    if(elapsed>10000){
      tfMobileUpdateImportLoading("Data import sudah tersimpan",pending.length?`Menutup loading. ${pending.join(", ")} akan dirender ulang otomatis.`:"Dashboard siap digunakan.");
      setTimeout(tfMobileHideImportLoading,250);
      return;
    }
    setTimeout(check,180);
  };
  check();
}
window.tfMobileShowImportLoading=tfMobileShowImportLoading;
window.tfMobileUpdateImportLoading=tfMobileUpdateImportLoading;
window.tfMobileHideImportLoading=tfMobileHideImportLoading;
window.tfMobileResumeImportLoadingIfNeeded=tfMobileResumeImportLoadingIfNeeded;
window.tfMobileFinishImportLoadingWhenReady=tfMobileFinishImportLoadingWhenReady;

function clone(v,f){try{return JSON.parse(JSON.stringify(v));}catch(e){return f;}}
function storageGet(keys){return new Promise(r=>chrome.storage.local.get(keys,x=>r(x||{})));}
function storageSet(o){return new Promise((resolve,reject)=>{window.__TF_MOBILE_STORAGE_LAST_ERROR="";chrome.storage.local.set(o,()=>{const err=(window.__TF_MOBILE_STORAGE_LAST_ERROR||"").trim();if(err){reject(new Error("Gagal menyimpan data import: "+err));return;}resolve();});});}
function status(msg,ok){const el=document.getElementById("tf-mobile-import-status");if(!el)return;el.textContent=msg||"";el.className="tf-mobile-import-status "+(ok===true?"ok":ok===false?"bad":"");}
function historyKey(it){try{const norm=v=>String(v==null?"":v).trim().replace(/\s+/g," ");const numlike=v=>{const raw=norm(v);if(!raw)return"";const n=Number(raw.replace(/,/g,""));return Number.isFinite(n)?String(Math.round(n*100000)/100000):raw.toLowerCase();};const analyst=norm(it&&it.analyst).toLowerCase();const pair=norm(it&&it.pair).toUpperCase();const created=norm((it&&(it.createdSortKey!=null?it.createdSortKey:it.createdDate))||"").toLowerCase();const closed=norm((it&&(it.sortKey!=null?it.sortKey:it.displayDate))||"").toLowerCase();const signalId=norm(it&&it.signalId).toLowerCase();if(signalId)return [analyst,pair,created,closed,"signal:"+signalId].join("|");return [analyst,pair,created,closed,"entry:"+numlike(it&&it.entry),"type:"+norm(it&&it.type).toLowerCase()].join("|");}catch(e){return"";}}
function completeness(it){if(!it||typeof it!=="object")return 0;let n=0;Object.keys(it).forEach(k=>{const v=it[k];if(v!==null&&v!==undefined&&String(v).trim()!=="")n++;});return n;}
function mergeHistory(a,b){const map=new Map();const put=it=>{if(!it||typeof it!=="object")return;const k=historyKey(it)||JSON.stringify(it),prev=map.get(k);if(!prev){map.set(k,{...it});return;}const base=completeness(it)>completeness(prev)?{...prev,...it}:{...it,...prev};Object.keys(prev).forEach(x=>{if(base[x]==null||String(base[x]).trim()==="")base[x]=prev[x];});Object.keys(it).forEach(x=>{if(base[x]==null||String(base[x]).trim()==="")base[x]=it[x];});map.set(k,base);};(Array.isArray(a)?a:[]).forEach(put);(Array.isArray(b)?b:[]).forEach(put);return [...map.values()];}
function mergeScore(a,b){const map=new Map();const put=it=>{if(!it||typeof it!=="object")return;const k=[String(it.analyst||it.analystName||"").trim().toLowerCase(),String(it.pair||"").trim().toUpperCase(),String(it.displayDate||it.date||it.sortKey||"").trim(),String(it.score||it.value||"").trim()].join("|");map.set(k,map.has(k)?{...map.get(k),...it}:{...it});};(Array.isArray(a)?a:[]).forEach(put);(Array.isArray(b)?b:[]).forEach(put);return [...map.values()];}
function mergeMonthly(a,b){const out=clone(a&&typeof a==="object"?a:{},{});const src=b&&typeof b==="object"?b:{};Object.keys(src).forEach(k=>{out[k]={...(out[k]&&typeof out[k]==="object"?out[k]:{}),...clone(src[k]&&typeof src[k]==="object"?src[k]:{},{})};});return out;}
function mergeObjects(a,b){return {...(clone(a&&typeof a==="object"?a:{},{})||{}),...(clone(b&&typeof b==="object"?b:{},{})||{})};}
function combine(payloads,names){const list=payloads.filter(x=>x&&typeof x==="object");if(!list.length)throw new Error("Tidak ada file valid.");const first=list[0].storage&&typeof list[0].storage==="object"?list[0].storage:list[0];let out={...(first||{})};out.tfHistorySignals=Array.isArray(first.tfHistorySignals)?first.tfHistorySignals.slice():[];out.tfScoreHistory=Array.isArray(first.tfScoreHistory)?first.tfScoreHistory.slice():[];out.tfMonthlyStats=mergeMonthly({},first.tfMonthlyStats);["tfNoDataPairs","tfAvgSlPips","tfAnalystSources","tfAnalystNameCacheByUrl"].forEach(k=>{out[k]=mergeObjects({},first[k]);});for(let i=1;i<list.length;i++){const src=list[i].storage&&typeof list[i].storage==="object"?list[i].storage:list[i];out.tfHistorySignals=mergeHistory(out.tfHistorySignals,src.tfHistorySignals);out.tfScoreHistory=mergeScore(out.tfScoreHistory,src.tfScoreHistory);out.tfMonthlyStats=mergeMonthly(out.tfMonthlyStats,src.tfMonthlyStats);["tfNoDataPairs","tfAvgSlPips","tfAnalystSources","tfAnalystNameCacheByUrl"].forEach(k=>out[k]=mergeObjects(out[k],src[k]));Object.keys(src||{}).forEach(k=>{if(!(k in out))out[k]=clone(src[k],src[k]);});}return {schema:SCHEMA,exportedAt:new Date().toISOString(),combined:list.length>1,combinedFileCount:list.length,combinedFiles:names.slice(),exportedBy:list[0].exportedBy||null,exportedByList:list[0].exportedByList||[],localState:clone(list[0].localState||{},{}),storage:out};}

function tfMobileFirstFiniteV31(){for(let i=0;i<arguments.length;i++){const raw=arguments[i];if(raw===null||raw===undefined||raw==='')continue;const n=typeof raw==='number'?raw:Number(String(raw).replace(/,/g,'').trim());if(Number.isFinite(n))return n;}return null;}
function tfMobileArrayV31(value){if(Array.isArray(value))return value.slice();if(!value||typeof value!=='object')return [];for(const k of ['items','rows','data','results','signals','history'])if(Array.isArray(value[k]))return value[k].slice();const vals=Object.values(value);return vals.length&&vals.every(v=>v&&typeof v==='object')?vals:[];}
function tfMobileNormalizeHistoryV31(value){return tfMobileArrayV31(value).map((row,idx)=>{if(!row||typeof row!=='object')return null;const out={...row};const analyst=String(row.analyst??row.analystName??row.name??row.channelName??row.trader??'').trim();const pair=String(row.pair??row.symbol??row.ticker??row.instrument??'').trim().toUpperCase();const pips=tfMobileFirstFiniteV31(row.pips,row.pnlPips,row.profitPips,row.resultPips,row.closedPips,row.pip,row.pipResult);if(analyst)out.analyst=analyst;if(pair)out.pair=pair;if(pips!==null)out.pips=pips;if(out.displayDate==null||String(out.displayDate).trim()==='')out.displayDate=row.closedDate??row.closedAt??row.date??row.closeTime??'';if(out.createdDate==null||String(out.createdDate).trim()==='')out.createdDate=row.createdAt??row.openedAt??row.openDate??row.entryTime??'';if(out.sortKey==null&&row.closedAt){const t=Date.parse(String(row.closedAt));if(Number.isFinite(t))out.sortKey=t;}if(out.createdSortKey==null&&row.createdAt){const t=Date.parse(String(row.createdAt));if(Number.isFinite(t))out.createdSortKey=t;}if(!out.signalId&&row.id!=null)out.signalId=String(row.id);out.__tfMobileImportIndexV31=idx;return out;}).filter(row=>row&&row.analyst&&row.pair&&Number.isFinite(Number(row.pips)));}
function tfMobileBuildSourcesFromHistoryV31(history,existing){const out=existing&&typeof existing==='object'&&!Array.isArray(existing)?clone(existing,{}):{};for(const row of history){const name=String(row&&row.analyst||'').trim();const pair=String(row&&row.pair||'').trim().toUpperCase();if(!name||!pair)continue;if(!out[name]||typeof out[name]!=='object')out[name]={url:'',pairs:[]};if(!Array.isArray(out[name].pairs))out[name].pairs=[];if(!out[name].pairs.map(x=>String(x).toUpperCase()).includes(pair))out[name].pairs.push(pair);}return out;}
function tfMobileNormalizeStorageV31(input){const st=input&&typeof input==='object'?clone(input,{}):{};const historyCandidate=st.tfHistorySignals??st.historySignals??st.tfHistory??st.history??st.signals;const history=tfMobileNormalizeHistoryV31(historyCandidate);st.tfHistorySignals=history;st.tfAnalystSources=tfMobileBuildSourcesFromHistoryV31(history,st.tfAnalystSources??st.analystSources);st.tfMonthlyStats=(st.tfMonthlyStats&&typeof st.tfMonthlyStats==='object')?st.tfMonthlyStats:{};st.tfScoreHistory=tfMobileArrayV31(st.tfScoreHistory??st.scoreHistory);st.tfNoDataPairs=(st.tfNoDataPairs&&typeof st.tfNoDataPairs==='object')?st.tfNoDataPairs:{};st.tfAvgSlPips=(st.tfAvgSlPips&&typeof st.tfAvgSlPips==='object')?st.tfAvgSlPips:{};return st;}
async function tfMobileReadBackV31(){return storageGet(['tfHistorySignals','tfAnalystSources','tfMonthlyStats','tfScoreHistory']);}
async function tfMobileRecoverRenderV31(reason){try{const data=await tfMobileReadBackV31();const history=Array.isArray(data.tfHistorySignals)?data.tfHistorySignals:[];const sources=data.tfAnalystSources&&typeof data.tfAnalystSources==='object'?data.tfAnalystSources:{};if(!history.length&&!Object.keys(sources).length)return false;const historyRows=()=>document.querySelectorAll('#history-table tbody tr:not(.tf-start-balance-row)').length;const summaryRows=()=>document.querySelectorAll('#summary-table tbody tr').length;if(historyRows()>0||summaryRows()>0)return true;try{if(typeof selectedAnalystPairsMapStats!=='undefined')selectedAnalystPairsMapStats=null;if(typeof selectedAnalystPairsMapHistory!=='undefined')selectedAnalystPairsMapHistory=null;if(typeof selectedAnalystsGlobal!=='undefined')selectedAnalystsGlobal=null;}catch(_){}if(typeof loadFromChromeStorageIfAvailable==='function')loadFromChromeStorageIfAvailable();await new Promise(r=>setTimeout(r,350));if(historyRows()>0||summaryRows()>0)return true;try{if(typeof rebuildAnalystListFromSources==='function')rebuildAnalystListFromSources();if(typeof setupAnalystTickerFilter==='function')setupAnalystTickerFilter();if(typeof applyAnalystPairFilterAll==='function')applyAnalystPairFilterAll();if(typeof recomputeHistoryRows==='function')recomputeHistoryRows();if(typeof renderSummaryTable==='function')renderSummaryTable();}catch(e){console.warn('TF Mobile V31 manual render recovery warning',reason,e);}return historyRows()>0||summaryRows()>0;}catch(e){console.warn('TF Mobile V31 render recovery failed',reason,e);return false;}}
window.tfMobileRecoverRenderV31=tfMobileRecoverRenderV31;

async function applyPayload(payload,fileNames){if(!payload||typeof payload!=="object")throw new Error("Format file tidak valid.");const rawStorage=payload.storage&&typeof payload.storage==="object"?payload.storage:payload;const st=tfMobileNormalizeStorageV31(rawStorage);const defaults={tfMonthlyStats:{},tfHistorySignals:[],tfScoreHistory:[],tfNoDataPairs:{},tfAvgSlPips:{},tfAnalystSources:{}};Object.keys(defaults).forEach(k=>{if(!(k in st))st[k]=defaults[k];});st.tfSelectedTimeRange=st.tfSelectedTimeRange||"all_time";st.tfLastImportMeta={importedAt:new Date().toISOString(),fileName:fileNames.length===1?fileNames[0]:"",files:fileNames.slice(),combined:fileNames.length>1,exportedBy:payload.exportedBy||null,exportedByList:Array.isArray(payload.exportedByList)?payload.exportedByList:[]};window.__TF_MOBILE_SILENT_STORAGE_SET=true;try{await storageSet(st);}finally{window.__TF_MOBILE_SILENT_STORAGE_SET=false;}const verify=await tfMobileReadBackV31();const savedHistory=Array.isArray(verify.tfHistorySignals)?verify.tfHistorySignals:[];const savedSources=verify.tfAnalystSources&&typeof verify.tfAnalystSources==='object'?verify.tfAnalystSources:{};if(st.tfHistorySignals.length>0&&savedHistory.length===0)throw new Error('Data history sudah diproses tetapi gagal dibaca kembali dari storage Mobile.');if(st.tfHistorySignals.length>0&&Object.keys(savedSources).length===0)throw new Error('Data analis gagal dibaca kembali setelah import.');if(payload.localState&&typeof payload.localState==="object"){LOCAL_STATE_KEYS.forEach(k=>{if(Object.prototype.hasOwnProperty.call(payload.localState,k)){const v=payload.localState[k];if(v==null||v==="")localStorage.removeItem(k);else localStorage.setItem(k,String(v));}});}}

async function importFiles(files){if(!files.length)return;const started=performance.now();const payloads=[];const fileNames=files.map(f=>f.name);tfMobileShowImportLoading(files.length>1?`Membaca ${files.length} file…`:"Membaca file JSON…",files.length>1?"Menyiapkan data untuk digabungkan.":(fileNames[0]||"Menyiapkan data."));status("Membaca data…");try{for(let i=0;i<files.length;i++){const f=files[i];tfMobileUpdateImportLoading(files.length>1?`Membaca file ${i+1} dari ${files.length}…`:"Membaca file JSON…",f.name);const txt=await f.text();tfMobileUpdateImportLoading(files.length>1?`Memproses file ${i+1} dari ${files.length}…`:"Memproses data JSON…","Mengurai history, analyst, dan statistik.");status(files.length>1?`Membaca file ${i+1}/${files.length}…`:"Memproses JSON…");await new Promise(resolve=>requestAnimationFrame(resolve));const p=JSON.parse(txt);if(p.schema&&p.schema!==SCHEMA)console.warn("Schema berbeda:",p.schema);payloads.push(p);}tfMobileUpdateImportLoading(payloads.length>1?"Menggabungkan data…":"Menyiapkan data…","Menghindari duplikasi dan menyiapkan storage.");status(payloads.length>1?"Menggabungkan data…":"Menyimpan data…");await new Promise(resolve=>requestAnimationFrame(resolve));const payload=payloads.length>1?combine(payloads,fileNames):payloads[0];const normalizedStorage=tfMobileNormalizeStorageV31(payload&&payload.storage&&typeof payload.storage==='object'?payload.storage:payload);if(payload&&payload.storage&&typeof payload.storage==='object')payload.storage=normalizedStorage;else Object.assign(payload,normalizedStorage);const trades=Array.isArray(normalizedStorage.tfHistorySignals)?normalizedStorage.tfHistorySignals.length:0;if(!trades)throw new Error('JSON terbaca, tetapi tidak ditemukan History Signal yang valid. Pastikan file berasal dari Export Data TF Multi-Analyst Desktop.');const analystSources=normalizedStorage.tfAnalystSources&&typeof normalizedStorage.tfAnalystSources==="object"?normalizedStorage.tfAnalystSources:{};const expectedAnalysts=Object.keys(analystSources).length;let expectedSummaryRows=0;Object.values(analystSources).forEach(source=>{const pairs=source&&Array.isArray(source.pairs)?source.pairs:[];expectedSummaryRows+=Math.max(1,pairs.length);});if(expectedSummaryRows<=0&&expectedAnalysts>0)expectedSummaryRows=expectedAnalysts;const scoreSource=normalizedStorage.tfScoreHistory;const expectedScoreRecords=Array.isArray(scoreSource)?scoreSource.length:(scoreSource&&typeof scoreSource==="object"?Object.keys(scoreSource).length:0);try{sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY,String(trades));sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY,String(expectedAnalysts));sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY,String(expectedSummaryRows));sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY,String(expectedScoreRecords));}catch(e){}tfMobileUpdateImportLoading("Menyimpan data…",`${trades.toLocaleString("id-ID")} trade sedang disiapkan.`);await applyPayload(payload,fileNames);const elapsed=Math.max(0,(performance.now()-started)/1000);status(`Import selesai • ${trades.toLocaleString("id-ID")} trade • ${elapsed.toFixed(1)} dtk`,true);tfMobileUpdateImportLoading("Membangun dashboard…","Menyiapkan Table 1, Performance, Table 2, Equity, Table 3, dan Table 4.");try{sessionStorage.setItem(TF_MOBILE_IMPORT_LOADING_KEY,"1");sessionStorage.setItem(TF_MOBILE_IMPORT_LOADING_DETAIL_KEY,`${trades.toLocaleString("id-ID")} trade sedang ditampilkan.`);}catch(e){}setTimeout(()=>location.reload(),180);}catch(e){tfMobileUpdateImportLoading("Import gagal",e&&e.message?String(e.message):"File tidak dapat diproses.");setTimeout(tfMobileHideImportLoading,900);throw e;}}
async function clearData(){if(!confirm("Hapus semua data import di perangkat ini?"))return;await new Promise(r=>chrome.storage.local.clear(()=>r()));LOCAL_STATE_KEYS.forEach(k=>localStorage.removeItem(k));location.reload();}
function mountControls(){if(document.getElementById("tf-mobile-data-controls"))return true;const section=document.getElementById("section-summary");if(!section)return false;const box=document.createElement("section");box.id="tf-mobile-data-controls";box.className="tf-mobile-data-controls";box.innerHTML=`<div class="tf-mobile-import-row"><button id="tf-mobile-import-btn" type="button">Import JSON</button><button id="tf-mobile-clear-btn" type="button">Hapus Data</button><input id="tf-mobile-import-input" type="file" accept=".json,application/json,text/json,text/plain,application/octet-stream" multiple hidden></div><div id="tf-mobile-import-status" class="tf-mobile-import-status"></div>`;section.insertBefore(box,section.firstChild);const input=box.querySelector("#tf-mobile-import-input");box.querySelector("#tf-mobile-import-btn").onclick=()=>input.click();box.querySelector("#tf-mobile-clear-btn").onclick=()=>clearData();input.onchange=async()=>{const files=[...(input.files||[])];input.value="";try{await importFiles(files);}catch(e){status(e&&e.message?e.message:String(e),false);}};return true;}
const timer=setInterval(()=>{if(mountControls())clearInterval(timer);},120);setTimeout(()=>clearInterval(timer),15000);
[450,1200,2600,5200].forEach(ms=>setTimeout(()=>tfMobileRecoverRenderV31('boot-'+ms),ms));
try{chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes&&(changes.tfHistorySignals||changes.tfAnalystSources))setTimeout(()=>tfMobileRecoverRenderV31('storage-change'),80);});}catch(_){}
})();
