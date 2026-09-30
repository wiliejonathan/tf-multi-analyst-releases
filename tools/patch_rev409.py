from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1])
f=root/'assets/tf-device-lock.js';s=f.read_text()
# A build version is not a device identity. Always verify the retained session.
a=s.index('    if (!buildAlreadyActivated && !pendingForThisBuild) {',s.index('  async function start()'))
b=s.index('    currentCredentials = { ...credentials, email, token };',a)
s=s[:a]+s[b:]
s=s.replace('    const recovery = await getVaultRecovery();', '    const recovery = await getVaultRecovery();')
s=s.replace('  async function api(path, body) {','  async function apiOnce(path, body) {',1)
idx=s.index('  async function apiWithCredentialVariants(')
s=s[:idx]+'''  async function api(path, body) {
    const first = await apiOnce(path, body);
    // Only repeat read/challenge operations. Never repeat a bind mutation here.
    if (['/license-check','/device-challenge','/session-challenge'].includes(path) &&
        String(first && first.code || '') === 'APPS_SCRIPT_HTTP_ERROR' &&
        /HTTP\\s+404\\b/i.test(String(first.message || ''))) {
      await sleep(700);
      return apiOnce(path, body);
    }
    return first;
  }

'''+s[idx:]
s=s.replace("    if (/APPS_SCRIPT_TIMEOUT|Apps Script timeout/i.test(raw)) {", "    if (/Apps Script HTTP\\s+404/i.test(raw)) return 'Google Apps Script mengembalikan HTTP 404. Email, token, session, dan identitas perangkat tetap disimpan. Jika terus berulang, deployment Apps Script pada server perlu diperiksa.';\n    if (/APPS_SCRIPT_TIMEOUT|Apps Script timeout/i.test(raw)) {")
s=s.replace('  let currentCredentials = null;', "  let currentCredentials = null;\n  let verifiedVaultIdentity = null;")
s=s.replace('      const deviceInfo = proof.deviceInfo || {};', '''      const deviceInfo = proof.deviceInfo || {};
      const pinned = (await storageGet(['tfDeviceVaultIdentityV1'])).tfDeviceVaultIdentityV1;
      if (pinned && pinned.publicKeySpki && pinned.publicKeySpki !== deviceInfo.publicKeySpki) {
        const error = new Error('Kunci Device Vault berbeda dari perangkat yang terakhir berhasil diaktivasi. Tidak membuat permintaan perangkat baru; pulihkan data browser lama sebelum melanjutkan.');
        error.code = 'DEVICE_VAULT_IDENTITY_CHANGED';
        throw error;
      }
      verifiedVaultIdentity = deviceInfo;''')
s=s.replace('      [SESSION_KEY]: String(bindResult.sessionToken', "      ...(verifiedVaultIdentity && verifiedVaultIdentity.publicKeySpki ? {tfDeviceVaultIdentityV1: verifiedVaultIdentity} : {}),\n      [SESSION_KEY]: String(bindResult.sessionToken")
# Record identity only after successful server verification.
a=s.index('  async function saveValidatedSessionState(');b=s.index('\n  async function',a+10)
part=s[a:b];part=part.replace('    await storageSet({', "    await storageSet({\n      ...(verifiedVaultIdentity && verifiedVaultIdentity.publicKeySpki ? {tfDeviceVaultIdentityV1: verifiedVaultIdentity} : {}),",1);s=s[:a]+part+s[b:]
a=s.index('  async function activateOrRenew(');b=s.index('  async function start()',a);part=s[a:b];part=part.replace('    } catch (error) {', "    } catch (error) {\n      if (error && error.code === 'DEVICE_VAULT_IDENTITY_CHANGED') { showError({code:error.code,message:error.message}); return; }",2);s=s[:a]+part+s[b:]
f.write_text(s)
f=root/'assets/tf-device-background.js';s=f.read_text();s=s.replace('          return response.data || {};', '''          const proof = response.data || {};
          const info = proof.deviceInfo || {}, signed = proof.signatureInfo || {};
          if (!info.fullDeviceId || info.fullDeviceId !== signed.fullDeviceId) {
            throw new Error('Identitas Device Vault berubah saat membaca kunci. Aktivasi dibatalkan tanpa mengikat perangkat baru.');
          }
          return proof;''',1);f.write_text(s)
f=root/'manifest.json';m=json.loads(f.read_text());m.update(version='1.17.22',version_name='REV409');f.write_text(json.dumps(m,indent=2)+'\n')
f=root/'assets/7b6af0cb4001a684.js';s=f.read_text();m=re.search(r'const FILES\s*=\s*(\{.*?\});',s,re.S);d=json.loads(m.group(1));d={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in d};f.write_text(s[:m.start(1)]+json.dumps(d,separators=(',',':'))+s[m.end(1):])
