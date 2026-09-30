from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1])
css='''
/* REV411: square analyst/status boxes and delete controls; UI only. */
:is(#analyst-links-container,#isignal-links-container) :is(.analyst-paste-btn,.analyst-name-btn,.analyst-remove-btn,.tf-pair-delete408) {
  border-radius:0!important;
}
:is(#analyst-links-container,#isignal-links-container) .tf-sidebar-risk-healthy {
  border-color:rgba(34,197,94,.45)!important;
  background:rgba(34,197,94,.10)!important;
}
:is(#analyst-links-container,#isignal-links-container) .tf-sidebar-risk-warning {
  border-color:rgba(250,204,21,.45)!important;
  background:rgba(250,204,21,.10)!important;
}
:is(#analyst-links-container,#isignal-links-container) .tf-sidebar-risk-critical {
  border-color:rgba(239,68,68,.45)!important;
  background:rgba(239,68,68,.10)!important;
}
:is(#analyst-links-container,#isignal-links-container) .tf-pair-delete408 {
  display:inline-flex;align-items:center;justify-content:center;
  width:14px;height:14px;padding:0!important;
  border:1px solid rgba(239,68,68,.65)!important;
  line-height:1!important;
}
'''
f=root/'assets/6f5f92e21ebd9721.css';f.write_text(f.read_text()+css)
f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.24',version_name='REV411');f.write_text(json.dumps(m,indent=2)+'\n')
f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m.group(1));d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
