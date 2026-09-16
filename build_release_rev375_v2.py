import hashlib, json, re, sys, zipfile
from pathlib import Path

BASE_VERSION='1.16.87'; BASE_REVISION='REV374'
NEW_VERSION='1.16.88'; NEW_REVISION='REV375'
OUTPUT='TF_Extension_PC_MAC_REV375_ACTIVATION_TIMEOUT_RECOVERY.zip'
base=Path(sys.argv[1]); root=Path(__file__).resolve().parent; out=root/'deliverables'/OUTPUT; out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(base) as z:data={n:z.read(n) for n in z.namelist() if not n.endswith('/')}
manifest=json.loads(data['manifest.json']); assert manifest.get('version')==BASE_VERSION; assert manifest.get('version_name')==BASE_REVISION
lock=data['assets/tf-device-lock.js'].decode()

def replace_once(old,new,label):
    global lock
    assert old in lock, 'missing '+label
    lock=lock.replace(old,new,1)

def replace_span(start_marker,end_marker,new_text,label):
    global lock
    a=lock.find(start_marker); assert a>=0,'missing start '+label
    b=lock.find(end_marker,a); assert b>=0,'missing end '+label
    lock=lock[:a]+new_text+lock[b:]

replace_once(
"  const SAME_BUILD_RECOVERY_DELAYS_MS = [1200, 3000, 6500];\n",
"  const SAME_BUILD_RECOVERY_DELAYS_MS = [1200, 3000, 6500];\n  const ACTIVATION_RETRY_DELAYS_MS = [1200, 3000, 6500, 12000]; // REV375\n",
'retry const')

insert_before="\n  async function saveSession(credentials, bindResult) {"
addition=r'''

  function scheduleActivationRetry(credentials, reloadAfterSuccess, options, reason) {
    const currentAttempt = Math.max(0, Number(options && options.activationRetryAttempt || 0));
    if (currentAttempt >= ACTIVATION_RETRY_DELAYS_MS.length) return false;
    const delayMs = ACTIVATION_RETRY_DELAYS_MS[currentAttempt];
    const nextAttempt = currentAttempt + 1;
    setStatus('loading','Server aktivasi sedang sibuk',`Koneksi Apps Script belum siap. Extension mencoba ulang otomatis ${nextAttempt}/${ACTIVATION_RETRY_DELAYS_MS.length}; Email dan Token tetap tersimpan.`);
    setContent(`<div class="tf-device-lock-note">${escapeHtml(reason || 'Server aktivasi belum merespons.')} Jangan klik Reset dan tidak perlu memasukkan ulang Email / Token.</div>`);
    setTimeout(() => {
      const nextOptions = { ...(options || {}), activationRetryAttempt: nextAttempt };
      if (busy) {
        setTimeout(() => { if (!busy) void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, nextOptions)); }, 900);
        return;
      }
      void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, nextOptions));
    }, delayMs);
    return true;
  }
'''
assert insert_before in lock
lock=lock.replace(insert_before,addition+insert_before,1)

replace_span(
"    try {\n      const sourceLookup = await lookupLicenseSource(credentials);",
"      setStatus('loading', 'Menyiapkan Device Vault'",
"    try {\n      // REV375: device-challenge already performs the license lookup. Avoid the duplicate /license-check call.\n      let sourceLookup = null;\n\n",
'eager license lookup')
replace_once("        licenseId: String(credentials.licenseId || sourceLookup && (sourceLookup.licenseId || sourceLookup.license) || '').trim()\n","        licenseId: String(credentials.licenseId || '').trim()\n",'challenge license id')

challenge_start="      if (!challengeResult || challengeResult.ok !== true || challengeResult.valid !== true) {"
challenge_end="      setStatus('loading', 'Memverifikasi kunci perangkat'"
new_challenge=r'''      if (!challengeResult || challengeResult.ok !== true || challengeResult.valid !== true) {
        const code = String(challengeResult && (challengeResult.code || challengeResult.error) || 'DEVICE_CHALLENGE_FAILED');
        const message = String(challengeResult && (challengeResult.message || challengeResult.code || challengeResult.error) || 'Lisensi tidak valid.');
        const transient = isTransientRecoveryResult(challengeResult);
        if (transient) {
          const scheduled = sameBuildRecovery
            ? scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, message)
            : scheduleActivationRetry(credentials, reloadAfterSuccess, options, message);
          if (scheduled) return;
        }
        if (String(code).toUpperCase() === 'LICENSE_NOT_FOUND') {
          sourceLookup = await lookupLicenseSource(credentials);
          if (sourceLookup && sourceLookup.valid === true) {
            const outOfSync = 'Lisensi ditemukan pada pengecekan ulang, tetapi Device API belum membaca state yang sama.';
            showError({ code: 'DEVICE_API_OUT_OF_SYNC', message: outOfSync }, outOfSync);
            return;
          }
        }
        const suffix = /TOKEN|CREDENTIAL|PERIKSA.*TOKEN/i.test(code + ' ' + message)
          ? '\nExtension sudah mencoba variasi aman email dan token tanpa menyimpan format yang gagal.' : '';
        if (sameBuildRecovery) showError({ code, message: message + suffix }, message + suffix);
        else if (transient) showError({ code, message: message + '\nServer tetap belum merespons setelah retry otomatis. Klik Periksa Lagi; Email dan Token tidak perlu diisi ulang.' }, message);
        else showActivationForm(`[${code}] ${message}${suffix}`);
        return;
      }

'''
replace_span(challenge_start,challenge_end,new_challenge,'challenge result')

replace_once(
"""      if (sameBuildRecovery && isTransientRecoveryResult(bindResult) &&
          scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, bindMessage)) {
        return;
      }
""",
"""      if (isTransientRecoveryResult(bindResult)) {
        const scheduled = sameBuildRecovery
          ? scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, bindMessage)
          : scheduleActivationRetry(credentials, reloadAfterSuccess, options, bindMessage);
        if (scheduled) return;
      }
""",'bind transient')

replace_once(
"""      } else {
        showActivationForm(friendly);
      }
    } finally {
""",
"""      } else {
        if (scheduleActivationRetry(credentials, reloadAfterSuccess, options, friendly)) return;
        showError({ code: 'DEVICE_ACTIVATION_TEMPORARY_FAILURE', message: friendly + ' Klik Periksa Lagi; Email dan Token tetap tersimpan.' }, friendly);
      }
    } finally {
""",'manual catch')

replace_once(
"""      if (!challengeResult || challengeResult.ok !== true || challengeResult.sessionValid !== true) {
        const code = String(challengeResult && challengeResult.code || '');
        if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_NOT_FOUND', 'DEVICE_NOT_BOUND'].includes(code)) {
""",
"""      if (!challengeResult || challengeResult.ok !== true || challengeResult.sessionValid !== true) {
        const code = String(challengeResult && challengeResult.code || '');
        if (isTransientRecoveryResult(challengeResult)) throw new Error(`[${code || 'DEVICE_LOCK_SERVER_UNAVAILABLE'}] ${String(challengeResult && challengeResult.message || 'Server Device Lock belum merespons.')}`);
        if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_NOT_FOUND', 'DEVICE_NOT_BOUND'].includes(code)) {
""",'session challenge transient')

replace_once(
"""      const invalidCode = String(validateResult && validateResult.code || '');
      if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_CHANGED', 'DEVICE_SESSION_NOT_AVAILABLE'].includes(invalidCode)) {
""",
"""      const invalidCode = String(validateResult && validateResult.code || '');
      if (isTransientRecoveryResult(validateResult)) throw new Error(`[${invalidCode || 'DEVICE_LOCK_SERVER_UNAVAILABLE'}] ${String(validateResult && validateResult.message || 'Server Device Lock belum merespons.')}`);
      if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_CHANGED', 'DEVICE_SESSION_NOT_AVAILABLE'].includes(invalidCode)) {
""",'session validate transient')

replace_once(
"""    if (/terlalu lama dimuat/i.test(raw)) {
      return 'Halaman TF Device Vault terlalu lama dimuat. Periksa koneksi internet lalu coba lagi.';
    }

    return raw;
""",
"""    if (/terlalu lama dimuat/i.test(raw)) {
      return 'Halaman TF Device Vault terlalu lama dimuat. Periksa koneksi internet lalu coba lagi.';
    }
    if (/APPS_SCRIPT_TIMEOUT|Apps Script timeout/i.test(raw)) {
      return 'Server lisensi Google Apps Script sedang lambat. Extension akan mencoba ulang otomatis tanpa meminta Email / Token lagi.';
    }

    return raw;
""",'friendly timeout')

data['assets/tf-device-lock.js']=lock.encode()
manifest['version']=NEW_VERSION; manifest['version_name']=NEW_REVISION; manifest['description']='REV375: activation timeout auto-retry and single-lookup Device Lock flow.'
data['manifest.json']=(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n').encode()
data['README_REV375.md']='# REV375 — Activation Timeout Auto-Recovery\n\nAPP_SCRIPT_TIMEOUT sekarang retry otomatis dan aktivasi normal tidak lagi melakukan lookup ganda.\n'

loaders=[]
for name,raw in data.items():
    if name.startswith('assets/') and name.endswith('.js'):
        text=raw.decode(errors='ignore')
        if 'const FILES =' in text and 'window.tfIntegrityReady' in text:loaders.append(name)
assert len(loaders)==1,loaders
loader_name=loaders[0]; loader=data[loader_name].decode(); m=re.search(r'const FILES = (\{.*?\});',loader,re.S); assert m
files=json.loads(m.group(1))
for path,digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;',loader):files[path]=digest
updates=[]
for path,expected in files.items():
    assert path in data,path
    actual=hashlib.sha256(data[path]).hexdigest()
    if actual!=expected:updates.append((path,actual))
block='\n// REV375 final integrity overrides.\n'+''.join(f'FILES[{json.dumps(p)}] = {json.dumps(h)};\n' for p,h in updates)+'\n'
loader=loader.replace('window.tfIntegrityReady = (async () => {',block+'window.tfIntegrityReady = (async () => {',1); data[loader_name]=loader.encode()
verify=json.loads(m.group(1))
for path,digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;',loader):verify[path]=digest
for path,expected in verify.items():assert hashlib.sha256(data[path]).hexdigest()==expected,(path,expected,hashlib.sha256(data[path]).hexdigest())
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,value in sorted(data.items()):
        zi=zipfile.ZipInfo(name,(2026,9,16,2,0,0));zi.compress_type=zipfile.ZIP_DEFLATED;zi.external_attr=0o100644<<16;z.writestr(zi,value,compresslevel=9)
print(out);print('updated_hashes='+str(len(updates)));print('zip_sha256='+hashlib.sha256(out.read_bytes()).hexdigest())
