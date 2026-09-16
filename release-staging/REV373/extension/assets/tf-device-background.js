importScripts('901c62026afc22f4.js', 'tf-github-update-background.js');

(() => {
  'use strict';


  // REV190 — eliminate stale content-script contexts after extension update/reload.
  // Chrome cannot revive an already-invalidated content script. Reloading matching TF tabs
  // replaces the old isolated world with the current helper automatically.
  function tfReloadTradersFamilyTabsAfterUpdate(details) {
    try {
      const reason = details && String(details.reason || '');
      if (reason && !['install', 'update'].includes(reason)) return;
      chrome.tabs.query({ url: ['https://account.tradersfamily.id/*', 'https://tradersfamily.id/*'] }, (tabs) => {
        try { void chrome.runtime.lastError; } catch (_) {}
        (Array.isArray(tabs) ? tabs : []).forEach((tab) => {
          if (!tab || !Number.isInteger(tab.id)) return;
          try {
            chrome.tabs.reload(tab.id, { bypassCache: false }, () => {
              try { void chrome.runtime.lastError; } catch (_) {}
            });
          } catch (_) {}
        });
      });
    } catch (_) {}
  }

  try { chrome.runtime.onInstalled.addListener(tfReloadTradersFamilyTabsAfterUpdate); } catch (_) {}
  // Also cover manual chrome://extensions Reload: service-worker boot sees a new build marker
  // and refreshes TF tabs exactly once for that build.
  try {
    const tfBuildMarker = String((chrome.runtime.getManifest && chrome.runtime.getManifest().version_name) || (chrome.runtime.getManifest && chrome.runtime.getManifest().version) || '');
    chrome.storage.local.get(['tfLoginHelperBuildSeen'], (state) => {
      try { void chrome.runtime.lastError; } catch (_) {}
      const seen = String(state && state.tfLoginHelperBuildSeen || '');
      if (!tfBuildMarker || seen === tfBuildMarker) return;
      chrome.storage.local.set({ tfLoginHelperBuildSeen: tfBuildMarker }, () => {
        try { void chrome.runtime.lastError; } catch (_) {}
        tfReloadTradersFamilyTabsAfterUpdate({ reason: 'update' });
      });
    });
  } catch (_) {}

  const VAULT_URL = 'https://wiliejonathan.github.io/tf-device-vault/';
  const VAULT_PATTERN = 'https://wiliejonathan.github.io/tf-device-vault/*';
  const BRIDGE_FILE = 'assets/tf-device-vault-bridge.js';

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function tabsQuery(queryInfo) {
    return new Promise((resolve) => {
      try {
        chrome.tabs.query(queryInfo, (tabs) => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve(Array.isArray(tabs) ? tabs : []);
        });
      } catch (_) {
        resolve([]);
      }
    });
  }

  function tabsCreate(createProperties) {
    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.create(createProperties, (tab) => {
          const error = chrome.runtime.lastError;
          if (error) {
            reject(new Error(error.message));
            return;
          }
          resolve(tab);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  function tabsGet(tabId) {
    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.get(tabId, (tab) => {
          const error = chrome.runtime.lastError;
          if (error) {
            reject(new Error(error.message));
            return;
          }
          resolve(tab);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  function tabsRemove(tabId) {
    return new Promise((resolve) => {
      try {
        chrome.tabs.remove(tabId, () => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve();
        });
      } catch (_) {
        resolve();
      }
    });
  }

  function executeScript(tabId, files) {
    return new Promise((resolve, reject) => {
      try {
        chrome.scripting.executeScript(
          {
            target: { tabId },
            files
          },
          (results) => {
            const error = chrome.runtime.lastError;
            if (error) {
              reject(new Error(error.message));
              return;
            }
            resolve(results || []);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  function sendTabMessage(tabId, message) {
    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          const error = chrome.runtime.lastError;
          if (error) {
            reject(new Error(error.message));
            return;
          }
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function probeBridge(tabId) {
    try {
      const response = await sendTabMessage(tabId, {
        type: 'TF_DEVICE_VAULT_CONTENT_PING'
      });
      return Boolean(response && response.ok === true && response.ready === true);
    } catch (_) {
      return false;
    }
  }

  async function ensureBridgeInjected(tabId) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (await probeBridge(tabId)) return;
      await delay(180);
    }

    try {
      await executeScript(tabId, [BRIDGE_FILE]);
    } catch (error) {
      throw new Error(
        'Tidak dapat memasang koneksi TF Device Vault: ' +
        (error && error.message ? error.message : String(error))
      );
    }

    for (let attempt = 0; attempt < 24; attempt += 1) {
      if (await probeBridge(tabId)) return;
      await delay(200);
    }

    throw new Error('Koneksi TF Device Vault belum siap. Muat ulang halaman Device Vault lalu coba lagi.');
  }

  async function waitForTabReady(tabId, timeoutMs = 25000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      try {
        const tab = await tabsGet(tabId);
        if (tab && tab.status === 'complete') {
          await delay(250);
          return tab;
        }
      } catch (_) {}

      await delay(250);
    }

    throw new Error('Halaman TF Device Vault terlalu lama dimuat.');
  }

  async function getVaultTab(ownerTabId = null) {
    const existing = await tabsQuery({ url: [VAULT_PATTERN] });
    const usable = existing.find((tab) => Number.isInteger(tab.id));

    if (usable) {
      await waitForTabReady(usable.id);
      await ensureBridgeInjected(usable.id);
      return { tab: usable, created: false };
    }

    const created = (typeof bg_createSilentTab === 'function')
      ? await bg_createSilentTab(VAULT_URL, ownerTabId)
      : await tabsCreate({ url: VAULT_URL, active: false });

    if (!created || !Number.isInteger(created.id)) {
      throw new Error('Tidak dapat membuka TF Device Vault.');
    }

    await waitForTabReady(created.id);
    await ensureBridgeInjected(created.id);
    return { tab: created, created: true };
  }

  async function requestProof(challenge, ownerTabId = null) {
    const normalizedChallenge = String(challenge || '').trim();
    if (normalizedChallenge.length < 16) {
      throw new Error('Challenge perangkat tidak valid.');
    }

    const vault = await getVaultTab(ownerTabId);
    const tabId = vault.tab.id;

    try {
      let lastError = null;

      for (let attempt = 1; attempt <= 4; attempt += 1) {
        try {
          const response = await sendTabMessage(tabId, {
            type: 'TF_DEVICE_VAULT_CONTENT_PROOF',
            challenge: normalizedChallenge
          });

          if (!response || response.ok !== true) {
            throw new Error(
              String(
                response && response.message ||
                'TF Device Vault belum memberikan bukti perangkat.'
              )
            );
          }

          return response.data || {};
        } catch (error) {
          lastError = error;

          if (attempt === 2) {
            try {
              await ensureBridgeInjected(tabId);
            } catch (_) {}
          }

          await delay(450);
        }
      }

      throw lastError || new Error('TF Device Vault tidak dapat dihubungi.');
    } finally {
      if (vault.created) {
        await tabsRemove(tabId);
      }
    }
  }


  async function requestVaultRecovery(action, data = null, ownerTabId = null) {
    const vault = await getVaultTab(ownerTabId);
    const tabId = vault.tab.id;
    const typeMap = {
      GET: 'TF_DEVICE_VAULT_CONTENT_RECOVERY_GET',
      SET: 'TF_DEVICE_VAULT_CONTENT_RECOVERY_SET',
      CLEAR: 'TF_DEVICE_VAULT_CONTENT_RECOVERY_CLEAR'
    };
    const messageType = typeMap[String(action || '').toUpperCase()];
    if (!messageType) throw new Error('Aksi recovery Device Vault tidak dikenal.');

    try {
      let lastError = null;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          await ensureBridgeInjected(tabId);
          const response = await sendTabMessage(tabId, {
            type: messageType,
            data: data || null
          });
          if (!response || response.ok !== true) {
            throw new Error(String(response && response.message || 'Recovery Device Vault gagal.'));
          }
          return response.data || null;
        } catch (error) {
          lastError = error;
          await delay(300);
        }
      }
      throw lastError || new Error('Recovery Device Vault tidak dapat dihubungi.');
    } finally {
      if (vault.created) await tabsRemove(tabId);
    }
  }

  // REV168 — run Firebase Google redirect in the page MAIN world.
  // This replaces the old inline <script> injection, which was blocked by the
  // account.tradersfamily.id Content Security Policy.
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.type !== 'tf_google_redirect_main_world') return undefined;
    const tabId = sender && sender.tab && Number.isInteger(sender.tab.id) ? sender.tab.id : null;
    if (tabId == null) {
      sendResponse({ ok: false, error: 'TAB_NOT_FOUND' });
      return false;
    }
    try {
      chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        func: () => {
          try {
            const fb = window.firebase;
            if (!fb || !fb.auth || !fb.auth.GoogleAuthProvider) {
              return { ok: false, error: 'FIREBASE_NOT_READY' };
            }
            const auth = fb.auth();
            if (!auth || typeof auth.signInWithRedirect !== 'function') {
              return { ok: false, error: 'REDIRECT_NOT_AVAILABLE' };
            }
            const provider = new fb.auth.GoogleAuthProvider();
            auth.signInWithRedirect(provider);
            try { document.documentElement.dataset.tfGoogleRedirect = '1'; } catch (_) {}
            return { ok: true };
          } catch (error) {
            return { ok: false, error: error && error.message ? error.message : String(error) };
          }
        }
      }, (results) => {
        const error = chrome.runtime.lastError;
        if (error) {
          sendResponse({ ok: false, error: error.message });
          return;
        }
        const result = results && results[0] ? results[0].result : null;
        sendResponse(result || { ok: false, error: 'NO_RESULT' });
      });
    } catch (error) {
      sendResponse({ ok: false, error: error && error.message ? error.message : String(error) });
    }
    return true;
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !['TF_DEVICE_VAULT_RECOVERY_GET', 'TF_DEVICE_VAULT_RECOVERY_SET', 'TF_DEVICE_VAULT_RECOVERY_CLEAR'].includes(message.type)) {
      return undefined;
    }

    const ownerTabId = sender && sender.tab && sender.tab.id != null ? sender.tab.id : null;
    const action = message.type.endsWith('_GET') ? 'GET' : message.type.endsWith('_SET') ? 'SET' : 'CLEAR';
    requestVaultRecovery(action, message.data || null, ownerTabId)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({
        ok: false,
        message: error && error.message ? error.message : String(error)
      }));
    return true;
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.type !== 'TF_DEVICE_VAULT_PROOF') {
      return undefined;
    }

    const ownerTabId = sender && sender.tab && sender.tab.id != null ? sender.tab.id : null;
    requestProof(message.challenge, ownerTabId)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({
        ok: false,
        message: error && error.message ? error.message : String(error)
      }));

    return true;
  });

  // REV124 — one-license-one-device approval monitor.
  const TF_APPROVAL_API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const TF_APPROVAL_ALARM = 'tf-device-approval-poll-v1';
  const TF_TRANSFER_ALARM = 'tf-device-transfer-watch-v1';
  const TF_CREDENTIALS_KEY = 'tfLicenseCredentials';
  const TF_SESSION_KEY = 'tfDeviceSessionTokenV1';
  const TF_LOCK_STATE_KEY = 'tfDeviceLockStateV1';
  const TF_LEGACY_STATE_KEY = 'tfLicenseState';
  const TF_PENDING_KEY = 'tfDevicePendingApprovalV1';
  const TF_POPUP_SHOWN_KEY = 'tfDeviceApprovalPopupShownV1';
  const TF_TRANSFER_KEY = 'tfDeviceApprovedTransferV1';
  const TF_APPROVAL_PAGE = chrome.runtime.getURL('device_approval.html');
  const TF_APPROVAL_NOTIFICATION_PREFIX = 'tf-device-approval-';
  let tfApprovalPollRunning = false;
  let tfApprovalDecisionRunning = false;

  function tfStorageGet(keys) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(keys, (value) => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve(value || {});
        });
      } catch (_) { resolve({}); }
    });
  }

  function tfStorageSet(value) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.set(value, () => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve();
        });
      } catch (_) { resolve(); }
    });
  }

  function tfStorageRemove(keys) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.remove(keys, () => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve();
        });
      } catch (_) { resolve(); }
    });
  }

  function tfCleanLicenseEmail(value) {
    let email = String(value || '');
    try { email = email.normalize('NFKC'); } catch (_) {}
    return email
      .replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  function tfLicenseEmailCandidates(value) {
    const cleaned = tfCleanLicenseEmail(value);
    if (!cleaned) return [];
    const at = cleaned.lastIndexOf('@');
    const domainNormalized = at > 0
      ? cleaned.slice(0, at) + '@' + cleaned.slice(at + 1).toLowerCase()
      : cleaned;
    return Array.from(new Set([cleaned, domainNormalized, cleaned.toLowerCase(), cleaned.toUpperCase()].filter(Boolean)));
  }

  function tfNormalizeLicenseToken(value) {
    let token = String(value || '');
    try { token = token.normalize('NFKC'); } catch (_) {}
    return token
      .replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
      .replace(/\s+/g, '')
      .trim();
  }

  function tfLicenseTokenCandidates(value) {
    const normalized = tfNormalizeLicenseToken(value);
    const upper = normalized.toUpperCase();
    const lower = normalized.toLowerCase();
    const compact = upper.replace(/[^A-Z0-9]/g, '');
    const candidates = [normalized, upper, lower, compact];
    if (compact.startsWith('TF') && compact.length > 2) {
      const body = compact.slice(2);
      if (body.length >= 8 && body.length % 4 === 0) {
        candidates.push('TF-' + ((body.match(/.{1,4}/g) || []).join('-')));
      }
    }
    return Array.from(new Set(candidates.filter(Boolean)));
  }

  function tfCredentialAccepted(result) {
    return Boolean(result && (
      result.valid === true ||
      result.sessionValid === true ||
      result.bound === true ||
      result.decisionApplied === true
    ));
  }

  function tfShouldRetryCredential(result) {
    if (!result || tfCredentialAccepted(result)) return false;
    const code = String(result.code || result.error || '').trim().toUpperCase();
    if (['LICENSE_EXPIRED', 'LICENSE_BLOCKED', 'LICENSE_INACTIVE', 'DEVICE_TRANSFERRED'].includes(code)) return false;
    const message = String(result.message || '').trim().toUpperCase();
    return /TOKEN|EMAIL|CREDENTIAL|LICENSE[_ -]?NOT[_ -]?FOUND|INVALID[_ -]?LICENSE|PERIKSA.*TOKEN|EMAIL.*TOKEN/.test(code + ' ' + message);
  }

  async function tfApprovalApi(path, body) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeout = setTimeout(() => { try { controller?.abort(); } catch (_) {} }, 30000);
    try {
      const response = await fetch(TF_APPROVAL_API_BASE + path, {
        method: 'POST', cache: 'no-store', redirect: 'follow',
        signal: controller ? controller.signal : undefined,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(body || {}), deviceType: 'DESKTOP', clientType: 'DESKTOP' })
      });
      const raw = await response.text();
      let result;
      try { result = JSON.parse(raw); }
      catch (_) { throw new Error('Respons server Device Lock bukan JSON yang valid.'); }
      if (!response.ok && !result.message) result.message = 'HTTP ' + response.status;
      return result;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function tfApprovalApiWithCredentialVariants(path, body) {
    const source = body && typeof body === 'object' ? { ...body } : {};
    const emailCandidates = tfLicenseEmailCandidates(source.email);
    const tokenCandidates = tfLicenseTokenCandidates(source.token);
    if (!emailCandidates.length || !tokenCandidates.length) {
      return tfApprovalApi(path, {
        ...source,
        email: tfCleanLicenseEmail(source.email),
        token: tfNormalizeLicenseToken(source.token),
        requestNonce: String(Date.now()) + '-' + Math.random().toString(36).slice(2),
        extensionId: chrome.runtime.id,
        extensionVersion: chrome.runtime.getManifest().version
      });
    }
    let lastResult = null;
    let attempt = 0;
    const totalAttempts = emailCandidates.length * tokenCandidates.length;
    for (const email of emailCandidates) {
      for (const token of tokenCandidates) {
        attempt += 1;
        const result = await tfApprovalApi(path, {
          ...source,
          email,
          token,
          requestNonce: String(Date.now()) + '-' + attempt + '-' + Math.random().toString(36).slice(2),
          extensionId: chrome.runtime.id,
          extensionVersion: chrome.runtime.getManifest().version
        });
        lastResult = result;
        if (tfCredentialAccepted(result)) {
          if (result && typeof result === 'object') {
            result.acceptedEmail = email;
            result.acceptedToken = token;
          }
          return result;
        }
        if (!tfShouldRetryCredential(result) || attempt >= totalAttempts) return result;
      }
    }
    return lastResult;
  }

  function tfNotificationCreate(id, options) {
    return new Promise((resolve) => {
      if (!chrome.notifications || !chrome.notifications.create) { resolve(''); return; }
      try {
        chrome.notifications.create(id, options, (createdId) => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve(createdId || id || '');
        });
      } catch (_) { resolve(''); }
    });
  }

  function tfNotificationClear(id) {
    return new Promise((resolve) => {
      if (!chrome.notifications || !chrome.notifications.clear) { resolve(); return; }
      try {
        chrome.notifications.clear(id, () => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve();
        });
      } catch (_) { resolve(); }
    });
  }

  async function tfSetApprovalBadge(enabled) {
    try {
      await chrome.action.setBadgeText({ text: enabled ? '!' : '' });
      if (enabled) {
        await chrome.action.setBadgeBackgroundColor({ color: '#DC2626' });
        await chrome.action.setTitle({ title: 'Permintaan perangkat baru menunggu persetujuan' });
      } else {
        await chrome.action.setTitle({ title: 'TF Scanner' });
      }
    } catch (_) {}
  }

  async function tfOpenApprovalPopup(forceFocus = true) {
    const existing = await tabsQuery({ url: [TF_APPROVAL_PAGE] });
    const tab = existing.find((item) => Number.isInteger(item.id));
    if (tab) {
      if (forceFocus && Number.isInteger(tab.windowId)) {
        try { await chrome.windows.update(tab.windowId, { focused: true }); } catch (_) {}
      }
      return tab;
    }
    try {
      return await new Promise((resolve, reject) => {
        chrome.windows.create({
          url: TF_APPROVAL_PAGE,
          type: 'popup',
          focused: Boolean(forceFocus),
          width: 450,
          height: 560
        }, (windowInfo) => {
          const error = chrome.runtime.lastError;
          if (error) { reject(new Error(error.message)); return; }
          resolve(windowInfo || null);
        });
      });
    } catch (_) {
      return null;
    }
  }

  async function tfCloseApprovalPopup() {
    const tabs = await tabsQuery({ url: [TF_APPROVAL_PAGE] });
    const windowIds = Array.from(new Set(tabs.map((tab) => tab.windowId).filter(Number.isInteger)));
    for (const windowId of windowIds) {
      try { await chrome.windows.remove(windowId); } catch (_) {}
    }
  }

  async function tfShowPendingApproval(state) {
    const requestId = String(state.requestId || '').trim().toUpperCase();
    if (!requestId) return;
    const notificationId = TF_APPROVAL_NOTIFICATION_PREFIX + requestId;
    await tfSetApprovalBadge(true);
    await tfNotificationCreate(notificationId, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icon128.png'),
      title: 'Perangkat baru meminta akses',
      message: 'Device ID: ' + String(state.deviceId || 'Perangkat tidak dikenal'),
      contextMessage: 'Pilih Izinkan hanya bila Anda mengenali aktivitas ini.',
      priority: 2,
      requireInteraction: true,
      buttons: [{ title: 'Izinkan' }, { title: 'Tolak' }]
    });

    const shown = await tfStorageGet([TF_POPUP_SHOWN_KEY]);
    if (String(shown[TF_POPUP_SHOWN_KEY] || '') !== requestId) {
      await tfStorageSet({ [TF_POPUP_SHOWN_KEY]: requestId });
      await tfOpenApprovalPopup(true);
    }
  }

  async function tfClearPendingApproval(requestId = '') {
    let normalized = String(requestId || '').trim().toUpperCase();
    if (!normalized) {
      const stored = await tfStorageGet([TF_PENDING_KEY]);
      normalized = String(stored[TF_PENDING_KEY] && stored[TF_PENDING_KEY].requestId || '').trim().toUpperCase();
    }
    if (normalized) await tfNotificationClear(TF_APPROVAL_NOTIFICATION_PREFIX + normalized);
    await tfSetApprovalBadge(false);
    await tfStorageRemove([TF_PENDING_KEY, TF_POPUP_SHOWN_KEY]);
  }

  async function tfReadDeviceCredentials() {
    const stored = await tfStorageGet([TF_CREDENTIALS_KEY, TF_SESSION_KEY]);
    const credentials = stored[TF_CREDENTIALS_KEY] || {};
    return {
      email: tfCleanLicenseEmail(credentials.email || credentials.emailOriginal || ''),
      token: tfNormalizeLicenseToken(credentials.token),
      sessionToken: String(stored[TF_SESSION_KEY] || '').trim()
    };
  }

  async function tfPollPendingApproval() {
    if (tfApprovalPollRunning) return;
    tfApprovalPollRunning = true;
    try {
      const __presenceGate = await tfStorageGet(['tfUiPresenceStateV1', 'tfLicensePresenceEndpointV1', TF_PENDING_KEY]);
      const __uiActive = Boolean(__presenceGate.tfUiPresenceStateV1 && __presenceGate.tfUiPresenceStateV1.active === true);
      const __presenceEndpoint = String(__presenceGate.tfLicensePresenceEndpointV1 || '').trim();
      const __knownPending = Boolean(__presenceGate[TF_PENDING_KEY] && __presenceGate[TF_PENDING_KEY].requestId);
      // Older Worker builds strip optional presence fields. Until a direct Apps Script
      // presence endpoint has been learned, do not perform background-only /license-check
      // while the Side Panel is closed; otherwise it would keep ONLINE_STATUS green.
      if (!__uiActive && !__presenceEndpoint && !__knownPending) return;

      const credentials = await tfReadDeviceCredentials();
      if (!credentials.email || !credentials.token || !credentials.sessionToken) {
        await tfClearPendingApproval();
        return;
      }
      const result = await tfApprovalApiWithCredentialVariants('/license-check', {
        email: credentials.email,
        token: credentials.token
      });
      if (!result || result.ok !== true || result.valid !== true) return;

      const requestId = String(result.pendingRequestId || '').trim().toUpperCase();
      const status = String(result.pendingStatus || '').trim().toUpperCase();
      const current = (await tfStorageGet([TF_PENDING_KEY]))[TF_PENDING_KEY] || {};

      if (requestId && status === 'PENDING') {
        const state = {
          requestId,
          deviceId: String(result.pendingDeviceId || 'Perangkat tidak dikenal'),
          status,
          requestedAt: String(result.pendingRequestedAt || ''),
          expiresAt: String(result.pendingExpiresAt || ''),
          detectedAt: Date.now()
        };
        await tfStorageSet({ [TF_PENDING_KEY]: state });
        await tfShowPendingApproval(state);
        return;
      }

      if (current.requestId && requestId === current.requestId && ['APPROVED', 'DECLINED', 'EXPIRED'].includes(status)) {
        await tfClearPendingApproval(current.requestId);
      }
    } catch (_) {
      // Kegagalan jaringan tidak menghapus pending lokal agar notifikasi tidak hilang palsu.
    } finally {
      try {
        const __presenceState = await tfStorageGet(['tfUiPresenceStateV1', 'tfLicensePresenceEndpointV1']);
        const __activeNow = Boolean(__presenceState.tfUiPresenceStateV1 && __presenceState.tfUiPresenceStateV1.active === true);
        if (!__activeNow && String(__presenceState.tfLicensePresenceEndpointV1 || '').trim()) {
          // A background approval lookup is validation, not UI presence. Put the row
          // back to OFFLINE immediately after the Worker lookup.
          try { bg_sendUiPresenceEventBestEffort(false, 'BACKGROUND_VALIDATION'); } catch (_) {}
        }
      } catch (_) {}
      tfApprovalPollRunning = false;
    }
  }

  async function tfDecidePendingApproval(decision, ownerTabId = null) {
    if (tfApprovalDecisionRunning) {
      return { ok: false, message: 'Keputusan perangkat sedang diproses.' };
    }
    tfApprovalDecisionRunning = true;
    try {
      const stored = await tfStorageGet([TF_PENDING_KEY]);
      const pending = stored[TF_PENDING_KEY] || {};
      const pendingRequestId = String(pending.requestId || '').trim().toUpperCase();
      if (!pendingRequestId) return { ok: false, message: 'Tidak ada permintaan perangkat aktif.' };

      const credentials = await tfReadDeviceCredentials();
      if (!credentials.email || !credentials.token || !credentials.sessionToken) {
        return { ok: false, message: 'Session perangkat utama tidak tersedia.' };
      }

      const sessionChallenge = await tfApprovalApiWithCredentialVariants('/session-challenge', credentials);
      if (!sessionChallenge || sessionChallenge.ok !== true || sessionChallenge.sessionValid !== true) {
        return { ok: false, message: String(sessionChallenge && (sessionChallenge.message || sessionChallenge.code) || 'Session perangkat utama tidak valid.') };
      }

      const proof = await requestProof(sessionChallenge.challenge, ownerTabId);
      const deviceInfo = proof && proof.deviceInfo || {};
      const signatureInfo = proof && proof.signatureInfo || {};
      const result = await tfApprovalApiWithCredentialVariants('/device-request-decision', {
        email: credentials.email,
        token: credentials.token,
        sessionToken: credentials.sessionToken,
        requestId: sessionChallenge.requestId,
        pendingRequestId,
        decision: String(decision || '').trim().toUpperCase(),
        challenge: sessionChallenge.challenge,
        publicKeySpki: deviceInfo.publicKeySpki,
        signatureBase64: signatureInfo.signatureBase64
      });

      if (!result || result.ok !== true || result.decisionApplied !== true) {
        return { ok: false, message: String(result && (result.message || result.code) || 'Keputusan tidak dapat diterapkan.'), result };
      }

      await tfClearPendingApproval(pendingRequestId);
      if (String(decision || '').trim().toUpperCase() === 'APPROVE') {
        await tfStorageSet({
          [TF_TRANSFER_KEY]: {
            requestId: pendingRequestId,
            approvedAt: Date.now()
          }
        });
        try { chrome.alarms.create(TF_TRANSFER_ALARM, { periodInMinutes: 0.5 }); } catch (_) {}
      } else {
        await tfStorageRemove([TF_TRANSFER_KEY]);
      }

      await tfNotificationCreate('tf-device-approval-result', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon128.png'),
        title: String(decision).toUpperCase() === 'APPROVE' ? 'Akses perangkat diizinkan' : 'Permintaan perangkat ditolak',
        message: String(decision).toUpperCase() === 'APPROVE'
          ? 'Menunggu perangkat baru menyelesaikan binding. Session lama akan dicabut otomatis.'
          : 'Perangkat baru tidak memperoleh akses.',
        priority: 1
      });
      return { ok: true, result };
    } catch (error) {
      return { ok: false, message: error && error.message ? error.message : String(error) };
    } finally {
      tfApprovalDecisionRunning = false;
    }
  }

  async function tfRevokeTransferredSession() {
    const now = Date.now();
    await tfStorageRemove([TF_SESSION_KEY, TF_LOCK_STATE_KEY, TF_TRANSFER_KEY]);
    await tfStorageSet({
      [TF_LEGACY_STATE_KEY]: {
        valid: false,
        success: false,
        code: 'DEVICE_TRANSFERRED',
        message: 'Lisensi telah dipindahkan ke perangkat lain.',
        checkedAt: now,
        serverVerified: true
      }
    });
    try { chrome.alarms.clear(TF_TRANSFER_ALARM); } catch (_) {}
    try {
      chrome.runtime.sendMessage({
        type: 'TF_DEVICE_SESSION_REVOKED',
        code: 'DEVICE_TRANSFERRED',
        message: 'Lisensi telah dipindahkan ke perangkat lain.'
      }, () => { try { void chrome.runtime.lastError; } catch (_) {} });
    } catch (_) {}
    await tfNotificationCreate('tf-device-transfer-complete', {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icon128.png'),
      title: 'Lisensi dipindahkan',
      message: 'Perangkat baru sudah aktif. Session perangkat ini telah dicabut.',
      priority: 2
    });
  }

  async function tfWatchApprovedTransfer() {
    const stored = await tfStorageGet([TF_TRANSFER_KEY]);
    const transfer = stored[TF_TRANSFER_KEY] || {};
    const transferRequestId = String(transfer.requestId || '').trim().toUpperCase();
    if (!transferRequestId) {
      try { chrome.alarms.clear(TF_TRANSFER_ALARM); } catch (_) {}
      return;
    }
    if (Date.now() - Number(transfer.approvedAt || 0) > 20 * 60 * 1000) {
      await tfStorageRemove([TF_TRANSFER_KEY]);
      try { chrome.alarms.clear(TF_TRANSFER_ALARM); } catch (_) {}
      return;
    }
    try {
      const credentials = await tfReadDeviceCredentials();
      if (!credentials.email || !credentials.token) return;
      const result = await tfApprovalApiWithCredentialVariants('/license-check', {
        email: credentials.email,
        token: credentials.token
      });
      if (!result || result.ok !== true || result.valid !== true) return;
      const requestId = String(result.pendingRequestId || '').trim().toUpperCase();
      const status = String(result.pendingStatus || '').trim().toUpperCase();
      if (!requestId || requestId !== transferRequestId) {
        await tfRevokeTransferredSession();
      } else if (status === 'DECLINED') {
        await tfStorageRemove([TF_TRANSFER_KEY]);
        try { chrome.alarms.clear(TF_TRANSFER_ALARM); } catch (_) {}
      }
    } catch (_) {}
  }

  function tfEnsureApprovalAlarms() {
    try { chrome.alarms.create(TF_APPROVAL_ALARM, { periodInMinutes: 0.5 }); } catch (_) {}
    void tfPollPendingApproval();
  }

  if (chrome.alarms && chrome.alarms.onAlarm) {
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (!alarm) return;
      if (alarm.name === TF_APPROVAL_ALARM) void tfPollPendingApproval();
      if (alarm.name === TF_TRANSFER_ALARM) void tfWatchApprovedTransfer();
    });
  }

  chrome.runtime.onInstalled.addListener(() => { tfEnsureApprovalAlarms(); });
  chrome.runtime.onStartup.addListener(() => { tfEnsureApprovalAlarms(); });

  if (chrome.notifications && chrome.notifications.onButtonClicked) {
    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      if (!String(notificationId || '').startsWith(TF_APPROVAL_NOTIFICATION_PREFIX)) return;
      void tfDecidePendingApproval(buttonIndex === 0 ? 'APPROVE' : 'DECLINE');
    });
  }

  if (chrome.notifications && chrome.notifications.onClicked) {
    chrome.notifications.onClicked.addListener((notificationId) => {
      if (String(notificationId || '').startsWith(TF_APPROVAL_NOTIFICATION_PREFIX)) {
        void tfOpenApprovalPopup(true);
      }
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message) return undefined;
    if (message.type === 'TF_DEVICE_APPROVAL_GET_STATE') {
      tfStorageGet([TF_PENDING_KEY]).then((stored) => {
        const state = stored[TF_PENDING_KEY] || null;
        sendResponse({ ok: Boolean(state && state.requestId), state, message: state ? '' : 'Tidak ada permintaan perangkat aktif.' });
      });
      return true;
    }
    if (message.type === 'TF_DEVICE_APPROVAL_DECIDE') {
      const ownerTabId = sender && sender.tab && Number.isInteger(sender.tab.id) ? sender.tab.id : null;
      tfDecidePendingApproval(message.decision, ownerTabId).then(sendResponse);
      return true;
    }
    if (message.type === 'TF_DEVICE_APPROVAL_OPEN') {
      tfOpenApprovalPopup(true).then(() => sendResponse({ ok: true }));
      return true;
    }
    return undefined;
  });

  tfEnsureApprovalAlarms();
  void tfWatchApprovedTransfer();

})();

// ============================================================================
// REV279 — Sticky offscreen Remote Core (Windows + macOS, no native EXE)
// Offscreen document owns WebSocket + WebRTC. The MV3 service worker may sleep
// without tearing down the Remote transport. Service worker only authenticates,
// forwards executor state, and bridges messages to the sidebar.
// ============================================================================
(() => {
  'use strict';
  const API='https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDS_KEY='tfLicenseCredentials',SESSION_KEY='tfDeviceSessionTokenV1',STATE_KEY='tfDeviceLockStateV1';
  const OFFSCREEN='remote_offscreen.html';
  const FAST_TICKET_CACHE_KEY='tfRemoteDesktopFastTicketV279';
  const REMOTE_ENABLED_KEY='tfRemoteAlwaysOnlineV276';
  const REMOTE_WATCHDOG_ALARM='tfRemoteWatchdogV278';
  const REMOTE_LICENSE_SAFETY_ALARM='tfRemoteLicenseSafetyV367';
  const REMOTE_LICENSE_EXPIRY_ALARM='tfRemoteLicenseExpiryV367';
  let remoteEnabled=false,remoteEnabledLoaded=false,executorSeenAt=0,executorReadySticky=false,lastMobileOnline=false,lastMobileRemoteOnline=false;
  let wsReady=false,directReady=false,directMode='connecting',directRtt=0,connectionState='idle',lastError='';
  let configuring=false,iceServersCache=null,iceAt=0;
  const remoteSessionId='desk-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
  const EXECUTOR_GRACE_MS=90000;
  let offscreenCreating=null;

  function storageGet(keys){return new Promise(resolve=>{try{chrome.storage.local.get(keys,r=>{try{void chrome.runtime.lastError;}catch(_){}resolve(r||{});});}catch(_){resolve({});}});}
  function storageSet(obj){return new Promise(resolve=>{try{chrome.storage.local.set(obj,()=>{try{void chrome.runtime.lastError;}catch(_){}resolve();});}catch(_){resolve();}});}
  function storageRemove(keys){return new Promise(resolve=>{try{chrome.storage.local.remove(keys,()=>{try{void chrome.runtime.lastError;}catch(_){}resolve();});}catch(_){resolve();}});}
  function broadcast(message){try{chrome.runtime.sendMessage(message,()=>{try{void chrome.runtime.lastError;}catch(_){} });}catch(_){} }
  function executorOnline(){return remoteEnabled&&(executorReadySticky||(executorSeenAt>0&&Date.now()-executorSeenAt<EXECUTOR_GRACE_MS));}
  function status(){broadcast({type:'TF_REMOTE_CORE_STATUS',remoteEnabled,wsReady:remoteEnabled&&wsReady,directReady:remoteEnabled&&directReady,directMode:remoteEnabled?directMode:'off',directRtt:remoteEnabled?directRtt:0,mobileOnline:remoteEnabled&&lastMobileOnline,mobileRemoteOnline:remoteEnabled&&lastMobileRemoteOnline,executorOnline:executorOnline(),connectionState:remoteEnabled?connectionState:'off',lastError:remoteEnabled?lastError:'',revision:'REV279',at:Date.now()});}
  async function loadRemoteEnabled(){if(remoteEnabledLoaded)return remoteEnabled;const st=await storageGet([REMOTE_ENABLED_KEY]);remoteEnabled=st[REMOTE_ENABLED_KEY]===true;remoteEnabledLoaded=true;return remoteEnabled;}
  async function auth(){const st=await storageGet([CREDS_KEY,SESSION_KEY,STATE_KEY]),c=st[CREDS_KEY]||{},s=st[STATE_KEY]||{},sessionToken=String(st[SESSION_KEY]||'').trim();if(!c.email||!c.token||!sessionToken||s.valid!==true)return null;return {email:c.email,token:c.token,licenseId:s.licenseId||s.license||'',sessionToken};}
  async function post(path,body,timeout=9000){const a=await auth();if(!a){const e=new Error('Desktop session belum tersedia.');e.code='AUTH_MISSING';throw e;}const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),timeout);try{const r=await fetch(API+path,{method:'POST',cache:'no-store',signal:ctl.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({...a,...body,deviceType:'DESKTOP',clientType:'DESKTOP',extensionId:chrome.runtime.id,remoteRevision:'REV279-STICKY-SESSION'})});const x=await r.json();if(!r.ok||x.valid===false){const e=new Error(x.message||x.code||('HTTP '+r.status));e.code=x.code||'HTTP_ERROR';throw e;}return x;}finally{clearTimeout(tm);}}
  async function getFastTicket(force=false){if(!force){const st=await storageGet([FAST_TICKET_CACHE_KEY]),c=st[FAST_TICKET_CACHE_KEY]||{};if(c.ticket&&Number(c.expiresAt||0)>Date.now()+30000)return {...c,fromCache:true};}const x=await post('/remote/fast-ticket',{},6500);if(x&&x.fastAvailable===true&&x.ticket){const c={ticket:x.ticket,expiresAt:Number(x.expiresAt||0),savedAt:Date.now()};await storageSet({[FAST_TICKET_CACHE_KEY]:c});return {...x,...c,fromCache:false};}return x;}
  async function iceConfig(force=false){if(!force&&iceServersCache&&Date.now()-iceAt<4*60*60*1000)return iceServersCache;try{const x=await post('/remote/ice-config',{},7000);if(x&&Array.isArray(x.iceServers)&&x.iceServers.length){iceServersCache=x.iceServers;iceAt=Date.now();return iceServersCache;}}catch(_){}iceServersCache=[{urls:['stun:stun.cloudflare.com:3478','stun:stun.l.google.com:19302']}];iceAt=Date.now();return iceServersCache;}
  async function ensureOffscreen(){
    if(!chrome.offscreen||!chrome.offscreen.createDocument)return false;
    try{if(chrome.runtime.getContexts){const contexts=await chrome.runtime.getContexts({contextTypes:['OFFSCREEN_DOCUMENT'],documentUrls:[chrome.runtime.getURL(OFFSCREEN)]});if(contexts&&contexts.length)return true;}}catch(_){}
    if(offscreenCreating)return await offscreenCreating;
    offscreenCreating=(async()=>{try{await chrome.offscreen.createDocument({url:OFFSCREEN,reasons:['WEB_RTC'],justification:'Persistent WebSocket and optional WebRTC transport for TF Analyzer Mobile Remote'});return true;}catch(e){return /single offscreen|already exists/i.test(String(e&&e.message||e));}finally{offscreenCreating=null;}})();
    return await offscreenCreating;
  }
  function offscreenSend(type,payload={}){return new Promise(resolve=>{try{chrome.runtime.sendMessage({type,...payload},r=>{try{void chrome.runtime.lastError;}catch(_){}resolve(r||{ok:false});});}catch(_){resolve({ok:false});}});}
  function watchdog(on){
    try{
      if(on){
        chrome.alarms.create(REMOTE_WATCHDOG_ALARM,{periodInMinutes:0.5});
        chrome.alarms.create(REMOTE_LICENSE_SAFETY_ALARM,{periodInMinutes:1});
      }else{
        chrome.alarms.clear(REMOTE_WATCHDOG_ALARM);
        chrome.alarms.clear(REMOTE_LICENSE_SAFETY_ALARM);
        chrome.alarms.clear(REMOTE_LICENSE_EXPIRY_ALARM);
      }
    }catch(_){}
  }

  function licenseExpiryMsV367(value){
    if(!value||value.isPermanent===true)return 0;
    const raw=value.expiresAt;
    const n=typeof raw==='number'?raw:Date.parse(String(raw||''));
    return Number.isFinite(n)&&n>0?n:0;
  }
  async function armLocalLicenseExpiryV367(value){
    const exp=licenseExpiryMsV367(value);
    try{chrome.alarms.clear(REMOTE_LICENSE_EXPIRY_ALARM);}catch(_){}
    if(!exp)return;
    if(exp<=Date.now()){await invalidateRemoteLicenseV367({code:'LICENSE_EXPIRED',message:'Masa berlaku lisensi telah berakhir.',expiresAt:value&&value.expiresAt});return;}
    try{chrome.alarms.create(REMOTE_LICENSE_EXPIRY_ALARM,{when:exp});}catch(_){}
  }
  function terminalLicenseCodeV367(code){
    return ['LICENSE_EXPIRED','LICENSE_BLOCKED','LICENSE_INACTIVE','LICENSE_REVOKED','LICENSE_DELETED','LICENSE_NOT_FOUND','INVALID_TOKEN','TOKEN_INVALID','INVALID_LICENSE','LICENSE_DISABLED','ACCOUNT_BLOCKED','ACCOUNT_INACTIVE'].includes(String(code||'').trim().toUpperCase());
  }
  async function invalidateRemoteLicenseV367(result){
    const code=String(result&& (result.code||result.error) ||'LICENSE_REVOKED').trim().toUpperCase()||'LICENSE_REVOKED';
    const message=String(result&&result.message||'Lisensi tidak valid lagi.').trim();
    const st=await storageGet([STATE_KEY]);
    const prev=st[STATE_KEY]||{};
    await storageSet({
      [STATE_KEY]:{...prev,valid:false,success:false,code,message,expiresAt:result&&result.expiresAt||prev.expiresAt||'',checkedAt:Date.now()},
      [REMOTE_ENABLED_KEY]:false
    });
    await storageRemove([SESSION_KEY,FAST_TICKET_CACHE_KEY]);
    remoteEnabled=false;remoteEnabledLoaded=true;wsReady=false;directReady=false;directMode='off';connectionState='license_invalid';lastError=message;
    watchdog(false);
    try{await offscreenSend('TF_REMOTE_OFFSCREEN_WS_DISABLE');}catch(_){}
    broadcast({type:'TF_LICENSE_REMOTE_INVALID',valid:false,code,message,expiresAt:result&&result.expiresAt||'',at:Date.now()});
    status();
  }
  async function runRemoteLicenseSafetyCheckV367(){
    if(!await loadRemoteEnabled())return;
    const stored=await storageGet([CREDS_KEY,STATE_KEY,SESSION_KEY]);
    const c=stored[CREDS_KEY]||{},prev=stored[STATE_KEY]||{};
    if(!c.email||!c.token)return;
    const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),8000);
    try{
      const r=await fetch(API+'/license-check',{method:'POST',cache:'no-store',signal:ctl.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({email:c.email,token:c.token,licenseId:prev.licenseId||prev.license||'',deviceType:'DESKTOP',clientType:'DESKTOP',extensionId:chrome.runtime.id,remoteRevision:'REV367-LOW-USAGE'})});
      let x=null;try{x=await r.json();}catch(_){}
      if(!x||typeof x!=='object')return;
      if(x.valid!==true){if(terminalLicenseCodeV367(x.code||x.error)||r.status===401||r.status===403)await invalidateRemoteLicenseV367(x);return;}
      const nextExp=x.expiresAt||prev.expiresAt||'';
      const oldExp=String(prev.expiresAt||'');
      const nextState={...prev,...x,valid:true,success:true,licenseId:x.licenseId||prev.licenseId||prev.license||'',expiresAt:nextExp,checkedAt:Date.now()};
      await storageSet({[STATE_KEY]:nextState});
      await armLocalLicenseExpiryV367(nextState);
      if(String(nextExp)!==oldExp){await storageRemove([FAST_TICKET_CACHE_KEY]);if(remoteEnabled&&!configuring)void configureOffscreen(true);}
    }catch(_){
      // Network/server transport failure is not a revocation. Keep realtime state and retry next minute.
    }finally{clearTimeout(tm);}
  }
  async function armExpiryFromStoredStateV367(){const st=await storageGet([STATE_KEY]);await armLocalLicenseExpiryV367(st[STATE_KEY]||{});} 

  async function configureOffscreen(forceTicket=false){
    if(configuring||!remoteEnabled)return;configuring=true;connectionState='ticket';lastError='';status();
    try{
      if(!await ensureOffscreen())throw new Error('Offscreen Remote Core gagal dibuat.');
      const [ticket,ice]=await Promise.all([getFastTicket(forceTicket),iceConfig(false)]);
      if(!ticket||ticket.fastAvailable!==true||!ticket.ticket)throw new Error('Fast Lane belum tersedia.');
      const url=API.replace(/^https:/i,'wss:').replace(/^http:/i,'ws:')+'/remote/fast-ws?ticket='+encodeURIComponent(ticket.ticket);
      connectionState='connecting';status();
      await offscreenSend('TF_REMOTE_OFFSCREEN_WS_CONNECT',{url,sessionId:remoteSessionId,enabled:true,iceServers:ice,forceReplace:forceTicket===true});
      // Do not publish a synthetic false just because the MV3 worker restarted.
      // The offscreen core preserves executor state across that restart.
      if(executorReadySticky||(executorSeenAt>0&&Date.now()-executorSeenAt<EXECUTOR_GRACE_MS))await offscreenSend('TF_REMOTE_OFFSCREEN_EXECUTOR_STATE',{ready:true});
    }catch(e){
      connectionState=e&&e.code==='AUTH_MISSING'?'auth_missing':'ticket_failed';lastError=String(e&&e.message||e);
      if(forceTicket===false)await storageRemove([FAST_TICKET_CACHE_KEY]);status();
    }finally{configuring=false;}
  }

  async function applyRemoteAvailability(enabled,persist=true){
    remoteEnabled=enabled===true;remoteEnabledLoaded=true;if(persist)await storageSet({[REMOTE_ENABLED_KEY]:remoteEnabled});
    if(remoteEnabled){watchdog(true);connectionState='starting';lastError='';status();await armExpiryFromStoredStateV367();await ensureOffscreen();void configureOffscreen(false);void runRemoteLicenseSafetyCheckV367();}
    else{watchdog(false);wsReady=false;directReady=false;directMode='off';directRtt=0;executorReadySticky=false;connectionState='off';lastError='';await offscreenSend('TF_REMOTE_OFFSCREEN_WS_DISABLE');status();}
    return remoteEnabled;
  }
  async function initialize(){await loadRemoteEnabled();if(remoteEnabled){watchdog(true);await armExpiryFromStoredStateV367();await ensureOffscreen();void configureOffscreen(false);void runRemoteLicenseSafetyCheckV367();}else status();}

  function handleWsInbound(msg){
    if(!msg||typeof msg!=='object'||!remoteEnabled)return;
    if(msg.type==='license_event'&&msg.valid===false){void invalidateRemoteLicenseV367(msg);return;}
    if(msg.type==='presence'){lastMobileOnline=!!msg.mobileOnline;lastMobileRemoteOnline=Object.prototype.hasOwnProperty.call(msg,'mobileRemoteOnline')?!!msg.mobileRemoteOnline:!!msg.mobileOnline;broadcast({type:'TF_REMOTE_CORE_INBOUND',route:'ws',message:msg});status();return;}
    if(msg.type==='command'){
      if(!executorOnline()){const id=String(msg.clientCommandId||'');void offscreenSend('TF_REMOTE_OFFSCREEN_WS_SEND',{message:{type:'command_started',clientCommandId:id,action:String(msg.action||''),startedAt:Date.now()}});void offscreenSend('TF_REMOTE_OFFSCREEN_WS_SEND',{message:{type:'command_result',clientCommandId:id,result:{ok:false,code:'REMOTE_SIDEBAR_EXECUTOR_OFFLINE',message:'Remote transport aktif, tetapi sidebar TF belum terbuka untuk mengeksekusi command.'},finishedAt:Date.now()}});return;}
      broadcast({type:'TF_REMOTE_CORE_INBOUND',route:'ws',message:msg});return;
    }
    if(msg.type==='snapshot_request'){broadcast({type:'TF_REMOTE_CORE_INBOUND',route:'ws',message:msg});return;}
    broadcast({type:'TF_REMOTE_CORE_INBOUND',route:'ws',message:msg});
  }

  chrome.runtime.onMessage.addListener((m,sender,sendResponse)=>{
    if(!m||typeof m!=='object')return;
    if(m.type==='TF_REMOTE_EXECUTOR_LIVE'||m.type==='TF_REMOTE_EXECUTOR_HEARTBEAT'){
      executorSeenAt=Date.now();executorReadySticky=true;if(remoteEnabled){void ensureOffscreen().then(()=>offscreenSend('TF_REMOTE_OFFSCREEN_EXECUTOR_STATE',{ready:true}));if(!wsReady&&!configuring)void configureOffscreen(false);}sendResponse&&sendResponse({ok:true,remoteEnabled,wsReady:remoteEnabled&&wsReady});return true;
    }
    if(m.type==='TF_REMOTE_EXECUTOR_GONE'){executorSeenAt=0;executorReadySticky=false;if(remoteEnabled)void offscreenSend('TF_REMOTE_OFFSCREEN_EXECUTOR_STATE',{ready:false});status();sendResponse&&sendResponse({ok:true});return true;}
    if(m.type==='TF_REMOTE_AVAILABILITY_GET'){sendResponse&&sendResponse({ok:true,enabled:remoteEnabled,wsReady:remoteEnabled&&wsReady,directReady:remoteEnabled&&directReady,connectionState,lastError});return true;}
    if(m.type==='TF_REMOTE_AVAILABILITY_SET'){void applyRemoteAvailability(m.enabled===true,true).then(enabled=>sendResponse&&sendResponse({ok:true,enabled,wsReady:enabled&&wsReady,directReady:enabled&&directReady,connectionState,lastError}));return true;}
    if(m.type==='TF_REMOTE_CORE_STATUS_QUERY'){sendResponse&&sendResponse({ok:true,remoteEnabled,wsReady:remoteEnabled&&wsReady,directReady:remoteEnabled&&directReady,directMode:remoteEnabled?directMode:'off',directRtt:remoteEnabled?directRtt:0,mobileOnline:remoteEnabled&&lastMobileOnline,mobileRemoteOnline:remoteEnabled&&lastMobileRemoteOnline,executorOnline:executorOnline(),connectionState,lastError,revision:'REV279'});return true;}
    if(m.type==='TF_REMOTE_CORE_RECONNECT'){if(!remoteEnabled){sendResponse&&sendResponse({ok:false,code:'REMOTE_DISABLED'});return true;}wsReady=false;connectionState='reconnecting';void storageRemove([FAST_TICKET_CACHE_KEY]).then(()=>configureOffscreen(true));sendResponse&&sendResponse({ok:true});return true;}
    if(m.type==='TF_REMOTE_CORE_SEND'){
      if(!remoteEnabled){sendResponse&&sendResponse({ok:false,code:'REMOTE_DISABLED'});return true;}const route=String(m.route||'ws'),message=m.message||{};
      if(route==='direct'){offscreenSend('TF_REMOTE_OFFSCREEN_SEND',{message}).then(r=>sendResponse&&sendResponse(r));return true;}
      offscreenSend('TF_REMOTE_OFFSCREEN_WS_SEND',{message}).then(r=>sendResponse&&sendResponse(r));return true;
    }
    if(m.type==='TF_REMOTE_OFFSCREEN_WS_INBOUND'){handleWsInbound(m.message);sendResponse&&sendResponse({ok:true});return true;}
    if(m.type==='TF_REMOTE_OFFSCREEN_INBOUND'){
      if(!remoteEnabled){sendResponse&&sendResponse({ok:false,code:'REMOTE_DISABLED'});return true;}const msg=m.message&&typeof m.message==='object'?m.message:null;
      if(msg){if(msg.type==='command'&&!executorOnline()){const id=String(msg.clientCommandId||'');void offscreenSend('TF_REMOTE_OFFSCREEN_SEND',{message:{type:'command_started',clientCommandId:id,action:String(msg.action||''),startedAt:Date.now()}});void offscreenSend('TF_REMOTE_OFFSCREEN_SEND',{message:{type:'command_result',clientCommandId:id,result:{ok:false,code:'REMOTE_SIDEBAR_EXECUTOR_OFFLINE',message:'Direct channel aktif, tetapi sidebar TF belum terbuka.'},finishedAt:Date.now()}});}else broadcast({type:'TF_REMOTE_CORE_INBOUND',route:'direct',message:msg});}sendResponse&&sendResponse({ok:true});return true;
    }
    if(m.type==='TF_REMOTE_OFFSCREEN_CORE_STATUS'){
      // Adopt the running offscreen session before async storage hydration on a
      // cold MV3 restart. This prevents a false OFF packet every time Chrome
      // suspends and wakes the service worker.
      if(!remoteEnabledLoaded&&m.remoteEnabled===true)remoteEnabled=true;
      if(m.executorOnline===true)executorReadySticky=true;
      else if(m.remoteEnabled===false||remoteEnabledLoaded===true)executorReadySticky=false;
      wsReady=remoteEnabled&&m.wsReady===true;directReady=remoteEnabled&&m.directReady===true;directMode=String(m.directMode||(directReady?'p2p':'connecting'));directRtt=Number(m.directRtt||0);lastMobileOnline=!!m.mobileOnline;lastMobileRemoteOnline=!!m.mobileRemoteOnline;connectionState=wsReady?'online':(remoteEnabled?'connecting':'off');if(wsReady)lastError='';status();sendResponse&&sendResponse({ok:true});return true;
    }
    if(m.type==='TF_REMOTE_OFFSCREEN_STATUS'){directReady=remoteEnabled&&m.ready===true;directMode=String(m.mode||'connecting');directRtt=Number(m.rtt||0);status();sendResponse&&sendResponse({ok:true});return true;}
    if(m.type==='TF_REMOTE_OFFSCREEN_NEED_TICKET'){if(remoteEnabled&&!configuring){wsReady=false;connectionState='reconnecting';status();void configureOffscreen(m.force===true);}sendResponse&&sendResponse({ok:true});return true;}
    // Compatibility route; normally rtc_signal is sent directly by offscreen WebSocket.
    if(m.type==='TF_REMOTE_OFFSCREEN_SIGNAL_OUT'){if(!remoteEnabled){sendResponse&&sendResponse({ok:false,code:'REMOTE_DISABLED'});return true;}offscreenSend('TF_REMOTE_OFFSCREEN_WS_SEND',{message:{type:'rtc_signal',signal:m.signal||{},at:Date.now()}}).then(r=>sendResponse&&sendResponse(r));return true;}
  });

  function remoteAuthIdentityChanged(changes){
    const c=changes&&changes[CREDS_KEY];
    if(c){
      const o=c.oldValue&&typeof c.oldValue==='object'?c.oldValue:{},n=c.newValue&&typeof c.newValue==='object'?c.newValue:{};
      const oe=String(o.emailCanonical||o.email||'').trim().toLowerCase(),ne=String(n.emailCanonical||n.email||'').trim().toLowerCase();
      const ot=String(o.token||'').trim(),nt=String(n.token||'').trim();
      if(oe!==ne||ot!==nt)return true;
    }
    const ss=changes&&changes[SESSION_KEY];
    if(ss&&String(ss.oldValue||'').trim()!==String(ss.newValue||'').trim())return true;
    const st=changes&&changes[STATE_KEY];
    if(st){
      const o=st.oldValue&&typeof st.oldValue==='object'?st.oldValue:{},n=st.newValue&&typeof st.newValue==='object'?st.newValue:{};
      const ov=o.valid===true,nv=n.valid===true;
      const ol=String(o.licenseId||o.license||'').trim(),nl=String(n.licenseId||n.license||'').trim();
      if(ov!==nv||ol!==nl)return true;
    }
    return false;
  }
  try{chrome.storage.onChanged.addListener((changes,area)=>{
    if(area!=='local')return;
    if(changes&&changes[REMOTE_ENABLED_KEY]){remoteEnabled=changes[REMOTE_ENABLED_KEY].newValue===true;remoteEnabledLoaded=true;void applyRemoteAvailability(remoteEnabled,false);return;}
    // REV355: Device Lock refreshes checkedAt/lastValidatedAt and plan metadata
    // while the identity itself is unchanged. Those writes must NEVER restart
    // the persistent Remote WebSocket. Reconnect only when actual auth identity
    // (email/token/session/license validity/license id) changes.
    if(remoteAuthIdentityChanged(changes)){
      if(!remoteEnabled)return;
      connectionState='auth_changed';lastError='';
      void storageRemove([FAST_TICKET_CACHE_KEY]).then(()=>configureOffscreen(true));
    }
  });}catch(_){}
  try{if(chrome.alarms&&chrome.alarms.onAlarm)chrome.alarms.onAlarm.addListener(alarm=>{
    if(!alarm)return;
    if(alarm.name===REMOTE_WATCHDOG_ALARM){void loadRemoteEnabled().then(enabled=>{if(enabled){void ensureOffscreen().then(()=>offscreenSend('TF_REMOTE_OFFSCREEN_STATUS_QUERY').then(s=>{if(!s||s.wsReady!==true)void configureOffscreen(false);}));}});return;}
    if(alarm.name===REMOTE_LICENSE_SAFETY_ALARM){void runRemoteLicenseSafetyCheckV367();return;}
    if(alarm.name===REMOTE_LICENSE_EXPIRY_ALARM){void invalidateRemoteLicenseV367({code:'LICENSE_EXPIRED',message:'Masa berlaku lisensi telah berakhir.'});return;}
  });}catch(_){}
  try{chrome.runtime.onStartup.addListener(()=>{void initialize();});}catch(_){}
  try{chrome.runtime.onInstalled.addListener(()=>setTimeout(()=>{void initialize();},120));}catch(_){}
  void initialize();
})();
