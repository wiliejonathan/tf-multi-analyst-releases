(() => {
'use strict';
// REV393 SIDEBAR: latest-month risk severity, COLOR ONLY, NO ICON.
const H='tf-sidebar-risk-healthy', W='tf-sidebar-risk-warning', C='tf-sidebar-risk-critical';
let state={byAnalyst:new Map(),byPair:new Map(),monthKey:''};
const normA=v=>String(v||'').normalize('NFKC').replace(/[\u200B-\u200D\u2060\uFEFF]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const normP=v=>String(v||'').trim().toUpperCase();
function ts(r){
  if(!r)return null;
  const n=Number(r.sortKey); if(Number.isFinite(n)&&n>0)return n;
  const raw=String(r.displayDate||r.closedDate||r.createdDate||'').replace(/\s*WIB\s*$/i,'').trim();
  let m=/^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(raw);
  if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime();
  const d=Date.parse(raw); return Number.isFinite(d)?d:null;
}
function mk(t){const d=new Date(t);return Number.isFinite(d.getTime())?(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')):'';}
function tf_monthKeyFromSortKey(t){return mk(t);}
function compute(hist){
const historySignals=hist;let __tfLatestRiskState={signature:'',byPair:new Map(),byAnalyst:new Map()};
function tf_latestRiskNormAnalyst(v) {
let raw=String(v || '');
try { raw=raw.normalize('NFKC'); } catch (e) { }
raw=raw
.replace(/[\u200B-\u200D\u2060\uFEFF]/g,'')
.replace(/^\s*[✓!×]\s*/,'')
.replace(/\s*·\s*(?:CRITICAL|WARNING|HEALTHY)\b.*$/i,'')
.replace(/\s+/g,' ')
.trim();
raw=raw.replace(/\s*\((?:[A-Z]{6}|XAUUSD|XAGUSD|US30|NAS100|BTCUSD|ETHUSD)\)\s*$/i,'');
raw=raw.replace(/\s+-\s+(?:[A-Z]{6}|XAUUSD|XAGUSD|US30|NAS100|BTCUSD|ETHUSD)\s*$/i,'');
return raw.toLowerCase();
}
function tf_latestRiskNormPair(v) {
return String(v || '').trim().toUpperCase();
}
function tf_latestRiskRowTs(row) {
try {
if (!row) return null;
const k = Number(row.sortKey);
if (Number.isFinite(k) && k > 0) return k;
if (typeof tf_parseHistoryTableDateMs === 'function') {
const t = tf_parseHistoryTableDateMs(row.displayDate || row.closedDate || row.createdDate || '');
if (Number.isFinite(t) && t > 0) return t;
}
const d = Date.parse(String(row.displayDate || row.closedDate || row.createdDate || ''));
return Number.isFinite(d) ? d : null;
}
catch (e) { return null; }
}
function tf_latestRiskMonthKey(ts) {
try {
if (typeof tf_monthKeyFromSortKey === 'function') {
const mk = tf_monthKeyFromSortKey(ts);
if (mk) return String(mk);
}
const d = new Date(ts);
if (!Number.isFinite(d.getTime())) return '';
return String(d.getFullYear()) + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
catch (e) { return ''; }
}
function tf_refreshLatestRiskState(force) {
try {
const src=Array.isArray(historySignals)?historySignals:[];
let maxTs = null;
let fingerprint=2166136261;
for (let i = 0; i < src.length; i++) {
const r = src[i];
if (!r || r.isWithdraw || !String(r.analyst || '').trim() || !String(r.pair || '').trim()) continue;
const value=JSON.stringify([r.analyst,r.pair,r.pips,r.sortKey,r.displayDate,r.closedDate,r.createdDate]);
for(let j=0;j<value.length;j++) fingerprint=Math.imul(fingerprint^value.charCodeAt(j),16777619);
const ts = tf_latestRiskRowTs(r);
if (ts == null) continue;
if (maxTs == null || ts > maxTs) maxTs = ts;
}
const latestMonth = maxTs == null ? '' : tf_latestRiskMonthKey(maxTs);
// REV415: newest data month plus its three preceding calendar months (ALL data).
const newestIndex = latestMonth ? Number(latestMonth.slice(0,4))*12 + Number(latestMonth.slice(5,7))-1 : null;
const oldestIndex = newestIndex == null ? null : newestIndex-3;
const windowStartMonth = oldestIndex == null ? '' : String(Math.floor(oldestIndex/12)) + '-' + String(oldestIndex%12+1).padStart(2,'0');
const signature = String(src.length) + '|' + String(maxTs || 0) + '|' + latestMonth + '|' + fingerprint;
if (!force && __tfLatestRiskState && __tfLatestRiskState.signature === signature) return __tfLatestRiskState;
const byPair = new Map();
const groups = new Map();
if (latestMonth) {
for (let i = 0; i < src.length; i++) {
const r = src[i];
if (!r || r.isWithdraw) continue;
const analyst = String(r.analyst || '').trim();
const pair = tf_latestRiskNormPair(r.pair);
if (!analyst || !pair) continue;
const ts = tf_latestRiskRowTs(r);
if (ts == null) continue;
let pips = (typeof r.pips === 'number') ? r.pips : parseFloat(r.pips);
if (!Number.isFinite(pips)) continue;
const key = tf_latestRiskNormAnalyst(analyst) + '|' + pair;
if (!groups.has(key)) groups.set(key, { analyst, pair, rows:[] });
groups.get(key).rows.push({ ts, pips });
}
}
groups.forEach((g, key) => {
g.rows.sort((a,b) => a.ts - b.ts);
// REV433: reference history excludes all four newest calendar months.
const recentRow=r=>{const month=tf_latestRiskMonthKey(r.ts);return month>=windowStartMonth&&month<=latestMonth;};
function metrics(rows){
  let cumulative=0,peak=0,maxDd=0,lossCount=0,lossPips=0,maxLossStreak=0;const streaks=[],drawdowns=[];
  let start=null;
  const finish=end=>{if(lossCount){streaks.push({start,end,count:lossCount,pips:lossPips});maxLossStreak=Math.max(maxLossStreak,lossCount);}lossCount=0;lossPips=0;start=null;};
  for(let i=0;i<rows.length;i++){const r=rows[i];cumulative+=r.pips;peak=Math.max(peak,cumulative);const dd=peak-cumulative;maxDd=Math.max(maxDd,dd);drawdowns.push({ts:r.ts,pips:dd});if(r.pips<0){if(!lossCount)start=r.ts;lossCount++;lossPips+=Math.abs(r.pips);}else finish(rows[i-1]?.ts??r.ts);}
  if(rows.length)finish(rows[rows.length-1].ts);
  return {cumulative,peak,maxDd,maxLossStreak,streaks,drawdowns};
}
const baseline=metrics(g.rows.filter(r=>!recentRow(r)));
const recent=metrics(g.rows.filter(recentRow));
const whole=metrics(g.rows);
const recentStreaks=whole.streaks.filter(s=>s.count>=2&&recentRow({ts:s.end}));
// Match the ALL equity-curve highlight: greatest loss count, then greatest loss pips.
const maxCountStreaks=whole.streaks.filter(s=>s.count===whole.maxLossStreak);
const recordLossPips=Math.max(0,...maxCountStreaks.map(s=>s.pips));
const recordStreaks=maxCountStreaks.filter(s=>Math.abs(s.pips-recordLossPips)<=1e-9).slice(0,1);
const consecutiveLoss=whole.maxLossStreak>=2&&recordStreaks.some(s=>recentRow({ts:s.end}));
const exceedsLossCount=baseline.maxLossStreak>0&&recentStreaks.some(s=>s.count>baseline.maxLossStreak*1.3);
const exceedsLossPnl=baseline.maxDd>0&&recentStreaks.some(s=>s.pips>baseline.maxDd+1e-9);
// "Drawdown terbaru" is a new/equal historical drawdown event, using only the earlier reference.
// A smaller ordinary loss below historical drawdown may remain yellow.
const recordDrawdown=whole.drawdowns.find(d=>d.pips>=whole.maxDd-1e-9);
const drawdown=whole.maxDd>1e-9&&!!recordDrawdown&&recentRow(recordDrawdown);
const severity=drawdown||exceedsLossCount||exceedsLossPnl?2:consecutiveLoss?1:0;
const reasons=[];if(drawdown)reasons.push('Drawdown terbaru mencapai/melebihi pembanding');if(exceedsLossCount)reasons.push('Consecutive Loss > +30% maksimum pembanding');if(exceedsLossPnl)reasons.push('PnL loss > Drawdown pembanding');if(!reasons.length&&consecutiveLoss)reasons.push('Consecutive Loss');
byPair.set(key,{analyst:g.analyst,pair:g.pair,monthKey:latestMonth,drawdown,consecutiveLoss,severity,reasons,exceedsLossCount,exceedsLossPnl,baselineMaxLossStreak:baseline.maxLossStreak,baselineMaxDrawdownPips:baseline.maxDd,recentMaxLossStreak:Math.max(0,...recentStreaks.map(s=>s.count)),recentMaxDrawdownPips:recent.maxDd,maxLossStreak:whole.maxLossStreak,maxDrawdownPips:whole.maxDd,ddPeriods:recent.drawdowns,lossPeriods:recordStreaks,endingPips:whole.cumulative,peakPips:whole.peak});

});
const byAnalyst = new Map();
byPair.forEach((st) => {
if (!st) return;
const key = tf_latestRiskNormAnalyst(st.analyst);
const prev=byAnalyst.get(key);
const drawdown=!!st.drawdown || !!(prev && prev.drawdown);
const consecutiveLoss=!!st.consecutiveLoss || !!(prev && prev.consecutiveLoss);
byAnalyst.set(key,{analyst:st.analyst,monthKey:latestMonth,drawdown,consecutiveLoss,severity:Math.max(st.severity,prev?.severity||0),reasons:Array.from(new Set([...(prev?.reasons||[]),...(st.reasons||[])])),sourcePair:st.pair});
});
for (let i = 0; i < src.length; i++) {
const r = src[i];
if (!r || r.isWithdraw) continue;
const analyst = String(r.analyst || '').trim();
if (!analyst) continue;
const key = tf_latestRiskNormAnalyst(analyst);
if (!byAnalyst.has(key)) {
byAnalyst.set(key, { analyst, monthKey:latestMonth, drawdown:false, consecutiveLoss:false, severity:0, sourcePair:'' });
}
}
try {
const reg=(value)=>{
const analyst=String(value||'').trim(),key=tf_latestRiskNormAnalyst(analyst);
if(analyst&&key&&!byAnalyst.has(key))byAnalyst.set(key,{analyst,monthKey:latestMonth,drawdown:false,consecutiveLoss:false,severity:0,sourcePair:''});
};
(Array.isArray(ANALYSTS)?ANALYSTS:[]).forEach(a=>reg(a&&(a.baseName||a.name)));
Object.keys((analystSourcesByName&&typeof analystSourcesByName==='object')?analystSourcesByName:{}).forEach(reg);
Object.keys((selectedAnalystsGlobal&&typeof selectedAnalystsGlobal==='object')?selectedAnalystsGlobal:{}).forEach(reg);
} catch(e) {}
__tfLatestRiskState = { monthKey:latestMonth, windowStartMonth, windowMonths:4, byPair, byAnalyst, signature };
try { window.__tfLatestRiskState = __tfLatestRiskState; } catch (e) { }
return __tfLatestRiskState;
}
catch (e) {
__tfLatestRiskState = { monthKey:'', byPair:new Map(), byAnalyst:new Map(), signature:'ERR' };
return __tfLatestRiskState;
}
}
const result=tf_refreshLatestRiskState(true);
state={byAnalyst:new Map(Array.from(result.byAnalyst,([key,value])=>[key,value.severity])),byPair:new Map(Array.from(result.byPair,([key,value])=>[key,value.severity])),monthKey:result.monthKey};
}
function cleanUrl(v){return String(v||'').trim();}
function resolveName(row,maps){
  const el=row.querySelector('.analyst-name-btn,.analyst-name,.analyst-label,.analyst-paste-btn');
  const txt=String(el&&el.textContent||'').replace(/^[✓!×]\s*/, '').trim();
  const inp=row.querySelector('.analyst-link-input'),url=cleanUrl(inp&&inp.value);
  if(url){
    for(const [name,src] of Object.entries(maps.sources||{})){if(cleanUrl(src&&src.url)===url)return {name,el};}
    if(maps.cache&&maps.cache[url])return {name:String(maps.cache[url]),el};
    const rem=(maps.remembered||[]).find(x=>cleanUrl(x&&(x.url||x.link))===url);
    if(rem&&String(rem.name||rem.analystName||'').trim())return {name:String(rem.name||rem.analystName),el};
  }
  return {name:txt.replace(/\s+\([^)]*\)\s*$/,'').trim(),el};
}
const pairRiskClasses=['tf-sidebar-pair-healthy','tf-sidebar-pair-warning','tf-sidebar-pair-critical'];
function paintPairText(el,severity){if(!el)return;const wanted=severity===undefined?null:pairRiskClasses[severity];for(const name of pairRiskClasses)if(el.classList.contains(name)!==(name===wanted))el.classList.toggle(name,name===wanted);}
function decoratePairs(row,name){
  const checked=[];
  row.querySelectorAll('.pair-multiselect-dropdown .pair-option').forEach(option=>{
    const input=option.querySelector('input[type="checkbox"]'),text=option.querySelector('span');
    const pair=normP(input?.dataset.value||input?.value);
    const key=normA(name)+'|'+pair;
    const eligible=!!input?.checked&&pair!=='__ALL__'&&state.byPair.has(key);
    paintPairText(text,eligible?state.byPair.get(key):undefined);
    if(input?.checked&&pair!=='__ALL__')checked.push({pair,severity:eligible?state.byPair.get(key):undefined});
  });
  const display=row.querySelector('.pair-multiselect-label');
  paintPairText(display,checked.length===1&&normP(display?.textContent)===checked[0].pair?checked[0].severity:undefined);
}
function decorate(maps){
  document.querySelectorAll('.analyst-row').forEach(row=>{const x=resolveName(row,maps);if(!x.el)return;x.el.classList.remove(H,W,C);const k=normA(x.name);const sev=state.byAnalyst.has(k)?(state.byAnalyst.get(k)||0):0;if(sev===2)x.el.classList.add(C);else if(sev===1)x.el.classList.add(W);else x.el.classList.add(H);const color=sev===2?"#ef4444":sev===1?"#facc15":"#22c55e";x.el.style.setProperty("color",color,"important");x.el.style.setProperty("-webkit-text-fill-color",color,"important");let icon=x.el.querySelector("[data-tf-sidebar-risk-icon]");if(!icon){icon=document.createElement("span");icon.dataset.tfSidebarRiskIcon="1";icon.style.marginRight="4px";x.el.prepend(icon);}const symbol=sev===2?"×":sev===1?"!":"✓";if(icon.textContent!==symbol)icon.textContent=symbol;decoratePairs(row,x.name);});
}
let mapsCache={sources:{},cache:{},remembered:[]};
let refreshTimer=null;
function scheduleRefresh(){clearTimeout(refreshTimer);refreshTimer=setTimeout(refresh,100);}
function refresh(){
  try{chrome.storage.local.get(['tfHistorySignals','tfAnalystSources','tfAnalystNameCacheByUrl','tfRememberedAnalystLinks'],d=>{try{compute(Array.isArray(d.tfHistorySignals)?d.tfHistorySignals:[]);mapsCache={sources:d.tfAnalystSources||{},cache:d.tfAnalystNameCacheByUrl||{},remembered:Array.isArray(d.tfRememberedAnalystLinks)?d.tfRememberedAnalystLinks:[]};decorate(mapsCache);}catch(_){}});}catch(_){}
}
const style=document.createElement('style');style.textContent='.'+H+'{color:#22c55e!important;font-weight:800!important}.'+W+'{color:#facc15!important;font-weight:800!important}.'+C+'{color:#ef4444!important;font-weight:800!important}';style.textContent+='.tf-sidebar-pair-healthy{color:#22c55e!important;-webkit-text-fill-color:#22c55e!important}.tf-sidebar-pair-warning{color:#facc15!important;-webkit-text-fill-color:#facc15!important}.tf-sidebar-pair-critical{color:#ef4444!important;-webkit-text-fill-color:#ef4444!important}';document.head.appendChild(style);
document.addEventListener('change',event=>{if(event.target.matches('.analyst-row .pair-option input[type=checkbox]'))decorate(mapsCache);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
try{chrome.storage.onChanged.addListener((ch,area)=>{if(area==='local'&&(ch.tfHistorySignals||ch.tfAnalystSources||ch.tfAnalystNameCacheByUrl||ch.tfRememberedAnalystLinks))scheduleRefresh();});}catch(_){}
try{new MutationObserver(records=>{if(records.some(r=>Array.from(r.addedNodes||[]).some(n=>n.nodeType===1 && (n.matches(".analyst-row,.pair-option,.pair-multiselect")||n.querySelector(".analyst-row,.pair-option,.pair-multiselect")))))decorate(mapsCache);}).observe(document.documentElement,{childList:true,subtree:true});}catch(_){}
})();
