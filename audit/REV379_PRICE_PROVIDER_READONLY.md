# REV379 Price Provider - read-only audit

## assets/4b4d6b8dc315a95c.js

### ensure_myfxbook_prices 1
~~~js
(p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb || !topCb.checked)
return;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (!pairCbs || pairCbs.length === 0) {
return;
}
const selected = [];
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
selected.push(pair);
});
map[name] = selected;
});
return map;
}
function commitAndRefresh() {
const __openAnalysts = Array.from(container.querySelectorAll('.analyst-filter-item .sub-menu'))
.filter((m) => m && m.style && m.style.display === 'block')
.map((m) => m.getAttribute('data-analyst'))
.filter((x) => !!x);
const nextGlobal = recomputeGlobalFromUI();
const nextPairs = recomputePairMapFromUI();
if (typeof setGlobalState === 'function')
setGlobalState(nextGlobal);
if (typeof setState === 'function')
setState(nextPairs);
if (typeof applyFn === 'function')
applyFn();
setupAnalystTickerFilter();
try {
const menus = container.querySelectorAll('.analyst-filter-item .sub-menu[data-analyst]');
menus.forEach((m) => {
const a = m.getAttribute('data-analyst');
if (!a)
return;
if (__openAnalysts.indexOf(a) !== -1) {
m.style.display = 'block';
const li = m.closest('.analyst-filter-item');
const ar = li ? li.querySelector('span.analyst-filter-arrow') : null;
if (ar)
ar.textContent = '▼';
}
});
}
catch (e) { }
}
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
if (checked) {
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.checked = true;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (!topCb.checked) {
pcb.checked = false;
pcb.disabled = true;
return;
}
if (pair === '__ALL__') {
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
pcb.checked = !anyNoValue;
pcb.disabled = false;
}
else {
const noVal = isNoValuePair(name, pair);
pcb.disabled = false;
pcb.checked = true;
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
}
}
});
});
}
else {
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb)
topCb.checked = false;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (pairCbs && pairCbs.length) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
});
}
commitAndRefresh();
});
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.addEventListener('change', () => {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
const pairs = getPairsList(name);
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
if (pairCbs && pairCbs.length) {
if (!topCb.checked) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
else {
let anySpecificChecked = false;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
anySpecificChecked = true;
});
const doAutoSelect = !!(autoSelectPairsOnAnalystEnable && !anySpecificChecked);
let subAllCb = null;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (pair === '__ALL__') {
subAllCb = pcb;
return;
}
const noVal = isNoValuePair(name, pair);
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
pcb.disabled = false;
}
else {
pcb.disabled = false;
if (doAutoSelect) {
pcb.checked = !noVal;
}
}
});
if (subAllCb) {
subAllCb.disabled = false;
if (doAutoSelect) {
let allSpecificChecked = true;
const specifics = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-
~~~

### ensure_myfxbook_prices 2
~~~js
JPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb || !topCb.checked)
return;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (!pairCbs || pairCbs.length === 0) {
return;
}
const selected = [];
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
selected.push(pair);
});
map[name] = selected;
});
return map;
}
function commitAndRefresh() {
const __openAnalysts = Array.from(container.querySelectorAll('.analyst-filter-item .sub-menu'))
.filter((m) => m && m.style && m.style.display === 'block')
.map((m) => m.getAttribute('data-analyst'))
.filter((x) => !!x);
const nextGlobal = recomputeGlobalFromUI();
const nextPairs = recomputePairMapFromUI();
if (typeof setGlobalState === 'function')
setGlobalState(nextGlobal);
if (typeof setState === 'function')
setState(nextPairs);
if (typeof applyFn === 'function')
applyFn();
setupAnalystTickerFilter();
try {
const menus = container.querySelectorAll('.analyst-filter-item .sub-menu[data-analyst]');
menus.forEach((m) => {
const a = m.getAttribute('data-analyst');
if (!a)
return;
if (__openAnalysts.indexOf(a) !== -1) {
m.style.display = 'block';
const li = m.closest('.analyst-filter-item');
const ar = li ? li.querySelector('span.analyst-filter-arrow') : null;
if (ar)
ar.textContent = '▼';
}
});
}
catch (e) { }
}
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
if (checked) {
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.checked = true;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (!topCb.checked) {
pcb.checked = false;
pcb.disabled = true;
return;
}
if (pair === '__ALL__') {
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
pcb.checked = !anyNoValue;
pcb.disabled = false;
}
else {
const noVal = isNoValuePair(name, pair);
pcb.disabled = false;
pcb.checked = true;
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
}
}
});
});
}
else {
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb)
topCb.checked = false;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (pairCbs && pairCbs.length) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
});
}
commitAndRefresh();
});
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.addEventListener('change', () => {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
const pairs = getPairsList(name);
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
if (pairCbs && pairCbs.length) {
if (!topCb.checked) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
else {
let anySpecificChecked = false;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
anySpecificChecked = true;
});
const doAutoSelect = !!(autoSelectPairsOnAnalystEnable && !anySpecificChecked);
let subAllCb = null;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (pair === '__ALL__') {
subAllCb = pcb;
return;
}
const noVal = isNoValuePair(name, pair);
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
pcb.disabled = false;
}
else {
pcb.disabled = false;
if (doAutoSelect) {
pcb.checked = !noVal;
}
}
});
if (subAllCb) {
subAllCb.disabled = false;
if (doAutoSelect) {
let allSpecificChecked = true;
const specifics = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]:not([data-pair="__ALL__"])');
specifics.forEach((x) => {
if (!x.checked)
allSpecificChecked = false;
});
subAllCb.checked = !!allSpecificChecked;
}
else {
}
}
}
}
commitAndRefresh();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pcb) => {
pcb.addEventListener('change', () => {
const analyst = pcb.getAttribute('data-analyst');
const pair = pcb.getAttribute('data-pair');
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"]:not([data-pair])');
if (!topCb || !topCb.checked) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pair === '__ALL__') {
if (pcb.disabled) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pcb.checked) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
specific.forEach((x) => {
x.checked = true;
});
}
else {
}
commitAndRefresh();
return;
}
const subAll = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair="__ALL__"]');
if (subAll && !subAll.disabled) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
let allChecked = true;
specific.forEach((x) => {
if (!x.checked)
allChecked = false;
});
subAll.checked = allChecked;
}
else if (subAll) {
subAll.checked = false;
}
commitAndRefresh();
});
});
}
containers.forEach((c) => buildOneContainer(c));
}
function setupAnalystTickerFilter() {
const statsContainerIds = ['analyst-filter-container', 'analyst-filter-container-monthly'];
const historyContainerIds = ['analyst-filter-container-history', 'analyst-filter-container-equity'];
const statsContainers = statsContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const historyContainers = historyContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const allContainers = statsContainers.concat(historyContainers);
if (!allContainers.length)
return;
if (!__tfAnalystFilterOutsideClickInstalled) {
__tfAnalystFilterOutsideClickInstalled = true;
document.addEventListener('click', function onDocClickCloseMenus(event) {
const clickedInside = !!event.target.closest('#analyst-filter-container, #analyst-filter-container-monthly, #analyst-filter-container-history, #analyst-filter-container-equity');
if (clickedInside)
return;
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu && menu.style && menu.style.display === 'block') {
menu.style.display = 'none';
const arrow = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (arrow)
arrow.textContent = '▶';
}
});
});
}
const pairsByAnalystStats = {};
const pairsByAnalystHistory = {};
if (analystSourcesByName && typeof analystSourcesByName === 'object') {
Object.keys(analystSourcesByName).forEach((name) => {
if (!name)
return;
const src = analystSourcesByName[name];
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (src && Array.isArray(src.pairs)) {
src.pairs.forEach((p) => {
if (p) {
const pp = String(p).toUpperCase();
pairsByAnalystStats[name].add(pp);
pairsByAnalystHistory[name].add(pp);
}
});
}
});
}
if (Array.isArray(historySignals)) {
historySignals.forEach((item) => {
if (!item || !item.analyst)
return;
const name = item.analyst;
const p = item.pair;
if (name) {
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (p) {
pairsByAnalystStats[name].add(String(p).toUpperCase());
pairsByAnalystHistory[name].add(String(p).toUpperCase());
}
}
});
}
const analystNamesStats = Object.keys(pairsByAnalystStats).sort((a, b) => a.localeCompare(b));
const analystNamesHistory = Object.keys(pairsByAnalystHistory).sort((a, b) => a.localeCompare(b));
if (!analystNamesStats.length) {
statsContainers.forEach((c) => (c.innerHTML = ''));
}
if (!analystNamesHistory.length) {
historyContainers.forEach((c) => (c.innerHTML = ''));
}
function tf_getNoDataPairsEntry(map, baseName) {
if (!map || typeof map !== 'object')
return null;
if (Object.prototype.hasOwnProperty.call(map, baseName))
return map[baseName];
const target = tf_normAnalystKey(baseName).toLowerCase();
try {
const keys = Object.keys(map);
for (const k of keys) {
if (tf_normAnalystKey(k).toLowerCase() === target) {
return map[k];
}
}
}
catch (e) { }
return null;
}
function tf_isNoDataPairStats(baseName, pair) {
const entry = tf_getNoDataPairsEntry(noDataPairsByAnalyst, baseName);
const p = tf_normPairKey(pair);
return !!(entry && p && entry[p]);
}
function tf_computeHistoryNoValuePairsByAnalyst() {
const tmp = {};
const arr = Array.isArray(historySignals) ? historySignals : [];
arr.forEach((it) => {
if (!it)
return;
const a = tf_normAnalystKey(it.analyst || '');
const p = tf_normPairKey(it.pair || '');
if (!a || !p)
return;
if (!tmp[a])
tmp[a] = {};
if (!tmp[a][p])
tmp[a][p] = { count: 0, absPips: 0 };
tmp[a][p].count += 1;
let 
~~~

### tfMyfxbookPrices 1
~~~js
dateSkipButtonState() {
const els = tfDash_overlayEls();
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {
~~~

### tfMyfxbookPrices 2
~~~js
);
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.q
~~~

### tfMyfxbookPricesAt 1
~~~js
);
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.q
~~~
## assets/901c62026afc22f4.js

### ensure_myfxbook_prices 1
~~~js
onst t = (n && n.textContent) ? n.textContent.trim() : '';
if (t && t.length < 500)
parts.push(t);
});
const joined = parts.join(' | ');
return joined;
}
await waitFor(() => document.querySelector('.list-auto-copy-signal .card-auto-copy-diss') || document.querySelector('.card-auto-copy-diss'), 30000, 300);
const cardRoot = await waitFor(() => findMtCardByMtId(mtId), 30000, 300);
if (!cardRoot)
return { ok: false, code: 'MTID_NOT_FOUND', reason: `MTID ${mtId} not found` };
const notif = await waitFor(() => {
const n = cardRoot.querySelector('.notif-of-card');
if (!n || !isVisible(n))
return null;
const b = n.querySelector('h5.text-header-notif b, .text-header-notif b');
const tx = (b && b.textContent) ? b.textContent.trim().toLowerCase() : '';
if (tx.includes('akun disconnect') || tx.includes('disconnect'))
return n;
return null;
}, 5000, 200);
if (!notif)
return { ok: false, code: 'DISCONNECT_NOT_FOUND', reason: 'Akun Disconnect overlay tidak ditemukan' };
const btnReconnect = notif.querySelector('a[data-track*="iset_reconn"], a[onclick*="toolsCard(\'reconnect\'"], a.btn-success.btnmdlnew, a.btn-success') ||
Array.from(notif.querySelectorAll('a,button')).find(x => (x.textContent || '').trim().toLowerCase().includes('sambungkan kembali')) ||
null;
if (!btnReconnect)
return { ok: false, code: 'RECONNECT_BUTTON_NOT_FOUND', reason: 'Tombol Sambungkan Kembali tidak ditemukan' };
clickEl(btnReconnect);
await sleep(600);
const symbolRoot = await waitFor(() => findSymbolListRoot(document), 30000, 250);
if (!symbolRoot)
return { ok: false, code: 'SYMBOL_LIST_NOT_FOUND', reason: 'Symbol list (pairs) tidak ditemukan' };
const wantEntries = Object.entries(pairsLots || {}).map(([k, v]) => [String(k), String(v)]);
const wantCount = wantEntries.length;
const rows = (wantCount > 0)
? (await waitFor(() => {
const r = collectSymbolRows(symbolRoot);
return (r && r.length) ? r : null;
}, 20000, 250)) || []
: collectSymbolRows(symbolRoot);
const normSym = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const missing = [];
const rowBySym = new Map();
for (const r of rows) {
const rs = normSym(getSymbolFromRow(r));
if (rs && !rowBySym.has(rs))
rowBySym.set(rs, r);
}
function findRowForSymbol(symRaw) {
const key = normSym(symRaw);
if (!key)
return null;
let row = rowBySym.get(key) || null;
if (row)
return row;
for (const r of rows) {
const rs = normSym(getSymbolFromRow(r));
if (!rs)
continue;
if (rs === key || rs.includes(key) || key.includes(rs))
return r;
}
return null;
}
if (wantCount > 0) {
const wantSet = new Set(wantEntries.map(([s]) => normSym(s)));
for (const r of rows) {
const rs = normSym(getSymbolFromRow(r));
const cb = getCheckboxInRow(r);
if (cb && cb.checked && rs && !wantSet.has(rs)) {
const toggleTarget = r.querySelector('span.slider.round') || r.querySelector('label.switch') || cb || r;
try {
clickEl(toggleTarget);
}
catch (e) {
try {
clickEl(cb || r);
}
catch (_) { }
}
await sleep(250);
if (cb.checked) {
cb.checked = false;
cb.dispatchEvent(new Event('change', { bubbles: true }));
await sleep(250);
}
}
}
}
if (wantCount > 0) {
for (const [sym] of wantEntries) {
const row = findRowForSymbol(sym);
if (!row) {
missing.push(sym);
continue;
}
const cb = getCheckboxInRow(row);
if (cb && !cb.checked) {
const toggleTarget = row.querySelector('span.slider.round') || row.querySelector('label.switch') || cb || row;
try {
clickEl(toggleTarget);
}
catch (e) {
try {
clickEl(cb || row);
}
catch (_) { }
}
await sleep(250);
if (!cb.checked) {
try {
clickEl(row);
}
catch (e) { }
await sleep(250);
}
if (!cb.checked) {
cb.checked = true;
cb.dispatchEvent(new Event('change', { bubbles: true }));
await sleep(250);
}
}
}
}
if (missing.length) {
const avail = Array.from(rowBySym.keys()).slice(0, 40).join(', ');
const suffix = avail ? ` | Available: ${avail}` : '';
return { ok: false, code: 'PAIR_NOT_FOUND', reason: `Pairs not found: ${missing.join(', ')}${suffix}` };
}
const notReady = [];
if (wantCount > 0) {
for (const [sym, lot] of wantEntries) {
const row = findRowForSymbol(sym);
if (!row) {
notReady.push(`${sym} (row missing)`);
continue;
}
const cb = getCheckboxInRow(row);
if (!cb || !cb.checked) {
notReady.push(`${sym} (not checked)`);
continue;
}
const lotInput = getLotInputInRow(row);
if (!lotInput) {
notReady.push(`${sym} (lot input missing)`);
continue;
}
if (lotInput.disabled) {
const enabled = await waitFor(() => (!lotInput.disabled ? lotInput : null), 3000, 100);
if (!enabled) {
notReady.push(`${sym} (lot input disabled)`);
continue;
}
}
setInputValue(lotInput, lot);
lotInput.dispatchEvent(new Event('change', { bubbles: true }));
await sleep(250);
const cur = String(lotInput.value || '').trim();
const exp = String(lot || '').trim();
if (exp) {
const a = parseFloat(cur);
const b = parseFloat(exp);
const ok = (cur === exp) || (isFinite(a) && isFinite(b) && Math.abs(a - b) < 1e-6);
if (!ok)
notReady.push(`${sym} (value ${cur || '∅'})`);
}
}
}
if (notReady.length) {
return { ok: false, code: 'PAIR_NOT_READY', reason: `Pairs not ready: ${notReady.join(', ')}` };
}
const next1 = await waitFor(() => {
return document.querySelector('a.next-setlot-page-one-recconect, a.next-setlot-page-one-reconnect, a.next-setlot-page-one, a[name="md-submit"].next-setlot-page-one-recconect') ||
Array.from(document.querySelectorAll('a,button')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'selanjutnya');
}, 15000, 250);
if (!next1)
return { ok: false, code: 'NEXT1_NOT_FOUND', reason: 'Next button (page1 reconnect) not found' };
clickEl(next1);
await sleep(400);
let pwdInput = null;
let pwdTry = 0;
while (!pwdInput) {
pwdInput = await waitFor(() => {
const p = Array.from(document.querySelectorAll('input[type="password"]')).find(x => isVisible(x));
return p || null;
}, 8000, 250);
if (pwdInput)
break;
pwdTry++;
const nextAgain = document.querySelector('a.next-page-setting-lot-size, button.next-page-setting-lot-size') ||
Array.from(document.querySelectorAll('a,button')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'selanjutnya') ||
null;
if (nextAgain) {
clickEl(nextAgain);
}
await sleep(700);
}
setInputValue(pwdInput, password || '');
await sleep(250);
const next2 = await waitFor(() => {
return document.querySelector('a.next-page-password-setting, button.next-page-password-setting') ||
Array.from(document.querySelectorAll('a,button')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'selanjutnya');
}, 15000, 250);
if (!next2)
return { ok: false, code: 'NEXT2_NOT_FOUND', reason: 'Next button (password) not found' };
clickEl(next2);
await sleep(400);
const step2 = await waitFor(() => {
const t = getAnyNotifText();
const tl = String(t || '').toLowerCase();
if (tl.includes('menunggu 5 menit'))
return { kind: 'cooldown', text: t };
if (tl.includes('tidak dapat menyambungkan') || tl.includes('salah password'))
return { kind: 'err', text: t };
const y = Array.from(document.querySelectorAll('button, a')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'ya');
if (y)
return { kind: 'ok', yesBtn: y };
return null;
}, 15000, 200);
if (step2 && step2.kind === 'cooldown') {
return { ok: false, code: 'COOLDOWN_WAIT', reason: String(step2.text || 'menunggu 5 menit') };
}
if (step2 && step2.kind === 'err') {
return { ok: false, code: 'PASSWORD_INVALID', reason: String(step2.text || 'Password salah') };
}
const yesBtn = step2 && step2.kind === 'ok' ? step2.yesBtn : null;
if (!yesBtn)
return { ok: false, code: 'YES_NOT_FOUND', reason: 'Button Ya tidak ditemukan' };
clickEl(yesBtn);
await sleep(500);
const success = await waitFor(() => {
const b = document.querySelector('.text-header-notif.text-notif-render b, .text-header-notif b');
const t = (b && b.textContent) ? b.textContent.trim() : '';
const tl = t.toLowerCase();
if (tl.includes('berhasil disambungkan kembali'))
return t;
if (tl.includes('berhasil') && tl.includes('disambungkan'))
return t;
return null;
}, 20000, 250);
if (!success) {
const n2 = cardRoot.querySelector('.notif-of-card');
if (n2 && isVisible(n2)) {
return { ok: false, code: 'RECONNECT_NOT_CONFIRMED', reason: 'Reconnect belum terkonfirmasi (notif sukses tidak ditemukan)' };
}
return { ok: true, code: 'RECONNECTED_OK', reason: 'Akun MetaTrader berhasil disambungkan kembali' };
}
return { ok: true, code: 'RECONNECTED_OK', reason: success };
}
});
const payload = results && results[0] ? results[0].result : null;
shouldCloseTab = !!(payload && payload.ok);
sendResponse({
ok: !!(payload && payload.ok),
tabId,
code: payload && payload.code ? payload.code : '',
reason: payload && payload.reason ? payload.reason : '',
detail: payload || null
});
}
catch (e) {
sendResponse({ ok: false, error: String(e) });
}
finally {
if (shouldCloseTab && tabId != null) {
try {
await bg_sleep(350);
}
catch (e) { }
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
if (tabId != null) {
try { bg_releaseSilentTab(tabId); } catch (e) { }
}
}
})();
return true;
}
if (msg.type === 'ensure_myfxbook_prices') {
(async () => {
try {
const res = await bg_ensureMyfxbookPrices({ force: !!(msg && msg.force) });
sendResponse(res || { ok: false, error: 'Unknown error' });
}
catch (e) {
sendResponse({ ok: false, error: String(e) });
}
})();
return true;
}
if (msg.type === 'tf_fetch_broker_platform_ids') {
(async () => {
let createdTabId = null;
try {
const normalizeProfileUrl = (value) => {
try {
const u = new URL(String(value || ''), 'https://account.tradersfamily.id/');
if (u.hostname !== 'account.tradersfamily.id' || !/\/profile\/u\/\d+\/?/i.test(u.pathname))
return '';
u.protocol = 'https:';
u.searchParams.set('tab', 'settings');
u.searchParams.set('tfscan', '1');
return u.href;
}
catch (e) {
return '';
}
};
const storage = await bg_storageLocalGet(['tfCurrentProfileUrl', 'tfUserProfile', 'tfIsignalUsersPlatformIds', 'tfIsignalUsersMgmt_v1']);
const cachedIds = [];
const addCachedId = (value) => {
const id = String(value == null ? '' : value).trim();
if (id && !cachedIds.includes(id))
cachedIds.push(id);
};
try {
(Array.isArray(storage && storage.tfIsignalUsersPlatformIds) ? storage.tfIsignalUsersPlatformIds : []).forEach(addCachedId);
const cfg = storage && storage.tfIsignalUsersMgmt_v1 && typeof storage.tfIsignalUsersMgmt_v1 === 'object' ? storage.tfIsignalUsersMgmt_v1 : null;
(Array.isArray(cfg && cfg.platformIds) ? cfg.platformIds : []).forEach(addCachedId);
Object.keys(cfg && cfg.users && typeof cfg.users === 'object' ? cfg.users : {}).forEach(addCachedId);
}
catch (e) { }
const candidates = [];
const addCandidate = (value) => {
const url = normalizeProfileUrl(value);
if (url && !candidates.includes(url))
candidates.push(url);
};
addCandidate(msg && msg.url ? msg.url : '');
addCandidate(storage && storage.tfCurrentProfileUrl ? storage.tfCurrentProfileUrl : '');
try {
const storedProfile = storage && storage.tfUserProfile && typeof storage.tfUserProfile === 'object' ? storage.tfUserProfile : null;
addCandidate(storedProfile && (storedProfile.profileUrl || storedProfile.url) ? (storedProfile.profileUrl || storedProfile.url) : '');
}
catch (e) { }
const legacyProfileFallback = 'https://account.tradersfamily.id/profile/u/155921/?tab=settings';
const inspectForProfile = async (tabId) => {
try {
const results = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
const text = (el) => String(el && (el.innerText || el.textContent) || '').trim();
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect();
return !!(r && r.width > 0 && r.height > 0);
}
catch (e) { return false; }
};
const href = String(location.href || '');
const loginForm = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutMenu = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(visible);
if (loggedOutMenu)
return { ok: false, error: 'NOT_LOGGED_IN' };
const loggedUi = document.querySelector('#username_text, .pull-left.info, li.dropdown.user a[href*="/logout/"], a[href*="/logout/"], a[href*="/profile/u/"]');
const explicitLogin = /(?:\?|&)tfAuth=1(?:&|$)/i.test(href) || /\/login(?:mt)?\/?(?:$|[?#])/i.test(href) || /\/auth\//i.test(href);
if (explicitLogin && loginForm && visible(loginForm) && !loggedUi)
return { ok: false, error: 'NOT_LOGGED_IN' };
let profileUrl = '';
const nodes = Array.from(document.querySelectorAll('a[href*="/profile/u/"], [data-url*="/profile/u/"], [data-href*="/profile/u/"]'));
for (const node of nodes) {
const raw = node.getAttribute('href') || node.getAttribute('data-url') || node.getAttribute('data-href') || '';
const m = String(raw).match(/\/profile\/u\/\d+\/?(?:\?[^"'<>\s]*)?/i);
if (m) {
try { profileUrl = new URL(m[0], location.origin).href; } catch (e) { profileUrl = m[0]; }
break;
}
}
if (!profileUrl) {
const html = String(document.documentElement && document.documentElement.innerHTML || '');
const m = html.match(/\/profile\/u\/\d+\/?(?:\?[^"'<>\s]*)?/i);
if (m) {
try { profileUrl = new URL(m[0], location.origin).href; } catch (e) { profileUrl = m[0]; }
}
}
if (!profileUrl && /\/profile\/u\/\d+\/?/i.test(location.pathname))
profileUrl = location.href;
const imgEl = document.querySelector('.pull-left.image img.img-circle, .pull-left.image img, .user-panel img, li.dropdown.user img, .user-menu img, .user-header img, a[href*="/profile/u/"] img, [data-user-avatar] img, header .img-circle, img[class*="avatar"], img[class*="profile"]');
const nameEl = document.querySelector('.pull-left.info #username_text, .pull-left.info p.truncate, #username_text, .user-panel .info p, [data-user-name]');
let email = '';
const mailEl = document.querySelector('a[href^="mailto:"]');
if (mailEl) email = String(mailEl.getAttribute('href') || '').replace(/^mailto:/i, '').trim().toLowerCase();
return {
ok: true,
profileUrl,
profile: {
name: text(nameEl),
email,
avatarUrl: String(imgEl && (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) || '').trim(),
statusText: loggedUi ? 'Online' : ''
}
};
}
});
return results && results[0] ? (results[0].result || null) : null;
}
catch (e) { return null; }
};
// Discover the current UID from already-open authenticated tabs before using fallback.
try {
const tabs = await new Promise((resolve) => chrome.tabs.query({ url: 'https://account.tradersfamily.id/*' }, (items) => resolve(items || [])));
for (const tab of tabs) {
if (!tab || tab.id == null) continue;
const found = await inspectForProfile(tab.id);
if (found && found.profileUrl) addCandidate(found.profileUrl);
}
}
catch (e) { }
// REV59 compatibility fallback. Dynamic UID candidates are tried first;
// the former stable Settings URL remains available when discovery fails.
addCandidate(legacyProfileFallback);
const scrapeSettings = async (profileUrl) => {
let tabId = null;
try {
const tab = await bg_createTransientSilentTab(profileUrl, sender && sender.tab ? sender.tab.id : null);
tabId = tab && tab.id != null ? tab.id : null;
createdTabId = tabId;
if (tabId == null) return { ok: false, error: 'TAB_CREATE_FAILED' };
await bg_waitForTabLoaded(tabId, 45000);
try { await bg_restoreSilentOwner(tabId); } catch (e) { }
await bg_sleep(650);
const results = await chrome.scripting.executeScript({
target: { tabId },
func: async () => {
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const text = (el) => String(el && (el.innerText || el.textContent) || '').trim();
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect();
return !!(r && r.width > 0 && r.height > 0);
}
catch (e) { return false; }
};
const href = String(location.href || '');
const loginForm = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutMenu = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(visible);
if (loggedOutMenu)
return { ok: false, error: 'NOT_LOGGED_IN' };
const loggedUi = document.querySelector('#username_text, .pull-left.info, li.dropdown.user a[href*="/logout/"], a[href*="/logout/"], a[href*="/profile/u/"]');
const explicitLogin = /(?:\?|&)tfAuth=1(?:&|$)/i.test(href) || /\/login(?:mt)?\/?(?:$|[?#])/i.test(href) || /\/auth\//i.test(href);
if (explicitLogin && loginForm && visible(loginForm) && !loggedUi)
return { ok: false, error: 'NOT_LOGGED_IN' };
const brokerLink = document.querySelector('li#tab-broker a[href="#broker"], #tab-broker a, a[data-track="gtm_c_pf_tab_broker"], a[href*="tab=broker"], a[href="#broker"]');
if (brokerLink) { try { brokerLink.click(); } catch (e) { } }
const ids = [];
const addId = (value) => {
let id = String(value == null ? '' : value).trim();
id = id.replace(/^[\s:#-]+|[\s,;]+$/g, '').replace(/\s+/g, '');
if (!id || id.length < 4 || id.length > 32) return;
if (!/^[A-Za-z0-9._-]+$/.test(id) || !/\d/.test(id)) return;
if (/^(platform|broker|account|metatrader|subscription|active|inactive|settings)$/i.test(id)) return;
if (!ids.includes(id)) ids.push(id);
};
const scan = () => {
const exactTable = document.querySelector('#account-list-content table.profile-tbl tbody');
if (exactTable) {
exactTable.querySelectorAll('tr').forEach((tr) => {
const tds = tr.querySelectorAll('td.data');
if (tds && tds.length >= 2) addId(text(tds[1]));
});
}
const roots = [document.querySelector('#account-list-content'), document.querySelector('#broker'), document.querySelector('.tab-pane#broker'), document].filter(Boolean);
for (const root of roots) {
root.querySelectorAll('[data-platform-id]').forEach((el) => addId(el.getAttribute('data-platform-id')));
root.querySelectorAll('.platform-id, .platformId, [class*="platform-id"], [id*="platform-id"]').forEach((el) => { addId(el.getAttribute('data-value')); addId(text(el)); });
root.querySelectorAll('table tbody tr').forEach((tr) => {
const cells = Array.from(tr.querySelectorAll('td, th'));
const dataCells = Array.from(tr.querySelectorAll('td.data'));
if (dataCells.length >= 2) addId(text(dataCells[1]));
const idx = cells.findIndex((cell) => /platform\s*id/i.test(text(cell)));
if (idx >= 0) {
for (let i = idx + 1; i < cells.length; i++) { const v = text(cells[i]); if (v) { addId(v); break; } }
const m = text(tr).match(/platform\s*id\s*[:#-]?\s*([A-Za-z0-9._-]{4,32})/i);
if (m) addId(m[1]);
}
});
root.querySelectorAll('.card, .account-card, .platform-card, .broker-card, .form-group, .row').forEach((el) => {
const raw = text(el);
if (!/platform\s*id/i.test(raw)) return;
const m = raw.match(/platform\s*id\s*[:#-]?\s*([A-Za-z0-9._-]{4,32})/i);
if (m) addId(m[1]);
});
}
};
for (let attempt = 0; attempt < 100; attempt++) {
scan();
if (ids.length) break;
const loginNow = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutNow = [
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(visible);
if (loggedOutNow)
return { ok: false, error: 'NOT_LOGGED_IN' };
const accountNow = document.querySelector('#username_text, .pull-left.info, a[href*="/logout/"], a[href*="/profile/u/"]');
if (attempt > 8 && loginNow && visible(loginNow) && !accountNow)
return { ok: false, error: 'NOT_LOGGED_IN' };
await sleep(250);
}
scan();
const imgEl = document.querySelector('.pull-left.image img.img-circle, .pull-left.image img, .user-panel img, li.dropdown.user img, .user-menu img, .user-header img, a[href*="/profile/u/"] img, [data-user-avatar] img, header .img-circle, img[class*="avatar"], img[class*="profile"]');
const nameEl = document.querySelector('.pull-left.info #username_text, .pull-left.info p.truncate, #username_text, .user-panel .info p, [data-user-name]');
let email = '';
const mailEl = document.querySelector('a[href^="mailto:"]');
if (mailEl) email = String(mailEl.getAttribute('href') || '').replace(/^mailto:/i, '').trim().toLowerCase();
return {
ok: true,
platformIds: ids,
profileUrl: location.href,
profile: { name: text(nameEl), email, avatarUrl: String(imgEl && (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) || '').trim(), statusText: 'Online' }
};
}
});
return results && results[0] ? (results[0].result || null) : null;
}
finally {
if (tabId != null) { try { await bg_removeTab(tabId); } catch (e) { } }
if (createdTabId === tabId) createdTabId = null;
}
};
let lastError = 'PROFILE_URL_NOT_FOUND';
let successfulPayload = null;
for (const profileUrl of candidates) {
const payload = await scrapeSettings(profileUrl);
if (payload && payload.ok) {
successfulPayload = payload;
if (Array.isArray(payload.platformIds) && payload.platformIds.length) break;
}
if (payload && payload.error) lastError = String(payload.error);
}
if (!successfulPayload) {
// Last dynamic attempt: open account root, discover profile URL, then retry.
let rootTabId = null;
try {
const rootTab = await bg_createTransientSilentTab('https://account.tradersfamily.id/?tfscan_profile_resolve=1&ts=' + Date.now(), sender && sender.tab ? sender.tab.id : null);
rootTabId = rootTab && rootTab.id != null ? rootTab.id : null;
if (rootTabId != null) {
await bg_waitForTabLoaded(rootTabId, 45000);
await bg_sleep(900);
const found = await inspectForProfile(rootTabId);
if (found && found.profileUrl) successfulPayload = await scrapeSettings(normalizeProfileUrl(found.profileUrl));
if (found && found.error) lastError = String(found.error);
}
}
catch (e) { lastError = String(e && e.message ? e.message : e); }
finally { if (rootTabId != null) { try { await bg_removeTab(rootTabId); } catch (e) { } } }
}
if (!successfulPayload || !successfulPayload.ok) {
if (cachedIds.length) {
sendResponse({ ok: true, platformIds: cachedIds, cached: true, warning: lastError });
return;
}
sendResponse({ ok: false, error: lastError || 'Gagal mengambil Platform ID.' });
return;
}
const platformIds = Array.from(new Set((Array.isArray(successfulPayload.platformIds) ? successfulPayload.platformIds : []).map((v) => String(v || '').trim()).filter(Boolean)));
const storedProfile = storage && storage.tfUserProfile && typeof storage.tfUserProfile === 'object' ? storage.tfUserProfile : {};
const liveProfile = successfulPayload.profile && typeof successfulPayload.profile === 'object' ? successfulPayload.profile : {};
const mergedProfile = {
name: String(liveProfile.name || storedProfile.name || '').trim(),
email: String(liveProfile.email || storedProfile.email || '').trim().toLowerCase(),
avatarUrl: String(liveProfile.avatarUrl || storedProfile.avatarUrl || '').trim(),
statusText: 'Online',
profileUrl: normalizeProfileUrl(successfulPayload.profileUrl || candidates[0] || '')
};
await bg_storageLocalSet({
tfIsignalUsersPlatformIds: platformIds.length ? platformIds : cachedIds,
tfIsignalUsersPlatformIdsAt: Date.now(),
tfCurrentProfileUrl: mergedProfile.profileUrl || normalizeProfileUrl(candidates[0] || ''),
tfCurrentProfileUrlAt: Date.now(),
tfUserProfile: mergedProfile,
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: true,
tfForceLoginForm: false
});
sendResponse({ ok: true, platformIds: platformIds.length ? platformIds : cachedIds, profileUrl: mergedProfile.profileUrl, profile: mergedProfile });
}
catch (e) {
try {
const cached = await bg_storageLocalGet(['tfIsignalUsersPlatformIds']);
const ids = Array.isArray(cached && cached.tfIsignalUsersPlatformIds) ? cached.tfIsignalUsersPlatformIds : [];
if (ids.length) sendResponse({ ok: true, platformIds: ids, cached: true, warning: String(e && e.message ? e.message : e) });
else sendResponse({ ok: false, error: String(e && e.message ? e.message : e) });
}
catch (x) { sendResponse({ ok: false, error: String(e && e.message ? e.message : e) }); }
}
finally {
if (createdTabId != null) { try { await bg_removeTab(createdTabId); } catch (e) { } }
}
})();
return true;
}
if (msg.type === 'tf_scan_active_isignal_channels') {
(async () => {
const urlRaw = (msg && msg.url) ? String(msg.url) : 'https://account.tradersfamily.id/channels/isignal/';
const url = urlRaw.includes('tfscan=1') ? urlRaw : (urlRaw + (urlRaw.includes('?') ? '&' : '?') + 'tfscan=1');
let tabId = null;
const SUB_CACHE_KEY = 'tfIsignalSubEnds';
const SUB_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
try {
const tab = await bg_createTransientSilentTab(url, sender && sender.tab ? sender.tab.id : null);
tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
sendResponse({ ok: false, error: 'Gagal membuka halaman iSignal' });
return;
}
await bg_waitForTabLoaded(tabId, 45000);
// The analyst-list worker remains inactive; never restore or force tab focus.
const results = await chrome.scripting.executeScript({
target: { tabId },
func: async () => {
try {
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isVisible = (el) => {
if (!el)
return false;
const style = window.getComputedStyle(el);
if (!style)
return false;
if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')
return false;
if (el.offsetParent === null)
return false;
const rect = el.getBoundingClientRect();
return rect && rect.width > 0 && rect.height > 0;
};
const href = String(location && location.href ? location.href : '');
if (/\/login\b/i.test(href) || /auth\//i.test(href)) {
return { ok: false, error: 'NOT_LOGGED_IN' };
}
// Protected builds load more slowly; wait until cards or an explicit login form exists.
for (let readyAttempt = 0; readyAttempt < 60; readyAttempt++) {
const readyCards = document.querySelectorAll('div.signal-card');
if (readyCards && readyCards.length) break;
const loginForm = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutMenu = [
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(isVisible);
if (loggedOutMenu)
return { ok: false, error: 'NOT_LOGGED_IN' };
const accountUi = document.querySelector('#username_text, .pull-left.info, a[href*="/logout/"], a[href*="/profile/u/"]');
if (readyAttempt > 10 && loginForm && isVisible(loginForm) && !accountUi)
return { ok: false, error: 'NOT_LOGGED_IN' };
await sleep(250);
}
const maxClicks = 250;
const maxNoGrowth = 8;
let noGrowth = 0;
let lastCount = 0;
for (let i = 0; i < maxClicks; i++) {
const cards = document.querySelectorAll('div.signal-card');
const countNow = cards ? cards.length : 0;
if (countNow > lastCount) {
lastCount = countNow;
noGrowth = 0;
}
else {
noGrowth++;
}
const btn = document.querySelector('#btnLoad.btnLoad') ||
document.querySelector('#btnLoad') ||
Array.from(document.querySelectorAll('button, a')).find((x) => /load\s*more/i.test(x.textContent || ''));
if (!btn || !isVisible(btn) || btn.disabled)
break;
btn.click();
let grew = false;
for (let t = 0; t < 24; t++) {
await sleep(250);
const cc = document.querySelectorAll('div.signal-card');
const c = cc ? cc.length : 0;
if (c > lastCount) {
lastCount = c;
grew = true;
noGrowth = 0;
break;
}
}
if (!grew && noGrowth >= maxNoGrowth)
break;
await sleep(150);
}
const cards = Array.from(document.querySelectorAll('div.signal-card'));
const out = [];
const seen = new Set();
const norm = (s) => String(s || '').trim();
const STEP_DELAY = 200;
cards.forEach((card) => {
const nameEl = card.querySelector('.channel-name.add p.truncate-text') ||
card.querySelector('.channel-name p.truncate-text') ||
card.querySelector('.channel-name p') ||
card.querySelector('.channel-name');
const name = norm(nameEl ? nameEl.textContent : '');
if (!name)
return;
const key = name.toLowerCase();
if (seen.has(key))
return;
seen.add(key);
const header = card.querySelector('div.header');
const statusSpan = header ? header.querySelector('.text-header-auto span') : null;
const statusText = norm(statusSpan ? statusSpan.textContent : '');
const isignalLink = card.querySelector('a.button-autocopy[href^="/channels/isignal/"]') ||
card.querySelector('a[href^="/channels/isignal/"]');
const isignalHref = isignalLink ? isignalLink.getAttribute('href') : '';
const m = isignalHref ? String(isignalHref).match(/\/channels\/isignal\/(\d+)/) : null;
const isignalId = m ? m[1] : '';
out.push({ name, isignalId, statusText });
});
return { ok: true, channels: out };
}
catch (e) {
return { ok: false, error: String(e) };
}
}
});
const payload = results && results[0] && results[0].result ? results[0].result : null;
if (!payload || !payload.ok) {
const err = payload && payload.error ? payload.error : 'Gagal scan iSignal';
try {
const cached = await bg_storageLocalGet(['tfIsignalActiveChannels']);
const cachedChannels = Array.isArray(cached && cached.tfIsignalActiveChannels) ? cached.tfIsignalActiveChannels : [];
if (cachedChannels.length) {
sendResponse({ ok: true, channels: cachedChannels, cached: true, warning: String(err) });
return;
}
}
catch (e) { }
sendResponse({ ok: false, error: String(err) });
return;
}
let channels = Array.isArray(payload.channels) ? payload.channels : [];
if (!channels.length) {
try {
const cached = await bg_storageLocalGet(['tfIsignalActiveChannels']);
const cachedChannels = Array.isArray(cached && cached.tfIsignalActiveChannels) ? cached.tfIsignalActiveChannels : [];
if (cachedChannels.length) channels = cachedChannels;
}
catch (e) { }
}
try {
channels.sort((a, b) => {
const an = String(a && a.name ? a.name : '').toLowerCase();
const bn = String(b && b.name ? b.name : '').toLowerCase();
if (an < bn)
return -1;
if (an > bn)
return 1;
return 0;
});
}
catch (e) { }
const now = Date.now();
let subCache = {};
try {
const saved = await bg_storageLocalGet([SUB_CACHE_KEY]);
if (saved && saved[SUB_CACHE_KEY] && typeof saved[SUB_CACHE_KEY] === 'object') {
subCache = saved[SUB_CACHE_KEY] || {};
}
}
catch (e) { }
const missing = [];
try {
channels.forEach((ch) => {
const id = ch && ch.isignalId ? String(ch.isignalId).trim() : '';
if (!id)
return;
const cached = subCache[id];
if (cached && typeof cached === 'object') {
const age = now - (cached.at || 0);
if (cached.subEndOn && age >= 0 && age < SUB_CACHE_TTL_MS) {
ch.subscriptionEndOn = String(cached.subEndOn).trim();
return;
}
}
missing.push(ch);
});
}
catch (e) { }
try {
await bg_storageLocalSet({
tfIsignalActiveChannels: channels || [],
tfIsignalActiveChannelsAt: Date.now(),
[SUB_CACHE_KEY]: subCache || {},
tfIsignalSubEndsAt: Date.now()
});
}
catch (e) { }
sendResponse({ ok: true, channels: channels || [] });
(async () => {
const opened = [];
try {
const ids = missing
.map((ch) => (ch && ch.isignalId ? String(ch.isignalId).trim() : ''))
.filter((x) => !!x);
if (ids.length === 0) {
try {
bg_emitRuntimeMessage({ type: 'tf_isignal_sub_end_progress', isignalId: '__DONE__', done: true });
}
catch (e) { }
return;
}

// REV165: open every Subscription end on detail page together as inactive
// tabs in the iSignalUsers caller window. Never activate a worker tab and
// never focus a Chrome window. The user remains free to switch tabs.
const owner = await bg_resolveSilentOwner(sender && sender.tab ? sender.tab.id : null);
const ownerWindowId = owner && owner.windowId != null ? owner.windowId : null;
const created = await Promise.all(ids.map(async (id) => {
try {
const urlDetail = 'https://account.tradersfamily.id/channels/isignal/' + id;
const tab = await bg_createTab(urlDetail, false, ownerWindowId);
const detailTabId = tab && tab.id != null ? tab.id : null;
return detailTabId != null ? { id, tabId: detailTabId, loaded: false } : null;
}
catch (e) {
return null;
}
}));
for (const item of created) {
if (item && item.tabId != null) opened.push(item);
}

// Barrier: do not extract a single Subscription end on value until every
// successfully-created background tab has completed its page load (or its
// individual load wait has ended). This preserves the requested all-open ->
// all-loaded -> extract sequence.
await Promise.all(opened.map(async (item) => {
try {
await bg_waitForTabLoaded(item.tabId, 45000);
item.loaded = true;
}
catch (e) {
item.loaded = false;
}
}));
try { await bg_sleep(250); } catch (e) { }

// After the global loading barrier, extract in stable A-Z/id order. Each tab
// remains inactive and is closed immediately after its value is collected.
for (let i = 0; i < opened.length; i++) {
const item = opened[i];
const id = item && item.id ? String(item.id) : '';
const detailTabId = item && item.tabId != null ? item.tabId : null;
if (!id || detailTabId == null) continue;
let out = null;
try {
const rr = await chrome.scripting.executeScript({
target: { tabId: detailTabId },
func: async () => {
try {
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const href = String(location && location.href ? location.href : '');
if (/\/login\b/i.test(href) || /auth\//i.test(href)) {
return { ok: false, error: 'NOT_LOGGED_IN' };
}
let txt = '';
for (let t = 0; t < 50; t++) {
const blocks = Array.from(document.querySelectorAll('.sum-rate'));
for (const b of blocks) {
const all = (b.textContent || '').toLowerCase();
if (all.includes('subscription end on')) {
const sp = b.querySelector('span.startOff') || b.querySelector('span');
if (sp && sp.textContent) {
txt = String(sp.textContent).trim();
break;
}
}
}
if (!txt) {
const sp2 = document.querySelector('span.startOff');
if (sp2 && sp2.textContent) txt = String(sp2.textContent).trim();
}
if (txt) break;
await sleep(250);
}
return { ok: true, subEndOn: txt || '' };
}
catch (e) {
return { ok: false, error: String(e) };
}
}
});
out = rr && rr[0] && rr[0].result ? rr[0].result : null;
}
catch (e) {
out = { ok: false, error: String(e) };
}

const subEndOn = out && out.ok && out.subEndOn ? String(out.subEndOn).trim() : '';
try {
const ch = channels.find((x) => String(x && x.isignalId ? x.isignalId : '') === id);
if (ch) ch.subscriptionEndOn = subEndOn || '';
}
catch (
~~~

### tfMyfxbookPrices 1
~~~js
t.id); });
}
catch (e) { }
for (const id of Array.from(ids)) {
try {
chrome.tabs.sendMessage(id, { type: 'stopScan' }, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
}
for (const id of Array.from(ids)) {
try {
await bg_removeTab(id);
}
catch (e) { }
}
try {
if (tf_batchScanState && tf_batchScanState.activeTabIds)
tf_batchScanState.activeTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.allTabIds)
tf_batchScanState.allTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.pairTabIds)
tf_batchScanState.pairTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.allWindowIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.scanWindowId = null;
}
catch (e) { }
try {
if (typeof tf_scanWindowId !== 'undefined')
tf_scanWindowId = null;
}
catch (e) { }
}
catch (e) {
console.warn('tf_stopAllActiveScanTabs error', e);
}
}
function bg_createTab(url, makeActive = true, windowId = null) {
return new Promise((resolve, reject) => {
const createData = { url, active: !!makeActive };
if (windowId != null)
createData.windowId = windowId;
chrome.tabs.create(createData, (tab) => {
if (chrome.runtime.lastError) {
reject(chrome.runtime.lastError);
}
else {
resolve(tab);
}
});
});
}

// REV164 passive background-tab helpers.
// Background automation never activates a tab or focuses a Chrome window.
// iSignalUsers.html is only the initial/default tab; user navigation is never overridden.
function bg_getTabSafe(tabId) {
return new Promise((resolve) => {
if (tabId == null) return resolve(null);
try {
chrome.tabs.get(tabId, (tab) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve(tab || null);
});
}
catch (e) { resolve(null); }
});
}

function bg_getForegroundTabSafe() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve((tabs && tabs[0]) ? tabs[0] : null);
});
}
catch (e) { resolve(null); }
});
}

async function bg_resolveSilentOwner(preferredOwnerTabId = null) {
let owner = await bg_getTabSafe(preferredOwnerTabId);
if (!owner) owner = await bg_getForegroundTabSafe();
return owner || null;
}

// Kept as no-ops for compatibility with older call sites. REV164 no longer
// records a fixed owner tab and never restores focus programmatically.
function bg_releaseSilentTab(tabId) { void tabId; }
async function bg_restoreSilentOwner(tabId) { void tabId; }

async function bg_createSilentTab(url, preferredOwnerTabId = null) {
const owner = await bg_resolveSilentOwner(preferredOwnerTabId);
const ownerWindowId = owner && owner.windowId != null ? owner.windowId : null;
return bg_createTab(url, false, ownerWindowId);
}

async function bg_createTransientSilentTab(url, preferredOwnerTabId = null) {
return bg_createSilentTab(url, preferredOwnerTabId);
}

function bg_createWindowWithUrl(url, opts) {
return new Promise((resolve) => {
try {
const createData = {
url: url,
type: (opts && opts.type) ? String(opts.type) : 'normal',
focused: false,
width: (opts && typeof opts.width === 'number') ? opts.width : 1250,
height: (opts && typeof opts.height === 'number') ? opts.height : 900
};
chrome.windows.create(createData, async (w) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const windowId = (w && w.id != null) ? w.id : null;
let tabId = null;
try {
if (w && w.tabs && w.tabs.length && w.tabs[0] && w.tabs[0].id != null) {
tabId = w.tabs[0].id;
}
else if (windowId != null) {
const tabs = await new Promise((res) => {
try {
chrome.tabs.query({ windowId }, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
res(t || []);
});
}
catch (e) {
res([]);
}
});
if (tabs && tabs[0] && tabs[0].id != null)
tabId = tabs[0].id;
}
}
catch (e) { }
resolve({ windowId, tabId });
});
}
catch (e) {
resolve({ windowId: null, tabId: null });
}
});
}
function bg_removeWindow(windowId) {
return new Promise((resolve) => {
if (windowId == null)
return resolve();
try {
chrome.windows.remove(windowId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_getActiveTabId() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
const id = (tabs && tabs[0] && tabs[0].id != null) ? tabs[0].id : null;
resolve(id);
});
}
catch (e) {
resolve(null);
}
});
}
function bg_activateTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.update(tabId, { active: true }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_queryTabsByUrl(urlOrPattern) {
return new Promise((resolve) => {
try {
chrome.tabs.query({ url: urlOrPattern }, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(tabs || []);
});
}
catch (e) {
resolve([]);
}
});
}
function bg_reloadTab(tabId, bypassCache = true) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(false);
try {
chrome.tabs.reload(tabId, { bypassCache: !!bypassCache }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
async function bg_openOrReloadDashboard(opts) {
const activate = !!(opts && opts.activate);
const dashUrl = chrome.runtime.getURL('dashboard.html');
const existing = await bg_queryTabsByUrl(dashUrl + '*');
if (existing && existing.length && existing[0].id != null) {
const t = existing[0];
await bg_reloadTab(t.id, true);
if (activate)
await bg_activateTab(t.id);
return { reused: true, tabId: t.id };
}
const created = await bg_createTab(dashUrl, activate);
return { reused: false, tabId: (created && created.id != null) ? created.id : null };
}
function bg_removeTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.remove(tabId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
// REV217 — close ONLY tabs explicitly marked as disposable probes.
// Never close account.tradersfamily.id URLs merely because they contain tfAuth=1:
// tfAuth=1 is also used by real user-driven Standard / MT4 / Google login tabs.
// The old broad URL query could race with a fresh manual login tab and close it
// immediately after the user clicked Masuk / MetaTrader 4 / Google.
async function bg_closeTransientLoginTabs(extraTabIds) {
const ids = new Set();
try {
  (Array.isArray(extraTabIds) ? extraTabIds : []).forEach((id) => {
    if (id != null && Number.isFinite(Number(id))) ids.add(Number(id));
  });
} catch (e) { }

// Explicit disposable root probes use tfTransientProbe=1. This marker is never
// added to manual authentication tabs, so startup/idle cleanup cannot kill login.
try {
  const marked = await new Promise((resolve) => {
    try {
      chrome.tabs.query({ url: 'https://tradersfamily.id/*tfTransientProbe=1*' }, (tabs) => {
        try { void chrome.runtime.lastError; } catch (e) { }
        resolve(tabs || []);
      });
    } catch (e) { resolve([]); }
  });
  (marked || []).forEach((t) => { if (t && t.id != null) ids.add(Number(t.id)); });
} catch (e) { }

for (const id of Array.from(ids)) {
  try { await bg_removeTab(id); } catch (e) { }
}

// Legacy ID-only state is unsafe across Chrome/browser restarts because a stale
// numeric tab id can later belong to a completely different tab. Remove it only;
// never use it as authority for closing a tab.
try {
  await bg_storageLocalRemove(['tfLoginTransientTabIds']);
} catch (e) {
  try { chrome.storage.local.remove(['tfLoginTransientTabIds'], () => {}); } catch (err) { }
}
}
function bg_waitForTabLoaded(tabId, timeoutMs = 30000) {
return new Promise((resolve) => {
let done = false;
function finish() {
if (done)
return;
done = true;
try {
clearTimeout(timer);
}
catch (e) { }
try {
chrome.tabs.onUpdated.removeListener(listener);
}
catch (e) { }
try {
chrome.tabs.onRemoved.removeListener(removedListener);
}
catch (e) { }
resolve();
}
const timer = setTimeout(() => {
finish();
}, timeoutMs);
function listener(id, changeInfo, tab) {
if (id === tabId && changeInfo && changeInfo.status === 'complete') {
finish();
}
}
function removedListener(id) {
if (id === tabId) {
finish();
}
}
try {
chrome.tabs.onUpdated.addListener(listener);
chrome.tabs.onRemoved.addListener(removedListener);
}
catch (e) { }
try {
chrome.tabs.get(tabId, (tab) => {
if (done)
return;
if (chrome.runtime && chrome.runtime.lastError) {
return;
}
if (tab && tab.status === 'complete') {
finish();
}
});
}
catch (e) {
}
});
}
async function bg_waitForContentScriptReady(tabId, timeoutMs = 12000) {
const start = Date.now();
while (Date.now() - start < timeoutMs) {
try {
const resp = await bg_sendMessage(tabId, { type: 'ping' }, 1500);
if (resp && resp.ok)
return true;
}
catch (e) {
}
await bg_sleep(250);
}
return false;
}
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let bg_myfxbookPriceJob = null;
function bg_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function bg_storageLocalSet(obj) {
return new Promise((resolve) => {
try {
chrome.storage.local.set(obj, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
async function bg_scrapeMyfxbookPricesFromTab(tabId) {
const start = Date.now();
const timeoutMs = 20000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const tbl = document.querySelector('table#results.pipCalcResults') || document.querySelector('table#results') || document.querySelector('table.pipCalcResults');
if (!tbl)
return null;
const rows = tbl.querySelectorAll('tbody tr');
if (!rows || !rows.length)
return null;
const out = {};
rows.forEach((tr) => {
const a = tr.querySelector('td.bold a') || tr.querySelector('td a');
let pairTxt = a ? String(a.textContent || '').trim() : '';
pairTxt = pairTxt.replace(/\s+/g, '').toUpperCase();
if (!pairTxt)
return;
const pairKey = pairTxt.replace(/[^A-Z0-9]/g, '');
if (!pairKey)
return;
const priceTd = tr.querySelector('td[id^="price_"]') || (tr.children && tr.children.length > 1 ? tr.children[1] : null);
let v = priceTd ? String(priceTd.textContent || '').trim() : '';
v = v.replace(/\s+/g, '').trim();
if (v)
out[pairKey] = v;
});
if (!out || Object.keys(out).length === 0)
return null;
return { prices: out, rowCount: rows.length };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.prices && typeof payload.prices === 'object') {
return payload;
}
}
catch (e) {
}
await bg_sleep(500);
}
return null;
}
async function bg_scrapeGoldPriceFromTab(tabId) {
const start = Date.now();
const timeoutMs = 25000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const el = document.querySelector('[data-test="instrument-price-last"]');
if (!el)
return null;
let t = String(el.textContent || '').trim();
if (!t)
return null;
t = t.replace(/\s+/g, '');
const m = t.match(/[0-9][0-9.,]*/);
if (!m)
return null;
const price = m[0];
if (!price)
return null;
return { price };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.price)
return String(payload.price);
}
catch (e) {
}
await bg_sleep(600);
}
return null;
}
async function bg_ensureMyfxbookPrices(opts) {
const force = !!(opts && opts.force);
if (bg_myfxbookPriceJob)
return bg_myfxbookPriceJob;
bg_myfxbookPriceJob = (async () => {
const now = Date.now();
const cached = await bg_storageLocalGet([TF_MYFXBOOK_PRICES_AT_KEY]);
const lastAt = cached && cached[TF_MYFXBOOK_PRICES_AT_KEY] ? Number(cached[TF_MYFXBOOK_PRICES_AT_KEY]) : 0;
const ageMs = now - (Number.isFinite(lastAt) ? lastAt : 0);
if (!force && lastAt && ageMs >= 0 && ageMs < 10 * 60 * 1000) {
return { ok: true, skipped: true, ageMs };
}
const url = 'https://id.investing.com/tools/forex-pip-calculator?tfext_investing=1&t=' + now;
let tab = null;
try {
tab = await bg_createTab(url, false);
}
catch (e) {
tab = null;
}
const tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
return { ok: false, error: 'Gagal membuka tab Investing.com.' };
}
let prices = {};
try {
await bg_waitForTabLoaded(tabId, 45000);
await bg_sleep(600);
const scraped = await bg_scrapeMyfxbookPricesFromTab(tabId);
if (!scraped || scraped.error) {
return { ok: false, error: scraped && scraped.error ? scraped.error : 'Gagal membaca tabel Pip Calculator di Investing.com.' };
}
prices = scraped.prices || {};
}
finally {
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
let goldTabId = null;
try {
const goldUrl = 'https://id.investing.com/commodities/gold?tfext_investing=1&t=' + now;
const gtab = await bg_createTab(goldUrl, false);
goldTabId = gtab && gtab.id != null ? gtab.id : null;
if (goldTabId != null) {
await bg_waitForTabLoaded(goldTabId, 45000);
await bg_sleep(800);
const goldPrice = await bg_scrapeGoldPriceFromTab(goldTabId);
if (goldPrice && String(goldPrice).trim()) {
prices['XAUUSD'] = String(goldPrice).trim();
}
}
}
catch (e) {
}
finally {
if (goldTabId != null) {
try {
await bg_removeTab(goldTabId);
}
catch (e) { }
}
}
const at = Date.now();
await bg_storageLocalSet({
[TF_MYFXBOOK_PRICES_KEY]: prices,
[TF_MYFXBOOK_PRICES_AT_KEY]: at
});
return { ok: true, count: Object.keys(prices).length, at };
})().finally(() => {
bg_myfxbookPriceJob = null;
});
return bg_myfxbookPriceJob;
}
function bg_getTabInfo(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(null);
try {
chrome.tabs.get(tabId, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!t)
return resolve(null);
resolve({
id: t.id,
url: t.url ? String(t.url) : '',
pendingUrl: t.pendingUrl ? String(t.pendingUrl) : '',
status: t.status ? String(t.status) : ''
});
});
}
catch (e) {
resolve(null);
}
});
}
async function bg_waitForTabUrlMatch(tabId, regex, timeoutMs = 8000, pollMs = 250) {
const start = Date.now();
let lastUrl = '';
while (Date.now() - start < timeoutMs) {
const info = await bg_getTabInfo(tabId);
if (!info)
return { matched: false, url: lastUrl };
const u = (info.pendingUrl || info.url || '').trim();
lastUrl = u;
if (u && regex.test(u))
return { matched: true, url: u };
await bg_sleep(pollMs);
}
return { matched: false, url: lastUrl };
}
async function bg_probeRootStateByDom(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
function isVisible(el) {
try {
if (!el)
return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0'))
return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
const hasBox = r ? (r.width > 0 && r.height > 0) : true;
const hasRects = el.getClientRects ? (el.getClientRects().length > 0) : true;
return !!(hasBox && hasRects);
}
catch (e) {
return false;
}
}
try {
const masukCandidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const daftarCandidates = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/register"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]'),
Array.from(document.querySelectorAll('li.user.user-menu.m a')).find(a => /\bDaftar\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masukEl = masukCandidates.find(isVisible) || masukCandidates[0] || null;
const daftarEl = daftarCandidates.find(isVisible) || daftarCandidates[0] || null;
const profileCandidates = [
document.querySelector('li.x-menu-item-login.reglog a[title="User Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a[title*="Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login.sudah[title="User Profile"]'),
document.querySelector('a.x-btn-navbar-login.sudah[href*="account.tradersfamily.id/profile"]'),
document.querySelector('a.x-btn-navbar-login[title="User Profile"]'),
document.querySelector('li.user.user-menu a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('nav a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('header a[href*="account.tradersfamily.id/profile"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.x-menu-item-login.reglog a, li.user.user-menu a')).find(a => /^(?:User\s*)?Profile$/i.test(String(a.textContent || '').replace(/\s+/g, ' ').trim()))
].filter(Boolean);
const profileEl = profileCandidates.find(isVisible) || profileCandidates[0] || null;
// REV210 — login confirmation accepts either of the two positive markers seen on
// TradersFamily after a real login: Profile/User Profile OR the live Online status.
// The disposable fresh tab remains the authority; stale/open tabs are not consulted.
const onlineCandidates = Array.from(document.querySelectorAll('small')).filter((el) => {
try {
if (!isVisible(el)) return false;
const icon = el.querySelector('i.fa.fa-circle');
if (!icon) return false;
return /^Online$/i.test(String(el.textContent || '').replace(/\s+/g, ' ').trim());
}
catch (e) { return false; }
});
const onlineEl = onlineCandidates[0] || null;
const hasOnlineMarker = !!onlineEl;
const hasVisibleProfile = !!(profileEl && isVisible(profileEl));
const hasVisibleLogout = !!((masukEl && isVisible(masukEl)) || (daftarEl && isVisible(daftarEl)));
// Explicit Masuk/Daftar has highest priority: the fresh page is logged out.
if (hasVisibleLogout)
return 'logged_out';
// A visible Profile/User Profile OR visible Online is sufficient positive evidence.
// This avoids falsely sending an already logged-in user back to Login when the
// Online badge is rendered later, omitted by a responsive layout, or not yet hydrated.
if (hasVisibleProfile || hasOnlineMarker)
return 'logged_in';
// Responsive fallback for elements that exist but have no box in the current viewport.
if (profileEl && !masukEl && !daftarEl)
return 'logged_in';
if ((masukEl || daftarEl) && !profileEl)
return 'logged_out';
return 'unknown';
}
catch (e) {
return 'unknown';
}
}
});
if (injected && injected[0] && typeof injected[0].result === 'string') {
return injected[0].result;
}
}
catch (e) {
}
return 'unknown';
}
async function bg_clickRootMasuk(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
} catch (e) { return false; }
};
const candidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masuk = candidates.find(visible) || candidates[0] || null;
if (!masuk) return false;
masuk.click();
return true;
} catch (e) { return false; }
}
});
return !!(injected && injected[0] && injected[0].result === true);
} catch (e) { return false; }
}
async function bg_isManualAuthActiveForLoginProbe() {
try {
const d = await bg_storageLocalGet(['tfManualAuthActive', 'tfManualAuthStartedAt', 'tfPendingLogin', 'tfPendingGoogleLogin']);
if (!d || d.tfManualAuthActive !== true)
return false;
const startedAt = Number(d.tfManualAuthStartedAt || 0);
// A manual auth flow should never be interrupted by the periodic health checker.
// Treat it as active for up to 10 minutes; startup cleanup clears stale state.
if (startedAt > 0 && Date.now() - startedAt >= 0 && Date.now() - startedAt < 10 * 60 * 1000)
return true;
if (d.tfPendingLogin || d.tfPendingGoogleLogin)
return true;
return false;
}
catch (e) { return false; }
}

async function bg_isScanActiveForLoginProbe() {
try {
if (tf_batchScanState && tf_batchScanState.active && !tf_batchScanState.stopRequested)
return true;
}
catch (e) { }
try {
const stored = await bg_storageLocalGet(['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt']);
if (!stored || stored.tfScanInProgress !== true)
return false;
const now = Date.now();
const heartbeatAt = Number(stored.tfActiveScanHeartbeatAt || 0);
const progressAt = Number(stored.tfActiveScanProgressAt || 0);
// A live heartbeat/progress proves that a long batch is still working.
// Even when no heartbeat has been written yet, tfScanInProgress itself is enough
// to defer a periodic auth probe for the duration of the active scan.
if ((heartbeatAt > 0 && now - heartbeatAt < 120000) || (progressAt > 0 && now - progressAt < 120000))
return true;
return true;
}
catch (e) { return false; }
}
// REV215 — secondary account-session verifier for idle periodic checks.
// The public tradersfamily.id root can transiently show Masuk/Daftar even when the
// authenticated account session is still valid. Verify the protected account area
// before treating a root logout marker as meaningful. This helper NEVER changes UI state.
async function bg_verifyAccountSessionByFetch() {
let controller = null;
let timeout = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_periodic_verify=1&ts=' + Date.now();
controller = new AbortController();
timeout = setTimeout(() => { try { controller.abort(); } catch (e) { } }, 12000);
const resp = await fetch(url, {
method: 'GET',
credentials: 'include',
cache: 'no-store',
redirect: 'follow',
headers: { 'Cache-Control': 'no-cache' },
signal: controller.signal
});
if (timeout) { clearTimeout(timeout); timeout = null; }
const finalUrl = String(resp && resp.url || '');
let body = '';
try { body = String(await resp.text()).slice(0, 260000); } catch (e) { }
const loginByUrl = /\/login(?:mt)?\/?(?:$|[?#])/i.test(finalUrl);
const loginByForm = /id=["'](?:logname|logpass|btn-signin)["']/i.test(body);
const loginByMessage = /Silahkan\s*login\s*untuk\s*mengakses/i.test(body);
if (loginByUrl || loginByForm || loginByMessage)
return { state: 'logged_out', finalUrl, httpStatus: Number(resp && resp.status || 0) };
if (resp && resp.ok)
return { state: 'logged_in', finalUrl, httpStatus: Number(resp.status || 0) };
return { state: 'unknown', finalUrl, httpStatus: Number(resp && resp.status || 0) };
}
catch (e) {
try { if (timeout) clearTimeout(timeout); } catch (err) { }
return { state: 'unknown', error: String(e && e.message ? e.message : e) };
}
}

// REV368 — strict preflight used before Update.
// Do not trust already-open TradersFamily tabs here: their rendered DOM can be stale
// after the server session has expired. The authoritative first check is a fresh,
// no-cache authenticated request to the protected account area. Only if that request
// is inconclusive do we open a disposable cache-busted probe tab.
async function bg_refreshOpenTradersFamilyTabsAfterStrictLogout() {
try {
const tabs = await chrome.tabs.query({ url: ['https://account.tradersfamily.id/*', 'https://tradersfamily.id/*'] });
for (const tab of (tabs || [])) {
if (!tab || tab.id == null) continue;
try {
await chrome.tabs.reload(tab.id, { bypassCache: true });
}
catch (e) { }
}
}
catch (e) { }
}
async function bg_markStrictUpdateLogout() {
const now = Date.now();
try {
await bg_storageLocalSet({
tfLoginConfirmed: false,
tfLoginConfirmedAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true,
tfProfileNeedsRefresh: false,
tfPeriodicLogoutAt: now,
tfLoginError: 'Session TradersFamily tidak aktif. Silakan login kembali sebelum Update.'
});
}
catch (e) { }
try {
await new Promise((resolve) => {
try {
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) { resolve(); }
});
}
catch (e) { }
try { await bg_refreshOpenTradersFamilyTabsAfterStrictLogout(); } catch (e) { }
}
async function bg_verifyLoginBeforeUpdateStrict(ownerTabId) {
const startedAt = Date.now();
const network = await bg_verifyAccountSessionByFetch();
if (network && network.state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state: 'logged_in', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
if (network && network.state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state: 'logged_out', code: 'TF_SESSION_EXPIRED', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
let probeTabId = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_update_login_preflight=1&ts=' + Date.now();
const tab = await bg_createTransientSilentTab(url, ownerTabId != null ? ownerTabId : null);
probeTabId = tab && tab.id != null ? tab.id : null;
if (probeTabId == null) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNAVAILABLE', source: 'fresh_probe_unavailable', elapsedMs: Date.now() - startedAt };
}
try { await bg_waitForTabLoaded(probeTabId, 30000); } catch (e) { }
await bg_sleep(500);
const state = await bg_probeRootStateByDom(probeTabId);
if (state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state, source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
if (state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state, code: 'TF_SESSION_EXPIRED', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNKNOWN', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
catch (e) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR', error: String(e && e.message ? e.message : e), elapsedMs: Date.now() - startedAt };
}
finally {
if (probeTabId != null) {
try { await bg_removeTab(probeTabId); } catch (e) { }
}
}
}

async function bg_runPeriodicLoginProbe(source) {
const src = source ? String(source) : 'alarm';
if (bg_loginProbeJob)
return bg_loginProbeJob;
bg_loginProbeJob = (async () => {
// REV217: a real user-driven login always wins over background health checks.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}
// REV214: never let a background/session health probe interrupt an active batch scan.
if (await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV214: every periodic root check uses a disposable tab that is ALWAYS closed
// immediately after that individual probe completes. Do not use the broad
// bg_closeTransientLoginTabs() here because a user may be performing a real login
// in another auth tab at the same time.
async function runDisposableRootProbe(initialDelayMs, retryDelays) {
let created = null;
let probeState = 'unknown';
try {
created = await bg_openTfRootTabFresh(false);
const probeTabId = created && created.id != null ? created.id : null;
if (probeTabId == null)
return 'unknown';
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabId: probeTabId,
tfLastPeriodicProbeTabOpenedAt: Date.now(),
tfLastPeriodicProbeSource: src
});
}
catch (e) { }
try { await bg_waitForTabLoaded(probeTabId, 60000); } catch (e) { }
if (initialDelayMs > 0) {
try { await bg_sleep(initialDelayMs); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
const delays = Array.isArray(retryDelays) ? retryDelays : [];
for (const delay of delays) {
if (probeState !== 'unknown') break;
if (delay > 0) {
try { await bg_sleep(delay); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
}
return probeState;
}
catch (e) {
return 'unknown';
}
finally {
const closeId = created && created.id != null ? created.id : null;
if (closeId != null) {
try { await bg_removeTab(closeId); } catch (e) { }
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabClosedId: closeId,
tfLastPeriodicProbeTabClosedAt: Date.now(),
tfLastPeriodicProbeTabCloseSource: src
});
}
catch (e) { }
}
}
}

// First disposable probe: give TradersFamily enough time to complete its normal render.
let state = await runDisposableRootProbe(10000, [2000, 4000]);
// If the first tab was inconclusive it has already been closed by finally above.
// Only then create a second disposable tab for a short retry.
if (state === 'unknown') {
state = await runDisposableRootProbe(1200, [1200, 1800]);
}

// REV217: if the user started a real login while this background probe was
// still running, discard the probe result completely. Manual authentication wins.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}

// An inconclusive disposable probe is NOT evidence of logout.
if (state === 'unknown') {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeUnknownAt: Date.now(),
tfPeriodicLoginProbeUnknownSource: src
});
}
catch (e) { }
return { ok: true, state: 'unknown', preserved: true };
}

// A probe may have started immediately before a scan. Re-check before applying any
// session conclusion. Active scan always wins.
if (state === 'logged_out' && await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV215: a root-tab logout marker is only a CANDIDATE. Confirm against the protected
// account endpoint. Even when both observations look logged-out, an idle background
// health check is not allowed to throw the user out of the Side Panel. Real user-driven
// requests/content scripts still emit SESSION_EXPIRED when the server truly requires login.
let accountVerify = null;
if (state === 'logged_out') {
try { accountVerify = await bg_verifyAccountSessionByFetch(); } catch (e) { accountVerify = { state: 'unknown' }; }
if (accountVerify && accountVerify.state === 'logged_in') {
state = 'logged_in';
} else {
const stateAt = Date.now();
let previous = null;
try { previous = await bg_storageLocalGet(['tfPeriodicLogoutCandidateAt', 'tfPeriodicLogoutCandidateCount']); } catch (e) { previous = null; }
const prevAt = Number(previous && previous.tfPeriodicLogoutCandidateAt || 0);
const prevCount = Number(previous && previous.tfPeriodicLogoutCandidateCount || 0);
const withinWindow = prevAt > 0 && (stateAt - prevAt) >= 0 && (stateAt - prevAt) < (90 * 60 * 1000);
const nextCount = withinWindow ? Math.min(99, prevCount + 1) : 1;
try {
await bg_storageLocalSet({
tfPeriodicLogoutCandidateAt: stateAt,
tfPeriodicLogoutCandidateCount: nextCount,
tfPeriodicLogoutCandidateSource: src,
tfPeriodicLogoutCandidateAccountState: accountVerify && accountVerify.state ? String(accountVerify.state) : 'unknown',
tfPeriodicLogoutCandidateAccountUrl: accountVerify && accountVerify.finalUrl ? String(accountVerify.finalUrl).slice(0, 500) : '',
tfPeriodicLoginProbePreservedAt: stateAt,
tfPeriodicLoginProbePreservedReason: 'IDLE_PROBE_LOGOUT_CANDIDATE',
// Critical: preserve current authenticated UI. Never force Login from periodic health checks.
tfForceLoginForm: false
});
}
catch (e) { }
return { ok: true, state: 'logged_out_candidate', preserved: true, candidateCount: nextCount, accountState: accountVerify && accountVerify.state ? accountVerify.state : 'unknown' };
}
}

const stateAt = Date.now();
if (state === 'logged_in') {
try {
await bg_storageLocalSet({
tfRootLoginState: 'logged_in',
tfRootLoginStateAt: stateAt,
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: stateAt,
tfLoginConfirmed: true,
tfLoginConfirmedAt: stateAt,
tfForceLoginForm: false,
tfPeriodicLogoutCandidateAt: 0,
tfPeriodicLogoutCandidateCount: 0,
tfPeriodicLogoutCandidateAccountState: '',
tfPeriodicLoginProbeConfirmedAt: stateAt,
tfPeriodicLoginProbeConfirmedSource: src
});
} catch (e) { }
}
return { ok: true, state };
})().finally(() => {
bg_loginProbeJob = null;
});
return bg_loginProbeJob;
}
function bg_sendMess
~~~

### tfMyfxbookPrices 2
~~~js
(ids)) {
try {
chrome.tabs.sendMessage(id, { type: 'stopScan' }, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
}
for (const id of Array.from(ids)) {
try {
await bg_removeTab(id);
}
catch (e) { }
}
try {
if (tf_batchScanState && tf_batchScanState.activeTabIds)
tf_batchScanState.activeTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.allTabIds)
tf_batchScanState.allTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.pairTabIds)
tf_batchScanState.pairTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.allWindowIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.scanWindowId = null;
}
catch (e) { }
try {
if (typeof tf_scanWindowId !== 'undefined')
tf_scanWindowId = null;
}
catch (e) { }
}
catch (e) {
console.warn('tf_stopAllActiveScanTabs error', e);
}
}
function bg_createTab(url, makeActive = true, windowId = null) {
return new Promise((resolve, reject) => {
const createData = { url, active: !!makeActive };
if (windowId != null)
createData.windowId = windowId;
chrome.tabs.create(createData, (tab) => {
if (chrome.runtime.lastError) {
reject(chrome.runtime.lastError);
}
else {
resolve(tab);
}
});
});
}

// REV164 passive background-tab helpers.
// Background automation never activates a tab or focuses a Chrome window.
// iSignalUsers.html is only the initial/default tab; user navigation is never overridden.
function bg_getTabSafe(tabId) {
return new Promise((resolve) => {
if (tabId == null) return resolve(null);
try {
chrome.tabs.get(tabId, (tab) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve(tab || null);
});
}
catch (e) { resolve(null); }
});
}

function bg_getForegroundTabSafe() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve((tabs && tabs[0]) ? tabs[0] : null);
});
}
catch (e) { resolve(null); }
});
}

async function bg_resolveSilentOwner(preferredOwnerTabId = null) {
let owner = await bg_getTabSafe(preferredOwnerTabId);
if (!owner) owner = await bg_getForegroundTabSafe();
return owner || null;
}

// Kept as no-ops for compatibility with older call sites. REV164 no longer
// records a fixed owner tab and never restores focus programmatically.
function bg_releaseSilentTab(tabId) { void tabId; }
async function bg_restoreSilentOwner(tabId) { void tabId; }

async function bg_createSilentTab(url, preferredOwnerTabId = null) {
const owner = await bg_resolveSilentOwner(preferredOwnerTabId);
const ownerWindowId = owner && owner.windowId != null ? owner.windowId : null;
return bg_createTab(url, false, ownerWindowId);
}

async function bg_createTransientSilentTab(url, preferredOwnerTabId = null) {
return bg_createSilentTab(url, preferredOwnerTabId);
}

function bg_createWindowWithUrl(url, opts) {
return new Promise((resolve) => {
try {
const createData = {
url: url,
type: (opts && opts.type) ? String(opts.type) : 'normal',
focused: false,
width: (opts && typeof opts.width === 'number') ? opts.width : 1250,
height: (opts && typeof opts.height === 'number') ? opts.height : 900
};
chrome.windows.create(createData, async (w) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const windowId = (w && w.id != null) ? w.id : null;
let tabId = null;
try {
if (w && w.tabs && w.tabs.length && w.tabs[0] && w.tabs[0].id != null) {
tabId = w.tabs[0].id;
}
else if (windowId != null) {
const tabs = await new Promise((res) => {
try {
chrome.tabs.query({ windowId }, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
res(t || []);
});
}
catch (e) {
res([]);
}
});
if (tabs && tabs[0] && tabs[0].id != null)
tabId = tabs[0].id;
}
}
catch (e) { }
resolve({ windowId, tabId });
});
}
catch (e) {
resolve({ windowId: null, tabId: null });
}
});
}
function bg_removeWindow(windowId) {
return new Promise((resolve) => {
if (windowId == null)
return resolve();
try {
chrome.windows.remove(windowId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_getActiveTabId() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
const id = (tabs && tabs[0] && tabs[0].id != null) ? tabs[0].id : null;
resolve(id);
});
}
catch (e) {
resolve(null);
}
});
}
function bg_activateTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.update(tabId, { active: true }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_queryTabsByUrl(urlOrPattern) {
return new Promise((resolve) => {
try {
chrome.tabs.query({ url: urlOrPattern }, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(tabs || []);
});
}
catch (e) {
resolve([]);
}
});
}
function bg_reloadTab(tabId, bypassCache = true) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(false);
try {
chrome.tabs.reload(tabId, { bypassCache: !!bypassCache }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
async function bg_openOrReloadDashboard(opts) {
const activate = !!(opts && opts.activate);
const dashUrl = chrome.runtime.getURL('dashboard.html');
const existing = await bg_queryTabsByUrl(dashUrl + '*');
if (existing && existing.length && existing[0].id != null) {
const t = existing[0];
await bg_reloadTab(t.id, true);
if (activate)
await bg_activateTab(t.id);
return { reused: true, tabId: t.id };
}
const created = await bg_createTab(dashUrl, activate);
return { reused: false, tabId: (created && created.id != null) ? created.id : null };
}
function bg_removeTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.remove(tabId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
// REV217 — close ONLY tabs explicitly marked as disposable probes.
// Never close account.tradersfamily.id URLs merely because they contain tfAuth=1:
// tfAuth=1 is also used by real user-driven Standard / MT4 / Google login tabs.
// The old broad URL query could race with a fresh manual login tab and close it
// immediately after the user clicked Masuk / MetaTrader 4 / Google.
async function bg_closeTransientLoginTabs(extraTabIds) {
const ids = new Set();
try {
  (Array.isArray(extraTabIds) ? extraTabIds : []).forEach((id) => {
    if (id != null && Number.isFinite(Number(id))) ids.add(Number(id));
  });
} catch (e) { }

// Explicit disposable root probes use tfTransientProbe=1. This marker is never
// added to manual authentication tabs, so startup/idle cleanup cannot kill login.
try {
  const marked = await new Promise((resolve) => {
    try {
      chrome.tabs.query({ url: 'https://tradersfamily.id/*tfTransientProbe=1*' }, (tabs) => {
        try { void chrome.runtime.lastError; } catch (e) { }
        resolve(tabs || []);
      });
    } catch (e) { resolve([]); }
  });
  (marked || []).forEach((t) => { if (t && t.id != null) ids.add(Number(t.id)); });
} catch (e) { }

for (const id of Array.from(ids)) {
  try { await bg_removeTab(id); } catch (e) { }
}

// Legacy ID-only state is unsafe across Chrome/browser restarts because a stale
// numeric tab id can later belong to a completely different tab. Remove it only;
// never use it as authority for closing a tab.
try {
  await bg_storageLocalRemove(['tfLoginTransientTabIds']);
} catch (e) {
  try { chrome.storage.local.remove(['tfLoginTransientTabIds'], () => {}); } catch (err) { }
}
}
function bg_waitForTabLoaded(tabId, timeoutMs = 30000) {
return new Promise((resolve) => {
let done = false;
function finish() {
if (done)
return;
done = true;
try {
clearTimeout(timer);
}
catch (e) { }
try {
chrome.tabs.onUpdated.removeListener(listener);
}
catch (e) { }
try {
chrome.tabs.onRemoved.removeListener(removedListener);
}
catch (e) { }
resolve();
}
const timer = setTimeout(() => {
finish();
}, timeoutMs);
function listener(id, changeInfo, tab) {
if (id === tabId && changeInfo && changeInfo.status === 'complete') {
finish();
}
}
function removedListener(id) {
if (id === tabId) {
finish();
}
}
try {
chrome.tabs.onUpdated.addListener(listener);
chrome.tabs.onRemoved.addListener(removedListener);
}
catch (e) { }
try {
chrome.tabs.get(tabId, (tab) => {
if (done)
return;
if (chrome.runtime && chrome.runtime.lastError) {
return;
}
if (tab && tab.status === 'complete') {
finish();
}
});
}
catch (e) {
}
});
}
async function bg_waitForContentScriptReady(tabId, timeoutMs = 12000) {
const start = Date.now();
while (Date.now() - start < timeoutMs) {
try {
const resp = await bg_sendMessage(tabId, { type: 'ping' }, 1500);
if (resp && resp.ok)
return true;
}
catch (e) {
}
await bg_sleep(250);
}
return false;
}
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let bg_myfxbookPriceJob = null;
function bg_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function bg_storageLocalSet(obj) {
return new Promise((resolve) => {
try {
chrome.storage.local.set(obj, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
async function bg_scrapeMyfxbookPricesFromTab(tabId) {
const start = Date.now();
const timeoutMs = 20000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const tbl = document.querySelector('table#results.pipCalcResults') || document.querySelector('table#results') || document.querySelector('table.pipCalcResults');
if (!tbl)
return null;
const rows = tbl.querySelectorAll('tbody tr');
if (!rows || !rows.length)
return null;
const out = {};
rows.forEach((tr) => {
const a = tr.querySelector('td.bold a') || tr.querySelector('td a');
let pairTxt = a ? String(a.textContent || '').trim() : '';
pairTxt = pairTxt.replace(/\s+/g, '').toUpperCase();
if (!pairTxt)
return;
const pairKey = pairTxt.replace(/[^A-Z0-9]/g, '');
if (!pairKey)
return;
const priceTd = tr.querySelector('td[id^="price_"]') || (tr.children && tr.children.length > 1 ? tr.children[1] : null);
let v = priceTd ? String(priceTd.textContent || '').trim() : '';
v = v.replace(/\s+/g, '').trim();
if (v)
out[pairKey] = v;
});
if (!out || Object.keys(out).length === 0)
return null;
return { prices: out, rowCount: rows.length };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.prices && typeof payload.prices === 'object') {
return payload;
}
}
catch (e) {
}
await bg_sleep(500);
}
return null;
}
async function bg_scrapeGoldPriceFromTab(tabId) {
const start = Date.now();
const timeoutMs = 25000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const el = document.querySelector('[data-test="instrument-price-last"]');
if (!el)
return null;
let t = String(el.textContent || '').trim();
if (!t)
return null;
t = t.replace(/\s+/g, '');
const m = t.match(/[0-9][0-9.,]*/);
if (!m)
return null;
const price = m[0];
if (!price)
return null;
return { price };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.price)
return String(payload.price);
}
catch (e) {
}
await bg_sleep(600);
}
return null;
}
async function bg_ensureMyfxbookPrices(opts) {
const force = !!(opts && opts.force);
if (bg_myfxbookPriceJob)
return bg_myfxbookPriceJob;
bg_myfxbookPriceJob = (async () => {
const now = Date.now();
const cached = await bg_storageLocalGet([TF_MYFXBOOK_PRICES_AT_KEY]);
const lastAt = cached && cached[TF_MYFXBOOK_PRICES_AT_KEY] ? Number(cached[TF_MYFXBOOK_PRICES_AT_KEY]) : 0;
const ageMs = now - (Number.isFinite(lastAt) ? lastAt : 0);
if (!force && lastAt && ageMs >= 0 && ageMs < 10 * 60 * 1000) {
return { ok: true, skipped: true, ageMs };
}
const url = 'https://id.investing.com/tools/forex-pip-calculator?tfext_investing=1&t=' + now;
let tab = null;
try {
tab = await bg_createTab(url, false);
}
catch (e) {
tab = null;
}
const tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
return { ok: false, error: 'Gagal membuka tab Investing.com.' };
}
let prices = {};
try {
await bg_waitForTabLoaded(tabId, 45000);
await bg_sleep(600);
const scraped = await bg_scrapeMyfxbookPricesFromTab(tabId);
if (!scraped || scraped.error) {
return { ok: false, error: scraped && scraped.error ? scraped.error : 'Gagal membaca tabel Pip Calculator di Investing.com.' };
}
prices = scraped.prices || {};
}
finally {
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
let goldTabId = null;
try {
const goldUrl = 'https://id.investing.com/commodities/gold?tfext_investing=1&t=' + now;
const gtab = await bg_createTab(goldUrl, false);
goldTabId = gtab && gtab.id != null ? gtab.id : null;
if (goldTabId != null) {
await bg_waitForTabLoaded(goldTabId, 45000);
await bg_sleep(800);
const goldPrice = await bg_scrapeGoldPriceFromTab(goldTabId);
if (goldPrice && String(goldPrice).trim()) {
prices['XAUUSD'] = String(goldPrice).trim();
}
}
}
catch (e) {
}
finally {
if (goldTabId != null) {
try {
await bg_removeTab(goldTabId);
}
catch (e) { }
}
}
const at = Date.now();
await bg_storageLocalSet({
[TF_MYFXBOOK_PRICES_KEY]: prices,
[TF_MYFXBOOK_PRICES_AT_KEY]: at
});
return { ok: true, count: Object.keys(prices).length, at };
})().finally(() => {
bg_myfxbookPriceJob = null;
});
return bg_myfxbookPriceJob;
}
function bg_getTabInfo(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(null);
try {
chrome.tabs.get(tabId, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!t)
return resolve(null);
resolve({
id: t.id,
url: t.url ? String(t.url) : '',
pendingUrl: t.pendingUrl ? String(t.pendingUrl) : '',
status: t.status ? String(t.status) : ''
});
});
}
catch (e) {
resolve(null);
}
});
}
async function bg_waitForTabUrlMatch(tabId, regex, timeoutMs = 8000, pollMs = 250) {
const start = Date.now();
let lastUrl = '';
while (Date.now() - start < timeoutMs) {
const info = await bg_getTabInfo(tabId);
if (!info)
return { matched: false, url: lastUrl };
const u = (info.pendingUrl || info.url || '').trim();
lastUrl = u;
if (u && regex.test(u))
return { matched: true, url: u };
await bg_sleep(pollMs);
}
return { matched: false, url: lastUrl };
}
async function bg_probeRootStateByDom(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
function isVisible(el) {
try {
if (!el)
return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0'))
return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
const hasBox = r ? (r.width > 0 && r.height > 0) : true;
const hasRects = el.getClientRects ? (el.getClientRects().length > 0) : true;
return !!(hasBox && hasRects);
}
catch (e) {
return false;
}
}
try {
const masukCandidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const daftarCandidates = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/register"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]'),
Array.from(document.querySelectorAll('li.user.user-menu.m a')).find(a => /\bDaftar\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masukEl = masukCandidates.find(isVisible) || masukCandidates[0] || null;
const daftarEl = daftarCandidates.find(isVisible) || daftarCandidates[0] || null;
const profileCandidates = [
document.querySelector('li.x-menu-item-login.reglog a[title="User Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a[title*="Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login.sudah[title="User Profile"]'),
document.querySelector('a.x-btn-navbar-login.sudah[href*="account.tradersfamily.id/profile"]'),
document.querySelector('a.x-btn-navbar-login[title="User Profile"]'),
document.querySelector('li.user.user-menu a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('nav a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('header a[href*="account.tradersfamily.id/profile"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.x-menu-item-login.reglog a, li.user.user-menu a')).find(a => /^(?:User\s*)?Profile$/i.test(String(a.textContent || '').replace(/\s+/g, ' ').trim()))
].filter(Boolean);
const profileEl = profileCandidates.find(isVisible) || profileCandidates[0] || null;
// REV210 — login confirmation accepts either of the two positive markers seen on
// TradersFamily after a real login: Profile/User Profile OR the live Online status.
// The disposable fresh tab remains the authority; stale/open tabs are not consulted.
const onlineCandidates = Array.from(document.querySelectorAll('small')).filter((el) => {
try {
if (!isVisible(el)) return false;
const icon = el.querySelector('i.fa.fa-circle');
if (!icon) return false;
return /^Online$/i.test(String(el.textContent || '').replace(/\s+/g, ' ').trim());
}
catch (e) { return false; }
});
const onlineEl = onlineCandidates[0] || null;
const hasOnlineMarker = !!onlineEl;
const hasVisibleProfile = !!(profileEl && isVisible(profileEl));
const hasVisibleLogout = !!((masukEl && isVisible(masukEl)) || (daftarEl && isVisible(daftarEl)));
// Explicit Masuk/Daftar has highest priority: the fresh page is logged out.
if (hasVisibleLogout)
return 'logged_out';
// A visible Profile/User Profile OR visible Online is sufficient positive evidence.
// This avoids falsely sending an already logged-in user back to Login when the
// Online badge is rendered later, omitted by a responsive layout, or not yet hydrated.
if (hasVisibleProfile || hasOnlineMarker)
return 'logged_in';
// Responsive fallback for elements that exist but have no box in the current viewport.
if (profileEl && !masukEl && !daftarEl)
return 'logged_in';
if ((masukEl || daftarEl) && !profileEl)
return 'logged_out';
return 'unknown';
}
catch (e) {
return 'unknown';
}
}
});
if (injected && injected[0] && typeof injected[0].result === 'string') {
return injected[0].result;
}
}
catch (e) {
}
return 'unknown';
}
async function bg_clickRootMasuk(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
} catch (e) { return false; }
};
const candidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masuk = candidates.find(visible) || candidates[0] || null;
if (!masuk) return false;
masuk.click();
return true;
} catch (e) { return false; }
}
});
return !!(injected && injected[0] && injected[0].result === true);
} catch (e) { return false; }
}
async function bg_isManualAuthActiveForLoginProbe() {
try {
const d = await bg_storageLocalGet(['tfManualAuthActive', 'tfManualAuthStartedAt', 'tfPendingLogin', 'tfPendingGoogleLogin']);
if (!d || d.tfManualAuthActive !== true)
return false;
const startedAt = Number(d.tfManualAuthStartedAt || 0);
// A manual auth flow should never be interrupted by the periodic health checker.
// Treat it as active for up to 10 minutes; startup cleanup clears stale state.
if (startedAt > 0 && Date.now() - startedAt >= 0 && Date.now() - startedAt < 10 * 60 * 1000)
return true;
if (d.tfPendingLogin || d.tfPendingGoogleLogin)
return true;
return false;
}
catch (e) { return false; }
}

async function bg_isScanActiveForLoginProbe() {
try {
if (tf_batchScanState && tf_batchScanState.active && !tf_batchScanState.stopRequested)
return true;
}
catch (e) { }
try {
const stored = await bg_storageLocalGet(['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt']);
if (!stored || stored.tfScanInProgress !== true)
return false;
const now = Date.now();
const heartbeatAt = Number(stored.tfActiveScanHeartbeatAt || 0);
const progressAt = Number(stored.tfActiveScanProgressAt || 0);
// A live heartbeat/progress proves that a long batch is still working.
// Even when no heartbeat has been written yet, tfScanInProgress itself is enough
// to defer a periodic auth probe for the duration of the active scan.
if ((heartbeatAt > 0 && now - heartbeatAt < 120000) || (progressAt > 0 && now - progressAt < 120000))
return true;
return true;
}
catch (e) { return false; }
}
// REV215 — secondary account-session verifier for idle periodic checks.
// The public tradersfamily.id root can transiently show Masuk/Daftar even when the
// authenticated account session is still valid. Verify the protected account area
// before treating a root logout marker as meaningful. This helper NEVER changes UI state.
async function bg_verifyAccountSessionByFetch() {
let controller = null;
let timeout = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_periodic_verify=1&ts=' + Date.now();
controller = new AbortController();
timeout = setTimeout(() => { try { controller.abort(); } catch (e) { } }, 12000);
const resp = await fetch(url, {
method: 'GET',
credentials: 'include',
cache: 'no-store',
redirect: 'follow',
headers: { 'Cache-Control': 'no-cache' },
signal: controller.signal
});
if (timeout) { clearTimeout(timeout); timeout = null; }
const finalUrl = String(resp && resp.url || '');
let body = '';
try { body = String(await resp.text()).slice(0, 260000); } catch (e) { }
const loginByUrl = /\/login(?:mt)?\/?(?:$|[?#])/i.test(finalUrl);
const loginByForm = /id=["'](?:logname|logpass|btn-signin)["']/i.test(body);
const loginByMessage = /Silahkan\s*login\s*untuk\s*mengakses/i.test(body);
if (loginByUrl || loginByForm || loginByMessage)
return { state: 'logged_out', finalUrl, httpStatus: Number(resp && resp.status || 0) };
if (resp && resp.ok)
return { state: 'logged_in', finalUrl, httpStatus: Number(resp.status || 0) };
return { state: 'unknown', finalUrl, httpStatus: Number(resp && resp.status || 0) };
}
catch (e) {
try { if (timeout) clearTimeout(timeout); } catch (err) { }
return { state: 'unknown', error: String(e && e.message ? e.message : e) };
}
}

// REV368 — strict preflight used before Update.
// Do not trust already-open TradersFamily tabs here: their rendered DOM can be stale
// after the server session has expired. The authoritative first check is a fresh,
// no-cache authenticated request to the protected account area. Only if that request
// is inconclusive do we open a disposable cache-busted probe tab.
async function bg_refreshOpenTradersFamilyTabsAfterStrictLogout() {
try {
const tabs = await chrome.tabs.query({ url: ['https://account.tradersfamily.id/*', 'https://tradersfamily.id/*'] });
for (const tab of (tabs || [])) {
if (!tab || tab.id == null) continue;
try {
await chrome.tabs.reload(tab.id, { bypassCache: true });
}
catch (e) { }
}
}
catch (e) { }
}
async function bg_markStrictUpdateLogout() {
const now = Date.now();
try {
await bg_storageLocalSet({
tfLoginConfirmed: false,
tfLoginConfirmedAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true,
tfProfileNeedsRefresh: false,
tfPeriodicLogoutAt: now,
tfLoginError: 'Session TradersFamily tidak aktif. Silakan login kembali sebelum Update.'
});
}
catch (e) { }
try {
await new Promise((resolve) => {
try {
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) { resolve(); }
});
}
catch (e) { }
try { await bg_refreshOpenTradersFamilyTabsAfterStrictLogout(); } catch (e) { }
}
async function bg_verifyLoginBeforeUpdateStrict(ownerTabId) {
const startedAt = Date.now();
const network = await bg_verifyAccountSessionByFetch();
if (network && network.state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state: 'logged_in', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
if (network && network.state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state: 'logged_out', code: 'TF_SESSION_EXPIRED', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
let probeTabId = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_update_login_preflight=1&ts=' + Date.now();
const tab = await bg_createTransientSilentTab(url, ownerTabId != null ? ownerTabId : null);
probeTabId = tab && tab.id != null ? tab.id : null;
if (probeTabId == null) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNAVAILABLE', source: 'fresh_probe_unavailable', elapsedMs: Date.now() - startedAt };
}
try { await bg_waitForTabLoaded(probeTabId, 30000); } catch (e) { }
await bg_sleep(500);
const state = await bg_probeRootStateByDom(probeTabId);
if (state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state, source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
if (state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state, code: 'TF_SESSION_EXPIRED', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNKNOWN', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
catch (e) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR', error: String(e && e.message ? e.message : e), elapsedMs: Date.now() - startedAt };
}
finally {
if (probeTabId != null) {
try { await bg_removeTab(probeTabId); } catch (e) { }
}
}
}

async function bg_runPeriodicLoginProbe(source) {
const src = source ? String(source) : 'alarm';
if (bg_loginProbeJob)
return bg_loginProbeJob;
bg_loginProbeJob = (async () => {
// REV217: a real user-driven login always wins over background health checks.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}
// REV214: never let a background/session health probe interrupt an active batch scan.
if (await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV214: every periodic root check uses a disposable tab that is ALWAYS closed
// immediately after that individual probe completes. Do not use the broad
// bg_closeTransientLoginTabs() here because a user may be performing a real login
// in another auth tab at the same time.
async function runDisposableRootProbe(initialDelayMs, retryDelays) {
let created = null;
let probeState = 'unknown';
try {
created = await bg_openTfRootTabFresh(false);
const probeTabId = created && created.id != null ? created.id : null;
if (probeTabId == null)
return 'unknown';
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabId: probeTabId,
tfLastPeriodicProbeTabOpenedAt: Date.now(),
tfLastPeriodicProbeSource: src
});
}
catch (e) { }
try { await bg_waitForTabLoaded(probeTabId, 60000); } catch (e) { }
if (initialDelayMs > 0) {
try { await bg_sleep(initialDelayMs); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
const delays = Array.isArray(retryDelays) ? retryDelays : [];
for (const delay of delays) {
if (probeState !== 'unknown') break;
if (delay > 0) {
try { await bg_sleep(delay); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
}
return probeState;
}
catch (e) {
return 'unknown';
}
finally {
const closeId = created && created.id != null ? created.id : null;
if (closeId != null) {
try { await bg_removeTab(closeId); } catch (e) { }
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabClosedId: closeId,
tfLastPeriodicProbeTabClosedAt: Date.now(),
tfLastPeriodicProbeTabCloseSource: src
});
}
catch (e) { }
}
}
}

// First disposable probe: give TradersFamily enough time to complete its normal render.
let state = await runDisposableRootProbe(10000, [2000, 4000]);
// If the first tab was inconclusive it has already been closed by finally above.
// Only then create a second disposable tab for a short retry.
if (state === 'unknown') {
state = await runDisposableRootProbe(1200, [1200, 1800]);
}

// REV217: if the user started a real login while this background probe was
// still running, discard the probe result completely. Manual authentication wins.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}

// An inconclusive disposable probe is NOT evidence of logout.
if (state === 'unknown') {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeUnknownAt: Date.now(),
tfPeriodicLoginProbeUnknownSource: src
});
}
catch (e) { }
return { ok: true, state: 'unknown', preserved: true };
}

// A probe may have started immediately before a scan. Re-check before applying any
// session conclusion. Active scan always wins.
if (state === 'logged_out' && await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV215: a root-tab logout marker is only a CANDIDATE. Confirm against the protected
// account endpoint. Even when both observations look logged-out, an idle background
// health check is not allowed to throw the user out of the Side Panel. Real user-driven
// requests/content scripts still emit SESSION_EXPIRED when the server truly requires login.
let accountVerify = null;
if (state === 'logged_out') {
try { accountVerify = await bg_verifyAccountSessionByFetch(); } catch (e) { accountVerify = { state: 'unknown' }; }
if (accountVerify && accountVerify.state === 'logged_in') {
state = 'logged_in';
} else {
const stateAt = Date.now();
let previous = null;
try { previous = await bg_storageLocalGet(['tfPeriodicLogoutCandidateAt', 'tfPeriodicLogoutCandidateCount']); } catch (e) { previous = null; }
const prevAt = Number(previous && previous.tfPeriodicLogoutCandidateAt || 0);
const prevCount = Number(previous && previous.tfPeriodicLogoutCandidateCount || 0);
const withinWindow = prevAt > 0 && (stateAt - prevAt) >= 0 && (stateAt - prevAt) < (90 * 60 * 1000);
const nextCount = withinWindow ? Math.min(99, prevCount + 1) : 1;
try {
await bg_storageLocalSet({
tfPeriodicLogoutCandidateAt: stateAt,
tfPeriodicLogoutCandidateCount: nextCount,
tfPeriodicLogoutCandidateSource: src,
tfPeriodicLogoutCandidateAccountState: accountVerify && accountVerify.state ? String(accountVerify.state) : 'unknown',
tfPeriodicLogoutCandidateAccountUrl: accountVerify && accountVerify.finalUrl ? String(accountVerify.finalUrl).slice(0, 500) : '',
tfPeriodicLoginProbePreservedAt: stateAt,
tfPeriodicLoginProbePreservedReason: 'IDLE_PROBE_LOGOUT_CANDIDATE',
// Critical: preserve current authenticated UI. Never force Login from periodic health checks.
tfForceLoginForm: false
});
}
catch (e) { }
return { ok: true, state: 'logged_out_candidate', preserved: true, candidateCount: nextCount, accountState: accountVerify && accountVerify.state ? accountVerify.state : 'unknown' };
}
}

const stateAt = Date.now();
if (state === 'logged_in') {
try {
await bg_storageLocalSet({
tfRootLoginState: 'logged_in',
tfRootLoginStateAt: stateAt,
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: stateAt,
tfLoginConfirmed: true,
tfLoginConfirmedAt: stateAt,
tfForceLoginForm: false,
tfPeriodicLogoutCandidateAt: 0,
tfPeriodicLogoutCandidateCount: 0,
tfPeriodicLogoutCandidateAccountState: '',
tfPeriodicLoginProbeConfirmedAt: stateAt,
tfPeriodicLoginProbeConfirmedSource: src
});
} catch (e) { }
}
return { ok: true, state };
})().finally(() => {
bg_loginProbeJob = null;
});
return bg_loginProbeJob;
}
function bg_sendMessage(tabId, message, timeoutMs = 240000) {
return new P
~~~

### tfMyfxbookPricesAt 1
~~~js
(ids)) {
try {
chrome.tabs.sendMessage(id, { type: 'stopScan' }, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
}
for (const id of Array.from(ids)) {
try {
await bg_removeTab(id);
}
catch (e) { }
}
try {
if (tf_batchScanState && tf_batchScanState.activeTabIds)
tf_batchScanState.activeTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.allTabIds)
tf_batchScanState.allTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.pairTabIds)
tf_batchScanState.pairTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.allWindowIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.scanWindowId = null;
}
catch (e) { }
try {
if (typeof tf_scanWindowId !== 'undefined')
tf_scanWindowId = null;
}
catch (e) { }
}
catch (e) {
console.warn('tf_stopAllActiveScanTabs error', e);
}
}
function bg_createTab(url, makeActive = true, windowId = null) {
return new Promise((resolve, reject) => {
const createData = { url, active: !!makeActive };
if (windowId != null)
createData.windowId = windowId;
chrome.tabs.create(createData, (tab) => {
if (chrome.runtime.lastError) {
reject(chrome.runtime.lastError);
}
else {
resolve(tab);
}
});
});
}

// REV164 passive background-tab helpers.
// Background automation never activates a tab or focuses a Chrome window.
// iSignalUsers.html is only the initial/default tab; user navigation is never overridden.
function bg_getTabSafe(tabId) {
return new Promise((resolve) => {
if (tabId == null) return resolve(null);
try {
chrome.tabs.get(tabId, (tab) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve(tab || null);
});
}
catch (e) { resolve(null); }
});
}

function bg_getForegroundTabSafe() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve((tabs && tabs[0]) ? tabs[0] : null);
});
}
catch (e) { resolve(null); }
});
}

async function bg_resolveSilentOwner(preferredOwnerTabId = null) {
let owner = await bg_getTabSafe(preferredOwnerTabId);
if (!owner) owner = await bg_getForegroundTabSafe();
return owner || null;
}

// Kept as no-ops for compatibility with older call sites. REV164 no longer
// records a fixed owner tab and never restores focus programmatically.
function bg_releaseSilentTab(tabId) { void tabId; }
async function bg_restoreSilentOwner(tabId) { void tabId; }

async function bg_createSilentTab(url, preferredOwnerTabId = null) {
const owner = await bg_resolveSilentOwner(preferredOwnerTabId);
const ownerWindowId = owner && owner.windowId != null ? owner.windowId : null;
return bg_createTab(url, false, ownerWindowId);
}

async function bg_createTransientSilentTab(url, preferredOwnerTabId = null) {
return bg_createSilentTab(url, preferredOwnerTabId);
}

function bg_createWindowWithUrl(url, opts) {
return new Promise((resolve) => {
try {
const createData = {
url: url,
type: (opts && opts.type) ? String(opts.type) : 'normal',
focused: false,
width: (opts && typeof opts.width === 'number') ? opts.width : 1250,
height: (opts && typeof opts.height === 'number') ? opts.height : 900
};
chrome.windows.create(createData, async (w) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const windowId = (w && w.id != null) ? w.id : null;
let tabId = null;
try {
if (w && w.tabs && w.tabs.length && w.tabs[0] && w.tabs[0].id != null) {
tabId = w.tabs[0].id;
}
else if (windowId != null) {
const tabs = await new Promise((res) => {
try {
chrome.tabs.query({ windowId }, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
res(t || []);
});
}
catch (e) {
res([]);
}
});
if (tabs && tabs[0] && tabs[0].id != null)
tabId = tabs[0].id;
}
}
catch (e) { }
resolve({ windowId, tabId });
});
}
catch (e) {
resolve({ windowId: null, tabId: null });
}
});
}
function bg_removeWindow(windowId) {
return new Promise((resolve) => {
if (windowId == null)
return resolve();
try {
chrome.windows.remove(windowId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_getActiveTabId() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
const id = (tabs && tabs[0] && tabs[0].id != null) ? tabs[0].id : null;
resolve(id);
});
}
catch (e) {
resolve(null);
}
});
}
function bg_activateTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.update(tabId, { active: true }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_queryTabsByUrl(urlOrPattern) {
return new Promise((resolve) => {
try {
chrome.tabs.query({ url: urlOrPattern }, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(tabs || []);
});
}
catch (e) {
resolve([]);
}
});
}
function bg_reloadTab(tabId, bypassCache = true) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(false);
try {
chrome.tabs.reload(tabId, { bypassCache: !!bypassCache }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
async function bg_openOrReloadDashboard(opts) {
const activate = !!(opts && opts.activate);
const dashUrl = chrome.runtime.getURL('dashboard.html');
const existing = await bg_queryTabsByUrl(dashUrl + '*');
if (existing && existing.length && existing[0].id != null) {
const t = existing[0];
await bg_reloadTab(t.id, true);
if (activate)
await bg_activateTab(t.id);
return { reused: true, tabId: t.id };
}
const created = await bg_createTab(dashUrl, activate);
return { reused: false, tabId: (created && created.id != null) ? created.id : null };
}
function bg_removeTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.remove(tabId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
// REV217 — close ONLY tabs explicitly marked as disposable probes.
// Never close account.tradersfamily.id URLs merely because they contain tfAuth=1:
// tfAuth=1 is also used by real user-driven Standard / MT4 / Google login tabs.
// The old broad URL query could race with a fresh manual login tab and close it
// immediately after the user clicked Masuk / MetaTrader 4 / Google.
async function bg_closeTransientLoginTabs(extraTabIds) {
const ids = new Set();
try {
  (Array.isArray(extraTabIds) ? extraTabIds : []).forEach((id) => {
    if (id != null && Number.isFinite(Number(id))) ids.add(Number(id));
  });
} catch (e) { }

// Explicit disposable root probes use tfTransientProbe=1. This marker is never
// added to manual authentication tabs, so startup/idle cleanup cannot kill login.
try {
  const marked = await new Promise((resolve) => {
    try {
      chrome.tabs.query({ url: 'https://tradersfamily.id/*tfTransientProbe=1*' }, (tabs) => {
        try { void chrome.runtime.lastError; } catch (e) { }
        resolve(tabs || []);
      });
    } catch (e) { resolve([]); }
  });
  (marked || []).forEach((t) => { if (t && t.id != null) ids.add(Number(t.id)); });
} catch (e) { }

for (const id of Array.from(ids)) {
  try { await bg_removeTab(id); } catch (e) { }
}

// Legacy ID-only state is unsafe across Chrome/browser restarts because a stale
// numeric tab id can later belong to a completely different tab. Remove it only;
// never use it as authority for closing a tab.
try {
  await bg_storageLocalRemove(['tfLoginTransientTabIds']);
} catch (e) {
  try { chrome.storage.local.remove(['tfLoginTransientTabIds'], () => {}); } catch (err) { }
}
}
function bg_waitForTabLoaded(tabId, timeoutMs = 30000) {
return new Promise((resolve) => {
let done = false;
function finish() {
if (done)
return;
done = true;
try {
clearTimeout(timer);
}
catch (e) { }
try {
chrome.tabs.onUpdated.removeListener(listener);
}
catch (e) { }
try {
chrome.tabs.onRemoved.removeListener(removedListener);
}
catch (e) { }
resolve();
}
const timer = setTimeout(() => {
finish();
}, timeoutMs);
function listener(id, changeInfo, tab) {
if (id === tabId && changeInfo && changeInfo.status === 'complete') {
finish();
}
}
function removedListener(id) {
if (id === tabId) {
finish();
}
}
try {
chrome.tabs.onUpdated.addListener(listener);
chrome.tabs.onRemoved.addListener(removedListener);
}
catch (e) { }
try {
chrome.tabs.get(tabId, (tab) => {
if (done)
return;
if (chrome.runtime && chrome.runtime.lastError) {
return;
}
if (tab && tab.status === 'complete') {
finish();
}
});
}
catch (e) {
}
});
}
async function bg_waitForContentScriptReady(tabId, timeoutMs = 12000) {
const start = Date.now();
while (Date.now() - start < timeoutMs) {
try {
const resp = await bg_sendMessage(tabId, { type: 'ping' }, 1500);
if (resp && resp.ok)
return true;
}
catch (e) {
}
await bg_sleep(250);
}
return false;
}
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let bg_myfxbookPriceJob = null;
function bg_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function bg_storageLocalSet(obj) {
return new Promise((resolve) => {
try {
chrome.storage.local.set(obj, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
async function bg_scrapeMyfxbookPricesFromTab(tabId) {
const start = Date.now();
const timeoutMs = 20000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const tbl = document.querySelector('table#results.pipCalcResults') || document.querySelector('table#results') || document.querySelector('table.pipCalcResults');
if (!tbl)
return null;
const rows = tbl.querySelectorAll('tbody tr');
if (!rows || !rows.length)
return null;
const out = {};
rows.forEach((tr) => {
const a = tr.querySelector('td.bold a') || tr.querySelector('td a');
let pairTxt = a ? String(a.textContent || '').trim() : '';
pairTxt = pairTxt.replace(/\s+/g, '').toUpperCase();
if (!pairTxt)
return;
const pairKey = pairTxt.replace(/[^A-Z0-9]/g, '');
if (!pairKey)
return;
const priceTd = tr.querySelector('td[id^="price_"]') || (tr.children && tr.children.length > 1 ? tr.children[1] : null);
let v = priceTd ? String(priceTd.textContent || '').trim() : '';
v = v.replace(/\s+/g, '').trim();
if (v)
out[pairKey] = v;
});
if (!out || Object.keys(out).length === 0)
return null;
return { prices: out, rowCount: rows.length };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.prices && typeof payload.prices === 'object') {
return payload;
}
}
catch (e) {
}
await bg_sleep(500);
}
return null;
}
async function bg_scrapeGoldPriceFromTab(tabId) {
const start = Date.now();
const timeoutMs = 25000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const el = document.querySelector('[data-test="instrument-price-last"]');
if (!el)
return null;
let t = String(el.textContent || '').trim();
if (!t)
return null;
t = t.replace(/\s+/g, '');
const m = t.match(/[0-9][0-9.,]*/);
if (!m)
return null;
const price = m[0];
if (!price)
return null;
return { price };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.price)
return String(payload.price);
}
catch (e) {
}
await bg_sleep(600);
}
return null;
}
async function bg_ensureMyfxbookPrices(opts) {
const force = !!(opts && opts.force);
if (bg_myfxbookPriceJob)
return bg_myfxbookPriceJob;
bg_myfxbookPriceJob = (async () => {
const now = Date.now();
const cached = await bg_storageLocalGet([TF_MYFXBOOK_PRICES_AT_KEY]);
const lastAt = cached && cached[TF_MYFXBOOK_PRICES_AT_KEY] ? Number(cached[TF_MYFXBOOK_PRICES_AT_KEY]) : 0;
const ageMs = now - (Number.isFinite(lastAt) ? lastAt : 0);
if (!force && lastAt && ageMs >= 0 && ageMs < 10 * 60 * 1000) {
return { ok: true, skipped: true, ageMs };
}
const url = 'https://id.investing.com/tools/forex-pip-calculator?tfext_investing=1&t=' + now;
let tab = null;
try {
tab = await bg_createTab(url, false);
}
catch (e) {
tab = null;
}
const tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
return { ok: false, error: 'Gagal membuka tab Investing.com.' };
}
let prices = {};
try {
await bg_waitForTabLoaded(tabId, 45000);
await bg_sleep(600);
const scraped = await bg_scrapeMyfxbookPricesFromTab(tabId);
if (!scraped || scraped.error) {
return { ok: false, error: scraped && scraped.error ? scraped.error : 'Gagal membaca tabel Pip Calculator di Investing.com.' };
}
prices = scraped.prices || {};
}
finally {
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
let goldTabId = null;
try {
const goldUrl = 'https://id.investing.com/commodities/gold?tfext_investing=1&t=' + now;
const gtab = await bg_createTab(goldUrl, false);
goldTabId = gtab && gtab.id != null ? gtab.id : null;
if (goldTabId != null) {
await bg_waitForTabLoaded(goldTabId, 45000);
await bg_sleep(800);
const goldPrice = await bg_scrapeGoldPriceFromTab(goldTabId);
if (goldPrice && String(goldPrice).trim()) {
prices['XAUUSD'] = String(goldPrice).trim();
}
}
}
catch (e) {
}
finally {
if (goldTabId != null) {
try {
await bg_removeTab(goldTabId);
}
catch (e) { }
}
}
const at = Date.now();
await bg_storageLocalSet({
[TF_MYFXBOOK_PRICES_KEY]: prices,
[TF_MYFXBOOK_PRICES_AT_KEY]: at
});
return { ok: true, count: Object.keys(prices).length, at };
})().finally(() => {
bg_myfxbookPriceJob = null;
});
return bg_myfxbookPriceJob;
}
function bg_getTabInfo(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(null);
try {
chrome.tabs.get(tabId, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!t)
return resolve(null);
resolve({
id: t.id,
url: t.url ? String(t.url) : '',
pendingUrl: t.pendingUrl ? String(t.pendingUrl) : '',
status: t.status ? String(t.status) : ''
});
});
}
catch (e) {
resolve(null);
}
});
}
async function bg_waitForTabUrlMatch(tabId, regex, timeoutMs = 8000, pollMs = 250) {
const start = Date.now();
let lastUrl = '';
while (Date.now() - start < timeoutMs) {
const info = await bg_getTabInfo(tabId);
if (!info)
return { matched: false, url: lastUrl };
const u = (info.pendingUrl || info.url || '').trim();
lastUrl = u;
if (u && regex.test(u))
return { matched: true, url: u };
await bg_sleep(pollMs);
}
return { matched: false, url: lastUrl };
}
async function bg_probeRootStateByDom(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
function isVisible(el) {
try {
if (!el)
return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0'))
return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
const hasBox = r ? (r.width > 0 && r.height > 0) : true;
const hasRects = el.getClientRects ? (el.getClientRects().length > 0) : true;
return !!(hasBox && hasRects);
}
catch (e) {
return false;
}
}
try {
const masukCandidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const daftarCandidates = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/register"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]'),
Array.from(document.querySelectorAll('li.user.user-menu.m a')).find(a => /\bDaftar\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masukEl = masukCandidates.find(isVisible) || masukCandidates[0] || null;
const daftarEl = daftarCandidates.find(isVisible) || daftarCandidates[0] || null;
const profileCandidates = [
document.querySelector('li.x-menu-item-login.reglog a[title="User Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a[title*="Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login.sudah[title="User Profile"]'),
document.querySelector('a.x-btn-navbar-login.sudah[href*="account.tradersfamily.id/profile"]'),
document.querySelector('a.x-btn-navbar-login[title="User Profile"]'),
document.querySelector('li.user.user-menu a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('nav a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('header a[href*="account.tradersfamily.id/profile"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.x-menu-item-login.reglog a, li.user.user-menu a')).find(a => /^(?:User\s*)?Profile$/i.test(String(a.textContent || '').replace(/\s+/g, ' ').trim()))
].filter(Boolean);
const profileEl = profileCandidates.find(isVisible) || profileCandidates[0] || null;
// REV210 — login confirmation accepts either of the two positive markers seen on
// TradersFamily after a real login: Profile/User Profile OR the live Online status.
// The disposable fresh tab remains the authority; stale/open tabs are not consulted.
const onlineCandidates = Array.from(document.querySelectorAll('small')).filter((el) => {
try {
if (!isVisible(el)) return false;
const icon = el.querySelector('i.fa.fa-circle');
if (!icon) return false;
return /^Online$/i.test(String(el.textContent || '').replace(/\s+/g, ' ').trim());
}
catch (e) { return false; }
});
const onlineEl = onlineCandidates[0] || null;
const hasOnlineMarker = !!onlineEl;
const hasVisibleProfile = !!(profileEl && isVisible(profileEl));
const hasVisibleLogout = !!((masukEl && isVisible(masukEl)) || (daftarEl && isVisible(daftarEl)));
// Explicit Masuk/Daftar has highest priority: the fresh page is logged out.
if (hasVisibleLogout)
return 'logged_out';
// A visible Profile/User Profile OR visible Online is sufficient positive evidence.
// This avoids falsely sending an already logged-in user back to Login when the
// Online badge is rendered later, omitted by a responsive layout, or not yet hydrated.
if (hasVisibleProfile || hasOnlineMarker)
return 'logged_in';
// Responsive fallback for elements that exist but have no box in the current viewport.
if (profileEl && !masukEl && !daftarEl)
return 'logged_in';
if ((masukEl || daftarEl) && !profileEl)
return 'logged_out';
return 'unknown';
}
catch (e) {
return 'unknown';
}
}
});
if (injected && injected[0] && typeof injected[0].result === 'string') {
return injected[0].result;
}
}
catch (e) {
}
return 'unknown';
}
async function bg_clickRootMasuk(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
} catch (e) { return false; }
};
const candidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masuk = candidates.find(visible) || candidates[0] || null;
if (!masuk) return false;
masuk.click();
return true;
} catch (e) { return false; }
}
});
return !!(injected && injected[0] && injected[0].result === true);
} catch (e) { return false; }
}
async function bg_isManualAuthActiveForLoginProbe() {
try {
const d = await bg_storageLocalGet(['tfManualAuthActive', 'tfManualAuthStartedAt', 'tfPendingLogin', 'tfPendingGoogleLogin']);
if (!d || d.tfManualAuthActive !== true)
return false;
const startedAt = Number(d.tfManualAuthStartedAt || 0);
// A manual auth flow should never be interrupted by the periodic health checker.
// Treat it as active for up to 10 minutes; startup cleanup clears stale state.
if (startedAt > 0 && Date.now() - startedAt >= 0 && Date.now() - startedAt < 10 * 60 * 1000)
return true;
if (d.tfPendingLogin || d.tfPendingGoogleLogin)
return true;
return false;
}
catch (e) { return false; }
}

async function bg_isScanActiveForLoginProbe() {
try {
if (tf_batchScanState && tf_batchScanState.active && !tf_batchScanState.stopRequested)
return true;
}
catch (e) { }
try {
const stored = await bg_storageLocalGet(['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt']);
if (!stored || stored.tfScanInProgress !== true)
return false;
const now = Date.now();
const heartbeatAt = Number(stored.tfActiveScanHeartbeatAt || 0);
const progressAt = Number(stored.tfActiveScanProgressAt || 0);
// A live heartbeat/progress proves that a long batch is still working.
// Even when no heartbeat has been written yet, tfScanInProgress itself is enough
// to defer a periodic auth probe for the duration of the active scan.
if ((heartbeatAt > 0 && now - heartbeatAt < 120000) || (progressAt > 0 && now - progressAt < 120000))
return true;
return true;
}
catch (e) { return false; }
}
// REV215 — secondary account-session verifier for idle periodic checks.
// The public tradersfamily.id root can transiently show Masuk/Daftar even when the
// authenticated account session is still valid. Verify the protected account area
// before treating a root logout marker as meaningful. This helper NEVER changes UI state.
async function bg_verifyAccountSessionByFetch() {
let controller = null;
let timeout = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_periodic_verify=1&ts=' + Date.now();
controller = new AbortController();
timeout = setTimeout(() => { try { controller.abort(); } catch (e) { } }, 12000);
const resp = await fetch(url, {
method: 'GET',
credentials: 'include',
cache: 'no-store',
redirect: 'follow',
headers: { 'Cache-Control': 'no-cache' },
signal: controller.signal
});
if (timeout) { clearTimeout(timeout); timeout = null; }
const finalUrl = String(resp && resp.url || '');
let body = '';
try { body = String(await resp.text()).slice(0, 260000); } catch (e) { }
const loginByUrl = /\/login(?:mt)?\/?(?:$|[?#])/i.test(finalUrl);
const loginByForm = /id=["'](?:logname|logpass|btn-signin)["']/i.test(body);
const loginByMessage = /Silahkan\s*login\s*untuk\s*mengakses/i.test(body);
if (loginByUrl || loginByForm || loginByMessage)
return { state: 'logged_out', finalUrl, httpStatus: Number(resp && resp.status || 0) };
if (resp && resp.ok)
return { state: 'logged_in', finalUrl, httpStatus: Number(resp.status || 0) };
return { state: 'unknown', finalUrl, httpStatus: Number(resp && resp.status || 0) };
}
catch (e) {
try { if (timeout) clearTimeout(timeout); } catch (err) { }
return { state: 'unknown', error: String(e && e.message ? e.message : e) };
}
}

// REV368 — strict preflight used before Update.
// Do not trust already-open TradersFamily tabs here: their rendered DOM can be stale
// after the server session has expired. The authoritative first check is a fresh,
// no-cache authenticated request to the protected account area. Only if that request
// is inconclusive do we open a disposable cache-busted probe tab.
async function bg_refreshOpenTradersFamilyTabsAfterStrictLogout() {
try {
const tabs = await chrome.tabs.query({ url: ['https://account.tradersfamily.id/*', 'https://tradersfamily.id/*'] });
for (const tab of (tabs || [])) {
if (!tab || tab.id == null) continue;
try {
await chrome.tabs.reload(tab.id, { bypassCache: true });
}
catch (e) { }
}
}
catch (e) { }
}
async function bg_markStrictUpdateLogout() {
const now = Date.now();
try {
await bg_storageLocalSet({
tfLoginConfirmed: false,
tfLoginConfirmedAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true,
tfProfileNeedsRefresh: false,
tfPeriodicLogoutAt: now,
tfLoginError: 'Session TradersFamily tidak aktif. Silakan login kembali sebelum Update.'
});
}
catch (e) { }
try {
await new Promise((resolve) => {
try {
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) { resolve(); }
});
}
catch (e) { }
try { await bg_refreshOpenTradersFamilyTabsAfterStrictLogout(); } catch (e) { }
}
async function bg_verifyLoginBeforeUpdateStrict(ownerTabId) {
const startedAt = Date.now();
const network = await bg_verifyAccountSessionByFetch();
if (network && network.state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state: 'logged_in', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
if (network && network.state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state: 'logged_out', code: 'TF_SESSION_EXPIRED', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
let probeTabId = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_update_login_preflight=1&ts=' + Date.now();
const tab = await bg_createTransientSilentTab(url, ownerTabId != null ? ownerTabId : null);
probeTabId = tab && tab.id != null ? tab.id : null;
if (probeTabId == null) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNAVAILABLE', source: 'fresh_probe_unavailable', elapsedMs: Date.now() - startedAt };
}
try { await bg_waitForTabLoaded(probeTabId, 30000); } catch (e) { }
await bg_sleep(500);
const state = await bg_probeRootStateByDom(probeTabId);
if (state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state, source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
if (state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state, code: 'TF_SESSION_EXPIRED', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNKNOWN', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
catch (e) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR', error: String(e && e.message ? e.message : e), elapsedMs: Date.now() - startedAt };
}
finally {
if (probeTabId != null) {
try { await bg_removeTab(probeTabId); } catch (e) { }
}
}
}

async function bg_runPeriodicLoginProbe(source) {
const src = source ? String(source) : 'alarm';
if (bg_loginProbeJob)
return bg_loginProbeJob;
bg_loginProbeJob = (async () => {
// REV217: a real user-driven login always wins over background health checks.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}
// REV214: never let a background/session health probe interrupt an active batch scan.
if (await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV214: every periodic root check uses a disposable tab that is ALWAYS closed
// immediately after that individual probe completes. Do not use the broad
// bg_closeTransientLoginTabs() here because a user may be performing a real login
// in another auth tab at the same time.
async function runDisposableRootProbe(initialDelayMs, retryDelays) {
let created = null;
let probeState = 'unknown';
try {
created = await bg_openTfRootTabFresh(false);
const probeTabId = created && created.id != null ? created.id : null;
if (probeTabId == null)
return 'unknown';
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabId: probeTabId,
tfLastPeriodicProbeTabOpenedAt: Date.now(),
tfLastPeriodicProbeSource: src
});
}
catch (e) { }
try { await bg_waitForTabLoaded(probeTabId, 60000); } catch (e) { }
if (initialDelayMs > 0) {
try { await bg_sleep(initialDelayMs); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
const delays = Array.isArray(retryDelays) ? retryDelays : [];
for (const delay of delays) {
if (probeState !== 'unknown') break;
if (delay > 0) {
try { await bg_sleep(delay); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
}
return probeState;
}
catch (e) {
return 'unknown';
}
finally {
const closeId = created && created.id != null ? created.id : null;
if (closeId != null) {
try { await bg_removeTab(closeId); } catch (e) { }
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabClosedId: closeId,
tfLastPeriodicProbeTabClosedAt: Date.now(),
tfLastPeriodicProbeTabCloseSource: src
});
}
catch (e) { }
}
}
}

// First disposable probe: give TradersFamily enough time to complete its normal render.
let state = await runDisposableRootProbe(10000, [2000, 4000]);
// If the first tab was inconclusive it has already been closed by finally above.
// Only then create a second disposable tab for a short retry.
if (state === 'unknown') {
state = await runDisposableRootProbe(1200, [1200, 1800]);
}

// REV217: if the user started a real login while this background probe was
// still running, discard the probe result completely. Manual authentication wins.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}

// An inconclusive disposable probe is NOT evidence of logout.
if (state === 'unknown') {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeUnknownAt: Date.now(),
tfPeriodicLoginProbeUnknownSource: src
});
}
catch (e) { }
return { ok: true, state: 'unknown', preserved: true };
}

// A probe may have started immediately before a scan. Re-check before applying any
// session conclusion. Active scan always wins.
if (state === 'logged_out' && await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV215: a root-tab logout marker is only a CANDIDATE. Confirm against the protected
// account endpoint. Even when both observations look logged-out, an idle background
// health check is not allowed to throw the user out of the Side Panel. Real user-driven
// requests/content scripts still emit SESSION_EXPIRED when the server truly requires login.
let accountVerify = null;
if (state === 'logged_out') {
try { accountVerify = await bg_verifyAccountSessionByFetch(); } catch (e) { accountVerify = { state: 'unknown' }; }
if (accountVerify && accountVerify.state === 'logged_in') {
state = 'logged_in';
} else {
const stateAt = Date.now();
let previous = null;
try { previous = await bg_storageLocalGet(['tfPeriodicLogoutCandidateAt', 'tfPeriodicLogoutCandidateCount']); } catch (e) { previous = null; }
const prevAt = Number(previous && previous.tfPeriodicLogoutCandidateAt || 0);
const prevCount = Number(previous && previous.tfPeriodicLogoutCandidateCount || 0);
const withinWindow = prevAt > 0 && (stateAt - prevAt) >= 0 && (stateAt - prevAt) < (90 * 60 * 1000);
const nextCount = withinWindow ? Math.min(99, prevCount + 1) : 1;
try {
await bg_storageLocalSet({
tfPeriodicLogoutCandidateAt: stateAt,
tfPeriodicLogoutCandidateCount: nextCount,
tfPeriodicLogoutCandidateSource: src,
tfPeriodicLogoutCandidateAccountState: accountVerify && accountVerify.state ? String(accountVerify.state) : 'unknown',
tfPeriodicLogoutCandidateAccountUrl: accountVerify && accountVerify.finalUrl ? String(accountVerify.finalUrl).slice(0, 500) : '',
tfPeriodicLoginProbePreservedAt: stateAt,
tfPeriodicLoginProbePreservedReason: 'IDLE_PROBE_LOGOUT_CANDIDATE',
// Critical: preserve current authenticated UI. Never force Login from periodic health checks.
tfForceLoginForm: false
});
}
catch (e) { }
return { ok: true, state: 'logged_out_candidate', preserved: true, candidateCount: nextCount, accountState: accountVerify && accountVerify.state ? accountVerify.state : 'unknown' };
}
}

const stateAt = Date.now();
if (state === 'logged_in') {
try {
await bg_storageLocalSet({
tfRootLoginState: 'logged_in',
tfRootLoginStateAt: stateAt,
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: stateAt,
tfLoginConfirmed: true,
tfLoginConfirmedAt: stateAt,
tfForceLoginForm: false,
tfPeriodicLogoutCandidateAt: 0,
tfPeriodicLogoutCandidateCount: 0,
tfPeriodicLogoutCandidateAccountState: '',
tfPeriodicLoginProbeConfirmedAt: stateAt,
tfPeriodicLoginProbeConfirmedSource: src
});
} catch (e) { }
}
return { ok: true, state };
})().finally(() => {
bg_loginProbeJob = null;
});
return bg_loginProbeJob;
}
function bg_sendMessage(tabId, message, timeoutMs = 240000) {
return new P
~~~
## assets/894f18e8a37bd7c6.js

### ensure_myfxbook_prices 1
~~~js
(p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb || !topCb.checked)
return;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (!pairCbs || pairCbs.length === 0) {
return;
}
const selected = [];
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
selected.push(pair);
});
map[name] = selected;
});
return map;
}
function commitAndRefresh() {
const __openAnalysts = Array.from(container.querySelectorAll('.analyst-filter-item .sub-menu'))
.filter((m) => m && m.style && m.style.display === 'block')
.map((m) => m.getAttribute('data-analyst'))
.filter((x) => !!x);
const nextGlobal = recomputeGlobalFromUI();
const nextPairs = recomputePairMapFromUI();
if (typeof setGlobalState === 'function')
setGlobalState(nextGlobal);
if (typeof setState === 'function')
setState(nextPairs);
if (typeof applyFn === 'function')
applyFn();
setupAnalystTickerFilter();
try {
const menus = container.querySelectorAll('.analyst-filter-item .sub-menu[data-analyst]');
menus.forEach((m) => {
const a = m.getAttribute('data-analyst');
if (!a)
return;
if (__openAnalysts.indexOf(a) !== -1) {
m.style.display = 'block';
const li = m.closest('.analyst-filter-item');
const ar = li ? li.querySelector('span.analyst-filter-arrow') : null;
if (ar)
ar.textContent = '▼';
}
});
}
catch (e) { }
}
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
if (checked) {
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.checked = true;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (!topCb.checked) {
pcb.checked = false;
pcb.disabled = true;
return;
}
if (pair === '__ALL__') {
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
pcb.checked = !anyNoValue;
pcb.disabled = false;
}
else {
const noVal = isNoValuePair(name, pair);
pcb.disabled = false;
pcb.checked = true;
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
}
}
});
});
}
else {
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb)
topCb.checked = false;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (pairCbs && pairCbs.length) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
});
}
commitAndRefresh();
});
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.addEventListener('change', () => {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
const pairs = getPairsList(name);
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
if (pairCbs && pairCbs.length) {
if (!topCb.checked) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
else {
let anySpecificChecked = false;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
anySpecificChecked = true;
});
const doAutoSelect = !!(autoSelectPairsOnAnalystEnable && !anySpecificChecked);
let subAllCb = null;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (pair === '__ALL__') {
subAllCb = pcb;
return;
}
const noVal = isNoValuePair(name, pair);
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
pcb.disabled = false;
}
else {
pcb.disabled = false;
if (doAutoSelect) {
pcb.checked = !noVal;
}
}
});
if (subAllCb) {
subAllCb.disabled = false;
if (doAutoSelect) {
let allSpecificChecked = true;
const specifics = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-
~~~

### ensure_myfxbook_prices 2
~~~js
JPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb || !topCb.checked)
return;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (!pairCbs || pairCbs.length === 0) {
return;
}
const selected = [];
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
selected.push(pair);
});
map[name] = selected;
});
return map;
}
function commitAndRefresh() {
const __openAnalysts = Array.from(container.querySelectorAll('.analyst-filter-item .sub-menu'))
.filter((m) => m && m.style && m.style.display === 'block')
.map((m) => m.getAttribute('data-analyst'))
.filter((x) => !!x);
const nextGlobal = recomputeGlobalFromUI();
const nextPairs = recomputePairMapFromUI();
if (typeof setGlobalState === 'function')
setGlobalState(nextGlobal);
if (typeof setState === 'function')
setState(nextPairs);
if (typeof applyFn === 'function')
applyFn();
setupAnalystTickerFilter();
try {
const menus = container.querySelectorAll('.analyst-filter-item .sub-menu[data-analyst]');
menus.forEach((m) => {
const a = m.getAttribute('data-analyst');
if (!a)
return;
if (__openAnalysts.indexOf(a) !== -1) {
m.style.display = 'block';
const li = m.closest('.analyst-filter-item');
const ar = li ? li.querySelector('span.analyst-filter-arrow') : null;
if (ar)
ar.textContent = '▼';
}
});
}
catch (e) { }
}
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
if (checked) {
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.checked = true;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (!topCb.checked) {
pcb.checked = false;
pcb.disabled = true;
return;
}
if (pair === '__ALL__') {
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
pcb.checked = !anyNoValue;
pcb.disabled = false;
}
else {
const noVal = isNoValuePair(name, pair);
pcb.disabled = false;
pcb.checked = true;
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
}
}
});
});
}
else {
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb)
topCb.checked = false;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (pairCbs && pairCbs.length) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
});
}
commitAndRefresh();
});
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.addEventListener('change', () => {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
const pairs = getPairsList(name);
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
if (pairCbs && pairCbs.length) {
if (!topCb.checked) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
else {
let anySpecificChecked = false;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
anySpecificChecked = true;
});
const doAutoSelect = !!(autoSelectPairsOnAnalystEnable && !anySpecificChecked);
let subAllCb = null;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (pair === '__ALL__') {
subAllCb = pcb;
return;
}
const noVal = isNoValuePair(name, pair);
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
pcb.disabled = false;
}
else {
pcb.disabled = false;
if (doAutoSelect) {
pcb.checked = !noVal;
}
}
});
if (subAllCb) {
subAllCb.disabled = false;
if (doAutoSelect) {
let allSpecificChecked = true;
const specifics = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]:not([data-pair="__ALL__"])');
specifics.forEach((x) => {
if (!x.checked)
allSpecificChecked = false;
});
subAllCb.checked = !!allSpecificChecked;
}
else {
}
}
}
}
commitAndRefresh();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pcb) => {
pcb.addEventListener('change', () => {
const analyst = pcb.getAttribute('data-analyst');
const pair = pcb.getAttribute('data-pair');
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"]:not([data-pair])');
if (!topCb || !topCb.checked) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pair === '__ALL__') {
if (pcb.disabled) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pcb.checked) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
specific.forEach((x) => {
x.checked = true;
});
}
else {
}
commitAndRefresh();
return;
}
const subAll = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair="__ALL__"]');
if (subAll && !subAll.disabled) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
let allChecked = true;
specific.forEach((x) => {
if (!x.checked)
allChecked = false;
});
subAll.checked = allChecked;
}
else if (subAll) {
subAll.checked = false;
}
commitAndRefresh();
});
});
}
containers.forEach((c) => buildOneContainer(c));
}
function setupAnalystTickerFilter() {
const statsContainerIds = ['analyst-filter-container', 'analyst-filter-container-monthly'];
const historyContainerIds = ['analyst-filter-container-history', 'analyst-filter-container-equity'];
const statsContainers = statsContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const historyContainers = historyContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const allContainers = statsContainers.concat(historyContainers);
if (!allContainers.length)
return;
if (!__tfAnalystFilterOutsideClickInstalled) {
__tfAnalystFilterOutsideClickInstalled = true;
document.addEventListener('click', function onDocClickCloseMenus(event) {
const clickedInside = !!event.target.closest('#analyst-filter-container, #analyst-filter-container-monthly, #analyst-filter-container-history, #analyst-filter-container-equity');
if (clickedInside)
return;
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu && menu.style && menu.style.display === 'block') {
menu.style.display = 'none';
const arrow = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (arrow)
arrow.textContent = '▶';
}
});
});
}
const pairsByAnalystStats = {};
const pairsByAnalystHistory = {};
if (analystSourcesByName && typeof analystSourcesByName === 'object') {
Object.keys(analystSourcesByName).forEach((name) => {
if (!name)
return;
const src = analystSourcesByName[name];
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (src && Array.isArray(src.pairs)) {
src.pairs.forEach((p) => {
if (p) {
const pp = String(p).toUpperCase();
pairsByAnalystStats[name].add(pp);
pairsByAnalystHistory[name].add(pp);
}
});
}
});
}
if (Array.isArray(historySignals)) {
historySignals.forEach((item) => {
if (!item || !item.analyst)
return;
const name = item.analyst;
const p = item.pair;
if (name) {
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (p) {
pairsByAnalystStats[name].add(String(p).toUpperCase());
pairsByAnalystHistory[name].add(String(p).toUpperCase());
}
}
});
}
const analystNamesStats = Object.keys(pairsByAnalystStats).sort((a, b) => a.localeCompare(b));
const analystNamesHistory = Object.keys(pairsByAnalystHistory).sort((a, b) => a.localeCompare(b));
if (!analystNamesStats.length) {
statsContainers.forEach((c) => (c.innerHTML = ''));
}
if (!analystNamesHistory.length) {
historyContainers.forEach((c) => (c.innerHTML = ''));
}
function tf_getNoDataPairsEntry(map, baseName) {
if (!map || typeof map !== 'object')
return null;
if (Object.prototype.hasOwnProperty.call(map, baseName))
return map[baseName];
const target = tf_normAnalystKey(baseName).toLowerCase();
try {
const keys = Object.keys(map);
for (const k of keys) {
if (tf_normAnalystKey(k).toLowerCase() === target) {
return map[k];
}
}
}
catch (e) { }
return null;
}
function tf_isNoDataPairStats(baseName, pair) {
const entry = tf_getNoDataPairsEntry(noDataPairsByAnalyst, baseName);
const p = tf_normPairKey(pair);
return !!(entry && p && entry[p]);
}
function tf_computeHistoryNoValuePairsByAnalyst() {
const tmp = {};
const arr = Array.isArray(historySignals) ? historySignals : [];
arr.forEach((it) => {
if (!it)
return;
const a = tf_normAnalystKey(it.analyst || '');
const p = tf_normPairKey(it.pair || '');
if (!a || !p)
return;
if (!tmp[a])
tmp[a] = {};
if (!tmp[a][p])
tmp[a][p] = { count: 0, absPips: 0 };
tmp[a][p].count += 1;
let 
~~~

### tfMyfxbookPrices 1
~~~js
dateSkipButtonState() {
const els = tfDash_overlayEls();
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {
~~~

### tfMyfxbookPrices 2
~~~js
);
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.q
~~~

### tfMyfxbookPricesAt 1
~~~js
);
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
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
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.q
~~~
## assets/927ecbd63036f61b.js

### ensure_myfxbook_prices 1
~~~js
 false;
input.readOnly = false;
try {
input.removeAttribute('readonly');
}
catch (e) { }
}
const selUnlock = row.querySelector('.analyst-pair-select');
if (selUnlock)
selUnlock.disabled = false;
const widgetUnlock = row.querySelector('.pair-multiselect');
if (widgetUnlock) {
widgetUnlock.style.pointerEvents = '';
widgetUnlock.style.opacity = '';
}
const cbsUnlock = row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]');
cbsUnlock.forEach((cb) => { cb.disabled = false; });
}
catch (e) { }
}
}
}
catch (e) { }
const selectEl = row.querySelector('.analyst-pair-select');
if (selectEl) {
const options = Array.from(selectEl.options || []);
options.forEach((opt) => { opt.selected = false; });
const pairs = Array.isArray(item.pairs) ? item.pairs : [];
if (!pairs.length) {
const allOpt = options.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt) {
allOpt.selected = true;
}
}
else {
options.forEach((opt) => {
if (pairs.includes(opt.value)) {
opt.selected = true;
}
});
}
}
container.appendChild(row);
const widget = row.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
}
initAnalystPairSelect(row.querySelector('.analyst-pair-select'));
initPairMultiSelectForRow(row);
});
}
else {
const row = templateRow.cloneNode(true);
container.appendChild(row);
const widget = row.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
}
initAnalystPairSelect(row.querySelector('.analyst-pair-select'));
initPairMultiSelectForRow(row);
}
if (rememberRow) {
container.appendChild(rememberRow);
}
}
}
}
catch (e) {
console.warn('Gagal restore Link Analis yang di-remember', e);
}
if (rememberCfg && rememberCheckbox) {
rememberCheckbox.checked = !!rememberCfg.enabled;
if (rememberCfg.enabled && loginEmail && rememberCfg.email) {
loginEmail.value = rememberCfg.email;
}
}
try {
const scanSel = document.getElementById('scan-pair-select');
if (scanSel) {
let storedArr = null;
if (data && Array.isArray(data.tfScanChannelPairs)) {
storedArr = data.tfScanChannelPairs.map(String);
}
else if (data && typeof data.tfScanChannelPair === 'string') {
const v = String(data.tfScanChannelPair || '__ALL__');
storedArr = [v];
}
if (!storedArr || !storedArr.length)
storedArr = ['__ALL__'];
const opts = Array.from(scanSel.options || []);
opts.forEach(o => { o.selected = false; });
const hasAll = storedArr.includes('__ALL__');
if (hasAll) {
const allOpt = opts.find(o => o.value === '__ALL__');
if (allOpt)
allOpt.selected = true;
}
else {
storedArr.forEach((val) => {
const opt = opts.find(o => o.value === val);
if (opt)
opt.selected = true;
});
if (!opts.some(o => o.selected)) {
const allOpt = opts.find(o => o.value === '__ALL__');
if (allOpt)
allOpt.selected = true;
}
}
try {
const widget = document.getElementById('scan-pair-multiselect');
if (widget && typeof widget.__tf_syncFromSelect === 'function') {
widget.__tf_syncFromSelect();
}
}
catch (e) { }
}
}
catch (e) { }
const rawRootState = (data && data.tfRootLoginState) ? String(data.tfRootLoginState) : 'unknown';
const rootAt = (data && data.tfRootLoginStateAt) ? Number(data.tfRootLoginStateAt) : 0;
const rootState = (rootAt && (Date.now() - rootAt) > TF_LOGIN_STATE_STALE_MS) ? 'unknown' : rawRootState;
const rootLoggedIn = rootState === 'logged_in';
const rootLoggedOut = rootState === 'logged_out';
const rawAccState = (data && data.tfAccountLoginState) ? String(data.tfAccountLoginState) : 'unknown';
const accAt = (data && data.tfAccountLoginStateAt) ? Number(data.tfAccountLoginStateAt) : 0;
const accState = (accAt && (Date.now() - accAt) > TF_LOGIN_STATE_STALE_MS) ? 'unknown' : rawAccState;
const accLoggedIn = accState === 'logged_in';
const accLoggedOut = accState === 'logged_out';
const forceLoginForm = !!(data && data.tfForceLoginForm);
const isSessionExpiredMsg = !!(loginError && /Silahkan\s*login|Session\s*berakhir|Session\s*TradersFamily\s*tidak\s*aktif/i.test(String(loginError)));
let candidateView = null;
const now = Date.now();
const rootAge = rootAt ? (now - rootAt) : 999999;
const accAge = accAt ? (now - accAt) : 999999;
const confirmedAt = Number(data && data.tfLoginConfirmedAt || 0);
const confirmedAge = confirmedAt ? (now - confirmedAt) : 999999;
const accRecentLoggedIn = accLoggedIn && accAge < TF_LOGIN_STATE_STALE_MS;
const rootRecentLoggedIn = rootLoggedIn && rootAge < TF_LOGIN_STATE_STALE_MS;
const confirmedRecent = confirmed && confirmedAge < TF_LOGIN_STATE_STALE_MS;
const shownMainOnceThisLogin = !!(data && data.tfShownMainOnceThisLogin);
const explicitLogoutAt = Number(data && data.tfExplicitLogoutAt || 0);
const explicitLogoutRecent = !!(explicitLogoutAt && (now - explicitLogoutAt) >= 0 && (now - explicitLogoutAt) < (30 * 60 * 1000));
const latestLoginAt = Math.max(
accRecentLoggedIn ? accAt : 0,
rootRecentLoggedIn ? rootAt : 0,
confirmedRecent ? confirmedAt : 0
);
const latestLogoutAt = Math.max(
(accLoggedOut && accAge < TF_LOGIN_STATE_STALE_MS) ? accAt : 0,
(rootLoggedOut && rootAge < TF_LOGIN_STATE_STALE_MS) ? rootAt : 0,
explicitLogoutRecent ? explicitLogoutAt : 0
);
// REV201 — mirror the stable legacy rule from tradersfamily.id navbar:
//   User Profile => logged in
//   Masuk / no User Profile => logged out
// A fresh root result wins over stale account/profile/cache state.
const rootFresh = rootAt > 0 && rootAge < TF_LOGIN_STATE_STALE_MS;
const accFresh = accAt > 0 && accAge < TF_LOGIN_STATE_STALE_MS;
// REV202 — an explicit Logout clicked inside the extension is authoritative.
// Root/account pages that were already open can keep stale "User Profile" DOM after
// the server session has been destroyed. Keep Login visible until a new login flow
// explicitly clears tfExplicitLogoutAt.
const scanInProgress = !!(data && data.tfScanInProgress);
if (explicitLogoutRecent) {
candidateView = 'login';
if (!forceLoginForm) {
try { chrome.storage.local.set({ tfForceLoginForm: true, tfLoginConfirmed: false, tfEnteredMain: false, tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (forceLoginForm && (isSessionExpiredMsg || rootLoggedOut || accLoggedOut)) {
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
candidateView = 'main';
if (forceLoginForm) {
try { chrome.storage.local.set({ tfForceLoginForm: false, tfLoginConfirmed: true, tfLoginConfirmedAt: Date.now() }, () => { }); } catch (e) { }
}
if (!shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: true }, () => { }); } catch (e) { }
}
} else if (rootFresh && rootLoggedOut) {
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (accFresh && accLoggedIn && (!rootAt || accAt > rootAt)) {
// Fresh account login can bridge the short window before the next root navbar probe.
candidateView = 'main';
if (!shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: true }, () => { }); } catch (e) { }
}
} else {
// Unknown is deliberately safe: show login form, never Offline dashboard.
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
}
if (profile && (profile.name || profile.avatarUrl || profile.email)) {
applyProfileToPopup(profile);
}
try {
if (candidateView === 'main' && !tf__openedChannelsThisPopup) {
tf__openedChannelsThisPopup = true;
tf_openOrFocusChannelsTab();
}
}
catch (e) { }
tf__setCandidateView(candidateView);
if (loginError) {
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) {
loginStatusEl.textContent = loginError;
}
chrome.storage.local.remove(['tfLoginError'], () => { });
}
});
}
document.addEventListener('DOMContentLoaded', async () => {
if (window.tfIntegrityReady && !(await window.tfIntegrityReady))
return;
if (typeof window.tfRequireLicense === 'function') {
const __tfLicenseAllowed = await window.tfRequireLicense();
if (!__tfLicenseAllowed)
return;
}
try {
tf_initConfirmModal();
}
catch (e) { }
try {
tf_uiPresenceOpen();
}
catch (e) { }
try {
tf_captureBaseAnalystRowTemplates();
}
catch (e) { }
// Do not reset tfEnteredMain here. Opening the side panel must not erase
// authenticated evidence from a website session that is already active.
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
catch (e) { }
const timeRangeToggleMain = document.getElementById('tf-tr-toggle-main');
const timeRangeToggleMasuk = document.getElementById('tf-tr-toggle-masuk');
const timeRangeToggleIsignal = document.getElementById('tf-tr-toggle-isignal');
const timeRangePanelMain = document.getElementById('tf-tr-panel-main');
const timeRangePanelMasuk = document.getElementById('tf-tr-panel-masuk');
const timeRangePanelIsignal = document.getElementById('tf-tr-panel-isignal');
const timeRangeParenMain = document.getElementById('tf-time-range-paren-main');
const timeRangeParenMasuk = document.getElementById('tf-time-range-paren-masuk');
const timeRangeParenIsignal = document.getElementById('tf-time-range-paren-isignal');
const timeRangeTitleMain = document.getElementById('tf-tr-title-main');
const timeRangeTitleMasuk = document.getElementById('tf-tr-title-masuk');
const timeRangeTitleIsignal = document.getElementById('tf-tr-title-isignal');
const TF_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_TIME_RANGE_ALLOWED = new Set(['m3', 'm6', 'y1', 'y2', 'y3', 'y5', 'all_time']);
const TF_TIME_RANGE_DEFAULT = 'all_time';
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL',
};
function tf_normalizeTimeRange(v) {
const s = String(v || '').trim();
if (TF_TIME_RANGE_ALLOWED.has(s))
return s;
return TF_TIME_RANGE_DEFAULT;
}
function tf_setActiveOption(root, v) {
if (!root)
return;
try {
const btns = root.querySelectorAll('.tf-tr-option');
btns.forEach((b) => {
const bv = b && b.dataset ? b.dataset.value : null;
b.classList.toggle('active', bv === v);
});
}
catch (e) { }
}
function tf_applyTimeRangeToUI(v) {
const label = TF_TIME_RANGE_LABELS[v] || TF_TIME_RANGE_LABELS[TF_TIME_RANGE_DEFAULT];
try {
if (timeRangeParenMain)
timeRangeParenMain.textContent = `(${label})`;
if (timeRangeParenMasuk)
timeRangeParenMasuk.textContent = `(${label})`;
if (timeRangeParenIsignal)
timeRangeParenIsignal.textContent = `(${label})`;
tf_setActiveOption(timeRangePanelMain, v);
tf_setActiveOption(timeRangePanelMasuk, v);
tf_setActiveOption(timeRangePanelIsignal, v);
}
catch (e) { }
}
function tf_saveTimeRange(v) {
try {
if (hasChromeStorage()) {
chrome.storage.local.set({ [TF_TIME_RANGE_KEY]: v }, () => { });
}
}
catch (e) { }
}
function tf_getCurrentTimeRangeForScan() {
try {
const panels = [timeRangePanelMain, timeRangePanelMasuk, timeRangePanelIsignal];
for (const panel of panels) {
if (!panel)
continue;
const active = panel.querySelector('.tf-tr-option.active[data-value]');
if (active && active.dataset && active.dataset.value) {
return tf_normalizeTimeRange(active.dataset.value);
}
}
}
catch (e) { }
return TF_TIME_RANGE_DEFAULT;
}
function tf_sendStartBatchScanWithSelectedTimeRange(message, callback) {
const forceTimeRange = tf_getCurrentTimeRangeForScan();
const payload = Object.assign({}, message || {}, { forceTimeRange });
const send = () => {
try {
chrome.runtime.sendMessage(payload, callback);
}
catch (e) {
if (typeof callback === 'function')
callback(null);
}
};
try {
if (hasChromeStorage()) {
chrome.storage.local.set({ [TF_TIME_RANGE_KEY]: forceTimeRange }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
send();
});
return;
}
}
catch (e) { }
send();
}
function tf_closeTimeRangePanels() {
try {
if (timeRangePanelMain)
timeRangePanelMain.hidden = true;
if (timeRangePanelMasuk)
timeRangePanelMasuk.hidden = true;
if (timeRangePanelIsignal)
timeRangePanelIsignal.hidden = true;
if (timeRangeToggleMain)
timeRangeToggleMain.setAttribute('aria-expanded', 'false');
if (timeRangeToggleMasuk)
timeRangeToggleMasuk.setAttribute('aria-expanded', 'false');
if (timeRangeToggleIsignal)
timeRangeToggleIsignal.setAttribute('aria-expanded', 'false');
}
catch (e) { }
}
function tf_toggleTimeRangePanelAny(toggle, panel) {
if (!toggle || !panel)
return;
const isOpen = panel.hidden === false;
const all = [
{ t: timeRangeToggleMain, p: timeRangePanelMain },
{ t: timeRangeToggleMasuk, p: timeRangePanelMasuk },
{ t: timeRangeToggleIsignal, p: timeRangePanelIsignal },
];
all.forEach((o) => {
if (!o || !o.t || !o.p)
return;
if (o.t === toggle)
return;
try {
o.p.hidden = true;
o.t.setAttribute('aria-expanded', 'false');
}
catch (e) { }
});
try {
panel.hidden = isOpen;
toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}
catch (e) { }
}
function tf_initTimeRangeSelector() {
const fallback = TF_TIME_RANGE_DEFAULT;
if (!hasChromeStorage()) {
tf_applyTimeRangeToUI(fallback);
return;
}
try {
chrome.storage.local.get([TF_TIME_RANGE_KEY], (res) => {
const raw = res ? res[TF_TIME_RANGE_KEY] : null;
const v = tf_normalizeTimeRange(raw);
tf_applyTimeRangeToUI(v);
if (!raw || raw !== v) {
tf_saveTimeRange(v);
}
});
}
catch (e) {
tf_applyTimeRangeToUI(fallback);
}
}
function tf_bindTimeRangeAccordion(toggle, panel, otherToggle, otherPanel) {
if (!toggle || !panel)
return;
const header = toggle.closest('.tf-tr-header');
if (header) {
header.addEventListener('click', (ev) => {
const isArrow = ev && ev.target ? !!ev.target.closest('.tf-tr-arrowbtn') : false;
if (isArrow)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
}
const box = toggle.closest('.profile-time-range');
if (box) {
box.addEventListener('click', (ev) => {
const t = ev && ev.target ? ev.target : null;
const inHeader = t ? !!t.closest('.tf-tr-header') : false;
const inPanel = t ? !!t.closest('.tf-tr-panel') : false;
const isArrow = t ? !!t.closest('.tf-tr-arrowbtn') : false;
const isOption = t ? !!t.closest('.tf-tr-option') : false;
if (inHeader || inPanel || isArrow || isOption)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
}
toggle.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
panel.addEventListener('click', (ev) => {
const btn = ev && ev.target ? ev.target.closest('.tf-tr-option') : null;
if (!btn)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
const v = tf_normalizeTimeRange(btn.dataset ? btn.dataset.value : null);
tf_applyTimeRangeToUI(v);
tf_saveTimeRange(v);
tf_closeTimeRangePanels();
});
}
try {
tf_bindTimeRangeAccordion(timeRangeToggleMain, timeRangePanelMain, timeRangeToggleMasuk, timeRangePanelMasuk);
tf_bindTimeRangeAccordion(timeRangeToggleMasuk, timeRangePanelMasuk, timeRangeToggleMain, timeRangePanelMain);
tf_bindTimeRangeAccordion(timeRangeToggleIsignal, timeRangePanelIsignal, timeRangeToggleMain, timeRangePanelMain);
const tf_bindTitleClick = (titleEl, toggleEl, panelEl, otherToggleEl, otherPanelEl) => {
if (!titleEl || !toggleEl || !panelEl)
return;
titleEl.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggleEl, panelEl);
});
};
tf_bindTitleClick(timeRangeTitleMain, timeRangeToggleMain, timeRangePanelMain, timeRangeToggleMasuk, timeRangePanelMasuk);
tf_bindTitleClick(timeRangeTitleMasuk, timeRangeToggleMasuk, timeRangePanelMasuk, timeRangeToggleMain, timeRangePanelMain);
tf_bindTitleClick(timeRangeTitleIsignal, timeRangeToggleIsignal, timeRangePanelIsignal, timeRangeToggleMain, timeRangePanelMain);
tf_initTimeRangeSelector();
document.addEventListener('click', (ev) => {
const t = ev && ev.target ? ev.target : null;
const inMain = (timeRangeToggleMain && timeRangeToggleMain.contains(t)) ||
(timeRangeTitleMain && timeRangeTitleMain.contains(t)) ||
(timeRangePanelMain && timeRangePanelMain.contains(t));
const inMasuk = (timeRangeToggleMasuk && timeRangeToggleMasuk.contains(t)) ||
(timeRangeTitleMasuk && timeRangeTitleMasuk.contains(t)) ||
(timeRangePanelMasuk && timeRangePanelMasuk.contains(t));
const inIsignal = (timeRangeToggleIsignal && timeRangeToggleIsignal.contains(t)) ||
(timeRangeTitleIsignal && timeRangeTitleIsignal.contains(t)) ||
(timeRangePanelIsignal && timeRangePanelIsignal.contains(t));
if (!inMain && !inMasuk && !inIsignal) {
tf_closeTimeRangePanels();
}
}, true);
document.addEventListener('keydown', (ev) => {
const k = ev ? (ev.key || ev.code || ev.keyCode) : null;
if (k === 'Escape' || k === 'Esc' || k === 27) {
tf_closeTimeRangePanels();
}
}, true);
}
catch (e) { }
const loginBtn = document.getElementById('login-btn');
const loginMt4Btn = document.getElementById('login-mt4-btn');
const loginGoogleBtn = document.getElementById('login-google-btn');
const loginUpgradePlanBtn = document.getElementById('login-upgrade-plan-btn');
const loginStatus = document.getElementById('login-status');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const rememberCheckbox = document.getElementById('login-remember');
const tfLoginOverlay = document.getElementById('tf-login-overlay');
const tfLoginOvTitle = document.getElementById('tf-login-ov-title');
const tfLoginOvSub = document.getElementById('tf-login-ov-sub');
const tfLoginOvCancel = document.getElementById('tf-login-ov-cancel');
const tfLoginOvRetry = document.getElementById('tf-login-ov-retry');
let tf__authTabId = null;
let tf__logoutTabId = null;
let tf__googleTimeoutT = null;
let tf__standardRetryTimer = null;
let tf__standardLoginAttempt = 0;
let tf__standardLoginIdentity = '';
let tf__standardLoginPassword = '';
let tf__standardRememberEnabled = false;
let tf__loginFlow = null;
let tf__loginFlowStartedAt = 0;
let tf__loginFlowToken = null;
let tf__openedChannelsThisPopup = false;
function tf_showLoginOverlay(title, sub, opts) {
try {
if (tfLoginOvTitle)
tfLoginOvTitle.textContent = title || 'Loading...';
if (tfLoginOvSub)
tfLoginOvSub.textContent = sub || '';
const showCancel = !!(opts && opts.showCancel);
const showRetry = !!(opts && opts.showRetry);
const hideSpinner = !!(opts && opts.hideSpinner);
if (tfLoginOvCancel)
tfLoginOvCancel.style.display = showCancel ? '' : 'none';
if (tfLoginOvRetry)
tfLoginOvRetry.style.display = showRetry ? '' : 'none';
try {
const sp = tfLoginOverlay ? tfLoginOverlay.querySelector('.boot-spinner') : null;
if (sp)
sp.style.display = hideSpinner ? 'none' : '';
}
catch (e) { }
if (tfLoginOverlay) {
tfLoginOverlay.style.display = 'flex';
tfLoginOverlay.setAttribute('aria-hidden', 'false');
try {
tfLoginOverlay.removeAttribute('inert');
}
catch (e) { }
try {
tfLoginOverlay.inert = false;
}
catch (e) { }
}
}
catch (e) { }
}
function tf__loginOverlayMoveFocusOut() {
try {
if (!tfLoginOverlay)
return;
const ae = document.activeElement;
if (ae && tfLoginOverlay.contains(ae)) {
try {
if (typeof ae.blur === 'function')
ae.blur();
}
catch (e) { }
const safe = loginBtn || loginMt4Btn || loginGoogleBtn || loginEmail || document.body;
try {
if (safe && typeof safe.focus === 'function')
safe.focus({ preventScroll: true });
}
catch (e) { }
}
}
catch (e) { }
}
function tf_hideLoginOverlay() {
try {
if (tfLoginOverlay) {
tf__loginOverlayMoveFocusOut();
try {
tfLoginOverlay.setAttribute('inert', '');
}
catch (e) { }
try {
tfLoginOverlay.inert = true;
}
catch (e) { }
tfLoginOverlay.setAttribute('aria-hidden', 'true');
tfLoginOverlay.style.display = 'none';
}
try {
const sp = tfLoginOverlay ? tfLoginOverlay.querySelector('.boot-spinner') : null;
if (sp)
sp.style.display = '';
}
catch (e) { }
if (tfLoginOvRetry)
tfLoginOvRetry.style.display = 'none';
if (tfLoginOvCancel)
tfLoginOvCancel.style.display = '';
}
catch (e) { }
}
function tf_cleanupTransientLoginTabs(extraTabIds) {
try {
if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) return;
const ids = Array.isArray(extraTabIds) ? extraTabIds.filter((id) => id != null).map((id) => Number(id)) : [];
chrome.runtime.sendMessage({ type: 'tf_close_transient_login_tabs', tabIds: ids }, () => {
try { void chrome.runtime.lastError; } catch (e) { }
});
}
catch (e) { }
}
function tf_setManualAuthState(active, mode, token) {
try {
if (!hasChromeStorage()) return;
const now = Date.now();
chrome.storage.local.set({
tfManualAuthActive: !!active,
tfManualAuthMode: active ? String(mode || '') : '',
tfManualAuthToken: active ? String(token || '') : '',
tfManualAuthStartedAt: active ? now : 0,
tfManualAuthStateAt: now
}, () => { });
}
catch (e) { }
}
function tf_closeAuthTab() {
const id = tf__authTabId;
try {
if (typeof chrome !== 'undefined' && chrome.tabs && id != null) {
chrome.tabs.remove(id, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
}
catch (e) { }
try { tf_cleanupTransientLoginTabs(id != null ? [id] : []); } catch (e) { }
tf__authTabId = null;
}
function tf_closeLogoutTab() {
try {
if (typeof chrome !== 'undefined' && chrome.tabs && tf__logoutTabId != null) {
chrome.tabs.remove(tf__logoutTabId, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
}
catch (e) { }
tf__logoutTabId = null;
}
function tf_openOrFocusChannelsTab() {
try {
const urlPattern = 'https://account.tradersfamily.id/channels*';
const createUrl = 'https://account.tradersfamily.id/channels/';
chrome.tabs.query({ url: urlPattern }, (tabs) => {
try {
if (tabs && tabs.length) {
const t = tabs[0];
try {
chrome.windows.update(t.windowId, { focused: true }, () => { });
}
catch (e) { }
try {
chrome.tabs.update(t.id, { active: true }, () => { });
}
catch (e) { }
return;
}
}
catch (e) { }
try {
chrome.tabs.create({ url: createUrl, active: true }, () => { });
}
catch (e) { }
});
}
catch (e) { }
}
function tf_sendMessageWithRetry(tabId, message, maxTries = 10, delayMs = 700) {
try {
let tries = 0;
const attempt = () => {
tries++;
try {
chrome.tabs.sendMessage(tabId, message, (resp) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (resp && resp.ok) {
return;
}
if (tries < maxTries) {
setTimeout(attempt, delayMs);
}
});
}
catch (e) {
if (tries < maxTries)
setTimeout(attempt, delayMs);
}
};
setTimeout(attempt, 250);
}
catch (e) { }
}
function tf_clearGoogleTimer() {
try {
if (tf__googleTimeoutT)
clearTimeout(tf__googleTimeoutT);
}
catch (e) { }
tf__googleTimeoutT = null;
}
function tf_clearStandardRetryTimer() {
try {
if (tf__standardRetryTimer)
clearTimeout(tf__standardRetryTimer);
}
catch (e) { }
tf__standardRetryTimer = null;
}
function tf_resetStandardRetryState() {
tf_clearStandardRetryTimer();
tf__standardLoginAttempt = 0;
tf__standardLoginIdentity = '';
tf__standardLoginPassword = '';
tf__standardRememberEnabled = false;
}
function tf_openStandardLoginAttempt(attemptNumber) {
if (tf__loginFlow !== 'standard')
return;
tf_clearStandardRetryTimer();
tf__standardLoginAttempt = Math.max(1, Math.min(2, Number(attemptNumber) || 1));
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'auth_' + Math.random().toString(36).slice(2) + '_' + Date.now();
const idVal = String(tf__standardLoginIdentity || '').trim();
const passVal = String(tf__standardLoginPassword || '').trim();
const rememberEnabled = !!tf__standardRememberEnabled;
if (!idVal || !passVal) {
tf_resetStandardRetryState();
tf__loginFlow = null;
if (loginStatus)
loginStatus.textContent = 'Email/Username dan Password tidak tersedia.';
return;
}
if (hasChromeStorage()) {
const toStore = {
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfForceLoginForm: true,
tfEnterMainAfterLogin: true,
tfAuthFlowToken: tf__loginFlowToken,
tfAuthTokenSeen: '',
tfPendingLogin: { mode: 'standard', identity: idVal, password: passVal },
tfPendingGoogleLogin: false,
tfCaptchaNeeded: false,
tfCaptchaSolved: false,
tfRememberLogin: rememberEnabled ? { enabled: true, email: idVal } : { enabled: false, email: '' },
tfLoginError: '',
tfExplicitLogoutAt: 0,
tfScanInProgress: false
};
chrome.storage.local.set(toStore, () => { });
}
const attemptLabel = tf__standardLoginAttempt === 1 ? 'Percobaan 1 dari 2' : 'Percobaan 2 dari 2';
tf_showLoginOverlay('Membuka halaman login...', attemptLabel + ' • menunggu maksimal 1 menit', { showCancel: true, showRetry: false });
const targetUrl = 'https://account.tradersfamily.id/?tfAuth=1&tfManualAuth=1&tfAuthToken=' + encodeURIComponent(tf__loginFlowToken || '') + '#';
tf_setManualAuthState(true, 'standard', tf__loginFlowToken || '');
try { tf_cleanupTransientLoginTabs([]); } catch (e) { }
if (typeof chrome !== 'undefined' && chrome.tabs) {
try {
chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
try {
if (tab && typeof tab.id !== 'undefined') {
tf__authTabId = tab.id;
try {
tf_sendMessageWithRetry(tf__authTabId, { type: 'tfDoStandardLogin', identity: idVal, password: passVal, token: (tf__loginFlowToken || '') }, 12, 650);
}
catch (e) { }
}
}
catch (e) { }
});
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
const watchedToken = tf__loginFlowToken;
const watchedAttempt = tf__standardLoginAttempt;
tf__standardRetryTimer = setTimeout(() => {
try {
if (tf__loginFlow !== 'standard' || tf__loginFlowToken !== watchedToken || tf__standardLoginAttempt !== watchedAttempt)
return;
const continueAfterCheck = (confirmed) => {
if (confirmed || tf__loginFlow !== 'standard' || tf__loginFlowToken !== watchedToken)
return;
tf_closeAuthTab();
if (watchedAttempt < 2) {
tf_showLoginOverlay('Halaman login terlalu lama', 'Tab ditutup. Mengulang otomatis • percobaan 2 dari 2', { showCancel: true, showRetry: false });
setTimeout(() => {
try {
if (tf__loginFlow === 'standard')
tf_openStandardLoginAttempt(2);
}
catch (e) { }
}, 350);
return;
}
tf_clearStandardRetryTimer();
tf_setManualAuthState(false, '', '');
if (hasChromeStorage()) {
try {
chrome.storage.local.remove(['tfPendingLogin', 'tfCaptchaNeeded', 'tfCaptchaSolved', 'tfLoginError'], () => { });
}
catch (e) { }
}
tf_showLoginOverlay('Login belum berhasil', 'Sudah mencoba 2 kali. Silakan klik Masuk untuk mencoba kembali.', { showCancel: false, showRetry: false, hideSpinner: true });
setTimeout(() => {
try {
tf_hideLoginOverlay();
}
catch (e) { }
if (loginStatus)
loginStatus.textContent = 'Login belum berhasil setelah 2 percobaan.';
tf__loginFlow = null;
tf__loginFlowToken = null;
tf_resetStandardRetryState();
showLoginView();
}, 1800);
};
if (hasChromeStorage()) {
chrome.storage.local.get(['tfLoginConfirmed', 'tfAccountLoginState'], (data) => {
const confirmed = !!(data && data.tfLoginConfirmed === true) || /logged[_ -]?in|online/i.test(String(data && data.tfAccountLoginState || ''));
continueAfterCheck(confirmed);
});
}
else {
continueAfterCheck(false);
}
}
catch (e) { }
}, 60000);
showLoginView();
}
if (tfLoginOvCancel) {
tfLoginOvCancel.addEventListener('click', () => {
tf_clearGoogleTimer();
tf_resetStandardRetryState();
tf_setManualAuthState(false, '', '');
tf_closeAuthTab();
tf_hideLoginOverlay();
tf__loginFlow = null;
tf__loginFlowToken = null;
try {
if (hasChromeStorage()) {
chrome.storage.local.remove(['tfPendingLogin', 'tfPendingGoogleLogin', 'tfCaptchaNeeded', 'tfCaptchaSolved', 'tfLoginError'], () => { });
}
}
catch (e) { }
showLoginView();
});
}
if (tfLoginOvRetry) {
tfLoginOvRetry.addEventListener('click', () => {
tf_clearGoogleTimer();
tf_resetStandardRetryState();
tf_setManualAuthState(false, '', '');
tf_closeAuthTab();
tf_hideLoginOverlay();
tf__loginFlow = null;
tf__loginFlowToken = null;
try {
if (hasChromeStorage()) {
chrome.storage.local.remove(['tfPendingGoogleLogin', 'tfLoginError'], () => { });
}
}
catch (e) { }
showLoginView();
try {
setTimeout(() => {
try {
tf_startGoogleLoginFlow(loginGoogleBtn);
}
catch (e) { }
}, 80);
}
catch (e) { }
});
}
function handleLoginEnter(event) {
if (!event)
return;
const key = event.key || event.code || event.keyCode;
const isEnter = key === 'Enter' ||
key === 'NumpadEnter' ||
key === 13;
if (!isEnter) {
return;
}
event.preventDefault();
event.stopPropagation();
if (loginBtn) {
loginBtn.click();
}
}
if (loginEmail) {
loginEmail.addEventListener('keydown', handleLoginEnter);
}
if (loginPassword) {
loginPassword.addEventListener('keydown', handleLoginEnter);
}
function tf_guardBtnBusy(btn) {
try {
if (!btn || !btn.dataset)
return false;
if (btn.dataset.busy === '1')
return true;
btn.dataset.busy = '1';
setTimeout(() => { try {
btn.dataset.busy = '0';
}
catch (e) { } }, 1500);
}
catch (e) { }
return false;
}
function tf_startStandardLoginFlow(btnRef) {
if (tf_guardBtnBusy(btnRef || loginBtn))
return;
const idVal = (loginEmail && loginEmail.value ? loginEmail.value : '').trim();
const passVal = (loginPassword && loginPassword.value ? loginPassword.value : '').trim();
if (!idVal || !passVal) {
if (loginStatus)
loginStatus.textContent = 'Isi Email/Username/MT4 Id dan Password terlebih dahulu.';
return;
}
tf_resetStandardRetryState();
try {
if (hasChromeStorage()) {
chrome.storage.local.set({
tfExplicitLogoutAt: 0,
tfScanInProgress: false,
tfForceLoginForm: true,
tfLoginError: ''
}, () => { });
}
}
catch (e) { }
tf__standardLoginIdentity = idVal;
tf__standardLoginPassword = passVal;
tf__standardRememberEnabled = !!(rememberCheckbox && rememberCheckbox.checked);
tf__loginFlow = 'standard';
if (loginStatus)
loginStatus.textContent = '';
tf_openStandardLoginAttempt(1);
}
function tf_startMt4LoginFlow(btnRef) {
if (tf_guardBtnBusy(btnRef || loginBtn))
return;
const idVal = (loginEmail && loginEmail.value ? loginEmail.value : '').trim();
const passVal = (loginPassword && loginPassword.value ? loginPassword.value : '').trim();
if (!idVal || !passVal) {
if (loginStatus)
loginStatus.textContent = 'Isi Email/Username/MT4 Id dan Password terlebih dahulu.';
return;
}
const rememberEnabled = !!(rememberCheckbox && rememberCheckbox.checked);
tf__loginFlow = 'mt4';
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'auth_' + Math.random().toString(36).slice(2) + '_' + Date.now();
if (hasChromeStorage()) {
const toStore = {
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfForceLoginForm: true,
tfEnterMainAfterLogin: true,
tfAuthFlowToken: tf__loginFlowToken,
tfAuthTokenSeen: '',
tfPendingLogin: { mode: 'mt4', identity: idVal, password: passVal },
tfPendingGoogleLogin: false,
tfCaptchaNeeded: false,
tfCaptchaSolved: false,
tfRememberLogin: rememberEnabled ? { enabled: true, email: idVal } : { enabled: false, email: '' },
tfLoginError: '',
tfExplicitLogoutAt: 0,
tfScanInProgress: false
};
chrome.storage.local.set(toStore, () => { });
}
if (loginStatus)
loginStatus.textContent = '';
tf_showLoginOverlay('Membuka halaman login MT4...', 'Menunggu halaman login...', { showCancel: true, showRetry: false });
const targetUrl = 'https://account.tradersfamily.id/loginmt/?tfAuth=1&tfManualAuth=1&tfAuthToken=' + encodeURIComponent(tf__loginFlowToken || '');
tf_setManualAuthState(true, 'mt4', tf__loginFlowToken || '');
try { tf_cleanupTransientLoginTabs([]); } catch (e) { }
if (typeof chrome !== 'undefined' && chrome.tabs) {
try {
chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
try {
if (tab && typeof tab.id !== 'undefined')
tf__authTabId = tab.id;
}
catch (e) { }
});
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
showLoginView();
}
function tf_startGoogleLoginFlow() {
if (tf_guardBtnBusy(loginGoogleBtn))
return;
tf__loginFlow = 'google';
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'auth_' + Math.random().toString(36).slice(2) + '_' + Date.now();
tf_clearGoogleTimer();
if (hasChromeStorage()) {
chrome.storage.local.set({
tfPendingGoogleLogin: { token: tf__loginFlowToken || '' },
tfPendingLogin: null,
tfEnterMainAfterLogin: true,
tfForceLoginForm: true,
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now(),
tfAuthFlowToken: tf__loginFlowToken,
tfAuthTokenSeen: '',
tfLoginError: '',
tfExplicitLogoutAt: 0,
tfScanInProgress: false
}, () => { });
}
tf_showLoginOverlay('Login by Google...', 'Buka tab login. Plugin akan coba klik tombol Google otomatis. Menunggu proses login (maks 1 menit)', { showCancel: true, showRetry: false });
const targetUrl = 'https://account.tradersfamily.id/?tfAuth=1&tfManualAuth=1&tfAuthToken=' + encodeURIComponent(tf__loginFlowToken || '') + '#';
tf_setManualAuthState(true, 'google', tf__loginFlowToken || '');
try { tf_cleanupTransientLoginTabs([]); } catch (e) { }
if (typeof chrome !== 'undefined' && chrome.tabs) {
try {
chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
try {
if (tab && typeof tab.id !== 'undefined')
tf__authTabId = tab.id;
}
catch (e) { }
});
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
tf__googleTimeoutT = setTimeout(() => {
try {
if (tf__loginFlow !== 'google')
return;
tf_setManualAuthState(false, '', '');
tf_showLoginOverlay('Session time out..!', 'Silahkan coba login kembali.', { showCancel: false, showRetry: true, hideSpinner: true });
}
catch (e) { }
}, 1 * 60 * 1000);
showLoginView();
}
async function tf_openLoginUpgradePlan() {
try {
const subscribeUrl = new URL(chrome.runtime.getURL('subscribe_plan.html'));
let email = String((loginEmail && loginEmail.value) || '').trim().toLowerCase();
if (!email && hasChromeStorage()) {
try {
const stored = await new Promise((resolve) => {
chrome.storage.local.get(['tfLicenseCredentials'], (result) => resolve(result || {}));
});
const credentials = stored.tfLicenseCredentials || {};
email = String(credentials.email || '').trim().toLowerCase();
}
catch (e) { }
}
if (email)
subscribeUrl.searchParams.set('email', email);
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url: subscribeUrl.toString(), active: true });
}
else {
window.open(subscribeUrl.toString(), '_blank', 'noopener,noreferrer');
}
}
catch (error) {
try {
window.open(chrome.runtime.getURL('subscribe_plan.html'), '_blank', 'noopener,noreferrer');
}
catch (e) { }
}
}
if (loginBtn) {
loginBtn.addEventListener('click', () => tf_startStandardLoginFlow(loginBtn)
~~~