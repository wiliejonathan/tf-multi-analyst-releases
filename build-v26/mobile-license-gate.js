(() => {
  'use strict';

  const API_URL = 'https://tf-license-device-api.wiliejonathan1999.workers.dev/license-check';
  const CREDENTIALS_KEY = 'tfMobileLicenseCredentialsV1';
  const STATE_KEY = 'tfMobileLicenseStateV1';
  const OFFLINE_GRACE_MS = 72 * 60 * 60 * 1000;
  const APP_SCRIPTS = [
    'mobile-chrome-shim.js',
    'assets/dashboard-mobile.js',
    'mobile-data-bridge.js',
    'mobile-app-shell.js'
  ];

  let appStarted = false;
  let busy = false;

  function cleanEmail(value) {
    let email = String(value || '');
    try { email = email.normalize('NFKC'); } catch (_) {}
    return email.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '').replace(/\s+/g, '').trim();
  }

  function normalizeToken(value) {
    let token = String(value || '');
    try { token = token.normalize('NFKC'); } catch (_) {}
    return token.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '').replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-').replace(/\s+/g, '').trim();
  }

  function getJson(key, fallback = null) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (_) { return fallback; }
  }
  function setJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function removeKey(key) { try { localStorage.removeItem(key); } catch (_) {} }

  function isLicenseValidPayload(result) {
    if (!result || result.valid !== true) return false;
    const status = String(result.status || 'ACTIVE').trim().toUpperCase();
    if (status && status !== 'ACTIVE') return false;
    if (result.isPermanent === true) return true;
    const expiresAt = String(result.expiresAt || '').trim();
    if (!expiresAt) return true;
    const ms = Date.parse(expiresAt);
    return !Number.isFinite(ms) || ms > Date.now();
  }

  function licenseSummary(result) {
    const duration = String(result && result.duration || '').trim();
    const expiresAt = String(result && result.expiresAt || '').trim();
    if (result && result.isPermanent === true) return 'Lisensi permanent aktif.';
    if (expiresAt) {
      try {
        const d = new Date(expiresAt);
        const formatted = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
        return `Lisensi aktif${duration ? ` • ${duration}` : ''} • berlaku sampai ${formatted}.`;
      } catch (_) {}
    }
    return `Lisensi aktif${duration ? ` • ${duration}` : ''}.`;
  }

  function createGate() {
    let root = document.getElementById('tf-mobile-license-gate');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'tf-mobile-license-gate';
    root.innerHTML = `<div class="tf-license-card"><div class="tf-license-brand"><img src="icon32.png" alt="TF"><div><div class="tf-license-kicker">TF Analyzer Mobile</div><h1>Aktivasi Lisensi</h1></div></div><p class="tf-license-copy">Gunakan email dan token lisensi TF Analyzer yang sama seperti pada aplikasi PC.</p><div id="tf-license-status" class="tf-license-status">Memeriksa lisensi tersimpan…</div><form id="tf-license-form" class="tf-license-form" autocomplete="on"><label>Email</label><input id="tf-license-email" type="email" inputmode="email" autocomplete="username" placeholder="nama@email.com" required><label>Token Lisensi</label><div class="tf-license-token-wrap"><input id="tf-license-token" type="password" autocomplete="current-password" placeholder="TF-XXXX-XXXX-XXXX-XXXX-XXXX" required><button id="tf-license-toggle" type="button" class="tf-license-mini">Lihat</button></div><button id="tf-license-submit" class="tf-license-primary" type="submit">Aktifkan Aplikasi</button></form><div id="tf-license-valid-box" class="tf-license-valid-box hidden"><div class="tf-license-valid-title">Lisensi aktif</div><div id="tf-license-valid-detail" class="tf-license-valid-detail"></div><button id="tf-license-open" type="button" class="tf-license-primary">Buka TF Analyzer</button><button id="tf-license-change" type="button" class="tf-license-secondary">Ganti Email / Token</button></div><div class="tf-license-note">Aktivasi mobile tidak memindahkan Device Lock PC. Validasi terakhir dapat dipakai sementara hingga 72 jam saat offline.</div></div>`;
    document.body.appendChild(root);
    return root;
  }

  function setStatus(message, kind = '') {
    const el = document.getElementById('tf-license-status'); if (!el) return;
    el.textContent = String(message || ''); el.className = 'tf-license-status' + (kind ? ' ' + kind : '');
  }
  function setBusy(value) {
    busy = Boolean(value); const btn = document.getElementById('tf-license-submit');
    if (btn) { btn.disabled = busy; btn.textContent = busy ? 'Memverifikasi…' : 'Aktifkan Aplikasi'; }
  }
  function showForm(credentials, message = '') {
    document.getElementById('tf-license-form')?.classList.remove('hidden');
    document.getElementById('tf-license-valid-box')?.classList.add('hidden');
    const emailEl = document.getElementById('tf-license-email'); const tokenEl = document.getElementById('tf-license-token');
    if (emailEl) emailEl.value = cleanEmail(credentials && credentials.email);
    if (tokenEl) tokenEl.value = normalizeToken(credentials && credentials.token);
    if (message) setStatus(message, 'error');
  }
  function showValid(result, cached = false) {
    document.getElementById('tf-license-form')?.classList.add('hidden');
    document.getElementById('tf-license-valid-box')?.classList.remove('hidden');
    const detail = document.getElementById('tf-license-valid-detail');
    if (detail) detail.textContent = cached ? 'Mode offline sementara • ' + licenseSummary(result) : licenseSummary(result);
    setStatus(cached ? 'Lisensi tersimpan masih valid.' : 'Aktivasi berhasil.', 'success');
  }

  async function requestLicense(email, token) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeout = setTimeout(() => { try { controller && controller.abort(); } catch (_) {} }, 30000);
    try {
      const response = await fetch(API_URL, { method: 'POST', cache: 'no-store', redirect: 'follow', signal: controller ? controller.signal : undefined, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: cleanEmail(email), token: normalizeToken(token), clientType: 'TF_ANALYZER_MOBILE', mobilePlatform: /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'IOS_PWA' : 'ANDROID', mobileVersion: '1.0.26' }) });
      const text = await response.text(); let result;
      try { result = JSON.parse(text); } catch (_) { throw new Error('Respons server lisensi tidak valid.'); }
      if (!response.ok && !result.message) result.message = 'HTTP ' + response.status;
      return result;
    } finally { clearTimeout(timeout); }
  }

  async function activate(email, token) {
    if (busy) return; email = cleanEmail(email); token = normalizeToken(token);
    if (!email || !token) { setStatus('Email dan token lisensi wajib diisi.', 'error'); return; }
    setBusy(true); setStatus('Menghubungkan ke server lisensi…');
    try {
      const result = await requestLicense(email, token);
      if (!isLicenseValidPayload(result)) {
        const code = String(result && (result.code || result.error) || 'LICENSE_INVALID');
        const message = String(result && (result.message || result.code || result.error) || 'Lisensi tidak valid.');
        setStatus(`[${code}] ${message}`, 'error'); return;
      }
      const now = Date.now(); setJson(CREDENTIALS_KEY, { email, token, savedAt: now }); setJson(STATE_KEY, { ...result, valid: true, checkedAt: now });
      showValid(result, false); setTimeout(() => startApp(), 450);
    } catch (error) {
      const msg = error && error.name === 'AbortError' ? 'Server lisensi timeout. Periksa koneksi internet.' : (error && error.message ? error.message : String(error));
      setStatus(msg, 'error');
    } finally { setBusy(false); }
  }

  function loadScript(src) { return new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = () => reject(new Error('Gagal memuat ' + src)); document.body.appendChild(script); }); }
  async function startApp() {
    if (appStarted) return; appStarted = true;
    document.documentElement.setAttribute('data-tf-server-authorized', '1'); document.documentElement.setAttribute('data-tf-license', 'valid');
    const root = document.getElementById('tf-mobile-license-gate'); if (root) root.classList.add('tf-license-leaving');
    try { for (const src of APP_SCRIPTS) await loadScript(src); if (root) root.remove(); }
    catch (error) { appStarted = false; if (root) root.classList.remove('tf-license-leaving'); setStatus(error && error.message ? error.message : String(error), 'error'); }
  }
  function clearLicense() { removeKey(CREDENTIALS_KEY); removeKey(STATE_KEY); showForm(null, 'Masukkan email dan token lisensi yang ingin digunakan.'); }
  function bindUi() {
    document.getElementById('tf-license-form')?.addEventListener('submit', event => { event.preventDefault(); void activate(document.getElementById('tf-license-email')?.value || '', document.getElementById('tf-license-token')?.value || ''); });
    document.getElementById('tf-license-toggle')?.addEventListener('click', () => { const input = document.getElementById('tf-license-token'); const button = document.getElementById('tf-license-toggle'); if (!input || !button) return; const showing = input.type === 'text'; input.type = showing ? 'password' : 'text'; button.textContent = showing ? 'Lihat' : 'Sembunyi'; });
    document.getElementById('tf-license-open')?.addEventListener('click', () => startApp());
    document.getElementById('tf-license-change')?.addEventListener('click', clearLicense);
  }
  async function boot() {
    createGate(); bindUi(); const credentials = getJson(CREDENTIALS_KEY, null); const state = getJson(STATE_KEY, null); const checkedAt = Number(state && state.checkedAt || 0);
    const cachedValid = Boolean(credentials && credentials.email && credentials.token && state && state.valid === true && checkedAt > 0 && Date.now() - checkedAt <= OFFLINE_GRACE_MS && isLicenseValidPayload(state));
    if (cachedValid) { showValid(state, true); setTimeout(() => startApp(), 220); return; }
    if (credentials && credentials.email && credentials.token) { showForm(credentials); setStatus('Validasi online diperlukan kembali.'); await activate(credentials.email, credentials.token); return; }
    showForm(null); setStatus('Masukkan email dan token lisensi untuk mengaktifkan aplikasi.');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { void boot(); }, { once: true }); else void boot();
})();
