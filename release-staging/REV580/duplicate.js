(() => {
  const fields = ['created_at_wib','opened_at_wib','closed_at_wib','result','outcome','type'];
  const labels = ['Created At','Opened At','Closed At','Pips','TP/SL','Type'];
  const timeTolerance = 5 * 60 * 1000;
  const pipTolerance = 5;
  const pips = row => TFCore.pips(String(row.result ?? '').trim().replace(/^\+/, '').replace(/^−/, '-'));
  const outcome = value => value > 0 ? 'TP' : value < 0 ? 'SL' : null;
  const display = (row, field) => field === 'outcome' ? outcome(pips(row)) : row[field];
  function timestamp(value) {
    const parts = String(value ?? '').match(/^(\d{2})-(\d{2})-(\d{4}),?\s+(\d{2}):(\d{2})(?::(\d{2}))?(?:\s+WIB)?$/i);
    if (!parts) return null;
    const [, day, month, year, hour, minute, second = '0'] = parts;
    return Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
  }
  const keys = (symbol, times, offsets) => times.flatMap((time, index) =>
    time === null ? [] : offsets.map(offset =>
      JSON.stringify([symbol, index, Math.floor(time / timeTolerance) + offset])));
  function compare(channels, closest) {
    const index = new Map();
    const pairs = new Map();
    channels.forEach((channel, channelIndex) => {
      channel.rows.forEach((row, rowIndex) => {
        const candidates = new Map();
        const value = pips(row);
        const result = outcome(value);
        const type = String(row.type ?? '').trim().toUpperCase().match(/^(BUY|SELL)\b/)?.[1];
        if (!row.symbol || !Number.isFinite(value) || !result || !type) return;
        const times = fields.slice(0, 3).map(field => timestamp(row[field]));
        const symbolKey = row.symbol + ":" + type + ":" + result;
        const rowKeys = keys(symbolKey, times, [0]);
        for (const key of keys(symbolKey, times, [-1, 0, 1])) {
          for (const other of index.get(key) || []) {
            if (other.channelIndex !== channelIndex) candidates.set(other.row, other);
          }
        }
        for (const other of candidates.values()) {
          if (type !== other.type || result !== other.result || Math.abs(value - other.value) > pipTolerance + 1e-9) continue;
          const matchingTimes = times.map((time, i) => time !== null && other.times[i] !== null &&
            Math.abs(time - other.times[i]) <= timeTolerance);
          if (!matchingTimes.some(Boolean)) continue;
          const same = [...matchingTimes, true, true, true];
          const score = same.filter(Boolean).length / fields.length;
          if (score <= .6) continue;
          const id = other.channelIndex + ':' + channelIndex;
          if (!pairs.has(id)) pairs.set(id, { a: other.channelIndex, b: channelIndex, candidates: [] });
          pairs.get(id).candidates.push({left:other.row,right:row,leftIndex:other.rowIndex,rightIndex:rowIndex,same,score});
        }
        for (const key of rowKeys) {
          if (!index.has(key)) index.set(key, []);
          index.get(key).push({channelIndex,row,rowIndex,times,value,result,type});
        }
      });
    });
    const confirmed = Array.from(pairs.values()).flatMap(({a,b,candidates}) => {
      const byLeft = new Map();
      for (const match of candidates.sort((x,y)=>y.score-x.score)) {
        if (!byLeft.has(match.leftIndex)) byLeft.set(match.leftIndex, []);
        byLeft.get(match.leftIndex).push(match);
      }
      const assigned = new Map();
      function assign(leftIndex, visited) {
        for (const match of byLeft.get(leftIndex)) {
          if (visited.has(match.rightIndex)) continue;
          visited.add(match.rightIndex);
          const previous = assigned.get(match.rightIndex);
          if (!previous || assign(previous.leftIndex, visited)) {
            assigned.set(match.rightIndex, match);
            return true;
          }
        }
        return false;
      }
      for (const leftIndex of byLeft.keys()) assign(leftIndex, new Set());
      const matches = [...assigned.values()].sort((a,b)=>a.leftIndex-b.leftIndex);
      const percent = 100 * matches.length / Math.max(channels[a].rows.length,channels[b].rows.length);
      if (closest && matches.length) for (const [id, other] of [[a,b],[b,a]]) {
        if (percent > (closest.get(id)?.percent ?? 0)) closest.set(id,{percent,count:matches.length,name:channels[other].name});
      }
      return percent > 5 ? [{ names:[channels[a].name,channels[b].name], ids:[a,b],matches,percent }] : [];
    });
    // Expand groups only when all members share consistent one-to-one trades.
    const byPair=new Map(confirmed.map(pair=>[pair.ids.join(':'),pair]));
    const neighbors=new Map();
    for(const {ids:[a,b]} of confirmed){
      if(!neighbors.has(a))neighbors.set(a,new Set());
      if(!neighbors.has(b))neighbors.set(b,new Set());
      neighbors.get(a).add(b);neighbors.get(b).add(a);
    }
    const maps=new Map();
    function mapping(a,b){
      const key=a+':'+b;
      if(!maps.has(key)){
        const pair=byPair.get(Math.min(a,b)+':'+Math.max(a,b));
        maps.set(key,new Map((pair?.matches||[]).map(m=>a<b?[m.leftIndex,m.rightIndex]:[m.rightIndex,m.leftIndex])));
      }
      return maps.get(key);
    }
    const covered=new Set(),groups=[];
    const seeds=[...confirmed].sort((a,b)=>b.matches.length-a.matches.length||b.percent-a.percent);
    for(const seed of seeds){
      if(covered.has(seed.ids.join(':')))continue;
      const ids=[...seed.ids];
      let rows=seed.matches.map(m=>[m.leftIndex,m.rightIndex]);
      let candidates=[...(neighbors.get(ids[0])||[])].filter(c=>!ids.includes(c)&&ids.every(id=>neighbors.get(id)?.has(c)));
      candidates.sort((a,b)=>channels[b].rows.length-channels[a].rows.length||a-b);
      for(const candidate of candidates){
        if(!ids.every(id=>neighbors.get(id)?.has(candidate)))continue;
        const aligned=rows.flatMap(indices=>{
          const target=mapping(ids[0],candidate).get(indices[0]);
          return target!==undefined&&ids.every((id,k)=>mapping(id,candidate).get(indices[k])===target)?[[...indices,target]]:[];
        });
        const percent=100*aligned.length/Math.max(channels[candidate].rows.length,...ids.map(id=>channels[id].rows.length));
        if(percent<=5||aligned.length<rows.length)continue;
        ids.push(candidate);rows=aligned;
      }
      if(ids.length===2)continue;
      for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++)covered.add([ids[a],ids[b]].sort((x,y)=>x-y).join(':'));
      const matches=rows.map(indices=>{
        const entries=indices.map((row,k)=>channels[ids[k]].rows[row]);
        const flags=entries.map((row,k)=>fields.map(field=>entries.some((other,j)=>j!==k&&String(display(row,field)??'')===String(display(other,field)??''))));
        return {entries,flags};
      });
      groups.push({ids,names:ids.map(id=>channels[id].name),matches,percent:100*matches.length/Math.max(...ids.map(id=>channels[id].rows.length))});
    }
    for(const group of confirmed){
      group.matches=group.matches.map(match=>({entries:[match.left,match.right],flags:[match.same,match.same]}));
    }
    return [...groups,...confirmed].sort((a,b)=>b.matches.length-a.matches.length||b.percent-a.percent||b.ids.length-a.ids.length);

  }
  globalThis.TFDuplicateCompare = compare;
  if (typeof document === 'undefined') return;

  document.body.innerHTML = `<div class="dashboard"><header><img src="../icon32.png" alt=""><h1>Scan Duplicate channel</h1></header><main><div id="scan-loading" role="status"><span>Memuat hasil scan…</span><progress aria-label="Memuat hasil scan"></progress></div>
  <p class="notice" id="scan-filter-label" hidden></p><div class="stats" id="scan-stats"></div><div class="actions duplicate-actions"><button id="configure">Scan Duplicate channel</button><button id="resume" disabled>Resume</button><button id="excel" disabled>Export Excel</button><button id="pdf" disabled>Export PDF</button><button id="json" disabled>Export JSON</button></div>
  <section id="scan-monitor" class="duplicate-monitor" hidden>
    <div class="monitor-heading"><h2>Progres scan</h2><strong id="scan-percent">0%</strong></div>
    <progress id="scan-bar" aria-label="Progres scan channel"></progress>
    <p id="scan-status" role="status"></p><p id="card-stage" class="notice"></p>
    <div class="monitor-grid">
      <div><h3>Analis yang sudah dipindai</h3><div class="monitor-scroll analyst-scroll" tabindex="0"><table><thead><tr><th>Nama analis</th><th>Level</th><th>Medal</th><th>Losing Month</th><th>Score</th><th>Trade terbaca</th></tr></thead><tbody id="scan-analysts"></tbody></table></div></div>
      <div><h3>Event log</h3><ol id="scan-events" class="monitor-scroll" tabindex="0"></ol></div>
    </div>
  </section>
  <p>History Signal · maksimal sesuai pengaturan per analis sesuai urutan daftar bawaan halaman. Trade dipasangkan satu lawan satu jika pair, arah, dan hasil TP/SL sama, selisih maksimal 5 pips, serta minimal satu waktu (Created, Opened, atau Closed) berselisih maksimal 5 menit. Kemiripan channel dihitung dari jumlah trade cocok dibagi jumlah trade channel yang lebih banyak. Hasil valid di atas 5%.</p>
  <section><h2 class="success-title">✓ Success</h2><button id="report-select" type="button" disabled>Report Massal!</button><div id="success" class="duplicate-table limited-results" tabindex="0"></div></section>
  <section><h2 class="skip-title">✕ Skip</h2><div class="retry-controls"><button id="retry-timeouts" type="button" hidden>Cek ulang</button><progress id="retry-progress" aria-label="Progres cek ulang" hidden></progress><span id="retry-count" role="status"></span><span id="retry-duration"></span></div><div id="skip" class="duplicate-table limited-results" tabindex="0"></div></section>
  <section class="scan-count-grid"><div><h2>Jumlah analis per level</h2><div class="table-wrap"><table><thead><tr><th>Level</th><th>Jumlah ditemukan</th><th>Jumlah Subs</th><th>Detail</th></tr></thead><tbody id="scan-level-counts"></tbody></table></div></div><div><h2>Jumlah analis per status channel</h2><div class="table-wrap"><table><thead><tr><th>Status channel</th><th>Jumlah ditemukan</th><th>Jumlah Subs</th><th>Detail</th></tr></thead><tbody id="scan-status-counts"></tbody></table></div></div></section><dialog id="settings"><form method="dialog"><h2>Scan Duplicate channel</h2><div id="filters"></div><label>Maks. trade per analis <input name="maxTrades" type="number" min="1" step="1" value="30" required></label><div class="actions"><button value="cancel" formnovalidate>Cancel</button><button value="confirm">Confirm</button></div></form></dialog>
  </main></div>`;
  const $ = id => document.getElementById(id);
  const settings = $('settings');
  for (const [name,title,values] of [
    ['levels','Level',['Newbie','Rookie','Pro','Elite','Master','Legend']],
    ['statuses','Status',['Priority','Prospect','Basic']]
  ]) {
    const box = document.createElement('fieldset');
    box.innerHTML = `<legend>${title} (${name==='levels'?'kosong = semua':'maks. 2; kosong = semua'})</legend>`+
      values.map(value=>`<label><input type="checkbox" name="${name}" value="${value}">${value}${name==='statuses'?' Channel':''}</label>`).join('');
    box.onchange = () => {
      const checked = box.querySelectorAll('input:checked').length;
      for (const input of box.querySelectorAll('input')) input.disabled = name !== 'levels' && checked >= 2 && !input.checked;
    };
    $('filters').append(box);
  }
  function table(parent,head,rows,sortable=false){
    const table=document.createElement('table');
    const header=table.createTHead().insertRow();
    for(const label of head){const th=document.createElement('th');th.textContent=label;header.append(th);}
    const body=table.createTBody();
    for(const row of rows){
      const tr=body.insertRow();
      for(const value of row){
        const td=tr.insertCell();
        if(value instanceof Node)td.append(value);else td.textContent=value??'—';
      }
    }
    if(sortable){
      const collator=new Intl.Collator('id',{numeric:true,sensitivity:'base'});
      [...header.cells].forEach((th,index)=>{
        const label=head[index];
        if(label==='Detail'||label==='Open LINK')return;
        const button=document.createElement('button');
        button.className='plain-sort';
        button.textContent=label+' ▲▼';
        th.replaceChildren(button);
        button.onclick=()=>{
          const descending=th.getAttribute('aria-sort')==='ascending';
          for(const cell of header.cells){
            cell.removeAttribute('aria-sort');
            if(cell.firstElementChild)cell.firstElementChild.textContent=head[cell.cellIndex]+' ▲▼';
          }
          th.setAttribute('aria-sort',descending?'descending':'ascending');
          button.textContent=label+(descending?' ↓':' ↑');
          const parse=text=>Number(text.replace('%','').replace(',','.'));
          const fragment=document.createDocumentFragment();
          if(body.rows[0]?.cells[0]?.colSpan>1)return;
          for(const row of [...body.rows].sort((a,b)=>{
            const left=a.cells[index].textContent,right=b.cells[index].textContent;
            if(left==='—'||right==='—')return Number(left==='—')-Number(right==='—');
            const l=parse(left),r=parse(right);
            return (descending?-1:1)*(Number.isFinite(l)&&Number.isFinite(r)?l-r:collator.compare(left,right));
          }))fragment.append(row);
          body.append(fragment);
        };
      });
      if(parent.id==='success'){
        const th=header.cells[head.indexOf('Trade mirip')];
        th.setAttribute('aria-sort','descending');
        th.firstElementChild.textContent='Trade mirip ↓';
      }
    }
    if(!body.rows.length&&rows.length===0){
      const cell=body.insertRow().insertCell();
      cell.colSpan=head.length;cell.textContent='Belum ada hasil.';
    }
    parent.replaceChildren(table);
    return body;
  }
  const tradeDialog=document.createElement('dialog');
  tradeDialog.className='trade-dialog';
  tradeDialog.setAttribute('aria-labelledby','trade-dialog-title');
  tradeDialog.innerHTML='<header><h2 id="trade-dialog-title"></h2><form method="dialog"><button>Tutup</button></form></header><div class="trade-dialog-scroll" tabindex="0"></div>';
  document.body.append(tradeDialog);
  function detailButton(title, getTrades){
    const button=document.createElement('button');
    button.type='button';
    button.textContent='Detail';
    button.onclick=()=>{
      const trades=getTrades();
      tradeDialog.querySelector('h2').textContent=title;
      const scroll=tradeDialog.querySelector('.trade-dialog-scroll');
      scroll.style.maxHeight='';
      if(trades.length){
        table(scroll,['Trade','Rincian'],trades.map((entries,i)=>{
          const list=document.createElement('div');
          for(const {name,row,flags} of entries){
            const block=document.createElement('div');
            block.className='trade-entry';
            const heading=document.createElement('strong');
            heading.textContent=name+' · '+row.symbol;
            const metrics=document.createElement('dl');
            fields.forEach((field,k)=>{
              const label=document.createElement('dt'),value=document.createElement('dd');
              label.textContent=labels[k];
              value.textContent=display(row,field)??'—';
              if(flags?.[k])value.className='duplicate-row-match';
              metrics.append(label,value);
            });
            block.append(heading,metrics);
            list.append(block);
          }
          return [i+1,list];
        }));
      }else scroll.textContent='Tidak ada trade yang tersimpan untuk analis ini.';
      tradeDialog.showModal();
      const eleventh=scroll.querySelector('tbody tr:nth-child(11)');
      if(eleventh)scroll.style.maxHeight=Math.min(scroll.clientHeight,eleventh.getBoundingClientRect().top-scroll.getBoundingClientRect().top)+'px';
      scroll.scrollTop=0;
    };
    return button;
  }
  const format = percent => percent.toLocaleString('id-ID',{maximumFractionDigits:2})+'%';
  const metadataHead=['Level','Medal','Losing Month','Score'];
  const summaryHead=['Nama Analis','Trade mirip','Kemiripan',...metadataHead,'Subscriber'];
  const metadata=analyst=>[analyst.level,analyst.medal,analyst.losing==null?null:analyst.losing+' / '+(analyst.denominator??'—'),analyst.browseScore];
  const fullMetadata=analyst=>[...metadata(analyst),analyst.subscribers];
  for(const [id,head] of [
    ['success',['Open LINK',...summaryHead,'Detail']],
    ['skip',[...summaryHead,'Detail','Reason']]
  ]){
    const body=table($(id),head,[],true);
    body.rows[0].cells[0].textContent='Memuat hasil scan…';
  }
  const detailHead=['Grup','Trade','Analis','Pair',...labels];
  let retrying=false;
  let retryRunner;
  let report, rendered, currentJob, monitorJob, shownCount=0, shownLogs='';
  function analystLink(analyst){
    const label=document.createTextNode(analyst.name);
    let url;
    try{url=new URL(analyst.url);}catch{return label;}
    if(url.origin!=='https://account.tradersfamily.id'||!/^\/channels\/\d+\/?$/.test(url.pathname))return label;
    const link=document.createElement('a');
    link.href=url.href;
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.style.color='inherit';
    link.append(label);
    return link;
  }
  function paintMonitor(job){
    $('scan-monitor').hidden=false;
    const total=job.inventoryCount||job.inventory?.length||0;
    const percent=total?Math.min(100,Math.floor(job.cursor*100/total)):0;
    const bar=$('scan-bar');
    bar.hidden=job.status!=='running';
    bar.previousElementSibling.hidden=bar.hidden;
    if(job.inventoryComplete){bar.max=Math.max(1,total);bar.value=total?job.cursor:Number(job.status==='complete');}
    else bar.removeAttribute('value');
    $('scan-percent').textContent=job.inventoryComplete?((!total&&job.status==='complete')?100:percent)+'%':'Memuat daftar…';
    if(monitorJob!==job.id||shownCount!==job.results.length){
      $('scan-analysts').replaceChildren();monitorJob=job.id;
    for(const analyst of job.results.slice(-200)){
      const row=$('scan-analysts').insertRow(0);
      row.insertCell().append(analystLink(analyst));
      for(const value of metadata(analyst))row.insertCell().textContent=value??'—';
      row.insertCell().textContent=analyst.rows.length;
    }
    shownCount=job.results.length;
    }
    const logs=job.logs||[];
    const signature=job.id+'|'+logs.join('\n');
    if(shownLogs!==signature){
      shownLogs=signature;
      const entries=logs.map(line=>{const item=document.createElement('li');item.textContent=line;return item;});
      const log=$('scan-events');
      log.replaceChildren(...entries);
      log.scrollTop=log.scrollHeight;
    }
  }
  async function render(job){
    if(!job?.filters?.duplicate)return;
    currentJob=job;
    $('json').disabled=job.status==='running';
    paintMonitor(job);TFMultiProgress.paintLevels(job);
    TFMultiProgress.paint(job);const filterLabel=document.getElementById('scan-filter-label');filterLabel.hidden=false;filterLabel.textContent='Level: '+(job.filters.levels?.join(', ')||'Semua')+' · Status: '+(job.filters.statuses?.join(', ')||'Semua');if(job.status==='running'&&job.progress){const active=job.progress;filterLabel.textContent+=active.inventoryLevels?' · Batch aktif: '+(active.inventoryLevels.join(' + ')||'Semua level'):active.level?' · Sedang dipindai: '+active.level+' / '+(active.status||'—'):'';}
    $('scan-status').textContent = `${job.status} · ${job.cursor} / ${job.inventoryCount||job.inventory.length} channel · ${job.progress?.name ? job.progress.name+' · ' : ''}${job.progress?.message||''} ${job.error||''}`;
    const active=['running','paused','error'].includes(job.status);
    $('configure').disabled=retrying;
    $('configure').textContent=active?(job.status==='running'?'Stop':'Batalkan'):'Scan Duplicate channel';
    $('configure').classList.toggle('stop',active);
    $('resume').disabled=!['paused','error','stopped'].includes(job.status);
    if((job.id+':'+job.status+':'+job.cursor)===rendered)return;
    const stats=[['Total card',job.inventoryComplete?(job.inventoryCount||job.inventory.length):'Memuat…'],['Diperiksa',job.cursor],['Lolos',job.status==='running'?'—':0],['Skip',job.status==='running'?'—':0],['Total Subscriber','—']];
    $('scan-stats').innerHTML=stats.map(([label,value])=>'<div class="stat"><small>'+label+'</small><b>'+value+'</b></div>').join('');
    const subscriberCard=$('scan-stats').lastElementChild.querySelector('b');
    const showSubscribers=cards=>{
      const counts=cards.map(card=>String(card.subscribers??'').trim()).filter(value=>/^\d+(?:[.,]\d{3})*$/.test(value));
      subscriberCard.textContent=counts.length?counts.reduce((sum,value)=>sum+Number(value.replace(/[.,]/g,'')),0).toLocaleString('id-ID'):'—';
    };
    showSubscribers(job.inventory?.length?job.inventory:[...job.results,...job.skipped]);
    if(!job.inventory?.length&&job.inventoryKey){
      chrome.storage.local.get(job.inventoryKey).then(data=>{
        if(subscriberCard.isConnected&&Array.isArray(data[job.inventoryKey]))showSubscribers(data[job.inventoryKey]);
      }).catch(()=>{});
    }
    if(job.status==='running')$('scan-loading').hidden=true;
    if(job.status==='running'||(job.id+':'+job.status+':'+job.cursor)===rendered)return;
    rendered=job.id+':'+job.status+':'+job.cursor;
    const retry=$('retry-timeouts');
    const pending=job.skipped.filter(item=>/Halaman analis tidak siap dalam \d+ detik|Halaman analis tidak ditemukan|Analis invalid\/Ganti Nama\/Suspend dari DOM/.test(item.reason));
    retry.hidden=!pending.length;
    retry.onclick=async()=>{
      if(retrying){await retryRunner?.interrupt('stopped');return;}
      if(retrying||['running','paused','error'].includes(currentJob.status))return;
      retrying=true;
      $('configure').disabled=true;
      retry.textContent='Stop';
      const progress=$('retry-progress');
      const count=$('retry-count');
      const duration=$('retry-duration');
      const started=performance.now();
      const paintDuration=()=>{
        const seconds=Math.floor((performance.now()-started)/1000);
        const parts=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60];
        duration.textContent='Durasi '+parts.map(value=>String(value).padStart(2,'0')).join(':');
      };
      progress.max=pending.length;
      progress.value=0;
      progress.hidden=false;
      count.textContent='0 / '+pending.length+' analis';
      paintDuration();
      const timer=setInterval(paintDuration,1000);
      retry.classList.add('stop');
      const runner=retryRunner=new TFEngine(()=>{},true);
      runner.running=true;
      runner.abort=new AbortController();
      const key='tfDuplicateJobV570';
      try{
        await navigator.locks.request('tf-multi-runner-v419',{ifAvailable:true},async lock=>{
          if(!lock)throw Error('Scan lain sedang berjalan.');
          for(const [index,item] of pending.entries()){
            if(runner.abort.signal.aborted)break;
            const latest=(await chrome.storage.local.get(key))[key];
            if(latest?.id!==job.id)break;

            const log=async message=>{
              const state=(await chrome.storage.local.get(key))[key];
              if(state?.id!==job.id)return;
              state.logs=[...(state.logs||[]),new Date().toLocaleTimeString('id-ID')+' '+message].slice(-300);
              await chrome.storage.local.set({[key]:state});
              currentJob=state;
              paintMonitor(state);
            };
            await log('Cek ulang '+item.name+' ('+(index+1)+'/'+pending.length+')');
            if(runner.abort.signal.aborted)break;
            try{const reason=await runner.retryDuplicate(latest,item);await log(item.name+' · '+(reason||'cek ulang selesai'));}
            catch(err){if(!runner.abort.signal.aborted)await log(item.name+' · '+err.message);}
            if(runner.abort.signal.aborted){await log('Cek ulang dihentikan.');break;}
            progress.value=index+1;
            count.textContent=(index+1)+' / '+pending.length+' analis';
          }
        });
      }catch(err){error(err);}
      finally{clearInterval(timer);paintDuration();progress.hidden=true;runner.running=false;retryRunner=null;retrying=false;retry.classList.remove('stop');retry.disabled=false;retry.textContent='Cek ulang';rendered=null;await render(currentJob);}
    };
    const channels=job.results;
    const renderKey=rendered;
    $('scan-loading').hidden=false;
    $('scan-loading').querySelector('span').textContent='Menghitung kemiripan trade…';
    $('scan-status').textContent+=' · Menghitung kemiripan…';
    for(const id of ['success','skip']){
      const cell=$(id).querySelector('tbody td[colspan]');
      if(cell)cell.textContent='Sedang menghitung hasil…';
    }
    let groups,totalGroups,found,closest;
    let worker;
    try{
      worker=new Worker('duplicate-worker.js');
      ({groups,totalGroups,found,closest}=await new Promise((resolve,reject)=>{
        worker.onmessage=event=>event.data.error?reject(Error(event.data.error)):resolve(event.data);
        worker.onerror=event=>reject(Error(event.message));
        worker.postMessage(channels);
      }));
    }catch(err){rendered=null;error(err);$('scan-loading').hidden=true;for(const id of ['success','skip']){const cell=$(id).querySelector('tbody td[colspan]');if(cell)cell.textContent='Gagal menghitung hasil.';}return;}finally{worker?.terminate();}
    if(rendered!==renderKey)return;
    $('scan-status').textContent=$('scan-status').textContent.replace(' · Menghitung kemiripan…','');
    const skips=[...job.skipped,...channels.flatMap((channel,i)=>found.has(i)?[]:[{...channel,closest:closest.get(i),reason:channel.rows.length?'Tidak ditemukan duplikat':'Tidak ada History yang dapat dibandingkan'}])];
    const cards=$('scan-stats').querySelectorAll('b');
    cards[2].textContent=found.size;
    cards[3].textContent=skips.length;
    await new Promise(resolve=>setTimeout(resolve,0));
    if(rendered!==renderKey)return;
    const levels=['newbie','rookie','pro','elite','master','legend'];
    const compareReviewChannels=(a,b)=>{
      const rank=channel=>levels.indexOf(String(channel.level||'').trim().toLowerCase());
      const score=channel=>Number.parseFloat(String(channel.browseScore??'').replace(',','.'));
      return rank(b)-rank(a)||score(b)-score(a)||0;
    };

    groups=groups.map(group=>{
      const order=group.ids.map((_,index)=>index);
      order.sort((left,right)=>compareReviewChannels(channels[group.ids[left]],channels[group.ids[right]]));
      return {
        ...group,
        ids:order.map(index=>group.ids[index]),
        names:order.map(index=>group.names[index]),
        matches:group.matches.map(match=>({
          ...match,
          entries:order.map(index=>match.entries[index]),
          flags:order.map(index=>match.flags[index])
        }))
      };
    });
    const summaries=[];
    for(const group of groups){
      const names=group.names.join(' / ');
      const values=group.ids.map(id=>fullMetadata(channels[id]));
      summaries.push([names,group.matches.length,format(group.percent),...summaryHead.slice(3).map((_,i)=>values.map(row=>row[i]??'—').join(' / '))]);
      /* Trade detail is rendered only when requested. */
    }
    const tradesFor=group=>group.matches.map(match=>match.entries.map((row,j)=>{
        const name=group.names[j],flags=match.flags[j];
        return {name,row,flags};
      }));

    const visibleGroups=groups.slice(0,500);
    const body=table($('success'),['Open LINK',...summaryHead,'Detail'],summaries.slice(0,visibleGroups.length).map((row,i)=>{
      const names=document.createElement('span');
      groups[i].ids.forEach((id,index)=>{
        if(index)names.append(' / ');
        names.append(analystLink(channels[id]));
      });
      const check=document.createElement('button');
      check.textContent='Check';
      check.onclick=async()=>{
        check.disabled=true;
        try{
          const links=[...names.querySelectorAll('a')];
          for(const [index,link] of links.entries())await chrome.tabs.create({url:link.href,active:index===links.length-1});
        }catch(err){error(err);}finally{check.disabled=false;}
      };
      return [check,names,...row.slice(1),detailButton(row[0],()=>tradesFor(groups[i]))];
    }),true);
    const reportSelect=$('report-select');
    reportSelect.disabled=!visibleGroups.length;
    reportSelect.onclick=()=>{
      const dialog=document.createElement('dialog');
      dialog.className='trade-dialog report-selection';
      dialog.setAttribute('aria-label','Report Massal');
      dialog.innerHTML='<header><h2>Report Massal!</h2><button type="button">Tutup</button></header><div class="trade-dialog-scroll"></div><form method="dialog" class="actions"><button value="cancel">Cancel</button><button type="button" value="confirm" disabled>Confirm</button></form>';
      const progress=document.createElement('progress');
      progress.hidden=true;
      const message=document.createElement('span');
      message.setAttribute('role','status');
      dialog.querySelector('form').before(progress,message);
      const checks=[];
      const master=document.createElement('input');
      master.type='checkbox';
      master.title='Centang atau kosongkan semua';
      master.setAttribute('aria-label','Centang atau kosongkan semua');
      const confirm=dialog.querySelector('[value="confirm"]');
      const refresh=()=>{
        const count=checks.filter(check=>check.checked).length;
        master.checked=count===checks.length;
        master.indeterminate=count>0&&count<checks.length;
        confirm.disabled=count===0;
      };
      const ordered=[...visibleGroups].sort((a,b)=>b.matches.length-a.matches.length||b.percent-a.percent);
      table(dialog.querySelector('.trade-dialog-scroll'),['Checkbox','Nama Analis','Trade Mirip','Kemiripan','Detail'],ordered.map(group=>{
        const name=group.names.join(' / ');
        const check=document.createElement('input');
        check.type='checkbox';
        check.setAttribute('aria-label',name);
        check.onchange=refresh;
        checks.push(check);
        return [check,name,group.matches.length,format(group.percent),detailButton(name,()=>tradesFor(group))];
      }));
      dialog.querySelector('thead th').replaceChildren(master);
      master.onchange=()=>{checks.forEach(check=>{check.checked=master.checked;});refresh();};
      dialog.querySelector('header button').onclick=()=>dialog.close();
      confirm.addEventListener('click',async ()=>{
        const selected=ordered.filter((_,index)=>checks[index].checked);
        if(!selected.length||confirm.disabled)return;
        confirm.disabled=true;
        const formPermission=chrome.permissions.request({origins:['https://docs.google.com/*']}).catch(()=>false);
        const startReport=reportSelect.onclick;
        let stopRequested=false;
        let activeRow='saat menyiapkan antrean';
        let stopLog;
        const logReport=async detail=>{
          const jobKey='tfDuplicateJobV570';
          const state=(await chrome.storage.local.get(jobKey))[jobKey];
          if(state?.id!==job.id)return;
          state.logs=[...(state.logs||[]),new Date().toLocaleTimeString('id-ID')+' Report Massal · '+detail].slice(-300);
          await chrome.storage.local.set({[jobKey]:state});
          currentJob=state;
          paintMonitor(state);
        };
        const controls=document.createElement('div');
        controls.className='retry-controls';
        const previousControls=reportSelect.closest('.retry-controls');
        const anchor=previousControls||reportSelect;
        anchor.before(controls);
        controls.append(reportSelect,progress,message);
        previousControls?.remove();
        reportSelect.textContent='Stop!';
        reportSelect.classList.add('stop');
        reportSelect.onclick=()=>{
          stopRequested=true;
          reportSelect.disabled=true;
          message.textContent='Menghentikan antrean · '+activeRow;
          stopLog=logReport('Stop diminta · '+activeRow).catch(()=>{});
        };
        progress.max=selected.length;
        progress.value=0;
        progress.hidden=false;
        message.textContent='Menyiapkan antrean… 0 / '+selected.length;
        try{
          dialog.close('confirm');
          const review=document.createElement('dialog');
          review.className='trade-dialog';
          review.innerHTML='<header><h2>Tinjau pasangan</h2><form method="dialog"><button>Tutup</button></form></header><p><label>Pasangan <select></select></label></p><p><label>Peran <select><option value="">Pilih arah dugaan</option><option value="0">Channel pertama diduga diduplikasi</option><option value="1">Channel kedua diduga diduplikasi</option></select></label></p><textarea readonly rows="12" style="width:100%" aria-label="Draf laporan"></textarea><div class="actions"><button type="button">Salin draf</button><button type="button" data-fill disabled>Isi formulir</button><span role="status"></span></div>';
          const [pairSelect,role]=review.querySelectorAll('select');
          const draft=review.querySelector('textarea');
          const copy=review.querySelector('.actions button');
          const fill=review.querySelector('[data-fill]');
          const status=review.querySelector('[role="status"]');
          let fields;
          const fillForm=async permission=>{
            const values=fields;
            if(!values)return;
            fill.disabled=true;
            let target;
            try{
              if(!await permission)throw Error('Izin membuka Google Forms belum diberikan.');
              const path='/forms/d/e/1FAIpQLSdq1azlDrEYcADtRX_aYoHto_-wKGxJetZePQ0b6m_BRD4wxw/';
              target=await chrome.tabs.create({url:'https://docs.google.com'+path+'viewform',active:false});
              let nextClickedAt=0;
              const activateAfter=Date.now()+3000;
              let activated=false;
              for(let attempt=0;attempt<90&&!stopRequested;attempt++){
                if(!activated&&Date.now()>=activateAfter){
                  await chrome.tabs.update(target.id,{active:true});
                  activated=true;
                }
                const current=await chrome.tabs.get(target.id);
                if(current.url?.startsWith('https://accounts.google.com/'))throw Error('Wajib login Google terlebih dahulu di tab formulir.');
                if(current.url?.startsWith('https://docs.google.com'+path)){
                  const [packet]=await chrome.scripting.executeScript({target:{tabId:target.id},args:[path,values,Date.now()-nextClickedAt>=4000],func:(path,values,allowNext)=>{
                    if(location.origin!=='https://docs.google.com'||!location.pathname.startsWith(path))return 'wait';
                    if([...document.links].some(link=>link.hostname==='accounts.google.com'&&/^(login ke google|sign in)$/i.test(link.textContent.trim())))return 'login';
                    const visible=node=>node.getClientRects().length>0;
                    const list=[...document.querySelectorAll('[role="listitem"]')].filter(visible);
                    const questions=[/^Nama Channel Yang Diduplikasi/i,/^Nama Channel Yang Menduplikasi/i,/^Mengapa PT Traders Family/i];
                    const fields=questions.map(question=>list.find(item=>question.test(item.textContent.trim().replace(/\s+/g," ")))?.querySelector('input[type="text"], textarea'));
                    if(fields.every(field=>field&&visible(field))){
                      fields.forEach((field,index)=>{
                        const prototype=field.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
                        Object.getOwnPropertyDescriptor(prototype,'value').set.call(field,values[index]);
                        field.dispatchEvent(new Event('input',{bubbles:true}));
                        field.dispatchEvent(new Event('change',{bubbles:true}));
                      });
                      return fields.every((field,index)=>field.value===values[index])?'filled':'wait';
                    }
                    if(allowNext){
                      const question=list.find(item=>/Apakah Anda bersedia kami hubungi/i.test(item.textContent));
                      const no=[...(question?.querySelectorAll('[role="radio"]')||[])].find(item=>(item.getAttribute('aria-label')||item.getAttribute('data-value')||item.textContent).trim()==='Tidak');
                      const next=[...document.querySelectorAll('[role="button"],button')].find(item=>visible(item)&&/^(Next|Berikutnya)$/i.test(item.textContent.trim()));
                      if(no&&next){
                        if(no.getAttribute('aria-checked')!=='true'){no.click();return 'wait';}
                        next.click();return 'next';
                      }
                    }
                    return 'wait';
                  }}).catch(()=>[]);
                  if(packet?.result==='login')throw Error('Wajib login Google terlebih dahulu di tab formulir.');
                  if(packet?.result==='filled')return target.id;
                  if(packet?.result==='next')nextClickedAt=Date.now();
                }
                await new Promise(resolve=>setTimeout(resolve,250));
              }
              if(stopRequested){await chrome.tabs.remove(target.id).catch(()=>{});return;}
              await chrome.tabs.remove(target.id).catch(()=>{});
              return null;
            }catch(err){if(target)await chrome.tabs.remove(target.id).catch(()=>{});throw err;}
            finally{fill.disabled=!fields;}
          };
          fill.onclick=()=>fillForm(chrome.permissions.request({origins:['https://docs.google.com/*']}));
          const pairs=new Map();
          for(const group of selected){
            const rowNumber=ordered.indexOf(group)+1;
            const entries=tradesFor(group);
            for(let i=0;i<group.ids.length;i++){
              for(let j=i+1;j<group.ids.length;j++){
                const ids=[group.ids[i],group.ids[j]];
                const key=JSON.stringify([...ids].sort());
                const samples=ids.map(id=>channels[id].rows.length);
                const matches=entries.map(match=>[match[i],match[j]]).filter(pair=>pair.every(Boolean));
                const current=pairs.get(key);
                if(!current||matches.length>current.matches.length)pairs.set(key,{ids,samples,matches,rowNumber:current?.rowNumber??rowNumber});
              }
            }
          }
          for(const [key,pair] of pairs){
            pairSelect.add(new Option(pair.ids.map(id=>channels[id].name).join(' / '),key));
          }
          const paint=()=>{
            const pair=pairs.get(pairSelect.value);
            if(!pair||role.value===''){fields=null;draft.value='';copy.disabled=fill.disabled=true;return;}
            const names=pair.ids.map(id=>channels[id].name);
            const original=Number(role.value);
            const count=pair.matches.length;
            const total=Math.max(...pair.samples);
            const score=total?format(count/total*100):'—';
            const lines=[
              'Nama Channel Yang Diduplikasi: '+names[original],
              'Nama Channel Yang Menduplikasi: '+names[1-original],
              '',
              'Mohon tinjau dugaan kemiripan sinyal ini.',
              'Bukti pada hasil yang dipilih: '+count+' kecocokan / '+total+' trade ('+score+').',
              'Ukuran sampel: '+names.map((name,index)=>name+' '+pair.samples[index]+' trade').join(' | '),
              ...pair.matches.flatMap((match,index)=>[
                '', '--------Trade '+(index+1)+' -------',
                ...match.flatMap(({name,row})=>[
                  '', name+' · '+(row.symbol||'—'),
                  'Created At: '+(row.created_at_wib||'—'),
                  'Opened At: '+(row.opened_at_wib||'—'),
                  'Closed At: '+(row.closed_at_wib||'—'),
                  'Pips: '+(row.result||'—'),
                  'TP/SL: '+((parseFloat(row.result)>0?'TP':parseFloat(row.result)<0?'SL':'—')||'—'),
                  'Type: '+(row.type||'—')
                ])
              ])
            ];
            draft.value=lines.join('\n');
            fields=[names[original],names[1-original],lines.slice(3).join('\n')];
            copy.disabled=fill.disabled=false;
          };
          pairSelect.onchange=()=>{role.value='';paint();};
          role.onchange=paint;
          copy.onclick=async()=>{
            try{await navigator.clipboard.writeText(draft.value);copy.textContent='Draf disalin';}
            catch{draft.select();}
          };
          review.addEventListener('close',()=>review.remove(),{once:true});
          document.body.append(review);
          const keys=[...pairs.keys()];
          if(!keys.length)throw Error('Tidak ada pasangan yang dapat diisi.');
          let sent=0;
          progress.max=keys.length;
          progress.value=0;
          for(const key of keys){
            if(stopRequested)break;
            pairSelect.value=key;
            const pair=pairs.get(key);
            activeRow='baris '+pair.rowNumber+' · '+pair.ids.map(id=>channels[id].name).join(' / ');
            await logReport('Memproses '+activeRow).catch(()=>{});
            if(stopRequested)break;
            role.value=compareReviewChannels(channels[pair.ids[0]],channels[pair.ids[1]])<=0?'0':'1';
            paint();
            message.textContent='Membuka formulir '+(sent+1)+' / '+keys.length+'…';
            let tabId=await fillForm(formPermission);
            let attempt=1;
            while(!tabId&&!stopRequested){
              attempt++;
              message.textContent='Mencoba ulang '+activeRow+' · percobaan '+attempt;
              await logReport(message.textContent).catch(()=>{});
              await new Promise(resolve=>setTimeout(resolve,2000));
              if(!stopRequested)tabId=await fillForm(formPermission);
            }
            if(!tabId)break;
            if(stopRequested){await chrome.tabs.remove(tabId).catch(()=>{});break;}
            message.textContent='Mengirim laporan '+(sent+1)+' / '+keys.length+'…';
            const [submission]=await chrome.scripting.executeScript({target:{tabId},args:[fields],func:expected=>{
              const path='/forms/d/e/1FAIpQLSdq1azlDrEYcADtRX_aYoHto_-wKGxJetZePQ0b6m_BRD4wxw/';
              if(location.origin!=='https://docs.google.com'||!location.pathname.startsWith(path))return false;
              const visible=node=>node.getClientRects().length>0;
              const inputs=[...document.querySelectorAll('[role="listitem"] input[type="text"], [role="listitem"] textarea')].filter(visible);
              if(inputs.length!==expected.length||!inputs.every((input,index)=>input.value===expected[index]))return false;
              const buttons=[...document.querySelectorAll('[role="button"],button')].filter(button=>
                visible(button)&&!button.disabled&&button.getAttribute('aria-disabled')!=='true'&&
                /^(Submit|Kirim)$/i.test(button.textContent.trim()));
              if(buttons.length!==1)return false;
              buttons[0].click();
              return true;
            }});
            if(!submission?.result)throw Error('Submit tidak dijalankan karena tombol atau isian formulir tidak cocok.');
            const confirmationDeadline=Date.now()+60000;
            for(;;){
              if(Date.now()>=confirmationDeadline)throw Error('Google Forms belum mengonfirmasi pengiriman. Antrean dihentikan agar laporan tidak terkirim dua kali.');
              await new Promise(resolve=>setTimeout(resolve,300));
              const current=await chrome.tabs.get(tabId).catch(()=>null);
              if(!current)throw Error('Tab formulir ditutup. '+sent+' / '+keys.length+' laporan terkonfirmasi.');
              if(!current.url?.startsWith('https://docs.google.com/forms/'))continue;
              const [packet]=await chrome.scripting.executeScript({target:{tabId},func:()=>{
                const main=document.querySelector('[role="main"]')||document.body;
                return /your response has been recorded|(?:respons|tanggapan) anda telah (?:direkam|dicatat|direkam oleh)/i.test(main.innerText);
              }}).catch(()=>[]);
              if(packet?.result)break;
            }
            progress.value=++sent;
            await chrome.tabs.remove(tabId).catch(()=>{});
            await stopLog;
            await logReport('Terkonfirmasi · '+activeRow).catch(()=>{});
            message.textContent=sent+' / '+keys.length+' laporan terkonfirmasi.';
          }
          review.remove();
          if(stopRequested){
            await stopLog;
            message.textContent='Dihentikan · '+activeRow+' · '+sent+' / '+keys.length+' laporan terkonfirmasi.';
            await logReport(message.textContent).catch(()=>{});
          }
        }catch(err){message.textContent='Antrean berhenti · '+activeRow+' · '+(err.message||err);await logReport(message.textContent).catch(()=>{});refresh();}
        finally{
          progress.hidden=true;
          reportSelect.onclick=startReport;
          reportSelect.textContent='Report Massal!';
          reportSelect.classList.remove('stop');
          reportSelect.disabled=false;
        }
      });
      dialog.addEventListener('close',()=>dialog.remove(),{once:true});
      document.body.append(dialog);
      dialog.showModal();
    };
    visibleGroups.forEach((group,i)=>{
      const color=group.percent>=70?'duplicate-row-match':'duplicate-warning';
      body.rows[i].cells[1].className=color;
      body.rows[i].cells[3].className=color;
    });
    table($('skip'),[...summaryHead,'Detail','Reason'],skips.slice(0,500).map(item=>{
      const detail=detailButton(item.name,()=>(item.rows||[]).map(row=>[{name:item.name,row}]));
      const reason=item.closest ? item.reason+' · Terdekat: '+item.closest.name : item.reason;
      return [analystLink(item),item.closest?.count,item.closest?format(item.closest.percent):null,...fullMetadata(item),detail,reason];
    }),true);
    const colored=summaries.map(([name,count,percent,...values],i)=>{const style=groups[i].percent>=70?2:3;return [{text:name,style},count,{text:percent,style},...values];});
    report={summaries:colored,groups,tradesFor,skips,filters:[['Level',job.filters.levels.join(', ')||'Semua'],['Status',job.filters.statuses.join(', ')||'Semua'],['Maks. trade',job.filters.maxTrades??'Batas versi saat scan'],['Sumber History',job.filters.historySource==='page'?'Daftar bawaan History Signal':job.ranges[0].start+' – '+job.asOf]]};
    for(const [id,count] of [['success',totalGroups],['skip',skips.length]]){

      const container=document.getElementById(id);
      let search=document.getElementById(id+'-search');
      if(!search){
        search=document.createElement('input');
        search.id=id+'-search';
        search.type='search';
        search.placeholder='Cari teks atau angka';
        search.setAttribute('aria-label','Cari di tabel '+id);
        search.style.cssText='margin-left:auto;flex:0 1 320px;min-width:min(150px,100%);max-width:100%;padding:8px 10px;border:1px solid #39465c;border-radius:8px;background:#101827;color:inherit';
        const button=document.getElementById(id==='success'?'report-select':'retry-timeouts');
        const controls=button.closest('.retry-controls')||button;
        const toolbar=document.createElement('div');
        toolbar.style.cssText='display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px 12px;margin-bottom:8px';
        controls.before(toolbar);
        toolbar.append(controls,search);
      }
      search.oninput=()=>{
        const normalize=value=>value.toLocaleLowerCase('id').replace(/(\d)[,.](?=\d)/g,'$1.');
        const query=normalize(search.value.trim());
        for(const row of container.querySelectorAll('tbody tr')){
          for(const mark of row.querySelectorAll('mark[data-search-match]')){
            const parent=mark.parentNode;
            mark.replaceWith(document.createTextNode(mark.textContent));
            parent.normalize();
          }
          let matched=false;
          if(query){
            for(const cell of row.cells){
              if(!normalize(cell.textContent).includes(query))continue;
              matched=true;
              const walker=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT);
              const nodes=[];
              while(walker.nextNode())nodes.push(walker.currentNode);
              for(const node of nodes){
                const value=node.data;
                const searchable=normalize(value);
                if(searchable.length!==value.length)continue;
                let index=searchable.indexOf(query);
                if(index<0)continue;
                const fragment=document.createDocumentFragment();
                let cursor=0;
                while(index>=0){
                  fragment.append(value.slice(cursor,index));
                  const mark=document.createElement('mark');
                  mark.dataset.searchMatch='';
                  mark.style.cssText='background:#facc15;color:#1a1400;border-radius:2px';
                  cursor=index+query.length;
                  mark.textContent=value.slice(index,cursor);
                  fragment.append(mark);
                  index=searchable.indexOf(query,cursor);
                }
                fragment.append(value.slice(cursor));
                node.replaceWith(fragment);
              }
            }
          }
          row.hidden=Boolean(query)&&!matched;
        }
        container.scrollTop=0;
      };
      search.oninput();
      document.getElementById(id+'-limit-notice')?.remove();
      if(count<=500)continue;
      const note=document.createElement('p');
      note.id=id+'-limit-notice';
      note.className='notice';
      note.textContent='Menampilkan 500 dari '+count+' hasil.';
      document.getElementById(id).before(note);
    }
    $('scan-loading').hidden=true;
    $('excel').disabled=$('pdf').disabled=false;
  }
  const engine=new TFEngine(render,true);
  const error=err=>{$('scan-monitor').hidden=false;$('scan-status').textContent=err.message;$('configure').disabled=false;};
  $('configure').onclick=async()=>{
    try{
      if(['running','paused','error'].includes(currentJob?.status)){
        await chrome.runtime.sendMessage({type:'TF_MULTI_CONTROL',duplicate:true,source:'duplicate-dashboard',action:'stop',jobId:currentJob.id});
      }else{settings.returnValue='';settings.showModal();}
    }catch(err){error(err);}
  };
  settings.addEventListener('cancel',()=>{settings.returnValue='cancel';});
  settings.addEventListener('close',()=>{
    if(settings.returnValue!=='confirm')return;
    const form=new FormData(settings.querySelector('form'));
    rendered=null;
    $('configure').disabled=true;
    $('excel').disabled=$('pdf').disabled=true;
    $('success').replaceChildren();$('skip').replaceChildren();
    const maxTrades=Number(form.get('maxTrades'));
    if(!Number.isSafeInteger(maxTrades)||maxTrades<1){error(Error('Maks. trade harus angka bulat positif.'));return;}
    engine.start({duplicate:true,maxTrades,levels:form.getAll('levels'),statuses:form.getAll('statuses'),historyMonths:3,summary:12,sort:'medal',pair:'ALL',maxLoss:''}).catch(error);
  });
  $('resume').onclick=()=>engine.resume(currentJob).catch(error);
  $('json').onclick=async()=>{
    try{
      const {exportParts}=await import(chrome.runtime.getURL('assets/tf-multi-evidence-export.js'));
      const parts=await exportParts(currentJob);
      TFExport.download(new Blob(['{"schema":"tf-multi-link-results-v1","job":',...parts,'}'],{type:'application/json'}),'tf-scan-duplicate-hasil.json','application/json');
    }catch(err){error(err);}
  };
  $('excel').onclick=()=>{
    const details=report.groups.flatMap(group=>report.tradesFor(group).flatMap((entries,i)=>entries.map(({name,row,flags})=>[group.names.join(' / '),i+1,name,row.symbol,...fields.map((field,k)=>flags[k]?{text:display(row,field),style:2}:display(row,field))])));
    const rows=[summaryHead,...report.summaries,[],detailHead,...details];
    TFExport.download(TFExport.xlsx(rows,report.skips,report.filters,rows),'tf-duplicate-channel.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };
  let printDetails=[];
  addEventListener('beforeprint',()=>{printDetails=[...document.querySelectorAll('details:not([open])')];printDetails.forEach(d=>d.open=true);});
  addEventListener('afterprint',()=>printDetails.forEach(d=>d.open=false));
  $('pdf').onclick=()=>window.print();
  chrome.storage.onChanged.addListener((changes,area)=>{
    if(area!=='local')return;
    const update=changes.tfDuplicateJobV570?.newValue;
    if(changes.tfDuplicateJobV570&&!update&&!engine.running){location.reload();return;}
    if(update&&!engine.running&&!retrying)render(update);
    const progress=changes.tfMultiProgressV457?.newValue;
    if(!engine.running&&progress&&progress.jobId===currentJob?.id)render({...currentJob,...progress});
    const command=changes.tfMultiCommandV419?.newValue;
    if(!command||command.jobId!==currentJob?.id)return;
    if(command.action==='stop'||command.action==='pause')engine.interrupt(command.action==='stop'?'stopped':'paused',command).catch(error);
    if(command.action==='resume'&&!engine.running)engine.resume(currentJob).catch(error);
  });
  addEventListener('pagehide',()=>{
    if(engine.running)chrome.runtime.sendMessage({type:'TF_MULTI_RECOVER',jobId:currentJob?.id});
  });
  chrome.storage.local.get(['tfDuplicateJobV570','tfMultiJobV419']).then(async state=>{
    let job=state.tfDuplicateJobV570;
    if(!job&&state.tfMultiJobV419?.filters?.duplicate){
      job=state.tfMultiJobV419;
      await chrome.storage.local.set({tfDuplicateJobV570:job});
      await chrome.storage.local.remove('tfMultiJobV419');
    }
    const request=new URLSearchParams(location.hash.slice(1));
    if(request.has('maxTrades')){
      history.replaceState(null,'',location.pathname+location.search);
      for(const input of settings.querySelectorAll('input[type=checkbox]')) input.checked=request.getAll(input.name).includes(input.value);
      settings.querySelector('[name=maxTrades]').value=request.get('maxTrades');
      settings.showModal();
      settings.querySelector('button[value=confirm]').click();
      return;
    }
    if(job?.filters?.duplicate&&job.status==='running')engine.resume(job).catch(error);
    if(job?.filters?.duplicate){await render(job);}
    else { $('scan-loading').hidden=true;for(const id of ['success','skip'])$(id).querySelector('tbody td').textContent='Belum ada hasil.'; }
    if(new URLSearchParams(location.search).has('configure')&&!['running','paused','error'].includes(job?.status))settings.showModal();
  }).catch(err=>{error(err);$('scan-loading').hidden=true;});
})();
