from pathlib import Path
import json,re,hashlib,zipfile,shutil,sys

base=Path(sys.argv[1])
root=Path(__file__).resolve().parent
work=root/'_rev376_work'
out=root/'deliverables'/'TF_Extension_PC_MAC_REV376_LOGIN_REQUIRED_AUTO_RESUME.zip'
out.parent.mkdir(exist_ok=True)
if work.exists(): shutil.rmtree(work)
work.mkdir()
with zipfile.ZipFile(base) as z: z.extractall(work)

def read(rel): return (work/rel).read_text(encoding='utf-8')
def write(rel,s): (work/rel).write_text(s,encoding='utf-8')
def replace_once(s,old,new,label):
    c=s.count(old)
    if c!=1: raise AssertionError(f'{label}: expected 1 anchor, got {c}')
    return s.replace(old,new,1)

mp=work/'manifest.json'; manifest=json.loads(mp.read_text())
assert manifest['version']=='1.16.88' and manifest['version_name']=='REV375'
manifest['version']='1.16.89'; manifest['version_name']='REV376'; manifest['description']='REV376: login-required detection with automatic Update/Submit resume after successful login.'
mp.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')

rel='assets/dec74fd654ec6d54.js'; s=read(rel)
marker='function tf_isSessionExpired() {\n'
helper=r'''function tf_hasLoginRequiredAlert() {
try {
const isVisible = (el) => {
try {
if (!el) return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
if (el.hasAttribute && el.hasAttribute('hidden')) return false;
if (String(el.getAttribute && el.getAttribute('aria-hidden') || '').toLowerCase() === 'true') return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
}
catch (e) { return false; }
};
const nodes = Array.from(document.querySelectorAll('.alert-time .alert, .alert-modal .alert, .alert.alert-warning'));
for (const node of nodes) {
if (!isVisible(node)) continue;
const text = String(node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
if (/Silahkan\s+login\s+untuk\s+mengakses\s+halaman\s+ini/i.test(text)) return true;
}
}
catch (e) { }
return false;
}
'''
s=replace_once(s,marker,helper+marker,'insert exact login-required alert detector')
s=replace_once(s,"function tf_isSessionExpired() {\ntry {\n", "function tf_isSessionExpired() {\ntry {\nif (tf_hasLoginRequiredAlert()) return true;\n", 'wire alert detector into session-expired check')
observer_marker='let __tfActiveJobToken = null;\n'
observer=r'''let __tfLoginRequiredAlertNotifyAt = 0;
function tf_notifyLoginRequiredAlertNow() {
try {
if (!tf_hasLoginRequiredAlert()) return false;
const now = Date.now();
if (now - __tfLoginRequiredAlertNotifyAt < 1800) return true;
__tfLoginRequiredAlertNotifyAt = now;
tf_markLoggedOutAndNotify('Silahkan login untuk mengakses halaman ini');
return true;
}
catch (e) { return false; }
}
try {
const tfLoginRequiredObserver = new MutationObserver(() => { try { tf_notifyLoginRequiredAlertNow(); } catch (e) { } });
const startTfLoginRequiredObserver = () => {
try {
const root = document.documentElement || document.body;
if (!root) return;
tfLoginRequiredObserver.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class','style','hidden','aria-hidden'] });
tf_notifyLoginRequiredAlertNow();
}
catch (e) { }
};
if (document.documentElement) startTfLoginRequiredObserver();
else document.addEventListener('DOMContentLoaded', startTfLoginRequiredObserver, { once: true });
}
catch (e) { }
'''
s=replace_once(s,observer_marker,observer+observer_marker,'insert login-required observer')
s=replace_once(s,"""const modal = doc && doc.getElementById('modal-notif');
if (modal) {
const t = (modal.innerText || modal.textContent || '').trim();
if (/Silahkan\\s*login/i.test(t)) {
throw new Error('SESSION_EXPIRED');
}
}
""","""const modal = doc && doc.getElementById('modal-notif');
if (modal) {
const t = (modal.innerText || modal.textContent || '').trim();
if (/Silahkan\\s*login/i.test(t)) {
throw new Error('SESSION_EXPIRED');
}
}
const loginAlerts = doc ? Array.from(doc.querySelectorAll('.alert-time .alert, .alert-modal .alert, .alert.alert-warning')) : [];
for (const node of loginAlerts) {
const t = String(node && (node.innerText || node.textContent) || '').replace(/\\s+/g, ' ').trim();
if (/Silahkan\\s+login\\s+untuk\\s+mengakses\\s+halaman\\s+ini/i.test(t)) throw new Error('SESSION_EXPIRED');
}
""",'detect login-required alert in fetched HTML')
write(rel,s)

rel='assets/927ecbd63036f61b.js'; s=read(rel)
s=replace_once(s,"let tf_scanUiInProgress = false;\nfunction tf_applyStopModeFromScanState(inProgress, origin) {\nconst on = !!inProgress;\ntf_scanUiInProgress = on;\nconst o = origin ? String(origin) : '';\n",
'''let tf_scanUiInProgress = false;
let tf_scanUiOrigin = '';
function tf_applyStopModeFromScanState(inProgress, origin) {
const on = !!inProgress;
tf_scanUiInProgress = on;
const o = origin ? String(origin) : '';
tf_scanUiOrigin = on ? o : '';
''','track active scan origin')
anchor='const onUpdateClick = async (btn) => {\n'
helpers=r'''const TF_RESUME_AFTER_LOGIN_KEY = 'tfResumeAfterLoginV1';
let __tfResumeAfterLoginBusy = false;
const tf_queueResumeAfterLogin = (action, extra) => {
try {
if (!hasChromeStorage()) return;
const payload = {
action: String(action || ''),
createdAt: Date.now(),
extra: (extra && typeof extra === 'object') ? extra : {}
};
chrome.storage.local.set({ [TF_RESUME_AFTER_LOGIN_KEY]: payload }, () => { try { void chrome.runtime.lastError; } catch (e) { } });
}
catch (e) { }
};
const tf_forceLoginViewForResume = (action, reason, extra) => {
try { tf_queueResumeAfterLogin(action, extra); } catch (e) { }
try {
const msg = String(reason || 'Session TradersFamily berakhir. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.');
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) loginStatusEl.textContent = msg;
setStatus(msg);
}
catch (e) { }
try {
if (hasChromeStorage()) {
const now = Date.now();
chrome.storage.local.set({
tfLoginConfirmed: false,
tfEnteredMain: false,
tfForceLoginForm: true,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfLoginError: ''
}, () => { });
}
}
catch (e) { }
try { showLoginView(); } catch (e) { }
};
'''
s=replace_once(s,anchor,helpers+anchor,'insert login-resume queue helpers')
old="""if (definitelyLoggedOut) {
setStatus('Update dibatalkan: session TradersFamily sudah logout. Silakan login kembali.');
try {
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) loginStatusEl.textContent = 'Session TradersFamily sudah berakhir. Silakan login kembali sebelum Update.';
showLoginView();
loadPopupStateFromStorage();
}
catch (e) { }
} else {
"""
new="""if (definitelyLoggedOut) {
tf_forceLoginViewForResume('update', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Update akan dilanjutkan otomatis.', { source: 'update_preflight' });
try { loadPopupStateFromStorage(); } catch (e) { }
} else {
"""
s=replace_once(s,old,new,'update preflight queue resume')
old="""try { loadPopupStateFromStorage(); } catch (e) { }
};
const confirmRootThenFinalize = () => {
"""
new="""try { loadPopupStateFromStorage(); } catch (e) { }
try {
setTimeout(() => {
try {
if (typeof window.__tfResumePendingActionAfterLogin === 'function') window.__tfResumePendingActionAfterLogin();
}
catch (e) { }
}, 700);
}
catch (e) { }
};
const confirmRootThenFinalize = () => {
"""
s=replace_once(s,old,new,'resume after login finalize')
old="""const onSubmitClick = (btn) => {
if (!btn || btn.disabled)
return;
setStatus('Submit: memuat data dari file Import & membuka dashboard...');
openOrReloadDashboard({ activate: true });
};
bindAll(btnSubmitMain, () => onSubmitClick(btnSubmitMain));
bindAll(btnSubmitMasuk, () => onSubmitClick(btnSubmitMasuk));
bindAll(btnSubmitIsignal, () => onSubmitClick(btnSubmitIsignal));
"""
new=r'''const onSubmitClick = async (btn) => {
if (!btn || btn.disabled) return;
setStatus('Submit: memeriksa session login TradersFamily terbaru...');
let loginCheck = null;
try { loginCheck = await tf_verifyFreshLoginBeforeUpdate(); }
catch (e) { loginCheck = { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR' }; }
if (!loginCheck || loginCheck.loggedIn !== true || loginCheck.ok !== true) {
const definitelyLoggedOut = !!(loginCheck && (loginCheck.loggedOut === true || loginCheck.state === 'logged_out' || loginCheck.code === 'TF_SESSION_EXPIRED'));
if (definitelyLoggedOut) {
tf_forceLoginViewForResume('submit_shortcut', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Submit akan dilanjutkan otomatis.', { buttonId: btn.id || 'tf-btn-submit-main' });
} else {
setStatus('Submit ditunda: status login terbaru belum dapat diverifikasi. Periksa koneksi lalu coba lagi.');
}
return;
}
setStatus('Submit: login valid ✓ — memuat data dari file Import & membuka dashboard...');
openOrReloadDashboard({ activate: true });
};
bindAll(btnSubmitMain, () => { void onSubmitClick(btnSubmitMain); });
bindAll(btnSubmitMasuk, () => { void onSubmitClick(btnSubmitMasuk); });
bindAll(btnSubmitIsignal, () => { void onSubmitClick(btnSubmitIsignal); });
window.__tfResumePendingActionAfterLogin = () => {
if (__tfResumeAfterLoginBusy || !hasChromeStorage()) return;
__tfResumeAfterLoginBusy = true;
chrome.storage.local.get([TF_RESUME_AFTER_LOGIN_KEY], (d) => {
try {
const pending = d && d[TF_RESUME_AFTER_LOGIN_KEY] ? d[TF_RESUME_AFTER_LOGIN_KEY] : null;
const age = pending && pending.createdAt ? (Date.now() - Number(pending.createdAt || 0)) : Number.MAX_SAFE_INTEGER;
if (!pending || !pending.action || age > 15 * 60 * 1000) {
chrome.storage.local.remove([TF_RESUME_AFTER_LOGIN_KEY], () => { });
__tfResumeAfterLoginBusy = false;
return;
}
chrome.storage.local.remove([TF_RESUME_AFTER_LOGIN_KEY], () => { });
const action = String(pending.action || '');
const extra = pending.extra && typeof pending.extra === 'object' ? pending.extra : {};
setStatus('Login berhasil ✓ — melanjutkan proses ' + (action.indexOf('update') >= 0 ? 'Update' : 'Submit') + ' otomatis...');
setTimeout(() => {
try {
if (action === 'update') {
const b = btnUpdateMain || btnUpdateMasuk || btnUpdateIsignal;
if (b) void onUpdateClick(b);
} else if (action === 'submit_shortcut') {
const b = document.getElementById(String(extra.buttonId || '')) || btnSubmitMain || btnSubmitMasuk || btnSubmitIsignal;
if (b) void onSubmitClick(b);
} else if (action === 'dashboardSubmit') {
if (batchBtn) batchBtn.click();
} else if (action === 'isignalSubmit') {
if (batchIsignalBtn) batchIsignalBtn.click();
}
}
catch (e) { setStatus('Gagal melanjutkan proses otomatis setelah login: ' + String(e && e.message ? e.message : e)); }
finally { __tfResumeAfterLoginBusy = false; }
}, 650);
}
catch (e) { __tfResumeAfterLoginBusy = false; }
});
};
'''
s=replace_once(s,old,new,'make submit shortcut login-aware and add resume dispatcher')
old="""if (batchBtn) {
batchBtn.addEventListener('click', () => {
if (tf_isStopMode(batchBtn)) {
"""
new="""if (batchBtn) {
batchBtn.addEventListener('click', async () => {
if (tf_isStopMode(batchBtn)) {
"""
s=replace_once(s,old,new,'make dashboard submit listener async')
anchor="""if (!analystLinksContainer) {
setStatus('Container Link Analis tidak ditemukan.');
return;
}
"""
insert="""let loginCheck = null;
try { loginCheck = await tf_verifyFreshLoginBeforeUpdate(); }
catch (e) { loginCheck = { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR' }; }
if (!loginCheck || loginCheck.loggedIn !== true || loginCheck.ok !== true) {
const definitelyLoggedOut = !!(loginCheck && (loginCheck.loggedOut === true || loginCheck.state === 'logged_out' || loginCheck.code === 'TF_SESSION_EXPIRED'));
if (definitelyLoggedOut) {
tf_forceLoginViewForResume('dashboardSubmit', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Submit akan dilanjutkan otomatis.', { source: 'dashboard_submit_preflight' });
} else {
setStatus('Submit ditunda: status login terbaru belum dapat diverifikasi. Periksa koneksi lalu coba lagi.');
}
return;
}
"""
s=replace_once(s,anchor,insert+anchor,'dashboard submit preflight')
old="""if (batchIsignalBtn) {
batchIsignalBtn.addEventListener('click', () => {
if (tf_isStopMode(batchIsignalBtn)) {
"""
new="""if (batchIsignalBtn) {
batchIsignalBtn.addEventListener('click', async () => {
if (tf_isStopMode(batchIsignalBtn)) {
"""
s=replace_once(s,old,new,'make isignal submit listener async')
anchor="""const channels = tf_collectChannelsFromContainer(isignalLinksContainer);
"""
insert="""let loginCheck = null;
try { loginCheck = await tf_verifyFreshLoginBeforeUpdate(); }
catch (e) { loginCheck = { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR' }; }
if (!loginCheck || loginCheck.loggedIn !== true || loginCheck.ok !== true) {
const definitelyLoggedOut = !!(loginCheck && (loginCheck.loggedOut === true || loginCheck.state === 'logged_out' || loginCheck.code === 'TF_SESSION_EXPIRED'));
if (definitelyLoggedOut) {
tf_forceLoginViewForResume('isignalSubmit', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Submit akan dilanjutkan otomatis.', { source: 'isignal_submit_preflight' });
} else {
const msg = 'Submit ditunda: status login terbaru belum dapat diverifikasi. Periksa koneksi lalu coba lagi.';
setIsignalStatus(msg); setStatus(msg);
}
return;
}
"""
s=replace_once(s,anchor,insert+anchor,'isignal submit preflight')
old="""const logoutReason = String(msg && msg.reason || '');
const deferableDuringScan = logoutReason === 'SESSION_EXPIRED' || logoutReason === 'NAVBAR_LOGGED_OUT' || logoutReason === 'PERIODIC_CHECK';
if (tf_scanUiInProgress && deferableDuringScan) {
"""
new="""const logoutReason = String(msg && msg.reason || '');
const activeOrigin = String(tf_scanUiOrigin || '');
const resumeAction = activeOrigin === 'updateButton' ? 'update' : (activeOrigin === 'dashboardSubmit' ? 'dashboardSubmit' : (activeOrigin === 'isignalSubmit' ? 'isignalSubmit' : ''));
if (logoutReason === 'SESSION_EXPIRED' && tf_scanUiInProgress && resumeAction) {
try { tf_queueResumeAfterLogin(resumeAction, { source: 'session_expired_during_scan', origin: activeOrigin }); } catch (e) { }
try {
tf_sendStopProgress(() => {
try { tf_applyStopModeFromScanState(false, activeOrigin); } catch (e) { }
});
}
catch (e) { }
tf_forceLoginViewForResume(resumeAction, 'Session TradersFamily berakhir saat proses berjalan. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.', { source: 'session_expired_during_scan', origin: activeOrigin });
return;
}
const deferableDuringScan = logoutReason === 'NAVBAR_LOGGED_OUT' || logoutReason === 'PERIODIC_CHECK';
if (tf_scanUiInProgress && deferableDuringScan) {
"""
s=replace_once(s,old,new,'route session-expired running update/submit to login and auto-resume')
write(rel,s)

rel='assets/901c62026afc22f4.js'; s=read(rel)
anchor="""if (msg.type === 'tf_close_transient_login_tabs') {
"""
branch=r'''if (msg.type === 'tfLoggedOut' && String(msg.reason || '') === 'SESSION_EXPIRED') {
try {
if (tf_batchScanState && tf_batchScanState.active) {
const origin = String(tf_batchScanState.origin || '');
const action = origin === 'updateButton' ? 'update' : (origin === 'dashboardSubmit' ? 'dashboardSubmit' : (origin === 'isignalSubmit' ? 'isignalSubmit' : ''));
if (action) {
chrome.storage.local.set({
tfResumeAfterLoginV1: { action, createdAt: Date.now(), extra: { source: 'background_session_expired', origin } }
}, () => { try { void chrome.runtime.lastError; } catch (e) { } });
try { tf_requestStopBatchScan('session_expired_login_required'); } catch (e) { }
}
}
}
catch (e) { }
return;
}
'''
s=replace_once(s,anchor,branch+anchor,'background persist resume on session expiry')
write(rel,s)

(work/'README_REV376.md').write_text('''# TF Multi-Analyst Scanner REV376 — Login Required Auto Resume\n\nPerbaikan utama:\n- Update dan Submit melakukan fresh login preflight sebelum memulai proses.\n- Peringatan HTML `Silahkan login untuk mengakses halaman ini` pada `.alert-time/.alert-modal` dideteksi langsung, termasuk ketika muncul dinamis setelah halaman terbuka.\n- Jika session berakhir ketika Update atau Submit sedang berjalan, scan dihentikan aman, sidebar otomatis pindah ke halaman Login, dan action disimpan sebagai pending resume.\n- Setelah login + User Profile TradersFamily tervalidasi, Update/Submit dilanjutkan otomatis tanpa perlu klik ulang.\n- Pending resume disimpan di chrome.storage agar tetap ada bila side panel sempat ditutup.\n- Resume kedaluwarsa otomatis setelah 15 menit.\n\nVersion: 1.16.89\nRevision: REV376\n''',encoding='utf-8')

loader_rel='assets/7b6af0cb4001a684.js'; loader=read(loader_rel)
changed=['assets/dec74fd654ec6d54.js','assets/927ecbd63036f61b.js','assets/901c62026afc22f4.js','manifest.json']
dig={r:hashlib.sha256((work/r).read_bytes()).hexdigest() for r in changed}
marker='window.tfIntegrityReady = (async () => {'
block='// REV376 final integrity overrides - login-required auto-resume for Update/Submit.\n'+''.join([f'FILES[{json.dumps(r)}] = {json.dumps(dig[r])};\n' for r in changed])+'\n'
if 'REV376 final integrity overrides' in loader: raise AssertionError('already patched')
loader=replace_once(loader,marker,block+marker,'integrity override marker')
write(loader_rel,loader)

m=re.search(r'const FILES = (\{.*?\});',loader,re.S); files=json.loads(m.group(1))
for path,digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;',loader): files[path]=digest
mismatch=[]; missing=[]
for path,exp in files.items():
    f=work/path
    if not f.exists(): missing.append(path); continue
    act=hashlib.sha256(f.read_bytes()).hexdigest()
    if act!=exp: mismatch.append((path,exp,act))
assert not missing, missing
assert not mismatch, mismatch[:10]

if out.exists(): out.unlink()
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(work.rglob('*')):
        if p.is_file():
            relp=p.relative_to(work).as_posix()
            zi=zipfile.ZipInfo(relp,(2026,9,16,8,30,0)); zi.compress_type=zipfile.ZIP_DEFLATED; zi.external_attr=0o100644<<16
            z.writestr(zi,p.read_bytes(),compresslevel=9)
print('OUT',out)
print('ZIP_SHA256',hashlib.sha256(out.read_bytes()).hexdigest())
print('PROTECTED',len(files))
for r,h in dig.items(): print(r,h)
