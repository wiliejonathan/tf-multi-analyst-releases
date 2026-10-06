(() => {
 'use strict';
 const KEY='tfIsignalDiscoveryV450', ORIGIN='isignalDiscovery';
 const state={active:false,stop:false,tabs:new Set()};
 globalThis.tfIsignalDiscovery450=state;
 const write=data=>new Promise((resolve,reject)=>chrome.storage.local.set(data,()=>{const e=chrome.runtime.lastError;e?reject(new Error(e.message)):resolve();}));
 const cancelled=()=>{if(state.stop)throw new Error('Pemeriksaan iSignal dihentikan.');};
 const safe=(url,detail=false)=>{const u=new URL(url);if(u.origin!=='https://account.tradersfamily.id'||!(detail?/^\/channels\/isignal\/\d+\/?$/:/^\/channels\/\d+\/?$/).test(u.pathname))throw new Error('Link iSignal tidak valid.');return u.href;};
 async function page(url,owner,message){
  cancelled();const tab=await bg_createSilentTab(url,owner);if(!tab?.id)throw new Error('Gagal membuka tab pemeriksaan iSignal.');
  state.tabs.add(tab.id);
  try{await bg_waitForTabLoaded(tab.id,30000);cancelled();if(!await bg_waitForContentScriptReady(tab.id,15000))throw new Error('Halaman iSignal belum siap.');cancelled();const r=await bg_sendMessage(tab.id,message,240000);cancelled();if(!r?.ok)throw new Error(r?.error||'Gagal membaca iSignal.');return r;}
  finally{state.tabs.delete(tab.id);await bg_removeTab(tab.id);}
 }
 async function run(owner,runId){
  let job={runId,status:'running',items:[],total:0,completed:0};
  const progress=()=>write({[KEY]:job,tfTotalAnalystProgressV439:{total:job.total,completed:job.completed,status:job.status,origin:ORIGIN}});
  const timer=setInterval(()=>chrome.storage.local.set({tfActiveScanHeartbeatAt:Date.now(),tfActiveScanProgressAt:Date.now()}),10000);
  try{
   tf_setScanInProgress(true,{origin:ORIGIN});await progress();
   const list=await page('https://account.tradersfamily.id/channels/isignal/',owner,{type:'scanIsignalActiveChannels'});
   const items=Array.isArray(list.items)?list.items:[];job.total=items.length;await progress();
   for(const item of items){
    cancelled();safe(item.url);if(!item.settingsUrl)throw new Error('Atur iSignal tidak ditemukan untuk '+(item.name||item.url));
    const detail=await page(safe(item.settingsUrl,true),owner,{type:'tfIsignalIntegratedPairs450',channelUrl:item.url});
    job.items.push({...item,pairs:detail.pairs?.length?detail.pairs:['__ALL__']});job.completed++;await progress();
   }
   job.status='done';await progress();
  }catch(e){job.status=state.stop?'stopped':'error';job.error=String(e.message||e);await progress();}
  finally{clearInterval(timer);state.active=false;tf_setScanInProgress(false,{origin:ORIGIN});}
 }
 chrome.runtime.onMessage.addListener((msg,sender,respond)=>{
  if(msg?.type==='TF_ISIGNAL_DISCOVER_START'){
   if(state.active||tf_batchScanState.active){respond({ok:false,error:'Scan lain masih berjalan.'});return;}
   state.active=true;state.stop=false;const runId=Date.now()+'-'+Math.random().toString(36).slice(2);
   respond({ok:true,runId});void run(msg.ownerTabId||sender.tab?.id||null,runId);return;
  }
  if(msg?.type==='TF_ISIGNAL_DISCOVER_STOP'){state.stop=true;for(const id of state.tabs)void bg_removeTab(id);respond({ok:true});return;}
 });
 // A restarted worker must release an interrupted discovery without discarding its partial results.
 chrome.storage.local.get([KEY,'tfScanOrigin'],d=>{if(state.active||d.tfScanOrigin!==ORIGIN)return;const old=d[KEY];if(old?.status==='running')void write({[KEY]:{...old,status:'stopped',error:'Pemeriksaan terputus; jalankan Scan From iSignal kembali.'},tfScanInProgress:false,tfScanOrigin:null});});
})();
