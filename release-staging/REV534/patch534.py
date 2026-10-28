from pathlib import Path
import sys,json,hashlib,re
root=Path(sys.argv[1])
p=root/'assets/7e95b596e5bf8dff.css'
with p.open('a',encoding='utf8',newline='\n') as f:f.write('''
/* REV534: nested streak metrics keep semantic colors inside analyst-status cells. */
#drawdown-table .dd-child-row .drawdown-detail-table td.sl,
#drawdown-table .dd-child-row .drawdown-detail-table td.sl *{color:#ff4040!important;-webkit-text-fill-color:#ff4040!important;}
#drawdown-table .dd-child-row .drawdown-detail-table td.tp,
#drawdown-table .dd-child-row .drawdown-detail-table td.tp *{color:#00e676!important;-webkit-text-fill-color:#00e676!important;}
''')
p=root/'assets/tf-activity-report.js';s=p.read_text('utf8');s+='''
// REV534: native details expansion changes the embedded document height too.
document.addEventListener('toggle',notifyHeight,true);
if(typeof ResizeObserver!=='undefined'){
 const contentHeightObserver534=new ResizeObserver(notifyHeight);
 contentHeightObserver534.observe(document.body);
}
''';p.write_text(s,encoding='utf8',newline='\n')
p=root/'assets/tf-login-helper-rev205.js';s=p.read_text('utf8')
needle='let __tf_isAuthTab = false;'
guard='''// REV534: an interactive login form is expected while OAuth is pending.
// Track the shared flow so a second helper/probe tab cannot prematurely log it out.
let __tf_authStateReady534 = false;
let __tf_authState534 = {};
function tf_isInteractiveLoginPending534() {
 if (!__tf_authStateReady534) return true;
 const st=__tf_authState534, started=Number(st.tfManualAuthStartedAt||0);
 return !!(st.tfManualAuthActive && started>0 && Date.now()-started>=0 && Date.now()-started<600000);
}
Promise.resolve().then(() => {
try {
 if (hasChromeStorage()) {
  const keys=['tfManualAuthActive','tfManualAuthStartedAt'];
  chrome.storage.local.get(keys,st=>{__tf_authState534=st||{};__tf_authStateReady534=true;});
  if(chrome.storage.onChanged)chrome.storage.onChanged.addListener((changes,area)=>{
   if(area!=='local')return;
   for(const key of keys)if(changes[key])__tf_authState534[key]=changes[key].newValue;
  });
 } else __tf_authStateReady534=true;
} catch(e) { __tf_authStateReady534=true; }
});
'''
assert s.count(needle)==1;s=s.replace(needle,guard+needle)
needle='function tf_markVisibleLoggedOutMenu() {\nif (!hasChromeStorage()) return false;'
assert needle in s;s=s.replace(needle,needle+"\nif (tf_isInteractiveLoginPending534() && !__tf_isLogoutPath && !__tf_isSignOutUrl) return false;")
needle='if (sessionExpired || explicitLogoutUrl) {';assert s.count(needle)==1
s=s.replace(needle,'if ((sessionExpired && !tf_isInteractiveLoginPending534()) || explicitLogoutUrl) {')
needle="if (hasLoginForm && document.readyState === 'complete') {";assert s.count(needle)==1
s=s.replace(needle,needle+'\nif (tf_isInteractiveLoginPending534()) return;')
p.write_text(s,encoding='utf8',newline='\n')
p=root/'assets/tf-multi-total-progress.js';p.write_text(Path(__file__).with_name('timer534.js').read_text('utf8'),encoding='utf8',newline='\n')
p=root/'assets/901c62026afc22f4.js';s=p.read_text('utf8');needle='total: groups.length, completed, status, updatedAt: Date.now()';assert s.count(needle)==1;s=s.replace(needle,'total: groups.length, completed, status, startedAt: tf_batchScanState.startedAt, updatedAt: Date.now()');p.write_text(s,encoding='utf8',newline='\n')
p=root/'manifest.json';d=json.loads(p.read_text('utf8'));d.update(version='1.18.47',version_name='1.18.47',description='REV534: correct loss detail colors, preserve interactive Google login, expand report methodology.');p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf8',newline='\n')
notes='''REV534 / v1.18.47

- Loss/drawdown detail metrics stay red even inside a healthy analyst's green parent cell. Profit remains green. No calculation changes.
- An active manual login flow no longer treats the expected login form/navbar or initial login-required warning as an expired session while the user is confirming Google OAuth. Explicit logout remains authoritative; flow protection ends on completion/cancel and expires after ten minutes. No login-success or license checks are bypassed.
- Show elapsed batch scan duration beside the progress note, using shared job start timestamps. Freeze the final duration on finish/stop and stop interval updates in hidden sidebars.
- Embedded Kalender & Jam Trading follows native details expansion and content-height changes, so the methodology explanation is not clipped.
'''
(root/'README_REV534.md').write_text(notes,encoding='utf8',newline='\n')
p=root/'assets/7b6af0cb4001a684.js';s=p.read_text('utf8');m=re.search(r'const FILES = (\{.*?\});',s,re.S);checks=json.loads(m[1]);checks={n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in checks};p.write_text(s[:m.start(1)]+json.dumps(checks,indent=2)+s[m.end(1):],encoding='utf8',newline='\n')
print('Prepared',root)
