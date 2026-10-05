from pathlib import Path
import sys,shutil,json,re,hashlib
out=Path(sys.argv[1])
overrides=Path("release-staging/REV434/overrides")
for p in overrides.rglob("*"):
    if p.is_file():
        target=out/p.relative_to(overrides);target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
# Keep the original device/licence gate, identity, background and content helpers.
manifest=json.loads((out/'manifest.json').read_text('utf8'))
manifest.update(version='1.17.47',version_name='REV434',description='REV434: integrated Scrape Multi-Link Analis, compact filters, per-card progress, force Stop, Pause/Resume and Copy Link.')
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),'utf8',newline='\n')
popup=(out/'popup.html').read_text('utf8').replace('assets/tf-github-update-ui.js"','assets/tf-github-update-ui.js,multi-scanner/core.js,multi-scanner/progress.js,assets/tf-multi-native-sidebar.js,assets/tf-multi-sidebar-bridge.js"')
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
# Regenerate the authoritative integrity registry for the authorized new build.
loader=out/'assets/7b6af0cb4001a684.js';s=loader.read_text('utf8');old=json.loads(re.search(r'const FILES = (\{.*?\});',s).group(1))
paths=set(old)|{str(p.relative_to(out)).replace('\\','/') for p in out.rglob('*') if p.is_file() and ('multi-scanner/' in str(p).replace('\\','/') or p.name.startswith('tf-multi-'))}
paths.discard('assets/7b6af0cb4001a684.js')
hashes={p:hashlib.sha256((out/p).read_bytes()).hexdigest() for p in sorted(paths)}
s=re.sub(r'const FILES = \{.*?\};','const FILES = '+json.dumps(hashes,separators=(',',':'))+';',s,count=1)
loader.write_text(s,'utf8',newline='\n')

expected=json.loads(Path("release-staging/REV434/FILE_HASHES.json").read_text())
actual={str(p.relative_to(out)).replace("\\","/"):hashlib.sha256(p.read_bytes()).hexdigest() for p in out.rglob("*") if p.is_file()}
print("File differences:", [k for k in set(actual)|set(expected) if actual.get(k)!=expected.get(k)])
assert actual==expected, "Built files differ from the locally tested package"
print("PASS: exact file contents match locally verified REV434")
