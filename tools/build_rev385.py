from pathlib import Path
import re, json, hashlib, sys

root=Path(sys.argv[1])
jsf=root/'assets/4b4d6b8dc315a95c.js'
s=jsf.read_text()

pat1=re.compile(r"function tf_getHoldingDurationMs\(row\) \{.*?\n\}\nfunction tf_renderHoldingPeriodTables",re.S)
helpers=r"""function tf_parseHistoryTableDateMs(value) {
try {
if (value === null || value === undefined)
return null;
if (typeof value === 'number' && Number.isFinite(value) && value > 0)
return value;
const raw = String(value || '').trim();
if (!raw)
return null;
const wib = raw.replace(/\s*WIB\s*$/i, '').trim();
const m = wib.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
if (m) {
const day = Number(m[1]);
const month = Number(m[2]);
const year = Number(m[3]);
const hour = Number(m[4]);
const minute = Number(m[5]);
const second = Number(m[6] || 0);
if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59) {
const utcMs = Date.UTC(year, month - 1, day, hour - 7, minute, second, 0);
if (Number.isFinite(utcMs))
return utcMs;
}
}
const parsed = Date.parse(raw);
return Number.isFinite(parsed) ? parsed : null;
}
catch (e) {
return null;
}
}
function tf_getHoldingDurationMs(row) {
try {
if (!row || row.isWithdraw)
return null;
let created = tf_parseHistoryTableDateMs(row.createdDate);
let closed = tf_parseHistoryTableDateMs(row.displayDate);
if (!Number.isFinite(created) || created <= 0)
created = Number(row.createdSortKey);
if (!Number.isFinite(closed) || closed <= 0)
closed = Number(row.sortKey);
if (!Number.isFinite(created) || !Number.isFinite(closed) || created <= 0 || closed <= 0)
return null;
const diff = closed - created;
return Number.isFinite(diff) && diff >= 0 ? diff : null;
}
catch (e) {
return null;
}
}
function tf_formatHoldingDuration(ms) {
const raw = Number(ms);
if (!Number.isFinite(raw) || raw < 0)
return '—';
let totalMinutes = Math.round(raw / 60000);
if (totalMinutes <= 0)
return '0m';
const days = Math.floor(totalMinutes / 1440);
totalMinutes -= days * 1440;
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes - (hours * 60);
const parts = [];
if (days > 0)
parts.push(days + 'd');
if (hours > 0 || days > 0)
parts.push(hours + 'h');
parts.push(minutes + 'm');
return parts.join(' ');
}
function tf_renderHoldingPeriodTables"""
s,n=pat1.subn(lambda _:helpers,s,count=1)
assert n==1, 'Holding duration helper block not found'

render_start=s.find("function tf_renderHoldingPeriodTables")
render_end=s.find("function recomputeHistoryRows()",render_start)
assert render_start>=0 and render_end>render_start, 'Holding renderer boundaries not found'
recompute_open=s.find("{",render_end)
assert recompute_open>render_end, 'recomputeHistoryRows opening brace not found'
render=r"""function tf_renderHoldingPeriodTables(tableRows) {
const leftBody = document.getElementById('tf-holding-body-left');
const rightBody = document.getElementById('tf-holding-body-right');
if (!leftBody || !rightBody)
return;
const rows = Array.isArray(tableRows) ? tableRows.filter((r) => r && !r.isWithdraw) : [];
function tf_holdingAnalystPairKey(row) {
const analyst = String(row && row.analyst || '').trim();
const pair = String(row && row.pair || '').trim().toUpperCase();
if (!analyst || !pair)
return '';
return analyst + ' - ' + pair;
}
const names = Array.from(new Set(rows.map(tf_holdingAnalystPairKey).filter(Boolean)))
.sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));
const maxByAnalyst = new Map();
const avgAgg = new Map();
for (let i = 0; i < rows.length; i++) {
const row = rows[i];
const name = tf_holdingAnalystPairKey(row);
if (!name)
continue;
const ms = tf_getHoldingDurationMs(row);
if (ms === null)
continue;
const prev = maxByAnalyst.get(name);
if (!Number.isFinite(prev) || ms > prev)
maxByAnalyst.set(name, ms);
let agg = avgAgg.get(name);
if (!agg) {
agg = { sum: 0, count: 0 };
avgAgg.set(name, agg);
}
agg.sum += ms;
agg.count += 1;
}
function renderSide(tbody, subset) {
tbody.innerHTML = '';
if (!subset.length) {
const tr = document.createElement('tr');
tr.className = 'tf-holding-empty-row';
const td = document.createElement('td');
td.colSpan = 3;
td.textContent = names.length ? '—' : 'Belum ada trade yang tampil di Table 3 untuk filter aktif.';
tr.appendChild(td);
tbody.appendChild(tr);
return;
}
subset.forEach((name) => {
const tr = document.createElement('tr');
const tdName = document.createElement('td');
tdName.className = 'tf-holding-analyst';
tdName.textContent = name;
const tdMax = document.createElement('td');
tdMax.className = 'mono tf-holding-value';
tdMax.textContent = tf_formatHoldingDuration(maxByAnalyst.get(name));
const tdAvg = document.createElement('td');
tdAvg.className = 'mono tf-holding-value';
const agg = avgAgg.get(name);
tdAvg.textContent = agg && agg.count > 0 ? tf_formatHoldingDuration(agg.sum / agg.count) : '—';
tr.appendChild(tdName);
tr.appendChild(tdMax);
tr.appendChild(tdAvg);
tbody.appendChild(tr);
});
}
const splitAt = Math.ceil(names.length / 2);
renderSide(leftBody, names.slice(0, splitAt));
renderSide(rightBody, names.slice(splitAt));
}
function recomputeHistoryRows() {"""
s=s[:render_start]+render+s[recompute_open+1:]

old="""const tf_holdingAllTickerRows = baseRows.slice();
try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }
try {
const tf_holdingFilteredRows = tf_filterRowsByUnifiedDate(baseRows);
tf_renderHoldingPeriodTables(tf_holdingAllTickerRows, tf_holdingFilteredRows);
}
catch (e) { }"""
new="""try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }"""
assert old in s, 'Premature Holding render block not found'
s=s.replace(old,new,1)

anchor="const rowsForUi = tf_getHistoryRowsForUiAndExport(rowsForDisplay);"
assert anchor in s
s=s.replace(anchor,anchor+"\ntry {\ntf_renderHoldingPeriodTables(rowsForUi);\n}\ncatch (e) { }",1)

oldnote="""    <strong>Max</strong> = holding period terlama dari seluruh trade yang masih termasuk ticker/analis-pair aktif.\\n    <strong>Avg.</strong> = rata-rata holding period dalam filter aktif (Time Range / Time Range per Month / Filter Tanggal)."""
newnote="""    <strong>Max</strong> dan <strong>Avg.</strong> dihitung langsung dari trade yang tampil di <strong>Table 3</strong> untuk filter aktif.\\n    Rumus setiap trade: <strong>Closed At − Created At</strong> dari kolom tanggal Table 3 (Time Range / Time Range per Month / Filter Tanggal / Nama Analis - Pair)."""
assert oldnote in s, 'Holding note not found'
s=s.replace(oldnote,newnote,1)
jsf.write_text(s)

mf=root/'manifest.json'
manifest=json.loads(mf.read_text())
manifest['version']='1.16.98'
manifest['version_name']='REV385'
manifest['description']='REV385: Holding Period uses exact final Table 3 rows and Table 3 Created At / Closed At labels as source of truth.'
mf.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
(root/'README_REV385.md').write_text("""# REV385

Holding Period source-of-truth fix.

- Holding = Table 3 Closed At minus Table 3 Created At.
- Exact visible WIB labels are parsed first; numeric keys are fallback only.
- Max and Avg use final filtered Table 3 trade rows.
- Withdraw rows are excluded.
- Version: 1.16.98 / REV385.
""")
(root/'REV385_HOLDING_QA.txt').write_text("""REV385 Holding QA
Source fixture validated locally against supplied JSON with 4,348 trades.
Rule: Table 3 Closed At - Table 3 Created At.
Expected sample: 03-08-2026 09:52 WIB -> 04-08-2026 18:47 WIB = 1d 8h 55m.
""")

loader=root/'assets/7b6af0cb4001a684.js'
ls=loader.read_text()
m=re.search(r'const FILES = (\{.*?\});\n// The integrity loader',ls,re.S)
assert m, 'Integrity registry not found'
files=json.loads(m.group(1))
files['README_REV385.md']=''
files['REV385_HOLDING_QA.txt']=''
newmap={}
for p in sorted(files):
    fp=root/p
    assert fp.is_file(), 'Missing protected file: '+p
    newmap[p]=hashlib.sha256(fp.read_bytes()).hexdigest()
reg='const FILES = '+json.dumps(newmap,separators=(',',':'),ensure_ascii=False)+';\n// The integrity loader'
loader.write_text(ls[:m.start()]+reg+ls[m.end():])
print('REV385 patched; protected files',len(newmap))
