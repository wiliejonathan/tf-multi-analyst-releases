from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1])
css='''
/* REV410: sidebar layout only; retain existing theme and all controls. */
#analyst-links-container .analyst-row,
#isignal-links-container .analyst-row,
.tf-analyst-columns410 {
  display:grid;
  grid-template-columns:minmax(0,.7fr) minmax(0,1.1fr) minmax(100px,1fr) 32px;
  gap:6px;
  align-items:center;
  width:100%;
  min-width:0;
}
.tf-analyst-columns410 {margin-bottom:6px;}
#analyst-links-container .analyst-row > *,
#isignal-links-container .analyst-row > * {min-width:0;}
#analyst-links-container .analyst-link-input,
#isignal-links-container .analyst-link-input {
  width:100%;max-width:100%;height:32px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
#analyst-links-container .analyst-paste-btn,
#analyst-links-container .analyst-name-btn,
#isignal-links-container .analyst-paste-btn,
#isignal-links-container .analyst-name-btn {
  display:block;width:100%;max-width:100%;height:32px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
#analyst-links-container .pair-multiselect,
#isignal-links-container .pair-multiselect {width:100%;min-width:0;max-width:none;}
#analyst-links-container .pair-multiselect-display,
#isignal-links-container .pair-multiselect-display {height:32px;min-width:0;}
#analyst-links-container .pair-multiselect-dropdown,
#isignal-links-container .pair-multiselect-dropdown {
  left:auto;right:0;width:max(100%,132px);min-width:132px;
  overflow-x:hidden;overflow-y:auto;
}
#analyst-links-container .pair-option,
#isignal-links-container .pair-option {min-width:0;white-space:nowrap;}
#analyst-links-container .pair-option input,
#isignal-links-container .pair-option input {flex:0 0 auto;}
#analyst-links-container .pair-option > span,
#isignal-links-container .pair-option > span {min-width:0;}
#analyst-links-container .analyst-remove-btn,
#isignal-links-container .analyst-remove-btn {width:32px;height:32px;padding-inline:0;}
'''
f=root/'assets/6f5f92e21ebd9721.css';f.write_text(f.read_text()+css)
f=root/'assets/927ecbd63036f61b.js';s=f.read_text();m=re.match(r'document.body.innerHTML = (".*?");',s,re.S);assert m
body=json.loads(m.group(1));old='<label class="form-label" style="margin-bottom: 6px;">Link Analis :</label>'
assert old in body
body=body.replace(old,'<div class="form-label tf-analyst-columns410"><span>Link Analis</span><span>Nama</span><span>Pair</span><span aria-hidden="true"></span></div>')
f.write_text(s[:m.start(1)]+json.dumps(body,ensure_ascii=False)+s[m.end(1):])
f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.23',version_name='REV410');f.write_text(json.dumps(m,indent=2)+'\n')
f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m.group(1));d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
