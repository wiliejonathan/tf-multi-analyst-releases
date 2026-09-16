import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

BASE_VERSION = '1.16.90'
BASE_REVISION = 'REV377'
NEW_VERSION = '1.16.91'
NEW_REVISION = 'REV378'
OUTPUT = 'TF_Extension_PC_MAC_REV378_PAIR_SELECTOR_LABEL_FIX.zip'

base = Path(sys.argv[1])
root = Path(__file__).resolve().parent
out = root / 'deliverables' / OUTPUT
out.parent.mkdir(exist_ok=True)

with zipfile.ZipFile(base) as z:
    data = {name: z.read(name) for name in z.namelist() if not name.endswith('/')}

manifest = json.loads(data['manifest.json'].decode('utf-8'))
assert manifest.get('version') == BASE_VERSION, manifest.get('version')
assert manifest.get('version_name') == BASE_REVISION, manifest.get('version_name')

popup_name = 'assets/927ecbd63036f61b.js'
popup = data[popup_name].decode('utf-8')

# UI-only change: initial selector text and runtime text no longer use the "Pair:" prefix.
assert popup.count('Pair: ALL') == 3, popup.count('Pair: ALL')
popup = popup.replace('Pair: ALL', 'ALL')

old = "const finalText = 'Pair: ' + (useAll ? 'ALL' : labelText) + ' ▾';"
new = "const finalText = (useAll ? 'ALL' : labelText) + ' ▾';"
assert popup.count(old) == 1, popup.count(old)
popup = popup.replace(old, new, 1)
data[popup_name] = popup.encode('utf-8')

manifest['version'] = NEW_VERSION
manifest['version_name'] = NEW_REVISION
manifest['description'] = 'REV378: scan pair selector label matches row selector style; single pair shows symbol, multi-pair shows N Pairs, with no Pair: prefix.'
data['manifest.json'] = (json.dumps(manifest, indent=2, ensure_ascii=False) + '\n').encode('utf-8')
data['README_REV378.md'] = b'# REV378 - Pair Selector Label Fix\n\nUI-only change. The Scan Channel pair selector no longer shows the `Pair:` prefix. ALL displays `ALL`, one selected pair displays the symbol (for example `XAUUSD`), and two or more selected pairs display `2 Pairs`, `3 Pairs`, etc. Pair selection, storage, scan, Update, Submit and all other behavior are unchanged.\n'

# Regenerate protected hashes for the changed protected files.
loader_candidates = []
for name, raw in data.items():
    if name.startswith('assets/') and name.endswith('.js') and b'const FILES =' in raw and b'window.tfIntegrityReady' in raw:
        loader_candidates.append(name)
assert len(loader_candidates) == 1, loader_candidates
loader_name = loader_candidates[0]
loader = data[loader_name].decode('utf-8')
marker = 'window.tfIntegrityReady = (async () => {'
assert marker in loader
block = '// REV378 final integrity overrides - pair selector label presentation only.\n'
for name in [popup_name, 'manifest.json']:
    block += f'FILES["{name}"] = "{hashlib.sha256(data[name]).hexdigest()}";\n'
block += '\n'
loader = loader.replace(marker, block + marker, 1)
data[loader_name] = loader.encode('utf-8')

# Verify effective integrity registry against exact bytes.
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

# Deterministic package: this reproduces the locally verified REV378 ZIP byte-for-byte.
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name, value in sorted(data.items()):
        zi = zipfile.ZipInfo(name, (2026, 9, 17, 2, 5, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = 0o100644 << 16
        z.writestr(zi, value, compresslevel=9)

print('output=' + str(out))
print('integrity_loader=' + loader_name)
print('protected_entries=' + str(len(files)))
print('zip_sha256=' + hashlib.sha256(out.read_bytes()).hexdigest())
