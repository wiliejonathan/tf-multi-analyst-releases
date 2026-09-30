import base64
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

BASE_VERSION='1.16.92'
NEW_VERSION='1.16.96'
NEW_REV='REV383'
OUT_NAME='TF_Extension_PC_MAC_REV383_HOLDING_NO_SCROLL_HISTORY_PERF_FIX.zip'

base=Path(sys.argv[1])
root=Path(__file__).resolve().parent
outdir=root/'deliverables'
outdir.mkdir(exist_ok=True)
out=outdir/OUT_NAME

with zipfile.ZipFile(base) as z:
    data={n:z.read(n) for n in z.namelist() if not n.endswith('/')}

manifest=json.loads(data['manifest.json'].decode())
assert manifest.get('version')==BASE_VERSION, manifest.get('version')

CORE='assets/4b4d6b8dc315a95c.js'
SIDEBAR='assets/927ecbd63036f61b.js'
LOADER='assets/7b6af0cb4001a684.js'
core=data[CORE].decode('utf-8')
sidebar=data[SIDEBAR].decode('utf-8')

# ---- Holding Period analytics: analyst + pair ----
if 'tf-holding-period-section' not in core:
    p=core.index('id=\\"rule3-withdraw-note\\"')
    q=core.index(r'\n</div>\n', p)+len(r'\n</div>\n')
    markup='''<div class="tf-holding-section" id="tf-holding-period-section">
  <div class="tf-holding-head">
    <div>
      <div class="tf-holding-kicker">TABLE ANALYTICS</div>
      <h3>Holding Period per Analis</h3>
    </div>
    <div class="tf-holding-formula">Holding Period = Closed At − Created At</div>
  </div>
  <div class="tf-holding-note">
    <strong>Max</strong> = holding period terlama dari seluruh trade yang masih termasuk ticker/analis-pair aktif.
    <strong>Avg.</strong> = rata-rata holding period dalam filter aktif (Time Range / Time Range per Month / Filter Tanggal).
  </div>
  <div class="tf-holding-grid">
    <div class="tf-holding-card">
      <table class="tf-holding-table" id="tf-holding-table-left">
        <thead><tr><th>Nama Analis - Pair</th><th>Max - Holding Period</th><th>Avg. Holding Period</th></tr></thead>
        <tbody id="tf-holding-body-left"></tbody>
      </table>
    </div>
    <div class="tf-holding-card">
      <table class="tf-holding-table" id="tf-holding-table-right">
        <thead><tr><th>Nama Analis - Pair</th><th>Max - Holding Period</th><th>Avg. Holding Period</th></tr></thead>
        <tbody id="tf-holding-body-right"></tbody>
      </table>
    </div>
  </div>
</div>
'''
    esc=markup.replace('\\','\\\\').replace('"','\\"').replace('\n',r'\n')
    core=core[:q]+esc+core[q:]

funcs=r'''
function tf_getHoldingDurationMs(row) {
try {
if (!row || row.isWithdraw)
return null;
const created = Number(row.createdSortKey);
const closed = Number(row.sortKey);
if (!Number.isFinite(created) || !Number.isFinite(closed) || created <= 0 || closed <= 0)
return null;
const diff = closed - created;
return Number.isFinite(diff) && diff >= 0 ? diff : null;
}
catch (e) {
return null;
}
}
function tf_formatHoldingDuration(ms) {
const raw = Number(ms);
if (!Number.isFinite(raw) || raw < 0)
return '—';
let totalMinutes = Math.round(raw / 60000);
if (totalMinutes <= 0)
return '0m';
const days = Math.floor(totalMinutes / 1440);
totalMinutes -= days * 1440;
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes - (hours * 60);
const parts = [];
if (days > 0)
parts.push(days + 'd');
if (hours > 0 || days > 0)
parts.push(hours + 'h');
parts.push(minutes + 'm');
return parts.join(' ');
}
function tf_renderHoldingPeriodTables(allTickerRows, filteredRows) {
const leftBody = document.getElementById('tf-holding-body-left');
const rightBody = document.getElementById('tf-holding-body-right');
if (!leftBody || !rightBody)
return;
const allRows = Array.isArray(allTickerRows) ? allTickerRows.filter((r) => r && !r.isWithdraw) : [];
const avgRows = Array.isArray(filteredRows) ? filteredRows.filter((r) => r && !r.isWithdraw) : [];
function tf_holdingAnalystPairKey(row) {
const analyst = String(row && row.analyst || '').trim();
const pair = String(row && row.pair || '').trim().toUpperCase();
if (!analyst || !pair)
return '';
return analyst + ' - ' + pair;
}
const names = Array.from(new Set(allRows.map(tf_holdingAnalystPairKey).filter(Boolean)))
.sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));
const maxByAnalyst = new Map();
const avgAgg = new Map();
for (let i = 0; i < allRows.length; i++) {
const row = allRows[i];
const name = tf_holdingAnalystPairKey(row);
if (!name)
continue;
const ms = tf_getHoldingDurationMs(row);
if (ms === null)
continue;
const prev = maxByAnalyst.get(name);
if (!Number.isFinite(prev) || ms > prev)
maxByAnalyst.set(name, ms);
}
for (let i = 0; i < avgRows.length; i++) {
const row = avgRows[i];
const name = tf_holdingAnalystPairKey(row);
if (!name)
continue;
const ms = tf_getHoldingDurationMs(row);
if (ms === null)
continue;
let agg = avgAgg.get(name);
if (!agg) {
agg = { sum: 0, count: 0 };
avgAgg.set(name, agg);
}
agg.sum += ms;
agg.count += 1;
}
function renderSide(tbody, subset) {
tbody.innerHTML = '';
if (!subset.length) {
const tr = document.createElement('tr');
tr.className = 'tf-holding-empty-row';
const td = document.createElement('td');
td.colSpan = 3;
td.textContent = names.length ? '—' : 'Belum ada data trade untuk ticker yang aktif.';
tr.appendChild(td);
tbody.appendChild(tr);
return;
}
subset.forEach((name) => {
const tr = document.createElement('tr');
const tdName = document.createElement('td');
tdName.className = 'tf-holding-analyst';
tdName.textContent = name;
const tdMax = document.createElement('td');
tdMax.className = 'mono tf-holding-value';
tdMax.textContent = tf_formatHoldingDuration(maxByAnalyst.get(name));
const tdAvg = document.createElement('td');
tdAvg.className = 'mono tf-holding-value';
const agg = avgAgg.get(name);
tdAvg.textContent = agg && agg.count > 0 ? tf_formatHoldingDuration(agg.sum / agg.count) : '—';
tr.appendChild(tdName);
tr.appendChild(tdMax);
tr.appendChild(tdAvg);
tbody.appendChild(tr);
});
}
const splitAt = Math.ceil(names.length / 2);
renderSide(leftBody, names.slice(0, splitAt));
renderSide(rightBody, names.slice(splitAt));
}

'''
if 'function tf_getHoldingDurationMs' not in core:
    anchor='function recomputeHistoryRows() {'
    assert core.count(anchor)==1
    core=core.replace(anchor,funcs+anchor,1)

if 'const tf_holdingAllTickerRows = baseRows.slice();' not in core:
    anchor='''try {
tf_refreshSingleMonthSelectors();
tf_syncSingleMonthSelectorsUI();
}
catch (e) { }
try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }
'''
    repl='''try {
tf_refreshSingleMonthSelectors();
tf_syncSingleMonthSelectorsUI();
}
catch (e) { }
const tf_holdingAllTickerRows = baseRows.slice();
try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }
try {
const tf_holdingFilteredRows = tf_filterRowsByUnifiedDate(baseRows);
tf_renderHoldingPeriodTables(tf_holdingAllTickerRows, tf_holdingFilteredRows);
}
catch (e) { }
'''
    assert core.count(anchor)==1, 'holding render anchor missing'
    core=core.replace(anchor,repl,1)

data[CORE]=core.encode()

# ---- Sidebar import persistence across side-panel close/reopen ----
helper=r'''function tf_buildRememberedLinksFromImportedSources(sourceObj) {
try {
if (!sourceObj || typeof sourceObj !== 'object') return [];
const out = [];
Object.keys(sourceObj).forEach((name) => {
try {
const item = sourceObj[name] || {};
const url = tf_normalizeTfAccountUrl(item.url || item.link || '');
if (!url) return;
const pairs = Array.isArray(item.pairs) && item.pairs.length ? item.pairs.slice() : [ALL_PAIR_OPTION_VALUE];
out.push({ url, pairs, name: String(name || '').trim() });
}
catch (e) { }
});
return out;
}
catch (e) { return []; }
}
'''
if 'function tf_buildRememberedLinksFromImportedSources' not in sidebar:
    anchor='let tf_addModeEngaged = false;'
    assert sidebar.count(anchor)==1
    sidebar=sidebar.replace(anchor,helper+anchor,1)

persist=r'''try {
const existingImportedLinks = Array.isArray(toSet[TF_REMEMBERED_LINKS_KEY]) ? toSet[TF_REMEMBERED_LINKS_KEY] : [];
if (!existingImportedLinks.length) {
const rebuiltImportedLinks = tf_buildRememberedLinksFromImportedSources(toSet[TF_ANALYST_SOURCES_KEY]);
if (rebuiltImportedLinks.length) toSet[TF_REMEMBERED_LINKS_KEY] = rebuiltImportedLinks;
}
toSet[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
catch (e) { }
'''
if 'const existingImportedLinks = Array.isArray' not in sidebar:
    anchor='''toSet.tfLastScanMeta = null;
}
catch (e) { }
toSet[TF_HAS_IMPORTED_BUNDLE_KEY] = true;'''
    repl='''toSet.tfLastScanMeta = null;
}
catch (e) { }
'''+persist+'''toSet[TF_HAS_IMPORTED_BUNDLE_KEY] = true;'''
    assert sidebar.count(anchor)==1
    sidebar=sidebar.replace(anchor,repl,1)

old="'tfPeriodicLogoutAt', TF_ANALYST_SOURCES_KEY]"
new="'tfPeriodicLogoutAt', 'tfMonthlyStats', 'tfHistorySignals', TF_ANALYST_SOURCES_KEY]"
assert old in sidebar or new in sidebar
sidebar=sidebar.replace(old,new,1)
sidebar=sidebar.replace('const rememberedLinks = (data && Array.isArray(data.tfRememberedAnalystLinks))','let rememberedLinks = (data && Array.isArray(data.tfRememberedAnalystLinks))',1)

old='const hasImportedBundle = !!(data && data.tfHasImportedBundle);'
if old in sidebar:
    new=r'''const hasImportedPayloadData = !!(data && ((Array.isArray(data.tfHistorySignals) && data.tfHistorySignals.length) || (data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object' && Object.keys(data.tfMonthlyStats).length)));
const hasImportedBundle = !!(data && data.tfHasImportedBundle) || hasImportedPayloadData;
if (hasImportedPayloadData && !(data && data.tfHasImportedBundle)) {
try { chrome.storage.local.set({ [TF_HAS_IMPORTED_BUNDLE_KEY]: true }, () => { try { void chrome.runtime.lastError; } catch (e) { } }); } catch (e) { }
}'''
    sidebar=sidebar.replace(old,new,1)

if 'const rebuiltLinks = tf_buildRememberedLinksFromImportedSources(srcObj);' not in sidebar:
    anchor=r'''const srcObj = (data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object')
? data[TF_ANALYST_SOURCES_KEY]
: null;
const tfNameByUrl = {};'''
    repl=r'''const srcObj = (data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object')
? data[TF_ANALYST_SOURCES_KEY]
: null;
if (hasImportedBundle && (!Array.isArray(rememberedLinks) || !rememberedLinks.length) && srcObj) {
try {
const rebuiltLinks = tf_buildRememberedLinksFromImportedSources(srcObj);
if (rebuiltLinks.length) {
rememberedLinks = rebuiltLinks;
chrome.storage.local.set({ [TF_REMEMBERED_LINKS_KEY]: rebuiltLinks, [TF_REMEMBER_LINKS_ENABLED_KEY]: true }, () => { try { void chrome.runtime.lastError; } catch (e) { } });
}
}
catch (e) { }
}
const tfNameByUrl = {};'''
    assert sidebar.count(anchor)==1, 'sidebar source recovery anchor missing'
    sidebar=sidebar.replace(anchor,repl,1)

data[SIDEBAR]=sidebar.encode()

# ---- Original theme + selective mechanical/high-tech glow; Table 3 excluded ----
theme=r'''/* REV383 — Original plugin theme + selective table glow + compact neon custom cursor. */
@media screen {
  html, body, body * { cursor:url("tf-cursor-arrow.png") 2 2,default!important; }
  a,button,[role="button"],summary,select,option,label[for],
  input[type="button"],input[type="submit"],input[type="reset"],input[type="checkbox"],input[type="radio"],
  .btn,.tf-nav-link,.tf-time-range-btn,.tf-cost-ticker,[onclick],[data-action],[data-tf-url] {
    cursor:url("tf-cursor-hand.png") 8 2,pointer!important;
  }
  button:disabled,input:disabled,select:disabled,[aria-disabled="true"] { cursor:url("tf-cursor-arrow.png") 2 2,default!important; }

  .table-wrapper,.tf-holding-card {
    --tf-glow-x:50%;--tf-glow-y:50%;--tf-glow-alpha:0;position:relative;isolation:isolate;
    transition:box-shadow .22s ease,border-color .22s ease,transform .22s ease;
  }
  .table-wrapper::before,.tf-holding-card::before {
    content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;pointer-events:none;z-index:12;
    opacity:var(--tf-glow-alpha);
    background:radial-gradient(180px circle at var(--tf-glow-x) var(--tf-glow-y),rgba(56,189,248,.98) 0%,rgba(56,189,248,.50) 24%,rgba(14,165,233,.16) 48%,transparent 72%);
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;
    transition:opacity .18s ease;
  }
  .table-wrapper::after,.tf-holding-card::after {
    content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:11;
    opacity:calc(var(--tf-glow-alpha) * .72);
    background:radial-gradient(260px circle at var(--tf-glow-x) var(--tf-glow-y),rgba(56,189,248,.09),transparent 68%);
    transition:opacity .18s ease;
  }
  .table-wrapper.tf-glow-near,.tf-holding-card.tf-glow-near {
    --tf-glow-alpha:1;border-color:rgba(56,189,248,.58)!important;
    box-shadow:0 16px 38px rgba(2,6,23,.32),0 0 0 1px rgba(56,189,248,.08),0 0 24px rgba(14,165,233,.16)!important;
  }

  /* History/Table 3 intentionally has zero glow/RAF work for performance. */
  #section-history > .table-wrapper,#section-history > .table-wrapper::before,#section-history > .table-wrapper::after {
    --tf-glow-alpha:0!important;transition:none!important;
  }
  #section-history > .table-wrapper.tf-glow-near { border-color:inherit!important;box-shadow:none!important; }

  .tf-holding-section { margin:14px 0 12px;padding:14px;border:1px solid var(--border-subtle,rgba(148,163,184,.25));border-radius:10px;background:transparent; }
  .tf-holding-head { display:flex;justify-content:space-between;gap:16px;align-items:flex-end;margin-bottom:8px; }
  .tf-holding-kicker { font:700 10px/1.2 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;letter-spacing:.18em;color:var(--accent,#38bdf8);margin-bottom:4px; }
  .tf-holding-head h3 { margin:0;font-size:14px; }
  .tf-holding-formula { font:600 11px/1.3 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;padding:6px 8px;border:1px solid var(--border-subtle,rgba(148,163,184,.25));border-radius:7px; }
  .tf-holding-note { margin-bottom:10px;font-size:11px;line-height:1.55;color:var(--fg-soft,#9ca3af); }
  .tf-holding-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px; }
  .tf-holding-card { min-width:0;overflow:visible!important;border:1px solid var(--border-subtle,rgba(148,163,184,.25));border-radius:10px; }
  .tf-holding-table { width:100%;min-width:0!important;table-layout:fixed;font-size:11px; }
  .tf-holding-table th,.tf-holding-table td { padding:9px 10px; }
  .tf-holding-table th:first-child,.tf-holding-table td:first-child { width:48%;overflow-wrap:anywhere;word-break:normal; }
  .tf-holding-table th:nth-child(2),.tf-holding-table th:nth-child(3) { width:26%;text-align:center!important; }
  .tf-holding-value { text-align:right;white-space:nowrap; }
  .tf-holding-analyst { font-weight:700; }
  .tf-holding-empty-row td { text-align:center;color:var(--fg-soft,#9ca3af); }
  @media(max-width:860px){.tf-holding-grid{grid-template-columns:1fr}.tf-holding-head{align-items:flex-start;flex-direction:column;gap:7px}.tf-holding-formula{width:100%}}
}
'''
glow=r'''(() => {
'use strict';
const SELECTOR='.table-wrapper, .tf-holding-card';
const HISTORY_SECTION='#section-history';
const bound=new WeakSet();
function bind(el){
  if(!el||bound.has(el))return;
  if(el.closest&&el.closest(HISTORY_SECTION))return;
  if(el.querySelector&&el.querySelector('#history-table'))return;
  bound.add(el);let raf=0,lastEvent=null;
  const paint=()=>{raf=0;const e=lastEvent;if(!e||!el.isConnected)return;const r=el.getBoundingClientRect();const x=Math.max(0,Math.min(r.width,e.clientX-r.left));const y=Math.max(0,Math.min(r.height,e.clientY-r.top));el.style.setProperty('--tf-glow-x',x+'px');el.style.setProperty('--tf-glow-y',y+'px');};
  el.addEventListener('pointerenter',(e)=>{el.classList.add('tf-glow-near');lastEvent=e;paint();},{passive:true});
  el.addEventListener('pointermove',(e)=>{lastEvent=e;if(!raf)raf=requestAnimationFrame(paint);},{passive:true});
  el.addEventListener('pointerleave',()=>{el.classList.remove('tf-glow-near');lastEvent=null;},{passive:true});
}
function scan(root){
  try{
    if(root&&root.nodeType===1&&root.closest&&root.closest(HISTORY_SECTION))return;
    if(root&&root.matches&&root.matches(HISTORY_SECTION))return;
    if(root&&root.matches&&root.matches(SELECTOR))bind(root);
    const scope=root&&root.querySelectorAll?root:document;
    scope.querySelectorAll(SELECTOR).forEach(bind);
  }catch(e){}
}
const start=()=>{scan(document);try{new MutationObserver((list)=>{list.forEach((m)=>m.addedNodes.forEach((n)=>{if(n&&n.nodeType===1)scan(n);}));}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
'''
data['assets/tf-mechanical-theme.css']=theme.encode()
data['assets/tf-table-glow.js']=glow.encode()

arrow='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'
hand='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'
data['assets/tf-cursor-arrow.png']=base64.b64decode(arrow)
data['assets/tf-cursor-hand.png']=base64.b64decode(hand)

# Load visual assets on all actual extension pages; do not alter the original palette/theme.
html_pages=['dashboard.html','popup.html','iSignalUsers.html','subscribe_plan.html','export_table3_pdf.html','action_preview.html','REV356_TABLE_PREVIEW.html','device_approval.html','update_guide.html','update_prompt.html','remote_offscreen.html']
for name in html_pages:
    if name not in data: continue
    txt=data[name].decode('utf-8')
    if 'tf-mechanical-theme.css' not in txt:
        assert '</head>' in txt
        txt=txt.replace('</head>','<link rel="stylesheet" href="assets/tf-mechanical-theme.css">\\n</head>',1)
    if 'tf-table-glow.js' not in txt and '</body>' in txt:
        txt=txt.replace('</body>','<script src="assets/tf-table-glow.js"></script>\\n</body>',1)
    data[name]=txt.encode()

manifest['version']=NEW_VERSION
manifest['version_name']=NEW_REV
manifest['description']='REV383: Holding Period tables without inner scrollbars, centered Holding headers, Table 3 glow disabled for performance, persistent imports, Analyst-Pair analytics, and mini neon cursor.'
data['manifest.json']=(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n').encode()

data['README_REV383.md']=b'''# REV383 - Holding Analytics / UI Performance Fix

- Holding Period tables expand naturally with no internal vertical/horizontal scrollbars.
- Max/Avg Holding Period headers are centered.
- Table 3 History is excluded from cursor-follow glow and MutationObserver scan work.
- Import state is restored from chrome.storage.local after the side panel is closed/reopened.
- Holding Period is grouped by Analyst - Pair and follows active analyst/pair and time filters.
- Original plugin theme/colors are preserved; only selective glow/shadow and the mini neon cursor are layered on top.
'''

# Add final integrity overrides for every modified/new protected asset.
loader=data[LOADER].decode('utf-8')
marker='window.tfIntegrityReady = (async () => {'
assert marker in loader
changed=[CORE,SIDEBAR,'manifest.json','assets/tf-mechanical-theme.css','assets/tf-table-glow.js','assets/tf-cursor-arrow.png','assets/tf-cursor-hand.png','README_REV383.md']+html_pages
changed=[x for x in changed if x in data]
block='// REV383 final integrity overrides - Holding UI/performance/import persistence.\\n'
for name in sorted(set(changed)):
    block+=f'FILES["{name}"] = "{hashlib.sha256(data[name]).hexdigest()}";\\n'
block+='\\n'
loader=loader.replace(marker,block+marker,1)
data[LOADER]=loader.encode()

# Verify effective integrity map after final overrides.
m=re.search(r'const FILES = (\{.*?\});',loader,re.S)
assert m,'integrity map missing'
files=json.loads(m.group(1))
for path,digest in re.findall(r"FILES\[[\"']([^\"']+)[\"']\]\s*=\s*[\"']([0-9a-f]{64})[\"']\s*;",loader):
    files[path]=digest
bad=[]
for path,expected in files.items():
    raw=data.get(path)
    actual=hashlib.sha256(raw).hexdigest() if raw is not None else 'MISSING'
    if actual!=expected: bad.append((path,expected,actual))
assert not bad,bad[:10]

with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,value in sorted(data.items()):
        zi=zipfile.ZipInfo(name,(2026,9,30,12,55,0))
        zi.compress_type=zipfile.ZIP_DEFLATED
        zi.create_system=3
        zi.external_attr=0o100644<<16
        z.writestr(zi,value,compresslevel=9)

sha=hashlib.sha256(out.read_bytes()).hexdigest()
(outdir/(OUT_NAME+'.sha256')).write_text(f'{sha}  {OUT_NAME}\\n',encoding='utf-8')
print('output='+str(out))
print('integrity_entries='+str(len(files)))
print('sha256='+sha)
