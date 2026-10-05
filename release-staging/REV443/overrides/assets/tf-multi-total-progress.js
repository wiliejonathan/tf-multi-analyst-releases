(() => {
 'use strict';
 if (window.__tfTotalProgress439) return;
 window.__tfTotalProgress439 = true;
 let state = null;
 function fromMulti(job){if(!job)return null;return {total:job.inventory?.length||0,completed:job.cursor||0,status:job.status==='complete'?'done':job.status};}
 const style = document.createElement('style');
 style.textContent = '.tf-total-progress{margin:6px 0 8px;font-size:10px;color:#9ecbfa}.tf-total-progress[hidden]{display:none!important}.tf-total-progress-heading{display:flex;justify-content:space-between;gap:8px;margin-bottom:6px}.tf-total-progress-track{height:6px;overflow:hidden;border-radius:20px;background:#1e293b}.tf-total-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#2563eb,#38bdf8);border-radius:20px;transition:width .3s ease}.tf-total-progress-note{margin-top:5px;color:#94a3b8}';
 document.head.append(style);
 function render() {
  document.querySelectorAll('.tf-github-update-block[data-tf-update-kind="profile"]').forEach(anchor => {
   let box = anchor.nextElementSibling;
   if (!box?.classList.contains('tf-total-progress')) {
    box = document.createElement('section'); box.className = 'tf-total-progress';
    box.innerHTML = '<div class="tf-total-progress-heading"><span>Progress Analis</span><strong class="tf-total-progress-percent">0%</strong></div><div class="tf-total-progress-track" role="progressbar" aria-label="Progress total analis" aria-valuemin="0" aria-valuemax="100"><div class="tf-total-progress-fill"></div></div><div class="tf-total-progress-note"></div>';
    anchor.after(box);
   }
   const total = Math.max(0,Number(state?.total)||0);
   const completed = Math.min(total,Math.max(0,Number(state?.completed)||0));
   const percent = total ? Math.round(completed/total*100) : 0;
   box.hidden = !state || !total;
   box.querySelector('.tf-total-progress-percent').textContent = percent+'%';
   box.querySelector('.tf-total-progress-fill').style.width = percent+'%';
   box.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(percent));
   const label = {done:'Selesai',stopped:'Dihentikan',error:'Error',paused:'Dijeda',running:'Berjalan'}[state?.status] || 'Berjalan';
   box.querySelector('.tf-total-progress-note').textContent = completed+' / '+total+' analis · '+label;
  });
 }
 chrome.storage.local.get(['tfTotalAnalystProgressV439','tfMultiJobV419'],data => {state=data.tfMultiJobV419&&['running','paused'].includes(data.tfMultiJobV419.status)?fromMulti(data.tfMultiJobV419):data.tfTotalAnalystProgressV439||null;render();});
 chrome.storage.onChanged.addListener((changes,area) => {if(area==='local'&&changes.tfMultiJobV419){state=fromMulti(changes.tfMultiJobV419.newValue);render();}if(area==='local' && changes.tfTotalAnalystProgressV439){state=changes.tfTotalAnalystProgressV439.newValue||null;render();}});
 chrome.runtime.onMessage.addListener(message => {
  if(message.type==='batchScanDone' && state){state={...state,status:message.error?'error':message.stopped?'stopped':'done'};render();}
 });
 let scheduled=false;
 new MutationObserver(records => {
  if(scheduled || !records.some(r => [...r.addedNodes].some(n => n.nodeType===1 && !n.closest?.('.tf-total-progress') && (n.matches?.('.tf-github-update-block') || n.querySelector?.('.tf-github-update-block')))))return;
  scheduled=true;queueMicrotask(()=>{scheduled=false;render();});
 }).observe(document.body,{childList:true,subtree:true});
 render();
})();
