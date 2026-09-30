// REV408: scoped deletion in the analyst pair selector.
function tf_pairDeletePayload408(data, url, pair) {
  const norm = s => String(s || '').trim().replace(/\/+$/, '');
  const upper = s => String(s || '').trim().toUpperCase();
  const names = new Set(Object.entries(data.tfAnalystSources || {}).filter(([,v]) => norm(v.url) === norm(url)).map(([k]) => k));
  for (const item of data.tfRememberedAnalystLinks || []) if (norm(item.url) === norm(url)) {
    if (item.name) names.add(item.name);
    if (item.analystName) names.add(item.analystName);
  }
  if (!names.size) throw new Error('Nama analis belum dikenali. Data tidak dihapus.');
  const p = upper(pair);
  if (!p || p === '__ALL__') throw new Error('Pilih satu pair.');
  const history = (data.tfHistorySignals || []).filter(r => !(names.has(r.analyst || r.analystName) && upper(r.pair) === p));
  const monthly = {...data.tfMonthlyStats};
  for (const key of Object.keys(monthly)) {
    const m = key.match(/^(.*?)\s+\(([A-Za-z0-9]+)\)$/);
    if (m && names.has(m[1].trim()) && upper(m[2]) === p) delete monthly[key];
    // Rebuild a legacy aggregate from retained trades, never remove other pairs.
    if (names.has(key)) {
      const months = {};
      for (const r of history) if ((r.analyst || r.analystName) === key) {
        const ts = Number(r.sortKey || r.createdSortKey);
        if (!Number.isFinite(ts) || !ts) continue;
        const month = new Date(ts).toISOString().slice(0,7);
        const v = months[month] || (months[month]={pips:0,signals:0});
        v.pips += Number(r.pips) || 0; v.signals++;
      }
      monthly[key]=months;
    }
  }
  const sources = structuredClone(data.tfAnalystSources || {});
  for (const name of names) if (sources[name]) {
    const old = sources[name].pairs || [];
    sources[name].pairs = old.some(v=>upper(v)==='__ALL__')
      ? [...new Set(history.filter(r=>r.analyst===name).map(r=>upper(r.pair)).filter(Boolean))]
      : old.filter(v=>upper(v)!==p);
  }
  const cleanMap = map => {
    const out=structuredClone(map || {});
    for (const name of names) if(out[name] && typeof out[name]==='object') {
      if(Array.isArray(out[name])) out[name]=out[name].filter(v=>upper(v)!==p);
      else for(const key of Object.keys(out[name])) if(upper(key)===p) delete out[name][key];
    }
    return out;
  };
  const remembered = (data.tfRememberedAnalystLinks || []).map(v=> norm(v.url)===norm(url)
    ? {...v,pairs:(v.pairs || []).filter(x=>upper(x)!==p)} : v);
  return {tfHistorySignals:history,tfMonthlyStats:monthly,tfAnalystSources:sources,
    tfAvgSlPips:cleanMap(data.tfAvgSlPips),tfNoDataPairs:cleanMap(data.tfNoDataPairs),
    tfRememberedAnalystLinks:remembered};
}
(function(){
  let snapshot={}, scheduled=false, busy=false;
  const get = () => new Promise((resolve,reject)=>chrome.storage.local.get(null,d=>{
    if(chrome.runtime.lastError)reject(new Error(chrome.runtime.lastError.message));else resolve(d||{});
  }));
  const urlOf = row => tf_normUrlKey(row.querySelector('.analyst-link-input')?.value);
  const namesOf = url => Object.entries(snapshot.tfAnalystSources||{}).filter(([,v])=>tf_normUrlKey(v.url)===url).map(([k])=>k);
  const hasData = (url,pair) => {
    const names=namesOf(url);
    return names.some(n=> (snapshot.tfHistorySignals||[]).some(r=>r.analyst===n&&String(r.pair).toUpperCase()===pair)
      || Object.hasOwn(snapshot.tfMonthlyStats||{},n+' ('+pair+')'));
  };
  const update = () => {
    scheduled=false;
    document.querySelectorAll('.analyst-row .pair-multiselect-dropdown input[data-value]').forEach(cb=>{
      const pair=String(cb.dataset.value||'').toUpperCase(), row=cb.closest('.analyst-row'), label=cb.closest('label');
      if(!label||pair==='__ALL__')return;
      const found=hasData(urlOf(row),pair);
      let btn=label.querySelector('.tf-pair-delete408');
      if(found&&!btn){
        btn=document.createElement('button');btn.type='button';btn.className='tf-pair-delete408';btn.textContent='×';
        btn.setAttribute('aria-label','Hapus data '+pair);btn.title='Hapus data '+pair+' untuk analis ini';
        btn.style.cssText='font:inherit;line-height:1;padding:0 3px;margin-left:auto;flex:0 0 auto;border:0;background:transparent;color:#ef4444;cursor:pointer;';
        label.appendChild(btn);
        btn.addEventListener('click',async ev=>{
          ev.preventDefault();ev.stopPropagation();if(busy)return;
          busy=true;
          try{
            const url=urlOf(row),names=namesOf(url);
            if(snapshot.tfScanInProgress)throw new Error('Tunggu scan selesai sebelum menghapus data pair.');
            const title='Hapus data '+pair+' — '+names.join(', ')+'? Pair lain dan row analis tetap tersimpan.';
            if(!await tf_confirmDeleteAnalyst(title))return;
            const fresh=await get();
            if(fresh.tfScanInProgress)throw new Error('Scan sedang berjalan. Data tidak dihapus.');
            const payload=tf_pairDeletePayload408(fresh,url,pair);
            await new Promise((resolve,reject)=>chrome.storage.local.set(payload,()=>chrome.runtime.lastError?reject(new Error(chrome.runtime.lastError.message)):resolve()));
            snapshot={...fresh,...payload};
            document.querySelectorAll('.analyst-row').forEach(other=>{
              if(urlOf(other)!==url)return;
              const select=other.querySelector('.analyst-pair-select');
              if(select){for(const opt of select.options)if(String(opt.value).toUpperCase()===pair)opt.selected=false;}
              other.querySelectorAll('.pair-multiselect-dropdown input[data-value]').forEach(c=>{if(String(c.dataset.value).toUpperCase()===pair){c.checked=false;c.disabled=false;}});
              const widget=other.querySelector('.pair-multiselect');
              if(widget&&typeof widget.__tf_syncFromSelect==='function')widget.__tf_syncFromSelect();
            });
            update();
          }catch(e){alert(e.message||'Gagal menghapus data pair.');}
          finally{busy=false;}
        });
      }
      if(btn)btn.hidden=!found;
    });
  };
  const schedule=()=>{if(!scheduled){scheduled=true;setTimeout(update,30);}};
  get().then(d=>{snapshot=d;update();}).catch(()=>{});
  chrome.storage.onChanged.addListener((changes,area)=>{
    if(area!=='local')return;
    for(const [key,v] of Object.entries(changes))snapshot[key]=v.newValue;
    schedule();
  });
  new MutationObserver(records=>{if(records.some(r=>r.type==='attributes'||Array.from(r.addedNodes||[]).some(n=>n.nodeType===1&&!n.classList.contains('tf-pair-delete408'))))schedule();}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled']});
})();
