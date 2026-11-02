/* Executes only against the explicitly queued TradersFamily channel. */
(() => {
  if(globalThis.TFPostDOM)return;
  const text=e=>(e?.innerText||e?.textContent||'').replace(/\s+/g,' ').trim();
  function visible(e){if(!e||!e.getClientRects().length)return false;for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden')return false;}return true;}
  const all=s=>[...document.querySelectorAll(s)];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function gate(){let pausedAt=null;for(;;){const {postControl}=await chrome.storage.local.get('postControl');if(postControl?.stop)throw Error('Dihentikan pengguna.');if(!postControl?.paused)return pausedAt===null?0:Date.now()-pausedAt;if(pausedAt===null)pausedAt=Date.now();await sleep(350);}}
  async function waitFor(fn,label,timeout=35000){let deadline=Date.now()+timeout;while(Date.now()<deadline){deadline+=await gate();const value=fn();if(value)return value;if(/\/login|\/auth/.test(location.pathname))throw Error('Silakan login TradersFamily di Chrome dahulu.');await sleep(350);}throw Error(`Waktu tunggu habis: ${label}. Coba ulang setelah halaman selesai dimuat.`);}
  async function settle(rootSelector){let prior='',count=0;await sleep(800);for(let i=0;i<70;i++){
    await gate();const root=document.querySelector(rootSelector);const busy=all('.overlay,.wait_overview,.wait_histscor').some(e=>visible(e)&&root?.contains(e)&&/FETCHING|LOADING/i.test(text(e)));
    const fp=root?text(root)+'|'+[...root.querySelectorAll('svg path[d]')].slice(0,8).map(e=>e.getAttribute('d')).join(''):'';
    if(fp&&fp===prior&&!busy)count++;else count=0;prior=fp;if(count>=3)return;await sleep(400);
  }throw Error('Konten masih berubah / belum selesai dimuat.');}
  function click(selector,label){const e=all(selector).find(visible);if(!e)throw Error(`Elemen ${label||selector} tidak ditemukan.`);if(!e.disabled)e.click();return e;}
  function metrics(root){return all(root+' .box-summary-container .description-block').map(e=>({label:text(e.querySelector('span.text-transform-uppercase')),value:text(e.querySelector('.description-header'))})).filter(x=>x.label);}
  function statisticsButton(){return all('#tab_statistic a').find(e=>visible(e)&&/View Details/i.test(text(e)));}
  function recentMonths(){
    const cards=all('#tab_statistic .data-detail-signal .detail-signal').filter(visible);
    if(cards.length)return cards.map(e=>{
      const values=[...e.querySelectorAll('.custom-month-year')];
      return {month:text(e.querySelector('.text-cstom-pips')||values[0]),pips:text(values[1]),signals:text([...e.querySelectorAll('span')].find(s=>/\bSignals?\b/i.test(text(s)))),text:text(e)};
    }).filter(m=>m.month);
    return all('#tab_statistic .data-detail-signal h4').filter(visible).map(e=>({month:text(e),text:text(e.parentElement)}));
  }
  function renderedChart(){
    const roots=all('#summaryChart,#channel-growth .apexcharts-canvas');
    for(const root of roots){if(!visible(root)||root.getBoundingClientRect().width<40)continue;
      const path=[...root.querySelectorAll('svg path.apexcharts-line,svg .apexcharts-series path[d]')].find(e=>{
        const d=e.getAttribute('d')||'';return d.length>10&&!/NaN|Infinity/.test(d)&&visible(e);
      });if(path)return path;
    }return null;
  }
  async function growthReady(){
    const chartRoot=await waitFor(()=>all('#summaryChart,#channel-growth').find(visible),'area grafik pertumbuhan');
    chartRoot.scrollIntoView({block:'center',behavior:'instant'});
    window.dispatchEvent(new Event('resize'));
    let chart;
    try{chart=await waitFor(renderedChart,'render grafik pertumbuhan',12000);}
    catch(e){
      if(/Dihentikan|login/i.test(e.message))throw e;
      // A filter/tab change can replace the entire chart after the first resize.
      const summary=all('a[href="#tab_summary"]').find(visible);if(summary&&!visible(document.querySelector('#tab_summary')))summary.click();
      all('#summaryChart,#channel-growth').find(visible)?.scrollIntoView({block:'center',behavior:'instant'});
      window.dispatchEvent(new Event('resize'));
      try{chart=await waitFor(renderedChart,'pemulihan grafik pertumbuhan',10000);}catch(error){
        if(/Dihentikan|login/i.test(error.message))throw error;
        throw Error('Grafik Growth belum dirender oleh situs. Pastikan tab kerja analis tetap aktif, lalu ulangi link ini.');
      }
    }
    await settle('#channel-growth');return await waitFor(renderedChart,'grafik setelah render stabil',5000);
  }
  async function screenshot(selector){const node=all(selector).find(visible);if(!node)return null;if(!globalThis.html2canvas)throw Error('Pustaka gambar DOM belum dimuat.');
    await document.fonts.ready;await gate();const canvas=await html2canvas(node,{backgroundColor:null,scale:2,useCORS:true,allowTaint:false,logging:false,imageTimeout:12000,ignoreElements:e=>e.classList?.contains('apexcharts-tooltip')||e.tagName==='IFRAME',onclone:doc=>{
      // Theme only the capture clone. The source website and graph data stay intact.
      const chart=doc.querySelector(selector);if(!chart)return;
      for(const el of [chart,...chart.querySelectorAll('*')]){
        el.style.setProperty('background','transparent','important');el.style.setProperty('box-shadow','none','important');el.style.setProperty('color','#ded2f2','important');
      }
      for(const el of chart.querySelectorAll('svg text,svg tspan')){el.style.setProperty('fill','#e4d9f3','important');el.style.setProperty('font-weight','600','important');}
      for(const el of chart.querySelectorAll('.apexcharts-gridline,.apexcharts-xaxis-tick,.apexcharts-xaxis line,.apexcharts-yaxis line'))el.style.setProperty('stroke','rgba(192,165,227,0.18)','important');
    }});
    if(canvas.width<10||canvas.height<10)throw Error('Area gambar grafik kosong.');return {data:canvas.toDataURL('image/png'),width:canvas.width,height:canvas.height,theme:'purple-glass'};
  }
  async function run(action,args={}){
    await gate();
    if(action==='browseMetadata'){
      const id=String(args.channelId||'');if(!/^\d+$/.test(id))throw Error('ID analis tidak valid.');
      await waitFor(()=>document.querySelector('#ichannel')&&document.querySelector('#kolomcari'),'pencarian Browse');
      const period=document.querySelector('#dataSummaryChannel');if(period&&period.value!=='12'){period.value='12';period.dispatchEvent(new Event('change',{bubbles:true}));await settle('#channel-content-container');}
      const input=document.querySelector('#ichannel');input.value=String(args.name||'');input.dispatchEvent(new Event('input',{bubbles:true}));click('#kolomcari','Search Channel');
      function read(){
        const a=all('#channel-content-container a[href]').find(e=>{try{return new URL(e.href,location.href).pathname.replace(/\/$/,'')==='/channels/'+id;}catch{return false;}});
        const card=a?.closest('.box-header');if(!card)return null;
        const line=[...card.querySelectorAll('.summary-row')].find(e=>/^Losing\s*Month$/i.test(text(e.querySelector('.summary-label'))));
        const value=text(line?.querySelector('.summary-value')),m=value.match(/(\d+)\s*\/\s*(\d+)\s*bulan/i);
        if(!m||Number(m[2])!==12||Number(m[1])>12)return null;
        return {losingMonth:m[1]+'/'+m[2],channelId:id,source:'Browse DOM',period:12,pair:'ALL',url:location.href,capturedAt:new Date().toISOString()};
      }
      await waitFor(read,'Losing Month pada kartu analis #'+id);await settle('#channel-content-container');
      const result=read();if(!result)throw Error('Kartu Losing Month berubah saat dibaca. Ulangi analis ini.');return result;
    }
    if(action==='prepare'){
      await waitFor(()=>document.querySelector('.judul-chnl-comp'),'profil analis');
      if(!visible(document.querySelector('#tab_summary')))click('a[href="#tab_summary"]','Summary');
      if(!visible(document.querySelector('#btnByTime')))click('#profile','Filter');
      await waitFor(()=>visible(document.querySelector('#btnByTime')),'Timerange');click('button#All','ALL');
      const requested=[...new Set((Array.isArray(args.pair)?args.pair:String(args.pair||'XAUUSD').split(/[,;\s]+/)).map(p=>String(p).trim().toUpperCase()).filter(Boolean))];
      const wanted=requested.includes('ALL')?['ALL']:requested,pair=wanted.join(', ');
      if(!wanted.length)throw Error('Belum ada pair yang dipilih.');await waitFor(()=>all('#symbol .perSymbol').length,'daftar pair');
      const options=all('#symbol .perSymbol');
      const missing=wanted.filter(p=>p!=='ALL'&&!options.some(e=>text(e).toUpperCase()===p));
      if(missing.length)throw Error(`Pair ${missing.join(', ')} tidak tersedia pada analis ini. Ubah pair di antrean.`);
      if(wanted[0]==='ALL')click('#symbol-best-All','ALL symbols');
      else{
        for(const e of options.filter(e=>e.classList.contains('active')))if(!wanted.includes(text(e).toUpperCase()))e.click();
        for(const p of wanted){const e=options.find(e=>text(e).toUpperCase()===p);if(!e.classList.contains('active'))e.click();}
        const active=options.filter(e=>e.classList.contains('active')).map(e=>text(e).toUpperCase()).sort();
        if(JSON.stringify(active)!==JSON.stringify([...wanted].sort()))throw Error('Pilihan multi-pair belum diterapkan; proses dihentikan agar data tidak salah.');
      }
      click('#apply-global-filter','Submit');
      await waitFor(()=>{const label=text(document.querySelector('#symbol-right')).toUpperCase();if(wanted[0]==='ALL')return label==='ALL';const actual=label.split(/[,;\s]+/).filter(Boolean).sort();return JSON.stringify(actual)===JSON.stringify([...wanted].sort());},'hasil filter pair '+pair);
      await settle('#tab_summary');
      if(text(document.querySelector('#summaryChart-period')).toLowerCase()!=='all')throw Error('Filter ALL belum diterapkan.');
      if(visible(document.querySelector('#btnByTime')))click('#profile','tutup Filter');
      if(!visible(document.querySelector('#tab_summary')))click('a[href="#tab_summary"]','Summary');
      const chart=await growthReady();
      const header=document.querySelector('.channel');
      return {name:text(document.querySelector('.judul-chnl-comp')),profile:text(header),level:text(header?.querySelector('.sub-jdl-chnl-comp b')),medal:text(header?.querySelectorAll('.sub-jdl-chnl-comp b')[1]).replace(/Medal\s*/i,''),avatar:header?.querySelector('img[alt="Channel Image"]')?.src||null,rate:all('#channel-rate .chnl-rate').map(e=>({label:text(e).replace(text(e.querySelector('span')),'').trim(),value:text(e.querySelector('span'))})),chart:await screenshot('#channel-growth'),frequency:all('#signal-freq-desc tr').filter(e=>e.querySelectorAll('td').length===2).map(e=>({label:text(e.children[0]),value:text(e.children[1])})),filter:{period:'ALL',pair},chartPath:chart.getAttribute('d')};
    }
    if(action==='summary'){
      click('a[href="#tab_summary"]','Summary');await settle('#tab_summary');
      const more=document.querySelector('#btnMoreLess');if(more&&/See More/i.test(text(more)))more.click();
      await waitFor(()=>document.querySelector('#parentConditionBox .moreDetailSummary'),'Summary yang diperluas');await settle('#summary-Channel-Official-Version');
      return {summary:metrics('#summary-Channel-Official-Version'),details:all('#parentConditionBox .for-border-bottom').filter(visible).map(e=>({label:text(e.querySelector('.desc-sum-title')),value:text(e.querySelector('.value-sum-title'))})).filter(x=>x.label)};
    }
    if(action==='statistics'){
      click('a[href="#tab_statistic"]','Statistics');
      // Monthly preview uses spans, whereas the expanded year view uses h4.
      // View Details is the real prerequisite for collecting all years.
      await waitFor(()=>visible(document.querySelector('#tab_statistic'))&&statisticsButton(),'tombol View Details pada Statistics');await settle('#tab_statistic');
      const activity=all('#tab_statistic .info-aktivitas-priority .recapChannel').find(visible);
      const small=recentMonths();
      const data={activityTitle:text(activity?.querySelector('.title-ppm')),activity:activity?[...activity.querySelectorAll('.avg-profit')].map(e=>({label:text(e.querySelector('.text-content')),value:text(e.querySelector('h3'))})):[],checkpoint:text(activity?.querySelector('.cp-percent')),checkpointCaption:text(activity?.querySelector('.cp-caption')),lowerLimit:text(activity?.querySelector('.font-percentage')),recent:small};
      const btn=statisticsButton();if(!btn)throw Error('Tombol View Details tidak ditemukan.');btn.click();
      await waitFor(()=>all('#group-year-1 .btn-by-year').length,'daftar tahun Profit Per Month');await settle('.profit-month-detail');
      data.years=all('#group-year-1 .btn-by-year').map(e=>({year:e.id,total:text(e.querySelector('.totalPips'))})).sort((a,b)=>Number(b.year)-Number(a.year));return data;
    }
    if(action==='year'){
      const btn=all('#group-year-1 .btn-by-year').find(e=>e.id===String(args.year));if(!btn)throw Error('Tahun tidak ditemukan: '+args.year);btn.click();
      await waitFor(()=>all('.profit-month-signal-detail .month-card').some(e=>e.dataset.year===String(args.year)),'bulan tahun '+args.year);await settle('.profit-month-signal-detail');
      const months=all('.profit-month-signal-detail .month-card').filter(e=>e.dataset.year===String(args.year)).map(e=>({month:text(e.querySelector('h4')),signals:text(e.querySelector('.accordion-header p')),pips:text(e.querySelector('.accordion-header > div:last-child span'))}));
      if(!months.length)throw Error('Data bulan kosong untuk '+args.year);return {year:String(args.year),total:text(btn.querySelector('.totalPips')),months};
    }
    if(action==='score'){
      const back=all('a.kmbl').find(visible);if(back)back.click();await waitFor(()=>visible(document.querySelector('a[href="#tab_scoring"]')),'navigasi Score');click('a[href="#tab_scoring"]','Score');
      await waitFor(()=>document.querySelector('#scoreText')?.textContent?.trim()||visible(document.querySelector('#overlay-skor')),'Score');
      const overview=document.querySelector('#overview_scor');if(overview&&!overview.disabled)overview.click();await settle('#tab_scoring');
      const unavailable=visible(document.querySelector('#overlay-skor'));const score={month:text(document.querySelector('#overview-months')),value:unavailable?'Tidak tersedia':text(document.querySelector('#scoreText')),rating:unavailable?'Syarat channel belum terpenuhi':text(document.querySelector('#ovr-skor')),trend:text(document.querySelector('#trend-ket')),cards:unavailable?[]:all('#histr_hit .child-grid-hst').map(e=>({label:text(e.querySelector('.title-lvl-hstr')),value:text(e.querySelector('.sub-lvl-hstr')),score:text(e.querySelector('.ket-1-hstr')),rating:text(e.querySelector('.ket-3-hstr'))})),history:[]};
      const hist=document.querySelector('#hist_scor');if(hist&&!hist.disabled)hist.click();await settle('#tab_scoring');
      score.history=all('#hstr-box-se .child-grid-hstr').map(e=>({month:text(e.querySelector('.child-title-hstr')),value:text(e.querySelector('.child-title2-hstr'))})).filter(x=>x.month);
      return score;
    }
    throw Error('Tahap pengambilan tidak dikenal.');
  }
  globalThis.TFPostDOM={run};
})();
