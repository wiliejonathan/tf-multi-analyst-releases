function tf_ensureBalanceCards414(screen) {
  const perf = document.getElementById('tf-perf-wrap');
  if (!perf) return;
  let host = document.getElementById('tf-balance-cards412');
  if (!host) {
    host = document.createElement('div'); host.id = 'tf-balance-cards412';
    host.className = 'tf-balance-cards412'; host.setAttribute('aria-label', 'Ringkasan balance'); host.setAttribute('aria-live', 'polite');
    perf.insertBefore(host, document.getElementById('tf-perf-overall') || perf.firstChild);
  }
  if (screen) {
    const head = perf.querySelector('.tf-perf-head');
    const range = document.getElementById('tf-time-range-row-perf');
    // Cards are an independent part of the Performance screen, including an
    // empty dataset and a render that hides the legacy analyst-table wrapper.
    if (head) screen.insertBefore(head, perf);
    screen.insertBefore(host, perf);
    if (range) screen.insertBefore(range, perf);
  }
  if (!host.children.length) {
    const state = window.__tfBalanceCardsState414;
    if (state) tf_renderBalanceCards412(state.saldo, state.equity, state.busy);
    else tf_renderBalanceCards412(Number(currentBalance) || 0, null, false);
  }
}
