from pathlib import Path
import sys,shutil,json,re,hashlib
out=Path(sys.argv[1])
overrides=Path("release-staging/REV449/overrides")
for p in overrides.rglob("*"):
    if p.is_file():
        target=out/p.relative_to(overrides);target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
# Keep the original device/licence gate, identity, background and content helpers.
manifest=json.loads((out/'manifest.json').read_text('utf8'))
manifest.update(version='1.17.62',version_name='REV449',description='REV449: scan control locks, coloured Table 3 exports and performance card dates/duration.')
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),'utf8',newline='\n')
popup=(out/'popup.html').read_text('utf8').replace('assets/tf-github-update-ui.js"','assets/tf-github-update-ui.js,multi-scanner/core.js,multi-scanner/progress.js,assets/tf-multi-native-sidebar.js,assets/tf-multi-sidebar-bridge.js,assets/tf-multi-rescan-all-sidebar.js,assets/tf-multi-total-progress.js,assets/tf-multi-activity-lock.js"')
popup=popup.replace('</head>','<link rel="stylesheet" href="assets/tf-multi-integration.css"></head>')
(out/'popup.html').write_text(popup,'utf8',newline='\n')
bg=out/'assets/tf-device-background.js';bg.write_text(bg.read_text('utf8')+"\nimportScripts('tf-multi-background.js');\n",'utf8',newline='\n')
# Fold the new runner heartbeat into existing session-protection checks.
helper=out/'assets/tf-login-helper-rev205.js';s=helper.read_text('utf8')
s=s.replace("['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt']","['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt', 'tfMultiHeartbeatV419']")
s=s.replace('changes.tfScanInProgress || changes.tfActiveScanHeartbeatAt || changes.tfActiveScanProgressAt','changes.tfScanInProgress || changes.tfActiveScanHeartbeatAt || changes.tfActiveScanProgressAt || changes.tfMultiHeartbeatV419')
s=s.replace('__tf_scanProtected = !!(st && st.tfScanInProgress &&', '__tf_scanProtected = !!(st && Number(st.tfMultiHeartbeatV419 || 0) > now - 15000) || !!(st && st.tfScanInProgress &&')
helper.write_text(s,'utf8',newline='\n')
# Resolve licence-gate branding from the extension root, including nested dashboards.
gate=out/'assets/tf-device-lock.js';g=gate.read_text('utf8')
g=g.replace('<img src="icon128.png" alt="TF Analzer Analyst">','<img src="${chrome.runtime.getURL(\'icon128.png\')}" alt="TF">')
g=g.replace('object-fit: cover;', 'object-fit: contain;')
gate.write_text(g,'utf8',newline='\n')
# Persist analyst-level progress across sidebar reopening; pair jobs count once per analyst.
batch=out/'assets/901c62026afc22f4.js'
b=batch.read_text('utf8')
b=b.replace('let done = 0;\nconst results = new Array(total);', """let done = 0;
const results = new Array(total);
let tfTotalProgressQueue = Promise.resolve();
const tfPublishAnalystProgress = (status) => {
 const completed = groups.filter(g => (groupJobIndexMap.get(g.id) || []).every(i => results[i] != null)).length;
 const snapshot = {runId: tf_batchScanState.jobToken || String(tf_batchScanState.startedAt || Date.now()), total: groups.length, completed, status, updatedAt: Date.now()};
 tfTotalProgressQueue = tfTotalProgressQueue.then(() => new Promise(resolve => chrome.storage.local.set({tfTotalAnalystProgressV439:snapshot}, resolve))).catch(() => {});
};
tfPublishAnalystProgress('running');""")
needle="results[idx] = {\nchannel: label,\npair: pairLabel,\nsummary,\nerror\n};"
assert needle in b
b=b.replace(needle,needle+"\nif (!isStopped()) tfPublishAnalystProgress('running');",1)
needle='tf_batchScanState.active = false;'
pos=b.index(needle,b.index('const tfPublishAnalystProgress'))
b=b[:pos]+"tfPublishAnalystProgress(stopped ? 'stopped' : 'done');\n"+b[pos:]
needle='rolledBackOnError = await'
# Error completion is also delivered to the sidebar through batchScanDone.
batch.write_text(b,'utf8',newline='\n')

# Catch asynchronous alarm failures during service-worker transitions.
for rel in ['assets/tf-device-background.js','assets/901c62026afc22f4.js']:
    f=out/rel
    content=f.read_text('utf8').replace('chrome.alarms.create(', 'TFSafeAlarm.create(').replace('chrome.alarms.clear(', 'TFSafeAlarm.clear(')
    if rel.endswith('tf-device-background.js'):
        content="importScripts('tf-multi-safe-alarms.js');\n"+content
    f.write_text(content,'utf8',newline='\n')

# The progress sibling is intentional; reuse its preceding version block.
update_ui=out/'assets/tf-github-update-ui.js'
u=update_ui.read_text('utf8')
needle='let block = target.previousElementSibling;'
assert needle in u
if "if (block?.classList.contains('tf-total-progress'))" not in u:
    u=u.replace(needle,needle+"\n      if (block?.classList.contains('tf-total-progress')) block = block.previousElementSibling;",1)
update_ui.write_text(u,'utf8',newline='\n')

# Read live batch state rather than trusting a persisted pre-reload busy flag.
f=out/'assets/901c62026afc22f4.js'
f.write_text(f.read_text('utf8')+"""
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
 if(message?.type!=='TF_RESCAN_LIVE_STATE')return;
 (async()=>{
  const stored=await bg_storageLocalGet(['tfScanInProgress','tfScanOrigin','tfTotalAnalystProgressV439']);
  if(!tf_batchScanState.active&&stored.tfScanInProgress&&stored.tfScanOrigin==='rescanAllAnalysts'){
   tf_setScanInProgress(false,{origin:'rescanAllAnalysts'});
   if(stored.tfTotalAnalystProgressV439)await new Promise(resolve=>chrome.storage.local.set({tfTotalAnalystProgressV439:{...stored.tfTotalAnalystProgressV439,status:'stopped'}},()=>{void chrome.runtime.lastError;resolve();}));
  }
  const busy=!!tf_batchScanState.active;
  respond({ok:true,busy,running:busy&&tf_batchScanState.origin==='rescanAllAnalysts',origin:tf_batchScanState.origin||''});
 })().catch(e=>respond({ok:false,error:String(e.message||e)}));
 return true;
});
""",'utf8',newline='\n')

# Explicit ALL rescan replaces only the completed analyst/pair dataset.
f=out/'assets/901c62026afc22f4.js';b=f.read_text('utf8')
needle="scanMode,\njobToken,\nresumeCheckpoint:"
assert needle in b
b=b.replace(needle,"scanMode,\nreplaceExisting: tf_batchScanState.origin === 'rescanAllAnalysts',\njobToken,\nresumeCheckpoint:",1)
f.write_text(b,'utf8',newline='\n')
f=out/'assets/dec74fd654ec6d54.js';c=f.read_text('utf8')
needle="scanMode: (msg && msg.scanMode) ? msg.scanMode : null,"
assert needle in c
c=c.replace(needle,needle+"\nreplaceExisting: msg && msg.replaceExisting === true,",1)
needle='scanMode: scanMode\n};'
assert needle in c
c=c.replace(needle,"scanMode: scanMode,\nreplaceExisting: options.replaceExisting === true\n};",1)
needle="const isPartial = !!(scanResult && (scanResult.partial || scanResult.scanMode === 'historyBatch' || scanResult.scanMode === 'historyMonth' || isUpdate));"
assert needle in c
c=c.replace(needle,needle+"""
const replaceCompletedPair = scanResult?.replaceExisting === true && !isPartial && parsedThis.base && parsedThis.pair;
if (replaceCompletedPair) {
 for (const key of Object.keys(monthlyStats)) {
  const parsed=tf_parseStorageAnalystName(key);
  if(parsed.base.toLowerCase()===parsedThis.base.toLowerCase()&&parsed.pair===parsedThis.pair)delete monthlyStats[key];
 }
}
""",1)
needle='let historySignalsAll = Array.isArray(rawHistorySignalsAll) ? rawHistorySignalsAll.slice() : [];'
c=c.replace(needle,needle+"""
if(replaceCompletedPair)historySignalsAll=historySignalsAll.filter(item=>{
 const parsed=tf_parseStorageAnalystName(item?.analyst);
 const pair=String(item?.pair||parsed.pair||'').trim().toUpperCase();
 return !(parsed.base.toLowerCase()===parsedThis.base.toLowerCase()&&pair===parsedThis.pair);
});
""",1)
f.write_text(c,'utf8',newline='\n')
# Preserve exact original file text separately, before Combine or normalization.
f=out/'assets/927ecbd63036f61b.js';p=f.read_text('utf8')
needle='const readOne = (file) => new Promise((resolve, reject) => {'
assert needle in p
p=p.replace(needle,'const originalImportFiles = new Map();\n'+needle,1)
p=p.replace('resolve(parsed);\n};\nreader.onerror',"originalImportFiles.set(file,{name:String(file.name||'file.json'),text:txt});\nresolve(parsed);\n};\nreader.onerror",1)
needle='tf_importPayloadToStorage(parsed, () => {'
assert needle in p
p=p.replace(needle,"await new Promise((resolve,reject)=>chrome.storage.local.set({tfImportOriginalFilesV444:{importedAt:new Date().toISOString(),files:files.map(file=>originalImportFiles.get(file))}},()=>{const error=chrome.runtime.lastError;if(error)reject(new Error('Gagal menyimpan arsip JSON asli: '+error.message));else resolve();}));\n"+needle,1)
f.write_text(p,'utf8',newline='\n')

# Export the same row colours as Table 3; analyst risk colour remains independent.
for asset in ['4b4d6b8dc315a95c.js','894f18e8a37bd7c6.js']:
 f=out/'assets'/asset;s=f.read_text('utf8')
 if 'function tf_table3ExportColors445' not in s and 'async function exportHistoryToExcel()' in s:
  helper="""
function tf_table3ExportColors445(row){
 const negative=!!row?.isWithdraw||Number(row?.pnlDollar)<0;
 const colors={row:negative?'#f97373':'#4ade80'};
 if(!row?.isWithdraw){const risk=tf_getLatestRiskState(row?.analyst,row?.pair);if(risk)colors.analyst=risk.severity>=2?'#ef4444':risk.severity===1?'#facc15':'#22c55e';}
 return colors;
}
"""
  s=s.replace('async function exportHistoryToExcel()',helper+'\nasync function exportHistoryToExcel()',1)
  s=s.replace('createdDate: r && r.createdDate != null',"textColors: tf_table3ExportColors445(r),\ncreatedDate: r && r.createdDate != null",1)
  s=s.replace('const headerCells = defs.map',"const exportColorStyles=[];const exportColorStyleMap=new Map();\nconst headerCells = defs.map",1)
  s=s.replace('return tf_xlsxCellXml(excelRow, colIndex, value, style);',"""const colors=tf_table3ExportColors445(row);const color=col.key==='analyst'?(colors.analyst||colors.row):colors.row;
const token=style+'|'+color;if(!exportColorStyleMap.has(token)){exportColorStyleMap.set(token,18+exportColorStyles.length);exportColorStyles.push({base:style,color});}style=exportColorStyleMap.get(token);
return tf_xlsxCellXml(excelRow, colIndex, value, style);""",1)
  s=s.replace('const stylesXml =','let stylesXml =',1)
  needle="const contentTypes = '<?xml"
  inject=r"""const baseXfs=stylesXml.match(/<cellXfs[^>]*>(.*?)<\/cellXfs>/s)[1].match(/<xf\b[^>]*(?:\/>|>.*?<\/xf>)/gs);
const extraFonts=exportColorStyles.map(x=>'<font><sz val="10"/><name val="Calibri"/><color rgb="FF'+x.color.slice(1).toUpperCase()+'"/></font>').join('');
const extraXfs=exportColorStyles.map((x,i)=>baseXfs[x.base].replace(/fontId="\d+"/,'fontId="'+(6+i)+'"').replace(/ applyFont="1"/g,'').replace('<xf ','<xf applyFont="1" ')).join('');
stylesXml=stylesXml.replace('<fonts count="6">','<fonts count="'+(6+exportColorStyles.length)+'">').replace('</fonts>',extraFonts+'</fonts>').replace('<cellXfs count="18">','<cellXfs count="'+(18+exportColorStyles.length)+'">').replace('</cellXfs>',extraXfs+'</cellXfs>');
"""
  assert needle in s;s=s.replace(needle,inject+needle,1)
  f.write_text(s,'utf8',newline='\n')
f=out/'assets/1362157380317d63.js';s=f.read_text('utf8')
if 'row.textColors' not in s:
 s=s.replace('if (c.cls) td.className = c.cls;','if (c.cls) td.className = c.cls;\n        const color=col.key===\'analyst\'?(row.textColors?.analyst||row.textColors?.row):row.textColors?.row;\n        if(/^#[0-9a-f]{6}$/i.test(color||\'\'))td.style.setProperty(\'color\',color,\'important\');')
 # The renderer loop uses its column variable, confirmed below by regression test.

 f.write_text(s,'utf8',newline='\n')
f=out/'assets/7125b615d060d669.css';s=f.read_text('utf8')
if 'REV449 export colour preservation' not in s:s+='\n/* REV449 export colour preservation */\n.tf-export-table{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n'
f.write_text(s,'utf8',newline='\n')

# Equity card shows the exact active date window used by the equity calculation.
f=out/'assets/4b4d6b8dc315a95c.js';s=f.read_text('utf8')
if 'tf-equity-date-range445' not in s:
 s=s.replace("const values = [saldo, equity, pnl, pct], labels", "const dateStart445=formatDateInputFromSortKey(equityFilterStart),dateEnd445=formatDateInputFromSortKey(equityFilterEnd);\n  const dateRange445=dateStart445&&dateEnd445?dateStart445+' - '+dateEnd445:'—';\n  const values = [saldo, equity, pnl, pct], labels",1)
 s=s.replace("+ (i === 2 ? '<div class=", "+ (i <= 1 ? '<div class=\"tf-equity-date-range445\" style=\"font-size:10px;color:#94a3b8;margin-top:6px\">'+(i===0?('Start date : '+(dateStart445?dateStart445.split('-').reverse().join('-'):'—')):('End Date : '+(dateEnd445?dateEnd445.split('-').reverse().join('-'):'—')))+'</div>' : '') + (i === 2 ? '<div class=",1)
 f.write_text(s,'utf8',newline='\n')

# Calendar duration is derived from the same start/end dates as the cards.
f=out/'assets/4b4d6b8dc315a95c.js';s=f.read_text('utf8')
if 'tf_cardDuration446' not in s:
 helper="""
function tf_cardDuration446(start,end){
 const parse=x=>{if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(x||''))return null;const [y,m,d]=x.split('-').map(Number);return new Date(Date.UTC(y,m-1,d));};
 const a=parse(start),b=parse(end);if(!a||!b||b<a)return '—';
 const shift=months=>{const first=new Date(Date.UTC(a.getUTCFullYear(),a.getUTCMonth()+months,1));return new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth(),Math.min(a.getUTCDate(),new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate())));};
 let months=(b.getUTCFullYear()-a.getUTCFullYear())*12+b.getUTCMonth()-a.getUTCMonth();if(shift(months)>b)months--;
 const years=Math.floor(months/12),remainingMonths=months%12;let days=Math.round((b-shift(months))/86400000);const weeks=days>=14?Math.floor(days/7):0;if(weeks)days%=7;
 return [[years,'Years'],[remainingMonths,'Months'],[weeks,'Weeks'],[days,'Days']].filter(x=>x[0]).map(x=>x[0]+' '+x[1]).join(' - ')||'0 Days';
}
"""
 s=s.replace('function tf_renderBalanceCards412(',helper+'\nfunction tf_renderBalanceCards412(',1)
 s=s.replace("+ (i === 2 ? '<div class=", "+ (i === 3 ? '<div class=\"tf-pnl-duration446\" style=\"font-size:10px;color:#94a3b8;margin-top:6px\">Durasi : '+tf_cardDuration446(dateStart445,dateEnd445)+'</div>' : '') + (i === 2 ? '<div class=",1)
 f.write_text(s,'utf8',newline='\n')

# Duration inherits the PnL percentage card colour, including redraws.
f=out/'assets/7e95b596e5bf8dff.css';s=f.read_text('utf8')
if 'REV449 duration colour' not in s:s+='\n/* REV449 duration colour */\n.tf-balance-card412.pos .tf-pnl-duration446{color:#22c55e!important}.tf-balance-card412.neg .tf-pnl-duration446{color:#f87171!important}\n'
f.write_text(s,'utf8',newline='\n')

# Fix style tokenization: a self-closing xf must not consume the following xf.
for asset in ['4b4d6b8dc315a95c.js','894f18e8a37bd7c6.js']:
 f=out/'assets'/asset;s=f.read_text('utf8')
 s=s.replace(".match(/<xf\\b[^>]*(?:\\/>|>.*?<\\/xf>)/gs)",".match(/<xf\\b[^>]*\\/>|<xf\\b[^>]*>.*?<\\/xf>/gs)")
 s=s.replace("'<font><sz val=\"10\"/><name val=\"Calibri\"/><color rgb=\"FF'+x.color", "'<font><b/><sz val=\"10\"/><name val=\"Calibri\"/><color rgb=\"FF'+x.color")
 s=s.replace("return 'Scanned by ' + tfOwnerAlphabetLabel(index) + ' : '","return 'Scanned by : '")
 f.write_text(s,'utf8',newline='\n')
f=out/'assets/1362157380317d63.js';s=f.read_text('utf8')
s=s.replace("if(/^#[0-9a-f]{6}$/i.test(color||''))td.style.setProperty('color',color,'important');", "if(/^#[0-9a-f]{6}$/i.test(color||'')){const ink={'#4ade80':'#15803d','#22c55e':'#15803d','#f97373':'#b91c1c','#ef4444':'#b91c1c','#facc15':'#a16207'}[color.toLowerCase()]||color;td.style.setProperty('color',ink,'important');td.style.fontWeight='700';}")
f.write_text(s,'utf8',newline='\n')
f=out/'assets/7125b615d060d669.css';s=f.read_text('utf8')
if 'REV449 dark print ink' not in s:s+='\n/* REV449 dark print ink */\n.tf-export-table .tp,.tf-export-table .type-buy{color:#15803d!important;font-weight:700}.tf-export-table .sl,.tf-export-table .type-sell{color:#b91c1c!important;font-weight:700}\n'
f.write_text(s,'utf8',newline='\n')


# Excel uses bold, opaque print ink on its white sheet background.
for asset in ['4b4d6b8dc315a95c.js','894f18e8a37bd7c6.js']:
 f=out/'assets'/asset;s=f.read_text('utf8')
 if 'function tf_createHistoryExcelWorkbookBytes' not in s:continue
 start=s.index('function tf_createHistoryExcelWorkbookBytes');end=s.index('async function exportHistoryToExcel()',start)
 fragment=s[start:end]
 if "'4ADE80':'15803D'" not in fragment:fragment=fragment.replace("x.color.slice(1).toUpperCase()", "({'4ADE80':'15803D','22C55E':'15803D','F97373':'B91C1C','EF4444':'B91C1C','FACC15':'A16207'}[x.color.slice(1).toUpperCase()]||x.color.slice(1).toUpperCase())")
 fragment=fragment.replace('<font><sz val="10"/><name val="Calibri"/><color rgb="FF16A34A"/>','<font><b/><sz val="10"/><name val="Calibri"/><color rgb="FF15803D"/>').replace('<font><sz val="10"/><name val="Calibri"/><color rgb="FFDC2626"/>','<font><b/><sz val="10"/><name val="Calibri"/><color rgb="FFB91C1C"/>')
 s=s[:start]+fragment+s[end:];f.write_text(s,'utf8',newline='\n')

# Regenerate the authoritative integrity registry for the authorized new build.
loader=out/'assets/7b6af0cb4001a684.js';s=loader.read_text('utf8');old=json.loads(re.search(r'const FILES = (\{.*?\});',s).group(1))
paths=set(old)|{str(p.relative_to(out)).replace('\\','/') for p in out.rglob('*') if p.is_file() and ('multi-scanner/' in str(p).replace('\\','/') or p.name.startswith('tf-multi-'))}
paths.discard('assets/7b6af0cb4001a684.js')
hashes={p:hashlib.sha256((out/p).read_bytes()).hexdigest() for p in sorted(paths)}
s=re.sub(r'const FILES = \{.*?\};','const FILES = '+json.dumps(hashes,separators=(',',':'))+';',s,count=1)
loader.write_text(s,'utf8',newline='\n')

expected=json.loads(Path("release-staging/REV449/FILE_HASHES.json").read_text())
actual={str(p.relative_to(out)).replace("\\","/"):hashlib.sha256(p.read_bytes()).hexdigest() for p in out.rglob("*") if p.is_file()}
print("File differences:", [k for k in set(actual)|set(expected) if actual.get(k)!=expected.get(k)])
assert actual==expected, "Built files differ from the locally tested package"
print("PASS: exact file contents match locally verified REV449")
