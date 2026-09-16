import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

BASE_VERSION = '1.16.89'
BASE_REVISION = 'REV376'
NEW_VERSION = '1.16.90'
NEW_REVISION = 'REV377'
OUTPUT = 'TF_Extension_PC_MAC_REV377_SESSION_EXPIRED_LOGIN_FIX.zip'

base = Path(sys.argv[1])
root = Path(__file__).resolve().parent
out = root / 'deliverables' / OUTPUT
out.parent.mkdir(exist_ok=True)

with zipfile.ZipFile(base) as z:
    data = {name: z.read(name) for name in z.namelist() if not name.endswith('/')}

manifest = json.loads(data['manifest.json'].decode('utf-8'))
assert manifest.get('version') == BASE_VERSION, manifest.get('version')
assert manifest.get('version_name') == BASE_REVISION, manifest.get('version_name')

def replace_once(text, old, new, label):
    if old not in text:
        raise AssertionError('anchor missing: ' + label)
    return text.replace(old, new, 1)

# 1) Channel content-script: explicit session-expired alert must notify from normal scan tabs.
content_name = 'assets/dec74fd654ec6d54.js'
content = data[content_name].decode('utf-8')
content = replace_once(
    content,
    "function tf_markLoggedOutAndNotify(message) {\nif (!__tf_rev206_authProbe) return;\ntry {\n",
    "function tf_markLoggedOutAndNotify(message) {\n// REV377 — an explicit TradersFamily login-required warning is authoritative on\n// normal channel/scan tabs too, not only on the hidden auth-probe tab.\n// REV376's auth-probe guard prevented the sidebar from hearing SESSION_EXPIRED\n// while Update/Submit was already scanning, leaving the UI stuck on Stop!.\ntry {\n",
    'content explicit logout notification'
)
data[content_name] = content.encode('utf-8')

# 2) Background: persist authoritative logout state and rebroadcast to the open side panel.
bg_name = 'assets/901c62026afc22f4.js'
bg = data[bg_name].decode('utf-8')
old_bg = """if (msg.type === 'tfLoggedOut' && String(msg.reason || '') === 'SESSION_EXPIRED') {
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
"""
new_bg = """if (msg.type === 'tfLoggedOut' && String(msg.reason || '') === 'SESSION_EXPIRED') {
try {
const now = Date.now();
const active = !!(tf_batchScanState && tf_batchScanState.active);
const origin = active ? String(tf_batchScanState.origin || '') : '';
const action = origin === 'updateButton' ? 'update' : (origin === 'dashboardSubmit' ? 'dashboardSubmit' : (origin === 'isignalSubmit' ? 'isignalSubmit' : ''));
const userMsg = 'Session TradersFamily berakhir. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.';
const patch = {
  tfLoginConfirmed: false,
  tfEnteredMain: false,
  tfForceLoginForm: true,
  tfRootLoginState: 'logged_out',
  tfRootLoginStateAt: now,
  tfAccountLoginState: 'logged_out',
  tfAccountLoginStateAt: now,
  tfLoginError: userMsg
};
if (action) {
  patch.tfResumeAfterLoginV1 = { action, createdAt: now, extra: { source: 'background_session_expired', origin } };
}
chrome.storage.local.set(patch, () => {
  try { void chrome.runtime.lastError; } catch (e) { }
  try {
    chrome.runtime.sendMessage({
      type: 'tfForceSidebarLoginView',
      reason: 'SESSION_EXPIRED',
      action,
      origin,
      message: userMsg,
      at: now
    }, () => { try { void chrome.runtime.lastError; } catch (e) { } });
  } catch (e) { }
});
if (active) {
  try { tf_requestStopBatchScan('session_expired_login_required'); } catch (e) { }
}
}
catch (e) { }
return;
}
"""
bg = replace_once(bg, old_bg, new_bg, 'background session-expired routing')
data[bg_name] = bg.encode('utf-8')

# 3) Side panel: force-login state must beat tfScanInProgress and stay visible during cleanup.
popup_name = 'assets/927ecbd63036f61b.js'
popup = data[popup_name].decode('utf-8')
helper_at = popup.index('const tf_forceLoginViewForResume')
old_helper = "tfAccountLoginStateAt: now,\ntfLoginError: ''\n}, () => { });\n"
pos = popup.find(old_helper, helper_at)
if pos < 0:
    raise AssertionError('anchor missing: force-login error message')
popup = popup[:pos] + popup[pos:].replace(old_helper, "tfAccountLoginStateAt: now,\ntfLoginError: msg\n}, () => { });\n", 1)

old_view = """} else if (scanInProgress) {
// REV212: tfScanInProgress itself is the protected-session authority. Non-manual logout
// evidence (stale auth tab, transient login form, idle session probe) must never replace
// the dashboard while the batch is active. Explicit Logout remains authoritative above.
candidateView = 'main';
if (forceLoginForm) {
try { chrome.storage.local.set({ tfForceLoginForm: false }, () => { }); } catch (e) { }
}
} else if (rootFresh && rootLoggedIn) {
"""
new_view = """} else if (forceLoginForm && (isSessionExpiredMsg || rootLoggedOut || accLoggedOut)) {
// REV377 — confirmed SESSION_EXPIRED/login-required is stronger than tfScanInProgress.
// Scan cleanup may still show Stop! briefly, but the sidebar must already show Login.
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (scanInProgress) {
// Keep Dashboard only for inconclusive/stale probes while a valid scan is active.
candidateView = 'main';
} else if (rootFresh && rootLoggedIn) {
"""
popup = replace_once(popup, old_view, new_view, 'side-panel view precedence')

listener_anchor = "if (msg.type === 'tfLoggedOut') {\n"
listener_add = """if (msg.type === 'tfForceSidebarLoginView' && String(msg.reason || '') === 'SESSION_EXPIRED') {
const forcedMessage = String(msg.message || 'Session TradersFamily berakhir. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.');
const forcedAction = String(msg.action || '');
const forcedOrigin = String(msg.origin || tf_scanUiOrigin || '');
try {
if (forcedAction) tf_queueResumeAfterLogin(forcedAction, { source: 'background_force_sidebar_login', origin: forcedOrigin });
} catch (e) { }
try { tf_applyStopModeFromScanState(false, forcedOrigin); } catch (e) { }
try {
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) loginStatusEl.textContent = forcedMessage;
setStatus(forcedMessage);
} catch (e) { }
try { showLoginView(); } catch (e) { }
return;
}
"""
popup = replace_once(popup, listener_anchor, listener_add + listener_anchor, 'forced side-panel login listener')
data[popup_name] = popup.encode('utf-8')

# 4) Version metadata.
manifest['version'] = NEW_VERSION
manifest['version_name'] = NEW_REVISION
manifest['description'] = 'REV377: force sidebar Login on TradersFamily session-expired alert during Update/Submit, then auto-resume after login.'
data['manifest.json'] = (json.dumps(manifest, indent=2, ensure_ascii=False) + '\n').encode('utf-8')
data['README_REV377.md'] = b'# REV377 - Session Expired Sidebar Login Fix\n\nUpdate/Submit now switches the side panel to Login immediately when TradersFamily returns the login-required warning, even while scan cleanup is still stopping. The interrupted action remains queued and resumes automatically after successful login.\n'

# 5) Regenerate protected hashes for every changed protected file.
loader_candidates = []
for name, raw in data.items():
    if name.startswith('assets/') and name.endswith('.js') and b'const FILES =' in raw and b'window.tfIntegrityReady' in raw:
        loader_candidates.append(name)
assert len(loader_candidates) == 1, loader_candidates
loader_name = loader_candidates[0]
loader = data[loader_name].decode('utf-8')
marker = 'window.tfIntegrityReady = (async () => {'
assert marker in loader
changed = [content_name, bg_name, popup_name, 'manifest.json']
block = '// REV377 final integrity overrides - session-expired sidebar login + auto-resume.\n'
for name in changed:
    block += f'FILES["{name}"] = "{hashlib.sha256(data[name]).hexdigest()}";\n'
block += '\n'
loader = loader.replace(marker, block + marker, 1)
data[loader_name] = loader.encode('utf-8')

# Verify effective registry against exact final bytes.
m = re.search(r'const FILES = (\{.*?\});', loader, re.S)
assert m, 'integrity FILES object missing'
files = json.loads(m.group(1))
for path, digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;', loader):
    files[path] = digest
missing = []
mismatch = []
for path, expected in files.items():
    if path not in data:
        missing.append(path)
        continue
    actual = hashlib.sha256(data[path]).hexdigest()
    if actual != expected:
        mismatch.append((path, expected, actual))
assert not missing, missing
assert not mismatch, mismatch

# Deterministic package.
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name, value in sorted(data.items()):
        zi = zipfile.ZipInfo(name, (2026, 9, 17, 1, 55, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = 0o100644 << 16
        z.writestr(zi, value, compresslevel=9)

print('output=' + str(out))
print('integrity_loader=' + loader_name)
print('protected_entries=' + str(len(files)))
print('zip_sha256=' + hashlib.sha256(out.read_bytes()).hexdigest())
