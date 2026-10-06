(() => {
 'use strict';
 let job=null,applied='',pending=false,busy=false,origin='',scheduled=false;
 function syncSubmit(){
  if(busy||pending||job?.status==='running')return;
  const ready=Array.from(document.querySelectorAll('#isignal-links-container .analyst-link-input')).some(e=>/^https:\/\/account\.tradersfamily\.id\/channels\/\d+\/?(?:\?.*)?$/.test(e.value.trim()));
  for(const id of ['batch-scan-isignal-btn','tf-btn-submit-isignal']){
   const b=document.getElementById(id);if(!b||b.classList.contains('tf-scan-activity-locked')||b.classList.contains('tf-update-activity-locked'))continue;
   if(b.disabled===ready)b.disabled=!ready;
   if(b.inert)b.inert=false;
   if(b.getAttribute('aria-disabled')!==String(!ready))b.setAttribute('aria-disabled',String(!ready));
   if(ready&&b.title==='Submit hanya aktif setelah Import file.')b.title='';
  }
 }
 function scheduleSubmit(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;syncSubmit();});}
 function render(){
  const button=document.getElementById('scan-from-isignal-btn');if(!button)return;
  const running=pending||job?.status==='running';
  button.textContent=running?'Stop':'Scan From iSignal';button.classList.toggle('danger',!!running);
  if(running){button.disabled=false;button.inert=false;}
  if(job?.status==='done'&&job.runId!==applied&&typeof tf_populateIsignalRows==='function'){
   applied=job.runId;tf_populateIsignalRows(job.items||[]);
  }
  if(job&&typeof setIsignalStatus==='function')setIsignalStatus(job.status==='done'?'Selesai · '+job.total+' analis · pair terintegrasi sudah dipilih.':job.error||'Memeriksa pair terintegrasi · '+job.completed+' / '+job.total+' analis.');
  scheduleSubmit();
 }
 document.addEventListener('click',e=>{
  const target=e.target.closest?.('#scan-from-isignal-btn');
  if(target){
   e.preventDefault();e.stopImmediatePropagation();
   if(job?.status==='running'){chrome.runtime.sendMessage({type:'TF_ISIGNAL_DISCOVER_STOP'},()=>{void chrome.runtime.lastError;});return;}
   if(pending||target.disabled)return;
   if(target.dataset.tfImportBlocked==='1'){setStatus('Klik Refresh terlebih dahulu sebelum Scan From iSignal.');return;}
   pending=true;showIsignalSubview();render();
   chrome.tabs.query({active:true,currentWindow:true},tabs=>chrome.runtime.sendMessage({type:'TF_ISIGNAL_DISCOVER_START',ownerTabId:tabs?.[0]?.id||null},r=>{
    pending=false;const error=chrome.runtime.lastError;
    if(error||!r?.ok){setIsignalStatus(error?.message||r?.error||'Gagal memulai pemeriksaan iSignal.');render();}
   }));return;
  }
  const name=e.target.closest?.('#isignal-links-container .analyst-name-btn,#isignal-links-container .tf-analyst-name-pill,#isignal-links-container .analyst-paste-btn');
  if(!name||name.disabled)return;
  const url=name.closest('.analyst-row')?.querySelector('.analyst-link-input')?.value?.trim();
  if(!/^https:\/\/account\.tradersfamily\.id\/channels\/\d+\/?(?:\?.*)?$/.test(url||''))return;
  e.preventDefault();e.stopImmediatePropagation();
  chrome.windows.getCurrent(win=>chrome.tabs.create({url,active:true,windowId:win.id}));
 },true);
 chrome.storage.local.get(['tfIsignalDiscoveryV450','tfScanInProgress','tfScanOrigin'],d=>{job=d.tfIsignalDiscoveryV450||null;busy=!!d.tfScanInProgress;origin=d.tfScanOrigin||'';render();});
 chrome.storage.onChanged.addListener((c,area)=>{if(area!=='local')return;if(c.tfScanInProgress)busy=!!c.tfScanInProgress.newValue;if(c.tfScanOrigin)origin=c.tfScanOrigin.newValue||'';if(c.tfIsignalDiscoveryV450){job=c.tfIsignalDiscoveryV450.newValue||null;render();}scheduleSubmit();});
 document.addEventListener('input',scheduleSubmit);
 new MutationObserver(scheduleSubmit).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','inert','class']});
})();
