from pathlib import Path
import shutil,sys,json,hashlib
out=Path(sys.argv[1]);stage=Path('release-staging/REV465')
for p in (stage/'overrides').rglob('*'):
 if p.is_file():
  dst=out/p.relative_to(stage/'overrides');dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dst)
r=out
p=r/'assets/927ecbd63036f61b.js';s=p.read_text('utf8').replace('REV464','REV465').replace('v1.17.77','v1.17.78')
s=s.replace('function tf_startBatchScanFromStoredConfig(originLabel) {','''let __tfUpdatePickerBusy=false;
async function tf_chooseUpdateAnalysts(){
const d=await chrome.storage.local.get([TF_ANALYST_SOURCES_KEY,TF_REMEMBERED_LINKS_KEY]);
const sources=d[TF_ANALYST_SOURCES_KEY]||{},remembered=d[TF_REMEMBERED_LINKS_KEY],maps=tf_buildNameMapsFromSources(sources);
const list=Array.isArray(remembered)&&remembered.length?remembered:Object.entries(sources).map(([name,c])=>({...c,name,url:c.url||c.link}));
const channels=list.map((c,i)=>{const url=tf_normalizeTfAccountUrl(c.url||c.link||'');return {url,name:tf_resolveAnalystNameForUrl(url,maps)||c.name||c.analystName||'Analis '+(i+1)};}).filter(c=>c.url);
if(!channels.length){alert('Tidak ada analis untuk Update. Silakan Import data terlebih dahulu.');return null;}
return TFUpdatePicker.select(channels);
}
function tf_startBatchScanFromStoredConfig(originLabel,selectedUpdateUrls) {''')
marker="if (!channels.length) {\nalert('Tidak ada link channel di file / storage. Silakan Import file yang benar.');"
s=s.replace(marker,"""if(String(originLabel||'').toLowerCase().includes('update')&&Array.isArray(selectedUpdateUrls)){
const selected=new Set(selectedUpdateUrls.map(tf_normalizeTfAccountUrl));channels=channels.filter(c=>selected.has(c.url));
}
"""+marker)
marker="if (btn.disabled || __tfUpdateLoginPreflightBusy)\nreturn;\nsetStatus('Update: memeriksa session login TradersFamily terbaru...');"
s=s.replace(marker,"""if (btn.disabled || __tfUpdateLoginPreflightBusy || __tfUpdatePickerBusy)
return;
let selectedUpdateUrls;
__tfUpdatePickerBusy=true;
try{selectedUpdateUrls=await tf_chooseUpdateAnalysts();}catch(error){setStatus('Pilihan Update gagal: '+(error.message||error));return;}finally{__tfUpdatePickerBusy=false;}
if(!selectedUpdateUrls?.length)return;
if(btn.disabled||__tfUpdateActivityLocked){setStatus('Update dibatalkan: proses lain sedang berjalan.');return;}
setStatus('Update: memeriksa session login TradersFamily terbaru...');""")
s=s.replace("tf_startBatchScanFromStoredConfig('updateButton');","tf_startBatchScanFromStoredConfig('updateButton',selectedUpdateUrls);")
assert 'selectedUpdateUrls' in s and 'await tf_chooseUpdateAnalysts()' in s
p.write_text(s,encoding='utf8',newline='\n')

actual={str(p.relative_to(out)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in out.rglob('*') if p.is_file()}
assert actual==json.loads((stage/'FILE_HASHES.json').read_text()),'Package differs from locally tested build'
print('PASS exact tested REV465 package')
