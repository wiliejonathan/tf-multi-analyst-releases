(() => {
 'use strict';
 if(window.__tfTotalProgress439)return;
 window.__tfTotalProgress439=true;
 let state=null,timer=0;
 const stamp=value=>typeof value==='number'?value:(Date.parse(value||'')||0);
 function fromMulti(job){if(!job)return null;return {runId:job.id,total:job.inventory?.length||0,completed:job.cursor||0,status:job.status==='complete'?'done':job.status,startedAt:stamp(job.createdAt),endedAt:stamp(job.finishedAt)||Number(job.heartbeatAt)||0};}
 function duration(){const start=stamp(state?.startedAt);if(!start)return '00:00';const end=state.status==='running'?Date.now():(stamp(state.endedAt)||stamp(state.updatedAt)||Date.now());const seconds=Math.max(0,Math.floor((end-start)/1000)),s=String(seconds%60).padStart(2,'0'),m=String(Math.floor(seconds/60)%60).padStart(2,'0');return seconds>=3600?Math.floor(seconds/3600)+':'+m+':'+s:String(Math.floor(seconds/60)).padStart(2,'0')+':'+s;}
 const style=document.createElement('style');
 style.textContent='.tf-total-progress{margin:5.4px 0 7.2px;font-size:9px;color:#9ecbfa}.tf-total-progress[hidden]{display:none!important}.tf-total-progress-heading{display:flex;justify-content:space-between;gap:7.2px;margin-bottom:5.4px}.tf-total-progress-track{height:5.4px;overflow:hidden;border-radius:18px;background:#1e293b}.tf-total-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#2563eb,#38bdf8);border-radius:18px;transition:width .3s ease}.tf-total-progress-bottom{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-top:4.5px;color:#94a3b8}.tf-total-progress-time{flex-shrink:0;font-variant-numeric:tabular-nums;color:#9ecbfa;white-space:nowrap}';
 document.head.append(style);
 function tick(){const text=duration();document.querySelectorAll('.tf-total-progress-time').forEach(el=>{if(el.textContent!==text)el.textContent=text;});}
 function schedule(){clearInterval(timer);timer=0;if(state?.status==='running'&&!document.hidden&&document.querySelector('.tf-total-progress:not([hidden])'))timer=setInterval(tick,1000);}
 function render(){
  document.querySelectorAll('.tf-github-update-block[data-tf-update-kind="profile"]').forEach(anchor=>{
   let box=anchor.nextElementSibling;
   if(!box?.classList.contains('tf-total-progress')){
    box=document.createElement('section');box.className='tf-total-progress';
    box.innerHTML='<div class="tf-total-progress-heading"><span>Progress Analis</span><strong class="tf-total-progress-percent">0%</strong></div><div class="tf-total-progress-track" role="progressbar" aria-label="Progress total analis" aria-valuemin="0" aria-valuemax="100"><div class="tf-total-progress-fill"></div></div><div class="tf-total-progress-bottom"><span class="tf-total-progress-note"></span><time class="tf-total-progress-time" aria-label="Durasi batch scanning">00:00</time></div>';
    anchor.after(box);
   }
   const total=Math.max(0,Number(state?.total)||0),completed=Math.min(total,Math.max(0,Number(state?.completed)||0)),percent=total?Math.round(completed/total*100):0;
   box.hidden=!state||!total;
   box.querySelector('.tf-total-progress-percent').textContent=percent+'%';
   box.querySelector('.tf-total-progress-fill').style.width=percent+'%';
   box.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(percent));
   const label={done:'Selesai',stopped:'Dihentikan',error:'Error',paused:'Dijeda',running:'Berjalan'}[state?.status]||'Menunggu';
   box.querySelector('.tf-total-progress-note').textContent=completed+' / '+total+' analis · '+label;
  });tick();schedule();
 }
 chrome.storage.local.get(['tfTotalAnalystProgressV439','tfMultiJobV419'],data=>{state=data.tfMultiJobV419&&['running','paused'].includes(data.tfMultiJobV419.status)?fromMulti(data.tfMultiJobV419):data.tfTotalAnalystProgressV439||null;render();});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;if(changes.tfMultiJobV419)state=fromMulti(changes.tfMultiJobV419.newValue);if(changes.tfTotalAnalystProgressV439)state=changes.tfTotalAnalystProgressV439.newValue||null;render();});
 chrome.runtime.onMessage.addListener(message=>{if(message.type==='batchScanDone'&&state){state={...state,status:message.error?'error':message.stopped?'stopped':'done',endedAt:Date.now()};render();}});
 let scheduled=false;
 new MutationObserver(records=>{if(scheduled||!records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&!n.closest?.('.tf-total-progress')&&(n.matches?.('.tf-github-update-block')||n.querySelector?.('.tf-github-update-block')))))return;scheduled=true;queueMicrotask(()=>{scheduled=false;render();});}).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('visibilitychange',()=>{tick();schedule();});
 window.addEventListener('pagehide',()=>{clearInterval(timer);timer=0;},{once:true});
 render();
})();
