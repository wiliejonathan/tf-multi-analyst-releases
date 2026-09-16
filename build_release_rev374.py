import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

BASE_VERSION = '1.16.86'
BASE_REVISION = 'REV373'
NEW_VERSION = '1.16.87'
NEW_REVISION = 'REV374'
OUTPUT = 'TF_Extension_PC_MAC_REV374_INTEGRITY_HASH_FIX.zip'

base = Path(sys.argv[1])
root = Path(__file__).resolve().parent
out = root / 'deliverables' / OUTPUT
out.parent.mkdir(exist_ok=True)

with zipfile.ZipFile(base) as z:
    data = {name: z.read(name) for name in z.namelist() if not name.endswith('/')}

manifest = json.loads(data['manifest.json'].decode('utf-8'))
assert manifest.get('version') == BASE_VERSION, f"Unexpected base version: {manifest.get('version')}"
assert manifest.get('version_name') == BASE_REVISION, f"Unexpected base revision: {manifest.get('version_name')}"

manifest['version'] = NEW_VERSION
manifest['version_name'] = NEW_REVISION
manifest['description'] = 'REV374: protected-file integrity hashes regenerated for REV373 activation runtime changes.'
data['manifest.json'] = (json.dumps(manifest, indent=2, ensure_ascii=False) + '\n').encode('utf-8')

loader_candidates = []
for name, raw in data.items():
    if not name.startswith('assets/') or not name.endswith('.js'):
        continue
    if b'const FILES =' in raw and b'window.tfIntegrityReady' in raw:
        loader_candidates.append(name)
assert len(loader_candidates) == 1, f'Expected one integrity loader, found: {loader_candidates}'
loader_name = loader_candidates[0]

required = ['assets/tf-device-background.js', 'assets/tf-device-lock.js', 'manifest.json']
for name in required:
    assert name in data, f'Missing protected runtime file: {name}'

digests = {name: hashlib.sha256(data[name]).hexdigest() for name in required}
loader = data[loader_name].decode('utf-8')
marker = 'window.tfIntegrityReady = (async () => {'
assert marker in loader, 'Integrity loader marker not found'
assert 'REV374 final integrity overrides' not in loader, 'REV374 overrides already present in base'

block = (
    '\n// REV374 final integrity overrides - regenerate hashes after REV373 activation runtime changes.\n'
    f'FILES["assets/tf-device-background.js"] = "{digests["assets/tf-device-background.js"]}";\n'
    f'FILES["assets/tf-device-lock.js"] = "{digests["assets/tf-device-lock.js"]}";\n'
    f'FILES["manifest.json"] = "{digests["manifest.json"]}";\n\n'
)
loader = loader.replace(marker, block + marker, 1)
data[loader_name] = loader.encode('utf-8')

# Verify the effective protected-file registry against the exact final bytes.
match = re.search(r'const FILES = (\{.*?\});', loader, re.S)
assert match, 'Integrity FILES object not found'
files = json.loads(match.group(1))
for path, digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;', loader):
    files[path] = digest
missing = [path for path in files if path not in data]
mismatch = []
for path, expected in files.items():
    if path not in data:
        continue
    actual = hashlib.sha256(data[path]).hexdigest()
    if actual != expected:
        mismatch.append((path, expected, actual))
assert not missing, 'Missing protected files: ' + ', '.join(missing)
assert not mismatch, 'Protected hash mismatch: ' + repr(mismatch)

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name, value in sorted(data.items()):
        zi = zipfile.ZipInfo(name, (2026, 9, 16, 1, 45, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = 0o100644 << 16
        z.writestr(zi, value, compresslevel=9)

print(f'output={out}')
print(f'integrity_loader={loader_name}')
print(f'protected_entries={len(files)}')
print(f'background_sha256={digests["assets/tf-device-background.js"]}')
print(f'device_lock_sha256={digests["assets/tf-device-lock.js"]}')
print(f'manifest_sha256={digests["manifest.json"]}')
print(f'zip_sha256={hashlib.sha256(out.read_bytes()).hexdigest()}')
