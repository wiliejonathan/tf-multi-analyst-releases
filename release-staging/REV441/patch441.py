from pathlib import Path
import sys,shutil,json,re,hashlib
out=Path(sys.argv[1])
overrides=Path("release-staging/REV441/overrides")
for p in overrides.rglob("*"):
    if p.is_file():
        target=out/p.relative_to(overrides);target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
# Keep the original device/licence gate, identity, background and content helpers.
manifest=json.loads((out/'manifest.json').read_text('utf8'))
manifest.update(version='1.17.54',version_name='REV441',description='REV441: handle asynchronous service-worker alarm errors; preserve scanner controls and progress.')
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

# Regenerate the authoritative integrity registry for the authorized new build.
loader=out/'assets/7b6af0cb4001a684.js';s=loader.read_text('utf8');old=json.loads(re.search(r'const FILES = (\{.*?\});',s).group(1))
paths=set(old)|{str(p.relative_to(out)).replace('\\','/') for p in out.rglob('*') if p.is_file() and ('multi-scanner/' in str(p).replace('\\','/') or p.name.startswith('tf-multi-'))}
paths.discard('assets/7b6af0cb4001a684.js')
hashes={p:hashlib.sha256((out/p).read_bytes()).hexdigest() for p in sorted(paths)}
s=re.sub(r'const FILES = \{.*?\};','const FILES = '+json.dumps(hashes,separators=(',',':'))+';',s,count=1)
loader.write_text(s,'utf8',newline='\n')

expected=json.loads(Path("release-staging/REV441/FILE_HASHES.json").read_text())
actual={str(p.relative_to(out)).replace("\\","/"):hashlib.sha256(p.read_bytes()).hexdigest() for p in out.rglob("*") if p.is_file()}
print("File differences:", [k for k in set(actual)|set(expected) if actual.get(k)!=expected.get(k)])
assert actual==expected, "Built files differ from the locally tested package"
print("PASS: exact file contents match locally verified REV441")
