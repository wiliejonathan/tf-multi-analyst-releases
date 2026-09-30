from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1])
f=root/'assets/927ecbd63036f61b.js';s=f.read_text()
s=s.replace('function tf_confirmDeleteAnalyst() {','function tf_confirmDeleteAnalyst(title = "Hapus Analis?") {\nconst heading=document.getElementById("tf-confirm-title");\nif(heading)heading.textContent=title;')
s+='\n'+(Path(__file__).parent/'pair-delete408.js').read_text()
f.write_text(s)
f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.21',version_name='REV408');f.write_text(json.dumps(m,indent=2)+'\n')
f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m.group(1));d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
