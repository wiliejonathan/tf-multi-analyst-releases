from pathlib import Path
import sys,json,re,hashlib
root=Path(sys.argv[1])
p=root/'assets/tf-multi-total-progress.js';s=p.read_text('utf8');old='box.hidden=!state||!total;';assert s.count(old)==1;s=s.replace(old,"box.hidden=!state||!total||state.status!=='running'||completed>=total;");p.write_text(s,encoding='utf8',newline='\n')
# Mutually exclusive month filters, including restored/imported configurations.
p=root/'assets/tf-multi-native-sidebar.js';s=p.read_text('utf8')
needle="function paintMonths(){";assert s.count(needle)==1
fragment=Path(__file__).with_name('month-exclusion535.js').read_text('utf8')
s=s.replace(needle,fragment+"\nfunction paintMonths(){syncMonthExclusion535();")
s=s.replace('function paintNotMonths(){','function paintNotMonths(){syncMonthExclusion535();')
needle='f={...D,...f};for(const [k,v]of Object.entries(f))';assert s.count(needle)==1
s=s.replace(needle,"f={...D,...f};const oldNot=f.notSurvivedMonths||[];f.notSurvivedMonths=oldNot.filter(m=>!(f.survivedMonths||[]).includes(m));if(oldNot.length!==f.notSurvivedMonths.length&&hasChrome)chrome.storage.local.set({tfMultiFiltersV419:f}).catch(showError);for(const [k,v]of Object.entries(f))")
s=s.replace('syncControls();}', 'syncControls();syncMonthExclusion535();}')
p.write_text(s,encoding='utf8',newline='\n')
p=root/'multi-scanner/core.js';s=p.read_text('utf8');needle="if(f.requireFixed===undefined)";assert s.count(needle)==1
s=s.replace(needle,"if(f.survivedMonths.some(m=>f.notSurvivedMonths.includes(m)))throw Error('Bulan yang sama tidak boleh dipilih pada Survived Month dan Not Survived Month.');"+needle);p.write_text(s,encoding='utf8',newline='\n')
# List all subscribed iSignal analysts, read both actual symbol-label variants.
p=root/'assets/dec74fd654ec6d54.js';s=p.read_text('utf8');needle='if (!isActive)\ncontinue;';assert s.count(needle)==1;s=s.replace(needle,'// REV535: include both active and inactive subscriptions.')
needle='items.push({ name: analystName, url: fullUrl, settingsUrl });';assert s.count(needle)==1;s=s.replace(needle,'items.push({ name: analystName, url: fullUrl, settingsUrl, isignalActive: isActive });')
needle='Symbol\\s+terintegrasi';assert needle in s;s=s.replace(needle,'Symbol\\s+(?:terintegrasi|diintegrasi)')
p.write_text(s,encoding='utf8',newline='\n')
p=root/'assets/tf-multi-isignal-discovery.js';s=p.read_text('utf8')
s=s.replace("let job={runId,status:'running'", "let job={runId,startedAt:Date.now(),status:'running'")
s=s.replace('total:job.total,completed:job.completed,status:job.status,origin:ORIGIN','runId,startedAt:job.startedAt,updatedAt:Date.now(),total:job.total,completed:job.completed,status:job.status,origin:ORIGIN')
old="cancelled();safe(item.url);if(!item.settingsUrl)throw new Error('Atur iSignal tidak ditemukan untuk '+(item.name||item.url));"
assert old in s;s=s.replace(old,"cancelled();safe(item.url);if(!item.settingsUrl){job.items.push({...item,pairs:[],pairResolution:'missing_settings'});job.completed++;await progress();continue;}")
old="job.items.push({...item,pairs:detail.pairs?.length?detail.pairs:['__ALL__']});";assert old in s;s=s.replace(old,"job.items.push({...item,pairs:Array.isArray(detail.pairs)?detail.pairs:[],pairResolution:detail.pairs?.length?'found':'not_connected'});")
p.write_text(s,encoding='utf8',newline='\n')
p=root/'assets/tf-multi-isignal-sidebar.js';s=p.read_text('utf8')
s=s.replace("let job=null,applied='',pending=false,busy=false,origin='',scheduled=false;","let job=null,applied='',pending=false,busy=false,origin='',scheduled=false,reviewing535=false,reviewRecord535=null;")
s=s.replace('function syncSubmit(){',"function syncSubmit(){if(reviewing535){for(const id of ['batch-scan-isignal-btn','tf-btn-submit-isignal']){const button=document.getElementById(id);if(button&&!button.disabled)button.disabled=true;}return;}")
old='applied=job.runId;tf_populateIsignalRows(job.items||[]);';assert old in s;s=s.replace(old,'void reviewDiscovery535(job);')
s=s.replace("'Selesai · '+job.total+' analis · pair terintegrasi sudah dipilih.'","'Selesai · '+job.total+' analis · '+((job.items||[]).some(item=>!cleanPairs535(item.pairs).length)?'pair kosong memerlukan konfirmasi.':'pair terintegrasi sudah dipilih.')")
s=s.replace("['tfIsignalDiscoveryV450','tfScanInProgress','tfScanOrigin']","['tfIsignalDiscoveryV450','tfScanInProgress','tfScanOrigin','tfIsignalDiscoveryReviewV535']")
s=s.replace('job=d.tfIsignalDiscoveryV450||null;','reviewRecord535=d.tfIsignalDiscoveryReviewV535||null;job=d.tfIsignalDiscoveryV450||null;')
needle=" document.addEventListener('click',e=>{";assert s.count(needle)==1
s=s.replace(needle,Path(__file__).with_name('isignal-review535.js').read_text('utf8')+'\n'+needle)
p.write_text(s,encoding='utf8',newline='\n')

# Dynamic builder pages belong before the existing shared footer.
p=root/'assets/tf-indicator-builder.js';s=p.read_text('utf8');needle=' page.append(section);';assert s.count(needle)==1;s=s.replace(needle," const footer=page.querySelector(':scope > footer');if(footer)page.insertBefore(section,footer);else page.append(section);");p.write_text(s,encoding='utf8',newline='\n')

# Keep explicitly discovered/confirmed pairs available in native row selectors.
p=root/'assets/927ecbd63036f61b.js';s=p.read_text('utf8');needle='const arr = tf_normalizePairsArrForAllAnalyst(pairsArr);\nconst options = Array.from(selectEl.options || []);';assert s.count(needle)==1;s=s.replace(needle,"const arr = tf_normalizePairsArrForAllAnalyst(pairsArr);\nfor(const pair of arr||[]){if(pair!==ALL_PAIR_OPTION_VALUE&&/^[A-Z][A-Z0-9._-]{2,19}$/.test(pair)&&!Array.from(selectEl.options).some(o=>o.value===pair)){const option=document.createElement('option');option.value=pair;option.textContent=pair;selectEl.append(option);}}\nconst options = Array.from(selectEl.options || []);");p.write_text(s,encoding='utf8',newline='\n')

# Three distinct valid history months are required for analyst status colors.
for filename in ['assets/894f18e8a37bd7c6.js','assets/4b4d6b8dc315a95c.js','assets/tf-latest-risk-sidebar-rev393.js']:
 p=root/filename;s=p.read_text('utf8');needle='function tf_refreshLatestRiskState(force) {';assert s.count(needle)==1;s=s.replace(needle,Path(__file__).with_name('risk-eligibility535.js').read_text('utf8')+'\n'+needle)
 needle='__tfLatestRiskState = { monthKey:latestMonth, windowStartMonth, windowMonths:4, byPair, byAnalyst, signature };';assert s.count(needle)==1;s=s.replace(needle,'tf_markRiskEligibility535(src,byPair,byAnalyst);\n'+needle)
 s=s.replace('r.sortKey,r.displayDate,r.closedDate,r.createdDate]','r.sortKey,r.displayDate,r.closedDate,r.createdDate,r.status,r.cancelled,r.isCancelled]')
 if 'sidebar' not in filename:
  s=s.replace('severity:0,syntheticHealthy:true','severity:0,eligible:false,historyMonths:0,syntheticHealthy:true')
  s=s.replace("function tf_latestRiskReason(st) {\nif (!st) return '';", "function tf_latestRiskReason(st) {\nif (!st) return '';\nif(st.eligible===false)return 'Data history signal belum memenuhi syarat minimal 3 bulan ('+(st.historyMonths||0)+' bulan tersedia).';")
  s=s.replace("const color = st.severity >= 2 ? '#ef4444'", "const color = st.eligible===false ? '#f8fafc' : st.severity >= 2 ? '#ef4444'")
  s=s.replace("el.classList.remove('tf-latest-risk-healthy','tf-latest-risk-warning','tf-latest-risk-critical');","el.classList.remove('tf-latest-risk-healthy','tf-latest-risk-warning','tf-latest-risk-critical','tf-latest-risk-unknown');")
  unknown="if(st.eligible===false){el.classList.add('tf-latest-risk-unknown');el.querySelectorAll('[data-tf-latest-risk-icon=\"1\"]').forEach(x=>x.remove());tf_forceLatestRiskTextColor(el,st);el.setAttribute('data-tf-risk-history-note',tf_latestRiskReason(st));return st;}\n"
  s=s.replace("el.classList.add(st.severity >= 2 ?",unknown+"el.classList.add(st.severity >= 2 ?")
  s=s.replace("el.classList.add(st.severity>=2?",unknown+"el.classList.add(st.severity>=2?")
  needle="const st = tf_getLatestRiskState(analyst, pair) || tf_getLatestRiskState(analyst, null);\nif (!st) return null;"
  assert needle in s;s=s.replace(needle,needle+"\nif(st.eligible===false)return st;")
 else:
  s=s.replace('[key,value.severity]','[key,value.eligible===false?null:value.severity]')
  old="const sev=state.byAnalyst.has(k)?(state.byAnalyst.get(k)||0):0;";assert old in s;s=s.replace(old,"const sev=state.byAnalyst.has(k)?state.byAnalyst.get(k):null;")
  s=s.replace('else x.el.classList.add(H);','else if(sev===0)x.el.classList.add(H);')
  s=s.replace('sev===1?"#facc15":"#22c55e"','sev===1?"#facc15":sev===0?"#22c55e":"#f8fafc"')
  s=s.replace('sev===1?"!":"✓"','sev===1?"!":sev===0?"✓":""')
 p.write_text(s,encoding='utf8',newline='\n')
p=root/'assets/tf-analyst-risk-adjustment.js';s=p.read_text('utf8');s+='\n'+Path(__file__).with_name('risk-legend535.js').read_text('utf8');p.write_text(s,encoding='utf8',newline='\n')
p=root/'assets/tf-analyst-report.js';s=p.read_text('utf8');needle='grouped.forEach(r=>{const pnl=state.byAnalyst.get(norm(r.name))?.monthlyPnl;';assert needle in s;s=s.replace(needle,'grouped.forEach(r=>{r.eligible=state.byAnalyst.get(norm(r.name))?.eligible!==false;const pnl=state.byAnalyst.get(norm(r.name))?.monthlyPnl;');s=s.replace("s=r.oldLoss===null?null:r.severity;","s=r.eligible===false||r.oldLoss===null?null:r.severity;");p.write_text(s,encoding='utf8',newline='\n')
p=root/'assets/7e95b596e5bf8dff.css';s=p.read_text('utf8');s+='\n.tf-latest-risk-unknown,.tf-latest-risk-unknown .tf-analyst-name-color-target{color:#f8fafc!important;-webkit-text-fill-color:#f8fafc!important}#tf-analyst-report tr[data-severity="unknown"] td:nth-child(2),#tf-analyst-report tr[data-severity="unknown"] .tf-report-status{color:#f8fafc!important}\n';p.write_text(s,encoding='utf8',newline='\n')

p=root/'manifest.json';d=json.loads(p.read_text('utf8'));d.update(version='1.18.48',version_name='1.18.48',description='REV535: show batch progress and elapsed timer only while scanning.');p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf8',newline='\n')
notes='''REV535 / v1.18.48

- Hide the batch progress panel and elapsed timer when no batch is running, including completed, stopped, paused and error states restored from storage.
- Keep progress and timer visible only for a running batch with unfinished analysts. Stop timer updates when the panel is hidden.
- Lock a selected month in the opposite Survived/Not Survived filter immediately; reject conflicting backend configurations and resolve old overlaps deterministically.
- Include active and inactive iSignal subscriptions. Read Symbol diintegrasi and Symbol terintegrasi. Missing pairs require per-analyst manual confirmation; Cancel preserves previous rows, with no silent ALL fallback.
- Insert MT4/MT5 and TradingView builder content before the shared footer, keeping copyright links beneath the page and tutorials.
- Show analyst status names in white until at least three distinct months of valid trade history are available; explain the white state in the main dashboard popup. No financial risk calculations are changed.
- Preserve all REV534 login, loss color and report height fixes. No scanning or financial calculation changes.
'''
(root/'README_REV535.md').write_text(notes,encoding='utf8',newline='\n')
p=root/'assets/7b6af0cb4001a684.js';s=p.read_text('utf8');m=re.search(r'const FILES = (\{.*?\});',s,re.S);checks=json.loads(m[1]);checks={n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in checks};p.write_text(s[:m.start(1)]+json.dumps(checks,indent=2)+s[m.end(1):],encoding='utf8',newline='\n')
print('Prepared REV535')
