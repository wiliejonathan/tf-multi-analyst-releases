(() => {
  'use strict';

  const STATE_KEY = 'tfGithubUpdateStateV1';
  const PREFS_KEY = 'tfGithubUpdatePrefsV1';
  const BLOCK_CLASS = 'tf-github-update-block';
  let lastSignature = '';
  let manualCheckRunning = false;

  function send(type, extra = {}) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ type, ...extra }, (response) => {
          try { void chrome.runtime.lastError; } catch (_) {}
          resolve(response || { ok: false });
        });
      } catch (_) {
        resolve({ ok: false });
      }
    });
  }

  function currentVersion() {
    try {
      const manifest = chrome.runtime.getManifest();
      const value = String(manifest.version || '').trim();
      return value ? `v${value}` : '';
    } catch (_) {
      return '';
    }
  }

  function currentRevision() {
    try {
      const manifest = chrome.runtime.getManifest();
      const source = `${manifest.version_name || ''} ${manifest.description || ''}`;
      const match = source.match(/REV\s*(\d+)/i);
      return match ? Number(match[1]) || 0 : 0;
    } catch (_) {
      return 0;
    }
  }

  function ensureStyle() {
    if (document.getElementById('tf-github-update-style')) return;
    const style = document.createElement('style');
    style.id = 'tf-github-update-style';
    style.textContent = `
      .${BLOCK_CLASS}{margin-top:7.2px;padding:7.2px 9px;border:1px solid rgba(56,189,248,.28);border-radius:9px;background:rgba(2,132,199,.08);font-size:9.9px;line-height:1.45;color:#cbd5e1;box-sizing:border-box;min-height:30.6px;min-width:0;max-width:100%}
      .tf-update-purchase-stack{display:flex;flex:0 0 auto;flex-direction:column;align-items:flex-end;gap:3.6px;min-width:0;max-width:351px;text-align:right}
      .${BLOCK_CLASS}.tf-update-purchase{margin:0;max-width:351px;min-height:0;text-align:right}
      .tf-update-purchase-stack .license-status-sync{max-width:351px}
      .${BLOCK_CLASS}[data-tf-update-kind="profile"]{margin:0 0 5.4px 0;padding:0;border:0;border-radius:0;background:transparent;min-height:0;width:100%;max-width:none;font-size:9.9px;line-height:1.4;color:#cbd5e1}
      .${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-line{display:flex;align-items:center;gap:5.4px;flex-wrap:wrap;min-width:0}
      .${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-version,.${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-ok,.${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-wait,.${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-error,.${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-popup-off{min-width:0;white-space:normal;overflow-wrap:anywhere}
      .tf-update-line{display:flex;align-items:center;gap:5.4px;flex-wrap:wrap;min-width:0}
      .tf-update-version{font-weight:700;color:#e2e8f0}
      .tf-update-ok{color:#86efac}
      .tf-update-wait{color:#fde68a}
      .tf-update-error{color:#fca5a5}
      .tf-update-link{appearance:none;border:0;background:none;padding:0;margin:0;color:#38bdf8;text-decoration:underline;cursor:pointer;font:inherit;font-weight:700}
      .tf-update-link:hover{color:#7dd3fc}
      .tf-update-link:disabled{opacity:.7;cursor:wait;color:#94a3b8}
      .tf-update-check-line{display:flex;align-items:center;gap:5.4px;margin-top:3.6px;min-width:0}
      .${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-check-line{margin-top:1px;gap:3.6px;font-size:8.1px;line-height:1.05;opacity:.78}
      .${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-check-line .tf-update-link{font-size:8.1px;font-weight:500;line-height:1.05}
      .${BLOCK_CLASS}[data-tf-update-kind="profile"] .tf-update-check-line .tf-update-mini-spinner{width:7.2px;height:7.2px;border-width:1.35px}
      .tf-update-mini-spinner{width:9px;height:9px;border:2px solid rgba(148,163,184,.35);border-top-color:#38bdf8;border-radius:50%;display:inline-block;box-sizing:border-box;animation:tfUpdateSpin .75s linear infinite}
      @keyframes tfUpdateSpin{to{transform:rotate(360deg)}}
      .tf-update-dot{opacity:.6}
      .tf-update-popup-off{color:#fbbf24}
      @media (max-width:684px){.tf-update-purchase-stack{align-items:flex-start;max-width:none;text-align:left}.tf-update-purchase-stack .license-status-sync{text-align:left;max-width:none}.${BLOCK_CLASS}.tf-update-purchase{max-width:none;text-align:left}}
    `;
    document.head.appendChild(style);
  }

  function createBlock(kind) {
    const block = document.createElement('div');
    block.className = `${BLOCK_CLASS}${kind === 'purchase' ? ' tf-update-purchase' : ''}`;
    block.dataset.tfUpdateKind = kind;
    block.setAttribute('aria-live', 'polite');
    return block;
  }

  function insertBlocks() {
    ensureStyle();

    const loginButton = document.getElementById('login-upgrade-plan-btn');
    if (loginButton && !loginButton.parentElement.querySelector(`.${BLOCK_CLASS}[data-tf-update-kind="login"]`)) {
      loginButton.insertAdjacentElement('afterend', createBlock('login'));
    }

    const profileTargets = [
      document.querySelector('#masuk-container .profile-time-range'),
      document.querySelector('#dashboard-view .dashboard-top-controls .profile-time-range'),
      document.querySelector('#isignal-view .dashboard-top-controls .profile-time-range')
    ].filter(Boolean);

    const validProfileBlocks = new Set();
    profileTargets.forEach((target) => {
      let block = target.previousElementSibling;
      if (block?.classList.contains('tf-total-progress')) block = block.previousElementSibling;
      if (!(block && block.classList && block.classList.contains(BLOCK_CLASS) && block.dataset.tfUpdateKind === 'profile')) {
        block = createBlock('profile');
        target.insertAdjacentElement('beforebegin', block);
      }
      validProfileBlocks.add(block);
    });

    document.querySelectorAll(`.${BLOCK_CLASS}[data-tf-update-kind="profile"]`).forEach((block) => {
      if (!validProfileBlocks.has(block)) block.remove();
    });

    const sync = document.getElementById('license-status-sync');
    if (sync && sync.parentElement) {
      let stack = sync.closest('.tf-update-purchase-stack');
      if (!stack) {
        stack = document.createElement('div');
        stack.className = 'tf-update-purchase-stack';
        stack.dataset.tfUpdatePurchaseStack = '1';
        sync.insertAdjacentElement('beforebegin', stack);
        stack.appendChild(sync);
      }
      let block = stack.querySelector(`.${BLOCK_CLASS}[data-tf-update-kind="purchase"]`);
      if (!block) {
        block = createBlock('purchase');
        stack.insertBefore(block, sync);
      } else if (block.nextElementSibling !== sync) {
        stack.insertBefore(block, sync);
      }
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderBlock(block, state, prefs) {
    const current = Number((state && state.currentRevision) || currentRevision() || 0);
    const latest = Number(state && state.latestRevision || 0);
    const popupDisabled = Boolean(prefs && prefs.popupDisabled);

    const installedVersion = currentVersion();
    const installedLabel = `Versi terpasang: ${installedVersion ? escapeHtml(installedVersion) + ' • ' : ''}REV${escapeHtml(current || '-')}`;
    let html = `<div class="tf-update-line"><span class="tf-update-version">${installedLabel}</span>`;

    if (!state) {
      html += `<span class="tf-update-dot">•</span><span class="tf-update-wait">Memeriksa update…</span>`;
    } else if (state.updateAvailable && state.statusEligible && !state.withdrawn) {
      const latestTag = String(state && state.tagName || '').trim();
      const availableLabel = `Update ${latestTag ? escapeHtml(latestTag) + ' • ' : ''}REV${escapeHtml(latest)} tersedia`;
      html += `</div><div class="tf-update-line tf-update-available-line"><span class="tf-update-wait">${availableLabel}</span></div><div class="tf-update-line tf-update-actions-line">`;
      html += `<button type="button" class="tf-update-link" data-update-action="download">Download</button>`;
      html += `<span class="tf-update-dot">•</span><button type="button" class="tf-update-link" data-update-action="guide">Panduan</button>`;
    } else if (state && state.updateAvailable && !state.withdrawn && state.ok === false) {
      html += `<span class="tf-update-dot">•</span><span class="tf-update-error">Verifikasi GitHub tertunda</span>`;
      html += `<button type="button" class="tf-update-link" data-update-action="check">Cek lagi</button>`;
    } else if (state && state.updateAvailable && !state.withdrawn) {
      html += `<span class="tf-update-dot">•</span><span class="tf-update-wait">Update baru sedang diverifikasi…</span>`;
    } else if (state && state.ok === false && !latest) {
      html += `<span class="tf-update-dot">•</span><span class="tf-update-error">Pemeriksaan GitHub tertunda</span>`;
      html += `<button type="button" class="tf-update-link" data-update-action="check">Cek lagi</button>`;
    } else {
      html += `<span class="tf-update-dot">•</span><span class="tf-update-ok">Versi terbaru</span>`;
    }

    if (popupDisabled) {
      html += `<span class="tf-update-dot">•</span><span class="tf-update-popup-off">Popup nonaktif</span>`;
      html += `<button type="button" class="tf-update-link" data-update-action="enable-popup">Aktifkan</button>`;
    }

    html += '</div>';
    const updateReady = Boolean(state && state.updateAvailable && state.statusEligible && !state.withdrawn);
    if (!updateReady) {
      html += `<div class="tf-update-check-line">`;
      if (manualCheckRunning) {
        html += `<span class="tf-update-mini-spinner" aria-hidden="true"></span>`;
        html += `<button type="button" class="tf-update-link" data-update-action="check" disabled>Checking latest version…</button>`;
      } else {
        html += `<button type="button" class="tf-update-link" data-update-action="check">Check latest version update.</button>`;
      }
      html += `</div>`;
    }
    if (block.innerHTML !== html) block.innerHTML = html;
  }

  async function refresh(force = false) {
    insertBlocks();
    const response = await send(force ? 'TF_GITHUB_UPDATE_CHECK_NOW' : 'TF_GITHUB_UPDATE_GET_STATE');
    const state = response && response.state ? response.state : null;
    const prefs = response && response.prefs ? response.prefs : {};
    const signature = JSON.stringify({ state, prefs });
    if (!force && signature === lastSignature) return;
    lastSignature = signature;
    document.querySelectorAll(`.${BLOCK_CLASS}`).forEach((block) => renderBlock(block, state, prefs));
  }

  document.addEventListener('click', async (event) => {
    const button = event.target && event.target.closest ? event.target.closest('[data-update-action]') : null;
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const action = button.dataset.updateAction;
    if (action === 'download') {
      const response = await send('TF_GITHUB_UPDATE_DOWNLOAD');
      if (!response || !response.ok) await refresh(true);
    }
    if (action === 'guide') await send('TF_GITHUB_UPDATE_OPEN_GUIDE');
    if (action === 'check') {
      if (manualCheckRunning) return;
      manualCheckRunning = true;
      document.querySelectorAll(`.${BLOCK_CLASS}`).forEach((block) => renderBlock(block, null, {}));
      try {
        await refresh(true);
      } finally {
        manualCheckRunning = false;
        lastSignature = '';
        await refresh(false);
      }
    }
    if (action === 'enable-popup') {
      await send('TF_GITHUB_UPDATE_ENABLE_POPUP');
      await refresh(false);
    }
  });

  const observer = new MutationObserver(() => {
    insertBlocks();
    document.querySelectorAll(`.${BLOCK_CLASS}`).forEach((block) => {
      if (!block.dataset.tfRenderedOnce) {
        block.dataset.tfRenderedOnce = '1';
        void refresh(false);
      }
    });
  });

  function start() {
    insertBlocks();
    observer.observe(document.documentElement, { childList: true, subtree: true });
    void refresh(false);
    setTimeout(() => void refresh(false), 1500);
    setInterval(() => void refresh(false), 15000);
  }

  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return;
      if (changes[STATE_KEY] || changes[PREFS_KEY]) void refresh(false);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

/* TF compact dimensions REV453 */
