// REV207 login helper: existing account tabs are passive; fresh root probes require a visible Online marker for successful login, while Masuk/Daftar remain authoritative logout evidence.
(function () {
const __TF_LOGIN_HELPER_REVISION__ = 'REV213';
let __tf_isScanTab = false;
try {
const u = new URL(String(location.href || ''));
__tf_isScanTab = (u.searchParams.get('tfscan') === '1');
}
catch (e) {
try {
__tf_isScanTab = /(?:\?|&)tfscan=1\b/i.test(String(location.search || ''));
}
catch (err) { }
}
if (__tf_isScanTab) {
return;
}
// REV212 — an auth/profile helper tab may become stale or show the login page while a
// long batch is still running. Treat that as deferred evidence, not as an immediate
// global logout. Explicit Logout URLs remain authoritative.
let __tf_scanProtected = false;
function tf_deferScanLogoutEvidence(reason, message) {
try {
if (!hasChromeStorage()) return;
chrome.storage.local.set({
tfDeferredLogoutDuringScanAt: Date.now(),
tfDeferredLogoutDuringScanReason: reason ? String(reason) : 'SESSION_CANDIDATE',
tfDeferredLogoutDuringScanMessage: message ? String(message).slice(0, 500) : '',
tfForceLoginForm: false
}, function () { });
}
catch (e) { }
}
try {
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
chrome.storage.local.get(['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt', 'tfMultiHeartbeatV419'], (st) => {
try {
const now = Date.now();
const hb = Number(st && st.tfActiveScanHeartbeatAt || 0);
const pg = Number(st && st.tfActiveScanProgressAt || 0);
__tf_scanProtected = !!(st && Number(st.tfMultiHeartbeatV419 || 0) > now - 15000) || !!(st && st.tfScanInProgress && ((hb > 0 && now - hb < 120000) || (pg > 0 && now - pg < 120000)));
}
catch (e) { __tf_scanProtected = false; }
});
if (chrome.storage.onChanged) {
chrome.storage.onChanged.addListener((changes, area) => {
try {
if (area === 'local' && changes && (changes.tfScanInProgress || changes.tfActiveScanHeartbeatAt || changes.tfActiveScanProgressAt || changes.tfMultiHeartbeatV419)) {
chrome.storage.local.get(['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt', 'tfMultiHeartbeatV419'], (st) => {
try {
const now = Date.now();
const hb = Number(st && st.tfActiveScanHeartbeatAt || 0);
const pg = Number(st && st.tfActiveScanProgressAt || 0);
__tf_scanProtected = !!(st && Number(st.tfMultiHeartbeatV419 || 0) > now - 15000) || !!(st && st.tfScanInProgress && ((hb > 0 && now - hb < 120000) || (pg > 0 && now - pg < 120000)));
}
catch (e) { __tf_scanProtected = false; }
});
}
}
catch (e) { }
});
}
}
}
catch (e) { }
let __tf_isAuthTab = false;
let __tf_authToken = '';
let __tf_isLogoutPath = false;
let __tf_isSignOutUrl = false;
let __tf_isProfileProbe = false;
const __tf_pageLoadAt = (() => {
try {
const origin = Number(performance && performance.timeOrigin || 0);
return origin > 0 ? origin : Date.now();
}
catch (e) { return Date.now(); }
})();
function tf_isStalePreLogoutPage(explicitLogoutAt) {
const ts = Number(explicitLogoutAt || 0);
return !!(ts && __tf_pageLoadAt && __tf_pageLoadAt < ts);
}
try {
const __u = new URL(String(location.href || ''));
const qsTok = String(__u.searchParams.get('tfAuthToken') || '');
const qsAuth = (__u.searchParams.get('tfAuth') === '1');
if (qsTok)
__tf_authToken = qsTok;
if (qsAuth || qsTok)
__tf_isAuthTab = true;
try {
if (qsAuth)
sessionStorage.setItem('tfAuth', '1');
if (qsTok) {
sessionStorage.setItem('tfAuthToken', qsTok);
sessionStorage.setItem('__tf_authFlowTokCache', qsTok);
}
}
catch (e2) { }
__tf_isSignOutUrl = (String(__u.searchParams.get('sign') || '').toLowerCase() === 'out');
__tf_isLogoutPath = /\/logout\/?$/i.test(String(__u.pathname || '')) || __tf_isSignOutUrl;
__tf_isProfileProbe = (__u.searchParams.get('tfext_profile') === '1' || __u.searchParams.get('tfscan_profile_resolve') === '1');
}
catch (e) { }
try {
const __ssAuth = sessionStorage.getItem('tfAuth') || '';
const __ssTok = sessionStorage.getItem('__tf_authFlowTokCache') || sessionStorage.getItem('tfAuthToken') || '';
if (!__tf_authToken && __ssTok)
__tf_authToken = String(__ssTok || '');
if (!__tf_isAuthTab && (__ssAuth === '1' || __ssTok))
__tf_isAuthTab = true;
}
catch (e) { }
if (!__tf_isLogoutPath) {
try {
__tf_isLogoutPath = (String(location.search || '').toLowerCase().indexOf('sign=out') !== -1);
if (__tf_isLogoutPath)
__tf_isSignOutUrl = true;
}
catch (e) { }
}
let __tf_extensionContextInvalidated = false;
let __tf_postLoginRootSyncRequested = false;
let __tf_accountSyncTimerIds = [];
let __tf_accountProfileObserver = null;
function tf_isExtensionContextError(error) {
try {
const message = String(error && (error.message || error) || '');
return /extension context invalidated|context invalidated|cannot access a chrome|chrome\.runtime is undefined/i.test(message);
}
catch (e) { return false; }
}
function tf_stopAccountSync() {
try {
const ids = Array.isArray(__tf_accountSyncTimerIds) ? __tf_accountSyncTimerIds.splice(0) : [];
ids.forEach((item) => {
try {
if (item && item.kind === 'interval') clearInterval(item.id);
else if (item) clearTimeout(item.id);
}
catch (e) { }
});
}
catch (e) { }
try {
if (__tf_accountProfileObserver) __tf_accountProfileObserver.disconnect();
}
catch (e) { }
__tf_accountProfileObserver = null;
}
function tf_handleExtensionContextError(error) {
if (!tf_isExtensionContextError(error)) return false;
__tf_extensionContextInvalidated = true;
tf_stopAccountSync();
return true;
}
function tf_extensionContextAlive() {
if (__tf_extensionContextInvalidated) return false;
try {
const alive = !!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id && chrome.storage && chrome.storage.local);
if (!alive) {
__tf_extensionContextInvalidated = true;
tf_stopAccountSync();
}
return alive;
}
catch (error) {
tf_handleExtensionContextError(error);
return false;
}
}
function hasChromeStorage() {
return tf_extensionContextAlive();
}
function tf_isElementVisible(el) {
try {
if (!el)
return false;
try {
const ah = el.getAttribute && el.getAttribute('aria-hidden');
if (ah === 'true')
return false;
}
catch (e) { }
try {
if (el.hasAttribute && el.hasAttribute('hidden'))
return false;
}
catch (e) { }
const style = window.getComputedStyle(el);
if (!style)
return false;
if (style.display === 'none' || style.visibility === 'hidden')
return false;
if (String(style.opacity || '') === '0')
return false;
const rect = el.getBoundingClientRect();
if (!rect)
return false;
if (rect.width <= 0 || rect.height <= 0)
return false;
return true;
}
catch (e) {
return false;
}
}
function tf_findVisibleLoggedOutMenu() {
try {
const selectors = [
'li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]',
'li.user.user-menu.m a[href*="account.tradersfamily.id/login"]',
'a[data-track="gtm_c_sb_nav_msk"]',
'a[href*="account.tradersfamily.id/login/"]',
'li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]',
'li.user.user-menu.m a[href*="account.tradersfamily.id/register"]',
'a[data-track="gtm_c_sb_nav_rgstr"]',
'a[href*="account.tradersfamily.id/register/"]'
];
for (const selector of selectors) {
const nodes = Array.from(document.querySelectorAll(selector));
const hit = nodes.find((el) => tf_isElementVisible(el));
if (hit) return hit;
}
return null;
}
catch (e) { return null; }
}
function tf_markVisibleLoggedOutMenu() {
if (!hasChromeStorage()) return false;
const marker = tf_findVisibleLoggedOutMenu();
if (!marker) return false;
if (__tf_scanProtected && !__tf_isAuthTab && !__tf_isLogoutPath && !__tf_isSignOutUrl) {
try { tf_deferScanLogoutEvidence('NAVBAR_LOGGED_OUT', 'Tombol Masuk/Daftar terdeteksi pada helper tab saat batch scan aktif'); } catch (e) { }
return true;
}
try {
const now = Date.now();
chrome.storage.local.set({
tfLoginConfirmed: false,
tfLoginConfirmedAt: now,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true,
tfProfileNeedsRefresh: false,
tfLoginError: 'Session TradersFamily tidak aktif. Silakan login.'
}, function () { });
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], function () { });
}
catch (e) { }
return true;
}
var tfLogoutNotified = false;
function tf_isMt4LoginPage() {
try {
if (/\/loginmt\/?/i.test(String(location.pathname || '')))
return true;
}
catch (e) { }
try {
return !!(document.querySelector('#logname') && document.querySelector('#logpass'));
}
catch (e) { }
return false;
}
function tf_getCaptchaResponseValue() {
try {
const ta = document.querySelector('textarea#g-recaptcha-response') || document.querySelector('textarea[name="g-recaptcha-response"]');
const v = ta ? String(ta.value || '').trim() : '';
return v;
}
catch (e) { }
return '';
}
function tf_isCaptchaSolved() {
const v = tf_getCaptchaResponseValue();
return !!(v && v.length > 0);
}
function tf_hasCaptchaWidget() {
try {
if (document.querySelector('.g-recaptcha, .grecaptcha-badge, #recaptcha'))
return true;
if (document.querySelector('.recaptcha-checkbox, .recaptcha-checkbox-border'))
return true;
if (document.querySelector('textarea#g-recaptcha-response, textarea[name="g-recaptcha-response"]'))
return true;
if (document.querySelector('iframe[src*="recaptcha"], iframe[title*="reCAPTCHA"], iframe[src*="google.com/recaptcha"], iframe[src*="recaptcha.net"]'))
return true;
}
catch (e) { }
return false;
}
function tf_setCaptchaFlags(need, solved) {
if (!hasChromeStorage())
return;
try {
chrome.storage.local.set({
tfCaptchaNeeded: !!need,
tfCaptchaSolved: !!solved
}, () => { });
}
catch (e) { }
}
function tf_fillInput(el, val) {
if (!el)
return;
try {
el.focus();
el.value = val;
el.dispatchEvent(new Event('input', { bubbles: true }));
el.dispatchEvent(new Event('change', { bubbles: true }));
}
catch (e) { }
}
function tf_submitMt4Login(identity, password) {
try {
const idEl = document.querySelector('#logname') || document.querySelector('input[name="logname"]');
const pwEl = document.querySelector('#logpass') || document.querySelector('input[name="pass"]');
const btn = document.querySelector('#btn-signin');
if (!idEl || !pwEl || !btn)
return false;
tf_fillInput(idEl, identity);
tf_fillInput(pwEl, password);
setTimeout(() => { try {
btn.click();
}
catch (e) { } }, 50);
return true;
}
catch (e) { }
return false;
}
function tf_clickGoogleLoginButton() {
try {
const a = document.getElementById('login-google') || document.querySelector('a#login-google');
if (a) {
a.click();
return true;
}
}
catch (e) { }
return false;
}
function tf_findStandardLoginControls() {
try {
const forms = Array.from(document.querySelectorAll('form'));
let form = null;
for (const f of forms) {
const pw = f.querySelector('input[type="password"]');
if (pw && tf_isElementVisible(pw)) {
form = f;
break;
}
}
if (!form)
form = document.querySelector('form.form-signin') || document.querySelector('form#loginForm') || document.querySelector('form');
let passInput = (form && (form.querySelector('#logpass') || form.querySelector('input[name="logpass"]') || form.querySelector('input[name="password"]') || form.querySelector('input[type="password"]'))) ||
document.querySelector('#logpass, input[name="logpass"], input[name="password"], input[type="password"]');
try {
if (passInput && !tf_isElementVisible(passInput)) {
passInput = null;
}
if (!passInput) {
const pws = Array.from(document.querySelectorAll('input[type="password"]')).filter((el) => tf_isElementVisible(el));
passInput = pws && pws[0] ? pws[0] : null;
}
}
catch (e) { }
let emailInput = null;
if (form) {
emailInput =
form.querySelector('#logname') ||
form.querySelector('input[name="logname"]') ||
form.querySelector('input[name="email"]') ||
form.querySelector('input[name="username"]') ||
form.querySelector('input[name="user"]') ||
form.querySelector('input.input-login[type="text"]') ||
form.querySelector('input.input-login[type="email"]') ||
form.querySelector('input[type="email"]') ||
form.querySelector('input[type="text"]');
}
if (!emailInput) {
const inputs = Array.from(document.querySelectorAll('input[type="text"],input[type="email"],input:not([type])'));
const scored = inputs
.filter((el) => tf_isElementVisible(el))
.map((el) => {
const ph = String(el.getAttribute('placeholder') || '').toLowerCase();
const nm = String(el.getAttribute('name') || '').toLowerCase();
const id = String(el.getAttribute('id') || '').toLowerCase();
let score = 0;
if (/email|username|user|logname|mt4|account|id/.test(ph))
score += 5;
if (/logname|email|username|user|mt4/.test(nm))
score += 5;
if (/logname|email|username|user|mt4/.test(id))
score += 5;
if (passInput && el.compareDocumentPosition && (el.compareDocumentPosition(passInput) & Node.DOCUMENT_POSITION_FOLLOWING)) {
score += 1;
}
return { el, score };
})
.sort((a, b) => b.score - a.score);
emailInput = scored && scored[0] ? scored[0].el : null;
}
let btn = null;
if (form) {
btn =
form.querySelector('#btn-signin') ||
form.querySelector('button[type="submit"]') ||
form.querySelector('input[type="submit"]') ||
form.querySelector('a.btn') ||
form.querySelector('button.btn-green.btn-block[type="submit"]') ||
form.querySelector('button.btn.btn-lg.btn-green.btn-block[type="submit"]') ||
form.querySelector('button.btn-green') ||
form.querySelector('button.btn');
}
if (!btn) {
const btns = Array.from(document.querySelectorAll('button[type="submit"],button,input[type="submit"],a.btn,a.btn-block,a'));
btn = btns.find((b) => {
if (!tf_isElementVisible(b))
return false;
const t = String(b.innerText || b.textContent || '').trim();
return /^(masuk|login|sign\s*in)$/i.test(t) || /masuk/i.test(t);
}) || null;
}
if (emailInput && !tf_isElementVisible(emailInput))
emailInput = null;
if (btn && !tf_isElementVisible(btn))
btn = null;
return { emailInput, passInput, btn };
}
catch (e) { }
return { emailInput: null, passInput: null, btn: null };
}
function tf_isDisabled(el) {
try {
if (!el)
return true;
if (el.disabled)
return true;
const aria = String(el.getAttribute && el.getAttribute('aria-disabled') || '').toLowerCase();
if (aria === 'true')
return true;
}
catch (e) { }
return false;
}
function tf_isAuthUrlReadyForToken(flowToken) {
try {
const tok = String(flowToken || '').trim();
if (!tok)
return false;
const href = String(location.href || '');
if (href.indexOf('tfAuth=1') !== -1 && href.indexOf('tfAuthToken=') !== -1) {
try {
const u = new URL(href);
const t = String(u.searchParams.get('tfAuthToken') || '').trim();
const a = String(u.searchParams.get('tfAuth') || '').trim();
if (a === '1' && t && t === tok)
return true;
}
catch (e) { }
}
try {
const ssTok = String(sessionStorage.getItem('tfAuthToken') || sessionStorage.getItem('__tf_authFlowTokCache') || '').trim();
const ssAuth = String(sessionStorage.getItem('tfAuth') || '').trim();
if ((ssAuth === '1' || ssTok) && ssTok && ssTok === tok)
return true;
}
catch (e) { }
}
catch (e) { }
return false;
}
function tf_tryStandardLoginOnce(identity, password) {
try {
const c = tf_findStandardLoginControls();
if (!c || !c.emailInput || !c.passInput || !c.btn)
return false;
if (tf_isDisabled(c.emailInput) || tf_isDisabled(c.passInput) || tf_isDisabled(c.btn))
return false;
tf_fillInput(c.emailInput, identity);
tf_fillInput(c.passInput, password);
setTimeout(() => {
try {
const form = (c.btn && c.btn.closest) ? (c.btn.closest('form') || null) : null;
const form2 = form || (c.passInput && c.passInput.closest ? c.passInput.closest('form') : null) || (c.emailInput && c.emailInput.closest ? c.emailInput.closest('form') : null);
if (form2 && typeof form2.requestSubmit === 'function') {
try {
form2.requestSubmit(c.btn);
}
catch (e) {
try {
c.btn.click();
}
catch (err) { }
}
}
else {
try {
c.btn.click();
}
catch (e) { }
}
}
catch (e) {
try {
c.btn.click();
}
catch (err) { }
}
}, 60);
return true;
}
catch (e) { }
return false;
}
function tf_startStandardLogin(identity, password, flowToken, removePending = true) {
if (flowToken && !tf_isAuthUrlReadyForToken(flowToken)) {
return false;
}
if (tf_tryStandardLoginOnce(identity, password)) {
if (removePending) {
try {
chrome.storage.local.remove(['tfPendingLogin'], () => { });
}
catch (e) { }
}
return true;
}
if (!window.__tf_stdLoginPoller) {
let tries = 0;
window.__tf_stdLoginPoller = setInterval(() => {
tries++;
try {
if (flowToken && !tf_isAuthUrlReadyForToken(flowToken)) {
}
else if (tf_tryStandardLoginOnce(identity, password)) {
try {
clearInterval(window.__tf_stdLoginPoller);
}
catch (e) { }
window.__tf_stdLoginPoller = null;
if (removePending) {
try {
chrome.storage.local.remove(['tfPendingLogin'], () => { });
}
catch (e) { }
}
return;
}
}
catch (e) { }
if (tries > 150) {
try {
clearInterval(window.__tf_stdLoginPoller);
}
catch (e) { }
window.__tf_stdLoginPoller = null;
}
}, 200);
}
return false;
}
function tf_detectLogoutSuccess() {
if (!hasChromeStorage())
return;
try {
const qs = String(location.search || '').toLowerCase();
if (__tf_isSignOutUrl || qs.indexOf('sign=out') !== -1) {
chrome.storage.local.set({
tfAuthTokenSeen: (__tf_authToken || ''),
tfLogoutSuccess: true,
tfLogoutSuccessAt: Date.now(),
tfExplicitLogoutAt: Date.now(),
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: Date.now(),
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true
}, () => { });
try {
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfPendingLogin', 'tfPendingGoogleLogin', 'tfCaptchaNeeded', 'tfCaptchaSolved'], () => { });
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'tfLogoutSuccess', token: (__tf_authToken || '') });
}
catch (e) { }
return;
}
}
catch (e) { }
try {
const modal = document.getElementById('modal-notif');
if (!modal)
return;
const modalText = ((modal.innerText || modal.textContent || '') + '').trim();
if (!modalText)
return;
if (/Berhasil\s*Logout/i.test(modalText) || (/Success/i.test(modalText) && /Logout/i.test(modalText))) {
try {
chrome.storage.local.set({
tfAuthTokenSeen: (__tf_authToken || ''),
tfLogoutSuccess: true,
tfLogoutSuccessAt: Date.now(),
tfExplicitLogoutAt: Date.now(),
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: Date.now(),
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true
}, () => { });
}
catch (e) { }
try {
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfPendingLogin', 'tfPendingGoogleLogin', 'tfCaptchaNeeded', 'tfCaptchaSolved'], () => { });
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'tfLogoutSuccess', token: (__tf_authToken || '') });
}
catch (e) { }
}
}
catch (e) { }
}
let __tf_googleAssistInjected = false;
function tf_injectGoogleAssistOverlay() {
try {
if (__tf_googleAssistInjected)
return;
__tf_googleAssistInjected = true;
if (!__tf_isAuthTab)
return;
const overlay = document.createElement('div');
overlay.id = 'tf-google-assist-overlay';
overlay.style.cssText = [
'position:fixed', 'inset:0', 'z-index:2147483647',
'background:rgba(0,0,0,0.55)', 'display:flex', 'align-items:center', 'justify-content:center'
].join(';');
const card = document.createElement('div');
card.style.cssText = [
'width:min(520px,92vw)', 'background:#111827', 'color:#fff',
'border-radius:14px', 'padding:18px 18px 16px',
'box-shadow:0 18px 48px rgba(0,0,0,.45)',
'font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif'
].join(';');
const title = document.createElement('div');
title.textContent = 'Login Google';
title.style.cssText = 'font-size:16px;font-weight:800;margin-bottom:6px;';
const desc = document.createElement('div');
desc.textContent = 'Klik tombol di bawah ini untuk memulai login Google (wajib klik manual 1x supaya popup tidak diblokir oleh Chrome).';
desc.style.cssText = 'font-size:13px;opacity:.92;line-height:1.35;margin-bottom:12px;';
const warn = document.createElement('div');
warn.style.cssText = 'font-size:12px;opacity:.8;line-height:1.35;margin-bottom:12px;';
warn.textContent = 'Jika tetap muncul "auth/popup-blocked", berarti browser memblokir pop-up. Izinkan pop-up untuk account.tradersfamily.id lalu coba lagi.';
const row = document.createElement('div');
row.style.cssText = 'display:flex;gap:10px;align-items:center;justify-content:flex-end;';
const btn = document.createElement('button');
btn.type = 'button';
btn.textContent = 'Klik untuk Login Google';
btn.style.cssText = [
'background:#22c55e', 'border:none', 'color:#052e16',
'font-weight:800', 'padding:10px 14px', 'border-radius:10px',
'cursor:pointer'
].join(';');
const btnClose = document.createElement('button');
btnClose.type = 'button';
btnClose.textContent = 'Tutup';
btnClose.style.cssText = [
'background:transparent', 'border:1px solid rgba(255,255,255,.22)',
'color:#fff', 'padding:10px 12px', 'border-radius:10px', 'cursor:pointer'
].join(';');
btnClose.addEventListener('click', () => {
try {
chrome.runtime.sendMessage({ type: 'tfAuthUserClose', token: (__tf_authToken || '') });
}
catch (e) { }
try {
overlay.remove();
}
catch (e) { }
});
btn.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
let ok = false;
try {
ok = tf_clickGoogleLoginButton();
}
catch (e) { }
if (ok) {
try {
overlay.remove();
}
catch (e) { }
try {
if (hasChromeStorage()) {
chrome.storage.local.set({
tfAuthTokenSeen: (__tf_authToken || ''),
tfGoogleClickedAt: Date.now()
}, () => { });
}
}
catch (e) { }
}
else {
try {
desc.textContent = 'Tombol Google tidak ditemukan di halaman ini. Coba refresh halaman lalu klik lagi.';
}
catch (e) { }
}
});
row.appendChild(btnClose);
row.appendChild(btn);
card.appendChild(title);
card.appendChild(desc);
card.appendChild(warn);
card.appendChild(row);
overlay.appendChild(card);
document.documentElement.appendChild(overlay);
}
catch (e) { }
}
function autoLoginIfPending() {
if (!hasChromeStorage())
return;
function tf_findGoogleBtn() {
try {
return document.querySelector('a#login-google, #login-google.btn, #login-google');
}
catch (e) { }
return null;
}
function tf_tryClickGoogle() {
try {
const a = tf_findGoogleBtn();
if (!a)
return false;
try {
if (a.dataset && a.dataset.tfClicked === '1')
return true;
if (a.dataset)
a.dataset.tfClicked = '1';
}
catch (e) { }
a.click();
return true;
}
catch (e) { }
return false;
}
function tf_tryGoogleRedirectViaFirebase() {
try {
if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage)
return;
chrome.runtime.sendMessage({ type: 'tf_google_redirect_main_world' }, () => {
try { void chrome.runtime.lastError; }
catch (e) { }
});
}
catch (e) { }
}
function tf_startPopupBlockedWatcher() {
try {
if (window.__tf_googlePopupWatcher)
return;
window.__tf_googlePopupWatcher = setInterval(() => {
try {
const modal = document.getElementById('modal-notif');
const t = modal ? (modal.innerText || '') : '';
if (/popup-blocked|auth\/popup-blocked/i.test(t)) {
clearInterval(window.__tf_googlePopupWatcher);
window.__tf_googlePopupWatcher = null;
if (!window.__tf_googleRedirectAttempted) {
window.__tf_googleRedirectAttempted = true;
tf_tryGoogleRedirectViaFirebase();
}
}
}
catch (e) { }
}, 500);
setTimeout(() => {
try {
if (window.__tf_googlePopupWatcher) {
clearInterval(window.__tf_googlePopupWatcher);
window.__tf_googlePopupWatcher = null;
}
}
catch (e) { }
}, 12000);
}
catch (e) { }
}
chrome.storage.local.get(['tfPendingLogin', 'tfPendingGoogleLogin', 'tfAuthFlowToken'], (data) => {
const flowTok = (data && data.tfAuthFlowToken) ? String(data.tfAuthFlowToken) : '';
const pendingGoogleRaw = (data ? data.tfPendingGoogleLogin : null);
const pendingGoogle = !!pendingGoogleRaw;
if (pendingGoogle) {
try {
let pgToken = '';
let pgClicked = false;
if (pendingGoogleRaw && typeof pendingGoogleRaw === 'object') {
pgToken = String(pendingGoogleRaw.token || '');
pgClicked = !!pendingGoogleRaw.clicked;
}
const tokenToMatch = pgToken || flowTok || '';
if (tokenToMatch && __tf_authToken && tokenToMatch !== __tf_authToken) {
}
else if (__tf_isAuthTab && !pgClicked) {
if (!window.__tf_googleRedirectPoller) {
try {
delete document.documentElement.dataset.tfGoogleRedirect;
}
catch (e) { }
window.__tf_googleRedirectPoller = setInterval(() => {
try {
tf_tryGoogleRedirectViaFirebase();
const ok = !!(document.documentElement && document.documentElement.dataset && document.documentElement.dataset.tfGoogleRedirect === '1');
if (ok) {
clearInterval(window.__tf_googleRedirectPoller);
window.__tf_googleRedirectPoller = null;
try {
chrome.storage.local.set({
tfPendingGoogleLogin: { token: (__tf_authToken || tokenToMatch), clicked: true, clickedAt: Date.now(), approach: 'redirect' },
tfAuthTokenSeen: (__tf_authToken || '')
}, () => { });
}
catch (e) { }
}
}
catch (e) { }
}, 600);
setTimeout(() => {
try {
if (window.__tf_googleRedirectPoller) {
tf_injectGoogleAssistOverlay();
tf_startPopupBlockedWatcher();
}
}
catch (e) { }
}, 2500);
setTimeout(() => {
try {
if (window.__tf_googleRedirectPoller) {
clearInterval(window.__tf_googleRedirectPoller);
window.__tf_googleRedirectPoller = null;
}
}
catch (e) { }
}, 12000);
}
}
}
catch (e) {
}
}
const pending = data && data.tfPendingLogin ? data.tfPendingLogin : null;
if (!pending)
return;
if (flowTok && __tf_authToken && flowTok !== __tf_authToken)
return;
const identity = (pending.identity || pending.email || pending.username || pending.mt4id || '').toString().trim();
const password = (pending.password || pending.passwd || pending.paswd || '').toString().trim();
const mode = (pending.mode || '').toString().trim().toLowerCase();
if (!identity || !password)
return;
if (mode === 'mt4' || tf_isMt4LoginPage()) {
const solved = tf_isCaptchaSolved();
if (!solved) {
tf_setCaptchaFlags(true, false);
if (!window.__tf_mt4CaptchaPoller) {
window.__tf_mt4CaptchaPoller = setInterval(() => {
try {
if (tf_isCaptchaSolved()) {
clearInterval(window.__tf_mt4CaptchaPoller);
window.__tf_mt4CaptchaPoller = null;
tf_setCaptchaFlags(false, true);
const ok = tf_submitMt4Login(identity, password);
if (ok) {
try {
chrome.storage.local.remove(['tfPendingLogin'], () => { });
}
catch (e) { }
}
}
}
catch (e) { }
}, 700);
}
return;
}
tf_setCaptchaFlags(false, true);
const ok = tf_submitMt4Login(identity, password);
if (ok) {
try {
chrome.storage.local.remove(['tfPendingLogin'], () => { });
}
catch (e) { }
}
return;
}
if (!__tf_isAuthTab)
return;
const tokToWait = (flowTok || __tf_authToken || '').trim();
if (tokToWait && !tf_isAuthUrlReadyForToken(tokToWait)) {
if (!window.__tf_waitAuthUrlPoller) {
let wTries = 0;
window.__tf_waitAuthUrlPoller = setInterval(() => {
wTries++;
try {
if (tf_isAuthUrlReadyForToken(tokToWait)) {
try {
clearInterval(window.__tf_waitAuthUrlPoller);
}
catch (e) { }
window.__tf_waitAuthUrlPoller = null;
tf_startStandardLogin(identity, password, tokToWait, true);
return;
}
}
catch (e) { }
if (wTries > 60) {
try {
clearInterval(window.__tf_waitAuthUrlPoller);
}
catch (e) { }
window.__tf_waitAuthUrlPoller = null;
}
}, 200);
}
return;
}
tf_startStandardLogin(identity, password, tokToWait, true);
});
}
function captureProfileFromHeader() {
// REV206: existing account tabs are not login-status authorities.
if (!__tf_isAuthTab && !__tf_isLogoutPath && !__tf_isProfileProbe) return false;
if (!hasChromeStorage())
return false;
try {
if (tf_markVisibleLoggedOutMenu()) return false;
const firstText = (el) => {
try {
const raw = String(el && (el.value || el.innerText || el.textContent || el.getAttribute && (el.getAttribute('title') || el.getAttribute('aria-label'))) || '').trim();
return raw.split(/\r?\n/).map((v) => v.trim()).filter(Boolean)[0] || '';
}
catch (e) { return ''; }
};
const visibleFirst = (selectors) => {
for (const selector of selectors) {
try {
const nodes = Array.from(document.querySelectorAll(selector));
const visibleNode = nodes.find((node) => tf_isElementVisible(node));
if (visibleNode) return visibleNode;
if (nodes[0]) return nodes[0];
}
catch (e) { }
}
return null;
};
const tf_profileCleanEmail = (value) => {
try {
const m = String(value || '').replace(/^mailto:/i, '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
return m && m[0] ? m[0].trim().toLowerCase() : '';
}
catch (e) { return ''; }
};
const tf_profileGenericName = (value) => {
const v = String(value || '').trim();
return !v || v.length > 90 || /@/.test(v) || /^(profile|user profile|account|settings|keluar|logout|online|offline|akun tradersfamily|user|dashboard|beranda|menu|thumbnail)$/i.test(v) || /\bchannel\s*(image|photo|avatar|logo)\b/i.test(v) || /\b(analyst|analis|signal)\s*image\b/i.test(v);
};
const tf_profileLooksLikeChannelImage = (el) => {
try {
if (!el) return false;
const label = String(
(el.getAttribute && (el.getAttribute('alt') || el.getAttribute('title') || el.getAttribute('aria-label') || el.getAttribute('data-name'))) || ''
).trim();
if (/channel\s*(image|photo|avatar|logo)|analyst\s*image|analis\s*image|signal\s*image/i.test(label)) return true;
const cls = String(el.className || '');
if (/channel[-_ ]?(image|photo|avatar|logo)/i.test(cls)) return true;
return false;
}
catch (e) { return false; }
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
const imgEl = visibleFirst([
'.pull-left.image img.img-circle',
'.pull-left.image img',
'.user-panel img',
'li.dropdown.user img',
'.user-menu img',
'.user-header img',
'a[href*="/profile/u/"] img',
'[data-user-avatar] img',
'header img.img-circle',
'img[class*="avatar"]',
'img[class*="profile"]'
]);
const nameEl = visibleFirst([
'.pull-left.info #username_text',
'.pull-left.info p.truncate',
'#username_text',
'.user-panel .info p',
'.user-header p[data-user-name]',
'.user-header [data-user-name]',
'[data-user-name]',
'.user-menu .user-name',
'.user-panel .info a',
'.profile-username',
'.box-profile .profile-username',
'input[name="name"][value]',
'input[name="fullname"][value]',
'.user-name',
'[class*="username"]'
]);
const statusEl = visibleFirst([
'.pull-left.info small',
'.user-panel .info small',
'.user-status',
'[data-user-status]'
]) || (nameEl && nameEl.parentElement && nameEl.parentElement.querySelector('small'));
const loggedMarker = visibleFirst([
'a[href*="/logout/"]',
'a[data-track="gtm_c_sb_nav_keluar"]',
'#username_text',
'.pull-left.info',
'.user-panel .info',
'li.dropdown.user a[href*="/logout/"]',
'a[href*="/profile/u/"]'
]);
const isLoggedInMarker = !!(
(firstText(nameEl) && !/^(profile|user profile|account|settings|keluar|logout)$/i.test(firstText(nameEl))) ||
(loggedMarker && tf_isElementVisible(loggedMarker))
);
const captured = {};
if (imgEl && !tf_profileLooksLikeChannelImage(imgEl)) {
let avatar = String(imgEl.currentSrc || imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy-src') || imgEl.getAttribute('data-original') || '').trim();
try { if (avatar) avatar = new URL(avatar, location.href).href; } catch (e) { }
if (avatar && !tf_profileDefaultAvatar(avatar)) captured.avatarUrl = avatar;
}
if (!captured.avatarUrl && tf_profileStorage.avatarUrl && !tf_profileDefaultAvatar(tf_profileStorage.avatarUrl)) captured.avatarUrl = tf_profileStorage.avatarUrl;
if (!captured.avatarUrl) {
try {
const bgNodes = Array.from(document.querySelectorAll('.avatar, .user-avatar, .profile-avatar, .user-image, .pull-left.image, .user-panel .image, [data-user-avatar], a[title="User Profile"]'));
for (const node of bgNodes) {
const raw = String(getComputedStyle(node).backgroundImage || node.style.backgroundImage || '');
const match = raw.match(/url\(["']?([^"')]+)["']?\)/i);
const bgUrl = match && match[1] ? tf_profileNormalizeUrl(match[1]) : '';
if (bgUrl && !tf_profileDefaultAvatar(bgUrl)) { captured.avatarUrl = bgUrl; break; }
}
}
catch (e) { }
}
let name = firstText(nameEl);
if (tf_profileGenericName(name)) name = '';
if (!name && imgEl && !tf_profileLooksLikeChannelImage(imgEl)) {
const alt = String(imgEl.getAttribute('alt') || imgEl.getAttribute('title') || '').trim();
if (alt && !tf_profileGenericName(alt) && !/^(user|avatar|profile|user avatar|default)$/i.test(alt)) name = alt;
}
if (!name && tf_profileStorage.name && !tf_profileGenericName(tf_profileStorage.name)) name = tf_profileStorage.name;
if (name) captured.name = name;
let status = firstText(statusEl);
if (isLoggedInMarker) status = 'Online';
if (status) captured.statusText = status;
try {
let profileUrl = '';
const profileLink = visibleFirst(['a[href*="/profile/u/"]', '[data-url*="/profile/u/"]', '[data-href*="/profile/u/"]']);
if (profileLink) {
const raw = profileLink.getAttribute('href') || profileLink.getAttribute('data-url') || profileLink.getAttribute('data-href') || '';
if (raw) profileUrl = new URL(raw, location.origin).href;
}
if (!profileUrl && /\/profile\/u\/\d+\/?/i.test(location.pathname)) profileUrl = location.href;
if (!profileUrl && tf_profileStorage.profileUrl) profileUrl = tf_profileStorage.profileUrl;
if (profileUrl) captured.profileUrl = profileUrl;
}
catch (e) { }
try {
let email = '';
const emailNode = visibleFirst(['[data-user-email]', 'a[href^="mailto:"]', 'input[type="email"][value]']);
if (emailNode) {
email = String(emailNode.getAttribute('data-user-email') || emailNode.getAttribute('href') || emailNode.value || firstText(emailNode) || '')
.replace(/^mailto:/i, '').trim().toLowerCase();
}
if (!email) email = tf_profileCleanEmail(tf_profileStorage.email);
if (!email) {
const roots = [
document.querySelector('.user-header'),
document.querySelector('.user-menu'),
document.querySelector('.dropdown-menu'),
document.querySelector('.user-panel'),
document.querySelector('header'),
document.querySelector('.main-header')
].filter(Boolean);
for (const root of roots) {
const text = String(root.innerText || root.textContent || '');
const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
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
// REV202: an account page loaded before an explicit plugin Logout is stale DOM.
// It must not resurrect the profile/session after the logout marker was set.
if (tf_isStalePreLogoutPage(data && data.tfExplicitLogoutAt)) return;
const existing = data && data.tfUserProfile && typeof data.tfUserProfile === 'object' ? data.tfUserProfile : {};
const existingName = String(existing.name || '').trim();
const existingEmail = String(existing.email || '').trim().toLowerCase();
const existingIdentityTrusted = !!(existingEmail || (existingName && !tf_profileGenericName(existingName)));
const merged = {
name: existingName && !tf_profileGenericName(existingName) ? existingName : '',
email: existingEmail,
avatarUrl: existingIdentityTrusted ? String(existing.avatarUrl || '').trim() : '',
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
if (isLoggedInMarker) merged.statusText = 'Online';
const changed = ['name', 'email', 'avatarUrl', 'statusText', 'profileUrl'].some(function (key) {
return String(existing[key] || '').trim() !== String(merged[key] || '').trim();
});
const stableChanged = !!merged.email && String(data && data.tfStableProfileEmail || '').trim().toLowerCase() !== merged.email;
const payload = {};
if (changed) payload.tfUserProfile = merged;
if (stableChanged) payload.tfStableProfileEmail = merged.email;
if (isLoggedInMarker) {
payload.tfLoginConfirmed = true;
payload.tfLoginConfirmedAt = Date.now();
payload.tfAccountLoginState = 'logged_in';
payload.tfAccountLoginStateAt = Date.now();
payload.tfEnteredMain = true;
payload.tfForceLoginForm = false;
payload.tfExplicitLogoutAt = 0;
}
if (Object.keys(payload).length) {
chrome.storage.local.set(payload, function () { try { void chrome.runtime.lastError; } catch (e) { } });
}
}
catch (e) { }
});
return isLoggedInMarker;
}
catch (e) {
tf_handleExtensionContextError(e);
return false;
}
}
function captureLoginError() {
if (!hasChromeStorage())
return;
try {
const alertCandidates = Array.from(document.querySelectorAll('.alert.alert-error, .alert.alert-error.alert-dismissible, .alert.alert-danger, .alert.alert-warning'));
let text = '';
if (alertCandidates && alertCandidates.length) {
for (const el of alertCandidates) {
if (!tf_isElementVisible(el))
continue;
const t = (el.innerText || el.textContent || '').trim();
if (!t)
continue;
if (/password\s+salah|email\s+atau\s+password\s+salah|email\s+belum\s+terdaftar|silahkan\s+register|login\s+gagal|akun\s+tidak\s+valid|invalid|tidak\s+valid|gagal|firebase|popup-blocked|auth\/popup-blocked/i.test(t)) {
text = t;
break;
}
}
}
if (!text) {
const errMsg = document.querySelector('form#mt4login .err-message') || document.querySelector('.err-message');
if (errMsg && tf_isElementVisible(errMsg)) {
const t2 = (errMsg.innerText || errMsg.textContent || '').trim();
if (t2 && /password\s+salah|email\s+belum\s+terdaftar|silahkan\s+register|login\s+gagal|akun\s+tidak\s+valid|invalid|gagal/i.test(t2)) {
text = t2;
}
}
}
if (text) {
chrome.storage.local.set({ tfLoginError: text, tfAuthTokenSeen: (__tf_authToken || '') }, () => { });
return;
}
try {
const modal = document.getElementById('modal-notif');
const t = modal ? ((modal.innerText || modal.textContent || '').trim()) : '';
if (modal && /Silahkan\s*login/i.test(t)) {
return;
}
}
catch (e) {
}
chrome.storage.local.remove(['tfLoginError'], () => { });
}
catch (e) {
tf_handleExtensionContextError(e);
}
}
function detectLoginState() {
if (!hasChromeStorage())
return;
try {
function tfIsVisible(el) {
try {
if (!el)
return false;
const style = window.getComputedStyle(el);
if (!style)
return false;
if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')
return false;
if (el.hasAttribute && el.hasAttribute('hidden'))
return false;
if (String(el.getAttribute && el.getAttribute('aria-hidden') || '').toLowerCase() === 'true')
return false;
const rect = el.getBoundingClientRect();
return !!(rect && rect.width > 0 && rect.height > 0);
}
catch (e) {
return false;
}
}
const href = String(location.href || '');
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
  const txt = String(el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  if (/Silahkan\s+login\s+untuk\s+mengakses\s+halaman\s+ini/i.test(txt)) {
    sessionExpiredAlert = el;
    break;
  }
}
}
catch (e) { }
const modal = sessionExpiredAlert || document.getElementById('modal-notif');
const modalText = modal ? ((modal.innerText || modal.textContent || '').trim()) : '';
const sessionExpired = !!(modal && tfIsVisible(modal) && /Silahkan\s+login(?:\s+untuk\s+mengakses\s+halaman\s+ini)?/i.test(modalText));
const explicitLogoutUrl = /\/logout\/?(?:$|[?#])/i.test(href) || /(?:\?|&)sign=out(?:&|$)/i.test(href);
// Explicit server warning is stronger than scan-protection. It means the server
// has already rejected the current authenticated request and the sidebar must
// switch to Login immediately, even while the Stop/cleanup state is unwinding.
if (sessionExpired || explicitLogoutUrl) {
const userMsg = sessionExpired ? 'Session berakhir dan harus login lagi.' : 'Anda telah logout.';
chrome.storage.local.set({
tfAuthTokenSeen: (__tf_authToken || ''),
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: Date.now(),
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: Date.now(),
tfExplicitLogoutAt: explicitLogoutUrl ? Date.now() : 0,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfLoginError: sessionExpired ? userMsg : '',
tfForceLoginForm: true
}, function () { });
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail'], function () { });
if (!tfLogoutNotified) {
tfLogoutNotified = true;
try {
chrome.runtime.sendMessage({
type: 'tfLoggedOut',
reason: sessionExpired ? 'SESSION_EXPIRED' : 'LOGGED_OUT',
message: sessionExpired ? 'Silahkan login untuk mengakses halaman ini' : 'Logout terdeteksi',
userMessage: userMsg
});
}
catch (e) { }
}
return;
}
// REV379: ordinary/stale account tabs remain passive unless they expose the exact
// authoritative session-expired warning handled above. This preserves REV206's
// stale-tab safety while allowing /?ret=... logout redirects to force Login.
if (!__tf_isAuthTab && !__tf_isLogoutPath && !__tf_isProfileProbe) return;
// REV205: on TF Copy Signal/account pages, visible Masuk or Daftar is
// authoritative logout evidence even if the page keeps sidebar/content containers.
if (tf_markVisibleLoggedOutMenu()) {
if (!tfLogoutNotified) {
tfLogoutNotified = true;
try {
chrome.runtime.sendMessage({
type: 'tfLoggedOut',
reason: 'NAVBAR_LOGGED_OUT',
message: 'Tombol Masuk/Daftar TradersFamily terdeteksi',
userMessage: 'Session TradersFamily tidak aktif. Silakan login.'
});
}
catch (e) { }
}
return;
}
const usernameEl = document.getElementById('username_text') || document.querySelector('#username_text, .pull-left.info p.truncate, .user-panel .info p, [data-user-name]');
const usernameText = usernameEl ? ((usernameEl.innerText || usernameEl.textContent || '').trim()) : '';
const loginFormEl = document.querySelector('form.form-signin, form#loginForm, form[action*="login"]');
const emailEl = document.getElementById('logname') || document.querySelector('input#logname, input[name="logname"]');
const passEl = document.getElementById('logpass') || document.querySelector('input#logpass, input[name="logpass"]');
const signinBtnEl = document.getElementById('btn-signin') || document.querySelector('#btn-signin, form.form-signin button[type="submit"], form#loginForm button[type="submit"]');
const hasLoginForm = !!(tfIsVisible(loginFormEl) || tfIsVisible(emailEl) || tfIsVisible(passEl) || tfIsVisible(signinBtnEl));
const userMenuEl = document.querySelector('li.dropdown.user a[href*="/logout/"], .pull-left.info, #username_text, a[href*="/profile/u/"], a[href*="/logout/"]');
const hasUserMenu = !!(usernameText || tfIsVisible(userMenuEl));
const hasAccountMarker = !!document.querySelector('a[href*="/logout/"], a[href*="/profile/u/"], #username_text, .pull-left.info');
const isLoggedIn = !!usernameText || hasUserMenu || (hasAccountMarker && !hasLoginForm);
const explicitLoginUrl = /(?:\?|&)tfAuth=1(?:&|$)/i.test(href) || /(?:\?|&)tfAuthToken=/i.test(href) || /\/login(?:mt)?\/?(?:$|[?#])/i.test(href) || /\/auth\//i.test(pathname);
if (isLoggedIn) {
tfLogoutNotified = false;
try {
chrome.storage.local.get(['tfExplicitLogoutAt'], function (state) {
try {
const explicitLogoutAt = Number(state && state.tfExplicitLogoutAt || 0);
if (tf_isStalePreLogoutPage(explicitLogoutAt)) return;
chrome.storage.local.set({
tfAuthTokenSeen: (__tf_authToken || ''),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfForceLoginForm: false,
tfExplicitLogoutAt: 0,
tfCaptchaNeeded: false,
tfCaptchaSolved: false
}, function () { });
// REV203: when this is the auth tab opened by the plugin, confirm the public-root
// navbar automatically as well. This keeps the flow working even if the Side Panel
// is temporarily closed while the login page finishes.
if (__tf_isAuthTab && !__tf_postLoginRootSyncRequested) {
__tf_postLoginRootSyncRequested = true;
try {
chrome.runtime.sendMessage({ type: 'confirm_tf_root_after_login', source: 'account_auth_helper' }, function () {
try { void chrome.runtime.lastError; } catch (e) { }
});
}
catch (e) { }
}
try { captureProfileFromHeader(); } catch (e) { }
}
catch (e) { }
});
}
catch (e) { }
try {
chrome.storage.local.get(['tfEnterMainAfterLogin'], function (st) {
if (st && st.tfEnterMainAfterLogin) {
chrome.storage.local.set({ tfEnteredMain: true, tfEnterMainAfterLogin: false }, function () { });
}
});
}
catch (e) { }
return;
}
// REV199: a VISIBLE account login form is authoritative logout evidence even when
// account.tradersfamily.id lands on '/' without tfAuth or /login in the URL.
// REV198 only cleared the session on an explicit auth URL, so the normal login page
// could preserve stale tfLoginConfirmed/profile data and leave the dashboard visible.
if (hasLoginForm && document.readyState === 'complete') {
if (__tf_scanProtected && !__tf_isAuthTab && !__tf_isLogoutPath && !__tf_isSignOutUrl) {
try { tf_deferScanLogoutEvidence('SESSION_EXPIRED', 'Form login terdeteksi pada helper tab saat batch scan aktif'); } catch (e) { }
return;
}
try {
const now = Date.now();
chrome.storage.local.set({
tfAuthTokenSeen: (__tf_authToken || ''),
tfLoginConfirmed: false,
tfLoginConfirmedAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true,
tfProfileNeedsRefresh: false,
tfCaptchaNeeded: false,
tfCaptchaSolved: false,
tfLoginError: 'Session TradersFamily tidak aktif. Silakan login.'
}, function () { });
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], function () { });
}
catch (e) { }
if (!tfLogoutNotified) {
tfLogoutNotified = true;
try {
chrome.runtime.sendMessage({
type: 'tfLoggedOut',
reason: 'SESSION_EXPIRED',
message: 'Form login TradersFamily terdeteksi',
userMessage: 'Session TradersFamily tidak aktif. Silakan login.'
});
}
catch (e) { }
}
return;
}
// A neutral/partially-rendered account page is UNKNOWN. Do not manufacture a fresh
// logged-in timestamp from it; a later bounded probe may still find the real user menu.
try {
chrome.storage.local.set({
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now()
}, function () { });
}
catch (e) { }
}
catch (e) {
tf_handleExtensionContextError(e);
}
}
function init() {
if (!tf_extensionContextAlive()) return;
const removeTrackedTimer = (id) => {
__tf_accountSyncTimerIds = __tf_accountSyncTimerIds.filter((item) => item && item.id !== id);
};
const safeTimeout = (fn, delay) => {
try {
const id = setTimeout(() => {
removeTrackedTimer(id);
if (!tf_extensionContextAlive()) return;
try { fn(); }
catch (error) { tf_handleExtensionContextError(error); }
}, delay);
__tf_accountSyncTimerIds.push({ id, kind: 'timeout' });
return id;
}
catch (error) { tf_handleExtensionContextError(error); return null; }
};
const safeInterval = (fn, delay) => {
try {
const id = setInterval(() => {
if (!tf_extensionContextAlive()) {
try { clearInterval(id); } catch (e) { }
removeTrackedTimer(id);
return;
}
try { fn(); }
catch (error) {
if (tf_handleExtensionContextError(error)) {
try { clearInterval(id); } catch (e) { }
removeTrackedTimer(id);
}
}
}, delay);
__tf_accountSyncTimerIds.push({ id, kind: 'interval' });
return id;
}
catch (error) { tf_handleExtensionContextError(error); return null; }
};
const syncAccountState = () => {
if (!tf_extensionContextAlive()) return false;
try { captureProfileFromHeader(); }
catch (error) { if (tf_handleExtensionContextError(error)) return false; }
try { detectLoginState(); }
catch (error) { if (tf_handleExtensionContextError(error)) return false; }
return tf_extensionContextAlive();
};
try { captureProfileFromHeader(); }
catch (error) { if (tf_handleExtensionContextError(error)) return; }
// Normal account pages are also authoritative session evidence. The old build
// returned here, so a user who logged in directly on the website was never
// detected unless the page happened to be the extension auth tab.
if (!__tf_isAuthTab && !__tf_isLogoutPath) {
syncAccountState();
// REV189: use bounded one-shot probes instead of a long MutationObserver/interval.
// This keeps dynamic profile capture reliable while eliminating stale work after an extension reload.
[250, 650, 1200, 2200, 3800, 6200, 9500, 13000].forEach((delay) => safeTimeout(syncAccountState, delay));
const onVisibleProfileProbe = () => {
try {
if (document.visibilityState !== 'visible' || !tf_extensionContextAlive()) return;
safeTimeout(syncAccountState, 180);
safeTimeout(syncAccountState, 900);
}
catch (error) { tf_handleExtensionContextError(error); }
};
try { document.addEventListener('visibilitychange', onVisibleProfileProbe, { passive: true }); } catch (e) { }
try { window.addEventListener('pageshow', onVisibleProfileProbe, { passive: true }); } catch (e) { }
return;
}
if (__tf_isLogoutPath && !__tf_isAuthTab) {
try { tf_detectLogoutSuccess(); }
catch (error) { if (tf_handleExtensionContextError(error)) return; }
safeInterval(tf_detectLogoutSuccess, 900);
return;
}
autoLoginIfPending();
syncAccountState();
try { tf_detectLogoutSuccess(); }
catch (error) { if (tf_handleExtensionContextError(error)) return; }
captureLoginError();
safeTimeout(syncAccountState, 800);
[1500, 3500, 7000, 12000].forEach((delay) => safeTimeout(syncAccountState, delay));
safeInterval(tf_detectLogoutSuccess, 900);
safeTimeout(captureLoginError, 1400);
safeInterval(captureLoginError, 2000);
}
try { window.addEventListener('pagehide', tf_stopAccountSync, { once: true }); } catch (e) { }
// pagehide above handles cleanup; unload registration is blocked by site Permissions Policy.
try {
if (tf_extensionContextAlive() && chrome.runtime && chrome.runtime.onMessage) {
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
try {
if (!msg || typeof msg !== 'object')
return;
if (msg.type === 'tfDoStandardLogin') {
const identity = String(msg.identity || '').trim();
const password = String(msg.password || '').trim();
if (identity && password) {
try {
tf_startStandardLogin(identity, password, false);
}
catch (e) { }
}
try {
sendResponse({ ok: true });
}
catch (e) { }
return true;
}
}
catch (e) { }
});
}
}
catch (e) { }
if (document.readyState === 'complete' || document.readyState === 'interactive') {
init();
}
else {
document.addEventListener('DOMContentLoaded', init);
}
})();
function tf_findLogoutButtonPatched() { return document.querySelector('a[data-track="gtm_c_sb_nav_keluar"]') || document.querySelector('a[href*="/logout/"]'); }