(()=>{
  const JOB='tfMultiJobV419',CMD='tfMultiCommandV419',URL='multi-scanner/dashboard.html';
  async function open(windowId){windowId=windowId??(await chrome.windows.getLastFocused()).id;await chrome.windows.get(windowId);const url=chrome.runtime.getURL(URL),tabs=await chrome.tabs.query({url,windowId});if(tabs.length){await chrome.tabs.update(tabs[0].id,{active:true});return tabs[0].id;}return (await chrome.tabs.create({url,windowId})).id;}
  chrome.runtime.onMessage.addListener((m,sender,reply)=>{
    if(!m?.type?.startsWith('TF_MULTI_'))return;
    (async()=>{
      const windowId=sender.tab?.windowId??m.windowId;
      if(m.type==='TF_MULTI_OPEN')return {ok:true,tabId:await open(windowId)};
      if(m.type==='TF_MULTI_START'){const data=await chrome.storage.local.get([JOB,'tfScanInProgress']);if(data.tfScanInProgress)throw Error('Batch scan utama masih berjalan. Hentikan dahulu.');if(data[JOB]&&['running','paused','error'].includes(data[JOB].status))throw Error('Scan multi-link sebelumnya belum selesai. Gunakan Resume atau Stop.');await chrome.storage.local.set({tfMultiPendingStartV419:true});return {ok:true,tabId:await open(windowId)};}
      if(m.type==='TF_MULTI_RESET')return navigator.locks.request('tf-multi-runner-v419',{ifAvailable:true},async lock=>{
        if(!lock)throw Error('Stop scan Multi-Link sebelum Reset.');
        const data=await chrome.storage.local.get([JOB,'tfMultiHeartbeatV419','tfMultiPendingStartV419']);
        if(['running','paused','error'].includes(data[JOB]?.status)||data.tfMultiPendingStartV419||Date.now()-(data.tfMultiHeartbeatV419||0)<10000)throw Error('Stop scan Multi-Link sebelum Reset.');
        if(data[JOB])await chrome.storage.local.set({['tfMultiArchiveV419-'+data[JOB].id]:data[JOB]});
        await chrome.storage.local.set({tfMultiHeartbeatV419:0,tfMultiPendingStartV419:false});
        await chrome.storage.local.remove([JOB,CMD,'tfMultiOwnedTabV419']);
        return {ok:true};
      });
      if(m.type==='TF_MULTI_CONTROL'){
        if(!['pause','resume','stop'].includes(m.action))throw Error('Kontrol tidak dikenal.');const data=await chrome.storage.local.get([JOB,'tfMultiOwnedTabV419']),job=data[JOB];if(!job)throw Error('Belum ada scan.');if(m.jobId&&m.jobId!==job.id)throw Error('Scan telah berubah; muat ulang status.');if(job.status==='complete'||job.status==='stopped'&&m.action!=='resume')return {ok:true};
        await chrome.storage.local.set({[CMD]:{id:crypto.randomUUID(),jobId:job.id,action:m.action,source:m.source||'unknown',at:Date.now()}});
        if(m.action==='resume')return {ok:true,tabId:await open(windowId)};
        // A live runner owns cancellation and cleanup. Never overwrite its newer Resume state.
        await navigator.locks.request('tf-multi-runner-v419',{ifAvailable:true},async lock=>{
          if(!lock)return;
          const latest=(await chrome.storage.local.get(JOB))[JOB];if(latest?.id!==job.id)return;
          latest.status=m.action==='stop'?'stopped':'paused';latest.error=m.action==='stop'?'Dihentikan. Hasil analis selesai tetap tersimpan.':'Dijeda. Klik Resume untuk melanjutkan.';
          await chrome.storage.local.set({[JOB]:latest,tfMultiHeartbeatV419:0});
          if(Number.isInteger(data.tfMultiOwnedTabV419)){try{await chrome.tabs.remove(data.tfMultiOwnedTabV419);}catch{}}
          await chrome.storage.local.remove('tfMultiOwnedTabV419');
        });return {ok:true};
      }
      throw Error('Aksi multi-link tidak dikenal.');
    })().then(reply).catch(e=>reply({ok:false,error:e.message}));return true;
  });
})();
