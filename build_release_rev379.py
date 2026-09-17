import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

BASE_VERSION = '1.16.91'
BASE_REVISION = 'REV378'
NEW_VERSION = '1.16.92'
NEW_REVISION = 'REV379'
OUTPUT = 'TF_Extension_PC_MAC_REV379_DOM_LOGOUT_SIDEBAR_LOGIN_FIX.zip'

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
    count = text.count(old)
    if count != 1:
        raise AssertionError(f'{label}: expected 1 anchor, found {count}')
    return text.replace(old, new, 1)

helper_name = 'assets/tf-login-helper-rev205.js'
helper = data[helper_name].decode('utf-8')
old_start = """function detectLoginState() {
// REV206: stale account tabs cannot mutate global login state.
if (!__tf_isAuthTab && !__tf_isLogoutPath && !__tf_isProfileProbe) return;
if (!hasChromeStorage())
return;
try {
function tfIsVisible(el) {
"""
new_start = """function detectLoginState() {
if (!hasChromeStorage())
return;
try {
function tfIsVisible(el) {
"""
helper = replace_once(helper, old_start, new_start, 'helper detectLoginState entry')

old_expired = """const href = String(location.href || '');
const pathname = String(location.pathname || '');
const modal = document.getElementById('modal-notif');
const modalText = modal ? ((modal.innerText || modal.textContent || '').trim()) : '';
const sessionExpired = !!(modal && tfIsVisible(modal) && /Silahkan\\s*login/i.test(modalText));
const explicitLogoutUrl = /\\/logout\\/?(?:$|[?#])/i.test(href) || /(?:\\?|&)sign=out(?:&|$)/i.test(href);
if (sessionExpired && !explicitLogoutUrl && __tf_scanProtected && !__tf_isAuthTab) {
try { tf_deferScanLogoutEvidence('SESSION_EXPIRED', 'Modal login terdeteksi pada helper tab saat batch scan aktif'); } catch (e) { }
return;
}
if (sessionExpired || explicitLogoutUrl) {
"""
new_expired = """const href = String(location.href || '');
const pathname = String(location.pathname || '');
// REV379: detect the exact server-side login-required warning on EVERY account
// page, including the normal /?ret=... page reached after an Update/Submit tab
// loses its TradersFamily session. At this point the /channels/* content script
// has already been unloaded, so this account-wide helper must be authoritative.
let sessionExpiredAlert = null;
try {
const candidates = Array.from(document.querySelectorAll('#modal-notif, .alert-time, .alert-modal, .alert.alert-warning, .alert-warning'));
for (const el of candidates) {
  if (!tfIsVisible(el)) continue;
  const txt = String(el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim();
  if (/Silahkan\\s+login\\s+untuk\\s+mengakses\\s+halaman\\s+ini/i.test(txt)) {
    sessionExpiredAlert = el;
    break;
  }
}
}
catch (e) { }
const modal = sessionExpiredAlert || document.getElementById('modal-notif');
const modalText = modal ? ((modal.innerText || modal.textContent || '').trim()) : '';
const sessionExpired = !!(modal && tfIsVisible(modal) && /Silahkan\\s+login(?:\\s+untuk\\s+mengakses\\s+halaman\\s+ini)?/i.test(modalText));
const explicitLogoutUrl = /\\/logout\\/?(?:$|[?#])/i.test(href) || /(?:\\?|&)sign=out(?:&|$)/i.test(href);
// Explicit server warning is stronger than scan-protection. It means the server
// has already rejected the current authenticated request and the sidebar must
// switch to Login immediately, even while the Stop/cleanup state is unwinding.
if (sessionExpired || explicitLogoutUrl) {
"""
helper = replace_once(helper, old_expired, new_expired, 'helper explicit session warning')

anchor = """return;
}
// REV205: on TF Copy Signal/account pages, visible Masuk or Daftar is
"""
insert = """return;
}
// REV379: ordinary/stale account tabs remain passive unless they expose the exact
// authoritative session-expired warning handled above. This preserves REV206's
// stale-tab safety while allowing /?ret=... logout redirects to force Login.
if (!__tf_isAuthTab && !__tf_isLogoutPath && !__tf_isProfileProbe) return;
// REV205: on TF Copy Signal/account pages, visible Masuk or Daftar is
"""
helper = replace_once(helper, anchor, insert, 'helper stale guard relocation')
data[helper_name] = helper.encode('utf-8')

popup_name = 'assets/927ecbd63036f61b.js'
popup = data[popup_name].decode('utf-8')
old_force = """const tf_forceLoginViewForResume = (action, reason, extra) => {
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
tfLoginError: msg
}, () => { });
}
}
catch (e) { }
try { showLoginView(); } catch (e) { }
};
"""
new_force = """const tf_forceLoginViewForResume = (action, reason, extra) => {
const msg = String(reason || 'Session TradersFamily berakhir. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.');
try { tf_queueResumeAfterLogin(action, extra); } catch (e) { }
try {
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
tfLoginError: msg
}, () => { });
}
}
catch (e) { }
try { showLoginView(); } catch (e) { }
};
"""
popup = replace_once(popup, old_force, new_force, 'popup force-login scope')
data[popup_name] = popup.encode('utf-8')

manifest['version'] = NEW_VERSION
manifest['version_name'] = NEW_REVISION
manifest['description'] = 'REV379: exact TradersFamily DOM logout warning on account redirect forces sidebar Login immediately; protected hashes regenerated.'
data['manifest.json'] = (json.dumps(manifest, indent=2, ensure_ascii=False) + '\n').encode('utf-8')
data['README_REV379.md'] = (
    '# REV379 - DOM Logout Sidebar Login Fix\n\n'
    'When TradersFamily redirects a scan/update/submit tab to the account login page and renders '
    '`Silahkan login untuk mengakses halaman ini`, the account-wide helper now treats that exact server warning '
    'as authoritative logout evidence on normal account pages. The side panel immediately switches to Login, '
    'the interrupted Update/Submit remains queued for resume, and protected-file hashes are regenerated.\n'
).encode('utf-8')

loader_candidates = []
for name, raw in data.items():
    if name.startswith('assets/') and name.endswith('.js') and b'const FILES =' in raw and b'window.tfIntegrityReady' in raw:
        loader_candidates.append(name)
assert len(loader_candidates) == 1, loader_candidates
loader_name = loader_candidates[0]
loader = data[loader_name].decode('utf-8')
marker = 'window.tfIntegrityReady = (async () => {'
assert marker in loader
changed = [helper_name, popup_name, 'manifest.json']
block = '// REV379 final integrity overrides - DOM logout -> sidebar Login fix.\n'
for name in changed:
    block += f'FILES["{name}"] = "{hashlib.sha256(data[name]).hexdigest()}";\n'
block += '\n'
loader = loader.replace(marker, block + marker, 1)
data[loader_name] = loader.encode('utf-8')

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

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name, value in sorted(data.items()):
        zi = zipfile.ZipInfo(name, (2026, 9, 18, 2, 35, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = 0o100644 << 16
        z.writestr(zi, value, compresslevel=9)

print('output=' + str(out))
print('integrity_loader=' + loader_name)
print('protected_entries=' + str(len(files)))
print('zip_size=' + str(out.stat().st_size))
print('zip_sha256=' + hashlib.sha256(out.read_bytes()).hexdigest())
