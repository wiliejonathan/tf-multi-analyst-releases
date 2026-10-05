(() => {
 'use strict';
 if(window.__tfActivityLock445)return;window.__tfActivityLock445=true;
 let active=false,origin='',rescanPending=false,scheduled=false;
 const held=new Map();
 const rescan='#tf-rescan-all-analysts';
 const update='[id^="tf-btn-update-"]';
 const all=[ '#tf-multi-entry','#batch-scan-btn','#batch-scan-isignal-btn','#scan-btn','#add-analyst-btn','#add-analyst-isignal-btn','#scan-from-isignal-btn','#open-dashboard-btn','#logout-btn','#scan-pair-multiselect', '.profile-time-range', '[id^="tf-tr-toggle-"]', '[id^="tf-btn-import-"]','[id^="tf-btn-export-"]','[id^="tf-btn-add-analyst-"]','[id^="tf-btn-submit-"]','[id^="tf-btn-update-"]','[id^="tf-btn-refresh-"]','[id^="tf-btn-scanlink-"]','[id^="tf-btn-scanpair-"]' ].join(',');
 function targets(){if(rescanPending||active&&origin==='rescanAllAnalysts')return all;if(active&&/update/i.test(origin))return rescan;if(active)return rescan+','+update;return '';}
 function apply(){const selector=targets();const wanted=new Set(selector?document.querySelectorAll(selector):[]);
  for(const [el,old]of held){if(wanted.has(el))continue;held.delete(el);el.inert=old.inert;if('disabled'in el&&!el.classList.contains('tf-update-activity-locked'))el.disabled=old.disabled;
   if(old.aria===null)el.removeAttribute('aria-disabled');else el.setAttribute('aria-disabled',old.aria);el.classList.remove('tf-scan-activity-locked');}
  wanted.forEach(el=>{if(!held.has(el))held.set(el,{disabled:!!el.disabled,inert:el.inert,aria:el.getAttribute('aria-disabled')});if(!el.inert)el.inert=true;if('disabled'in el&&!el.disabled)el.disabled=true;if(el.getAttribute('aria-disabled')!=='true')el.setAttribute('aria-disabled','true');if(!el.classList.contains('tf-scan-activity-locked'))el.classList.add('tf-scan-activity-locked');});
 }
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;apply();});}
 document.addEventListener('tf-rescan-activity',e=>{rescanPending=!!e.detail?.pending;apply();});
 document.addEventListener('click',e=>{const selector=targets();if(selector&&e.target.closest?.(selector)){e.preventDefault();e.stopImmediatePropagation();}},true);
 const style=document.createElement('style');style.textContent='.tf-scan-activity-locked{opacity:.45!important;cursor:not-allowed!important}';document.head.append(style);
 chrome.storage.local.get(['tfScanInProgress','tfScanOrigin'],d=>{active=!!d.tfScanInProgress;origin=d.tfScanOrigin||'';apply();});
 chrome.storage.onChanged.addListener((c,area)=>{if(area!=='local')return;if(c.tfScanInProgress)active=!!c.tfScanInProgress.newValue;if(c.tfScanOrigin)origin=c.tfScanOrigin.newValue||'';if(c.tfScanInProgress||c.tfScanOrigin)apply();});
 chrome.runtime.sendMessage({type:'TF_RESCAN_LIVE_STATE'},r=>{void chrome.runtime.lastError;if(r?.ok){active=!!r.busy;origin=r.origin||origin;apply();}});
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','inert','aria-disabled']});
})();
