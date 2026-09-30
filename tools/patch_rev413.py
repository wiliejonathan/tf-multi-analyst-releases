from pathlib import Path
import json,re,sys,hashlib
root=Path(sys.argv[1]);mobile=len(sys.argv)>2 and sys.argv[2]=='mobile'
f=root/('assets/dashboard-mobile.js' if mobile else 'assets/4b4d6b8dc315a95c.js');s=f.read_text()
# REV412 inserted restore before the candle crosshair instead of after the line
# layer. On a retained canvas bitmap, the zero-width first clip then persisted.
start=s.index('function drawEquityCurve() {');end=s.index('\nfunction getEquityAnalystsSource(',start+1)
draw=s[start:end]
anchor='if (equityCrosshairX !== null && equityCrosshairY !== null) {'
pos=draw.index(anchor);restore=draw.rfind('ctx.restore();',0,pos)
assert draw[restore:pos].strip()=='ctx.restore();'
draw=draw[:restore]+draw[restore+len('ctx.restore();'):]
anchor='if (equityCrosshairX !== null && equityCrosshairY !== null) {'
pos=draw.rfind(anchor);assert pos>draw.index('if(!isCandleMode && tfEquityAnimation412)')
draw=draw[:pos]+'ctx.restore(); // REV413: release the line-animation clip on every frame.\n'+draw[pos:]
s=s[:start]+draw+s[end:]
m=re.match(r'document.body.innerHTML = (".*?");',s,re.S);h=json.loads(m[1])
pat=r'<div class="tf-time-range-row tf-perf-time-range-row" id="tf-time-range-row-perf">.*?<div class="tf-time-range-buttons" id="tf-time-range-buttons-perf"></div>\s*</div>'
row=re.search(pat,h,re.S);assert row
performance_range=row[0];h=h[:row.start()]+h[row.end():]
cards='<div id="tf-balance-cards412" class="tf-balance-cards412" aria-label="Ringkasan balance" aria-live="polite"></div>'
assert cards in h;h=h.replace(cards,cards+'\n'+performance_range,1)
note=re.search(r'<div class="tf-holding-note">.*?</div>',h,re.S);assert note
holding_range='<div class="tf-time-range-row tf-holding-time-range-row" id="tf-time-range-row-holding"><span class="tf-time-range-label">Time Range:</span><div class="tf-time-range-buttons" id="tf-time-range-buttons-holding"></div></div>'
h=h[:note.end()]+'\n'+holding_range+h[note.end():]
s=s[:m.start(1)]+json.dumps(h,ensure_ascii=False)+s[m.end(1):]
assert "'tf-time-range-buttons-perf'];" in s
s=s.replace("'tf-time-range-buttons-perf'];","'tf-time-range-buttons-perf', 'tf-time-range-buttons-holding'];")
anchor="tf_renderTradeRangeButtons('tf-time-range-buttons-perf');";assert anchor in s
s=s.replace(anchor,anchor+"\ntf_renderTradeRangeButtons('tf-time-range-buttons-holding');",1)
f.write_text(s)
if mobile:
 for p in root.glob('*'):
  if p.is_file() and p.suffix in ['.js','.html']:
   t=p.read_text().replace('rev=412','rev=413')
   if p.name=='mobile-license-gate.js':t=t.replace("mobileVersion: '1.17.25'","mobileVersion: '1.17.26'").replace("remoteRevision: 'REV412'","remoteRevision: 'REV413'")
   if p.name=='mobile-force-update.js':t=t.replace("CURRENT_TAG = 'v1.17.25'","CURRENT_TAG = 'v1.17.26'")
   if p.name=='service-worker.js':t=t.replace('rev412-equity-isignal-overview','rev413-equity-chart-restore')
   p.write_text(t)
else:
 f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.26',version_name='REV413');f.write_text(json.dumps(m,indent=2)+'\n')
 f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m[1]);d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
