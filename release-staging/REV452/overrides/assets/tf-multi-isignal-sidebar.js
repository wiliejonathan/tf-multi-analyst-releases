(() => {
 'use strict';
 let job=null,applied='',pending=false;
 function render(){
  const button=document.getElementById('scan-from-isignal-btn');if(!button)return;
  const running=pending||job?.status==='running';
  button.textContent=running?'Stop':'Scan From iSignal';button.classList.toggle('danger',!!running);
  if(running){button.disabled=false;button.inert=false;}
  if(job?.status==='done'&&job.runId!==applied&&typeof tf_populateIsignalRows==='function'){
   applied=job.runId;tf_populateIsignalRows(job.items||[]);
  }
  if(job&&typeof setIsignalStatus==='function')setIsignalStatus(job.status==='done'?'Selesai · '+job.total+' analis · pair terintegrasi sudah dipilih.':job.error||'Memeriksa pair terintegrasi · '+job.completed+' / '+job.total+' analis.');
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
 chrome.storage.local.get(['tfIsignalDiscoveryV450'],d=>{job=d.tfIsignalDiscoveryV450||null;render();});
 chrome.storage.onChanged.addListener((c,area)=>{if(area==='local'&&c.tfIsignalDiscoveryV450){job=c.tfIsignalDiscoveryV450.newValue||null;render();}});
})();
