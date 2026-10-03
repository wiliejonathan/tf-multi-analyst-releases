(()=>{
  const JOB='tfMultiJobV419',CMD='tfMultiCommandV419',URL='multi-scanner/dashboard.html';
  async function open(){const url=chrome.runtime.getURL(URL),tabs=await chrome.tabs.query({url});if(tabs.length){await chrome.tabs.update(tabs[0].id,{active:true});return tabs[0].id;}return (await chrome.tabs.create({url})).id;}
  chrome.runtime.onMessage.addListener((m,sender,reply)=>{
    if(!m?.type?.startsWith('TF_MULTI_'))return;
    (async()=>{
      if(m.type==='TF_MULTI_OPEN')return {ok:true,tabId:await open()};
      if(m.type==='TF_MULTI_START'){const data=await chrome.storage.local.get([JOB,'tfScanInProgress']);if(data.tfScanInProgress)throw Error('Batch scan utama masih berjalan. Hentikan dahulu.');if(data[JOB]&&['running','paused','error'].includes(data[JOB].status))throw Error('Scan multi-link sebelumnya belum selesai. Gunakan Resume atau Stop.');await chrome.storage.local.set({tfMultiPendingStartV419:true});return {ok:true,tabId:await open()};}
      if(m.type==='TF_MULTI_CONTROL'){
        if(!['pause','resume','stop'].includes(m.action))throw Error('Kontrol tidak dikenal.');const data=await chrome.storage.local.get([JOB,'tfMultiOwnedTabV419']),job=data[JOB];if(!job)throw Error('Belum ada scan.');if(m.jobId&&m.jobId!==job.id)throw Error('Scan telah berubah; muat ulang status.');if(['complete','stopped'].includes(job.status))return {ok:true};
        await chrome.storage.local.set({[CMD]:{id:crypto.randomUUID(),jobId:job.id,action:m.action,at:Date.now()}});
        if(m.action==='resume')return {ok:true,tabId:await open()};
        if(Number.isInteger(data.tfMultiOwnedTabV419)){try{await chrome.tabs.remove(data.tfMultiOwnedTabV419);}catch{}await chrome.storage.local.remove('tfMultiOwnedTabV419');}
        // Closing the owned scan tab aborts its injected DOM task immediately.
        const latest=(await chrome.storage.local.get(JOB))[JOB];if(latest?.id===job.id){latest.status=m.action==='stop'?'stopped':'paused';latest.error=m.action==='stop'?'Dihentikan paksa. Hasil analis selesai tetap tersimpan.':'Dijeda. Klik Resume untuk melanjutkan.';await chrome.storage.local.set({[JOB]:latest,tfMultiHeartbeatV419:0});}return {ok:true};
      }
      throw Error('Aksi multi-link tidak dikenal.');
    })().then(reply).catch(e=>reply({ok:false,error:e.message}));return true;
  });
})();
