import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

BASE_VERSION='1.16.87'
BASE_REVISION='REV374'
NEW_VERSION='1.16.88'
NEW_REVISION='REV375'
OUTPUT='TF_Extension_PC_MAC_REV375_ACTIVATION_TIMEOUT_RECOVERY.zip'

base=Path(sys.argv[1])
root=Path(__file__).resolve().parent
out=root/'deliverables'/OUTPUT
out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(base) as z:
    data={n:z.read(n) for n in z.namelist() if not n.endswith('/')}
manifest=json.loads(data['manifest.json'])
assert manifest.get('version')==BASE_VERSION,manifest.get('version')
assert manifest.get('version_name')==BASE_REVISION,manifest.get('version_name')

lock=data['assets/tf-device-lock.js'].decode()

def once(old,new,label):
    global lock
    if old not in lock:
        raise AssertionError('anchor missing: '+label)
    lock=lock.replace(old,new,1)

once("  const SAME_BUILD_RECOVERY_DELAYS_MS = [1200, 3000, 6500];\n",
     "  const SAME_BUILD_RECOVERY_DELAYS_MS = [1200, 3000, 6500];\n"
     "  // REV375 — manual activation and same-build validation must survive transient\n"
     "  // Apps Script/Worker cold-start timeouts without forcing the user to click again.\n"
     "  const ACTIVATION_RETRY_DELAYS_MS = [1200, 3000, 6500, 12000];\n",
     'retry constants')

anchor="""  function scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, reason) {
    const currentAttempt = Math.max(0, Number(options && options.recoveryAttempt || 0));
    if (currentAttempt >= SAME_BUILD_RECOVERY_DELAYS_MS.length) return false;
    const delayMs = SAME_BUILD_RECOVERY_DELAYS_MS[currentAttempt];
    const nextAttempt = currentAttempt + 1;
    setStatus(
      'loading',
      'Memulihkan aktivasi PC setelah restart',
      `Device Vault / server belum siap. Mencoba ulang otomatis ${nextAttempt}/${SAME_BUILD_RECOVERY_DELAYS_MS.length} tanpa meminta Email + Token.`
    );
    setContent(`<div class=\"tf-device-lock-note\">${escapeHtml(reason || 'Menunggu komponen startup Chrome siap.')} Tidak perlu Reset PC dan tidak perlu memasukkan kode aktivasi lagi.</div>`);
    setTimeout(() => {
      if (busy) {
        setTimeout(() => {
          if (!busy) void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, { sameBuildRecovery: true, recoveryAttempt: nextAttempt }));
        }, 700);
        return;
      }
      void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, { sameBuildRecovery: true, recoveryAttempt: nextAttempt }));
    }, delayMs);
    return true;
  }
"""
addition="""

  function scheduleActivationRetry(credentials, reloadAfterSuccess, options, reason) {
    const currentAttempt = Math.max(0, Number(options && options.activationRetryAttempt || 0));
    if (currentAttempt >= ACTIVATION_RETRY_DELAYS_MS.length) return false;
    const delayMs = ACTIVATION_RETRY_DELAYS_MS[currentAttempt];
    const nextAttempt = currentAttempt + 1;
    setStatus(
      'loading',
      'Server aktivasi sedang sibuk',
      `Koneksi Apps Script belum siap. Extension mencoba ulang otomatis ${nextAttempt}/${ACTIVATION_RETRY_DELAYS_MS.length}; Email dan Token tetap tersimpan.`
    );
    setContent(`<div class=\"tf-device-lock-note\">${escapeHtml(reason || 'Server aktivasi belum merespons.')} Jangan klik Reset dan tidak perlu memasukkan ulang Email / Token.</div>`);
    setTimeout(() => {
      const nextOptions = { ...(options || {}), activationRetryAttempt: nextAttempt };
      if (busy) {
        setTimeout(() => {
          if (!busy) void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, nextOptions));
        }, 900);
        return;
      }
      void runDeviceFlow(() => activateOrRenew(credentials, reloadAfterSuccess, nextOptions));
    }, delayMs);
    return true;
  }
"""
once(anchor,anchor+addition,'activation retry scheduler')

start="    try {\n      const sourceLookup = await lookupLicenseSource(credentials);"
idx=lock.find(start)
if idx<0: raise AssertionError('eager source lookup start missing')
end=lock.find("      setStatus('loading', 'Menyiapkan Device Vault'",idx)
if end<0: raise AssertionError('eager source lookup end missing')
lock=lock[:idx]+"""    try {
      // REV375 — device-challenge already validates the license. Avoid the old
      // duplicate /license-check call which woke Apps Script twice per click.
      let sourceLookup = null;

"""+lock[end:]
once("        licenseId: String(credentials.licenseId || sourceLookup && (sourceLookup.licenseId || sourceLookup.license) || '').trim()\n",
     "        licenseId: String(credentials.licenseId || '').trim()\n",'challenge license id')

old="""      if (!challengeResult || challengeResult.ok !== true || challengeResult.valid !== true) {
        const code = String(challengeResult && (challengeResult.code || challengeResult.error) || 'DEVICE_CHALLENGE_FAILED');
        const message = String(challengeResult && (challengeResult.message || challengeResult.code || challengeResult.error) || 'Lisensi tidak valid.');
        if (String(code).toUpperCase() === 'LICENSE_NOT_FOUND' && sourceLookup && sourceLookup.valid === true) {
          const outOfSync = 'Lisensi ditemukan di Google Sheet, tetapi Cloudflare Device API belum membaca data yang sama.';
          if (sameBuildRecovery) {
            showError({ code: 'DEVICE_API_OUT_OF_SYNC', message: outOfSync }, outOfSync);
          } else {
            showActivationForm('[DEVICE_API_OUT_OF_SYNC] ' + outOfSync + ' Deploy ulang Cloudflare Worker dan pastikan APPS_SCRIPT_URL serta SERVER_SHARED_SECRET sama dengan Apps Script aktif.');
          }
          return;
        }
        const suffix = /TOKEN|CREDENTIAL|PERIKSA.*TOKEN/i.test(code + ' ' + message)
          ? '\\nExtension sudah mencoba variasi aman email dan token tanpa menyimpan format yang gagal.'
          : '';
        if (sameBuildRecovery && isTransientRecoveryResult(challengeResult) &&
            scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, message)) {
          return;
        }
        if (sameBuildRecovery) {
          showError({ code, message: message + suffix }, message + suffix);
        } else {
          showActivationForm(`[${code}] ${message}${suffix}`);
        }
        return;
      }
"""
new="""      if (!challengeResult || challengeResult.ok !== true || challengeResult.valid !== true) {
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
          ? '\\nExtension sudah mencoba variasi aman email dan token tanpa menyimpan format yang gagal.'
          : '';
        if (sameBuildRecovery) {
          showError({ code, message: message + suffix }, message + suffix);
        } else if (transient) {
          showError({ code, message: message + '\\nServer tetap belum merespons setelah retry otomatis. Klik Periksa Lagi; Email dan Token tidak perlu diisi ulang.' }, message);
        } else {
          showActivationForm(`[${code}] ${message}${suffix}`);
        }
        return;
      }
"""
once(old,new,'challenge transient handling')

once("""      if (sameBuildRecovery && isTransientRecoveryResult(bindResult) &&
          scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, bindMessage)) {
        return;
      }
      if (sameBuildRecovery) {
""","""      if (isTransientRecoveryResult(bindResult)) {
        const scheduled = sameBuildRecovery
          ? scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, bindMessage)
          : scheduleActivationRetry(credentials, reloadAfterSuccess, options, bindMessage);
        if (scheduled) return;
      }
      if (sameBuildRecovery) {
""",'bind transient handling')

once("""      const friendly = friendlyErrorMessage(error);
      if (sameBuildRecovery) {
        if (scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, friendly)) {
          return;
        }
        if (await unlockFromRecentDeviceValidation(friendly)) {
          return;
        }
        showError({ code: 'DEVICE_RESTART_RECOVERY_FAILED', message: friendly }, friendly);
      } else {
        showActivationForm(friendly);
      }
""","""      const friendly = friendlyErrorMessage(error);
      if (sameBuildRecovery) {
        if (scheduleSameBuildRecovery(credentials, reloadAfterSuccess, options, friendly)) {
          return;
        }
        if (await unlockFromRecentDeviceValidation(friendly)) {
          return;
        }
        showError({ code: 'DEVICE_RESTART_RECOVERY_FAILED', message: friendly }, friendly);
      } else {
        if (scheduleActivationRetry(credentials, reloadAfterSuccess, options, friendly)) {
          return;
        }
        showError({ code: 'DEVICE_ACTIVATION_TEMPORARY_FAILURE', message: friendly + ' Klik Periksa Lagi; Email dan Token tetap tersimpan.' }, friendly);
      }
""",'manual catch retry')

once("""      if (!challengeResult || challengeResult.ok !== true || challengeResult.sessionValid !== true) {
        const code = String(challengeResult && challengeResult.code || '');
        if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_NOT_FOUND', 'DEVICE_NOT_BOUND'].includes(code)) {
          busy = false;
          await activateOrRenew(credentials, true, { sameBuildRecovery: true, recoveryAttempt: 0 });
          return;
        }
        showError(challengeResult, 'Session perangkat tidak valid.');
        return;
      }
""","""      if (!challengeResult || challengeResult.ok !== true || challengeResult.sessionValid !== true) {
        const code = String(challengeResult && challengeResult.code || '');
        if (isTransientRecoveryResult(challengeResult)) {
          throw new Error(`[${code || 'DEVICE_LOCK_SERVER_UNAVAILABLE'}] ${String(challengeResult && challengeResult.message || 'Server Device Lock belum merespons.')}`);
        }
        if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_NOT_FOUND', 'DEVICE_NOT_BOUND'].includes(code)) {
          busy = false;
          await activateOrRenew(credentials, true, { sameBuildRecovery: true, recoveryAttempt: 0 });
          return;
        }
        showError(challengeResult, 'Session perangkat tidak valid.');
        return;
      }
""",'session challenge transient')

once("""      const invalidCode = String(validateResult && validateResult.code || '');
      if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_CHANGED', 'DEVICE_SESSION_NOT_AVAILABLE'].includes(invalidCode)) {
""","""      const invalidCode = String(validateResult && validateResult.code || '');
      if (isTransientRecoveryResult(validateResult)) {
        throw new Error(`[${invalidCode || 'DEVICE_LOCK_SERVER_UNAVAILABLE'}] ${String(validateResult && validateResult.message || 'Server Device Lock belum merespons.')}`);
      }
      if (['DEVICE_SESSION_INVALID', 'DEVICE_SESSION_CHANGED', 'DEVICE_SESSION_NOT_AVAILABLE'].includes(invalidCode)) {
""",'session validate transient')

once("""    if (/terlalu lama dimuat/i.test(raw)) {
      return 'Halaman TF Device Vault terlalu lama dimuat. Periksa koneksi internet lalu coba lagi.';
    }

    return raw;
""","""    if (/terlalu lama dimuat/i.test(raw)) {
      return 'Halaman TF Device Vault terlalu lama dimuat. Periksa koneksi internet lalu coba lagi.';
    }

    if (/APPS_SCRIPT_TIMEOUT|Apps Script timeout/i.test(raw)) {
      return 'Server lisensi Google Apps Script sedang lambat. Extension akan mencoba ulang otomatis tanpa meminta Email / Token lagi.';
    }

    return raw;
""",'friendly Apps Script timeout')

data['assets/tf-device-lock.js']=lock.encode()
manifest['version']=NEW_VERSION
manifest['version_name']=NEW_REVISION
manifest['description']='REV375: activation timeout auto-retry and single-lookup Device Lock flow.'
data['manifest.json']=(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n').encode()
data['README_REV375.md']='''# REV375 — Activation Timeout Auto-Recovery\n\n- Menghapus lookup lisensi ganda sebelum `/device-challenge`.\n- APP_SCRIPT_TIMEOUT pada aktivasi manual sekarang retry otomatis tanpa input ulang.\n- Timeout saat session check masuk ke offline grace yang sudah tervalidasi.\n- Timeout saat bind juga retry otomatis dengan credential yang sama.\n- Hash protected files diregenerasi setelah perubahan runtime.\n'''

loaders=[]
for name,raw in data.items():
    if name.startswith('assets/') and name.endswith('.js'):
        text=raw.decode(errors='ignore')
        if 'const FILES =' in text and 'window.tfIntegrityReady' in text:
            loaders.append(name)
assert len(loaders)==1,loaders
loader_name=loaders[0]
loader=data[loader_name].decode()
match=re.search(r'const FILES = (\{.*?\});',loader,re.S)
assert match
files=json.loads(match.group(1))
for path,digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;',loader):
    files[path]=digest
mismatch=[]
for path,expected in files.items():
    assert path in data,'Missing protected file: '+path
    actual=hashlib.sha256(data[path]).hexdigest()
    if actual!=expected:
        mismatch.append((path,actual))
block='\n// REV375 final integrity overrides - activation timeout recovery runtime.\n'
for path,digest in mismatch:
    block+=f'FILES[{json.dumps(path)}] = {json.dumps(digest)};\n'
block+='\n'
loader=loader.replace('window.tfIntegrityReady = (async () => {',block+'window.tfIntegrityReady = (async () => {',1)
data[loader_name]=loader.encode()
files2=json.loads(match.group(1))
for path,digest in re.findall(r'FILES\[["\']([^"\']+)["\']\]\s*=\s*["\']([0-9a-f]{64})["\']\s*;',loader):
    files2[path]=digest
for path,expected in files2.items():
    actual=hashlib.sha256(data[path]).hexdigest()
    assert actual==expected,(path,expected,actual)

with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,value in sorted(data.items()):
        zi=zipfile.ZipInfo(name,(2026,9,16,2,0,0));zi.compress_type=zipfile.ZIP_DEFLATED;zi.external_attr=0o100644<<16
        z.writestr(zi,value,compresslevel=9)
print(out)
print('integrity_loader='+loader_name)
print('updated_hashes='+str(len(mismatch)))
print('zip_sha256='+hashlib.sha256(out.read_bytes()).hexdigest())
