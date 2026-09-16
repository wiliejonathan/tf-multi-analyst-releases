import hashlib,json,sys,zipfile
from pathlib import Path
base=Path(sys.argv[1]); root=Path(__file__).resolve().parent
stage=root/'release-staging/REV373'
checks=json.loads((stage/'base-files.json').read_text())
with zipfile.ZipFile(base) as z:
    data={n:z.read(n) for n in z.namelist() if not n.endswith('/')}
for name,digest in checks.items():
    assert name in data and hashlib.sha256(data[name]).hexdigest()==digest, 'Base release differs: '+name
for p in (stage/'extension').rglob('*'):
    if p.is_file():data[p.relative_to(stage/'extension').as_posix()]=p.read_bytes()
manifest=json.loads(data['manifest.json']);assert manifest['version']=='1.16.86' and manifest['version_name']=='REV373'
output=root/'deliverables/TF_Extension_PC_MAC_REV373_ACTIVATION_FIX.zip';output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,value in sorted(data.items()):
        zi=zipfile.ZipInfo(name,(2026,9,16,0,0,0));zi.compress_type=zipfile.ZIP_DEFLATED;zi.external_attr=0o100644<<16
        z.writestr(zi,value,compresslevel=9)
print(output)
