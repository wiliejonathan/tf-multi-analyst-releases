from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1]);mobile=len(sys.argv)>2 and sys.argv[2]=='mobile'
p=root/('assets/dashboard-mobile.js' if mobile else 'assets/4b4d6b8dc315a95c.js');s=p.read_text();first,rest=s.split('\n',1);h=json.loads(first.split('=',1)[1].strip().rstrip(';'))
a=h.index('<fieldset id="tf-user-adjustment415"');b=h.index('</fieldset>',a)+len('</fieldset>');group=h[a:b];h=h[:a]+h[b:]
anchor='<div class="tf-perf-wrap" id="tf-perf-wrap"';assert h.count(anchor)==1;h=h.replace(anchor,group+'\n'+anchor,1)
s='document.body.innerHTML = '+json.dumps(h,ensure_ascii=False)+';\n'+rest
old='    if (head) screen.insertBefore(head, perf);';assert s.count(old)==1
s=s.replace(old,old+"\n    const adjustment = document.getElementById('tf-user-adjustment415');\n    if (adjustment) screen.insertBefore(adjustment, head || perf);",1)
p.write_text(s)
if mobile:
 # Attach the new Performance screen before resolving controls by document ID.
 # A detached screen makes the helper return early and price-panel cleanup can
 # otherwise remove the original adjustment group before it is relocated.
 p=root/'mobile-app-shell.js';t=p.read_text();old='    section.appendChild(perf);\n    tf_ensureBalanceCards414(section);';assert t.count(old)==1;t=t.replace(old,'    section.appendChild(perf);',1)
 old='    else host.appendChild(section);\n\n    return section;';assert t.count(old)>=1;t=t.replace(old,'    else host.appendChild(section);\n\n    tf_ensureBalanceCards414(section);\n    return section;',1);p.write_text(t)
 for p in root.iterdir():
  if p.is_file() and p.suffix in ['.js','.html']:
   t=p.read_text().replace('rev=417','rev=418')
   if p.name=='mobile-license-gate.js':t=t.replace("mobileVersion: '1.17.30'","mobileVersion: '1.17.31'").replace("remoteRevision: 'REV417'","remoteRevision: 'REV418'")
   if p.name=='mobile-force-update.js':t=t.replace("CURRENT_TAG = 'v1.17.30'","CURRENT_TAG = 'v1.17.31'")
   if p.name=='service-worker.js':t=t.replace('rev417-top-analyst-cards-layout','rev418-adjustment-above-performance')
   p.write_text(t)
else:
 p=root/'manifest.json';m=json.loads(p.read_text());m.update(version='1.17.31',version_name='REV418');p.write_text(json.dumps(m,indent=2)+'\n')
 p=root/'assets/7b6af0cb4001a684.js';s=p.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m[1]);d={f:hashlib.sha256((root/f).read_bytes()).hexdigest() for f in d};p.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
