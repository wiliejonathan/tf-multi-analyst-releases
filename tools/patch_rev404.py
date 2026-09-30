from pathlib import Path
import json,re,hashlib,sys
root=Path(sys.argv[1])
f=root/'assets/tf-device-lock.js';s=f.read_text()
s=s.replace('const REQUEST_TIMEOUT_MS = 85000;', 'const REQUEST_TIMEOUT_MS = 40000;')
s=s.replace('const ACTIVATION_RETRY_DELAYS_MS = [1200, 3000, 6500, 12000];', 'const ACTIVATION_RETRY_DELAYS_MS = [2000];')
s=s.replace('}, REQUEST_TIMEOUT_MS);', "}, ['/bind-device', '/session-validate'].includes(path) ? 75000 : REQUEST_TIMEOUT_MS);")
a=s.index('        if (reloadAfterSuccess) {',s.index("if (bindResult && bindResult.bound === true"));b=s.index('\n        return;',a)
s=s[:a]+'''        // REV404: a confirmed bind already verifies the signature and session.
        // Persist the server's license projection and open without two more lookups.
        if (bindResult.ok === true && bindResult.valid === true) {
          await saveValidatedSessionState(credentials, bindResult);
          await unlockApp();
        } else {
          busy = false;
          await validateExistingSession(credentials, String(bindResult.sessionToken));
        }'''+s[b:]
s=s.replace("else {\n        showActivationForm(bindMessage);", "else if (isTransientRecoveryResult(bindResult)) {\n        showError({code: 'DEVICE_ACTIVATION_TEMPORARY_FAILURE', message: bindMessage + ' Klik Periksa Lagi; Email dan Token tetap tersimpan.'});\n      } else {\n        showActivationForm(bindMessage);")
f.write_text(s)
mf=root/'manifest.json';m=json.loads(mf.read_text());m.update(version='1.17.17',version_name='REV404',description='REV404: faster activation, bounded recovery, confirmed bind opens immediately. REV403 table and import fixes retained.');mf.write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n')
(root/'README_REV404.md').write_text('# REV404 — Activation Recovery\n\nConfirmed device bind opens without a duplicate session handshake. Read requests wait up to 40 seconds; mutation requests retain 75 seconds. One automatic activation retry replaces four. Credentials remain stored on temporary failure.\n')
loader=root/'assets/7b6af0cb4001a684.js';ls=loader.read_text();mm=re.search(r'const FILES\s*=\s*(\{.*?\});',ls,re.S);assert mm
files=json.loads(mm.group(1));files.pop('assets/7b6af0cb4001a684.js',None);files['README_REV404.md']=''
new={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in sorted(files)}
loader.write_text(ls[:mm.start(1)]+json.dumps(new,separators=(',',':'),ensure_ascii=False)+ls[mm.end(1):])
print('REV404 PC patched',len(new),'protected files')
