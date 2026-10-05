from pathlib import Path
import sys,shutil,json,re,hashlib
out=Path(sys.argv[1])
overrides=Path("release-staging/REV444/overrides")
for p in overrides.rglob("*"):
    if p.is_file():
        target=out/p.relative_to(overrides);target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
# Keep the original device/licence gate, identity, background and content helpers.
manifest=json.loads((out/'manifest.json').read_text('utf8'))
manifest.update(version='1.17.57',version_name='REV444',description='REV444: replace completed ALL rescan pair data without altering original import files.')
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),'utf8',newline='\n')
popup=(out/'popup.html').read_text('utf8').replace('assets/tf-github-update-ui.js"','assets/tf-github-update-ui.js,multi-scanner/core.js,multi-scanner/progress.js,assets/tf-multi-native-sidebar.js,assets/tf-multi-sidebar-bridge.js,assets/tf-multi-rescan-all-sidebar.js,assets/tf-multi-total-progress.js"')
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
  respond({ok:true,busy,running:busy&&tf_batchScanState.origin==='rescanAllAnalysts'});
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

# Regenerate the authoritative integrity registry for the authorized new build.
loader=out/'assets/7b6af0cb4001a684.js';s=loader.read_text('utf8');old=json.loads(re.search(r'const FILES = (\{.*?\});',s).group(1))
paths=set(old)|{str(p.relative_to(out)).replace('\\','/') for p in out.rglob('*') if p.is_file() and ('multi-scanner/' in str(p).replace('\\','/') or p.name.startswith('tf-multi-'))}
paths.discard('assets/7b6af0cb4001a684.js')
hashes={p:hashlib.sha256((out/p).read_bytes()).hexdigest() for p in sorted(paths)}
s=re.sub(r'const FILES = \{.*?\};','const FILES = '+json.dumps(hashes,separators=(',',':'))+';',s,count=1)
loader.write_text(s,'utf8',newline='\n')

expected=json.loads(Path("release-staging/REV444/FILE_HASHES.json").read_text())
actual={str(p.relative_to(out)).replace("\\","/"):hashlib.sha256(p.read_bytes()).hexdigest() for p in out.rglob("*") if p.is_file()}
print("File differences:", [k for k in set(actual)|set(expected) if actual.get(k)!=expected.get(k)])
assert actual==expected, "Built files differ from the locally tested package"
print("PASS: exact file contents match locally verified REV444")
