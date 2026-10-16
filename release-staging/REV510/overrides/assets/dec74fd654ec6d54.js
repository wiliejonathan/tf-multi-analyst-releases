const __tf_rev206_authProbe = (() => { try { return new URL(location.href).searchParams.get('tfext_auth_probe') === '1'; } catch (e) { return false; } })();
const TF_MONTH_NAMES = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'
];
function tf_captureUserProfile() {
if (!__tf_rev206_authProbe) return false;
try {
if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local)
return false;
const visible = (el) => {
try {
if (!el) return false;
const style = getComputedStyle(el);
if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) return false;
const rect = el.getBoundingClientRect();
return !!(rect && rect.width > 0 && rect.height > 0);
}
catch (e) { return false; }
};
const first = (selectors) => {
for (const selector of selectors) {
try {
const nodes = Array.from(document.querySelectorAll(selector));
const hit = nodes.find(visible) || nodes[0];
if (hit) return hit;
}
catch (e) { }
}
return null;
};
const text = (el) => String(el && (el.value || el.innerText || el.textContent || el.getAttribute && (el.getAttribute('title') || el.getAttribute('aria-label'))) || '').trim().split(/\r?\n/).map((v) => v.trim()).filter(Boolean)[0] || '';
const tf_profileCleanEmail = (value) => {
try {
const m = String(value || '').replace(/^mailto:/i, '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
return m && m[0] ? m[0].trim().toLowerCase() : '';
}
catch (e) { return ''; }
};
const tf_profileGenericName = (value) => {
const v = String(value || '').trim();
return !v || v.length > 90 || /@/.test(v) || /^(profile|user profile|account|settings|keluar|logout|online|offline|akun tradersfamily|user|dashboard|beranda|menu)$/i.test(v);
};
const tf_profileDefaultAvatar = (value) => /user-default|default[-_]?avatar|avatar[-_]?default|placeholder|no[-_]?avatar/i.test(String(value || ''));
const tf_profileNormalizeUrl = (value) => {
try { return value ? new URL(String(value), location.href).href : ''; }
catch (e) { return ''; }
};
const tf_profileStorage = (() => {
const out = {};
const seen = new WeakSet();
const walk = (source, depth) => {
try {
if (!source || depth > 5) return;
if (typeof source === 'string') {
if (!out.email) out.email = tf_profileCleanEmail(source);
if ((source[0] === '{' || source[0] === '[') && source.length < 500000) {
try { walk(JSON.parse(source), depth + 1); } catch (e) { }
}
return;
}
if (typeof source !== 'object' || seen.has(source)) return;
seen.add(source);
Object.entries(source).forEach(([rawKey, rawValue]) => {
const key = String(rawKey || '').toLowerCase().replace(/[^a-z0-9]/g, '');
if (rawValue == null) return;
const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
if (!out.email && /^(email|emailaddress|mail)$/.test(key)) out.email = tf_profileCleanEmail(value);
if (!out.name && /^(displayname|username|fullname|name|userdisplayname)$/.test(key) && typeof value === 'string' && !tf_profileGenericName(value)) out.name = value;
if (!out.avatarUrl && /^(photourl|avatarurl|avatar|picture|profilepicture|profileimage|imageurl)$/.test(key) && typeof value === 'string' && !tf_profileDefaultAvatar(value)) out.avatarUrl = tf_profileNormalizeUrl(value) || value;
if (!out.profileUrl && /^(profileurl|profilelink|userurl)$/.test(key) && typeof value === 'string') out.profileUrl = tf_profileNormalizeUrl(value);
if (depth < 5 && typeof rawValue === 'object') walk(rawValue, depth + 1);
});
}
catch (e) { }
};
try {
[localStorage, sessionStorage].forEach((store) => {
for (let i = 0; i < store.length; i += 1) {
const key = store.key(i);
const value = key ? store.getItem(key) : '';
if (!value || value.length > 750000) continue;
if (/firebase|auth|user|profile|account|login|session/i.test(key) || /@/.test(value)) walk(value, 0);
}
});
}
catch (e) { }
return out;
})();
const imgEl = first(['.pull-left.image img.img-circle', '.pull-left.image img', '.user-panel img', 'li.dropdown.user img', '.user-menu img', '.user-header img', 'a[href*="/profile/u/"] img', '.profile-user-img', '.box-profile img', 'header img.img-circle', 'img.img-circle']);
const nameEl = first(['.pull-left.info #username_text', '.pull-left.info p.truncate', '#username_text', '.user-panel .info p', '[data-user-name]', '.user-menu .user-name', '.user-panel .info a', '.profile-username', '.box-profile .profile-username', 'input[name="name"][value]', 'input[name="fullname"][value]', '.user-name', '[class*="username"]']);
const statusEl = first(['.pull-left.info small', '.user-panel .info small', '.user-status', '[data-user-status]']) || (nameEl && nameEl.parentElement && nameEl.parentElement.querySelector('small'));
// REV206 — old channel tabs are passive; fresh root probe owns login status.
// If either Masuk or Daftar is visibly present, the website session is logged out.
// Do not let the generic `.user-menu` container be mistaken for an authenticated user menu.
const masukMenuEl = first([
'li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]',
'li.user.user-menu.m a[href*="account.tradersfamily.id/login"]',
'a[data-track="gtm_c_sb_nav_msk"]',
'a[href*="account.tradersfamily.id/login/"]'
]);
const daftarMenuEl = first([
'li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]',
'li.user.user-menu.m a[href*="account.tradersfamily.id/register"]',
'a[data-track="gtm_c_sb_nav_rgstr"]',
'a[href*="account.tradersfamily.id/register/"]'
]);
const visibleLoggedOutMenu = !!((masukMenuEl && visible(masukMenuEl)) || (daftarMenuEl && visible(daftarMenuEl)));
const loggedMarker = first(['a[href*="/logout/"]', 'a[data-track="gtm_c_sb_nav_keluar"]', '#username_text', '.pull-left.info', '.user-panel .info', 'li.dropdown.user', 'a[href*="/profile/u/"]']);
const isLoggedIn = !visibleLoggedOutMenu && !!((text(nameEl) && !/^(profile|user profile|account|settings|keluar|logout|masuk|daftar)$/i.test(text(nameEl))) || (loggedMarker && visible(loggedMarker)));
if (visibleLoggedOutMenu) {
try {
const now = Date.now();
chrome.storage.local.set({
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfLoginConfirmed: false,
tfLoginConfirmedAt: now,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true,
tfProfileNeedsRefresh: false,
tfLoginError: 'Session TradersFamily tidak aktif. Silakan login.'
}, function () { try { void chrome.runtime.lastError; } catch (e) { } });
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], function () { try { void chrome.runtime.lastError; } catch (e) { } });
}
catch (e) { }
return false;
}
const captured = {};
if (imgEl) {
let src = String(imgEl.currentSrc || imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy-src') || imgEl.getAttribute('data-original') || '').trim();
try { if (src) src = new URL(src, location.href).href; } catch (e) { }
if (src && !tf_profileDefaultAvatar(src)) captured.avatarUrl = src;
}
if (!captured.avatarUrl && tf_profileStorage.avatarUrl && !tf_profileDefaultAvatar(tf_profileStorage.avatarUrl)) captured.avatarUrl = tf_profileStorage.avatarUrl;
if (!captured.avatarUrl) {
try {
const bgNodes = Array.from(document.querySelectorAll('[style*="background-image"], .avatar, .user-avatar, .profile-avatar, .user-image'));
for (const node of bgNodes) {
const raw = String(getComputedStyle(node).backgroundImage || node.style.backgroundImage || '');
const match = raw.match(/url\(["']?([^"')]+)["']?\)/i);
const bgUrl = match && match[1] ? tf_profileNormalizeUrl(match[1]) : '';
if (bgUrl && !tf_profileDefaultAvatar(bgUrl)) { captured.avatarUrl = bgUrl; break; }
}
}
catch (e) { }
}
let name = text(nameEl);
if (/^(profile|user profile|account|settings|keluar|logout)$/i.test(name)) name = '';
if (!name && tf_profileStorage.name && !tf_profileGenericName(tf_profileStorage.name)) name = tf_profileStorage.name;
if (name) captured.name = name;
if (isLoggedIn) captured.statusText = 'Online';
else if (statusEl && text(statusEl)) captured.statusText = text(statusEl);
try {
const profileLink = first(['a[href*="/profile/u/"]', '[data-url*="/profile/u/"]', '[data-href*="/profile/u/"]']);
let raw = profileLink ? (profileLink.getAttribute('href') || profileLink.getAttribute('data-url') || profileLink.getAttribute('data-href') || '') : '';
if (!raw && /\/profile\/u\/\d+\/?/i.test(location.pathname)) raw = location.href;
if (!raw && tf_profileStorage.profileUrl) raw = tf_profileStorage.profileUrl;
if (raw) captured.profileUrl = new URL(raw, location.origin).href;
}
catch (e) { }
try {
let email = '';
const mailEl = first(['[data-user-email]', 'a[href^="mailto:"]']);
if (mailEl) email = String(mailEl.getAttribute('data-user-email') || mailEl.getAttribute('href') || text(mailEl) || '').replace(/^mailto:/i, '').trim().toLowerCase();
if (!email) email = tf_profileCleanEmail(tf_profileStorage.email);
if (!email) {
const roots = [document.querySelector('.user-header'), document.querySelector('.user-menu'), document.querySelector('.dropdown-menu'), document.querySelector('.user-panel'), document.querySelector('header'), document.querySelector('.main-header')].filter(Boolean);
for (const root of roots) {
const match = String(root.innerText || root.textContent || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
if (match && match[0]) { email = match[0].trim().toLowerCase(); break; }
}
}
if (!email && /\/profile\/u\/\d+\/?/i.test(location.pathname)) email = tf_profileCleanEmail(document.body && (document.body.innerText || document.body.textContent || ''));
if (email) captured.email = email;
}
catch (e) { }
if (!captured.name && !captured.avatarUrl && !captured.statusText && !captured.email && !captured.profileUrl)
return false;
chrome.storage.local.get(['tfUserProfile', 'tfStableProfileEmail', 'tfRememberLogin', 'tfExplicitLogoutAt'], function (data) {
try {
const existing = data && data.tfUserProfile && typeof data.tfUserProfile === 'object' ? data.tfUserProfile : {};
const merged = {
name: String(existing.name || '').trim(),
email: String(existing.email || '').trim().toLowerCase(),
avatarUrl: String(existing.avatarUrl || '').trim(),
statusText: String(existing.statusText || '').trim(),
profileUrl: String(existing.profileUrl || existing.url || '').trim()
};
['name', 'email', 'avatarUrl', 'statusText', 'profileUrl'].forEach(function (key) {
let value = String(captured[key] || '').trim();
if (key === 'email') value = value.toLowerCase();
if (value) merged[key] = value;
});
if (!merged.email) {
const stableEmail = String(data && data.tfStableProfileEmail || '').trim().toLowerCase();
const remember = data && data.tfRememberLogin ? data.tfRememberLogin : null;
const rememberedEmail = remember && remember.enabled ? String(remember.email || '').trim().toLowerCase() : '';
merged.email = stableEmail || rememberedEmail;
}
if (isLoggedIn) merged.statusText = 'Online';
const payload = { tfUserProfile: merged };
if (merged.email) payload.tfStableProfileEmail = merged.email;
if (isLoggedIn) {
const explicitLogoutAt = Number(data && data.tfExplicitLogoutAt || 0);
let pageLoadAt = 0;
try { pageLoadAt = Number(performance && performance.timeOrigin || 0); } catch (e) { }
const stalePreLogoutPage = !!(explicitLogoutAt && pageLoadAt && pageLoadAt < explicitLogoutAt);
if (!stalePreLogoutPage && !explicitLogoutAt) {
payload.tfLoginConfirmed = true;
payload.tfLoginConfirmedAt = Date.now();
payload.tfAccountLoginState = 'logged_in';
payload.tfAccountLoginStateAt = Date.now();
payload.tfEnteredMain = true;
payload.tfForceLoginForm = false;
}
// REV202: account/channels content must never write tfRootLoginState.
// The public tradersfamily.id navbar remains the root-session authority.
}
chrome.storage.local.set(payload, function () { try { void chrome.runtime.lastError; } catch (e) { } });
}
catch (e) { }
});
return isLoggedIn;
}
catch (e) {
console.warn('TF: gagal baca user profile', e);
return false;
}
}
tf_captureUserProfile();
try { [500, 1200, 2500, 5000].forEach((delay) => setTimeout(tf_captureUserProfile, delay)); } catch (e) { }
let tf_stopScanRequested = false;
let tf_scanInProgress = false;
let tf_pauseRequested = false;
let tf_pauseDueToHidden = false;
function tf_setScanInProgress(v) {
tf_scanInProgress = !!v;
if (!tf_scanInProgress) {
try {
tf_pauseRequested = false;
tf_pauseDueToHidden = false;
}
catch (e) { }
try {
tf_hideResumeOverlay();
}
catch (e) { }
}
}
function tf_resumeScan() {
tf_pauseRequested = false;
tf_pauseDueToHidden = false;
try {
tf_hideResumeOverlay();
}
catch (e) { }
}
async function tf_waitIfPaused() {
while (tf_pauseRequested) {
tf_abortIfStop();
await new Promise(resolve => setTimeout(resolve, 250));
}
}
function tf_ensureResumeOverlay() {
try {
if (document.getElementById('tf-resume-overlay'))
return;
const wrap = document.createElement('div');
wrap.id = 'tf-resume-overlay';
wrap.style.cssText = [
'position:fixed', 'inset:0', 'z-index:2147483647',
'display:none', 'align-items:center', 'justify-content:center',
'padding:16px', 'background:rgba(2,6,23,0.72)', 'backdrop-filter:blur(10px)'
].join(';');
const card = document.createElement('div');
card.style.cssText = [
'width:min(520px,calc(100vw - 28px))',
'border-radius:16px', 'border:1px solid rgba(148,163,184,0.28)',
'background:rgba(15,23,42,0.92)', 'box-shadow:0 20px 80px rgba(0,0,0,0.45)',
'padding:18px 18px 14px 18px', 'color:#e2e8f0', 'font-family:system-ui,Segoe UI,Arial'
].join(';');
const title = document.createElement('div');
title.textContent = 'Apakah ingin melanjutkan scan data?';
title.style.cssText = 'font-size:16px;font-weight:800;margin-bottom:10px;';
const note = document.createElement('div');
note.textContent = 'Scan dijeda karena kamu pindah tab. Tekan Resume untuk lanjut.';
note.style.cssText = 'font-size:13px;opacity:0.85;line-height:1.45;margin-bottom:14px;';
const btn = document.createElement('button');
btn.type = 'button';
btn.textContent = 'Resume!';
btn.style.cssText = [
'border:none', 'border-radius:12px', 'padding:10px 16px',
'font-weight:800', 'cursor:pointer',
'background:#22c55e', 'color:#06230f'
].join(';');
btn.addEventListener('click', () => {
try {
tf_resumeScan();
}
catch (e) { }
});
const copy = document.createElement('div');
copy.innerHTML = '© 2025 <a href="mailto:wiliejonathan@gmail.com">wiliejonathan@gmail.com</a><br>Instagram <a href="https://www.instagram.com/wilie_jonathan/" target="_blank" rel="noopener noreferrer">Wilie_jonathan</a>';
copy.style.cssText = 'margin-top:12px;font-size:11px;opacity:0.65;line-height:1.3;text-align:center;';
try {
copy.querySelectorAll('a').forEach(a => { a.style.color = 'inherit'; a.style.textDecoration = 'none'; a.style.fontWeight = '600'; });
}
catch (e) { }
card.appendChild(title);
card.appendChild(note);
card.appendChild(btn);
card.appendChild(copy);
wrap.appendChild(card);
document.documentElement.appendChild(wrap);
}
catch (e) { }
}
function tf_showResumeOverlay() {
try {
tf_ensureResumeOverlay();
const el = document.getElementById('tf-resume-overlay');
if (el)
el.style.display = 'flex';
}
catch (e) { }
}
function tf_hideResumeOverlay() {
try {
const el = document.getElementById('tf-resume-overlay');
if (el)
el.style.display = 'none';
}
catch (e) { }
}
try {
document.addEventListener('visibilitychange', () => {
try {
if (!tf_scanInProgress)
return;
if (document.hidden) {
tf_pauseRequested = true;
tf_pauseDueToHidden = true;
}
else {
if (tf_pauseDueToHidden) {
tf_showResumeOverlay();
}
}
}
catch (e) { }
});
}
catch (e) { }
function tf_requestStopScan() { tf_stopScanRequested = true; }
function tf_resetStopScan() { tf_stopScanRequested = false; }
function tf_abortIfStop() {
if (tf_stopScanRequested) {
throw new Error('STOPPED');
}
}
async function tf_sleep(ms) {
const step = 200;
let left = Math.max(0, Number(ms) || 0);
while (left > 0) {
tf_abortIfStop();
await tf_waitIfPaused();
const chunk = Math.min(step, left);
await new Promise(resolve => setTimeout(resolve, chunk));
left -= chunk;
}
await tf_waitIfPaused();
tf_abortIfStop();
}
function tf_isElementVisible(el) {
if (!el)
return false;
try {
const style = (typeof getComputedStyle === 'function') ? getComputedStyle(el) : null;
if (style) {
if (style.display === 'none' || style.visibility === 'hidden')
return false;
if (String(style.opacity || '') === '0')
return false;
}
if (el.offsetParent === null && !(style && style.position === 'fixed')) {
return false;
}
if (typeof el.getBoundingClientRect === 'function') {
const r = el.getBoundingClientRect();
if (r && (r.width === 0 || r.height === 0))
return false;
}
return true;
}
catch (e) {
return true;
}
}
async function tf_isignalEnsureLoadMoreBeforeScan() {
while (true) {
try {
tf_abortIfStop();
}
catch (e) { }
await tf_waitIfPaused();
let beforeH = 0;
try {
beforeH = Math.max(document.documentElement ? (document.documentElement.scrollHeight || 0) : 0, document.body ? (document.body.scrollHeight || 0) : 0);
window.scrollTo(0, beforeH);
}
catch (e) { }
try {
await tf_sleep(250);
}
catch (e) { }
const btn = document.querySelector('#btnLoad.btnLoad') ||
document.querySelector('#btnLoad') ||
document.querySelector('.btn-load #btnLoad') ||
document.querySelector('button.btnLoad');
if (!btn)
break;
if (btn.disabled)
break;
if (!tf_isElementVisible(btn))
break;
const beforeCards = (() => {
try {
return document.querySelectorAll('.signal-card').length;
}
catch (e) {
return 0;
}
})();
try {
btn.click();
}
catch (e) {
try {
btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
const start = Date.now();
let changed = false;
while (Date.now() - start < 15000) {
try {
await tf_sleep(350);
}
catch (e) {
break;
}
const nowCards = (() => {
try {
return document.querySelectorAll('.signal-card').length;
}
catch (e) {
return 0;
}
})();
let nowH = 0;
try {
nowH = Math.max(document.documentElement ? (document.documentElement.scrollHeight || 0) : 0, document.body ? (document.body.scrollHeight || 0) : 0);
}
catch (e) {
nowH = 0;
}
const btn2 = document.querySelector('#btnLoad.btnLoad') ||
document.querySelector('#btnLoad') ||
document.querySelector('.btn-load #btnLoad') ||
document.querySelector('button.btnLoad');
if (nowCards > beforeCards || nowH > beforeH + 20) {
changed = true;
break;
}
if (!btn2)
break;
if (btn2.disabled) {
changed = true;
break;
}
if (!tf_isElementVisible(btn2)) {
changed = true;
break;
}
}
if (!changed)
break;
try {
const newH = Math.max(document.documentElement ? (document.documentElement.scrollHeight || 0) : 0, document.body ? (document.body.scrollHeight || 0) : 0);
window.scrollTo(0, newH);
}
catch (e) { }
try {
await tf_sleep(220);
}
catch (e) { }
}
}
function tf_countMonthH4() {
try {
const h4s = Array.from(document.querySelectorAll('h4'));
let c = 0;
for (const h4 of h4s) {
const t = ((h4 && (h4.innerText || h4.textContent)) || '').trim();
if (!t)
continue;
const lower = t.toLowerCase();
for (const m of TF_MONTH_NAMES) {
if (lower.startsWith(m.toLowerCase())) {
c++;
break;
}
}
}
return c;
}
catch (e) {
return 0;
}
}
async function tf_waitForStatisticsDetailReady(timeoutMs) {
const maxMs = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0) ? timeoutMs : 9000;
const start = Date.now();
while (Date.now() - start < maxMs) {
tf_abortIfStop();
const hasYearBtn = !!document.querySelector('.btn-by-year');
const hasMonth = tf_countMonthH4() > 0;
if (hasYearBtn || hasMonth)
return true;
await tf_sleep(250);
}
return false;
}
function tf_isScrollable(el) {
try {
if (!el)
return false;
const canScroll = (el.scrollHeight || 0) > ((el.clientHeight || 0) + 10);
if (!canScroll)
return false;
const cs = window.getComputedStyle ? window.getComputedStyle(el) : null;
const oy = cs ? String(cs.overflowY || cs.overflow || '') : '';
return !oy || oy === 'auto' || oy === 'scroll' || oy === 'overlay';
}
catch (e) {
return false;
}
}
function tf_findHistoryScrollContainer() {
try {
const hist = document.querySelector('#tab_history');
const candidates = [];
candidates.push(scope.querySelector('#tglbuat'));
if (hist) {
candidates.push(hist);
if (hist.parentElement)
candidates.push(hist.parentElement);
const pane = hist.closest && hist.closest('.tab-pane');
if (pane)
candidates.push(pane);
}
if (document.scrollingElement)
candidates.push(document.scrollingElement);
if (document.documentElement)
candidates.push(document.documentElement);
if (document.body)
candidates.push(document.body);
for (const el of candidates) {
if (tf_isScrollable(el))
return el;
}
}
catch (e) {
}
return null;
}
async function tf_openHistoryTab() {
try {
const histLink = document.querySelector('a[href="#tab_history"]') ||
Array.from(document.querySelectorAll('a[data-toggle="tab"]')).find(a => /History Signal/i.test(a.innerText || 'History'));
if (histLink) {
histLink.click();
await tf_sleep(800);
}
}
catch (e) {
console.warn('TF: gagal klik tab History Signal', e);
}
}
async function tf_clickKembaliAfterStatistics(timeoutMs) {
const maxMs = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0) ? timeoutMs : 8000;
const start = Date.now();
const findKembali = () => {
try {
let a = document.querySelector('a.kmbl');
if (a)
return a;
a = Array.from(document.querySelectorAll('a[onclick]')).find(el => {
const oc = String(el.getAttribute('onclick') || '');
return /backPpmDetail\s*\(/i.test(oc);
});
if (a)
return a;
a = Array.from(document.querySelectorAll('a')).find(el => {
const t = tf_normText(el.innerText || el.textContent || '');
return t === 'kembali' || t.includes(' kembali');
});
return a || null;
}
catch (e) {
return null;
}
};
while (Date.now() - start < maxMs) {
tf_abortIfStop();
const a = findKembali();
if (a) {
try {
a.click();
}
catch (e) {
try {
a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(900);
const wStart = Date.now();
while (Date.now() - wStart < 6000) {
tf_abortIfStop();
const histLink = document.querySelector('a[href="#tab_history"]') || document.querySelector('#tab_history');
const statLink = document.querySelector('a[href="#tab_statistic"]') || document.querySelector('#tab_statistic');
if (histLink || statLink)
return true;
await tf_sleep(250);
}
return true;
}
await tf_sleep(250);
}
return false;
}
async function tf_waitForHistoryCardsStable(timeoutMs) {
const timeout = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0) ? timeoutMs : 8000;
const start = Date.now();
let lastCount = -1;
let stableMs = 0;
while (Date.now() - start < timeout) {
let count = 0;
try {
const root = document.querySelector('#tab_history') || document;
const cards = root.querySelectorAll ? root.querySelectorAll('.container-card') : null;
count = cards ? cards.length : 0;
}
catch (e) {
count = 0;
}
if (count !== lastCount) {
lastCount = count;
stableMs = 0;
}
else {
stableMs += 200;
if (count > 0 && stableMs >= 900)
break;
}
await tf_sleep(200);
}
await tf_sleep(220);
}

function tf_historyLoadingVisible() {
try {
const root = document.querySelector('#tab_history') || document;
const selectors = ['.loading','.loader','.spinner','.loading-overlay','.ajax-loading','.preloader','[aria-busy="true"]','.fa-spinner','.fa-circle-o-notch'];
const visible = (el) => {
  if (!el) return false;
  const cs = window.getComputedStyle(el);
  if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
  const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
  return !r || (r.width > 0 && r.height > 0);
};
for (const s of selectors) {
  const nodes = root.querySelectorAll ? root.querySelectorAll(s) : [];
  for (const el of nodes) if (visible(el)) return true;
}
return false;
}
catch (e) { return false; }
}
function tf_historyEndReachedNow() {
try {
const root = document.querySelector('#tab_history') || document;
const scrollEl = tf_findHistoryScrollContainer() || document.scrollingElement || document.documentElement || document.body;
let atBottom = false;
if (scrollEl && scrollEl !== document.body && scrollEl !== document.documentElement) {
  atBottom = ((scrollEl.scrollTop || 0) + (scrollEl.clientHeight || 0)) >= ((scrollEl.scrollHeight || 0) - 12);
} else {
  const se = document.scrollingElement || document.documentElement;
  const sh = se && se.scrollHeight ? se.scrollHeight : (document.body ? document.body.scrollHeight : 0);
  atBottom = (window.scrollY + window.innerHeight) >= (sh - 12);
}
const loadMore = Array.from(root.querySelectorAll ? root.querySelectorAll('button, a') : []).find((el) => {
  const txt = String(el && (el.innerText || el.textContent) || '').trim();
  if (!/load more|muat lebih|lihat lebih|selengkapnya/i.test(txt)) return false;
  const cs = window.getComputedStyle(el);
  const visible = cs && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
  return visible && !el.disabled;
});
const pager = root.querySelector ? root.querySelector('.pagination') : null;
let nextEnabled = false;
if (pager) {
  const next = pager.querySelector('a[rel="next"], a[aria-label="Next"], li.next a');
  const parent = next && next.closest ? next.closest('li') : null;
  nextEnabled = !!(next && !(parent && parent.classList.contains('disabled')));
}
return atBottom && !loadMore && !nextEnabled && !tf_historyLoadingVisible();
}
catch (e) { return false; }
}

async function tf_scrollHistoryToLastPage(options) {
const opts = (options && typeof options === 'object') ? options : {};
const fastEnd = opts.fastEnd === true;
const root = document.querySelector('#tab_history') || document;
const scrollEl = tf_findHistoryScrollContainer() || document.scrollingElement || document.documentElement || document.body;
const isAtBottom = () => {
try {
if (scrollEl && scrollEl !== document.body && scrollEl !== document.documentElement) {
const st = scrollEl.scrollTop || 0;
const ch = scrollEl.clientHeight || 0;
const sh = scrollEl.scrollHeight || 0;
return (st + ch) >= (sh - 10);
}
const se = document.scrollingElement || document.documentElement;
const sh = se && se.scrollHeight ? se.scrollHeight : (document.body ? document.body.scrollHeight : 0);
return (window.scrollY + window.innerHeight) >= (sh - 10);
}
catch (e) {
return false;
}
};
const getCount = () => {
try {
const r = document.querySelector('#tab_history') || document;
const list = r.querySelectorAll ? r.querySelectorAll('.container-card') : null;
return list ? list.length : 0;
}
catch (e) {
return 0;
}
};
const getHeight = () => {
try {
if (scrollEl && typeof scrollEl.scrollHeight === 'number')
return scrollEl.scrollHeight || 0;
}
catch (e) { }
try {
return (document.body && document.body.scrollHeight) ? document.body.scrollHeight : 0;
}
catch (e) {
return 0;
}
};
const isAtLastPageByPager = () => {
try {
const r = document.querySelector('#tab_history') || document;
const pager = r.querySelector('.pagination');
if (!pager)
return false;
const nextDisabled = pager.querySelector('li.disabled a[aria-label="Next"]') ||
pager.querySelector('li.disabled a[rel="next"]') ||
pager.querySelector('li.disabled a[title*="Next"]') ||
pager.querySelector('li.next.disabled, li.disabled.next');
if (nextDisabled)
return true;
const hasRelNext = !!pager.querySelector('a[rel="next"], a[aria-label="Next"]');
const active = pager.querySelector('li.active');
if (active && !hasRelNext)
return true;
return false;
}
catch (e) {
return false;
}
};
let lastMutationAt = Date.now();
let observer = null;
try {
observer = new MutationObserver(() => { lastMutationAt = Date.now(); });
observer.observe(root, { childList: true, subtree: true });
}
catch (e) {
observer = null;
}
const maxTotalMs = fastEnd ? 7000 : 16000;
const maxLoops = fastEnd ? 12 : 20;
const idleTarget = fastEnd ? 1 : 2;
let idle = 0;
let lastCount = getCount();
let lastHeight = getHeight();
const start = Date.now();
for (let i = 0; i < maxLoops; i++) {
if (Date.now() - start > maxTotalMs)
break;
if (isAtLastPageByPager())
break;
try {
const r = document.querySelector('#tab_history') || document;
const btn = Array.from(r.querySelectorAll('button, a'))
.find((el) => {
const t = (el && (el.innerText || el.textContent) || '').trim();
return /load more|muat lebih|lihat lebih|selengkapnya/i.test(t);
});
if (btn && !btn.disabled) {
const style = window.getComputedStyle(btn);
const visible = style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
if (visible) {
btn.click();
await tf_sleep(120);
}
}
}
catch (e) { }
try {
if (scrollEl && scrollEl !== document.body && scrollEl !== document.documentElement) {
scrollEl.scrollTop = scrollEl.scrollHeight;
}
else {
window.scrollTo(0, document.body ? document.body.scrollHeight : 999999);
}
}
catch (e) { }
await tf_sleep(120);
const beforeMutation = lastMutationAt;
const waitStart = Date.now();
let grew = false;
while (Date.now() - waitStart < (fastEnd ? 520 : 1000)) {
await tf_sleep(fastEnd ? 130 : 200);
const c = getCount();
const h = getHeight();
if (c > lastCount || h > lastHeight + 5) {
lastCount = c;
lastHeight = h;
grew = true;
break;
}
if (isAtBottom() && (Date.now() - lastMutationAt) > 550 && c === lastCount && h <= lastHeight + 5) {
break;
}
if (lastMutationAt !== beforeMutation) {
}
}
const c2 = getCount();
const h2 = getHeight();
if (!grew && c2 === lastCount && h2 <= lastHeight + 5) {
idle++;
}
else {
if (c2 > lastCount)
lastCount = c2;
if (h2 > lastHeight)
lastHeight = h2;
idle = 0;
}
if (fastEnd && tf_historyEndReachedNow())
break;
if (idle >= idleTarget)
break;
}
try {
if (observer)
observer.disconnect();
}
catch (e) { }
await tf_sleep(80);
}
function tf_hasLoginRequiredAlert() {
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
function tf_isSessionExpired() {
try {
if (tf_hasLoginRequiredAlert()) return true;
const isVisible = (el) => {
try {
if (!el)
return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0'))
return false;
if (el.hasAttribute && el.hasAttribute('hidden'))
return false;
if (String(el.getAttribute && el.getAttribute('aria-hidden') || '').toLowerCase() === 'true')
return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
}
catch (e) {
return false;
}
};
const modal = document.getElementById('modal-notif');
if (modal && isVisible(modal)) {
const t = (modal.innerText || modal.textContent || '').trim();
if (/Silahkan\s*login/i.test(t))
return true;
}
const href = String(location.href || '');
const explicitLoginUrl = /(?:\?|&)tfAuth=1(?:&|$)/i.test(href) || /(?:\?|&)tfAuthToken=/i.test(href) || /\/login(?:mt)?\/?(?:$|[?#])/i.test(href);
const loginNodes = [
document.getElementById('logname'),
document.getElementById('logpass'),
document.getElementById('btn-signin'),
document.querySelector('form.form-signin')
].filter(Boolean);
if (explicitLoginUrl && document.readyState === 'complete' && loginNodes.some(isVisible))
return true;
// REV205 — the account/channels page can remain open after logout and show
// explicit Masuk / Daftar navbar buttons instead of redirecting to /login/.
const loggedOutMenuNodes = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/register"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean);
if (loggedOutMenuNodes.some(isVisible))
return true;
}
catch (e) {
}
return false;
}
function tf_markLoggedOutAndNotify(message) {
// REV377 — an explicit TradersFamily login-required warning is authoritative on
// normal channel/scan tabs too, not only on the hidden auth-probe tab.
// REV376's auth-probe guard prevented the sidebar from hearing SESSION_EXPIRED
// while Update/Submit was already scanning, leaving the UI stuck on Stop!.
try {
const rawMsg = message || 'Silahkan login untuk mengakses halaman ini';
const userMsg = 'Session berakhir dan harus login lagi.';
try {
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
chrome.storage.local.set({
tfLoginConfirmed: false,
tfEnteredMain: false,
tfLoginError: userMsg,
tfForceLoginForm: true,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: Date.now()
}, function () { });
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail'], function () { });
}
}
catch (e) {
}
try {
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
chrome.runtime.sendMessage({
type: 'tfLoggedOut',
reason: 'SESSION_EXPIRED',
message: rawMsg,
userMessage: userMsg
});
}
}
catch (e) {
}
}
catch (e) {
}
}
let __tfLoginRequiredAlertNotifyAt = 0;
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
let __tfActiveJobToken = null;
let __tfActiveHistoryCheckpoint = null;
let __tfScanHeartbeatTimer = null;
let __tfScanProgressAt = 0;
let __tfScanProgressSignature = '';
let __tfScanProgressSeq = 0;
const TF_HISTORY_RESUME_SESSIONS_KEY = 'tfHistoryResumeSessions';
function tf_resumeStorageGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve(data || {});
});
}
catch (e) { resolve({}); }
});
}
function tf_resumeStorageSet(obj) {
return new Promise((resolve) => {
try {
chrome.storage.local.set(obj, () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) { resolve(); }
});
}
function tf_historyResumeKey(analystName, pair) {
const a = String(analystName || '').trim().toLowerCase();
const p = String(pair || '').trim().toUpperCase();
return a + '||' + p;
}
async function tf_loadHistoryResumeSession(analystName, pair) {
try {
const data = await tf_resumeStorageGet([TF_HISTORY_RESUME_SESSIONS_KEY]);
const map = data && data[TF_HISTORY_RESUME_SESSIONS_KEY] && typeof data[TF_HISTORY_RESUME_SESSIONS_KEY] === 'object'
? data[TF_HISTORY_RESUME_SESSIONS_KEY]
: {};
return map[tf_historyResumeKey(analystName, pair)] || null;
}
catch (e) { return null; }
}
async function tf_saveHistoryResumeSession(session) {
try {
if (!session || !session.analystName || !session.pair)
return false;
const data = await tf_resumeStorageGet([TF_HISTORY_RESUME_SESSIONS_KEY]);
const map = data && data[TF_HISTORY_RESUME_SESSIONS_KEY] && typeof data[TF_HISTORY_RESUME_SESSIONS_KEY] === 'object'
? { ...data[TF_HISTORY_RESUME_SESSIONS_KEY] }
: {};
const key = tf_historyResumeKey(session.analystName, session.pair);
map[key] = { ...session, updatedAt: Date.now() };
await tf_resumeStorageSet({ [TF_HISTORY_RESUME_SESSIONS_KEY]: map });
return true;
}
catch (e) { return false; }
}
async function tf_clearHistoryResumeSession(analystName, pair) {
try {
const data = await tf_resumeStorageGet([TF_HISTORY_RESUME_SESSIONS_KEY]);
const map = data && data[TF_HISTORY_RESUME_SESSIONS_KEY] && typeof data[TF_HISTORY_RESUME_SESSIONS_KEY] === 'object'
? { ...data[TF_HISTORY_RESUME_SESSIONS_KEY] }
: {};
const key = tf_historyResumeKey(analystName, pair);
if (Object.prototype.hasOwnProperty.call(map, key)) {
delete map[key];
await tf_resumeStorageSet({ [TF_HISTORY_RESUME_SESSIONS_KEY]: map });
}
return true;
}
catch (e) { return false; }
}
function tf_checkpointProgressSignature(checkpoint) {
try {
if (!checkpoint || typeof checkpoint !== 'object')
return '';
return JSON.stringify({
analystName: String(checkpoint.analystName || ''),
pair: String(checkpoint.pair || '').toUpperCase(),
batchIndex: Number(checkpoint.batchIndex || 0),
nextBatchIndex: Number(checkpoint.nextBatchIndex || 0),
targetStartMonth: String(checkpoint.targetStartMonth || ''),
targetEndMonth: String(checkpoint.targetEndMonth || ''),
calendarBackSteps: Number(checkpoint.calendarBackSteps || 0),
phase: String(checkpoint.phase || ''),
totalBatches: Number(checkpoint.totalBatches || 0)
});
}
catch (e) { return ''; }
}
function tf_noteScanProgress(label, detail, force) {
try {
let detailText = '';
if (detail !== undefined && detail !== null) {
try { detailText = typeof detail === 'string' ? detail : JSON.stringify(detail); }
catch (e) { detailText = String(detail); }
}
const signature = String(label || 'progress') + '|' + detailText;
if (force || signature !== __tfScanProgressSignature) {
__tfScanProgressSignature = signature;
__tfScanProgressAt = Date.now();
__tfScanProgressSeq += 1;
}
}
catch (e) { }
}
function tf_markScanProgress(label, detail) {
try {
tf_noteScanProgress(label, detail, false);
tf_emitScanJobHeartbeat({ phase: String(label || 'working') });
}
catch (e) { }
}
function tf_setActiveHistoryCheckpoint(checkpoint) {
try {
const next = checkpoint && typeof checkpoint === 'object'
? { ...checkpoint, jobToken: __tfActiveJobToken || checkpoint.jobToken || null, updatedAt: Date.now() }
: null;
__tfActiveHistoryCheckpoint = next;
const sig = tf_checkpointProgressSignature(next);
if (sig)
tf_noteScanProgress('checkpoint', sig, false);
}
catch (e) { __tfActiveHistoryCheckpoint = null; }
try { tf_emitScanJobHeartbeat(); } catch (e) { }
}
function tf_emitScanJobHeartbeat(extra) {
try {
if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage || !__tfActiveJobToken)
return;
chrome.runtime.sendMessage({
type: 'scanJobHeartbeat',
jobToken: __tfActiveJobToken,
ts: Date.now(),
progressAt: __tfScanProgressAt || Date.now(),
progressSignature: __tfScanProgressSignature || '',
progressSeq: __tfScanProgressSeq || 0,
checkpoint: __tfActiveHistoryCheckpoint ? { ...__tfActiveHistoryCheckpoint } : null,
phase: extra && extra.phase ? String(extra.phase) : (__tfActiveHistoryCheckpoint && __tfActiveHistoryCheckpoint.phase ? String(__tfActiveHistoryCheckpoint.phase) : 'working')
}, () => {
try { void chrome.runtime.lastError; } catch (e) { }
});
}
catch (e) { }
}
function tf_startScanJobHeartbeat(jobToken) {
try {
__tfActiveJobToken = jobToken ? String(jobToken) : null;
if (__tfScanHeartbeatTimer)
clearInterval(__tfScanHeartbeatTimer);
__tfScanHeartbeatTimer = null;
__tfScanProgressAt = Date.now();
__tfScanProgressSignature = 'starting';
__tfScanProgressSeq = 1;
if (!__tfActiveJobToken)
return;
tf_emitScanJobHeartbeat({ phase: 'starting' });
__tfScanHeartbeatTimer = setInterval(() => {
try { tf_emitScanJobHeartbeat(); } catch (e) { }
}, 15000);
}
catch (e) { }
}
function tf_stopScanJobHeartbeat() {
try {
if (__tfScanHeartbeatTimer)
clearInterval(__tfScanHeartbeatTimer);
}
catch (e) { }
__tfScanHeartbeatTimer = null;
__tfActiveHistoryCheckpoint = null;
__tfActiveJobToken = null;
__tfScanProgressAt = 0;
__tfScanProgressSignature = '';
__tfScanProgressSeq = 0;
}
function tf_emitHistoryBatchStatus(analystName, pair, batchIndex, stateText) {
try {
if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage)
return;
tf_noteScanProgress('history-status', {
analystName: analystName || '',
pair: pair || '',
batchIndex: (typeof batchIndex === 'number' ? batchIndex : null),
stateText: stateText || ''
}, false);
chrome.runtime.sendMessage({
type: 'historyBatchProgress',
analystName: analystName || '',
pair: pair || '',
batchIndex: (typeof batchIndex === 'number' ? batchIndex : null),
stateText: stateText || '',
jobToken: __tfActiveJobToken || null,
progressAt: __tfScanProgressAt || Date.now(),
progressSignature: __tfScanProgressSignature || '',
progressSeq: __tfScanProgressSeq || 0,
checkpoint: __tfActiveHistoryCheckpoint ? { ...__tfActiveHistoryCheckpoint } : null
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
catch (e) { }
}

function tf_getChannelIdFromUrl() {
try {
const href = window.location.href || '';
const m = href.match(/channels\/(\d+)/);
if (!m)
return null;
return m[1];
}
catch (e) {
return null;
}
}
function tf_getAnalystFromDOM() {
const selectors = [
'h1.judul-chnl-comp.large',
'h2.judul-chnl-comp.large',
'h1.judul-chnl-comp',
'h2.judul-chnl-comp',
'.judul-chnl-comp.large',
'.judul-chnl-comp',
'.channel-header h1',
'.channel-header h2',
'.channel-head h1',
'.channel-head h2',
'.header-channel h1',
'.header-channel h2'
];
for (const sel of selectors) {
const el = document.querySelector(sel);
if (!el)
continue;
const name = String(el.innerText || el.textContent || '').trim();
if (name)
return name;
}
try {
const chId = tf_getChannelIdFromUrl();
if (chId) {
const a = document.querySelector(`a[href*="/channels/${chId}"]`);
const t = a ? String(a.textContent || '').trim() : '';
if (t && !/^(channels?|tradersfamily)$/i.test(t))
return t;
}
}
catch (e) { }
return null;
}
function tf_getAnalystFromMeta() {
try {
const metas = [
'meta[property="og:title"]',
'meta[name="twitter:title"]',
'meta[name="title"]'
];
for (const sel of metas) {
const m = document.querySelector(sel);
const content = m && m.getAttribute ? String(m.getAttribute('content') || '').trim() : '';
if (!content)
continue;
let candidate = content;
if (candidate.includes('|'))
candidate = candidate.split('|')[0];
if (candidate.includes(' - '))
candidate = candidate.split(' - ')[0];
if (candidate.includes(' – '))
candidate = candidate.split(' – ')[0];
if (candidate.includes(' — '))
candidate = candidate.split(' — ')[0];
candidate = String(candidate || '').trim();
if (!candidate)
continue;
const lower = candidate.toLowerCase();
const bad = ['tradersfamily', 'account', 'channel', 'channels', 'signal', 'isignal'];
if (bad.some((b) => lower === b || lower.startsWith(b + ' ')))
continue;
return candidate;
}
}
catch (e) { }
return null;
}
function tf_getAnalystFromTitle() {
try {
const raw = (document.title || '').trim();
if (!raw)
return null;
let candidate = raw;
if (candidate.includes('|'))
candidate = candidate.split('|')[0];
if (candidate.includes(' - '))
candidate = candidate.split(' - ')[0];
if (candidate.includes(' – '))
candidate = candidate.split(' – ')[0];
if (candidate.includes(' — '))
candidate = candidate.split(' — ')[0];
candidate = (candidate || '').trim();
if (!candidate)
return null;
const lower = candidate.toLowerCase();
const bad = ['tradersfamily', 'account', 'channel', 'channels', 'signal', 'isignal'];
if (bad.some((b) => lower === b || lower.startsWith(b + ' '))) {
return null;
}
return candidate || null;
}
catch (e) {
return null;
}
}
async function tf_waitForAnalystName(timeoutMs) {
const maxMs = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0)
? timeoutMs
: 12000;
const start = Date.now();
while (Date.now() - start < maxMs) {
const n = tf_getAnalystFromDOM() || tf_getAnalystFromMeta() || tf_getAnalystFromTitle();
if (n)
return n;
await tf_sleep(400);
}
return tf_getAnalystFromDOM() || tf_getAnalystFromMeta() || tf_getAnalystFromTitle() || null;
}
function tf_getAnalystConfig(name) {
if (!name) {
name = tf_getAnalystFromDOM() || tf_getAnalystFromTitle();
}
if (!name)
return null;
return { name: name, pairs: [] };
}
async function tf_getSelectedTimeRangeSetting() {
try {
const data = await tf_storageGet(['tfSelectedTimeRange']);
const v = data ? data.tfSelectedTimeRange : null;
const allowed = new Set(['m3', 'm6', 'y1', 'y2', 'y3', 'y5', 'all_time']);
return allowed.has(v) ? v : 'all_time';
}
catch (e) {
return 'all_time';
}
}
async function tf_clickTimeRangeButton(periodKey) {
const allowedArr = ['m3', 'm6', 'y1', 'y2', 'y3', 'y5', 'all_time'];
const want = (typeof periodKey === 'string' && allowedArr.includes(periodKey)) ? periodKey : 'all_time';
function isAllButton(btn) {
try {
const id = String(btn && btn.id || '').toLowerCase();
if (id === 'all')
return true;
const txt = tf_normText(btn && btn.textContent || '');
return (txt === 'all');
}
catch (e) {
return false;
}
}
const buttons = Array.from(document.querySelectorAll('#btnByTime button, .bg-row-by-time button, button.btn-by-time'));
let target = null;
if (want === 'all_time') {
target = buttons.find(isAllButton);
}
else {
const idMap = { m3: '3m', m6: '6m', y1: '1y', y2: '2y', y3: '3y', y5: '5y' };
const wantId = idMap[want] || '';
target = buttons.find((b) => String(b && b.id || '').toLowerCase() === wantId);
if (!target) {
target = buttons.find((b) => {
const oc = String(b && b.getAttribute ? b.getAttribute('onclick') : '' || '');
if (!oc)
return false;
return oc.includes("'" + want + "'") || oc.includes('"' + want + '"') || oc.includes(want);
});
}
}
if (!target) {
const allSpan = document.getElementById('All') || document.querySelector('span.headFilter#All');
if (allSpan) {
allSpan.click();
await tf_sleep(180);
return;
}
}
if (!target) {
target = buttons.find(isAllButton);
}
if (target) {
try {
target.click();
await tf_sleep(180);
}
catch (e) { }
}
}
async function tf_preparePageForScan(analystName, allowedPairsFromMsg, prepareOptions) {
const prepOpts = (prepareOptions && typeof prepareOptions === 'object') ? prepareOptions : {};
const skipTimeRangeSelection = prepOpts.skipTimeRangeSelection === true;
const cfg = tf_getAnalystConfig(analystName);
let pairs = null;
if (allowedPairsFromMsg && allowedPairsFromMsg.length) {
pairs = allowedPairsFromMsg;
}
else if (cfg && cfg.pairs && cfg.pairs.length) {
pairs = cfg.pairs;
}
try {
const h3Candidates = Array.from(document.querySelectorAll('h3.box-title, h3.box-title.flex-ai-center'));
const filterH3 = h3Candidates.find(h => /Filter/i.test(h.innerText || ''));
if (filterH3) {
filterH3.click();
await tf_sleep(400);
}
}
catch (e) {
console.warn('TF: gagal klik Filter header', e);
}
if (!skipTimeRangeSelection) {
try {
const period = await tf_getSelectedTimeRangeSetting();
await tf_clickTimeRangeButton(period);
}
catch (e) {
console.warn('TF: gagal klik time range filter', e);
}
}
if (pairs && pairs.length) {
const p = pairs[0];
try {
const el = document.getElementById('symbol-' + p);
if (el) {
el.click();
await tf_sleep(200);
}
}
catch (e) {
console.warn('TF: gagal klik symbol', p, e);
}
}
try {
const btn = document.getElementById('apply-global-filter');
if (btn) {
btn.click();
await tf_sleep(1000);
}
}
catch (e) {
console.warn('TF: gagal klik apply-global-filter', e);
}
}
function tf_normText(s) {
return String(s || '')
.replace(/\s+/g, ' ')
.trim()
.toLowerCase();
}
async function tf_openStatisticsTab() {
try {
const statLink = document.querySelector('a[href="#tab_statistic"]') ||
Array.from(document.querySelectorAll('a[data-toggle="tab"]')).find((a) => /Statistic/i.test(a.innerText || ''));
if (statLink) {
statLink.click();
await tf_sleep(800);
}
}
catch (e) {
console.warn('TF: gagal klik tab Statistic', e);
}
}
function tf_hasTooFewSignalsMessage() {
try {
const statRoot = document.querySelector('#tab_statistic') || document.querySelector('div#tab_statistic') || null;
const root = statRoot || document.body;
const rootText = tf_normText(root ? (root.innerText || root.textContent || '') : '');
if (!rootText)
return false;
if (!rootText.includes('tidak dapat menampilkan data'))
return false;
if (!rootText.includes('jumlah signal terlalu sedikit'))
return false;
const h4 = Array.from((statRoot || document).querySelectorAll('h4')).find((el) => tf_normText(el.textContent).includes('tidak dapat menampilkan data'));
if (!h4)
return true;
const container = h4.closest('.data-detail-signal') || h4.parentElement;
const span = container ? container.querySelector('span') : null;
const spanText = tf_normText(span ? span.textContent : '');
if (spanText.includes('jumlah signal terlalu sedikit'))
return true;
const scope = statRoot || document;
const anySpan = Array.from(scope.querySelectorAll('span')).find((s) => tf_normText(s.textContent).includes('jumlah signal terlalu sedikit'));
return !!anySpan;
}
catch (e) {
return false;
}
}
async function tf_checkTooFewSignalsOnStatistics(timeoutMs) {
const maxMs = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0)
? timeoutMs
: 7000;
const start = Date.now();
await tf_openStatisticsTab();
while (Date.now() - start < maxMs) {
if (tf_hasTooFewSignalsMessage())
return true;
await tf_sleep(350);
}
return tf_hasTooFewSignalsMessage();
}
async function tf_clearAnalystDataInStorage(storageAnalystName, baseAnalystName, pairKey) {
let token = null;
try {
token = await tf_acquireStorageLock('tfMergeLock', 60000, 120000);
const data = await tf_storageGet(['tfMonthlyStats', 'tfHistorySignals', 'tfNoDataPairs', 'tfAvgSlPips']);
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
if (storageAnalystName && Object.prototype.hasOwnProperty.call(monthlyStats, storageAnalystName)) {
delete monthlyStats[storageAnalystName];
}
const oldHist = Array.isArray(data && data.tfHistorySignals) ? data.tfHistorySignals : [];
const pairUpper = String(pairKey || '').toUpperCase();
const newHist = oldHist.filter((it) => {
if (!it)
return false;
const a = String(it.analyst || it.analystName || '').trim();
if (!a)
return true;
if (a !== baseAnalystName)
return true;
if (!pairKey)
return false;
const p = String(it.pair || '').toUpperCase();
return p !== pairUpper;
});
const rawNoData = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper = String(pairKey).toUpperCase();
const baseMap = (rawNoData[base] && typeof rawNoData[base] === 'object') ? { ...rawNoData[base] } : {};
baseMap[pairUpper] = true;
rawNoData[base] = baseMap;
}
const rawAvgSl = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper2 = String(pairKey).toUpperCase();
if (rawAvgSl[base] && typeof rawAvgSl[base] === 'object') {
const baseMap2 = { ...rawAvgSl[base] };
delete baseMap2[pairUpper2];
if (Object.keys(baseMap2).length === 0) {
delete rawAvgSl[base];
}
else {
rawAvgSl[base] = baseMap2;
}
}
}
await tf_storageSet({ tfMonthlyStats: monthlyStats, tfHistorySignals: newHist, tfNoDataPairs: rawNoData, tfAvgSlPips: rawAvgSl });
}
catch (e) {
console.warn('TF: gagal clear data analis', e);
}
finally {
try {
await tf_releaseStorageLock('tfMergeLock', token);
}
catch (e) {
}
}
}
function tf_scanAverageSlPipsFromStatistics() {
try {
const spans = Array.from(document.querySelectorAll('span'));
for (const sp of spans) {
const label = tf_normText(sp && sp.textContent ? sp.textContent : '');
if (!label)
continue;
if (label.includes('average sl pips')) {
const block = sp.closest('.description-block') || sp.closest('.box-summary') || sp.parentElement;
if (block) {
const h5 = block.querySelector('h5.description-header') || block.querySelector('h5') || block.querySelector('.description-header');
const raw = (h5 && h5.textContent ? h5.textContent : '').replace(/,/g, '').trim();
const m = raw.match(/-?\d+(?:\.\d+)?/);
if (m) {
const v = parseFloat(m[0]);
if (Number.isFinite(v))
return v;
}
}
}
}
const candidates = Array.from(document.querySelectorAll('.description-block, .box-summary')).filter(Boolean);
for (const c of candidates) {
const labelEl = c.querySelector('span');
const label = tf_normText(labelEl && labelEl.textContent ? labelEl.textContent : '');
if (label.includes('average sl pips')) {
const h5 = c.querySelector('h5.description-header') || c.querySelector('h5') || c.querySelector('.description-header');
const raw = (h5 && h5.textContent ? h5.textContent : '').replace(/,/g, '').trim();
const m = raw.match(/-?\d+(?:\.\d+)?/);
if (m) {
const v = parseFloat(m[0]);
if (Number.isFinite(v))
return v;
}
}
}
}
catch (e) {
}
return null;
}
function tf_scanMonthlyStats(analystName) {
const result = {};
const h4s = Array.from(document.querySelectorAll('h4'));
if (!h4s.length)
return result;
h4s.forEach((h4) => {
const text = (h4.innerText || '').trim();
if (!text)
return;
const lower = text.toLowerCase();
const monthName = TF_MONTH_NAMES.find((m) => lower.startsWith(m.toLowerCase()));
if (!monthName)
return;
let year = null;
const yearMatch = text.match(/(\d{4})/);
if (yearMatch) {
year = parseInt(yearMatch[1], 10);
}
const monthIndex = TF_MONTH_NAMES.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());
if (monthIndex === -1)
return;
const monthKey = (year ? String(year).padStart(4, '0') : '0000') +
'-' +
String(monthIndex + 1).padStart(2, '0');
let signals = null;
let pips = null;
const searchRoots = [];
if (h4.parentElement)
searchRoots.push(h4.parentElement);
if (h4.parentElement && h4.parentElement.parentElement) {
searchRoots.push(h4.parentElement.parentElement);
}
let sibling = h4.nextElementSibling;
const siblingNodes = [];
while (sibling && sibling.tagName !== 'H4') {
siblingNodes.push(sibling);
sibling = sibling.nextElementSibling;
}
searchRoots.push(...siblingNodes);
searchRoots.forEach((root) => {
if (!root)
return;
if (signals == null) {
const ps = Array.from(root.querySelectorAll('p'));
for (const pEl of ps) {
const t = (pEl.innerText || '').trim();
if (!t)
continue;
const m = t.match(/(\d+)\s+Signals/i);
if (m) {
signals = parseInt(m[1], 10);
break;
}
}
}
if (pips == null) {
const spans = Array.from(root.querySelectorAll('span'));
for (const s of spans) {
const t = (s.innerText || '').trim().replace(/\s+/g, ' ');
if (!t)
continue;
const m = t.match(/(-?\d+(?:\.\d+)?)\s*Pips/i);
if (m) {
pips = parseFloat(m[1]);
break;
}
}
}
});
if (signals != null && pips != null) {
result[monthKey] = { pips, signals };
}
});
return result;
}
async function tf_scanMonthlyStatsAllYears(analystName) {
const rawButtons = Array.from(document.querySelectorAll('.btn-by-year'));
if (!rawButtons.length) {
return tf_scanMonthlyStats(analystName);
}
const buttons = [];
const seen = new Set();
rawButtons.forEach((btn) => {
if (!btn)
return;
const t = ((btn.innerText || btn.textContent) || '').trim();
const m = t.match(/(19|20)\d{2}/);
const yearKey = m ? m[0] : t;
if (!yearKey)
return;
if (!tf_isElementVisible(btn))
return;
if (seen.has(yearKey))
return;
seen.add(yearKey);
buttons.push(btn);
});
if (!buttons.length) {
return tf_scanMonthlyStats(analystName);
}
const aggregate = {};
for (const btn of buttons) {
tf_abortIfStop();
const beforeCount = tf_countMonthH4();
try {
btn.click();
}
catch (e) {
try {
btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
const start = Date.now();
const maxWait = 2200;
while (Date.now() - start < maxWait) {
tf_abortIfStop();
const c = tf_countMonthH4();
if (c !== beforeCount || (beforeCount === 0 && c > 0))
break;
await tf_sleep(120);
}
await tf_sleep(500);
const partial = tf_scanMonthlyStats(analystName);
if (partial && typeof partial === 'object') {
Object.keys(partial).forEach((key) => {
aggregate[key] = partial[key];
});
}
await tf_sleep(180);
}
return aggregate;
}
function tf_parseCreatedAtToSortKey(createdText) {
if (!createdText)
return null;
const m = createdText.match(/(\d{2}-\d{2}-\d{4}),\s*(\d{2}:\d{2})/);
if (!m)
return null;
const dateStr = m[1];
const timeStr = m[2];
const [ddStr, mmStr, yyyyStr] = dateStr.split('-');
const dd = parseInt(ddStr, 10);
const mm = parseInt(mmStr, 10);
const yyyy = parseInt(yyyyStr, 10);
const [hhStr, minStr] = timeStr.split(':');
const hh = parseInt(hhStr, 10);
const min = parseInt(minStr, 10);
if (!dd || !mm || !yyyy)
return null;
const d = new Date(yyyy, mm - 1, dd, hh || 0, min || 0, 0);
return d.getTime();
}
function tf_monthKeyFromDisplayDate(displayDate) {
try {
const t = String(displayDate || '').trim();
const m = t.match(/(\d{2})-(\d{2})-(\d{4})/);
if (!m)
return null;
const mm = String(m[2]).padStart(2, '0');
const yyyy = String(m[3]).padStart(4, '0');
return yyyy + '-' + mm;
}
catch (e) {
return null;
}
}
function tf_calcMonthCounts(items) {
const map = {};
try {
(Array.isArray(items) ? items : []).forEach((it) => {
const mk = tf_monthKeyFromDisplayDate(it && it.displayDate ? it.displayDate : '');
if (!mk)
return;
map[mk] = (map[mk] || 0) + 1;
});
}
catch (e) { }
return map;
}
function tf_readHistorySignalCardDetails(card) {
const out = {
type: '',
entry: '',
takeProfit: '',
stopLoss: ''
};
if (!card || !card.querySelectorAll)
return out;
const cleanText = (v) => String(v == null ? '' : v)
.replace(/\u00a0/g, ' ')
.replace(/\s+/g, ' ')
.trim();
const normalizeType = (v) => {
const raw = cleanText(v);
if (/^buy$/i.test(raw))
return 'Buy';
if (/^sell$/i.test(raw))
return 'Sell';
return raw;
};
try {
const rows = Array.from(card.querySelectorAll('.history-signal-bg li, ul.signal-bg li, li.history-card-padd, li.history-card-padd-last'));
rows.forEach((li) => {
if (!li || !li.querySelector)
return;
const labelEl = li.querySelector('.type-desc');
const valueEl = li.querySelector('.history-card-value') ||
li.querySelector('b.pull-right') ||
li.querySelector('.pull-right');
let label = cleanText(labelEl ? (labelEl.innerText || labelEl.textContent || '') : '');
let value = cleanText(valueEl ? (valueEl.innerText || valueEl.textContent || '') : '');
if (!label) {
const full = cleanText(li.innerText || li.textContent || '');
const known = full.match(/^(Type|Price|Entry|Take\s*Profit|TP|Stop\s*Loss|SL)\b\s*(.*)$/i);
if (known) {
label = cleanText(known[1]);
if (!value)
value = cleanText(known[2]);
}
}
const key = label.toLowerCase().replace(/[^a-z]/g, '');
if (!key)
return;
if (key === 'type') {
out.type = normalizeType(value);
}
else if (key === 'price' || key === 'entry') {
out.entry = value;
}
else if (key === 'takeprofit' || key === 'tp') {
out.takeProfit = value;
}
else if (key === 'stoploss' || key === 'sl') {
out.stopLoss = value;
}
});
}
catch (e) {
}
return out;
}
function tf_scanHistorySignalsFromRoot(root, analystName, allowedPairsFromCaller) {
let allowedPairs = null;
if (allowedPairsFromCaller && allowedPairsFromCaller.length) {
allowedPairs = allowedPairsFromCaller.map(p => String(p || '').replace(/\s+/g, '').toUpperCase());
}
else {
const cfg = tf_getAnalystConfig(analystName);
if (cfg && cfg.pairs && cfg.pairs.length) {
allowedPairs = cfg.pairs.map(p => String(p || '').replace(/\s+/g, '').toUpperCase());
}
}
const histRoot = root.querySelector('#tab_history') || root;
const cards = Array.from(histRoot.querySelectorAll('.container-card'));
const results = [];
cards.forEach(card => {
let pair = null;
const symbol = card.querySelector('.symbol-card');
if (symbol) {
const bs = Array.from(symbol.querySelectorAll('b'));
let rawPair = '';
for (const b of bs) {
const tt = String((b.innerText || b.textContent || '')).trim();
if (!tt)
continue;
if (tt.startsWith('#'))
continue;
if (/^[A-Za-z0-9]{3,10}$/.test(tt)) {
rawPair = tt;
break;
}
if (!rawPair) {
const firstTok = tt.split(/\s+/)[0] || '';
if (firstTok)
rawPair = firstTok;
}
}
if (!rawPair) {
const t = String((symbol.innerText || symbol.textContent || '')).trim();
rawPair = (t.split(/\s+/)[0] || '');
}
if (rawPair) {
pair = rawPair.replace(/\s+/g, '').toUpperCase();
}
}
if (!pair && allowedPairs && allowedPairs.length === 1) {
pair = allowedPairs[0];
}
if (allowedPairs && pair && !allowedPairs.includes(pair)) {
return;
}
const statusEl = card.querySelector('.text-active-new b') ||
card.querySelector('b.text-active-new') ||
card.querySelector('.text-active-new');
if (statusEl) {
const statusText = (statusEl.innerText || statusEl.textContent || '').trim();
if (/^Cancelled$/i.test(statusText) || /^Expired$/i.test(statusText)) {
return;
}
}
let closedAtText = null;
let createdAtText = null;
const ps = Array.from(card.querySelectorAll('p'));
for (const p of ps) {
const t = (p.innerText || p.textContent || '').trim();
if (!t)
continue;
if (!createdAtText && /Created\s*at/i.test(t)) {
const span = p.querySelector('span') || p.querySelector('.pull-right');
createdAtText = span ? (span.innerText || span.textContent || '').trim() : null;
if (!createdAtText) {
createdAtText = t.replace(/^Created\s*at\s*/i, '').trim();
}
}
if (!closedAtText && /Closed\s*at/i.test(t)) {
const span = p.querySelector('span') || p.querySelector('.pull-right');
closedAtText = span ? (span.innerText || span.textContent || '').trim() : null;
if (!closedAtText) {
closedAtText = t.replace(/^Closed\s*at\s*/i, '').trim();
}
}
if (createdAtText && closedAtText)
break;
}
if (!closedAtText) {
return;
}
if (!createdAtText) {
createdAtText = closedAtText;
}
const tf_normWIB = (s) => {
const raw = String(s || '').trim();
if (!raw)
return '';
const base = raw.replace(',', '').replace(/\s*WIB\s*$/i, '').trim();
return (base ? (base + ' WIB') : '');
};
const sortKey = tf_parseCreatedAtToSortKey(closedAtText);
const createdSortKey = tf_parseCreatedAtToSortKey(createdAtText);
const displayDate = tf_normWIB(closedAtText);
const createdDate = tf_normWIB(createdAtText);
let pips = null;
const pipsSpan = card.querySelector('.box-footer .text-active-new b') ||
card.querySelector('.box-footer b');
if (pipsSpan) {
const t = (pipsSpan.innerText || '').trim();
const m = t.match(/(-?\d+(?:\.\d+)?)\s*Pips/i);
if (m) {
pips = parseFloat(m[1]);
}
}
if (pips == null)
return;
let signalId = '';
try {
const idAttr = (card && card.getAttribute) ? String(card.getAttribute('id') || '').trim() : '';
if (idAttr)
signalId = idAttr;
}
catch (e) { }
if (!signalId) {
try {
const symbol2 = card.querySelector('.symbol-card');
if (symbol2) {
const t2 = String((symbol2.innerText || symbol2.textContent || '')).trim();
const m2 = t2.match(/#\s*(\d{3,})/);
if (m2)
signalId = m2[1];
}
}
catch (e) { }
}
if (!signalId) {
signalId = analystName + '|' + String(createdSortKey || '') + '|' + String(sortKey || '') + '|' + (pair || '');
}
const signalDetails = tf_readHistorySignalCardDetails(card);
results.push({
analyst: analystName,
pair: pair || '',
pips,
displayDate,
sortKey,
createdDate,
createdSortKey,
signalId,
entry: signalDetails.entry || '',
takeProfit: signalDetails.takeProfit || '',
stopLoss: signalDetails.stopLoss || '',
type: signalDetails.type || ''
});
});
return results;
}
function tf_collectHistoryPageUrls() {
const urls = new Set();
const histRoot = document.querySelector('#tab_history') || document;
const anchors = Array.from(histRoot.querySelectorAll('a[href]'));
const currentBase = window.location.href.replace(/#.*$/, '');
anchors.forEach(a => {
const href = a.getAttribute('href');
if (!href)
return;
if (!/[?&]page=\d+/i.test(href))
return;
try {
const url = new URL(href, window.location.href).href.replace(/#.*$/, '');
if (url !== currentBase) {
urls.add(url);
}
}
catch (e) {
}
});
return Array.from(urls);
}
async function tf_fetchDocument(url) {
let controller = null;
let timeoutId = null;
let resp = null;
try {
controller = new AbortController();
timeoutId = setTimeout(() => {
try { controller.abort(); } catch (e) { }
}, 25000);
resp = await fetch(url, { credentials: 'include', cache: 'no-store', signal: controller.signal });
}
catch (e) {
if (e && e.name === 'AbortError')
throw new Error('NETWORK_TIMEOUT ketika fetch ' + url);
throw e;
}
finally {
try { if (timeoutId) clearTimeout(timeoutId); } catch (e) { }
}
if (!resp || !resp.ok) {
throw new Error('HTTP ' + (resp ? resp.status : 'NO_RESPONSE') + ' ketika fetch ' + url);
}
const text = await resp.text();
const parser = new DOMParser();
const doc = parser.parseFromString(text, 'text/html');
try {
if (doc && (doc.getElementById('logname') || doc.getElementById('logpass') || doc.getElementById('btn-signin'))) {
throw new Error('SESSION_EXPIRED');
}
const modal = doc && doc.getElementById('modal-notif');
if (modal) {
const t = (modal.innerText || modal.textContent || '').trim();
if (/Silahkan\s*login/i.test(t)) {
throw new Error('SESSION_EXPIRED');
}
}
const loginAlerts = doc ? Array.from(doc.querySelectorAll('.alert-time .alert, .alert-modal .alert, .alert.alert-warning')) : [];
for (const node of loginAlerts) {
const t = String(node && (node.innerText || node.textContent) || '').replace(/\s+/g, ' ').trim();
if (/Silahkan\s+login\s+untuk\s+mengakses\s+halaman\s+ini/i.test(t)) throw new Error('SESSION_EXPIRED');
}
}
catch (e) {
if (String(e && e.message || e).includes('SESSION_EXPIRED'))
throw e;
}
return doc;
}
async function tf_scanHistorySignalsAllPages(analystName, allowedPairs, options) {
const scanOptions = (options && typeof options === 'object') ? options : {};
const fastEnd = scanOptions.fastEnd === true;

let all = [];
try { tf_markScanProgress('history-scan-start', { analystName: analystName || '', pair: Array.isArray(allowedPairs) && allowedPairs.length ? allowedPairs[0] : '' }); } catch (e) { }
try {
const t0 = Date.now();
while (Date.now() - t0 < 2200) {
tf_abortIfStop();
const histRoot = document.querySelector('#tab_history') || document;
const txt = tf_normText((histRoot && (histRoot.innerText || histRoot.textContent)) || '');
if (txt.includes('tidak dapat menampilkan data') && txt.includes('jumlah signal terlalu sedikit')) {
return [];
}
try {
const cardsNow = (histRoot && histRoot.querySelectorAll) ? histRoot.querySelectorAll('.container-card') : null;
if (cardsNow && cardsNow.length)
break;
}
catch (e) { }
await tf_sleep(180);
}
}
catch (e) { }
try {
const histRoot = document.querySelector('#tab_history') || document;
const txt = tf_normText((histRoot && (histRoot.innerText || histRoot.textContent)) || '');
if (txt.includes('tidak dapat menampilkan data') && txt.includes('jumlah signal terlalu sedikit')) {
return [];
}
}
catch (e) { }
try {
await tf_scrollHistoryToLastPage({ fastEnd });
tf_markScanProgress('history-scroll-last', { analystName: analystName || '' });
}
catch (e) { }
try {
await tf_waitForHistoryCardsStable(fastEnd ? 2600 : 9000);
tf_markScanProgress('history-cards-stable', { count: document.querySelectorAll('.container-card').length });
}
catch (e) { }
all = all.concat(tf_scanHistorySignalsFromRoot(document, analystName, allowedPairs));
try { tf_markScanProgress('history-root-read', { count: all.length }); } catch (e) { }
if (!all.length) {
try {
await tf_sleep(900);
await tf_waitForHistoryCardsStable(7000);
}
catch (e) { }
all = all.concat(tf_scanHistorySignalsFromRoot(document, analystName, allowedPairs));
}

if (fastEnd && tf_historyEndReachedNow()) {
const dedupFast = [];
const seenFast = new Set();
all.forEach((item) => {
const id = item && (item.signalId || (item.analyst + '|' + item.displayDate + '|' + (item.pair || '')));
if (!id || seenFast.has(id)) return;
seenFast.add(id);
dedupFast.push(item);
});
try { tf_markScanProgress('history-scan-complete-fast-end', { count: dedupFast.length }); } catch (e) { }
return dedupFast;
}
const seenAnyCardIds = new Set();
const tf_extractHistoryCardId = (cardEl) => {
if (!cardEl)
return '';
try {
const idAttr = (cardEl.getAttribute) ? String(cardEl.getAttribute('id') || '').trim() : '';
if (idAttr)
return idAttr;
}
catch (e) { }
try {
const sym = (cardEl.querySelector) ? cardEl.querySelector('.symbol-card') : null;
if (sym) {
const t = String((sym.innerText || sym.textContent || '')).trim();
const m = t.match(/#\s*(\d{3,})/);
if (m)
return m[1];
}
}
catch (e) { }
return '';
};
const tf_noteHistoryCardIds = (docLike) => {
let hasNew = false;
try {
const histRoot = (docLike && docLike.querySelector)
? (docLike.querySelector('#tab_history') || docLike)
: docLike;
const cards = (histRoot && histRoot.querySelectorAll)
? Array.from(histRoot.querySelectorAll('.container-card'))
: [];
for (const c of cards) {
const id = tf_extractHistoryCardId(c);
if (!id)
continue;
if (!seenAnyCardIds.has(id)) {
hasNew = true;
seenAnyCardIds.add(id);
}
}
}
catch (e) { }
return hasNew;
};
try {
tf_noteHistoryCardIds(document);
}
catch (e) { }
const seenIds = new Set();
const pushDedup = (items) => {
let added = 0;
(items || []).forEach((item) => {
if (!item)
return;
const id = item.signalId || (item.analyst + '|' + item.displayDate + '|' + (item.pair || ''));
if (seenIds.has(id))
return;
seenIds.add(id);
all.push(item);
added++;
});
return added;
};
all.forEach((item) => {
const id = item && (item.signalId || (item.analyst + '|' + item.displayDate + '|' + (item.pair || '')));
if (id)
seenIds.add(id);
});
const pageUrls = tf_collectHistoryPageUrls();
const urlSet = new Set(pageUrls);
let maxPage = 1;
try {
for (const u of pageUrls) {
try {
const nu = new URL(u, window.location.href);
const p = parseInt(nu.searchParams.get('page') || '0', 10);
if (p > maxPage)
maxPage = p;
}
catch (e) { }
}
}
catch (e) { }
for (const url of pageUrls) {
let lastErr = null;
for (let attempt = 1; attempt <= 2; attempt++) {
try {
const doc = await tf_fetchDocument(url);
try {
tf_noteHistoryCardIds(doc);
}
catch (e) { }
const part = tf_scanHistorySignalsFromRoot(doc, analystName, allowedPairs);
pushDedup(part);
try { tf_markScanProgress('history-page-read', { url: url, count: all.length }); } catch (e) { }
lastErr = null;
break;
}
catch (e) {
lastErr = e;
if (String(e && e.message || e).includes('SESSION_EXPIRED')) {
tf_markLoggedOutAndNotify('Silahkan login untuk mengakses halaman ini');
throw new Error('SESSION_EXPIRED: Silahkan login untuk mengakses halaman ini');
}
await tf_sleep(450 + Math.floor(Math.random() * 350));
}
}
if (lastErr) {
console.warn('TF: gagal fetch history page', url, lastErr);
}
await tf_sleep(180 + Math.floor(Math.random() * 220));
}
try {
const base = new URL(window.location.href.replace(/#.*$/, ''));
base.searchParams.delete('page');
const hardMax = (maxPage && maxPage > 1) ? maxPage : 80;
let noNewStreak = 0;
for (let p = 2; p <= hardMax; p++) {
base.searchParams.set('page', String(p));
const url = base.toString();
if (urlSet.has(url))
continue;
let added = 0;
let lastErr = null;
let pageHasNewId = false;
for (let attempt = 1; attempt <= 2; attempt++) {
try {
const doc = await tf_fetchDocument(url);
try {
pageHasNewId = tf_noteHistoryCardIds(doc);
}
catch (e) {
pageHasNewId = false;
}
const part = tf_scanHistorySignalsFromRoot(doc, analystName, allowedPairs);
added = pushDedup(part);
try { tf_markScanProgress('history-fallback-page-read', { page: p, added: added, count: all.length }); } catch (e) { }
lastErr = null;
break;
}
catch (e) {
lastErr = e;
if (String(e && e.message || e).includes('SESSION_EXPIRED')) {
tf_markLoggedOutAndNotify('Silahkan login untuk mengakses halaman ini');
throw new Error('SESSION_EXPIRED: Silahkan login untuk mengakses halaman ini');
}
await tf_sleep(450 + Math.floor(Math.random() * 350));
}
}
if (lastErr) {
console.warn('TF: gagal fetch history page (fallback)', url, lastErr);
added = 0;
}
await tf_sleep(180 + Math.floor(Math.random() * 220));
if (!pageHasNewId)
noNewStreak++;
else
noNewStreak = 0;
if (noNewStreak >= 5)
break;
}
}
catch (e) {
if (String(e && e.message || e).includes('SESSION_EXPIRED'))
throw e;
}
const dedup = [];
const seen2 = new Set();
all.forEach((item) => {
const id = item && (item.signalId || (item.analyst + '|' + item.displayDate + '|' + (item.pair || '')));
if (!id || seen2.has(id))
return;
seen2.add(id);
dedup.push(item);
});
try { tf_markScanProgress('history-scan-complete', { count: dedup.length }); } catch (e) { }
return dedup;
}
function tf_monthKeyToDateStart(monthKey) {
try {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo) || mo < 1 || mo > 12)
return null;
return new Date(y, mo - 1, 1, 0, 0, 0, 0);
}
catch (e) {
return null;
}
}
function tf_lastDayOfMonth(dateObj) {
try {
const d = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 0, 0, 0, 0);
return d;
}
catch (e) {
return null;
}
}
function tf_firstDayOfMonth(dateObj) {
try {
return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1, 0, 0, 0, 0);
}
catch (e) {
return null;
}
}
function tf_addMonths(dateObj, delta) {
try {
const d = new Date(dateObj.getTime());
const m = d.getMonth() + (Number(delta) || 0);
d.setMonth(m);
return d;
}
catch (e) {
return null;
}
}
function tf_parseDDMMYYYY(s) {
try {
const m = String(s || '').match(/(\d{2})-(\d{2})-(\d{4})/);
if (!m)
return null;
const dd = parseInt(m[1], 10);
const mm = parseInt(m[2], 10);
const yy = parseInt(m[3], 10);
if (!dd || !mm || !yy)
return null;
return new Date(yy, mm - 1, dd, 0, 0, 0, 0);
}
catch (e) {
return null;
}
}
function tf_getEarliestMonthKey(monthlyObj) {
try {
const keys = Object.keys(monthlyObj || {}).filter(k => /^\d{4}-\d{2}$/.test(k));
if (!keys.length)
return null;
keys.sort();
return keys[0];
}
catch (e) {
return null;
}
}
function tf_getLatestMonthKey(monthlyObj) {
try {
const keys = monthlyObj ? Object.keys(monthlyObj) : [];
if (!keys || !keys.length)
return null;
keys.sort();
return keys[keys.length - 1];
}
catch (e) {
return null;
}
}
function tf_monthsBetweenInclusive(monthKeyStart, monthKeyEnd) {
try {
if (!monthKeyStart || !monthKeyEnd)
return null;
const a = String(monthKeyStart);
const b = String(monthKeyEnd);
const ma = a.match(/^(\d{4})-(\d{2})$/);
const mb = b.match(/^(\d{4})-(\d{2})$/);
if (!ma || !mb)
return null;
const ya = parseInt(ma[1], 10);
const moA = parseInt(ma[2], 10);
const yb = parseInt(mb[1], 10);
const moB = parseInt(mb[2], 10);
if (![ya, moA, yb, moB].every(Number.isFinite))
return null;
const diff = (yb - ya) * 12 + (moB - moA);
return diff + 1;
}
catch (e) {
return null;
}
}
async function tf_openHistoryFilterPanel() {
try {
const scope = document.querySelector('#tab_history') || document;
const btn = scope.querySelector('button#profile.btn-box-tool') || scope.querySelector('button.btn-box-tool#profile') || scope.querySelector('button.btn-box-tool[data-widget="collapse"]#profile');
if (!btn)
return false;
const icon = btn.querySelector('i.fa');
const hasPlus = icon && icon.classList && icon.classList.contains('fa-plus');
if (hasPlus) {
try {
btn.click();
}
catch (e) {
try {
btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(350);
}
return true;
}
catch (e) {
return false;
}
}
function tf_normTextLite(s) {
try {
return String(s || '').replace(/\s+/g, ' ').trim();
}
catch (e) {
return '';
}
}
async function tf_setHistoryBasedOnClosedAt(timeoutMs) {
try {
const scope = document.querySelector('#tab_history') || document;
const timeout = (typeof timeoutMs === 'number' && isFinite(timeoutMs)) ? timeoutMs : 3500;
const start = Date.now();
while (Date.now() - start < timeout) {
tf_abortIfStop();
const selects = Array.from(scope.querySelectorAll('select'));
for (const sel of selects) {
try {
const opts = Array.from(sel.options || []);
if (!opts.length)
continue;
const optClosed = opts.find(o => /closed\s*at/i.test(tf_normTextLite(o && (o.textContent || o.innerText))));
if (!optClosed)
continue;
try {
sel.value = optClosed.value;
}
catch (e0) { }
try {
sel.dispatchEvent(new Event('change', { bubbles: true }));
}
catch (e1) { }
await tf_sleep(260);
return true;
}
catch (e) { }
}
const candidates = Array.from(scope.querySelectorAll('label, li, a, button, span, div'))
.filter(el => el && tf_isElementVisible(el));
const hit = candidates.find(el => /closed\s*at/i.test(tf_normTextLite((el.innerText || el.textContent || ''))));
if (hit) {
let clicked = false;
try {
hit.click();
clicked = true;
}
catch (e) { }
if (!clicked) {
try {
hit.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
clicked = true;
}
catch (e2) { }
}
if (clicked) {
await tf_sleep(260);
return true;
}
}
await tf_sleep(160);
}
}
catch (e) { }
return false;
}
async function tf_ensureHistoryBasedOnClosedAt() {
for (let i = 0; i < 2; i++) {
tf_abortIfStop();
const ok = await tf_setHistoryBasedOnClosedAt(3800);
if (ok)
return true;
await tf_sleep(220);
}
return false;
}
async function tf_waitForHistoryPairListReady(timeoutMs) {
try {
const scope = document.querySelector('#tab_history') || document;
const timeout = (typeof timeoutMs === 'number' && isFinite(timeoutMs)) ? timeoutMs : 8000;
const start = Date.now();
while (Date.now() - start < timeout) {
tf_abortIfStop();
const root = scope.querySelector('#symbol2') || document.getElementById('symbol2');
const items = root ? root.querySelectorAll('.symbolItem-2') : null;
if (items && items.length > 0)
return true;
await tf_sleep(180);
}
return false;
}
catch (e) {
return false;
}
}
async function tf_selectHistoryPair(pairUpper) {
try {
const scope = document.querySelector('#tab_history') || document;
const p = String(pairUpper || '').toUpperCase();
if (!p)
return false;
let el = scope.querySelector('#symbol2-' + p);
if (!el) {
const root = scope.querySelector('#symbol2') || document.getElementById('symbol2');
if (root) {
el = Array.from(root.querySelectorAll('.symbolItem-2')).find(x => {
const v = String(x.getAttribute('value') || x.getAttribute('data-value') || '').toUpperCase();
const id = String(x.id || '').toUpperCase();
const t = String((x.innerText || x.textContent) || '').replace(/\s+/g, '').toUpperCase();
return v === p || id === ('SYMBOL2-' + p) || t === p;
});
}
}
if (!el)
return false;
try {
el.scrollIntoView({ block: 'center', inline: 'nearest' });
}
catch (e0) { }
try {
el.click();
}
catch (e) {
try {
el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(220);
return true;
}
catch (e) {
return false;
}
}
function tf_getActiveHistoryPair() {
try {
const scope = document.querySelector('#tab_history') || document;
const root = scope.querySelector('#symbol2') || document.getElementById('symbol2') || scope;
if (!root)
return null;
const active = root.querySelector('.symbolItem-2.active') || root.querySelector('.symbolItem-2.active.perSymbol');
if (!active)
return null;
const v = String(active.getAttribute('value') || active.getAttribute('data-value') || '').trim();
const t = String((active.innerText || active.textContent) || '').trim();
const raw = (v || t || '').replace(/\s+/g, '');
if (!raw)
return null;
return raw.toUpperCase();
}
catch (e) {
return null;
}
}
async function tf_ensureHistoryPairSelected(pairUpper, maxAttempts) {
const target = String(pairUpper || '').replace(/\s+/g, '').toUpperCase();
const attempts = (typeof maxAttempts === 'number' && isFinite(maxAttempts)) ? maxAttempts : 2;
let active = tf_getActiveHistoryPair();
for (let i = 0; i < attempts; i++) {
tf_abortIfStop();
if (active === target)
return active;
try {
await tf_selectHistoryPair(target);
}
catch (e) { }
await tf_sleep(220);
active = tf_getActiveHistoryPair();
if (active === target)
return active;
}
return active;
}
function tf_findHistoryDateRangeInput() {
try {
const scope = document.querySelector('#tab_history') || document;
const candidates = [];
candidates.push(scope.querySelector('input.input-adv-search'));
candidates.push(scope.querySelector('input[name="daterangepicker"]'));
candidates.push(scope.querySelector('input[name="daterangepicker_start"]'));
candidates.push(scope.querySelector('input[name="daterangepicker_end"]'));
candidates.push(scope.querySelector('#reportrange input'));
candidates.push(scope.querySelector('#reportrange'));
candidates.push(scope.querySelector('.reportrange'));
for (const el of candidates) {
if (!el)
continue;
if (el.tagName && el.tagName.toLowerCase() === 'input')
return el;
const inner = el.querySelector && el.querySelector('input');
if (inner)
return inner;
}
}
catch (e) { }
return null;
}
function tf_readHistoryDateRangeText() {
try {
const el = tf_findHistoryDateRangeInput();
if (el) {
const v = String(el.value || el.getAttribute('value') || '').trim();
if (v)
return v;
const t = String((el.innerText || el.textContent) || '').trim();
if (t)
return t;
}
const scope = document.querySelector('#tab_history') || document;
const span = scope.querySelector('#reportrange span') || scope.querySelector('.reportrange span');
if (span) {
const t = String((span.innerText || span.textContent) || '').trim();
if (t)
return t;
}
}
catch (e) { }
return '';
}
function tf_formatDDMMYYYY(dateObj) {
try {
const d = new Date(dateObj.getTime());
const dd = String(d.getDate()).padStart(2, '0');
const mm = String(d.getMonth() + 1).padStart(2, '0');
const yy = String(d.getFullYear());
return dd + '-' + mm + '-' + yy;
}
catch (e) {
return '';
}
}
function tf_filterSignalsStrictByPair(items, pairUpper) {
const p = String(pairUpper || '').replace(/\s+/g, '').toUpperCase();
if (!p)
return Array.isArray(items) ? items.slice() : [];
return (Array.isArray(items) ? items : []).filter(it => {
const ip = String((it && it.pair) ? it.pair : '').replace(/\s+/g, '').toUpperCase();
return ip === p;
});
}
async function tf_clickHistoryFind() {
try {
const scope = document.querySelector('#tab_history') || document;
const hasNoDataMessage = () => {
try {
const root = document.querySelector('#tab_history') || document;
const txt = tf_normText(((root && (root.innerText || root.textContent)) || ''));
return txt.includes('tidak dapat menampilkan data') && txt.includes('jumlah signal terlalu sedikit');
}
catch (e) {
return false;
}
};
const pickFindButton = () => {
const candidates = [];
try {
const el1 = scope.querySelector('#apply-filter');
if (el1)
candidates.push(el1);
}
catch (e) { }
try {
candidates.push(...Array.from(scope.querySelectorAll('button#apply-filter, a#apply-filter, button.apply-filter, a.apply-filter')));
}
catch (e) { }
try {
const textBtns = Array.from(scope.querySelectorAll('button, a')).filter((el) => {
if (!el)
return false;
if (!tf_isElementVisible(el))
return false;
const t = tf_normText((el.innerText || el.textContent || '').trim());
return /find|cari|search/i.test(t);
});
candidates.push(...textBtns);
}
catch (e) { }
const uniq = [];
const seen = new Set();
for (const el of candidates) {
if (!el)
continue;
if (!tf_isElementVisible(el))
continue;
const key = String(el.id || '') + '|' + String(el.className || '') + '|' + String((el.innerText || el.textContent || '')).slice(0, 24);
if (seen.has(key))
continue;
seen.add(key);
uniq.push(el);
}
return uniq.length ? uniq[0] : null;
};
const btn = pickFindButton();
if (!btn)
return false;
const getSig = () => {
try {
const root = document.querySelector('#tab_history') || document;
const cards = root.querySelectorAll('.container-card');
const first = cards && cards.length ? cards[0] : null;
let firstKey = '';
if (first) {
const sym = first.querySelector && first.querySelector('.symbol-card');
const symText = sym ? String((sym.innerText || sym.textContent) || '').trim() : '';
const id = first.id ? String(first.id) : '';
const dateP = first.querySelector ? Array.from(first.querySelectorAll('p')).find(p => /Closed at/i.test((p.innerText || '').trim())) : null;
const dateText = dateP ? String((dateP.innerText || dateP.textContent) || '').trim() : '';
firstKey = (id || symText || dateText || '').slice(0, 80);
}
return String(cards ? cards.length : 0) + '|' + firstKey;
}
catch (e) {
return '';
}
};
try {
btn.scrollIntoView({ block: 'center', inline: 'nearest' });
}
catch (e) { }
const beforeSig = getSig();
for (let attempt = 0; attempt < 3; attempt++) {
tf_abortIfStop();
try {
btn.click();
}
catch (e) {
try {
btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(260);
if (hasNoDataMessage())
return true;
let changed = false;
const t0 = Date.now();
while (Date.now() - t0 < 8000) {
tf_abortIfStop();
try {
const overlay = scope.querySelector('.overlay') || scope.querySelector('.loading');
if (overlay && tf_isElementVisible(overlay)) {
await tf_sleep(240);
continue;
}
}
catch (e) { }
if (hasNoDataMessage()) {
changed = true;
break;
}
const afterSig = getSig();
if (afterSig && afterSig !== beforeSig) {
changed = true;
break;
}
await tf_sleep(240);
}
if (hasNoDataMessage())
return true;
try {
await tf_waitForHistoryCardsStable(9000);
}
catch (e) { }
await tf_sleep(450);
if (changed)
return true;
}
return true;
}
catch (e) {
return false;
}
}
function tf_parseCalendarMonthLabel(labelText) {
const t = String(labelText || '').trim();
const m = t.match(/^([A-Za-z]+)\s+(\d{4})$/);
if (!m)
return null;
const monStr = m[1].toLowerCase();
const year = parseInt(m[2], 10);
const map = {
jan: 0, january: 0,
feb: 1, february: 1,
mar: 2, march: 2,
apr: 3, april: 3,
may: 4,
jun: 5, june: 5,
jul: 6, july: 6,
aug: 7, august: 7,
sep: 8, sept: 8, september: 8,
oct: 9, october: 9,
nov: 10, november: 10,
dec: 11, december: 11
};
const key = Object.keys(map).find(k => monStr === k);
const idx = key ? map[key] : null;
if (idx == null || !Number.isFinite(year))
return null;
return { year, monthIndex: idx };
}
async function tf_openHistoryDateRangePicker() {
const scope = document.querySelector('#tab_history') || document;
const isPickerVisible = () => {
const dr = document.querySelector('.daterangepicker.dropdown-menu');
if (!dr)
return false;
return tf_isElementVisible(dr);
};
if (isPickerVisible())
return true;
const candidates = [];
candidates.push(scope.querySelector('input.input-adv-search'));
candidates.push(scope.querySelector('input[name="daterangepicker"]'));
candidates.push(scope.querySelector('input[name="daterangepicker_start"]'));
candidates.push(scope.querySelector('input[name="daterangepicker_end"]'));
candidates.push(scope.querySelector('#reportrange'));
candidates.push(scope.querySelector('.reportrange'));
try {
const textBtn = Array.from(scope.querySelectorAll('button, a, div, span')).find(el => {
if (!el)
return false;
if (!tf_isElementVisible(el))
return false;
const t = String((el.innerText || el.textContent) || '').trim();
return /select\s*time\s*range|time\s*range|date\s*range|rentang\s*tanggal/i.test(t);
});
if (textBtn)
candidates.push(textBtn);
}
catch (e) { }
for (const el of candidates) {
if (!el)
continue;
try {
el.click();
}
catch (e) {
try {
el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
const start = Date.now();
while (Date.now() - start < 2500) {
tf_abortIfStop();
if (isPickerVisible())
return true;
await tf_sleep(120);
}
}
return isPickerVisible();
}
async function tf_setCustomRangeAndApply(startDate, endDate) {
const ok = await tf_openHistoryDateRangePicker();
if (!ok)
return false;
const dr = document.querySelector('.daterangepicker.dropdown-menu');
if (!dr)
return false;
try {
const li = Array.from(dr.querySelectorAll('.ranges li')).find(x => /custom\s*range/i.test((x.innerText || x.textContent || '').trim()));
if (li) {
try {
li.click();
}
catch (e) {
try {
li.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(160);
}
}
catch (e) { }
const calLeft = dr.querySelector('.calendar.left');
const calRight = dr.querySelector('.calendar.right');
if (!calLeft || !calRight)
return false;
const monthToIndex = (y, m) => (Number(y) * 12 + Number(m));
const readInfo = (calEl) => {
const lab = calEl.querySelector('th.month');
return tf_parseCalendarMonthLabel(lab ? (lab.innerText || lab.textContent || '') : '');
};
const clickBtn = async (btn, ms) => {
try {
btn.click();
}
catch (e) {
try {
btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(ms);
};
const findPrevBtn = (calEl) => {
return calEl.querySelector('th.prev') || calEl.querySelector('th.prev.available') || calEl.querySelector('.prev') || calEl.querySelector('.prev.available');
};
const findNextBtn = (calEl) => {
return calEl.querySelector('th.next') || calEl.querySelector('th.next.available') || calEl.querySelector('.next') || calEl.querySelector('.next.available');
};
const clickPrevTimes = async (calEl, n) => {
const prev = findPrevBtn(calEl);
if (!prev)
return false;
const times = Math.max(0, Math.floor(n || 0));
for (let i = 0; i < times; i++) {
tf_abortIfStop();
let before = '';
try {
before = readMonthYearLabel(calEl) || '';
}
catch (e) {
before = '';
}
await clickEl(prev, 200);
let changed = false;
const t0 = Date.now();
while (Date.now() - t0 < 1500) {
tf_abortIfStop();
let after = '';
try {
after = readMonthYearLabel(calEl) || '';
}
catch (e) {
after = '';
}
if (after && before && after !== before) {
changed = true;
break;
}
await tf_sleep(60);
}
if (!changed && before) {
await clickEl(prev, 200);
await tf_sleep(120);
}
}
return true;
};
const clickNextTimes = async (calEl, n) => {
const next = findNextBtn(calEl);
if (!next)
return false;
const times = Math.max(0, Math.floor(n || 0));
for (let i = 0; i < times; i++) {
tf_abortIfStop();
await clickBtn(next, 55);
}
return true;
};
const gotoMonth = async (calEl, targetYear, targetMonthIndex) => {
const prev = findPrevBtn(calEl);
if (!prev)
return false;
const targetIdx = monthToIndex(targetYear, targetMonthIndex);
const MAX_CLICKS = 300;
let info = readInfo(calEl);
if (info && info.year === targetYear && info.monthIndex === targetMonthIndex)
return true;
let clicks = 0;
if (info && Number.isFinite(info.year) && Number.isFinite(info.monthIndex)) {
const curIdx = monthToIndex(info.year, info.monthIndex);
const diff = curIdx - targetIdx;
if (Number.isFinite(diff) && diff > 0) {
const toClick = Math.min(diff, MAX_CLICKS);
for (let i = 0; i < toClick; i++) {
tf_abortIfStop();
await clickBtn(prev, 55);
clicks++;
if (i % 10 === 0) {
info = readInfo(calEl);
if (info && info.year === targetYear && info.monthIndex === targetMonthIndex)
return true;
}
}
}
}
for (; clicks < MAX_CLICKS; clicks++) {
tf_abortIfStop();
info = readInfo(calEl);
if (info && info.year === targetYear && info.monthIndex === targetMonthIndex)
return true;
await clickBtn(prev, 65);
}
info = readInfo(calEl);
return !!(info && info.year === targetYear && info.monthIndex === targetMonthIndex);
};
const pickDay = async (calEl, dayNum) => {
try {
const want = String(dayNum);
const cells = Array.from(calEl.querySelectorAll('td'))
.filter(td => {
if (!td)
return false;
const cls = td.classList;
if (cls && (cls.contains('off') || cls.contains('disabled') || cls.contains('week')))
return false;
if (cls && !cls.contains('available'))
return false;
const t = String((td.innerText || td.textContent) || '').trim();
return /^\d+$/.test(t);
});
const cell = cells.find(td => String((td.innerText || td.textContent) || '').trim() === want);
if (!cell)
return false;
try {
cell.scrollIntoView({ block: 'center', inline: 'nearest' });
}
catch (e0) { }
try {
cell.click();
}
catch (e) {
try {
cell.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(140);
return true;
}
catch (e) {
return false;
}
};
const pickLastDayInCalendar = async (calEl) => {
try {
const cells = Array.from(calEl.querySelectorAll('td'))
.filter(td => {
if (!td)
return false;
const cls = td.classList;
if (cls && (cls.contains('off') || cls.contains('disabled') || cls.contains('week')))
return false;
if (cls && !cls.contains('available'))
return false;
const t = String((td.innerText || td.textContent) || '').trim();
return /^\d+$/.test(t);
});
if (!cells.length)
return false;
let best = null;
let bestDay = -1;
for (const td of cells) {
const t = String((td.innerText || td.textContent) || '').trim();
const d = parseInt(t, 10);
if (Number.isFinite(d) && d > bestDay) {
bestDay = d;
best = td;
}
}
if (!best)
return false;
try {
best.scrollIntoView({ block: 'center', inline: 'nearest' });
}
catch (e0) { }
try {
best.click();
}
catch (e) {
try {
best.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(160);
return true;
}
catch (e) {
return false;
}
};
const sY = startDate.getFullYear();
const sM = startDate.getMonth();
const eY = endDate.getFullYear();
const eM = endDate.getMonth();
const origL = readInfo(calLeft);
const origR = readInfo(calRight);
let offsetClicks = null;
try {
if (origL && Number.isFinite(origL.year) && Number.isFinite(origL.monthIndex)) {
const curLIdx = monthToIndex(origL.year, origL.monthIndex);
const targetLIdx = monthToIndex(sY, sM);
const diff = curLIdx - targetLIdx;
if (Number.isFinite(diff) && diff >= 0)
offsetClicks = diff;
}
}
catch (e) {
offsetClicks = null;
}
if (offsetClicks != null) {
await clickPrevTimes(calLeft, offsetClicks);
}
else {
await gotoMonth(calLeft, sY, sM);
}
await tf_sleep(90);
const ensureStartDateSelected = async () => {
try {
const sd = dr.querySelector('.calendar.left td.active.start-date, .calendar.left td.start-date, td.active.start-date, td.start-date');
const t = sd ? String((sd.innerText || sd.textContent) || '').trim() : '';
return !!(sd && t === '1');
}
catch (e) {
return false;
}
};
let startPicked = await pickDay(calLeft, 1);
if (!startPicked || !(await ensureStartDateSelected())) {
for (let k = 0; k < 4; k++) {
await tf_sleep(140);
startPicked = await pickDay(calLeft, 1);
if (startPicked && (await ensureStartDateSelected()))
break;
}
}
const lastDay = endDate.getDate ? endDate.getDate() : (new Date(eY, eM + 1, 0)).getDate();
if (origR && Number.isFinite(origR.year) && Number.isFinite(origR.monthIndex)) {
const curR = readInfo(calRight);
if (curR && Number.isFinite(curR.year) && Number.isFinite(curR.monthIndex)) {
const curIdx = monthToIndex(curR.year, curR.monthIndex);
const origIdx = monthToIndex(origR.year, origR.monthIndex);
const diffToOrig = curIdx - origIdx;
if (diffToOrig > 0) {
await clickPrevTimes(calRight, diffToOrig);
}
else if (diffToOrig < 0) {
await clickNextTimes(calRight, -diffToOrig);
}
}
}
if (offsetClicks != null) {
await clickPrevTimes(calRight, offsetClicks);
}
else {
await gotoMonth(calRight, eY, eM);
}
await tf_sleep(90);
const ensureEndDateSelected = async (wantDay) => {
try {
const ed = dr.querySelector('.calendar.right td.active.end-date, .calendar.right td.end-date, td.active.end-date, td.end-date');
const t = ed ? String((ed.innerText || ed.textContent) || '').trim() : '';
if (!ed)
return false;
if (wantDay != null)
return t === String(wantDay);
return /^\d+$/.test(t);
}
catch (e) {
return false;
}
};
let endPicked = await pickDay(calRight, lastDay);
if (!endPicked || !(await ensureEndDateSelected(lastDay))) {
endPicked = await pickLastDayInCalendar(calRight);
if (endPicked && !(await ensureEndDateSelected(null))) {
await tf_sleep(140);
await pickLastDayInCalendar(calRight);
}
}
try {
const btnApply = dr.querySelector('button.applyBtn') || dr.querySelector('.btdDateRange button.applyBtn');
if (btnApply) {
try {
btnApply.scrollIntoView({ block: 'center', inline: 'nearest' });
}
catch (e) { }
let applied = false;
for (let attempt = 0; attempt < 3; attempt++) {
try {
btnApply.click();
}
catch (e) {
try {
btnApply.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
await tf_sleep(220);
const t0 = Date.now();
while (Date.now() - t0 < 2000) {
const dr2 = document.querySelector('.daterangepicker.dropdown-menu');
if (!dr2) {
applied = true;
break;
}
let visible = false;
try {
const cs = window.getComputedStyle(dr2);
const disp = (cs && cs.display) ? cs.display : '';
const vis = (cs && cs.visibility) ? cs.visibility : '';
const op = (cs && cs.opacity) ? cs.opacity : '';
visible = (disp !== 'none' && vis !== 'hidden' && op !== '0');
}
catch (e) {
visible = true;
}
if (!visible) {
applied = true;
break;
}
await tf_sleep(80);
}
if (applied)
break;
await tf_sleep(180);
}
await tf_sleep(500);
return applied;
}
}
catch (e) { }
return false;
}
async function tf_setCustomRangeAndApplyBatchClicks(offsetClicks, startDate, endDate) {
const N = Math.max(0, Math.floor(offsetClicks || 0));
const ok = await tf_openHistoryDateRangePicker();
if (!ok)
return false;
await tf_sleep(500);
let dr = document.querySelector('.daterangepicker.dropdown-menu');
if (!dr)
return false;
const sleep = tf_sleep;
const clickLikeUser = async (el, delayMs) => {
if (!el)
return false;
try {
el.scrollIntoView({ block: 'center', inline: 'center' });
}
catch (e) { }
try {
el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, view: window }));
el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 }));
el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }));
el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
}
catch (e) {
try {
el.click();
}
catch (e2) { }
}
await sleep(typeof delayMs === 'number' ? delayMs : 120);
return true;
};
const getPicker = () => document.querySelector('.daterangepicker.dropdown-menu') || dr;
const getCals = () => {
const drx = getPicker();
return { drx, left: drx ? drx.querySelector('.calendar.left') : null, right: drx ? drx.querySelector('.calendar.right') : null };
};
try {
const drx = getPicker();
const li = drx ? Array.from(drx.querySelectorAll('.ranges li')).find(x => {
const t = (x.innerText || x.textContent || '').trim().toLowerCase();
return t.includes('custom') || t.includes('rentang kustom') || t.includes('kustom');
}) : null;
if (li) {
await clickLikeUser(li, 160);
await sleep(250);
}
}
catch (e) { }
let { drx, left: calLeft, right: calRight } = getCals();
if (!drx || !calLeft || !calRight)
return false;
const monthNameToIndex = (name) => {
const t = String(name || '').trim().toLowerCase();
const map = {
'january': 0, 'januari': 0, 'jan': 0,
'february': 1, 'februari': 1, 'feb': 1,
'march': 2, 'maret': 2, 'mar': 2,
'april': 3, 'apr': 3,
'may': 4, 'mei': 4,
'june': 5, 'juni': 5, 'jun': 5,
'july': 6, 'juli': 6, 'jul': 6,
'august': 7, 'agustus': 7, 'aug': 7,
'september': 8, 'sep': 8,
'october': 9, 'oktober': 9, 'oct': 9,
'november': 10, 'nov': 10,
'december': 11, 'desember': 11, 'dec': 11, 'des': 11
};
return (t in map) ? map[t] : null;
};
const parseLabel = (label) => {
const txt = String(label || '').replace(/\s+/g, ' ').trim();
const m = txt.match(/^([A-Za-zÀ-ÿ]+)\s+(\d{4})$/);
if (!m)
return null;
const mi = monthNameToIndex(m[1]);
const yr = parseInt(m[2], 10);
if (mi === null || !Number.isFinite(yr))
return null;
return { year: yr, monthIndex: mi };
};
const monthsIndex = (y, m) => (y * 12 + m);
const readMonthLabel = (calEl) => {
try {
const el = calEl.querySelector('th.month') || calEl.querySelector('.month') || calEl.querySelector('thead th:nth-child(2)');
return (el && (el.innerText || el.textContent) || '').trim();
}
catch (e) {
return '';
}
};
const findPrevBtn = (calEl) => {
const th = calEl.querySelector('th.prev') || calEl.querySelector('button.prev') || calEl.querySelector('.prev') || calEl.querySelector('[data-action="previous"]');
if (th)
return th;
const icon = calEl.querySelector('i.fa-arrow-left.icon-arrow-left, i.glyphicon-arrow-left, i.fa-arrow-left');
if (icon)
return icon.closest('th') || icon.closest('button') || icon;
return null;
};
const findNextBtn = (calEl) => {
const th = calEl.querySelector('th.next') || calEl.querySelector('button.next') || calEl.querySelector('.next') || calEl.querySelector('[data-action="next"]');
if (th)
return th;
const icon = calEl.querySelector('i.fa-arrow-right.icon-arrow-right, i.glyphicon-arrow-right, i.fa-arrow-right');
if (icon)
return icon.closest('th') || icon.closest('button') || icon;
return null;
};
const waitMonthChanged = async (calEl, before, timeoutMs) => {
const t0 = Date.now();
while (Date.now() - t0 < (timeoutMs || 2000)) {
tf_abortIfStop();
const after = readMonthLabel(calEl);
if (after && before && after !== before)
return true;
await sleep(60);
}
return false;
};
const clickPrevTimesStable = async (calEl, times) => {
const n = Math.max(0, Math.floor(times || 0));
for (let i = 0; i < n; i++) {
tf_abortIfStop();
const prev = findPrevBtn(calEl);
if (!prev)
return false;
const before = readMonthLabel(calEl) || '';
await clickLikeUser(prev, 200);
const changed = await waitMonthChanged(calEl, before, 3500);
if (!changed && before) {
await sleep(120);
await clickLikeUser(prev, 220);
await waitMonthChanged(calEl, before, 3500);
}
try { tf_markScanProgress('calendar-back-step', { step: i + 1, total: n, label: readMonthLabel(calEl) }); } catch (e) { }
await sleep(40);
}
return true;
};
const gotoLabelBestEffort = async (calEl, desired) => {
if (!desired)
return true;
const MAX = 80;
for (let i = 0; i < MAX; i++) {
tf_abortIfStop();
const cur = parseLabel(readMonthLabel(calEl));
if (cur && cur.year === desired.year && cur.monthIndex === desired.monthIndex)
return true;
const prev = findPrevBtn(calEl);
const next = findNextBtn(calEl);
if (!cur) {
if (prev)
await clickLikeUser(prev, 220);
else if (next)
await clickLikeUser(next, 220);
else
break;
continue;
}
const diff = monthsIndex(cur.year, cur.monthIndex) - monthsIndex(desired.year, desired.monthIndex);
if (diff > 0) {
if (!prev)
break;
await clickLikeUser(prev, 220);
}
else if (diff < 0) {
if (!next)
break;
await clickLikeUser(next, 220);
}
else {
return true;
}
await sleep(120);
try { tf_markScanProgress('calendar-target-step', { current: readMonthLabel(calEl), targetYear: desired.year, targetMonth: desired.monthIndex }); } catch (e) { }
}
return true;
};
const adjustToDesiredLabel = async (calEl, desired, maxSteps) => {
if (!desired)
return true;
const steps = Math.max(0, Math.floor(maxSteps || 4));
for (let i = 0; i < steps; i++) {
tf_abortIfStop();
const cur = parseLabel(readMonthLabel(calEl));
if (cur && cur.year === desired.year && cur.monthIndex === desired.monthIndex)
return true;
if (!cur)
return true;
const diff = monthsIndex(cur.year, cur.monthIndex) - monthsIndex(desired.year, desired.monthIndex);
if (diff > 0) {
const prev = findPrevBtn(calEl);
if (!prev)
return true;
const before = readMonthLabel(calEl) || '';
await clickLikeUser(prev, 200);
await waitMonthChanged(calEl, before, 2800);
}
else if (diff < 0) {
const next = findNextBtn(calEl);
if (!next)
return true;
const before = readMonthLabel(calEl) || '';
await clickLikeUser(next, 200);
await waitMonthChanged(calEl, before, 2800);
}
else {
return true;
}
await sleep(60);
try { tf_markScanProgress('calendar-adjust-step', { current: readMonthLabel(calEl), targetYear: desired.year, targetMonth: desired.monthIndex }); } catch (e) { }
}
return true;
};
const pickDayExact = async (calEl, dayNum, verifyClass) => {
const want = String(dayNum);
const sel = 'td.available[data-title]:not(.off):not(.disabled):not(.week)';
const cells = Array.from(calEl.querySelectorAll(sel)).filter(td => (td.innerText || td.textContent || '').trim() === want);
if (!cells.length)
return false;
for (const td of cells) {
tf_abortIfStop();
await clickLikeUser(td, 80);
await sleep(90);
let picked = null;
try {
if (verifyClass === 'start-date')
picked = drx.querySelector('.calendar.left td.start-date');
else if (verifyClass === 'end-date')
picked = drx.querySelector('.calendar.right td.end-date');
if (!picked)
picked = drx.querySelector('td.' + verifyClass);
}
catch (e) {
picked = null;
}
const pickedTxt = picked ? String((picked.innerText || picked.textContent) || '').trim() : '';
if (pickedTxt === want)
return true;
}
return false;
};
const pickEndDayLastStable = async (calEl, preferredLastDay) => {
const sel = 'td.available[data-title]:not(.off):not(.disabled):not(.week)';
const all = Array.from(calEl.querySelectorAll(sel)).filter(td => /^\d+$/.test(((td.innerText || td.textContent || '').trim())));
if (!all.length)
return false;
const want = String(preferredLastDay || '').trim();
let target = null;
if (want) {
target = all.find(td => ((td.innerText || td.textContent || '').trim()) === want) || null;
}
if (!target) {
let best = all[0];
let bestN = parseInt(((best.innerText || best.textContent) || '0').trim(), 10);
for (const td of all) {
const n = parseInt(((td.innerText || td.textContent) || '0').trim(), 10);
if (Number.isFinite(n) && n > bestN) {
bestN = n;
best = td;
}
}
target = best;
}
if (!target)
return false;
await clickLikeUser(target, 80);
await sleep(90);
const picked = drx.querySelector('.calendar.right td.end-date') || drx.querySelector('td.end-date');
const pickedTxt = picked ? String((picked.innerText || picked.textContent) || '').trim() : '';
if (want && pickedTxt !== want) {
await sleep(140);
await clickLikeUser(target, 100);
await sleep(90);
}
return true;
};
const desiredLeft = (startDate instanceof Date) ? { year: startDate.getFullYear(), monthIndex: startDate.getMonth() } : null;
const desiredRight = (endDate instanceof Date) ? { year: endDate.getFullYear(), monthIndex: endDate.getMonth() } : null;
const lastDay = (endDate instanceof Date) ? endDate.getDate() : null;
if (N > 0)
await clickPrevTimesStable(calLeft, N);
await sleep(120);
await adjustToDesiredLabel(calLeft, desiredLeft, 4);
await sleep(80);
let startOk = await pickDayExact(calLeft, 1, 'start-date');
if (!startOk) {
await sleep(160);
startOk = await pickDayExact(calLeft, 1, 'start-date');
}
await sleep(120);
({ drx, left: calLeft, right: calRight } = getCals());
if (!drx || !calRight)
return false;
if (N > 0)
await clickPrevTimesStable(calRight, N);
await sleep(120);
await adjustToDesiredLabel(calRight, desiredRight, 4);
await sleep(80);
await pickEndDayLastStable(calRight, lastDay);
await sleep(90);
try {
const picker = getPicker();
const apply = picker ? (picker.querySelector('.applyBtn') || picker.querySelector('button.applyBtn') || picker.querySelector('button.btn-success')) : null;
if (apply) {
await clickLikeUser(apply, 140);
const t0 = Date.now();
while (Date.now() - t0 < 3500) {
tf_abortIfStop();
const p = getPicker();
if (!p)
break;
const cs = window.getComputedStyle(p);
const disp = cs && cs.display ? cs.display : '';
const vis = cs && cs.visibility ? cs.visibility : '';
const op = cs && cs.opacity ? cs.opacity : '';
if (disp === 'none' || vis === 'hidden' || op === '0')
break;
await sleep(80);
}
await sleep(220);
try { tf_markScanProgress('calendar-range-applied', { start: tf_formatDDMMYYYY(startDate), end: tf_formatDDMMYYYY(endDate) }); } catch (e) { }
return true;
}
}
catch (e) { }
return false;
}
async function tf_scrollHistoryToTop() {
try {
const scrollEl = tf_findHistoryScrollContainer() || document.scrollingElement || document.documentElement || document.body;
if (scrollEl && scrollEl !== document.body && scrollEl !== document.documentElement) {
scrollEl.scrollTop = 0;
}
try {
window.scrollTo(0, 0);
}
catch (e) { }
await tf_sleep(180);
}
catch (e) { }
}
async function tf_scanHistorySignalsBatched(analystName, allowedPairs, earliestMonthKey, latestMonthKey, totalBatches, monthlyExpected, resumeCheckpoint) {
let __tfNoCalendarBack = false;
try {
const __tr = await tf_getSelectedTimeRangeSetting();
__tfNoCalendarBack = (__tr === 'm3');
}
catch (e) {
__tfNoCalendarBack = false;
}
if (__tfNoCalendarBack) {
try {
totalBatches = 1;
}
catch (e) { }
}
const pair = (allowedPairs && Array.isArray(allowedPairs) && allowedPairs.length)
? String(allowedPairs[0]).toUpperCase()
: null;
if (!pair) {
return await tf_scanHistorySignalsAllPages(analystName, allowedPairs);
}
const earliestStart = earliestMonthKey ? tf_monthKeyToDateStart(earliestMonthKey) : null;
const expectedByMonth = {};
try {
const m = monthlyExpected && typeof monthlyExpected === 'object' ? monthlyExpected : {};
Object.keys(m).forEach(mk => {
if (!/^\d{4}-\d{2}$/.test(String(mk)))
return;
const obj = m[mk];
const s = obj && typeof obj === 'object' && obj.signals != null ? Number(obj.signals) : null;
if (Number.isFinite(s))
expectedByMonth[String(mk)] = s;
});
}
catch (e) { }
const toMonthKey = (d) => {
try {
const y = d.getFullYear();
const mm = String(d.getMonth() + 1).padStart(2, '0');
return String(y) + '-' + mm;
}
catch (e) {
return null;
}
};
let latestKey = null;
try {
latestKey = latestMonthKey ? String(latestMonthKey) : null;
if (!latestKey && monthlyExpected && typeof monthlyExpected === 'object') {
latestKey = tf_getLatestMonthKey(monthlyExpected);
}
}
catch (e) { }
if (!latestKey || !/^\d{4}-\d{2}$/.test(latestKey)) {
const now = new Date();
latestKey = toMonthKey(new Date(now.getFullYear(), now.getMonth(), 1));
}
const latestStart = latestKey ? tf_monthKeyToDateStart(latestKey) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
await tf_openHistoryTab();
await tf_openHistoryFilterPanel();
await tf_ensureHistoryBasedOnClosedAt();
const all = [];
const seen = new Set();
let doneBatches = 0;
let resumeSession = null;
let completedBatches = [];
let resumeBatchIndex = null;
const updateOverall = () => {
try {
if (!totalBatches || !Number.isFinite(totalBatches))
return;
tf_emitHistoryBatchStatus(analystName, pair, 0, String(doneBatches) + '/' + String(totalBatches));
}
catch (e) { }
};
const addItems = (arr) => {
(arr || []).forEach(it => {
if (!it)
return;
const id = it.signalId || (it.analyst + '|' + it.displayDate + '|' + (it.pair || ''));
if (seen.has(id))
return;
seen.add(id);
all.push(it);
});
};
try {
if (resumeCheckpoint && typeof resumeCheckpoint === 'object') {
resumeBatchIndex = Number(resumeCheckpoint.batchIndex || resumeCheckpoint.nextBatchIndex || 0);
if (!Number.isFinite(resumeBatchIndex) || resumeBatchIndex < 1)
resumeBatchIndex = null;
resumeSession = await tf_loadHistoryResumeSession(analystName, pair);
if (resumeSession && Array.isArray(resumeSession.items))
addItems(resumeSession.items);
completedBatches = resumeSession && Array.isArray(resumeSession.completedBatches)
? resumeSession.completedBatches.map((x) => Number(x)).filter((x) => Number.isFinite(x) && x >= 1)
: [];
if (resumeBatchIndex && resumeBatchIndex > 1 && (!resumeSession || !Array.isArray(resumeSession.items) || !completedBatches.length)) {
resumeBatchIndex = 1;
resumeSession = null;
completedBatches = [];
}
doneBatches = completedBatches.length;
}
}
catch (e) {
resumeSession = null;
completedBatches = [];
resumeBatchIndex = null;
doneBatches = 0;
}
const saveResumeState = async (nextBatchIndex, activeCheckpoint) => {
try {
await tf_saveHistoryResumeSession({
analystName,
pair,
jobToken: __tfActiveJobToken || null,
earliestMonthKey: earliestMonthKey || null,
latestMonthKey: latestKey || null,
totalBatches: totalBatches || null,
completedBatches: Array.from(new Set(completedBatches)).sort((a, b) => a - b),
nextBatchIndex: Number(nextBatchIndex || 1),
checkpoint: activeCheckpoint && typeof activeCheckpoint === 'object' ? { ...activeCheckpoint } : null,
items: all.slice()
});
}
catch (e) { }
};
const computeMonthCounts = (arr) => {
const mc = {};
try {
(arr || []).forEach(it => {
const mk = tf_monthKeyFromDisplayDate(it && it.displayDate ? it.displayDate : '');
if (!mk)
return;
mc[mk] = (mc[mk] || 0) + 1;
});
}
catch (e) { }
return mc;
};
function buildStateText(base, activeUiPair, removedCount, mismatchNote) {
let t = base || '';
if (activeUiPair && activeUiPair !== pair) {
t += ' (UI=' + activeUiPair + ', auto-filter)';
}
if (typeof removedCount === 'number' && removedCount > 0) {
t += ' (removed ' + removedCount + ')';
}
if (mismatchNote) {
t += ' (' + String(mismatchNote) + ')';
}
return t.trim();
}
async function verifyAgainstStats(monthKeys, items, retryFn) {
const months = Array.isArray(monthKeys) ? monthKeys.filter(Boolean) : [];
if (!months.length)
return { ok: true, monthCounts: computeMonthCounts(items), note: null };
const monthCounts = computeMonthCounts(items);
const mism = [];
for (const mk of months) {
const exp = (mk in expectedByMonth) ? expectedByMonth[mk] : null;
if (exp == null)
continue;
const act = (mk in monthCounts) ? Number(monthCounts[mk]) : 0;
if (!(Number.isFinite(act) && act === exp))
mism.push(mk + ':' + String(act) + '/' + String(exp));
}
if (!mism.length)
return { ok: true, monthCounts, note: null };
if (typeof retryFn === 'function') {
try {
await tf_sleep(350);
const items2 = await retryFn();
const mc2 = computeMonthCounts(items2);
const mism2 = [];
for (const mk of months) {
const exp = (mk in expectedByMonth) ? expectedByMonth[mk] : null;
if (exp == null)
continue;
const act = (mk in mc2) ? Number(mc2[mk]) : 0;
if (!(Number.isFinite(act) && act === exp))
mism2.push(mk + ':' + String(act) + '/' + String(exp));
}
if (!mism2.length)
return { ok: true, monthCounts: mc2, note: null };
return { ok: false, monthCounts: mc2, note: 'mismatch ' + mism2.join(', ') };
}
catch (e) {
return { ok: false, monthCounts, note: 'mismatch ' + mism.join(', ') };
}
}
return { ok: false, monthCounts, note: 'mismatch ' + mism.join(', ') };
}
let activeUi1 = null;
try {
await tf_openHistoryFilterPanel();
await tf_ensureHistoryBasedOnClosedAt();
activeUi1 = await tf_ensureHistoryPairSelected(pair, 3);
}
catch (e) {
activeUi1 = tf_getActiveHistoryPair();
}
const prevKey = toMonthKey(tf_addMonths(latestStart, -1));
const monthsB1 = [prevKey, latestKey];
const shouldRestoreBatch1 = !!(resumeBatchIndex && resumeBatchIndex > 1 && completedBatches.includes(1));
if (shouldRestoreBatch1) {
try {
tf_emitHistoryBatchStatus(analystName, pair, 1, 'Restored from checkpoint');
}
catch (e) { }
updateOverall();
}
else {
const checkpoint1 = {
analystName,
pair,
batchIndex: 1,
nextBatchIndex: 1,
targetStartMonth: prevKey,
targetEndMonth: latestKey,
calendarBackSteps: 0,
phase: 'history-batch-1',
totalBatches: totalBatches || null
};
tf_setActiveHistoryCheckpoint(checkpoint1);
await saveResumeState(1, checkpoint1);
try {
tf_emitHistoryBatchStatus(analystName, pair, 1, buildStateText('Progress...', activeUi1));
}
catch (e) { }
const scanBatch1Once = async () => {
const cpFind = { ...checkpoint1, phase: 'history-find-scroll' };
tf_setActiveHistoryCheckpoint(cpFind);
await saveResumeState(1, cpFind);
await tf_clickHistoryFind();
const raw = await tf_scanHistorySignalsAllPages(analystName, [pair]);
const part = tf_filterSignalsStrictByPair(raw, pair);
const removed = (raw && raw.length ? raw.length : 0) - (part && part.length ? part.length : 0);
return { part, removed };
};
let batch1Res = await scanBatch1Once();
const ver1 = await verifyAgainstStats(monthsB1, batch1Res.part, async () => {
const r = await scanBatch1Once();
batch1Res = r;
return r.part;
});
addItems(batch1Res.part);
if (!completedBatches.includes(1))
completedBatches.push(1);
doneBatches = completedBatches.length;
await saveResumeState(2, { ...checkpoint1, phase: 'batch-complete', nextBatchIndex: 2 });
try {
tf_emitHistoryBatchStatus(analystName, pair, 1, buildStateText('Done!', activeUi1, batch1Res.removed, ver1.note));
}
catch (e) { }
try {
updateOverall();
}
catch (e) { }
}
if (!__tfNoCalendarBack) {
let batchIndex = Math.max(2, resumeBatchIndex && Number.isFinite(resumeBatchIndex) ? Math.floor(resumeBatchIndex) : 2);
let endMonth = tf_addMonths(latestStart, -2 * (batchIndex - 1));
let guard = 0;
while (guard < 80) {
tf_abortIfStop();
guard++;
if (totalBatches && Number.isFinite(totalBatches) && batchIndex > totalBatches)
break;
const endDate = tf_lastDayOfMonth(endMonth);
const startDate = tf_firstDayOfMonth(tf_addMonths(endMonth, -1));
if (!endDate || !startDate)
break;
if (earliestStart && endDate.getTime() < earliestStart.getTime())
break;
await tf_openHistoryFilterPanel();
await tf_ensureHistoryBasedOnClosedAt();
let activeUi = null;
try {
activeUi = await tf_ensureHistoryPairSelected(pair, 3);
}
catch (e) {
activeUi = tf_getActiveHistoryPair();
}
const mk1 = toMonthKey(startDate);
const mk2 = toMonthKey(endMonth);
const checkpointN = {
analystName,
pair,
batchIndex,
nextBatchIndex: batchIndex,
targetStartMonth: mk1,
targetEndMonth: mk2,
calendarBackSteps: Math.max(0, 2 * (batchIndex - 1)),
phase: 'calendar-restore',
totalBatches: totalBatches || null
};
tf_setActiveHistoryCheckpoint(checkpointN);
await saveResumeState(batchIndex, checkpointN);
try {
tf_emitHistoryBatchStatus(analystName, pair, batchIndex, buildStateText('Progress...', activeUi));
}
catch (e) { }
let applied = false;
const resumeThisBatch = !!(resumeBatchIndex && batchIndex === resumeBatchIndex);
try {
applied = resumeThisBatch
? await tf_setCustomRangeAndApply(startDate, endDate)
: await tf_setCustomRangeAndApplyBatchClicks(2, startDate, endDate);
if (!applied)
applied = await tf_setCustomRangeAndApply(startDate, endDate);
}
catch (e) {
applied = false;
}
try {
const expStart = tf_formatDDMMYYYY(startDate);
const expEnd = tf_formatDDMMYYYY(endDate);
const txt = tf_readHistoryDateRangeText();
if (applied && expStart && expEnd && txt && !(txt.includes(expStart) && txt.includes(expEnd))) {
await tf_sleep(380);
applied = resumeThisBatch
? await tf_setCustomRangeAndApply(startDate, endDate)
: await tf_setCustomRangeAndApplyBatchClicks(2, startDate, endDate);
if (!applied)
applied = await tf_setCustomRangeAndApply(startDate, endDate);
await tf_sleep(250);
}
}
catch (e) { }
let activeUi2 = null;
try {
await tf_openHistoryFilterPanel();
await tf_ensureHistoryBasedOnClosedAt();
activeUi2 = await tf_ensureHistoryPairSelected(pair, 3);
}
catch (e) {
activeUi2 = tf_getActiveHistoryPair();
}
const scanBatchOnce = async () => {
const cpWork = { ...checkpointN, phase: 'history-find-scroll' };
tf_setActiveHistoryCheckpoint(cpWork);
await saveResumeState(batchIndex, cpWork);
await tf_clickHistoryFind();
const raw = await tf_scanHistorySignalsAllPages(analystName, [pair]);
const part = tf_filterSignalsStrictByPair(raw, pair);
const removed = (raw && raw.length ? raw.length : 0) - (part && part.length ? part.length : 0);
return { part, removed };
};
let partRes = await scanBatchOnce();
const verN = await verifyAgainstStats([mk1, mk2], partRes.part, async () => {
const r = await scanBatchOnce();
partRes = r;
return r.part;
});
addItems(partRes.part);
if (!completedBatches.includes(batchIndex))
completedBatches.push(batchIndex);
doneBatches = completedBatches.length;
await saveResumeState(batchIndex + 1, { ...checkpointN, phase: 'batch-complete', nextBatchIndex: batchIndex + 1 });
try {
tf_emitHistoryBatchStatus(analystName, pair, batchIndex, buildStateText('Done!', activeUi2 || activeUi, partRes.removed, verN.note));
}
catch (e) { }
try {
updateOverall();
}
catch (e) { }
await tf_scrollHistoryToTop();
endMonth = tf_addMonths(endMonth, -2);
batchIndex++;
}
}
try { tf_setActiveHistoryCheckpoint(null); } catch (e) { }
return all;
}
async function tf_scanHistoryBatch1Only(analystName, pair, totalBatches) {
const p = String(pair || '').toUpperCase();
if (!p)
return { items: [], removedCount: 0 };
await tf_openHistoryTab();
await tf_openHistoryFilterPanel();
await tf_ensureHistoryBasedOnClosedAt();
let activeUi = null;
try {
activeUi = await tf_ensureHistoryPairSelected(p, 3);
}
catch (e) {
activeUi = tf_getActiveHistoryPair();
}
try {
tf_emitHistoryBatchStatus(analystName, p, 1, 'Progress...');
}
catch (e) { }
await tf_clickHistoryFind();
const raw = await tf_scanHistorySignalsAllPages(analystName, [p]);
const items = tf_filterSignalsStrictByPair(raw, p);
const removed = (raw && raw.length ? raw.length : 0) - (items && items.length ? items.length : 0);
const monthCounts = tf_calcMonthCounts(items);
try {
tf_emitHistoryBatchStatus(analystName, p, 1, removed > 0 ? ('Done! (removed ' + String(removed) + ')') : 'Done!');
}
catch (e) { }
try {
if (totalBatches && Number.isFinite(totalBatches) && totalBatches > 0) {
tf_emitHistoryBatchStatus(analystName, p, 0, '1/' + String(totalBatches));
}
}
catch (e) { }
await tf_scrollHistoryToTop();
return { items, removedCount: removed, monthCounts };
}

async function tf_scanHistoryUpdateCurrentRange(analystName, pair) {
const p = String(pair || '').toUpperCase();
if (!p)
return { items: [], removedCount: 0, monthCounts: {} };
await tf_openHistoryTab();
await tf_openHistoryFilterPanel();
await tf_ensureHistoryBasedOnClosedAt();
try {
await tf_ensureHistoryPairSelected(p, 4);
}
catch (e) { }
try {
tf_emitHistoryBatchStatus(analystName, p, 1, 'Update: mengambil History Signal terbaru...');
}
catch (e) { }
// Penting: Update tidak memilih Time Range dan tidak mengubah kalender.
// Rentang aktif/default di History Signal dipakai apa adanya, lalu Find hanya sekali.
await tf_clickHistoryFind();
const raw = await tf_scanHistorySignalsAllPages(analystName, [p], { fastEnd: true });
const items = tf_filterSignalsStrictByPair(raw, p);
const removed = (raw && raw.length ? raw.length : 0) - (items && items.length ? items.length : 0);
const monthCounts = tf_calcMonthCounts(items);
try {
tf_emitHistoryBatchStatus(
analystName,
p,
1,
removed > 0 ? ('Update selesai (removed ' + String(removed) + ')') : 'Update selesai'
);
}
catch (e) { }
await tf_scrollHistoryToTop();
return {
items,
removedCount: removed,
monthCounts,
rangeStart: null,
rangeEnd: null
};
}

async function tf_scanHistoryBatchRange(analystName, pair, startDate, endDate, batchIndex, offsetClicks) {
const p = String(pair || '').toUpperCase();
if (!p)
return { items: [], removedCount: 0 };
const offClicks = Math.max(0, Math.floor(offsetClicks || 0));
await tf_openHistoryTab();
await tf_openHistoryFilterPanel();
try {
await tf_waitForHistoryPairListReady(9000);
}
catch (e) { }
await tf_ensureHistoryBasedOnClosedAt();
let activeUi = null;
try {
await tf_openHistoryFilterPanel();
try {
await tf_waitForHistoryPairListReady(12000);
}
catch (e0) { }
activeUi = await tf_ensureHistoryPairSelected(p, 6);
}
catch (e) {
activeUi = tf_getActiveHistoryPair();
}
try {
tf_emitHistoryBatchStatus(analystName, p, batchIndex, 'Progress...');
}
catch (e) { }
let applied = false;
try {
applied = offClicks > 0 ? await tf_setCustomRangeAndApplyBatchClicks(offClicks, startDate, endDate) : await tf_setCustomRangeAndApply(startDate, endDate);
}
catch (e) {
applied = false;
}
try {
const expStart = tf_formatDDMMYYYY(startDate);
const expEnd = tf_formatDDMMYYYY(endDate);
const txt = tf_readHistoryDateRangeText();
if (applied && expStart && expEnd && txt && !(txt.includes(expStart) && txt.includes(expEnd))) {
await tf_sleep(350);
applied = offClicks > 0 ? await tf_setCustomRangeAndApplyBatchClicks(offClicks, startDate, endDate) : await tf_setCustomRangeAndApply(startDate, endDate);
await tf_sleep(250);
}
}
catch (e) { }
let activeUi2 = null;
try {
await tf_openHistoryFilterPanel();
try {
await tf_waitForHistoryPairListReady(12000);
}
catch (e0) { }
activeUi2 = await tf_ensureHistoryPairSelected(p, 6);
}
catch (e) {
activeUi2 = tf_getActiveHistoryPair();
}
await tf_clickHistoryFind();
try {
await tf_scrollHistoryToLastPage();
}
catch (e) { }
const raw = await tf_scanHistorySignalsAllPages(analystName, [p]);
const items = tf_filterSignalsStrictByPair(raw, p);
const removed = (raw && raw.length ? raw.length : 0) - (items && items.length ? items.length : 0);
const monthCounts = tf_calcMonthCounts(items);
try {
tf_emitHistoryBatchStatus(analystName, p, batchIndex, removed > 0 ? ('Done! (removed ' + String(removed) + ')') : 'Done!');
}
catch (e) { }
await tf_scrollHistoryToTop();
return { items, removedCount: removed, applied, activeUi: activeUi2 || activeUi, monthCounts };
}
function tf_storageGet(keys) {
return new Promise((resolve, reject) => {
try {
chrome.storage.local.get(keys, (data) => {
if (chrome.runtime.lastError)
reject(chrome.runtime.lastError);
else
resolve(data || {});
});
}
catch (e) {
reject(e);
}
});
}
function tf_storageSet(obj) {
return new Promise((resolve, reject) => {
try {
chrome.storage.local.set(obj, () => {
if (chrome.runtime.lastError)
reject(chrome.runtime.lastError);
else
resolve();
});
}
catch (e) {
reject(e);
}
});
}
function tf_storageRemove(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.remove(keys, () => resolve());
}
catch (e) {
resolve();
}
});
}
async function tf_acquireStorageLock(lockKey, waitMs, staleMs) {
const key = lockKey || 'tfMergeLock';
const wait = (typeof waitMs === 'number' && isFinite(waitMs) && waitMs > 0) ? waitMs : 60000;
const stale = (typeof staleMs === 'number' && isFinite(staleMs) && staleMs > 0) ? staleMs : 120000;
const token = 'lock_' + Math.random().toString(36).slice(2) + '_' + Date.now();
const start = Date.now();
while (Date.now() - start < wait) {
let lock = null;
try {
const d = await tf_storageGet([key]);
lock = d ? d[key] : null;
}
catch (e) {
lock = null;
}
const now = Date.now();
const free = !lock || !lock.owner || (lock.at && (now - lock.at > stale));
if (free) {
try {
await tf_storageSet({ [key]: { owner: token, at: now } });
}
catch (e) {
}
try {
const d2 = await tf_storageGet([key]);
const lock2 = d2 ? d2[key] : null;
if (lock2 && lock2.owner === token)
return token;
}
catch (e) {
}
}
await tf_sleep(120 + Math.floor(Math.random() * 180));
}
return null;
}
async function tf_releaseStorageLock(lockKey, token) {
if (!token)
return;
const key = lockKey || 'tfMergeLock';
try {
const d = await tf_storageGet([key]);
const lock = d ? d[key] : null;
if (lock && lock.owner === token) {
await tf_storageRemove([key]);
}
}
catch (e) {
}
}
async function tf_mergeIntoStorage(scanResult) {
const lockToken = await tf_acquireStorageLock('tfMergeLock', 60000, 120000);
try {
function tf_parseStorageAnalystName(name) {
const s = String(name || '').trim();
const m = s.match(/^(.*)\s+\(([^()]+)\)\s*$/);
if (!m)
return { base: s, pair: null };
return { base: m[1].trim(), pair: String(m[2]).trim().toUpperCase() };
}
const data = await tf_storageGet(['tfMonthlyStats', 'tfHistorySignals', 'tfNoDataPairs', 'tfAvgSlPips']);
const rawMonthlyStats = data.tfMonthlyStats || {};
const rawHistorySignalsAll = data.tfHistorySignals || [];
const monthlyStats = {};
Object.keys(rawMonthlyStats).forEach((name) => {
monthlyStats[name] = rawMonthlyStats[name];
});
const parsedThis = tf_parseStorageAnalystName(scanResult && scanResult.analystName);
const hasMonthly = !!(scanResult && scanResult.monthly && typeof scanResult.monthly === 'object' && Object.keys(scanResult.monthly).length);
const hasHistory = !!(scanResult && Array.isArray(scanResult.historySignals) && scanResult.historySignals.length);
const hasAnyData = hasMonthly || hasHistory;
const isUpdate = !!(scanResult && String(scanResult.scanMode || '') === 'update');
const isPartial = !!(scanResult && (scanResult.partial || scanResult.scanMode === 'historyBatch' || scanResult.scanMode === 'historyMonth' || isUpdate));
const replaceCompletedPair = scanResult?.replaceExisting === true && !isPartial && parsedThis.base && parsedThis.pair;
if (replaceCompletedPair) {
 for (const key of Object.keys(monthlyStats)) {
  const parsed=tf_parseStorageAnalystName(key);
  if(parsed.base.toLowerCase()===parsedThis.base.toLowerCase()&&parsed.pair===parsedThis.pair)delete monthlyStats[key];
 }
}

try {
if (scanResult && scanResult.analystName && scanResult.monthly && typeof scanResult.monthly === 'object') {
if (isPartial) {
const prev = (monthlyStats[scanResult.analystName] && typeof monthlyStats[scanResult.analystName] === 'object')
? { ...monthlyStats[scanResult.analystName] }
: {};
monthlyStats[scanResult.analystName] = { ...prev, ...scanResult.monthly };
}
else {
monthlyStats[scanResult.analystName] = scanResult.monthly;
}
}
}
catch (e) { }
let historySignalsAll = Array.isArray(rawHistorySignalsAll) ? rawHistorySignalsAll.slice() : [];
if(replaceCompletedPair)historySignalsAll=historySignalsAll.filter(item=>{
 const parsed=tf_parseStorageAnalystName(item?.analyst);
 const pair=String(item?.pair||parsed.pair||'').trim().toUpperCase();
 return !(parsed.base.toLowerCase()===parsedThis.base.toLowerCase()&&pair===parsedThis.pair);
});

try {
if (parsedThis && parsedThis.base && parsedThis.pair && !hasAnyData && !isPartial) {
const baseNorm = String(parsedThis.base || '').trim().toLowerCase();
const pairUpper = String(parsedThis.pair || '').trim().toUpperCase();
historySignalsAll = historySignalsAll.filter((it) => {
const a = String(it && it.analyst ? it.analyst : '').trim().toLowerCase();
const p = String(it && it.pair ? it.pair : '').trim().toUpperCase();
return !(a === baseNorm && p === pairUpper);
});
}
}
catch (e) { }
function tf_normStr(v) {
return String(v == null ? '' : v).trim();
}
function tf_normAnalyst(v) {
return tf_normStr(v).toLowerCase();
}
function tf_normPair(v) {
return tf_normStr(v).toUpperCase();
}
function tf_normTime(it) {
try {
if (it && typeof it.sortKey === 'number' && Number.isFinite(it.sortKey))
return String(Math.floor(it.sortKey));
}
catch (e) { }
let s = tf_normStr(it && it.displayDate ? it.displayDate : '');
s = s.replace(/\s*WIB\s*$/i, '').replace(/\s+/g, ' ').trim();
return s;
}
function tf_normCreatedTime(it) {
try {
if (it && typeof it.createdSortKey === 'number' && Number.isFinite(it.createdSortKey))
return String(Math.floor(it.createdSortKey));
}
catch (e) { }
let s = tf_normStr(it && it.createdDate ? it.createdDate : '');
s = s.replace(/\s*WIB\s*$/i, '').replace(/\s+/g, ' ').trim();
return s;
}
function tf_normPips(v) {
const n = typeof v === 'number' ? v : parseFloat(v);
if (!Number.isFinite(n))
return '';
return String(Math.round(n * 100) / 100);
}
function tf_buildHistorySig(it) {
if (!it)
return '';
const a = tf_normAnalyst(it.analyst);
const p = tf_normPair(it.pair);
const tClosed = tf_normTime(it);
const tCreated = tf_normCreatedTime(it);
const pp = tf_normPips(it.pips);
if (!a || !p || !tClosed)
return '';
return [a, p, tClosed, tCreated, pp].join('|');
}
const existingById = new Map();
const existingBySig = new Map();
historySignalsAll.forEach((item, idx) => {
if (item && item.signalId)
existingById.set(item.signalId, idx);
const sig = tf_buildHistorySig(item);
if (sig && !existingBySig.has(sig))
existingBySig.set(sig, idx);
});
if (scanResult && Array.isArray(scanResult.historySignals)) {
scanResult.historySignals.forEach((item) => {
if (!item)
return;
const sid = item.signalId || null;
const sig = tf_buildHistorySig(item);
let idx = null;
if (sid && existingById.has(sid))
idx = existingById.get(sid);
else if (sig && existingBySig.has(sig))
idx = existingBySig.get(sig);
if (idx != null) {
const prev = historySignalsAll[idx] || {};
const merged = { ...prev, ...item };
historySignalsAll[idx] = merged;
if (sid)
existingById.set(sid, idx);
const mergedSig = tf_buildHistorySig(merged);
if (mergedSig)
existingBySig.set(mergedSig, idx);
}
else {
historySignalsAll.push(item);
const newIdx = historySignalsAll.length - 1;
if (sid)
existingById.set(sid, newIdx);
const s2 = tf_buildHistorySig(item);
if (s2)
existingBySig.set(s2, newIdx);
}
});
}
const rawNoDataPairs = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
const rawAvgSlPips = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
try {
if (parsedThis && parsedThis.base && parsedThis.pair) {
const base = parsedThis.base;
const pairUpper = String(parsedThis.pair).toUpperCase();
if (isPartial) {
if (hasHistory) {
if (rawNoDataPairs[base] && typeof rawNoDataPairs[base] === 'object') {
const baseMap = { ...rawNoDataPairs[base] };
delete baseMap[pairUpper];
if (Object.keys(baseMap).length === 0) {
delete rawNoDataPairs[base];
}
else {
rawNoDataPairs[base] = baseMap;
}
}
}
}
else {
if (hasAnyData) {
if (rawNoDataPairs[base] && typeof rawNoDataPairs[base] === 'object') {
const baseMap = { ...rawNoDataPairs[base] };
delete baseMap[pairUpper];
if (Object.keys(baseMap).length === 0) {
delete rawNoDataPairs[base];
}
else {
rawNoDataPairs[base] = baseMap;
}
}
}
else {
const baseMap = (rawNoDataPairs[base] && typeof rawNoDataPairs[base] === 'object')
? { ...rawNoDataPairs[base] }
: {};
baseMap[pairUpper] = true;
rawNoDataPairs[base] = baseMap;
}
}
}
}
catch (e) {
}
try {
const parsed2 = tf_parseStorageAnalystName(scanResult && scanResult.analystName);
const v = scanResult && typeof scanResult.avgSlPips !== 'undefined' ? parseFloat(scanResult.avgSlPips) : NaN;
if (parsed2 && parsed2.base && parsed2.pair && Number.isFinite(v)) {
const base = parsed2.base;
const pairUpper = String(parsed2.pair).toUpperCase();
const baseMap = (rawAvgSlPips[base] && typeof rawAvgSlPips[base] === 'object') ? { ...rawAvgSlPips[base] } : {};
baseMap[pairUpper] = v;
rawAvgSlPips[base] = baseMap;
}
}
catch (e) {
}
try {
if (parsedThis && parsedThis.base && parsedThis.pair && !hasAnyData && !isPartial) {
const base = parsedThis.base;
const pairUpper = String(parsedThis.pair).toUpperCase();
if (rawAvgSlPips[base] && typeof rawAvgSlPips[base] === 'object') {
const baseMap = { ...rawAvgSlPips[base] };
delete baseMap[pairUpper];
if (Object.keys(baseMap).length === 0) {
delete rawAvgSlPips[base];
}
else {
rawAvgSlPips[base] = baseMap;
}
}
}
}
catch (e) {
}
await tf_storageSet({
tfMonthlyStats: monthlyStats,
tfHistorySignals: historySignalsAll,
tfNoDataPairs: rawNoDataPairs,
tfAvgSlPips: rawAvgSlPips
});
}
finally {
await tf_releaseStorageLock('tfMergeLock', lockToken);
}
}

// ===== REV108: Score History scan (runs before History Signal) =====
function tf_scoreNormalizeSpace(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}
function tf_scoreParseNumber(value) {
  const raw = tf_scoreNormalizeSpace(value).replace(/\./g, '').replace(',', '.').replace(/[^0-9+\-.]/g, '');
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}
function tf_scoreParseDecimal(value) {
  const raw = tf_scoreNormalizeSpace(value).replace(',', '.').replace(/[^0-9+\-.]/g, '');
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}
function tf_scoreVisible(el) {
  try {
    if (!el) return false;
    const cs = window.getComputedStyle(el);
    if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return false;
    return true;
  } catch (e) { return !!el; }
}
function tf_scoreMonthInfo(dateText) {
  const text = tf_scoreNormalizeSpace(dateText);
  const map = {january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,
    januari:1,februari:2,maret:3,mei:5,juni:6,juli:7,agustus:8,oktober:10,desember:12};
  const m = text.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return { monthKey: text.toLowerCase(), dateSort: 0 };
  const month = map[String(m[1] || '').toLowerCase()] || 0;
  const year = parseInt(m[2], 10) || 0;
  if (!month || !year) return { monthKey: text.toLowerCase(), dateSort: 0 };
  return { monthKey: String(year) + '-' + String(month).padStart(2, '0'), dateSort: Date.UTC(year, month - 1, 1) };
}
function tf_scoreMetricKey(label) {
  const s = tf_scoreNormalizeSpace(label).toLowerCase().replace(/\s+/g, ' ');
  if (s.indexOf('level') === 0) return 'level';
  if (s.indexOf('kemitraan') === 0 || s.indexOf('partnership') === 0) return 'partnership';
  if (s.indexOf('subscriber') === 0 || s.indexOf('subcriber') === 0) return 'subscriber';
  if (s.indexOf('profit factor') === 0) return 'profitFactor';
  if (s.indexOf('mthly. loss ratio') === 0 || s.indexOf('monthly loss ratio') === 0) return 'monthlyLossRatio';
  if (s.indexOf('profit months') === 0) return 'profitMonths';
  if (s.indexOf('recovery rate') === 0) return 'recoveryRate';
  return '';
}
function tf_scoreReadMetricRows(block) {
  const out = {};
  if (!block) return out;
  const rows = Array.from(block.querySelectorAll('.child-flex-hstr'));
  rows.forEach((row) => {
    const labelEl = row.querySelector('.child-block-ket1-hstr');
    if (!labelEl) return;
    const fullText = tf_scoreNormalizeSpace(labelEl.textContent || '');
    const label = fullText.split(':')[0] || fullText;
    const key = tf_scoreMetricKey(label);
    if (!key) return;
    const valueEl = labelEl.querySelector('.child-block-ket2-hstr');
    const scoreEl = row.querySelector('.child-block-ket3-hstr');
    const maxEl = row.querySelector('.child-block-ket4-hstr');
    let score = tf_scoreParseDecimal(scoreEl ? scoreEl.textContent : '');
    let max = tf_scoreParseDecimal(maxEl ? maxEl.textContent : '');
    if (!Number.isFinite(score)) score = null;
    if (!Number.isFinite(max)) max = 4;
    out[key] = {
      value: tf_scoreNormalizeSpace(valueEl ? valueEl.textContent : fullText.replace(/^[^:]+:\s*/, '')),
      score: score,
      max: Number.isFinite(max) ? max : 4
    };
  });
  return out;
}
async function tf_scoreClick(el) {
  if (!el) return false;
  try { el.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (e) {}
  try { el.click(); return true; } catch (e) {}
  try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); return true; } catch (e) {}
  return false;
}
async function tf_scoreWaitFor(predicate, timeoutMs, stepMs) {
  const until = Date.now() + Math.max(500, Number(timeoutMs) || 8000);
  const delay = Math.max(80, Number(stepMs) || 150);
  while (Date.now() < until) {
    try { const v = predicate(); if (v) return v; } catch (e) {}
    await tf_sleep(delay);
  }
  return null;
}
async function tf_scoreOpenHistory() {
  const scoreTab = document.querySelector('a[href="#tab_scoring"][data-toggle="tab"]') ||
    Array.from(document.querySelectorAll('a[data-toggle="tab"]')).find((a) => /^\s*Score\s*$/i.test(a.textContent || ''));
  if (scoreTab) {
    const parent = scoreTab.closest('li');
    const alreadyActive = !!(parent && parent.classList.contains('active'));
    if (!alreadyActive) {
      await tf_scoreClick(scoreTab);
      await tf_sleep(500);
    }
  }
  await tf_scoreWaitFor(() => document.querySelector('#tab_scoring, #hist_scor, #hist_scor_section'), 9000, 180);
  const historyBtn = document.querySelector('#hist_scor') || document.querySelector('button.hist_scor');
  const section = document.querySelector('#hist_scor_section');
  const sectionShown = section && tf_scoreVisible(section);
  const active = !!(historyBtn && (historyBtn.classList.contains('plat-active') || historyBtn.disabled));
  if (historyBtn && (!sectionShown || !active)) {
    try { historyBtn.disabled = false; } catch (e) {}
    await tf_scoreClick(historyBtn);
    await tf_sleep(500);
  }
  return await tf_scoreWaitFor(() => {
    const sec = document.querySelector('#hist_scor_section');
    const overlay = sec ? sec.querySelector('.wait_histscor') : document.querySelector('.wait_histscor');
    const busy = overlay && tf_scoreVisible(overlay);
    const box = document.querySelector('#hstr-box-se');
    if (sec && tf_scoreVisible(sec) && !busy && box) return box;
    return null;
  }, 15000, 200);
}
async function tf_scoreLoadAllCards(box) {
  if (!box) return [];
  let lastCount = -1;
  let stable = 0;
  for (let i = 0; i < 18; i++) {
    tf_abortIfStop();
    const count = box.querySelectorAll('.child-grid-hstr').length;
    if (count === lastCount) stable += 1; else stable = 0;
    lastCount = count;
    if (stable >= 3) break;
    try { window.scrollTo(0, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)); } catch (e) {}
    await tf_sleep(450);
  }
  try { window.scrollTo(0, 0); } catch (e) {}
  return Array.from(box.querySelectorAll('.child-grid-hstr'));
}
async function tf_scoreScanRows(analystName) {
  const box = await tf_scoreOpenHistory();
  if (!box) return [];
  const cards = await tf_scoreLoadAllCards(box);
  const rows = [];
  for (let i = 0; i < cards.length; i++) {
    tf_abortIfStop();
    const card = cards[i];
    const dateText = tf_scoreNormalizeSpace((card.querySelector('.child-title-hstr') || {}).textContent || '');
    const averageText = tf_scoreNormalizeSpace((card.querySelector('.child-title2-hstr') || {}).textContent || '');
    if (!dateText) continue;
    let block = card.querySelector('.child-block-hstr');
    const hasMetricDom = !!(block && block.querySelector('.child-block-ket1-hstr'));
    if (!hasMetricDom) {
      const expand = card.querySelector('.up_down_history_dtl') || card.querySelector('svg[class*="icon-change-"]');
      if (expand) {
        await tf_scoreClick(expand);
        block = await tf_scoreWaitFor(() => {
          const b = card.querySelector('.child-block-hstr');
          return b && b.querySelector('.child-block-ket1-hstr') ? b : null;
        }, 2500, 120) || block;
      }
    } else if (block && !tf_scoreVisible(block)) {
      const expand = card.querySelector('.up_down_history_dtl') || card.querySelector('svg[class*="icon-change-"]');
      if (expand) {
        await tf_scoreClick(expand);
        await tf_sleep(80);
      }
    }
    const metrics = tf_scoreReadMetricRows(block);
    const mi = tf_scoreMonthInfo(dateText);
    rows.push({
      analyst: tf_scoreNormalizeSpace(analystName),
      date: dateText,
      monthKey: mi.monthKey,
      dateSort: mi.dateSort,
      averageScore: tf_scoreParseDecimal(averageText),
      averageScoreText: averageText,
      level: metrics.level || { value: '', score: null, max: 4 },
      partnership: metrics.partnership || { value: '', score: null, max: 4 },
      subscriber: metrics.subscriber || { value: '', score: null, max: 4 },
      profitFactor: metrics.profitFactor || { value: '', score: null, max: 4 },
      monthlyLossRatio: metrics.monthlyLossRatio || { value: '', score: null, max: 4 },
      profitMonths: metrics.profitMonths || { value: '', score: null, max: 4 },
      recoveryRate: metrics.recoveryRate || { value: '', score: null, max: 4 },
      scannedAt: Date.now(),
      channelUrl: String(location.href || '').replace(/([?&])tfscan=1(?:&|$)/, '$1').replace(/[?&]$/, '')
    });
  }
  return rows;
}
async function tf_scoreMergeRows(rows, analystName) {
  if (!Array.isArray(rows) || !rows.length) return 0;
  const lockToken = await tf_acquireStorageLock('tfScoreMergeLock', 30000, 90000);
  try {
    const data = await tf_storageGet(['tfScoreHistory', 'tfScoreLastScanByAnalyst']);
    const prev = Array.isArray(data.tfScoreHistory) ? data.tfScoreHistory.slice() : [];
    const map = new Map();
    const keyOf = (it) => {
      const a = tf_scoreNormalizeSpace(it && (it.analyst || it.analystName)).toLowerCase();
      const d = tf_scoreNormalizeSpace(it && (it.monthKey || it.date)).toLowerCase();
      return a && d ? a + '|' + d : '';
    };
    prev.forEach((it) => { const k = keyOf(it); if (k) map.set(k, it); });
    rows.forEach((it) => {
      const k = keyOf(it);
      if (!k) return;
      map.set(k, { ...(map.get(k) || {}), ...it });
    });
    const merged = Array.from(map.values()).sort((a, b) => {
      const an = tf_scoreNormalizeSpace(a && a.analyst).localeCompare(tf_scoreNormalizeSpace(b && b.analyst));
      if (an) return an;
      return (Number(b && b.dateSort) || 0) - (Number(a && a.dateSort) || 0);
    });
    const lastMap = (data.tfScoreLastScanByAnalyst && typeof data.tfScoreLastScanByAnalyst === 'object') ? { ...data.tfScoreLastScanByAnalyst } : {};
    lastMap[tf_scoreNormalizeSpace(analystName)] = { at: Date.now(), count: rows.length, ok: true };
    await tf_storageSet({ tfScoreHistory: merged, tfScoreLastScanByAnalyst: lastMap });
    return rows.length;
  } finally {
    await tf_releaseStorageLock('tfScoreMergeLock', lockToken);
  }
}
async function tf_scanAndStoreScoreHistory(analystName) {
  const name = tf_scoreNormalizeSpace(analystName);
  if (!name) return [];
  try { chrome.runtime.sendMessage({ type: 'scoreScanProgress', analystName: name, state: 'Progress...' }, () => { try { void chrome.runtime.lastError; } catch (e) {} }); } catch (e) {}
  const rows = await tf_scoreScanRows(name);
  if (rows.length) await tf_scoreMergeRows(rows, name);
  try { chrome.runtime.sendMessage({ type: 'scoreScanProgress', analystName: name, state: 'Done!', count: rows.length }, () => { try { void chrome.runtime.lastError; } catch (e) {} }); } catch (e) {}
  return rows;
}
// ===== END REV108 Score History scan =====

async function tf_scanChannel(allowedPairs, opts) {
const options = (opts && typeof opts === 'object') ? opts : {};
const scanMode = (options && options.scanMode) ? String(options.scanMode) : 'full';
const batchIndexOpt = (typeof options.batchIndex === 'number' && Number.isFinite(options.batchIndex))
? Math.max(1, Math.floor(options.batchIndex))
: null;
const offsetMonthsOpt = (typeof options.offsetMonths === 'number' && Number.isFinite(options.offsetMonths))
? Math.max(0, Math.floor(options.offsetMonths))
: 0;
const earliestMonthKeyFromMsg = (options && options.earliestMonthKey) ? String(options.earliestMonthKey) : null;
const latestMonthKeyFromMsg = (options && options.latestMonthKey) ? String(options.latestMonthKey) : null;
const monthKeyFromMsg = (options && options.monthKey) ? String(options.monthKey) : null;
const totalBatchesFromMsg = (typeof options.totalBatches === 'number' && Number.isFinite(options.totalBatches))
? Math.max(1, Math.floor(options.totalBatches))
: null;
if (tf_isSessionExpired()) {
tf_markLoggedOutAndNotify('Silahkan login untuk mengakses halaman ini');
throw new Error('SESSION_EXPIRED: Silahkan login untuk mengakses halaman ini');
}
let analystName = await tf_waitForAnalystName(15000);
if (!analystName) {
const chId = tf_getChannelIdFromUrl();
if (chId)
analystName = 'Channel ' + chId;
}
if (!analystName) {
throw new Error('Tidak menemukan nama analis di halaman. Pastikan sudah login dan halaman channel terbuka.');
}
// Capture the official channel lifetime month counter independently of history filters.
try {
 const box=Array.from(document.querySelectorAll('.chnl-rate')).find(el=>/Months\s*\(since/i.test(el.textContent||''));
 const text=box?.querySelector('.sumWeek')?.textContent?.trim();
 if(/^\d+$/.test(text||'')){const stored=await tf_storageGet(['tfAnalystMonths']);const map={...(stored.tfAnalystMonths||{})};map[analystName]={monthsSince:Number(text),url:location.href,capturedAt:new Date().toISOString()};await tf_storageSet({tfAnalystMonths:map});}
}catch(e){console.warn('Month Since metadata unavailable',e);}
const pairKey = (allowedPairs && Array.isArray(allowedPairs) && allowedPairs.length)
? String(allowedPairs[0]).toUpperCase()
: null;
const storageAnalystName = pairKey ? (analystName + ' (' + pairKey + ')') : analystName;
if (scanMode === 'historyBatch') {
if (!pairKey)
throw new Error('historyBatch memerlukan 1 pair spesifik.');
await tf_preparePageForScan(analystName, allowedPairs);
try {
const __tr = await tf_getSelectedTimeRangeSetting();
if (__tr === 'm3') {
const b1 = await tf_scanHistoryBatch1Only(analystName, pairKey, 1);
const items3m = (b1 && b1.items) ? b1.items : [];
const monthCounts3m = (b1 && b1.monthCounts) ? b1.monthCounts : tf_calcMonthCounts(items3m);
await tf_mergeIntoStorage({
analystName: storageAnalystName,
channelUrl: window.location.href,
historySignals: items3m,
partial: true,
scanMode: 'historyBatch'
});
return {
analystName,
monthCount: null,
historyCount: (items3m || []).length,
monthCounts: monthCounts3m,
scanMode: 'historyBatch',
batchIndex: batchIndexOpt || 2,
offsetMonths: offsetMonthsOpt,
rangeStart: null,
rangeEnd: null
};
}
}
catch (e) { }
try {
await tf_openHistoryTab();
try {
await tf_openHistoryFilterPanel();
}
catch (e2) { }
try {
await tf_ensureHistoryPairSelected(pairKey, 3);
}
catch (e3) { }
await tf_waitForHistoryCardsStable(9000);
}
catch (e) { }
let baseMonthStart = null;
try {
baseMonthStart = latestMonthKeyFromMsg ? tf_monthKeyToDateStart(latestMonthKeyFromMsg) : null;
}
catch (e) {
baseMonthStart = null;
}
if (!baseMonthStart) {
const now = new Date();
baseMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
}
const startMonthStart = tf_addMonths(new Date(baseMonthStart.getFullYear(), baseMonthStart.getMonth(), 1), -offsetMonthsOpt);
const endMonthStart = tf_addMonths(new Date(startMonthStart.getFullYear(), startMonthStart.getMonth(), 1), 1);
const startDate = tf_firstDayOfMonth(startMonthStart);
const endDate = tf_lastDayOfMonth(endMonthStart);
let shouldSkip = false;
try {
if (earliestMonthKeyFromMsg) {
const earliestStart = tf_monthKeyToDateStart(earliestMonthKeyFromMsg);
if (earliestStart && endDate && endDate.getTime() < earliestStart.getTime())
shouldSkip = true;
}
}
catch (e) {
shouldSkip = false;
}
let items = [];
let monthCounts = {};
if (shouldSkip) {
try {
tf_emitHistoryBatchStatus(analystName, pairKey, batchIndexOpt || 2, 'Done! (skip)');
}
catch (e) { }
}
else {
const res = await tf_scanHistoryBatchRange(analystName, pairKey, startDate, endDate, batchIndexOpt || 2, offsetMonthsOpt);
items = (res && res.items) ? res.items : [];
monthCounts = (res && res.monthCounts && typeof res.monthCounts === 'object') ? res.monthCounts : tf_calcMonthCounts(items);
await tf_mergeIntoStorage({
analystName: storageAnalystName,
channelUrl: window.location.href,
historySignals: items,
partial: true,
scanMode: 'historyBatch'
});
}
return {
analystName,
monthCount: null,
historyCount: (items || []).length,
monthCounts,
scanMode: 'historyBatch',
batchIndex: batchIndexOpt || 2,
offsetMonths: offsetMonthsOpt,
rangeStart: tf_formatDDMMYYYY(startDate),
rangeEnd: tf_formatDDMMYYYY(endDate)
};
}
if (scanMode === 'historyMonth') {
if (!pairKey)
throw new Error('historyMonth memerlukan 1 pair spesifik.');
if (!monthKeyFromMsg)
throw new Error('historyMonth memerlukan monthKey (YYYY-MM).');
await tf_preparePageForScan(analystName, allowedPairs);
try {
await tf_openHistoryTab();
try {
await tf_openHistoryFilterPanel();
}
catch (e2) { }
try {
await tf_ensureHistoryPairSelected(pairKey, 3);
}
catch (e3) { }
await tf_waitForHistoryCardsStable(9000);
}
catch (e) { }
let startMonthStart = null;
try {
startMonthStart = tf_monthKeyToDateStart(monthKeyFromMsg);
}
catch (e) {
startMonthStart = null;
}
if (!startMonthStart)
throw new Error('historyMonth: monthKey invalid: ' + String(monthKeyFromMsg));
const startDate = tf_firstDayOfMonth(startMonthStart);
const endDate = tf_lastDayOfMonth(startMonthStart);
const bIdx = batchIndexOpt || 0;
try {
tf_emitHistoryBatchStatus(analystName, pairKey, bIdx, 'Progress... (retry ' + String(monthKeyFromMsg) + ')');
}
catch (e) { }
const res = await tf_scanHistoryBatchRange(analystName, pairKey, startDate, endDate, bIdx, 0);
const items = (res && res.items) ? res.items : [];
const monthCounts = (res && res.monthCounts && typeof res.monthCounts === 'object') ? res.monthCounts : tf_calcMonthCounts(items);
await tf_mergeIntoStorage({
analystName: storageAnalystName,
channelUrl: window.location.href,
historySignals: items,
partial: true,
scanMode: 'historyMonth'
});
return {
analystName,
monthCount: null,
historyCount: (items || []).length,
monthCounts,
scanMode: 'historyMonth',
batchIndex: bIdx,
monthKey: String(monthKeyFromMsg),
rangeStart: tf_formatDDMMYYYY(startDate),
rangeEnd: tf_formatDDMMYYYY(endDate)
};
}
await tf_preparePageForScan(analystName, allowedPairs, { skipTimeRangeSelection: scanMode === 'update' });
try {
await tf_openStatisticsTab();
}
catch (e) { }
try {
const tooFewStat = await tf_checkTooFewSignalsOnStatistics(7000);
if (tooFewStat) {
console.log('TF: Statistics tidak dapat menampilkan data (Jumlah signal terlalu sedikit) untuk', storageAnalystName, '- skip scan.');
try { await tf_scanAndStoreScoreHistory(analystName); } catch (scoreErr) { console.warn('TF: Score scan gagal, scan ditutup sesuai alur Statistics.', scoreErr); }
await tf_clearAnalystDataInStorage(storageAnalystName, analystName, pairKey);
return {
analystName,
monthCount: 0,
historyCount: 0,
earliestMonthKey: null,
latestMonthKey: null,
totalBatches: 0,
scanMode
};
}
}
catch (e) {
}
try {
const viewTargets = Array.from(document.querySelectorAll('a.btn-telusuri, span.tels, span.tels.mobile'))
.filter((el) => {
const t = (el.innerText || el.textContent || '').trim();
const oc = (el.getAttribute && el.getAttribute('onclick')) ? String(el.getAttribute('onclick') || '') : '';
return /view\s*details/i.test(t) || /btnViewDetail\s*\(/i.test(oc);
});
if (viewTargets.length) {
viewTargets.forEach((el) => {
try {
el.click();
}
catch (e) {
try {
el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
});
await tf_sleep(900);
}
}
catch (e) {
console.warn('TF: gagal klik View Details sebelum scan Statistics', e);
}
let avgSlPips = null;
try {
avgSlPips = tf_scanAverageSlPipsFromStatistics();
if (!Number.isFinite(avgSlPips))
avgSlPips = null;
}
catch (e) {
avgSlPips = null;
}
try {
await tf_waitForStatisticsDetailReady(9000);
}
catch (e) { }
let monthly = await tf_scanMonthlyStatsAllYears(analystName);
if (!monthly || Object.keys(monthly).length === 0) {
console.warn('TF: Monthly kosong di attempt #1 untuk', analystName, '- menunggu & scan lagi...');
await tf_sleep(1500);
try {
await tf_openStatisticsTab();
}
catch (e) { }
try {
const viewTargets2 = Array.from(document.querySelectorAll('a.btn-telusuri, span.tels, span.tels.mobile'))
.filter((el) => {
const t = (el.innerText || el.textContent || '').trim();
const oc = (el.getAttribute && el.getAttribute('onclick')) ? String(el.getAttribute('onclick') || '') : '';
return /view\s*details/i.test(t) || /btnViewDetail\s*\(/i.test(oc);
});
if (viewTargets2.length) {
viewTargets2.forEach((el) => {
try {
el.click();
}
catch (e) {
try {
el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
catch (e2) { }
}
});
await tf_sleep(900);
}
}
catch (e) {
console.warn('TF: gagal klik View Details pada retry Statistics', e);
}
monthly = await tf_scanMonthlyStatsAllYears(analystName);
}
if (avgSlPips === null) {
try {
await tf_sleep(600);
const v2 = tf_scanAverageSlPipsFromStatistics();
if (Number.isFinite(v2))
avgSlPips = v2;
}
catch (e) { }
}
const earliestMonthKey = tf_getEarliestMonthKey(monthly);
const latestMonthKey = tf_getLatestMonthKey(monthly);
let totalBatches = totalBatchesFromMsg;
if (!totalBatches) {
try {
const totalMonths = tf_monthsBetweenInclusive(earliestMonthKey, latestMonthKey);
if (totalMonths != null && Number.isFinite(totalMonths) && totalMonths > 0) {
totalBatches = Math.max(1, Math.ceil(totalMonths / 2));
}
else {
totalBatches = 1;
}
}
catch (e) {
totalBatches = 1;
}
}
let __tfSelectedTR = 'all_time';
let __tfIsTR3M = false;
try {
__tfSelectedTR = await tf_getSelectedTimeRangeSetting();
__tfIsTR3M = (__tfSelectedTR === 'm3');
}
catch (e) {
__tfIsTR3M = false;
}
if (__tfIsTR3M || scanMode === 'update') {
totalBatches = 1;
}
try {
if (pairKey && totalBatches && Number.isFinite(totalBatches)) {
tf_emitHistoryBatchStatus(analystName, pairKey, 0, '0/' + String(totalBatches));
}
}
catch (e) { }
try {
await tf_clickKembaliAfterStatistics(9000);
}
catch (e) { }
try { await tf_scanAndStoreScoreHistory(analystName); } catch (scoreErr) { console.warn('TF: Score scan gagal, lanjut History Signal seperti biasa.', scoreErr); }
try {
await tf_openHistoryTab();
await tf_waitForHistoryCardsStable(9000);
}
catch (e) {
console.warn('TF: gagal memastikan history sampai page terakhir', e);
}
let historySignals = [];
if (scanMode === 'update') {
// Jalur khusus Update: tidak memilih Time Range, tidak mengubah kalender,
// dan hanya menjalankan satu kali Find pada rentang aktif/default History.
const updateLatest = await tf_scanHistoryUpdateCurrentRange(analystName, pairKey);
historySignals = (updateLatest && updateLatest.items) ? updateLatest.items : [];
totalBatches = 1;
}
else if (scanMode === 'main' || __tfIsTR3M) {
const b1 = await tf_scanHistoryBatch1Only(analystName, pairKey, totalBatches);
historySignals = (b1 && b1.items) ? b1.items : [];
}
else {
historySignals = await tf_scanHistorySignalsBatched(analystName, allowedPairs, earliestMonthKey, latestMonthKey, totalBatches, monthly, options.resumeCheckpoint || null);
}
const result = {
analystName: storageAnalystName,
channelUrl: window.location.href,
monthly,
historySignals,
avgSlPips,
scanMode: scanMode,
replaceExisting: options.replaceExisting === true
};
if (scanMode === 'update') {
result.partial = true;
}
await tf_mergeIntoStorage(result);
try {
if (scanMode === 'update' && pairKey) {
tf_emitHistoryBatchStatus(analystName, pairKey, 0, '1/1');
}
}
catch (e) { }
try {
if (pairKey)
await tf_clearHistoryResumeSession(analystName, pairKey);
}
catch (e) { }
return {
analystName,
monthCount: Object.keys(monthly || {}).length,
historyCount: (historySignals || []).length,
earliestMonthKey,
latestMonthKey,
totalBatches,
scanMode
};
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
if (!msg)
return;
if (msg.type === 'ping') {
try {
sendResponse({ ok: true });
}
catch (e) { }
return;
}
if (msg.type === 'stopScan') {
try {
tf_requestStopScan();
}
catch (e) { }
try {
sendResponse({ ok: true });
}
catch (e) { }
return;
}
if (msg.type === 'scanIsignalActiveChannels') {
(async () => {
try {
const urlNow = String(location && location.href ? location.href : '');
if (!/\/channels\/isignal\/?($|\?)/i.test(urlNow)) {
}
const maxLoops = 14;
let lastH = 0;
for (let i = 0; i < maxLoops; i++) {
const h = Math.max(document.documentElement ? document.documentElement.scrollHeight : 0, document.body ? document.body.scrollHeight : 0);
if (h <= lastH) {
await new Promise(r => setTimeout(r, 500));
const h2 = Math.max(document.documentElement ? document.documentElement.scrollHeight : 0, document.body ? document.body.scrollHeight : 0);
if (h2 <= lastH)
break;
lastH = h2;
}
else {
lastH = h;
}
try {
window.scrollTo(0, lastH);
}
catch (e) { }
await new Promise(r => setTimeout(r, 650));
}
try {
await tf_isignalEnsureLoadMoreBeforeScan();
}
catch (e) { }
try {
window.scrollTo(0, 0);
}
catch (e) { }
const cards = Array.from(document.querySelectorAll('.signal-card'));
if (!cards.length) {
sendResponse({ ok: false, error: 'Tidak menemukan signal-card. Pastikan sudah login & membuka halaman iSignal list.' });
return;
}
const items = [];
const seen = new Set();
for (const card of cards) {
if (!card)
continue;
const header = card.querySelector('.header');
const headerText = header ? String(header.textContent || '') : '';
const isActive = !!((header && header.classList && header.classList.contains('aktif')) ||
(/\bAktif\b/i.test(headerText)&&!/tidak\s+aktif|non.?aktif|inactive/i.test(headerText)));
if (!isActive)
continue;
const nameEl = card.querySelector('.channel-name.add .truncate-text') ||
card.querySelector('.channel-name .truncate-text') ||
card.querySelector('.channel-name.add p') ||
null;
const analystName = nameEl ? String(nameEl.textContent || '').trim() : '';
const a = card.querySelector('.channel-name.add a[href^="/channels/"]') ||
card.querySelector('.channel-name a[href^="/channels/"]') ||
null;
const href = a && a.getAttribute ? (a.getAttribute('href') || '') : '';
if (!href)
continue;
let fullUrl = '';
try {
fullUrl = new URL(href, location.origin).href;
}
catch (e) {
fullUrl = href;
}
const key = fullUrl.trim();
if (!key || seen.has(key))
continue;
seen.add(key);
const settingLink=Array.from(card.querySelectorAll('a[href]')).find(a=>/Atur\s+iSignal/i.test(a.textContent||''));
const settingsUrl=settingLink?new URL(settingLink.getAttribute('href'),location.origin).href:'';
items.push({ name: analystName, url: fullUrl, settingsUrl });
}
sendResponse({ ok: true, items });
}
catch (err) {
sendResponse({ ok: false, error: err && err.message ? err.message : String(err) });
}
})();
return true;
}
if (msg.type === 'getAnalystName') {
(async () => {
try {
const name = await tf_waitForAnalystName(4000);
sendResponse({ ok: true, analystName: name || '' });
}
catch (err) {
sendResponse({ ok: false, error: err && err.message ? err.message : String(err) });
}
})();
return true;
}
if (msg.type !== 'scanChannel')
return;
let tfKeepAlivePort = null;
let tfKeepAliveTimer = null;
function tf_startBgKeepAlive() {
try {
if (tfKeepAlivePort)
return;
tfKeepAlivePort = chrome.runtime.connect({ name: 'tf_keepalive' });
tfKeepAlivePort.onDisconnect.addListener(() => {
try {
if (tfKeepAliveTimer)
clearInterval(tfKeepAliveTimer);
}
catch (e) { }
tfKeepAliveTimer = null;
tfKeepAlivePort = null;
});
tfKeepAliveTimer = setInterval(() => {
try {
if (!tfKeepAlivePort)
return;
tfKeepAlivePort.postMessage({ type: 'ping', ts: Date.now() });
}
catch (e) { }
}, 20000);
}
catch (e) { }
}
function tf_stopBgKeepAlive() {
try {
if (tfKeepAliveTimer)
clearInterval(tfKeepAliveTimer);
}
catch (e) { }
tfKeepAliveTimer = null;
try {
if (tfKeepAlivePort)
tfKeepAlivePort.disconnect();
}
catch (e) { }
tfKeepAlivePort = null;
}
try {
try {
tf_resetStopScan();
}
catch (e) { }
const allowedPairs = (msg && Array.isArray(msg.pairs) && msg.pairs.length)
? msg.pairs
: null;
const jobToken = (msg && msg.jobToken) ? String(msg.jobToken) : null;
try { tf_startScanJobHeartbeat(jobToken); } catch (e) { }
const opts = {
scanMode: (msg && msg.scanMode) ? msg.scanMode : null,
replaceExisting: msg && msg.replaceExisting === true,
batchIndex: (msg && typeof msg.batchIndex === 'number') ? msg.batchIndex : null,
offsetMonths: (msg && typeof msg.offsetMonths === 'number') ? msg.offsetMonths : null,
monthKey: (msg && msg.monthKey) ? msg.monthKey : null,
earliestMonthKey: (msg && msg.earliestMonthKey) ? msg.earliestMonthKey : null,
latestMonthKey: (msg && msg.latestMonthKey) ? msg.latestMonthKey : null,
totalBatches: (msg && typeof msg.totalBatches === 'number') ? msg.totalBatches : null,
resumeCheckpoint: (msg && msg.resumeCheckpoint && typeof msg.resumeCheckpoint === 'object') ? msg.resumeCheckpoint : null
};
try {
tf_setScanInProgress(true);
}
catch (e) { }
try {
tf_startBgKeepAlive();
}
catch (e) { }
try {
sendResponse({ ok: true, started: true });
}
catch (e) { }
(async () => {
try {
const summary = await tf_scanChannel(allowedPairs, opts);
try {
chrome.runtime.sendMessage({
type: 'scanChannelFinished',
ok: true,
jobToken,
summary: summary || {}
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
catch (e) { }
}
catch (err) {
const errText = (err && err.message) ? err.message : String(err);
console.error('TF scanChannel error', err);
try {
chrome.runtime.sendMessage({
type: 'scanChannelFinished',
ok: false,
jobToken,
error: errText
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
catch (e) { }
}
finally {
try {
tf_stopScanJobHeartbeat();
}
catch (e) { }
try {
tf_setScanInProgress(false);
}
catch (e) { }
try {
tf_stopBgKeepAlive();
}
catch (e) { }
}
})();
}
catch (err) {
console.error('TF scanChannel start error', err);
try {
sendResponse({ ok: false, error: err && err.message ? err.message : String(err) });
}
catch (e) { }
}
return;
});
function tf_findLogoutButtonPatched() { return document.querySelector('a[data-track="gtm_c_sb_nav_keluar"]') || document.querySelector('a[href*="/logout/"]'); }

function tf_readIntegratedPairs450(){
 const pairs=new Set();
 document.querySelectorAll('.pos-size-container').forEach(section=>{
  if(!/Symbol\s+terintegrasi/i.test(section.querySelector('.text-symbol-card')?.textContent||''))return;
  section.querySelectorAll('.list-symbol-new .per-symbol b').forEach(el=>{const symbol=String(el.textContent||'').trim().toUpperCase();if(/^[A-Z][A-Z0-9._-]{2,19}$/.test(symbol))pairs.add(symbol);});
 });
 return [...pairs].sort();
}
chrome.runtime.onMessage.addListener((msg,sender,respond)=>{
 if(msg?.type!=='tfIsignalIntegratedPairs450')return;
 (async()=>{
  if(!/^\/channels\/isignal\/\d+\/?$/.test(location.pathname))throw new Error('Halaman Atur iSignal tidak cocok.');
  const deadline=Date.now()+20000;
  while(Date.now()<deadline){
   const channel=Array.from(document.querySelectorAll('a[href]')).find(a=>{try{return new URL(a.href,location.origin).pathname===new URL(msg.channelUrl).pathname;}catch(e){return false;}});
   const ready=document.querySelector('.pos-size-container')||Array.from(document.querySelectorAll('button')).some(b=>/Sambungkan akun MetaTrader baru/i.test(b.textContent||''));
   if(channel&&ready){respond({ok:true,pairs:tf_readIntegratedPairs450()});return;}
   await new Promise(r=>setTimeout(r,250));
  }
  throw new Error('Symbol terintegrasi belum dapat dibaca; data pair lama dipertahankan.');
 })().catch(e=>respond({ok:false,error:String(e.message||e)}));
 return true;
});
