(() => {
  const $=id=>document.getElementById(id),Core=PostCore;
  let rows=[],filters=[],root=null,running=false,importing=false,paused=false,stop=false,workTab=null,elapsed=0,lastTick=0;
  const pairs=[...$('pair').options].map(e=>e.value);
  let customPairs=['XAUUSD'];
  function pairPicker(value,onchange,label){
    let selected=Core.pairList(value);const details=document.createElement('details');details.className='pair-picker';const summary=document.createElement('summary');summary.setAttribute('aria-label',label);const list=document.createElement('div');list.className='pair-options';list.setAttribute('popover','auto');list.setAttribute('aria-label',label);details.append(summary,list);
    function position(){if(!list.matches(':popover-open'))return;const rect=summary.getBoundingClientRect(),gap=6,pad=12,width=Math.min(320,innerWidth-pad*2);list.style.width=width+'px';list.style.left=Math.max(pad,Math.min(rect.left,innerWidth-width-pad))+'px';const below=innerHeight-rect.bottom-gap-pad,above=rect.top-gap-pad,useBelow=below>=Math.min(300,above);list.style.maxHeight=Math.max(80,Math.min(320,useBelow?below:above))+'px';list.style.top=(useBelow?rect.bottom+gap:Math.max(pad,rect.top-gap-list.getBoundingClientRect().height))+'px';}
    details.addEventListener('toggle',()=>{if(details.open){if(running||importing){details.open=false;return;}list.showPopover();position();}else if(list.matches(':popover-open'))list.hidePopover();});
    list.addEventListener('toggle',()=>{if(!list.matches(':popover-open'))details.open=false;});
    list.addEventListener('keydown',e=>{if(e.key==='Escape'){list.hidePopover();details.open=false;summary.focus();}});
    const reposition=()=>{if(details.isConnected)position();};details._reposition=reposition;

    const update=()=>{summary.textContent=selected.length?selected.join(', '):'Pilih pair';for(const input of list.querySelectorAll('input'))input.checked=selected.includes(input.value);};
    for(const name of new Set([...pairs,...selected])){const line=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=name;input.checked=selected.includes(name);input.disabled=running||importing;line.append(input,document.createTextNode(name));list.append(line);input.onchange=()=>{if(running||importing)return;if(input.checked){selected=name==='ALL'?['ALL']:[...selected.filter(p=>p!=='ALL'),name];}else selected=selected.filter(p=>p!==name);update();onchange([...selected]);};}
    update();return details;
  }
  addEventListener('resize',()=>document.querySelectorAll('.pair-picker[open]').forEach(p=>p._reposition?.()));
  document.addEventListener('scroll',()=>document.querySelectorAll('.pair-picker[open]').forEach(p=>p._reposition?.()),true);
  function renderCustomPairs(){const host=$('customPairs');host.replaceChildren(pairPicker(customPairs,value=>{customPairs=value;persist();},'Pair Link Custom'));}
  function message(t,error=false){$('message').textContent=t;$('message').style.color=error?'#ff9baa':'';}
  function log(t){const p=document.createElement('p');p.textContent=new Date().toLocaleTimeString('id-ID')+' · '+t;$('log').prepend(p);while($('log').children.length>120)$('log').lastChild.remove();}
  const persist=()=>chrome.storage.local.set({postRows:rows,postFilters:filters,postLimit:$('limit').value,postNarrative:$('narrative').value,postCustomPairs:customPairs});
  function renderQueue(){
    $('count').textContent=`${rows.filter(r=>r.selected).length} / ${rows.length} link`;$('queue').replaceChildren();
    if(!rows.length){const p=document.createElement('p');p.className='empty';p.textContent='Impor Excel atau tambahkan link untuk memulai.';$('queue').append(p);}
    rows.forEach((r,i)=>{
      const box=document.createElement('div');box.className='qrow';const check=document.createElement('input');check.type='checkbox';check.checked=r.selected;check.disabled=running||importing;check.setAttribute('aria-label','Proses '+(r.name||r.url));check.onchange=()=>{r.selected=check.checked;persist();$('count').textContent=`${rows.filter(r=>r.selected).length} / ${rows.length} link`;};
      const main=document.createElement('div');main.className='qmain';const top=document.createElement('div');top.className='qname';const name=document.createElement('strong');name.textContent=`${String(i+1).padStart(2,'0')}. ${r.name||'Nama diambil saat proses'}`;
      const pair=pairPicker(r.pair,value=>{r.pair=value.join(', ');r.status='Menunggu';persist();},'Pair '+(r.name||r.url));
      const remove=document.createElement('button');remove.type='button';remove.className='remove-link';remove.textContent='×';remove.title='Hapus link dari antrean';remove.setAttribute('aria-label','Hapus link '+(r.name||r.url));remove.disabled=running||importing;remove.onclick=async()=>{if(running||importing)return;rows=rows.filter(item=>item!==r);if(!rows.length){filters=[];$('source').textContent='Antrean kosong. Impor Excel atau tambahkan link sendiri.';}renderQueue();await persist();message('Link dihapus dari antrean.');};
      top.append(name,pair,remove);const url=document.createElement('a');url.className='qurl';url.href=r.url;url.target='_blank';url.rel='noopener';url.textContent=r.url;const status=document.createElement('div');status.className='qstatus'+(/Selesai/.test(r.status)?' done':/Gagal/.test(r.status)?' error':'');status.textContent=[r.centang,r.status].filter(Boolean).join(' · ');main.append(top,url,status);box.append(check,main);$('queue').append(box);
    });
  }
  function controls(){const busy=running||importing;for(const id of ['excel','links','pair','add','limit','sort','folder','skip','all','none','clear','postMark','postMarkStart','postMarkEnd','narrative'])$(id).disabled=busy;$('excelDrop').classList.toggle('disabled',busy);$('excelDrop').setAttribute('aria-disabled',String(busy));document.querySelectorAll('.pair-picker input').forEach(input=>input.disabled=busy);$('start').disabled=busy;$('pause').disabled=!running;$('stop').disabled=!running;$('pause').textContent=paused?'▶ Lanjut':'Ⅱ Pause';}
  async function db(action,value){return new Promise((resolve,reject)=>{const req=indexedDB.open('TFPostStudio',1);req.onupgradeneeded=()=>req.result.createObjectStore('handles');req.onerror=()=>reject(req.error);req.onsuccess=()=>{const d=req.result,tx=d.transaction('handles',action==='put'?'readwrite':'readonly'),s=tx.objectStore('handles'),q=action==='put'?s.put(value,'root'):s.get('root');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);tx.oncomplete=()=>d.close();};});}
  async function write(dir,name,data){const h=await dir.getFileHandle(name,{create:true}),w=await h.createWritable();try{await w.write(data);await w.close();}catch(e){await w.abort().catch(()=>{});throw e;}}
  async function readJSON(dir,name){try{return JSON.parse(await (await (await dir.getFileHandle(name)).getFile()).text());}catch{return null;}}
  async function refreshCounts(){if(!root)return;const s=await OutputFiles.scan(root,true);$('postFolderCount').textContent=s.folders;$('postFileCount').textContent=s.files;$('postNext').textContent=String(s.next).padStart(2,'0');}
  async function inventory(){const completed=new Map(),incomplete=new Map();let max=0;
    for await(const [name,dir]of root.entries()){
      if(dir.kind!=='directory')continue;max=Math.max(max,Number(name.match(/^(\d+)\./)?.[1]||0));
      const m=await readJSON(dir,'post-manifest.json');if(!m?.url)continue;
      const k=Core.key(m);let valid=m.complete&&m.files?.length>=4;
      if(valid)for(const f of m.files){try{const file=await (await dir.getFileHandle(f)).getFile();if(!file.size){valid=false;break;}}catch{valid=false;break;}}
      if(valid||OutputFiles.marked(name))completed.set(k,{name,manifest:m,marked:OutputFiles.marked(name)});else incomplete.set(k,{name,dir});
    }return {completed,incomplete,max};
  }
  async function gate(){while(paused&&!stop)await new Promise(r=>setTimeout(r,250));if(stop)throw Error('Dihentikan pengguna.');}
  async function loadTab(url){await gate();if(workTab===null){const t=await chrome.tabs.create({url,active:true});workTab=t.id;}else await chrome.tabs.update(workTab,{url,active:true});
    let deadline=Date.now()+60000;for(;;){const waiting=Date.now();await gate();deadline+=Date.now()-waiting;const t=await chrome.tabs.get(workTab);if(t.status==='complete'){
      if(!t.url?.startsWith(url))throw Error('Login TradersFamily diperlukan. Buka link analis, login, lalu coba Start kembali.');break;
    }if(Date.now()>deadline)throw Error('Halaman analis belum selesai dimuat setelah 60 detik.');await new Promise(r=>setTimeout(r,400));}
    await chrome.scripting.executeScript({target:{tabId:workTab},files:['vendor/html2canvas.min.js','collector.js']});
  }
  async function stage(action,args,row,pct,label){await gate();await chrome.tabs.update(workTab,{active:true});$('stage').textContent=label;$('progress').value=pct;row.status=label;renderQueue();log(label);
    const result=await chrome.scripting.executeScript({target:{tabId:workTab},func:async(action,args)=>{try{return {ok:true,data:await globalThis.TFPostDOM.run(action,args)};}catch(e){return {ok:false,error:e.message};}},args:[action,args]});
    const value=result[0]?.result;if(!value?.ok)throw Error(value?.error||'Tidak ada respons dari halaman.');return value.data;
  }
  async function run(){
    if(!root){message('Pilih folder penyimpanan terlebih dahulu.',true);return;}
    if(await root.requestPermission({mode:'readwrite'})!=='granted'){message('Izin menulis folder belum diberikan.',true);return;}
    await refreshCounts();
    const limit=Math.max(1,Math.min(1000,Number($('limit').value)||15));const chosen=rows.filter(r=>r.selected);if(chosen.some(r=>!Core.pairList(r.pair).length)){message('Centang minimal satu pair pada setiap link terpilih.',true);return;}if(!chosen.length){message('Centang minimal satu link.',true);return;}
    await navigator.locks.request('tf-instagram-post-run',{ifAvailable:true},async lock=>{
      if(!lock){message('Proses sedang berjalan di jendela Studio lain.',true);return;}
      running=true;paused=false;stop=false;elapsed=0;lastTick=Date.now();controls();renderQueue();$('progressArea').hidden=false;await chrome.storage.local.set({postControl:{paused:false,stop:false}});
      let done=0,skipped=0,failed=0;
      try{
        const inv=await inventory(),browseCache=new Map();
        const queue=chosen.filter(row=>{if(inv.completed.get(Core.key(row))?.marked||($('skip').checked&&inv.completed.has(Core.key(row)))){row.status='Dilewati — hasil lengkap sudah ada';skipped++;log(`${row.name||row.url}: dilewati (${inv.completed.get(Core.key(row)).name}).`);return false;}return true;}).slice(0,limit);
        renderQueue();await persist();
        for(let i=0;i<queue.length;i++){
          await gate();const row=queue[i],k=Core.key(row),base=i/queue.length*100,unit=100/queue.length;
          try{
            await loadTab(row.url);const data=await stage('prepare',{pair:row.pair},row,base+unit*.05,`${i+1}/${queue.length} · Filter ALL + ${row.pair}`);row.name=data.name||row.name;if(row.source==='Manual'){row.level=data.level;row.medal=data.medal;row.months=data.rate.find(m=>/^Months/i.test(m.label))?.value||'';}
            Object.assign(data,await stage('summary',{},row,base+unit*.22,'Mengambil Summary lengkap'));
            const cons=data.summary?.find(m=>/^Consecutive\s*Loss$/i.test(m.label.trim())),consMatch=cons?.value?.match(/^\s*(\d+)\s*x/i);
            if(consMatch){row.consLoss=consMatch[1];data.consLossSource={source:'Summary DOM',pair:row.pair,period:'ALL',value:cons.value,url:row.url};}
            const stat=await stage('statistics',{},row,base+unit*.36,'Membuka Statistics & View Details');Object.assign(data,stat);data.years=[];
            for(let y=0;y<stat.years.length;y++)data.years.push(await stage('year',{year:stat.years[y].year},row,base+unit*(.42+.25*y/Math.max(1,stat.years.length)),'Mengambil seluruh bulan tahun '+stat.years[y].year));
            data.score=await stage('score',{},row,base+unit*.72,'Mengambil Overview & History Score');data.capturedAt=new Date().toISOString();data.url=row.url;
            try{
              const channelId=Core.canonical(row.url).match(/channels\/(\d+)/)[1];let meta=browseCache.get(channelId);
              if(!meta){const browseURL=new URL('https://account.tradersfamily.id/channels/browse/');for(const [key,value]of Object.entries({symbol:'All',sort:'score',sortDir:'desc',period:'12',title:data.name||row.name,offset:'0'}))browseURL.searchParams.set(key,value);await loadTab(browseURL.href);meta=await stage('browseMetadata',{channelId,name:data.name||row.name},row,base+unit*.82,'Mengambil Losing Month dari Browse · ALL pair · 12 bulan');browseCache.set(channelId,meta);}
              row.losingMonth=meta.losingMonth;row.losingMonthContext='12 bulan · ALL pair';data.losingMonthSource=meta;
            }catch(e){if(stop)throw e;if(!row.losingMonth)throw Error('Losing Month belum terbaca dari Browse: '+e.message);log('Browse belum terbaca; memakai Losing Month dari scan sebelumnya: '+e.message);}
            data.sourceMetadata={...row};
            await gate();row.status='Menyusun slide PNG…';$('stage').textContent=row.status;renderQueue();
            const slides=await PostRender.render(data,row);await gate();let folderName,dir;
            if(inv.incomplete.has(k)){({name:folderName,dir}=inv.incomplete.get(k));}else{({name:folderName,dir}=await OutputFiles.createPostFolder(root,data.name||row.name));}
            const manifest={version:1,url:row.url,pair:row.pair,name:data.name,narrative:$('narrative').value,complete:false,capturedAt:data.capturedAt,files:[]};await write(dir,'post-manifest.json',JSON.stringify(manifest,null,2));
            for(const s of slides){await gate();const saved=await OutputFiles.writeNewPNG(dir,s.name.replace(/^\d+[.\- ]\s*/,'').replace(/\.png$/i,''),s.blob);manifest.files.push(saved.name);}
            const descriptionName=Core.safe(data.name||row.name)+'.txt';await gate();await write(dir,descriptionName,Core.description(row,data,filters,$('narrative').value));manifest.files.push(descriptionName);
            await write(dir,'data-sumber.json',JSON.stringify({ ...data,chart:{...data.chart,data:undefined},sourceFilters:filters},null,2));manifest.files.push('data-sumber.json');
            await gate();manifest.complete=true;await write(dir,'post-manifest.json',JSON.stringify(manifest,null,2));inv.completed.set(k,{name:folderName,manifest});
            row.status=`Selesai · ${slides.length} slide · ${folderName}`;done++;await refreshCounts();log(row.status);$('preview').replaceChildren();for(const s of slides){const im=document.createElement('img');im.src=s.preview;im.alt=s.name;$('preview').append(im);}$('previewSection').hidden=false;
          }catch(e){if(stop)throw e;failed++;row.status='Gagal — '+e.message;log((row.name||row.url)+': '+row.status);}
          $('progress').value=(i+1)/queue.length*100;$('stats').textContent=`${done} selesai · ${skipped} dilewati · ${failed} gagal`;renderQueue();await persist();
        }
        $('progress').value=100;$('stage').textContent='Antrean selesai';$('stats').textContent=`${done} selesai · ${skipped} dilewati · ${failed} gagal`;message(`${done} analis selesai, ${skipped} dilewati, ${failed} gagal. Hasil ada di ${root.name}.`,failed>0);
      }catch(e){$('stage').textContent=stop?'Proses dihentikan':'Proses terhenti';message(e.message,!stop);log(e.message);}
      finally{running=false;paused=false;await chrome.storage.local.set({postControl:{paused:false,stop:true}});for(const r of rows)if(!/Selesai|Gagal|Dilewati|Menunggu/.test(r.status))r.status='Belum selesai — centang untuk mengulang';controls();renderQueue();await persist();if(workTab!==null){await chrome.tabs.remove(workTab).catch(()=>{});workTab=null;}}
    });
  }
  $('postMark').onclick=async()=>{if(running||importing)return;$('postMark').disabled=true;try{if(!root)throw Error('Pilih folder hasil terlebih dahulu.');if(await root.requestPermission({mode:'readwrite'})!=='granted')throw Error('Izin folder belum diberikan.');const n=await OutputFiles.markFolders(root,Number($('postMarkStart').value),Number($('postMarkEnd').value),'posts');await refreshCounts();message(`${n} folder ditandai Done! dan akan dilewati.`);}catch(e){message(e.message,true);}finally{controls();}};
  $('folder').onclick=async()=>{try{const picked=await showDirectoryPicker({id:'tf-post-output',mode:'readwrite'});root=picked.name==='Post Instagram Analis Performers'?picked:await picked.getDirectoryHandle('Post Instagram Analis Performers',{create:true});await db('put',root);await refreshCounts();$('folderLabel').textContent='Hasil: '+root.name+' · siap membaca dan menyimpan';message('Folder tersambung. Link yang sudah lengkap akan dilewati.');}catch(e){if(e.name!=='AbortError')message('Folder belum tersambung: '+e.message,true);}};
  async function importExcel(file){
    if(running||importing){message('Hentikan proses yang berjalan sebelum mengimpor Excel.',true);return;}
    if(!file)return;
    importing=true;controls();renderQueue();
    try{if(!/\.xlsx$/i.test(file.name))throw Error('Pilih file Excel berformat .xlsx.');if(file.size>20000000)throw Error('Ukuran maksimal Excel 20 MB.');const book=await Core.readWorkbook(await file.arrayBuffer());rows=book.rows;filters=book.filters;$('sort').value='centang';$('source').textContent=`${file.name} · ${rows.length} link · sheet ${book.sheet}`;await persist();message('Excel dimuat dan diurutkan berdasarkan Centang.');}catch(err){message(err.message,true);}finally{importing=false;controls();renderQueue();}
  }
  $('excel').onchange=async e=>{await importExcel(e.target.files[0]);e.target.value='';};
  let dragDepth=0;
  const hasFiles=e=>Array.from(e.dataTransfer?.types||[]).includes('Files');
  const clearDrag=()=>{dragDepth=0;$('excelDrop').classList.remove('is-dragging');};
  document.addEventListener('dragenter',e=>{if(!hasFiles(e))return;e.preventDefault();dragDepth++;if(!running&&!importing)$('excelDrop').classList.add('is-dragging');});
  document.addEventListener('dragover',e=>{if(!hasFiles(e))return;e.preventDefault();e.dataTransfer.dropEffect=running||importing?'none':'copy';});
  document.addEventListener('dragleave',e=>{if(!hasFiles(e))return;dragDepth=Math.max(0,dragDepth-1);if(!dragDepth)clearDrag();});
  document.addEventListener('dragend',clearDrag);
  document.addEventListener('drop',async e=>{if(!hasFiles(e))return;e.preventDefault();clearDrag();if($('postsPanel').hidden)return;const files=Array.from(e.dataTransfer.files);if(files.length!==1){message('Tarik satu file Excel .xlsx setiap kali impor.',true);return;}await importExcel(files[0]);});
  $('add').onclick=async()=>{if(!customPairs.length){message('Centang minimal satu pair.',true);return;}const tokens=$('links').value.split(/\s+/).filter(Boolean);let added=0,bad=0,dupe=0;for(const t of tokens){const url=Core.canonical(t);if(!url){bad++;continue;}const r={url,name:'',pair:customPairs.join(', '),source:'Manual',selected:true,status:'Menunggu'};if(rows.some(x=>Core.key(x)===Core.key(r))){dupe++;continue;}rows.push(r);added++;}if(added)$('links').value='';await persist();renderQueue();message(`${added} link ditambahkan · ${dupe} duplikat dilewati${bad?' · '+bad+' link tidak valid':''}`,!!bad);};
  $('sort').onchange=async()=>{if($('sort').value==='centang')rows=Core.sort(rows);else rows.sort((a,b)=>(a.sourceRow||1e9)-(b.sourceRow||1e9));renderQueue();await persist();};
  $('limit').onchange=persist;$('narrative').onchange=persist;
  $('all').onclick=()=>{rows.forEach(r=>r.selected=true);renderQueue();persist();};$('none').onclick=()=>{rows.forEach(r=>r.selected=false);renderQueue();persist();};
  $('clear').onclick=()=>{rows=[];filters=[];$('source').textContent='Antrean kosong. Impor Excel atau tambahkan link sendiri.';renderQueue();persist();message('Antrean dikosongkan. Folder hasil tetap tersimpan.');};
  $('start').onclick=()=>run().catch(e=>{message(e.message,true);running=false;controls();});
  $('pause').onclick=async()=>{paused=!paused;await chrome.storage.local.set({postControl:{paused,stop}});controls();message(paused?'Dijeda. Tekan Lanjut untuk meneruskan.':'Proses dilanjutkan.');};
  $('stop').onclick=async()=>{stop=true;paused=false;await chrome.storage.local.set({postControl:{paused:false,stop:true}});message('Menghentikan proses setelah operasi saat ini selesai…');controls();};
  $('expand').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('studio.html')});
  setInterval(()=>{if(running&&!paused){elapsed+=Date.now()-lastTick;}$('timer').textContent=String(Math.floor(elapsed/60000)).padStart(2,'0')+':'+String(Math.floor(elapsed/1000)%60).padStart(2,'0');lastTick=Date.now();},500);
  addEventListener('beforeunload',()=>{if(running)chrome.storage.local.set({postControl:{paused:false,stop:true}});});
  async function init(){const s=await chrome.storage.local.get(['postRows','postFilters','postLimit','postQueueSchema','postNarrative','postCustomPairs']);
    // One-time reset requested for the update from the version with preloaded data.
    if(s.postQueueSchema!==2){rows=[];filters=[];$('limit').value='15';await chrome.storage.local.set({postRows:[],postFilters:[],postLimit:'15',postQueueSchema:2});}
    else{rows=s.postRows||[];filters=s.postFilters||[];if(s.postLimit)$('limit').value=s.postLimit;}
    if(['level','survived','oldest','forex'].includes(s.postNarrative))$('narrative').value=s.postNarrative;
    if(s.postCustomPairs?.length)customPairs=Core.pairList(s.postCustomPairs);renderCustomPairs();
    $('source').textContent=rows.length?'Antrean terakhir dipulihkan.':'Antrean kosong. Impor Excel atau tambahkan link sendiri.';
    rows.forEach(r=>{if(r.status&&!/Selesai|Gagal|Dilewati|Menunggu/.test(r.status))r.status='Belum selesai — dapat diulang';});
    try{root=await db('get');if(root){$('folderLabel').textContent='Folder terakhir: '+root.name;await refreshCounts();}}catch{}renderQueue();controls();}
  init().catch(e=>message(e.message,true));
})();
