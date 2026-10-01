from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1]);tools=Path(__file__).parent
p=root/'assets/927ecbd63036f61b.js';s=p.read_text()
a=s.index('// REV408: scoped deletion in the analyst pair selector.')
# The pair-deletion module is the final module in this sidebar bundle.
assert s[a:].strip().endswith('})();')
p.write_text(s[:a]+(tools/'pair-delete416.js').read_text())
p=root/'manifest.json';m=json.loads(p.read_text());m.update(version='1.17.29',version_name='REV416');p.write_text(json.dumps(m,indent=2)+'\n')
p=root/'assets/7b6af0cb4001a684.js';s=p.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m[1]);d={path:hashlib.sha256((root/path).read_bytes()).hexdigest() for path in d};p.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
