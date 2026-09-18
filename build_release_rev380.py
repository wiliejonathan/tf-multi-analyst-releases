import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

BASE_VERSION = '1.16.92'
BASE_REVISION = 'REV379'
NEW_VERSION = '1.16.93'
NEW_REVISION = 'REV380'
OUTPUT = 'TF_Extension_PC_MAC_REV380_MOBILE_CALC_PARITY.zip'

base = Path(sys.argv[1])
root = Path(__file__).resolve().parent
out = root / 'deliverables' / OUTPUT
out.parent.mkdir(exist_ok=True)

with zipfile.ZipFile(base) as z:
    data = {name: z.read(name) for name in z.namelist() if not name.endswith('/')}

manifest = json.loads(data['manifest.json'].decode('utf-8'))
assert manifest.get('version') == BASE_VERSION, manifest.get('version')
assert manifest.get('version_name') == BASE_REVISION, manifest.get('version_name')

core_candidates = []
for name, raw in data.items():
    if not (name.startswith('assets/') and name.endswith('.js')):
        continue
    if b'const TF_EXPORT_STORAGE_KEYS' in raw and b'tf_multi_analyst_export_v1' in raw:
        core_candidates.append(name)
assert len(core_candidates) == 1, core_candidates
core_name = core_candidates[0]
core = data[core_name].decode('utf-8')

old = """'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,"""
new = """'tfAvgSlPips',
// REV380: Mobile calculation parity. The PC price snapshot is part of the
// exported/Remote bundle so Mobile uses the same $/pip inputs as Desktop.
'tfMyfxbookPrices',
'tfMyfxbookPricesAt',
TF_ANALYST_SOURCES_KEY,"""
count = core.count(old)
assert count == 1, f'export storage anchor count={count}'
core = core.replace(old, new, 1)
data[core_name] = core.encode('utf-8')

manifest['version'] = NEW_VERSION
manifest['version_name'] = NEW_REVISION
manifest['description'] = 'REV380: Mobile calculation parity; Remote/export bundle now carries the exact PC price snapshot used for $/pip, lot and PnL calculations.'
data['manifest.json'] = (json.dumps(manifest, indent=2, ensure_ascii=False) + '\n').encode('utf-8')
data['README_REV380.md'] = (
    '# REV380 - Mobile Calculation Parity\n\n'
    'Desktop formulas are unchanged. The export/Remote bundle now includes tfMyfxbookPrices and '
    'tfMyfxbookPricesAt so Android/iOS/Browser can calculate with the same price snapshot as the PC plugin.\n'
).encode('utf-8')

loader_candidates = []
for name, raw in data.items():
    if name.startswith('assets/') and name.endswith('.js') and b'const FILES =' in raw and b'window.tfIntegrityReady' in raw:
        loader_candidates.append(name)
assert len(loader_candidates) == 1, loader_candidates
loader_name = loader_candidates[0]
loader = data[loader_name].decode('utf-8')
marker = 'window.tfIntegrityReady = (async () => {'
assert marker in loader
block = '// REV380 final integrity overrides - Mobile calculation parity.\n'
for name in [core_name, 'manifest.json']:
    block += f'FILES["{name}"] = "{hashlib.sha256(data[name]).hexdigest()}";\n'
block += '\n'
loader = loader.replace(marker, block + marker, 1)
data[loader_name] = loader.encode('utf-8')

m = re.search(r'const FILES = (\{.*?\});', loader, re.S)
assert m, 'integrity FILES object missing'
files = json.loads(m.group(1))
for path, digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;', loader):
    files[path] = digest
missing = []
mismatch = []
for path, expected in files.items():
    if path not in data:
        missing.append(path)
        continue
    actual = hashlib.sha256(data[path]).hexdigest()
    if actual != expected:
        mismatch.append((path, expected, actual))
assert not missing, missing
assert not mismatch, mismatch

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name, value in sorted(data.items()):
        zi = zipfile.ZipInfo(name, (2026, 9, 18, 22, 45, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = 0o100644 << 16
        z.writestr(zi, value, compresslevel=9)

sha = hashlib.sha256(out.read_bytes()).hexdigest()
(out.parent / (OUTPUT + '.sha256')).write_text(f'{sha}  {OUTPUT}\n', encoding='utf-8')
print('output=' + str(out))
print('core=' + core_name)
print('integrity_loader=' + loader_name)
print('protected_entries=' + str(len(files)))
print('zip_size=' + str(out.stat().st_size))
print('zip_sha256=' + sha)
