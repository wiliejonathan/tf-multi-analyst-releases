// REV412: shared dashboard presentation and iSignal subscription status.
let tfEquityAnimation412 = null;
let tfEquityAnimationFrame412 = 0;
function tf_cancelEquityAnimation412() {
  cancelAnimationFrame(tfEquityAnimationFrame412);
  tfEquityAnimationFrame412 = 0;
  tfEquityAnimation412 = null;
}
function tf_animateEquity412() {
  tf_cancelEquityAnimation412();
  if (equityChartMode !== 'line' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) {
    drawEquityCurve(); return;
  }
  const animation = { start: performance.now(), progress: 0 };
  tfEquityAnimation412 = animation;
  const step = now => {
    if (tfEquityAnimation412 !== animation) return;
    const t = Math.min(1, (now - animation.start) / 900);
    animation.progress = t * t * (3 - 2 * t);
    drawEquityCurve();
    if (t < 1) tfEquityAnimationFrame412 = requestAnimationFrame(step);
    else { tfEquityAnimation412 = null; tfEquityAnimationFrame412 = 0; }
  };
  tfEquityAnimationFrame412 = requestAnimationFrame(step);
}
function tf_renderBalanceCards412(saldo, equity, busy) {
  const host = document.getElementById('tf-balance-cards412');
  if (!host) return;
  const valid = Number.isFinite(equity), pnl = valid ? equity - saldo : null;
  const pct = valid && saldo !== 0 ? pnl / Math.abs(saldo) * 100 : null;
  const money = n => (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', {maximumFractionDigits: 2});
  const values = [saldo, equity, pnl, pct], labels = ['Saldo', 'Equity $', 'PnL $', 'PnL %'];
  host.innerHTML = labels.map((label, i) => {
    const n = values[i], known = Number.isFinite(n);
    const text = busy ? 'Memuat…' : !known ? '—' : (i >= 2 && n > 0 ? '+' : '') + (i === 3 ? n.toFixed(2) + '%' : money(n));
    const state = !busy && known && n < 0 ? 'neg' : !busy && known && i >= 2 && n > 0 ? 'pos' : '';
    return '<div class="tf-balance-card412 ' + state + '"><div class="tf-balance-label412">' + label + '</div><div class="tf-balance-value412">' + text + '</div></div>';
  }).join('');
}
function tf_subscriptionStatus412(text, now = Date.now()) {
  // Source dates are Indonesian account dates (WIB, UTC+7), including their time.
  const months = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];
  const m = String(text || '').trim().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(?:WIB|UTC\+7|GMT\+7))?$/i);
  if (!m) return null;
  const month = months.indexOf(m[2].toLowerCase()), day = Number(m[1]), hour = Number(m[4]), minute = Number(m[5]), second = Number(m[6] || 0);
  if (month < 0 || day < 1 || day > new Date(Date.UTC(Number(m[3]), month + 1, 0)).getUTCDate() || hour > 23 || minute > 59 || second > 59) return null;
  const end = Date.UTC(Number(m[3]), month, day, hour - 7, minute, second);
  const remaining = end - now;
  return { end, remaining, state: remaining <= 86400000 ? 'critical' : remaining <= 5 * 86400000 ? 'warning' : 'healthy' };
}
function tf_applySubscription412(el, text) {
  if (!el) return;
  const status = tf_subscriptionStatus412(text);
  el.dataset.subscriptionText412 = String(text || '');
  for (const state of ['healthy','warning','critical']) el.classList.remove('tf-subscription-' + state + '412');
  el.removeAttribute('title');
  if (!status) { el.textContent = text || '—'; return; }
  el.classList.add('tf-subscription-' + status.state + '412');
  const icon = document.createElement('span');
  icon.className = 'tf-subscription-icon412'; icon.setAttribute('aria-hidden', 'true');
  icon.textContent = status.state === 'healthy' ? '✓' : '!';
  el.replaceChildren(icon, document.createTextNode(' ' + text));
  el.title = status.remaining <= 0 ? 'Subscription sudah kedaluwarsa' : status.state === 'critical' ? 'Subscription tersisa 1 hari atau kurang' : status.state === 'warning' ? 'Subscription tersisa 5 hari atau kurang' : 'Subscription masih aman';
}
function tf_showIsignalExplanation412() {
  if (!document.getElementById('tf-users-mgmt-table') || document.getElementById('tf-isignal-explainer412')) return;
  const overlay = document.createElement('div');
  overlay.id = 'tf-isignal-explainer412'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-labelledby','tf-isignal-explainer-title412');
  overlay.innerHTML = '<div class="tf-isignal-explainer-card412"><div class="tf-isignal-eyebrow412">// ISIGNAL USERS</div><h2 id="tf-isignal-explainer-title412">Kenali<br>Status iSignal</h2><p>Ikon koneksi dan tanggal subscription memiliki arti yang berbeda.</p><div class="tf-isignal-explainer-row412"><span class="tf-legend-green412">✓</span><div><strong>Status koneksi</strong><p>Centang hijau pada analis berarti analis ditemukan dan aktif di iSignal. X merah berarti analis belum aktif, tidak aktif, atau tidak ditemukan. X pada kolom Disconnect berarti belum terhubung atau tidak tersedia untuk disconnect.</p></div></div><div class="tf-isignal-explainer-row412"><span class="tf-legend-green412">✓</span><div><strong>Subscription aman · Hijau</strong><p>Tanggal berwarna hijau dengan centang: waktu tersisa lebih dari 5 hari.</p></div></div><div class="tf-isignal-explainer-row412"><span class="tf-legend-yellow412">!</span><div><strong>Segera kedaluwarsa · Kuning</strong><p>Tanggal berwarna kuning dengan tanda seru: waktu tersisa 5 hari atau kurang, tetapi lebih dari 1 hari.</p></div></div><div class="tf-isignal-explainer-row412"><span class="tf-legend-red412">!</span><div><strong>Mendesak / Kedaluwarsa · Merah</strong><p>Tanggal berwarna merah dengan tanda seru: waktu tersisa 1 hari atau kurang, termasuk subscription yang sudah kedaluwarsa.</p></div></div><p>Warna nama analis mengikuti risiko bulan terbaru dari seluruh Table 3: hijau jika tidak ada maksimum consecutive loss maupun drawdown; kuning jika ada salah satu; merah jika ada keduanya.</p><div class="tf-isignal-note412">Fitur ini hanya akan aktif jika User sudah mengatur Lot Size di iSignal sebelumnya! Jika belum, silakan connect ke iSignal terlebih dahulu dan mengatur Lot Size secara manual terlebih dahulu!</div><button type="button" id="tf-isignal-understand412">Mengerti !</button></div>';
  const previous = document.activeElement;
  document.body.appendChild(overlay);
  const button = overlay.querySelector('button');
  button.addEventListener('click', () => { overlay.remove(); if (previous && previous.isConnected) previous.focus(); });
  overlay.addEventListener('keydown', event => { if (event.key === 'Tab') { event.preventDefault(); button.focus(); } });
  button.focus();
}
function tf_initPresentation412() {
  tf_showIsignalExplanation412();
  if (!document.getElementById('tf-users-mgmt-table')) return;
  const refresh = () => {
    document.querySelectorAll('.tf-users-analyst-link[data-analyst]').forEach(el => tf_applyLatestRiskColorOnly(el, el.dataset.analyst, null));
    document.querySelectorAll('.tf-isignal-subend').forEach(el => {
      if (!el.classList.contains('tf-isusers-sub-loading')) tf_applySubscription412(el, el.dataset.subscriptionText412 || el.textContent.replace(/^[✓!]\s*/, ''));
    });
  };
  refresh();
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tf_initPresentation412, {once:true});
else tf_initPresentation412();
