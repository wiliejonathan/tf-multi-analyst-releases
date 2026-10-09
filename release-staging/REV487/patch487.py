from pathlib import Path
import shutil,sys,json,hashlib
out=Path(sys.argv[1]);stage=Path('release-staging/REV487')
for p in (stage/'overrides').rglob('*'):
 if p.is_file():
  dst=out/p.relative_to(stage/'overrides');dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dst)
actual={str(p.relative_to(out)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in out.rglob('*') if p.is_file()}
assert actual==json.loads((stage/'FILE_HASHES.json').read_text()),'Package differs from locally tested build'
print('PASS exact tested REV487 package')
