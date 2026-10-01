from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1]);mobile=len(sys.argv)>2 and sys.argv[2]=='mobile';tools=Path(__file__).parent
f=root/('assets/dashboard-mobile.js' if mobile else 'assets/4b4d6b8dc315a95c.js');s=f.read_text()
a=s.index('function tf_animateEquity412() {');b=s.index('function tf_renderBalanceCards412(',a)
s=s[:a]+(tools/'animation414.js').read_text()+'\n'+(tools/'cards414.js').read_text()+'\n'+s[b:]
s=s.replace('function tf_renderBalanceCards412(saldo, equity, busy) {','function tf_renderBalanceCards412(saldo, equity, busy) {\n  window.__tfBalanceCardsState414 = {saldo, equity, busy};',1)
s=s.replace('function tf_initPresentation412() {','function tf_initPresentation412() {\n  tf_ensureBalanceCards414();',1)
old='if (next === tfTradeTimeRangeKey && !hadSingleMonth)\nreturn;';assert old in s
s=s.replace(old,'if (next === tfTradeTimeRangeKey && !hadSingleMonth) {\ntf_animateEquity412();\nreturn;\n}',1)
f.write_text(s)
if mobile:
 f=root/'mobile-app-shell.js';s=f.read_text();old="if(q('tf-mobile-performance-screen')) return q('tf-mobile-performance-screen');";assert old in s
 s=s.replace(old,"if(q('tf-mobile-performance-screen')) { tf_ensureBalanceCards414(q('tf-mobile-performance-screen')); return q('tf-mobile-performance-screen'); }",1)
 old='section.appendChild(perf);';assert old in s;s=s.replace(old,old+'\n    tf_ensureBalanceCards414(section);',1)
 old="if(key === 'performance'){";assert old in s;s=s.replace(old,"if(key === 'equity'){ requestAnimationFrame(() => tf_animateEquity412()); }\n\n    "+old,1);f.write_text(s)
 f=root/'mobile-overrides.css';f.write_text(f.read_text()+'''
/* REV414: balance cards remain visible independently of analyst-table state. */
#tf-mobile-performance-screen > #tf-balance-cards412{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;width:100%!important;max-width:100%!important;min-width:0;gap:10px;margin:12px 0 14px;box-sizing:border-box;}
#tf-mobile-performance-screen > #tf-balance-cards412 .tf-balance-card412{min-width:0;padding:12px;border-radius:12px;}
#tf-mobile-performance-screen > #tf-balance-cards412 .tf-balance-label412{font-size:12px;margin-bottom:7px;}
#tf-mobile-performance-screen > #tf-balance-cards412 .tf-balance-value412{font-size:clamp(18px,4.5vw,25px);overflow-wrap:anywhere;line-height:1.25;}
@media(min-width:700px){#tf-mobile-performance-screen > #tf-balance-cards412{grid-template-columns:repeat(4,minmax(0,1fr))!important;}}
''')
 for p in root.glob('*'):
  if p.is_file() and p.suffix in ['.js','.html']:
   t=p.read_text().replace('rev=413','rev=414')
   if p.name=='mobile-license-gate.js':t=t.replace("mobileVersion: '1.17.26'","mobileVersion: '1.17.27'").replace("remoteRevision: 'REV413'","remoteRevision: 'REV414'")
   if p.name=='mobile-force-update.js':t=t.replace("CURRENT_TAG = 'v1.17.26'","CURRENT_TAG = 'v1.17.27'")
   if p.name=='service-worker.js':t=t.replace('rev413-equity-chart-restore','rev414-smooth-equity-visible-cards')
   p.write_text(t)
else:
 # Hidden iSignal legacy chart uses the same animation helper for consistency.
 f=root/'assets/894f18e8a37bd7c6.js';s=f.read_text();a=s.index('function tf_animateEquity412() {');b=s.index('function tf_renderBalanceCards412(',a);f.write_text(s[:a]+(tools/'animation414.js').read_text()+'\n'+s[b:])
 f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.27',version_name='REV414');f.write_text(json.dumps(m,indent=2)+'\n')
 f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m[1]);d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
