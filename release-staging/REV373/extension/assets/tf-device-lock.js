(() => {
  'use strict';

  const API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const LICENSE_SOURCE_URL = API_BASE + '/license-check';
  const CREDENTIALS_KEY = 'tfLicenseCredentials';
  const SESSION_KEY = 'tfDeviceSessionTokenV1';
  const PRESENCE_ENDPOINT_KEY = 'tfLicensePresenceEndpointV1';
  const STATE_KEY = 'tfDeviceLockStateV1';
  const LEGACY_LICENSE_STATE_KEY = 'tfLicenseState';
  const PENDING_CLIENT_KEY = 'tfDevicePendingClientV1';
  const ACTIVATION_TRACE_KEY = 'tfDeviceActivationTraceV1';
  const MANUAL_BUILD_ACTIVATION_KEY = 'tfManualBuildActivationV1';
  const OFFLINE_GRACE_MS = 72 * 60 * 60 * 1000;
  const REQUEST_TIMEOUT_MS = 85000; // lookup + mutation may each need an Apps Script cold-start retry
  const DEVICE_APPROVAL_WAIT_MS = 15 * 60 * 1000;
  // REV371 — after a PC/Chrome restart the same already-activated build must
  // recover its existing Device Vault identity automatically. A cold network or
  // a temporarily unavailable Vault must never force the user to re-enter the
  // activation code for the same build.
  const SAME_BUILD_RECOVERY_DELAYS_MS = [1200, 3000, 6500];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const APP_SCRIPTS = String(document.currentScript?.dataset?.tfAppScripts || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  let currentCredentials = null;
  let appScriptsPromise = null;
  let busy = false;
  let flowPromise = null;

  // Serialize entire activation flows across extension pages. Web Locks are
  // released automatically when a tab closes; no stale storage lease remains.
  function runDeviceFlow(work) {
    if (flowPromise) return flowPromise;
    const run = async () => {
      if (navigator.locks) {
        setStatus('loading', 'Menyelaraskan aktivasi perangkat', 'Menunggu pemeriksaan dashboard atau sidebar selesai.');
        return navigator.locks.request('tf-device-activation-v1', work);
      }
      return work();
    };
    flowPromise = run().catch((error) => {
      showError({ code: 'DEVICE_FLOW_FAILED', message: friendlyErrorMessage(error) });
    }).finally(() => { flowPromise = null; });
    return flowPromise;
  }

  function storageGet(keys) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(keys, (result) => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve(result || {});
        });
      } catch (_) {
        resolve({});
      }
    });
  }

  function storageSet(values) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.set(values, () => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve();
        });
      } catch (_) {
        resolve();
      }
    });
  }

  function storageRemove(keys) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.remove(keys, () => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve();
        });
      } catch (_) {
        resolve();
      }
    });
  }

  function cleanEmail(value) {
    let email = String(value || '');
    try { email = email.normalize('NFKC'); } catch (_) {}
    return email
      .replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  function normalizeEmail(value) {
    return cleanEmail(value).toLowerCase();
  }

  function buildEmailCandidates(value) {
    const cleaned = cleanEmail(value);
    if (!cleaned) return [];
    const at = cleaned.lastIndexOf('@');
    const domainNormalized = at > 0
      ? cleaned.slice(0, at) + '@' + cleaned.slice(at + 1).toLowerCase()
      : cleaned;
    return Array.from(new Set([
      cleaned,
      domainNormalized,
      cleaned.toLowerCase(),
      cleaned.toUpperCase()
    ].filter(Boolean)));
  }

  function normalizeToken(value) {
    let token = String(value || '');
    try { token = token.normalize('NFKC'); } catch (_) {}
    return token
      .replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
      .replace(/\s+/g, '')
      .trim();
  }

  function buildTokenCandidates(value) {
    const normalized = normalizeToken(value);
    const upper = normalized.toUpperCase();
    const lower = normalized.toLowerCase();
    const compact = upper.replace(/[^A-Z0-9]/g, '');
    const candidates = [normalized, upper, lower, compact];
    if (compact.startsWith('TF') && compact.length > 2) {
      const body = compact.slice(2);
      if (body.length >= 8 && body.length % 4 === 0) {
        const groups = body.match(/.{1,4}/g) || [];
        candidates.push('TF-' + groups.join('-'));
      }
    }
    return Array.from(new Set(candidates.filter(Boolean)));
  }

  function credentialAccepted(result) {
    return Boolean(result && (
      result.valid === true ||
      result.sessionValid === true ||
      result.bound === true ||
      result.decisionApplied === true
    ));
  }

  function sourceLookupDefinitive(result) {
    if (!result || typeof result !== 'object') return false;
    const code = String(result.code || result.error || '').trim().toUpperCase();
    return [
      'LICENSE_NOT_FOUND',
      'LICENSE_BLOCKED',
      'LICENSE_INACTIVE',
      'LICENSE_EXPIRED',
      'LICENSE_CONFIG_INCOMPLETE'
    ].includes(code);
  }

  function sourceLookupUnsupported(result) {
    const code = String(result && (result.code || result.error) || '').trim().toUpperCase();
    const message = String(result && result.message || '').trim().toUpperCase();
    return /ACTION.*NOT.*SUPPORTED|UNKNOWN.*ACTION|INVALID.*ACTION|METHOD.*NOT.*ALLOWED/.test(code + ' ' + message);
  }

  async function lookupLicenseSource(credentials) {
    const __uiPresenceStored = await storageGet(['tfUiPresenceStateV1']);
    const __uiPresenceState = __uiPresenceStored.tfUiPresenceStateV1 || {};
    const __uiPresenceActive = __uiPresenceState.active === true;
    const emailCandidates = buildEmailCandidates(credentials && credentials.email);
    const tokenCandidates = buildTokenCandidates(credentials && credentials.token);
    if (!emailCandidates.length || !tokenCandidates.length) return null;

    let lastResult = null;
    let attempt = 0;
    for (const email of emailCandidates) {
      for (const token of tokenCandidates) {
        attempt += 1;
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timeoutId = setTimeout(() => {
          try { controller?.abort(); } catch (_) {}
        }, 20000);
        try {
          const response = await fetch(LICENSE_SOURCE_URL, {
            method: 'POST',
            cache: 'no-store',
            redirect: 'follow',
            signal: controller ? controller.signal : undefined,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({
              action: 'lookup',
              email,
              emailCanonical: normalizeEmail(email),
              token,
              extensionId: chrome.runtime && chrome.runtime.id ? chrome.runtime.id : '',
              extensionVersion: chrome.runtime && chrome.runtime.getManifest ? chrome.runtime.getManifest().version : '',
              uiPresenceActive: __uiPresenceActive,
              presenceEvent: __uiPresenceActive ? 'HEARTBEAT' : 'VALIDATION_ONLY',
              clientPage: (typeof location !== 'undefined' && location.pathname) ? String(location.pathname) : '',
              requestNonce: String(Date.now()) + '-source-' + attempt + '-' + Math.random().toString(36).slice(2)
            })
          });
          const text = await response.text();
          let result = null;
          try { result = JSON.parse(text); } catch (_) { result = null; }
          if (!result || typeof result !== 'object') return null;
          lastResult = result;
          if (result && result.presenceEndpoint) {
            await storageSet({ [PRESENCE_ENDPOINT_KEY]: String(result.presenceEndpoint) });
          }
          if (result.valid === true) {
            result.acceptedEmail = cleanEmail(result.email || email);
            result.acceptedToken = normalizeToken(token);
            return result;
          }
          if (sourceLookupUnsupported(result)) return null;
          if (!shouldTryCredentialVariant(result)) return result;
        } catch (_) {
          return null;
        } finally {
          clearTimeout(timeoutId);
        }
      }
    }
    return lastResult;
  }

  function shouldTryCredentialVariant(result) {
    if (!result || credentialAccepted(result)) return false;
    const code = String(result.code || result.error || '').trim().toUpperCase();
    if (['LICENSE_EXPIRED', 'LICENSE_BLOCKED', 'LICENSE_INACTIVE', 'DEVICE_TRANSFERRED'].includes(code)) return false;
    const message = String(result.message || '').trim().toUpperCase();
    return /TOKEN|EMAIL|CREDENTIAL|LICENSE[_ -]?NOT[_ -]?FOUND|INVALID[_ -]?LICENSE|PERIKSA.*TOKEN|EMAIL.*TOKEN/.test(code + ' ' + message);
  }

  function ensureUi() {
    let root = document.getElementById('tf-device-lock-root');
    if (root) return root;

    const style = document.createElement('style');
    style.id = 'tf-device-lock-style';
    style.textContent = `
      #tf-device-lock-root {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        overflow: auto;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 14px;
        background:
          radial-gradient(circle at 50% -10%, rgba(36, 99, 235, .16), transparent 42%),
          linear-gradient(180deg, #080d19 0%, #030712 100%);
        color: #e5e7eb;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #tf-device-lock-root.tf-device-lock-hidden {
        display: none !important;
      }
      #tf-device-lock-root.tf-device-lock-center {
        align-items: center;
      }
      #tf-device-lock-root.tf-device-lock-center .tf-device-lock-card {
        margin-top: 0;
        margin-bottom: 0;
      }
      #tf-device-lock-root * {
        box-sizing: border-box;
      }
      #tf-device-lock-root .tf-device-lock-card {
        width: min(382px, 100%);
        margin: 8px auto 18px;
        overflow: hidden;
        border: 1px solid rgba(148, 163, 184, .18);
        border-radius: 18px;
        background: linear-gradient(180deg, rgba(17, 25, 45, .98), rgba(10, 17, 33, .99));
        box-shadow:
          0 18px 45px rgba(0, 0, 0, .34),
          inset 0 1px 0 rgba(255, 255, 255, .035);
      }
      #tf-device-lock-root .tf-device-lock-header {
        padding: 17px 17px 14px;
        border-bottom: 1px solid rgba(148, 163, 184, .13);
        background:
          linear-gradient(135deg, rgba(34, 197, 94, .075), transparent 54%),
          rgba(15, 23, 42, .5);
      }
      #tf-device-lock-root .tf-device-lock-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      #tf-device-lock-root .tf-device-lock-logo {
        position: relative;
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(74, 222, 128, .30);
        border-radius: 14px;
        color: #052e16;
        background: linear-gradient(145deg, #67e8a0, #22c55e);
        box-shadow: 0 9px 22px rgba(34, 197, 94, .19);
        font-size: 16px;
        font-weight: 950;
        letter-spacing: -.4px;
      }
      #tf-device-lock-root .tf-device-lock-logo img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        border-radius: inherit;
      }
      #tf-device-lock-root .tf-device-lock-logo::after {
        content: "";
        position: absolute;
        right: -3px;
        bottom: -3px;
        width: 13px;
        height: 13px;
        border: 3px solid #11192d;
        border-radius: 50%;
        background: #22c55e;
      }
      #tf-device-lock-root .tf-device-lock-heading {
        min-width: 0;
        flex: 1;
      }
      #tf-device-lock-root .tf-device-lock-kicker {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 4px;
        color: #86efac;
        font-size: 9px;
        font-weight: 850;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      #tf-device-lock-root .tf-device-lock-kicker::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, .12);
      }
      #tf-device-lock-root h1 {
        margin: 0;
        overflow: hidden;
        color: #f8fafc;
        font-size: 17px;
        font-weight: 850;
        line-height: 1.25;
        letter-spacing: -.25px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #tf-device-lock-root .tf-device-lock-subtitle {
        margin-top: 4px;
        color: #8fa0ba;
        font-size: 10.5px;
        line-height: 1.42;
      }
      #tf-device-lock-root .tf-device-lock-body {
        padding: 15px 17px 17px;
      }
      #tf-device-lock-root .tf-device-lock-status {
        display: flex;
        align-items: flex-start;
        gap: 11px;
        min-height: 62px;
        margin-bottom: 14px;
        padding: 12px;
        border: 1px solid rgba(96, 165, 250, .18);
        border-radius: 13px;
        background: rgba(15, 23, 42, .72);
      }
      #tf-device-lock-root.tf-device-lock-error .tf-device-lock-status {
        border-color: rgba(248, 113, 113, .24);
        background: rgba(69, 10, 10, .14);
      }
      #tf-device-lock-root.tf-device-lock-success .tf-device-lock-status {
        border-color: rgba(74, 222, 128, .24);
        background: rgba(5, 46, 22, .18);
      }
      #tf-device-lock-root .tf-device-lock-spinner {
        position: relative;
        display: none;
        width: 22px;
        height: 22px;
        flex: 0 0 22px;
        margin-top: 1px;
        border: 2.5px solid rgba(148, 163, 184, .22);
        border-top-color: #60a5fa;
        border-radius: 50%;
        animation: none;
      }
      #tf-device-lock-root.tf-device-lock-loading .tf-device-lock-spinner {
        display: block;
        animation: tfDeviceLockSpin .75s linear infinite;
      }
      #tf-device-lock-root.tf-device-lock-error .tf-device-lock-spinner {
        display: block;
        border-color: rgba(248, 113, 113, .48);
        animation: none;
      }
      #tf-device-lock-root.tf-device-lock-error .tf-device-lock-spinner::after {
        content: "!";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: #f87171;
        font-size: 12px;
        font-weight: 900;
      }
      #tf-device-lock-root.tf-device-lock-success .tf-device-lock-spinner {
        display: block;
        border-color: rgba(74, 222, 128, .55);
        animation: none;
      }
      #tf-device-lock-root.tf-device-lock-success .tf-device-lock-spinner::after {
        content: "✓";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: #4ade80;
        font-size: 12px;
        font-weight: 900;
      }
      #tf-device-lock-root .tf-device-lock-status-copy {
        min-width: 0;
      }
      #tf-device-lock-root .tf-device-lock-status-title {
        color: #f8fafc;
        font-size: 12.5px;
        font-weight: 800;
        line-height: 1.35;
      }
      #tf-device-lock-root .tf-device-lock-status-message {
        margin-top: 3px;
        color: #93a3bb;
        font-size: 10.5px;
        line-height: 1.48;
        overflow-wrap: anywhere;
        white-space: pre-line;
      }
      #tf-device-lock-root .tf-device-lock-section-title {
        margin: 1px 0 9px;
        color: #dbe5f4;
        font-size: 11px;
        font-weight: 800;
      }
      #tf-device-lock-root .tf-device-lock-form {
        display: grid;
        gap: 10px;
      }
      #tf-device-lock-root label {
        display: grid;
        gap: 6px;
        color: #b9c5d8;
        font-size: 10.5px;
        font-weight: 750;
      }
      #tf-device-lock-root input {
        width: 100%;
        height: 43px;
        border: 1px solid rgba(148, 163, 184, .23);
        border-radius: 11px;
        background: rgba(2, 6, 23, .72);
        color: #f8fafc;
        padding: 0 12px;
        outline: none;
        font-size: 12.5px;
        transition: border-color .14s ease, box-shadow .14s ease, background .14s ease;
      }
      #tf-device-lock-root input::placeholder {
        color: #53627a;
      }
      #tf-device-lock-root input:hover {
        border-color: rgba(148, 163, 184, .37);
      }
      #tf-device-lock-root input:focus {
        border-color: #4ade80;
        background: rgba(2, 6, 23, .9);
        box-shadow: 0 0 0 3px rgba(34, 197, 94, .11);
      }
      #tf-device-lock-root .tf-device-lock-actions {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        margin-top: 3px;
      }
      #tf-device-lock-root button {
        width: 100%;
        min-height: 42px;
        border: 1px solid transparent;
        border-radius: 11px;
        padding: 9px 13px;
        font-family: inherit;
        font-size: 11.5px;
        font-weight: 850;
        cursor: pointer;
        transition: transform .12s ease, filter .12s ease, border-color .12s ease, background .12s ease;
      }
      #tf-device-lock-root button:hover:not(:disabled) {
        transform: translateY(-1px);
        filter: brightness(1.04);
      }
      #tf-device-lock-root button:active:not(:disabled) {
        transform: translateY(0);
      }
      #tf-device-lock-root button:disabled {
        opacity: .58;
        cursor: wait;
      }
      #tf-device-lock-root .tf-device-lock-primary {
        color: #042f16;
        background: linear-gradient(135deg, #67e8a0 0%, #22c55e 100%);
        box-shadow: 0 8px 20px rgba(34, 197, 94, .14);
      }
      #tf-device-lock-root .tf-device-lock-secondary {
        color: #dbe5f4;
        border-color: rgba(148, 163, 184, .23);
        background: rgba(15, 23, 42, .66);
      }
      #tf-device-lock-root .tf-device-lock-danger {
        color: #fda4af;
        border-color: rgba(244, 63, 94, .23);
        background: rgba(76, 5, 25, .10);
      }
      #tf-device-lock-root .tf-device-lock-note {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-top: 12px;
        padding: 10px 11px;
        border: 1px solid rgba(148, 163, 184, .12);
        border-radius: 11px;
        color: #7788a2;
        background: rgba(2, 6, 23, .28);
        font-size: 9.8px;
        line-height: 1.48;
      }
      #tf-device-lock-root .tf-device-lock-note::before {
        content: "🔒";
        flex: 0 0 auto;
        font-size: 11px;
        line-height: 1.35;
        filter: grayscale(.2);
      }
      #tf-device-lock-root .tf-device-lock-offline {
        margin-top: 11px;
        padding: 9px 10px;
        border: 1px solid rgba(245, 158, 11, .24);
        border-radius: 11px;
        color: #fbbf24;
        background: rgba(120, 53, 15, .15);
        font-size: 10px;
        line-height: 1.45;
      }
      @media (max-width: 480px) {
        #tf-device-lock-root {
          padding: 9px;
        }
        #tf-device-lock-root .tf-device-lock-card {
          margin-top: 2px;
          border-radius: 16px;
        }
        #tf-device-lock-root .tf-device-lock-header {
          padding: 15px 14px 13px;
        }
        #tf-device-lock-root .tf-device-lock-body {
          padding: 13px 14px 15px;
        }
        #tf-device-lock-root h1 {
          font-size: 16px;
        }
      }
      @keyframes tfDeviceLockSpin {
        to { transform: rotate(360deg); }
      }
    `;

    document.documentElement.appendChild(style);

    root = document.createElement('div');
    root.id = 'tf-device-lock-root';
    root.innerHTML = `
      <div class="tf-device-lock-card">
        <div class="tf-device-lock-header">
          <div class="tf-device-lock-brand">
            <div class="tf-device-lock-logo"><img src="icon128.png" alt="TF Analzer Analyst"></div>
            <div class="tf-device-lock-heading">
              <div class="tf-device-lock-kicker">Device Lock</div>
              <h1>TF Multi-Analyst Scanner</h1>
              <div class="tf-device-lock-subtitle">Aktifkan lisensi pada perangkat ini untuk membuka seluruh fitur extension.</div>
            </div>
          </div>
        </div>
        <div class="tf-device-lock-body">
          <div class="tf-device-lock-status">
            <div class="tf-device-lock-spinner"></div>
            <div class="tf-device-lock-status-copy">
              <div class="tf-device-lock-status-title" id="tf-device-lock-title">Aktivasi perangkat diperlukan</div>
              <div class="tf-device-lock-status-message" id="tf-device-lock-message">Masukkan email dan token, lalu klik Aktifkan perangkat ini.</div>
            </div>
          </div>
          <div id="tf-device-lock-content"></div>
        </div>
      </div>
    `;

    (document.body || document.documentElement).appendChild(root);
    return root;
  }

  function setStatus(kind, title, message) {
    const root = ensureUi();
    root.classList.remove('tf-device-lock-loading', 'tf-device-lock-error', 'tf-device-lock-success', 'tf-device-lock-center');
    if (kind === 'loading') root.classList.add('tf-device-lock-loading');
    if (kind === 'error') root.classList.add('tf-device-lock-error');
    if (kind === 'success') root.classList.add('tf-device-lock-success');
    if (kind === 'loading' || kind === 'success') root.classList.add('tf-device-lock-center');
    const titleEl = root.querySelector('#tf-device-lock-title');
    const messageEl = root.querySelector('#tf-device-lock-message');
    if (titleEl) titleEl.textContent = String(title || '');
    if (messageEl) messageEl.textContent = String(message || '');
  }

  function setContent(html) {
    const root = ensureUi();
    const content = root.querySelector('#tf-device-lock-content');
    if (content) content.innerHTML = html || '';
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Gagal memuat file extension: ' + src));
      (document.body || document.documentElement).appendChild(script);
    });
  }

  function loadAppScripts() {
    if (appScriptsPromise) return appScriptsPromise;
    appScriptsPromise = (async () => {
      for (const src of APP_SCRIPTS) {
        await loadScript(src);
      }
    })();
    return appScriptsPromise;
  }

  async function unlockApp() {
    const root = document.getElementById('tf-device-lock-root');
    if (root) root.remove();
    document.documentElement.dataset.tfDeviceLock = 'valid';
    window.__TF_DEVICE_LOCK_VALID__ = true;
    try {
      window.dispatchEvent(new CustomEvent('TF_DEVICE_LOCK_VALID'));
    } catch (_) {}

    try {
      await loadAppScripts();

      // Device Lock melakukan validasi secara asynchronous. Pada saat file aplikasi
      // selesai dimuat, DOMContentLoaded biasanya sudah lewat. Aplikasi lama
      // memasang sebagian besar tombol dan pemeriksaan lisensinya pada event itu,
      // jadi jalankan kembali event tersebut satu kali setelah seluruh script siap.
      if (document.documentElement.dataset.tfAppBootEvent !== '1') {
        document.documentElement.dataset.tfAppBootEvent = '1';
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      }
    } catch (error) {
      ensureUi();
      showError({
        code: 'EXTENSION_SCRIPT_LOAD_FAILED',
        message: error && error.message ? error.message : 'File extension tidak dapat dimuat.'
      });
    }
  }

  function showActivationForm(message, isError = true) {
    setStatus(
      message && isError ? 'error' : 'idle',
      'Aktivasi perangkat diperlukan',
      message || 'Masukkan email dan token lisensi untuk mengikat extension ke Device Vault.'
    );

    const emailValue = currentCredentials ? cleanEmail(currentCredentials.email) : '';
    const tokenValue = currentCredentials ? normalizeToken(currentCredentials.token) : '';

    setContent(`
      <div class="tf-device-lock-section-title">Masukkan data lisensi</div>
      <form class="tf-device-lock-form" id="tf-device-lock-form">
        <label>
          Email Lisensi
          <input id="tf-device-lock-email" type="email" autocomplete="username" value="${escapeHtml(emailValue)}" placeholder="nama@email.com" required>
        </label>
        <label>
          Token Lisensi
          <input id="tf-device-lock-token" type="password" autocomplete="current-password" value="${escapeHtml(tokenValue)}" placeholder="TF-XXXX-XXXX-XXXX-XXXX-XXXX" required>
        </label>
        <div class="tf-device-lock-actions">
          <button class="tf-device-lock-primary" type="submit">Aktifkan perangkat ini</button>
          ${emailValue || tokenValue ? '<button class="tf-device-lock-danger" id="tf-device-lock-clear" type="button">Gunakan lisensi lain</button>' : ''}
        </div>
      </form>
      <div class="tf-device-lock-note">TF Device Vault dibuka otomatis untuk membuktikan bahwa perangkat ini memiliki private key yang sah. Email dan token saja tidak cukup untuk digunakan di perangkat lain.</div>
    `);

    const form = document.getElementById('tf-device-lock-form');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (busy) return;
        const email = cleanEmail(document.getElementById('tf-device-lock-email')?.value);
        const token = normalizeToken(document.getElementById('tf-device-lock-token')?.value);
        if (!email || !token) {
          setStatus('error', 'Data belum lengkap', 'Email dan token lisensi wajib diisi.');
          return;
        }
        await runDeviceFlow(async () => {
        const saved = await storageGet([CREDENTIALS_KEY, SESSION_KEY]);
        const prior = saved[CREDENTIALS_KEY] || {};
        if (normalizeEmail(prior.email) === normalizeEmail(email) &&
            normalizeToken(prior.token) === token && saved[SESSION_KEY]) {
          await validateExistingSession({ ...prior, email, token }, saved[SESSION_KEY]);
          return;
        }
        const now = Date.now();
        currentCredentials = { email, token };
        await storageSet({
          [CREDENTIALS_KEY]: {
            email,
            token,
            savedAt: now,
            submittedVersion: chrome.runtime.getManifest().version
          },
          [ACTIVATION_TRACE_KEY]: {
            phase: 'FORM_SUBMITTED',
            checkedAt: now
          }
        });
        await activateOrRenew({ email, token }, true);
        });
      });
    }

    const clearButton = document.getElementById('tf-device-lock-clear');
    if (clearButton) {
      clearButton.addEventListener('click', async () => {
        if (busy) return;
        await storageRemove([CREDENTIALS_KEY, SESSION_KEY, STATE_KEY, PENDING_CLIENT_KEY, ACTIVATION_TRACE_KEY, MANUAL_BUILD_ACTIVATION_KEY]);
        await clearVaultRecovery();
        currentCredentials = null;
        showActivationForm('Data lisensi lokal dan recovery perangkat telah dihapus. Masukkan lisensi yang akan digunakan.', false);
      });
    }
  }

  async function retryActivation(forceFreshRequest = false) {
    if (busy) return;
    const stored = await storageGet([CREDENTIALS_KEY, PENDING_CLIENT_KEY, SESSION_KEY, STATE_KEY, ACTIVATION_TRACE_KEY]);
    const credentials = stored[CREDENTIALS_KEY] || currentCredentials || {};
    const email = cleanEmail(credentials.email || credentials.emailOriginal || credentials.emailCanonical);
    const token = normalizeToken(credentials.token);
    currentCredentials = { ...credentials, email, token };

    if (forceFreshRequest) {
      await storageRemove([PENDING_CLIENT_KEY, ACTIVATION_TRACE_KEY]);
      if (email && token) {
        await activateOrRenew({ ...credentials, email, token }, true);
        return;
      }
    }

    await start();
  }

  function showError(result, fallbackMessage) {
    const code = String(result && (result.code || result.error) || '').trim();
    const message = String(result && result.message || fallbackMessage || 'Perangkat tidak dapat diverifikasi.').trim();
    const normalizedCode = code.toUpperCase();
    setStatus('error', code || 'Perangkat terkunci', message);
    setContent(`
      <div class="tf-device-lock-actions">
        <button class="tf-device-lock-primary" id="tf-device-lock-retry" type="button">Periksa Lagi</button>
        <button class="tf-device-lock-danger" id="tf-device-lock-change" type="button">Ganti Email / Token</button>
      </div>
      <div class="tf-device-lock-note">Extension tetap dikunci sampai lisensi, session, Device ID, public key, dan tanda tangan perangkat dinyatakan valid.</div>
    `);

    document.getElementById('tf-device-lock-retry')?.addEventListener('click', () => {
      if (busy) return;
      const needsFreshRequest = [
        'DEVICE_REQUEST_EXPIRED',
        'DEVICE_APPROVAL_STATUS_UNAVAILABLE',
        'PENDING_REQUEST_ID_MISSING',
        'DEVICE_REQUEST_REPLACED',
        'DEVICE_REQUEST_DECLINED',
        'DEVICE_APPROVAL_REQUIRED'
      ].includes(normalizedCode);
      void runDeviceFlow(() => retryActivation(needsFreshRequest));
    });
    document.getElementById('tf-device-lock-change')?.addEventListener('click', async () => {
      if (busy) return;
      await storageRemove([CREDENTIALS_KEY, SESSION_KEY, STATE_KEY, PENDING_CLIENT_KEY, ACTIVATION_TRACE_KEY, MANUAL_BUILD_ACTIVATION_KEY]);
      await clearVaultRecovery();
      currentCredentials = null;
      showActivationForm('Masukkan email dan token lisensi yang benar.', false);
    });
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function friendlyErrorMessage(error) {
    const raw = String(
      error && error.message
        ? error.message
        : error || ''
    ).trim();

    if (!raw) {
      return 'Perangkat tidak dapat diverifikasi.';
    }

    if (
      /Receiving end does not exist/i.test(raw) ||
      /Could not establish connection/i.test(raw) ||
      /message port closed/i.test(raw)
    ) {
      return 'Koneksi ke TF Device Vault belum siap. Extension akan memasang ulang koneksi secara otomatis; klik Aktifkan perangkat ini sekali lagi.';
    }

    if (
      /bridge tidak merespons/i.test(raw) ||
      /Device Vault tidak merespons/i.test(raw)
    ) {
      return 'TF Device Vault belum merespons. Pastikan koneksi internet aktif, lalu coba lagi.';
    }

    if (/terlalu lama dimuat/i.test(raw)) {
      return 'Halaman TF Device Vault terlalu lama dimuat. Periksa koneksi internet lalu coba lagi.';
    }

    return raw;
  }

  async function api(path, body) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeoutId = setTimeout(() => {
      try { controller?.abort(); } catch (_) {}
    }, REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(API_BASE + path, {
        method: 'POST',
        cache: 'no-store',
        redirect: 'follow',
        signal: controller ? controller.signal : undefined,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(body || {}), deviceType: 'DESKTOP', clientType: 'DESKTOP' })
      });
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (_) {
        throw new Error('Respons server bukan JSON yang valid.');
      }
      if (!response.ok && !result.message) {
        result.message = 'HTTP ' + response.status;
      }
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function apiWithCredentialVariants(path, body) {
    const source = body && typeof body === 'object' ? { ...body } : {};
    const emailCandidates = buildEmailCandidates(source.email);
    const tokenCandidates = buildTokenCandidates(source.token);
    if (!emailCandidates.length || !tokenCandidates.length) {
      return api(path, {
        ...source,
        email: cleanEmail(source.email),
        token: normalizeToken(source.token),
        requestNonce: String(Date.now()) + '-' + Math.random().toString(36).slice(2),
        extensionId: chrome.runtime && chrome.runtime.id ? chrome.runtime.id : '',
        extensionVersion: chrome.runtime && chrome.runtime.getManifest ? chrome.runtime.getManifest().version : ''
      });
    }

    let lastResult = null;
    let attempt = 0;
    const totalAttempts = emailCandidates.length * tokenCandidates.length;
    for (const candidateEmail of emailCandidates) {
      for (const candidateToken of tokenCandidates) {
        attempt += 1;
        const result = await api(path, {
          ...source,
          email: candidateEmail,
          token: candidateToken,
          requestNonce: String(Date.now()) + '-' + attempt + '-' + Math.random().toString(36).slice(2),
          extensionId: chrome.runtime && chrome.runtime.id ? chrome.runtime.id : '',
          extensionVersion: chrome.runtime && chrome.runtime.getManifest ? chrome.runtime.getManifest().version : ''
        });
        lastResult = result;
        if (credentialAccepted(result)) {
          if (result && typeof result === 'object') {
            result.acceptedEmail = candidateEmail;
            result.acceptedToken = candidateToken;
            result.credentialVariantAttempt = attempt;
          }
          return result;
        }
        if (!shouldTryCredentialVariant(result) || attempt >= totalAttempts) return result;
      }
    }
    return lastResult;
  }

  function requestVaultProof(challenge) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error('Device Vault tidak merespons.'));
      }, 25000);

      try {
        chrome.runtime.sendMessage(
          {
            type: 'TF_DEVICE_VAULT_PROOF',
            challenge: String(challenge || '')
          },
          (response) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeoutId);
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
              reject(new Error(runtimeError.message || 'Gagal menghubungi Device Vault.'));
              return;
            }
            if (!response || response.ok !== true) {
              reject(new Error(String(response && response.message || 'Device Vault gagal memberikan bukti perangkat.')));
              return;
            }
            resolve(response.data || {});
          }
        );
      } catch (error) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }


  function vaultRecoveryMessage(type, data = null) {
    return new Promise((resolve) => {
      let settled = false;
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        resolve(null);
      }, 12000);
      try {
        chrome.runtime.sendMessage({ type, data }, (response) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeoutId);
          try { void chrome.runtime.lastError; } catch (_) {}
          if (!response || response.ok !== true) {
            resolve(null);
            return;
          }
          resolve(response.data || null);
        });
      } catch (_) {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          resolve(null);
        }
      }
    });
  }

  async function getVaultRecovery() {
    const data = await vaultRecoveryMessage('TF_DEVICE_VAULT_RECOVERY_GET');
    if (!data || typeof data !== 'object') return null;
    const email = cleanEmail(data.email);
    const token = normalizeToken(data.token);
    if (!email || !token) return null;
    return {
      email,
      token,
      licenseId: String(data.licenseId || '').trim(),
      savedAt: Number(data.savedAt || 0)
    };
  }

  async function setVaultRecovery(credentials, licenseId = '') {
    const email = cleanEmail(credentials && credentials.email);
    const token = normalizeToken(credentials && credentials.token);
    if (!email || !token) return false;
    const result = await vaultRecoveryMessage('TF_DEVICE_VAULT_RECOVERY_SET', {
      email,
      token,
      licenseId: String(licenseId || credentials && credentials.licenseId || '').trim()
    });
    return Boolean(result && result.saved);
  }

  async function clearVaultRecovery() {
    const result = await vaultRecoveryMessage('TF_DEVICE_VAULT_RECOVERY_CLEAR');
    return Boolean(result && result.cleared);
  }

  async function restoreActivatedBuildCredentials(credentials) {
    const source = credentials && typeof credentials === 'object' ? { ...credentials } : {};
    const localEmail = cleanEmail(source.email || source.emailOriginal || source.emailCanonical);
    const localToken = normalizeToken(source.token);
    if (localEmail && localToken) {
      return { ...source, email: localEmail, token: localToken };
    }

    // REV363 still wins for a NEW build: this helper is called only after the
    // per-build activation receipt has already matched the current manifest.
    // Therefore Vault recovery cannot bypass the one-time manual activation of a
    // newly installed build, but it can safely repair a same-build PC restart.
    const recovery = await getVaultRecovery();
    if (!recovery || !recovery.email || !recovery.token) return null;

    const restored = {
      ...source,
      ...recovery,
      email: cleanEmail(recovery.email),
      emailCanonical: normalizeEmail(recovery.email),
      token: normalizeToken(recovery.token),
      licenseId: String(recovery.licenseId || source.licenseId || '').trim(),
      recoveredAt: Date.now(),
      submittedVersion: chrome.runtime.getManifest().version
    };
    await storageSet({ [CREDENTIALS_KEY]: restored });
    return restored;
  }

  async function unlockFromRecentDeviceValidation(reason) {
    const stored = await storageGet([STATE_KEY]);
    const state = stored[STATE_KEY] || {};
    const checkedAt = Number(state.checkedAt || 0);
    const graceRemaining = checkedAt > 0 ? checkedAt + OFFLINE_GRACE_MS - Date.now() : 0;
    if (state.valid !== true || graceRemaining <= 0) return false;

    const hours = Math.max(1, Math.ceil(graceRemaining / 3600000));
    setStatus('success', 'Aktivasi PC dipulihkan', 'Perangkat ini memakai validasi Device Lock terakhir yang masih berada dalam grace period.');
    setContent(`<div class="tf-device-lock-offline">${escapeHtml(reason || 'Server / Device Vault belum siap setelah restart.')} Validasi online akan dicoba kembali pada penggunaan berikutnya. Sisa grace sekitar ${hours} jam.</div>`);
    setTimeout(() => { void unlockApp(); }, 280);
    return true;
  }

  function isTransientRecoveryResult(result) {
    const code = String(result && (result.code || result.error) || '').trim().toUpperCase();
    if (!code) return true;
    return /TIMEOUT|UNAVAILABLE|SERVER|NETWORK|APPS_SCRIPT|DEVICE_API_ERROR|INTERNAL_ERROR|TEMPORARY|RATE_LIMIT/.test(code);
  }

  function scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, reason) {
    const currentAttempt = Math.max(0, Number(options && options.recoveryAttempt || 0));
    if (currentAttempt >= SAME_BUILD_RECOVERY_DELAYS_MS.length) return false;
    const delayMs = SAME_BUILD_RECOVERY_DELAYS_MS[currentAttempt];
    const nextAttempt = currentAttempt + 1;
    setStatus(
      'loading',
      'Memulihkan aktivasi PC setelah restart',
      `Device Vault / server belum siap. Mencoba ulang otomatis ${nextAttempt}/${SAME_BUILD_RECOVERY_DELAYS_MS.length} tanpa meminta Email + Token.`
    );
    setContent(`<div class="tf-device-lock-note">${escapeHtml(reason || 'Menunggu komponen startup Chrome siap.')} Tidak perlu Reset PC dan tidak perlu memasukkan kode aktivasi lagi.</div>`);
    setTimeout(() => {
      if (busy) {
        // Another validation is still finishing; give it one short extra turn.
        setTimeout(() => {
          if (!busy) void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, { sameBuildRecovery: true, recoveryAttempt: nextAttempt }));
        }, 700);
        return;
      }
      void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, { sameBuildRecovery: true, recoveryAttempt: nextAttempt }));
    }, delayMs);
    return true;
  }

  async function saveSession(credentials, bindResult) {
    const now = Date.now();
    const existing = (await storageGet([CREDENTIALS_KEY]))[CREDENTIALS_KEY] || {};
    const licenseId = String(
      bindResult && (bindResult.licenseId || bindResult.license) ||
      credentials && credentials.licenseId ||
      existing.licenseId || ''
    ).trim();
    await storageSet({
      [CREDENTIALS_KEY]: {
        ...existing,
        email: cleanEmail(credentials.email),
        emailCanonical: normalizeEmail(credentials.email),
        token: normalizeToken(credentials.token),
        licenseId,
        lastValidatedAt: now
      },
      [SESSION_KEY]: String(bindResult.sessionToken || ''),
      [STATE_KEY]: {
        valid: true,
        checkedAt: now,
        code: String(bindResult.code || ''),
        deviceName: String(bindResult.deviceName || ''),
        license: String(bindResult.license || ''),
        licenseId
      },
      [MANUAL_BUILD_ACTIVATION_KEY]: {
        version: String(chrome.runtime.getManifest().version || ''),
        versionName: String(chrome.runtime.getManifest().version_name || ''),
        activatedAt: now
      }
    });
    await setVaultRecovery({ ...credentials, licenseId }, licenseId);
  }

  function buildLegacyLicenseState(validateResult, credentials, previousState) {
    const source = validateResult && typeof validateResult === 'object' ? validateResult : {};
    const previous = previousState && typeof previousState === 'object' ? previousState : {};
    const duration = String(source.duration || credentials.duration || previous.duration || '').trim().toUpperCase();
    const expiresAt = String(source.expiresAt || credentials.expiresAt || previous.expiresAt || '');
    const checkedAt = Date.now();
    const expiryMs = Date.parse(expiresAt);
    const remainingSeconds = Number.isFinite(expiryMs)
      ? Math.max(0, Math.ceil((expiryMs - checkedAt) / 1000))
      : null;

    // Device Vault validates the device/session, while the legacy license state is
    // still consumed by the page-level feature gate. Do not discard feature fields
    // when Device Lock refreshes tfLicenseState.
    const readBoolean = (key) => {
      if (typeof source[key] === 'boolean') return source[key];
      if (typeof previous[key] === 'boolean') return previous[key];
      return null;
    };
    const includedByMainPlan = ['TRIAL (1 HARI)', '6 BULAN', '1 TAHUN', 'PERMANENT'].includes(duration);
    const accessRaw = readBoolean('isignalUsersAccess');
    const includedRaw = readBoolean('isignalUsersIncluded');
    const addonRequiredRaw = readBoolean('isignalUsersAddonRequired');
    const featureKnownFromPayload =
      source.isignalUsersAccessKnown === true ||
      typeof source.isignalUsersAccess === 'boolean' ||
      typeof source.isignalUsersIncluded === 'boolean' ||
      typeof source.isignalUsersAddonRequired === 'boolean' ||
      Boolean(source.isignalUsersAccessReason);
    const featureKnownFromPrevious =
      previous.isignalUsersAccessKnown === true ||
      typeof previous.isignalUsersAccess === 'boolean' ||
      typeof previous.isignalUsersIncluded === 'boolean' ||
      typeof previous.isignalUsersAddonRequired === 'boolean' ||
      Boolean(previous.isignalUsersAccessReason);
    const isignalUsersIncluded = includedRaw === null ? includedByMainPlan : includedRaw;
    const isignalUsersAccess = accessRaw === null ? isignalUsersIncluded : accessRaw;
    const isignalUsersAddonRequired = addonRequiredRaw === null
      ? (!isignalUsersIncluded && ['1 BULAN', '3 BULAN'].includes(duration))
      : addonRequiredRaw;
    const isignalUsersAccessKnown = featureKnownFromPayload || featureKnownFromPrevious || includedByMainPlan || ['1 BULAN', '3 BULAN'].includes(duration);
    const isignalUsersPlan = String(source.isignalUsersPlan || previous.isignalUsersPlan || (isignalUsersIncluded ? 'INCLUDED' : '')).trim().toUpperCase();
    const isignalUsersExpiresAt = String(
      source.isignalUsersExpiresAt ||
      previous.isignalUsersExpiresAt ||
      (isignalUsersIncluded && duration !== 'PERMANENT' ? expiresAt : '')
    );
    const featureExpiryMs = Date.parse(isignalUsersExpiresAt);
    const isignalUsersRemainingSeconds = Number.isFinite(Number(source.isignalUsersRemainingSeconds))
      ? Math.max(0, Math.floor(Number(source.isignalUsersRemainingSeconds)))
      : Number.isFinite(Number(previous.isignalUsersRemainingSeconds))
        ? Math.max(0, Math.floor(Number(previous.isignalUsersRemainingSeconds)))
        : Number.isFinite(featureExpiryMs)
          ? Math.max(0, Math.floor((featureExpiryMs - checkedAt) / 1000))
          : null;
    const isignalUsersAccessReason = String(
      source.isignalUsersAccessReason ||
      previous.isignalUsersAccessReason ||
      (isignalUsersAccess ? (isignalUsersIncluded ? 'INCLUDED_IN_PLAN' : 'ADDON_ACTIVE') : (isignalUsersAddonRequired ? 'ADDON_NOT_PURCHASED' : 'ACCESS_NOT_AVAILABLE'))
    ).trim().toUpperCase();

    return {
      valid: true,
      success: true,
      code: 'LICENSE_VALID',
      message: 'Lisensi valid.',
      email: cleanEmail(credentials.email),
      status: String(source.status || previous.status || 'ACTIVE').trim().toUpperCase(),
      duration,
      isTrial: duration === 'TRIAL (1 HARI)',
      isPermanent: duration === 'PERMANENT',
      activatedAt: String(credentials.activatedAt || previous.activatedAt || ''),
      expiresAt,
      serverTime: String(source.checkedAt || source.serverTime || previous.serverTime || new Date(checkedAt).toISOString()),
      remainingSeconds,
      isOffline: false,
      verificationPending: false,
      serverVerified: true,
      isignalUsersAccessKnown,
      isignalUsersAccess,
      isignalUsersIncluded,
      isignalUsersAddonRequired,
      isignalUsersPlan,
      isignalUsersExpiresAt,
      isignalUsersRemainingSeconds,
      isignalUsersAccessReason,
      checkedAt
    };
  }

  async function saveValidatedSessionState(credentials, validateResult) {
    const now = Date.now();
    const stored = await storageGet([CREDENTIALS_KEY, LEGACY_LICENSE_STATE_KEY]);
    const existing = stored[CREDENTIALS_KEY] || {};
    const previousLegacyState = stored[LEGACY_LICENSE_STATE_KEY] || {};
    const legacyState = buildLegacyLicenseState(validateResult, {
      ...existing,
      ...credentials
    }, previousLegacyState);

    await storageSet({
      [CREDENTIALS_KEY]: {
        ...existing,
        email: cleanEmail(credentials.email),
        emailCanonical: normalizeEmail(credentials.email),
        token: normalizeToken(credentials.token),
        lastValidatedAt: now,
        expiresAt: legacyState.expiresAt,
        duration: legacyState.duration,
        isTrial: legacyState.isTrial,
        isPermanent: legacyState.isPermanent,
        serverTime: legacyState.serverTime,
        remainingSeconds: legacyState.remainingSeconds
      },
      [STATE_KEY]: {
        valid: true,
        checkedAt: now,
        code: String(validateResult.code || 'DEVICE_SESSION_VALID'),
        deviceName: String(validateResult.deviceName || ''),
        license: String(validateResult.license || ''),
        status: legacyState.status,
        duration: legacyState.duration,
        expiresAt: legacyState.expiresAt,
        isignalUsersAccessKnown: legacyState.isignalUsersAccessKnown,
        isignalUsersAccess: legacyState.isignalUsersAccess,
        isignalUsersIncluded: legacyState.isignalUsersIncluded,
        isignalUsersAddonRequired: legacyState.isignalUsersAddonRequired,
        isignalUsersPlan: legacyState.isignalUsersPlan,
        isignalUsersExpiresAt: legacyState.isignalUsersExpiresAt,
        isignalUsersAccessReason: legacyState.isignalUsersAccessReason
      },
      [LEGACY_LICENSE_STATE_KEY]: legacyState,
      [MANUAL_BUILD_ACTIVATION_KEY]: {
        version: String(chrome.runtime.getManifest().version || ''),
        versionName: String(chrome.runtime.getManifest().version_name || ''),
        activatedAt: now
      }
    });
    const licenseId = String(
      validateResult && (validateResult.licenseId || validateResult.license) ||
      credentials && credentials.licenseId ||
      existing.licenseId || ''
    ).trim();
    if (licenseId && String(existing.licenseId || '') !== licenseId) {
      await storageSet({
        [CREDENTIALS_KEY]: {
          ...((await storageGet([CREDENTIALS_KEY]))[CREDENTIALS_KEY] || {}),
          licenseId
        },
        [STATE_KEY]: {
          ...((await storageGet([STATE_KEY]))[STATE_KEY] || {}),
          licenseId
        }
      });
    }
    await setVaultRecovery({ ...existing, ...credentials, licenseId }, licenseId);
  }

  async function saveActivationTrace(phase, result = null) {
    const source = result && typeof result === 'object' ? result : {};
    await storageSet({
      [ACTIVATION_TRACE_KEY]: {
        phase: String(phase || ''),
        code: String(source.code || source.error || ''),
        message: String(source.message || ''),
        checkedAt: Date.now()
      }
    });
  }

  async function savePendingClient(credentials, requestId) {
    const normalizedRequestId = String(requestId || '').trim().toUpperCase();
    if (!normalizedRequestId) return;
    const previous = (await storageGet([PENDING_CLIENT_KEY]))[PENDING_CLIENT_KEY] || {};
    const sameRequest = previous.requestId === normalizedRequestId &&
      normalizeEmail(previous.email) === normalizeEmail(credentials && credentials.email) &&
      normalizeToken(previous.token) === normalizeToken(credentials && credentials.token);
    await storageSet({
      [PENDING_CLIENT_KEY]: {
        requestId: normalizedRequestId,
        email: cleanEmail(credentials && credentials.email),
        emailCanonical: normalizeEmail(credentials && credentials.email),
        token: normalizeToken(credentials && credentials.token),
        createdAt: sameRequest && Number(previous.createdAt) > 0 ? Number(previous.createdAt) : Date.now()
      }
    });
  }

  async function clearPendingClient() {
    await storageRemove([PENDING_CLIENT_KEY]);
  }

  async function waitForDeviceApproval(credentials, pendingRequestId, reloadAfterSuccess) {
    const requestId = String(pendingRequestId || '').trim().toUpperCase();
    if (!requestId) {
      await clearPendingClient();
      showError({
        code: 'PENDING_REQUEST_ID_MISSING',
        message: 'Server meminta persetujuan perangkat, tetapi tidak mengirim Request ID. Pastikan Apps Script dan Cloudflare Worker tahap pending approval sudah ter-deploy pada URL aktif.'
      });
      return;
    }
    await savePendingClient(credentials, requestId);
    await saveActivationTrace('WAITING_DEVICE_APPROVAL', { code: 'DEVICE_APPROVAL_REQUIRED' });
    const pending = (await storageGet([PENDING_CLIENT_KEY]))[PENDING_CLIENT_KEY] || {};
    const startedAt = Number(pending.createdAt) || Date.now();
    let connectionFailures = 0;
    let emptyStateCount = 0;
    let mismatchCount = 0;
    const bootstrapGraceMs = 20000;

    setStatus(
      'loading',
      'Menunggu persetujuan perangkat utama',
      'Permintaan sudah dikirim. Status diperiksa otomatis tanpa perlu memasukkan ulang email atau token.'
    );
    setContent(`
      <div class="tf-device-lock-note">
        Buka perangkat utama lalu pilih <strong>Izinkan</strong> pada popup TF Device Lock.
        Permintaan berlaku sekitar 15 menit.
      </div>
    `);

    while (Date.now() - startedAt < DEVICE_APPROVAL_WAIT_MS) {
      try {
        const state = await apiWithCredentialVariants('/license-check', {
          email: cleanEmail(credentials.email),
          token: normalizeToken(credentials.token)
        });
        if (!state || state.ok !== true || state.valid !== true) {
          if (state && sourceLookupDefinitive(state)) {
            await clearPendingClient();
            showError(state);
            return;
          }
          throw new Error(String(state && (state.message || state.code) || 'Status server belum tersedia.'));
        }
        connectionFailures = 0;

        const serverRequestId = String(state && state.pendingRequestId || '').trim().toUpperCase();
        const pendingStatus = String(state && state.pendingStatus || '').trim().toUpperCase();
        const elapsed = Date.now() - startedAt;

        if (serverRequestId === requestId && pendingStatus === 'DECLINED') {
          await clearPendingClient();
          await saveActivationTrace('DEVICE_REQUEST_DECLINED', state);
          showError({
            code: 'DEVICE_REQUEST_DECLINED',
            message: 'Permintaan perangkat ditolak oleh perangkat utama.'
          });
          return;
        }

        if (serverRequestId === requestId && pendingStatus === 'APPROVED') {
          await saveActivationTrace('DEVICE_REQUEST_APPROVED', state);
          setStatus('loading', 'Persetujuan diterima', 'Menyelesaikan binding dan membuat session perangkat baru.');
          busy = false;
          await activateOrRenew(credentials, reloadAfterSuccess);
          return;
        }

        if (!serverRequestId) {
          emptyStateCount += 1;
          setStatus('loading', 'Menyinkronkan status permintaan perangkat',
            'Status server belum lengkap. Permintaan tetap disimpan; koneksi diperiksa ulang otomatis.');
          await sleep(Math.min(15000, 3000 + emptyStateCount * 2000));
          continue;
        }

        if (serverRequestId === requestId && pendingStatus === 'EXPIRED') {
          await clearPendingClient();
          showError({ code: 'DEVICE_REQUEST_EXPIRED', message: 'Server mengonfirmasi waktu persetujuan telah habis. Klik Periksa Lagi.' });
          return;
        }

        if (serverRequestId !== requestId) {
          mismatchCount += 1;
          if (elapsed < bootstrapGraceMs && mismatchCount <= 2) {
            const remaining = Math.max(0, DEVICE_APPROVAL_WAIT_MS - elapsed);
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setStatus(
              'loading',
              'Menyelaraskan Request ID perangkat',
              `Terdeteksi Request ID lain di server (${mismatchCount}). Extension akan verifikasi ulang otomatis • sisa waktu lokal ${minutes}:${String(seconds).padStart(2, '0')}`
            );
            await sleep(5000);
            continue;
          }
          await clearPendingClient();
          await saveActivationTrace('DEVICE_REQUEST_REPLACED', state);
          showError({
            code: 'DEVICE_REQUEST_REPLACED',
            message: 'Permintaan ini telah digantikan oleh permintaan perangkat lain. Klik Periksa Lagi untuk mengirim permintaan baru.'
          });
          return;
        }

        emptyStateCount = 0;
        mismatchCount = 0;
        const remaining = Math.max(0, DEVICE_APPROVAL_WAIT_MS - elapsed);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setStatus(
          'loading',
          'Menunggu persetujuan perangkat utama',
          `Status: ${pendingStatus || 'PENDING'} • sisa waktu lokal ${minutes}:${String(seconds).padStart(2, '0')}`
        );
      } catch (error) {
        connectionFailures += 1;
        setStatus(
          'loading',
          'Menunggu koneksi server',
          `Status belum dapat diperiksa (${connectionFailures}). Extension akan mencoba lagi otomatis.`
        );
      }

      await sleep(5000);
    }

    await clearPendingClient();
    const timeoutCode = emptyStateCount || connectionFailures ? 'DEVICE_APPROVAL_STATUS_UNAVAILABLE' : 'DEVICE_REQUEST_EXPIRED';
    await saveActivationTrace('DEVICE_REQUEST_TIMEOUT', { code: timeoutCode });
    showError({
      code: timeoutCode,
      message: 'Batas tunggu 15 menit telah habis. Klik Periksa Lagi untuk memeriksa perangkat dan mengirim permintaan baru bila diperlukan.'
    });
  }

  async function activateOrRenew(credentials, reloadAfterSuccess, options = {}) {
    if (busy) return;
    busy = true;
    const sameBuildRecovery = options && options.sameBuildRecovery === true;
    credentials = {
      ...(credentials || {}),
      email: cleanEmail(credentials && credentials.email),
      token: normalizeToken(credentials && credentials.token)
    };
    currentCredentials = credentials;
    const existingCredentials = (await storageGet([CREDENTIALS_KEY]))[CREDENTIALS_KEY] || {};
    await storageSet({
      [CREDENTIALS_KEY]: {
        ...existingCredentials,
        email: credentials.email,
        emailCanonical: normalizeEmail(credentials.email),
        token: credentials.token,
        licenseId: String(credentials.licenseId || existingCredentials.licenseId || '').trim(),
        savedAt: Date.now(),
        submittedVersion: chrome.runtime.getManifest().version
      }
    });
    await saveActivationTrace('START_DEVICE_ACTIVATION');
    setContent('');
    setStatus('loading', 'Memeriksa lisensi', 'Mencocokkan email dan token langsung ke sumber data lisensi.');

    try {
      const sourceLookup = await lookupLicenseSource(credentials);
      if (sourceLookup && sourceLookup.valid === true) {
        credentials = {
          ...credentials,
          email: cleanEmail(sourceLookup.acceptedEmail || sourceLookup.email || credentials.email),
          token: normalizeToken(sourceLookup.acceptedToken || credentials.token),
          licenseId: String(sourceLookup.licenseId || sourceLookup.license || '').trim()
        };
        currentCredentials = credentials;
        await storageSet({
          [CREDENTIALS_KEY]: {
            email: credentials.email,
            emailCanonical: normalizeEmail(credentials.email),
            token: credentials.token,
            licenseId: credentials.licenseId,
            savedAt: Date.now(),
            submittedVersion: chrome.runtime.getManifest().version
          }
        });
      } else if (sourceLookup && sourceLookupDefinitive(sourceLookup)) {
        const sourceCode = String(sourceLookup.code || sourceLookup.error || 'LICENSE_NOT_FOUND');
        const sourceMessage = String(sourceLookup.message || 'Email atau token tidak ditemukan pada sumber data lisensi.');
        if (sameBuildRecovery) {
          showError({ code: sourceCode, message: sourceMessage }, sourceMessage);
        } else {
          showActivationForm(`[${sourceCode}] ${sourceMessage}`);
        }
        return;
      }

      setStatus('loading', 'Menyiapkan Device Vault', 'Membuat challenge perangkat yang hanya dapat digunakan satu kali.');
      const challengeResult = await apiWithCredentialVariants('/device-challenge', {
        ...credentials,
        licenseId: String(credentials.licenseId || sourceLookup && (sourceLookup.licenseId || sourceLookup.license) || '').trim()
      });
      await saveActivationTrace('DEVICE_CHALLENGE_RESPONSE', challengeResult);
      if (credentialAccepted(challengeResult) && challengeResult.acceptedToken) {
        credentials = {
          ...credentials,
          email: cleanEmail(challengeResult.acceptedEmail || credentials.email),
          token: normalizeToken(challengeResult.acceptedToken)
        };
        currentCredentials = credentials;
        const storedCredentials = (await storageGet([CREDENTIALS_KEY]))[CREDENTIALS_KEY] || {};
        await storageSet({
          [CREDENTIALS_KEY]: {
            ...storedCredentials,
            email: credentials.email,
            emailCanonical: normalizeEmail(credentials.email),
            token: credentials.token,
            licenseId: String(credentials.licenseId || storedCredentials.licenseId || '').trim(),
            savedAt: Date.now()
          }
        });
      }
      if (!challengeResult || challengeResult.ok !== true || challengeResult.valid !== true) {
        const code = String(challengeResult && (challengeResult.code || challengeResult.error) || 'DEVICE_CHALLENGE_FAILED');
        const message = String(challengeResult && (challengeResult.message || challengeResult.code || challengeResult.error) || 'Lisensi tidak valid.');
        if (String(code).toUpperCase() === 'LICENSE_NOT_FOUND' && sourceLookup && sourceLookup.valid === true) {
          const outOfSync = 'Lisensi ditemukan di Google Sheet, tetapi Cloudflare Device API belum membaca data yang sama.';
          if (sameBuildRecovery) {
            showError({ code: 'DEVICE_API_OUT_OF_SYNC', message: outOfSync }, outOfSync);
          } else {
            showActivationForm('[DEVICE_API_OUT_OF_SYNC] ' + outOfSync + ' Deploy ulang Cloudflare Worker dan pastikan APPS_SCRIPT_URL serta SERVER_SHARED_SECRET sama dengan Apps Script aktif.');
          }
          return;
        }
        const suffix = /TOKEN|CREDENTIAL|PERIKSA.*TOKEN/i.test(code + ' ' + message)
          ? '\nExtension sudah mencoba variasi aman email dan token tanpa menyimpan format yang gagal.'
          : '';
        if (sameBuildRecovery && isTransientRecoveryResult(challengeResult) &&
            scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, message)) {
          return;
        }
        if (sameBuildRecovery) {
          showError({ code, message: message + suffix }, message + suffix);
        } else {
          showActivationForm(`[${code}] ${message}${suffix}`);
        }
        return;
      }

      setStatus('loading', 'Memverifikasi kunci perangkat', 'Device Vault sedang menandatangani challenge server.');
      const proof = await requestVaultProof(challengeResult.challenge);
      const deviceInfo = proof.deviceInfo || {};
      const signatureInfo = proof.signatureInfo || {};

      setStatus('loading', 'Mengikat lisensi ke perangkat', 'Server sedang memeriksa Device ID, public key, dan tanda tangan perangkat.');
      const platform = navigator.userAgentData?.platform || navigator.platform || 'Unknown';
      const bindResult = await apiWithCredentialVariants('/bind-device', {
        email: cleanEmail(credentials.email),
        emailCanonical: normalizeEmail(credentials.email),
        token: normalizeToken(credentials.token),
        requestId: challengeResult.requestId,
        challenge: challengeResult.challenge,
        publicKeySpki: deviceInfo.publicKeySpki,
        signatureBase64: signatureInfo.signatureBase64,
        deviceName: platform + ' • Chrome',
        licenseId: String(credentials.licenseId || challengeResult.licenseId || challengeResult.license || '').trim()
      });
      await saveActivationTrace('BIND_DEVICE_RESPONSE', bindResult);

      if (bindResult && bindResult.bound === true && bindResult.sessionToken) {
        await clearPendingClient();
        await saveSession(credentials, bindResult);
        setStatus('success', 'Perangkat berhasil diverifikasi', bindResult.message || 'Session perangkat berhasil dibuat.');
        setContent('<div class="tf-device-lock-note">Membuka extension...</div>');
        if (reloadAfterSuccess) {
          setTimeout(() => location.reload(), 650);
        } else {
          busy = false;
          await validateExistingSession(credentials, String(bindResult.sessionToken));
        }
        return;
      }

      if (bindResult && bindResult.code === 'DEVICE_APPROVAL_REQUIRED') {
        await savePendingClient(
          credentials,
          String(bindResult.pendingRequestId || bindResult.requestId || '')
        );
        await waitForDeviceApproval(
          credentials,
          String(bindResult.pendingRequestId || bindResult.requestId || ''),
          reloadAfterSuccess
        );
        return;
      }

      if (bindResult && bindResult.code === 'DEVICE_REQUEST_DECLINED') {
        await clearPendingClient();
        showError(bindResult, 'Permintaan perangkat ditolak oleh perangkat utama.');
        return;
      }

      const bindMessage = String(bindResult && (bindResult.message || bindResult.code) || 'Pengikatan perangkat gagal.');
      if (sameBuildRecovery && isTransientRecoveryResult(bindResult) &&
          scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, bindMessage)) {
        return;
      }
      if (sameBuildRecovery) {
        showError({
          code: String(bindResult && (bindResult.code || bindResult.error) || 'DEVICE_RECOVERY_FAILED'),
          message: bindMessage
        }, bindMessage);
      } else {
        showActivationForm(bindMessage);
      }
    } catch (error) {
      await saveActivationTrace('ACTIVATION_EXCEPTION', {
        code: error && error.name || 'ERROR',
        message: error && error.message || String(error)
      });
      const friendly = friendlyErrorMessage(error);
      if (sameBuildRecovery) {
        if (scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, friendly)) {
          return;
        }
        if (await unlockFromRecentDeviceValidation(friendly)) {
          return;
        }
        showError({ code: 'DEVICE_RESTART_RECOVERY_FAILED', message: friendly }, friendly);
      } else {
        showActivationForm(friendly);
      }
    } finally {
      busy = false;
    }
  }

  async function validateExistingSession(credentials, sessionToken) {
    if (busy) return;
    busy = true;
    setContent('');
    setStatus('loading', 'Memeriksa session perangkat', 'Menghubungkan extension ke server Device Lock.');

    try {
      const challengeResult = await apiWithCredentialVariants('/session-challenge', {
        email: cleanEmail(credentials.email),
        emailCanonical: normalizeEmail(credentials.email),
        token: normalizeToken(credentials.token),
        sessionToken: String(sessionToken || '')
      });

      if (credentialAccepted(challengeResult) && challengeResult.acceptedToken) {
        credentials = {
          ...credentials,
          email: cleanEmail(challengeResult.acceptedEmail || credentials.email),
          token: normalizeToken(challengeResult.acceptedToken)
        };
        currentCredentials = credentials;
      }
      if (!challengeResult || challengeResult.ok !== true || challengeResult.sessionValid !== true) {
        const code = String(challengeResult && challengeResult.code || '');
        if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_NOT_FOUND', 'DEVICE_NOT_BOUND'].includes(code)) {
          busy = false;
          await activateOrRenew(credentials, true, { sameBuildRecovery: true, recoveryAttempt: 0 });
          return;
        }
        showError(challengeResult, 'Session perangkat tidak valid.');
        return;
      }

      setStatus('loading', 'Membuktikan kepemilikan perangkat', 'Device Vault sedang menandatangani session challenge.');
      const proof = await requestVaultProof(challengeResult.challenge);
      const deviceInfo = proof.deviceInfo || {};
      const signatureInfo = proof.signatureInfo || {};

      setStatus('loading', 'Menyelesaikan validasi', 'Memeriksa session, Device ID, public key, dan signature.');
      const validateResult = await apiWithCredentialVariants('/session-validate', {
        email: cleanEmail(credentials.email),
        emailCanonical: normalizeEmail(credentials.email),
        token: normalizeToken(credentials.token),
        sessionToken: String(sessionToken || ''),
        requestId: challengeResult.requestId,
        challenge: challengeResult.challenge,
        publicKeySpki: deviceInfo.publicKeySpki,
        signatureBase64: signatureInfo.signatureBase64
      });

      if (credentialAccepted(validateResult) && validateResult.acceptedToken) {
        credentials = {
          ...credentials,
          email: cleanEmail(validateResult.acceptedEmail || credentials.email),
          token: normalizeToken(validateResult.acceptedToken)
        };
        currentCredentials = credentials;
      }
      if (
        validateResult &&
        validateResult.ok === true &&
        validateResult.valid === true &&
        validateResult.sessionValid === true &&
        validateResult.code === 'DEVICE_SESSION_VALID'
      ) {
        await saveValidatedSessionState(credentials, validateResult);
        setStatus('success', 'Session perangkat valid', 'Extension dibuka pada perangkat aktif.');
        setTimeout(() => { void unlockApp(); }, 180);
        return;
      }

      const invalidCode = String(validateResult && validateResult.code || '');
      if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_CHANGED', 'DEVICE_SESSION_NOT_AVAILABLE'].includes(invalidCode)) {
        busy = false;
        await activateOrRenew(credentials, true, { sameBuildRecovery: true, recoveryAttempt: 0 });
        return;
      }

      showError(validateResult, 'Session perangkat tidak dapat diverifikasi.');
    } catch (error) {
      const stored = await storageGet([STATE_KEY]);
      const state = stored[STATE_KEY] || {};
      const checkedAt = Number(state.checkedAt || 0);
      const graceRemaining = checkedAt > 0 ? checkedAt + OFFLINE_GRACE_MS - Date.now() : 0;
      if (state.valid === true && graceRemaining > 0) {
        const hours = Math.max(1, Math.ceil(graceRemaining / 3600000));
        setStatus('success', 'Mode offline sementara', 'Server Device Lock belum merespons. Perangkat ini menggunakan validasi terakhir yang tersimpan.');
        setContent(`<div class="tf-device-lock-offline">Validasi online wajib dilakukan kembali dalam sekitar ${hours} jam.</div>`);
        setTimeout(() => { void unlockApp(); }, 350);
        return;
      }
      showError({
        code: 'DEVICE_LOCK_SERVER_UNAVAILABLE',
        message: friendlyErrorMessage(error)
      });
    } finally {
      busy = false;
    }
  }

  async function start() {
    ensureUi();

    let stored = await storageGet([CREDENTIALS_KEY, SESSION_KEY, STATE_KEY, PENDING_CLIENT_KEY, ACTIVATION_TRACE_KEY, MANUAL_BUILD_ACTIVATION_KEY]);
    let credentials = stored[CREDENTIALS_KEY] || {};
    const pendingClient = stored[PENDING_CLIENT_KEY] || {};
    const activationTrace = stored[ACTIVATION_TRACE_KEY] || {};
    let email = cleanEmail(credentials.email || credentials.emailOriginal || credentials.emailCanonical);
    let token = normalizeToken(credentials.token);
    const sessionToken = String(stored[SESSION_KEY] || '').trim();
    const previousCode = String(activationTrace.code || '').trim().toUpperCase();
    const buildActivation = stored[MANUAL_BUILD_ACTIVATION_KEY] || {};
    const manifest = chrome.runtime.getManifest();
    const currentVersion = String(manifest.version || '');
    const currentVersionName = String(manifest.version_name || '');
    const buildAlreadyActivated =
      String(buildActivation.version || '') === currentVersion &&
      String(buildActivation.versionName || '') === currentVersionName;

    // REV363 — newly loaded build must show the activation form once.
    // After a successful activation, reopening the same build reuses its local session.
    const pendingForThisBuild = String(credentials.submittedVersion || '') === currentVersion &&
      pendingClient.requestId && normalizeEmail(pendingClient.email) === normalizeEmail(email) &&
      normalizeToken(pendingClient.token) === token;
    if (!buildAlreadyActivated && !pendingForThisBuild) {
      currentCredentials = null;
      showActivationForm(
        'Plugin baru dipasang / Load unpacked. Masukkan Email Lisensi dan Token Aktivasi sekali untuk build ini. Setelah aktivasi berhasil, buka-tutup plugin tidak akan meminta token lagi.',
        false
      );
      return;
    }

    currentCredentials = { ...credentials, email, token };

    if (!email || !token) {
      setContent('');
      setStatus(
        'loading',
        'Memulihkan aktivasi PC setelah restart',
        'Build ini sudah pernah diaktivasi. Mencari credential recovery pada Device Vault tanpa meminta kode aktivasi ulang.'
      );
      const restored = await restoreActivatedBuildCredentials(credentials);
      if (restored) {
        credentials = restored;
        email = cleanEmail(restored.email || restored.emailCanonical);
        token = normalizeToken(restored.token);
        currentCredentials = { ...restored, email, token };
      }
    }

    if (!email || !token) {
      showActivationForm(
        previousCode === 'LICENSE_NOT_FOUND'
          ? 'Credential recovery tidak tersedia dan lisensi sebelumnya tidak ditemukan. Masukkan kembali email dan token lisensi yang aktif.'
          : 'Credential aktivasi build ini tidak dapat dipulihkan dari storage maupun Device Vault. Masukkan email dan token satu kali untuk memulihkan perangkat.',
        false
      );
      return;
    }

    if (!sessionToken) {
      const pendingRequestId = String(pendingClient.requestId || '').trim().toUpperCase();
      const pendingEmail = cleanEmail(pendingClient.email || email);
      const pendingToken = normalizeToken(pendingClient.token || token);
      const pendingAge = Date.now() - Number(pendingClient.createdAt || 0);
      if (pendingRequestId && pendingEmail && pendingToken && pendingAge >= 0 && pendingAge < DEVICE_APPROVAL_WAIT_MS) {
        currentCredentials = { ...credentials, email: pendingEmail, token: pendingToken };
        busy = true;
        try {
          await waitForDeviceApproval(currentCredentials, pendingRequestId, true);
        } finally {
          busy = false;
        }
        return;
      }

      await clearPendingClient();
      setContent('');
      setStatus(
        'loading',
        'Memulihkan aktivasi PC sebelumnya',
        'Token tersimpan ditemukan. Extension akan membuat session baru untuk Device Vault yang sama tanpa meminta Reset PC.'
      );
      await activateOrRenew(currentCredentials, true, { sameBuildRecovery: true, recoveryAttempt: 0 });
      return;
    }

    setContent('');
    setStatus('loading', 'Memeriksa session perangkat', 'Membaca lisensi dan memverifikasi perangkat aktif.');
    await validateExistingSession({ ...credentials, email, token }, sessionToken);
  }

  try {
    chrome.runtime.onMessage.addListener((message) => {
      if (!message || message.type !== 'TF_DEVICE_SESSION_REVOKED') return undefined;
      void (async () => {
        await storageRemove([SESSION_KEY, STATE_KEY]);
        currentCredentials = null;
        location.reload();
      })();
      return undefined;
    });
  } catch (_) {}

  ensureUi();
  void runDeviceFlow(start);
})();
