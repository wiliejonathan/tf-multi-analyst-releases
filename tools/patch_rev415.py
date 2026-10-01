from pathlib import Path
import json, re, hashlib, sys
root=Path(sys.argv[1]); mobile=len(sys.argv)>2 and sys.argv[2]=='mobile'
f=root/('assets/dashboard-mobile.js' if mobile else 'assets/4b4d6b8dc315a95c.js')
s=f.read_text(); first,rest=s.split('\n',1)
h=json.loads(first.split('=',1)[1].strip().rstrip(';'))
start='<div class="controls-row tf-mm-controls-row tf-mm-primary-row">'
end='<div class="tf-holding-section" id="tf-holding-period-section">'
assert h.count(start)==1 and h.count(end)==1
h=h.replace(start,'<fieldset id="tf-user-adjustment415" class="tf-user-adjustment415"><legend>User Adjustmend</legend>\n'+start,1)
h=h.replace(end,'</fieldset>\n'+end,1)
def analyst_row(kind):
 return '<div class="controls-row tf-analyst-filter415" id="tf-analyst-filter-row-'+kind+'"><span class="tf-time-range-label">Filter Analis:</span><div id="analyst-filter-container-'+kind+'"></div></div>\n'
if not mobile:
 block='<div class="equity-filter-row tf-table1-analytics-filter" id="tf-table1-analytics-filter"><div class="tf-time-range-row" id="tf-time-range-row-table1"><span class="tf-time-range-label">Time Range:</span><div class="tf-time-range-buttons" id="tf-time-range-buttons-table1"></div></div><label for="tf-single-month-select-table1">Time Range per Month:</label><select class="tf-single-month-select form-input" id="tf-single-month-select-table1"><option value="">Default (Time Range)</option></select></div>\n'
 h=h.replace(end,end+'\n'+block,1)
h=h.replace('<div class="equity-filter-row tf-table1-analytics-filter"',analyst_row('table1')+'<div class="equity-filter-row tf-table1-analytics-filter"',1)
h=h.replace('<div class="tf-time-range-row tf-holding-time-range-row"',analyst_row('holding')+'<div class="tf-time-range-row tf-holding-time-range-row"',1)
s='document.body.innerHTML = '+json.dumps(h,ensure_ascii=False)+';\n'+rest
s=s.replace("const statsContainerIds = ['analyst-filter-container',", "const statsContainerIds = ['analyst-filter-container-table1', 'analyst-filter-container-holding', 'analyst-filter-container',",1)
s=s.replace("event.target.closest('#analyst-filter-container,", "event.target.closest('#analyst-filter-container-table1, #analyst-filter-container-holding, #analyst-filter-container,",1)
if not mobile:
 s=s.replace("const ids = ['tf-single-month-select-perf',", "const ids = ['tf-single-month-select-table1', 'tf-single-month-select-perf',")
 s=s.replace("const ids = ['tf-time-range-buttons-equity',", "const ids = ['tf-time-range-buttons-table1', 'tf-time-range-buttons-equity',")
 s=s.replace("tf_renderTradeRangeButtons('tf-time-range-buttons-holding');", "tf_renderTradeRangeButtons('tf-time-range-buttons-holding');\ntf_renderTradeRangeButtons('tf-time-range-buttons-table1');",1)
s=s.replace('function tf_renderBalanceCards412(saldo, equity, busy) {','function tf_renderBalanceCards412(saldo, equity, busy, pips = null) {',1)
s=s.replace('{saldo, equity, busy};','{saldo, equity, busy, pips};',1)
s=s.replace('tf_renderBalanceCards412(state.saldo, state.equity, state.busy);','tf_renderBalanceCards412(state.saldo, state.equity, state.busy, state.pips);',1)
old="tf_renderBalanceCards412(Number(currentBalance)||0,equity412,tf_isMyfxbookPriceLoading());"
assert s.count(old)==1
s=s.replace(old,"""// Same finite pnlPips values and enabled/date-filtered trades as PnL Pips equity.
// Cash withdrawals affect USD only; costs and lot size never change pure pips.
const pips415 = tf_lastEquityCalcRows.filter(r => r && !r.isWithdraw && !r.isStart).reduce((sum, r) => sum + (typeof r.pnlPips === 'number' && Number.isFinite(r.pnlPips) ? r.pnlPips : 0), 0);
tf_renderBalanceCards412(Number(currentBalance)||0,equity412,tf_isMyfxbookPriceLoading(),tf_lastEquityCalcRows.length ? pips415 : null);""",1)
old="+ text + '</div></div>';"
new="""+ text + '</div>' + (i === 2 ? '<div class="tf-balance-pips415 ' + (Number.isFinite(pips) && pips < 0 ? 'neg' : Number.isFinite(pips) && pips > 0 ? 'pos' : '') + '">' + (!Number.isFinite(pips) ? '— pips' : (pips > 0 ? '+' : '') + pips.toLocaleString('en-US', {maximumFractionDigits: 2}) + ' pips') + '</div>' : '') + '</div>';"""
assert s.count(old)==1;s=s.replace(old,new,1);f.write_text(s)
css='''
/* REV415: adjustment grouping and synchronized analyst filters. */
.tf-user-adjustment415{min-width:0;margin:18px 0;padding:12px 14px 8px;border:1px solid rgba(148,163,184,.32);border-radius:10px;box-sizing:border-box;}
.tf-user-adjustment415>legend{padding:0 8px;font-size:13px;font-weight:600;color:inherit;}
.tf-analyst-filter415{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:12px 0 8px;min-width:0;}
.tf-analyst-filter415>div{display:flex;flex-wrap:wrap;gap:8px;min-width:0;}
.tf-balance-pips415{font-size:12px;line-height:1.4;margin-top:5px;opacity:.9;color:inherit;}
.tf-balance-pips415.neg{color:#ff5d6c;}.tf-balance-pips415.pos{color:#3ddc97;}
@media(max-width:600px){.tf-user-adjustment415{padding:10px;margin:14px 0;}}
'''
f=root/('assets/dashboard-original.css' if mobile else 'assets/7e95b596e5bf8dff.css');f.write_text(f.read_text()+css)
# All dashboard, iSignal and sidebar risk consumers use the same calendar window.
risk_files=[root/'assets/dashboard-mobile.js'] if mobile else [root/'assets/4b4d6b8dc315a95c.js',root/'assets/894f18e8a37bd7c6.js',root/'assets/tf-latest-risk-sidebar-rev393.js']
for p in risk_files:
 t=p.read_text()
 old="const latestMonth = maxTs == null ? '' : tf_latestRiskMonthKey(maxTs);"
 assert t.count(old)==1
 t=t.replace(old,old+"\n// REV415: newest data month plus its two preceding calendar months (ALL data).\nconst newestIndex = latestMonth ? Number(latestMonth.slice(0,4))*12 + Number(latestMonth.slice(5,7))-1 : null;\nconst oldestIndex = newestIndex == null ? null : newestIndex-2;\nconst windowStartMonth = oldestIndex == null ? '' : String(Math.floor(oldestIndex/12)) + '-' + String(oldestIndex%12+1).padStart(2,'0');",1)
 old='const inLatestMonth=(period)=>tf_latestRiskMonthKey(period.start)<=latestMonth && tf_latestRiskMonthKey(period.end)>=latestMonth;'
 assert t.count(old)==1
 t=t.replace(old,'const inLatestMonth=(period)=>tf_latestRiskMonthKey(period.start)<=latestMonth && tf_latestRiskMonthKey(period.end)>=windowStartMonth;',1)
 t=t.replace('__tfLatestRiskState = { monthKey:latestMonth, byPair, byAnalyst, signature };','__tfLatestRiskState = { monthKey:latestMonth, windowStartMonth, windowMonths:3, byPair, byAnalyst, signature };',1)
 t=t.replace("(' · ' + st.monthKey)","(' · 3 bulan hingga ' + st.monthKey)")
 t=t.replace('bulan data paling baru','3 bulan terbaru dari seluruh data (ALL) Table 3, dihitung dari bulan data paling baru dan dua bulan sebelumnya')
 t=t.replace('di bulan terbaru','dalam 3 bulan terbaru dari data ALL')
 t=t.replace('risiko bulan terbaru dari seluruh Table 3','risiko 3 bulan terbaru dari seluruh data (ALL) Table 3')
 t=t.replace('TABLE 3 · BULAN TERBARU','TABLE 3 · ALL DATA · 3 BULAN TERBARU')
 p.write_text(t)
if mobile:
 for p in root.iterdir():
  if p.is_file() and p.suffix in ['.js','.html']:
   t=p.read_text().replace('rev=414','rev=415')
   if p.name=='mobile-license-gate.js':t=t.replace("mobileVersion: '1.17.27'","mobileVersion: '1.17.28'").replace("remoteRevision: 'REV414'","remoteRevision: 'REV415'")
   if p.name=='mobile-force-update.js':t=t.replace("CURRENT_TAG = 'v1.17.27'","CURRENT_TAG = 'v1.17.28'")
   if p.name=='service-worker.js':t=t.replace('rev414-smooth-equity-visible-cards','rev415-pips-analyst-adjustment')
   p.write_text(t)
else:
 f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.28',version_name='REV415');f.write_text(json.dumps(m,indent=2)+'\n')
 f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m[1]);d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
