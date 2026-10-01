from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1]);mobile=len(sys.argv)>2 and sys.argv[2]=='mobile'
p=root/('assets/dashboard-mobile.js' if mobile else 'assets/4b4d6b8dc315a95c.js');s=p.read_text();first,rest=s.split('\n',1);h=json.loads(first.split('=',1)[1].strip().rstrip(';'))
card='<div id="tf-balance-cards412" class="tf-balance-cards412" aria-label="Ringkasan balance" aria-live="polite"></div>'
assert h.count(card)==1;h=h.replace(card,'',1)
title='<div class="tf-perf-overall-title">Performance/Probability Analis</div>'
assert h.count(title)==1;h=h.replace(title,title+'\n'+card,1)
row='<div class="controls-row tf-analyst-filter415" id="tf-analyst-filter-row-table1"><span class="tf-time-range-label">Filter Analis:</span><div id="analyst-filter-container-table1"></div></div>'
assert h.count(row)==1;h=h.replace(row,'',1)
# Put the analyst-only row in the top Performance head, above the existing range.
anchor='    <!-- Time Range buttons (sync with Equity Curve & Table 3) -->'
assert h.count(anchor)==1;h=h.replace(anchor,row+'\n'+anchor,1)
h,count=re.subn(r'<div class="equity-filter-row tf-table1-analytics-filter" id="tf-table1-analytics-filter">.*?</select>\s*</div>','',h,count=1,flags=re.S);assert count==1
s='document.body.innerHTML = '+json.dumps(h,ensure_ascii=False)+';\n'+rest
s=s.replace("'tf-single-month-select-table1', ",'').replace("'tf-time-range-buttons-table1', ",'').replace("tf_renderTradeRangeButtons('tf-time-range-buttons-table1');",'')
s=s.replace("  if (screen) {\n    const head = perf.querySelector('.tf-perf-head');", "  const title = document.querySelector('.tf-perf-overall-title');\n  if (title) title.insertAdjacentElement('afterend', host);\n  if (screen) {\n    const head = title?.closest('.tf-perf-head') || perf.querySelector('.tf-perf-head');",1)
assert '    screen.insertBefore(host, perf);' in s;s=s.replace('    screen.insertBefore(host, perf);','',1)
p.write_text(s)
css='''
/* REV417: title, balance cards, metric controls, analyst filter, existing range. */
.tf-perf-head{display:block;min-width:0;}
.tf-perf-head>.tf-balance-cards412{width:100%;box-sizing:border-box;margin:12px 0 14px;}
.tf-perf-head>.tf-analyst-filter415{width:100%;margin:12px 0 6px;}
'''
p=root/('assets/dashboard-original.css' if mobile else 'assets/7e95b596e5bf8dff.css');p.write_text(p.read_text()+css)
if mobile:
 p=root/'mobile-overrides.css';p.write_text(p.read_text().replace('#tf-mobile-performance-screen > #tf-balance-cards412','#tf-mobile-performance-screen #tf-balance-cards412'))
 for p in root.iterdir():
  if p.is_file() and p.suffix in ['.js','.html']:
   t=p.read_text().replace('rev=415','rev=417')
   if p.name=='mobile-license-gate.js':t=t.replace("mobileVersion: '1.17.28'","mobileVersion: '1.17.30'").replace("remoteRevision: 'REV415'","remoteRevision: 'REV417'")
   if p.name=='mobile-force-update.js':t=t.replace("CURRENT_TAG = 'v1.17.28'","CURRENT_TAG = 'v1.17.30'")
   if p.name=='service-worker.js':t=t.replace('rev415-pips-analyst-adjustment','rev417-top-analyst-cards-layout')
   p.write_text(t)
else:
 p=root/'manifest.json';m=json.loads(p.read_text());m.update(version='1.17.30',version_name='REV417');p.write_text(json.dumps(m,indent=2)+'\n')
 p=root/'assets/7b6af0cb4001a684.js';s=p.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m[1]);d={f:hashlib.sha256((root/f).read_bytes()).hexdigest() for f in d};p.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
