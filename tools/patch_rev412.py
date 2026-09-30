from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1]);mobile=len(sys.argv)>2 and sys.argv[2]=='mobile'
tools=Path(__file__).parent
features=(tools/'features412.js').read_text();css=(tools/'features412.css').read_text()
def replace(s,old,new,count=1):
 assert s.count(old)>=count,old[:100]
 return s.replace(old,new,count)
def patch_dashboard(f):
 s=f.read_text()
 m=re.match(r'document.body.innerHTML = (".*?");',s,re.S);h=json.loads(m[1])
 anchor='<div class="tf-perf-overall"'
 assert anchor in h
 h=h.replace(anchor,'<div id="tf-balance-cards412" class="tf-balance-cards412" aria-label="Ringkasan balance" aria-live="polite"></div>\n  '+anchor,1)
 s=s[:m.start(1)]+json.dumps(h,ensure_ascii=False)+s[m.end(1):]
 # When analyst/pair selection changes, retain the global timeframe/month but
 # fit its newly computed dataset. Previously ALL inherited another analyst's dates.
 s=replace(s,'function applyAnalystPairFilterAll() {','function applyAnalystPairFilterAll() {\nequityFilterStart = null; equityFilterEnd = null; equityHoverIndex = null;\ntf_markEquityCandleViewportForFullReset();')
 # Cancel old animation, points and metrics even on loading/empty early returns.
 s=replace(s,'function updateEquityCurveFromRows(rows) {','function updateEquityCurveFromRows(rows) {\ntf_cancelEquityAnimation412();\ntf_lastEquityCalcRows = [];\nequityCurvePoints = []; equityCompareCurvePoints = [];\ntf_renderBalanceCards412(Number(currentBalance)||0, null, tf_isMyfxbookPriceLoading());')
 s=replace(s,'tf_lastEquityCalcRows = Array.isArray(enabledRows) ? enabledRows.slice() : [];','tf_lastEquityCalcRows = Array.isArray(enabledRows) ? enabledRows.slice() : [];\nlet last412 = null, lastKey412 = -Infinity;\nfor(const r of tf_lastEquityCalcRows){if(!r || r.isStart)continue;const k=tf_getPrimarySortKey(r);if(!Number.isFinite(k)||k<lastKey412)continue;last412=r;lastKey412=k;}\nconst equity412 = last412 && Number.isFinite(Number(last412.balancePnl)) ? Number(last412.balancePnl) : last412 && Number.isFinite(Number(last412.balanceCompound)) ? Number(last412.balanceCompound) : null;\ntf_renderBalanceCards412(Number(currentBalance)||0,equity412,tf_isMyfxbookPriceLoading());')
 s=replace(s,'drawEquityCurve();\ncomputeAndRenderEquityDrawdownSummary();','tf_animateEquity412();\ncomputeAndRenderEquityDrawdownSummary();')
 # Clip only the actual plotted series, keeping labels, grid and hover interactive.
 s=replace(s,"if (equityChartMode === 'candle') {\ntry {\nconst candles = [];","ctx.save();\nif(!isCandleMode && tfEquityAnimation412){ctx.beginPath();ctx.rect(paddingLeft,paddingTop,chartWidth*tfEquityAnimation412.progress,chartHeight);ctx.clip();}\nif (equityChartMode === 'candle') {\ntry {\nconst candles = [];")
 s=replace(s,'if (equityCrosshairX !== null && equityCrosshairY !== null) {','ctx.restore();\nif (equityCrosshairX !== null && equityCrosshairY !== null) {')
 return s
dashboard=root/('assets/dashboard-mobile.js' if mobile else 'assets/4b4d6b8dc315a95c.js')
dashboard_source=patch_dashboard(dashboard)
def patch_isignal(s):
 s=replace(s,'el.textContent = v;\nreturn;','tf_applySubscription412(el, v);\nreturn;')
 s=s.replace("else span.textContent = value ? String(value) : '—';","else tf_applySubscription412(span, value ? String(value) : '—');")
 s=replace(s,"subSpan.textContent = subTxt || '—';","tf_applySubscription412(subSpan, subTxt || '—');")
 # Apply aggregate analyst risk on every refreshed link; no pair severity override.
 s=replace(s,"linkEl.setAttribute('data-analyst', name);","linkEl.setAttribute('data-analyst', name);\ntf_applyLatestRiskColorOnly(linkEl, name, null);")
 return s
dashboard.write_text(patch_isignal(dashboard_source)+'\n'+features)
if mobile:
 (root/'assets/dashboard-original.css').write_text((root/'assets/dashboard-original.css').read_text()+css)
else:
 # iSignal Users has its own JS bundle and previously had no risk implementation.
 f=root/'assets/894f18e8a37bd7c6.js';s=patch_isignal(f.read_text())
 risk=dashboard_source[dashboard_source.index('// ===== REV393: Latest-month'):dashboard_source.index('// ===== END REV393 latest-month risk warning system =====')]
 assert 'let __tfLatestRiskState' not in s
 f.write_text(s+'\n'+risk+'\n'+features)
 for name in ['7e95b596e5bf8dff.css','a089ce37692fc17f.css']:
  f=root/'assets'/name;f.write_text(f.read_text()+css)
 f=root/'assets/6f5f92e21ebd9721.css';s=f.read_text();s+='''
/* REV412: match the existing link-input corner radius and left-align names. */
:is(#analyst-links-container,#isignal-links-container) :is(.analyst-link-input,.analyst-paste-btn,.analyst-name-btn,.pair-multiselect-display,.analyst-remove-btn){border-radius:8px!important;}
:is(#analyst-links-container,#isignal-links-container) :is(.analyst-paste-btn,.analyst-name-btn){text-align:left!important;justify-content:flex-start!important;padding-left:8px!important;}
:is(#analyst-links-container,#isignal-links-container) .tf-pair-delete408{border-radius:3px!important;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:16px;height:16px;padding:0!important;font:12px/1 Arial,sans-serif!important;text-align:center;}
:is(#analyst-links-container,#isignal-links-container) .tf-pair-delete408[hidden]{display:none!important;}
''';f.write_text(s)
 f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.25',version_name='REV412');f.write_text(json.dumps(m,indent=2)+'\n')
 f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m[1]);d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
