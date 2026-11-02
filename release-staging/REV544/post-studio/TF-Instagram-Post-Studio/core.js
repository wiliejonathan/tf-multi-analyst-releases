/* Local workbook import; no spreadsheet is sent to a server. */
(() => {
  const normalize = s => String(s ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g,'');
  function canonical(url) {
    try {
      const u = new URL(String(url).trim());
      const m = u.pathname.match(/^\/channels\/(\d+)\/?$/);
      return u.protocol === 'https:' && u.hostname === 'account.tradersfamily.id' && m ? `https://account.tradersfamily.id/channels/${m[1]}/` : null;
    } catch { return null; }
  }
  const rank = s => /priority/i.test(s) ? 0 : /prospect/i.test(s) ? 1 : /basic/i.test(s) ? 2 : /[✓✔]|true|yes/i.test(s) ? 1 : 3;
  const sort = rows => rows.map((r,i)=>({...r,_order:i})).sort((a,b)=>rank(a.centang)-rank(b.centang)||a._order-b._order).map(({_order,...r})=>r);
  const safe = s => {let n=String(s || 'Analis').replace(/[<>:"/\\|?*\x00-\x1f]/g,' ').replace(/\s+/g,' ').replace(/[. ]+$/g,'').trim().slice(0,100) || 'Analis';if(/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(n))n='_'+n;return n;};
  const pairList=value=>{const list=[...new Set((Array.isArray(value)?value:String(value||'').split(/[,;\s]+/)).map(p=>String(p).trim().toUpperCase()).filter(Boolean))];return list.includes('ALL')?['ALL']:list;};
  const key = r => `${canonical(r.url)}|${pairList(r.pair||'XAUUSD').sort().join(',')}`;
  function rowsFromGrid(grid) {
    const start=grid.findIndex(row=>row.some(v=>normalize(v)==='link')&&row.some(v=>normalize(v)==='namaanalis'));
    if(start<0) throw Error('Sheet Hasil Scan harus memiliki kolom Link dan Nama Analis.');
    const headers=grid[start].map(normalize);
    const get=(row,...names)=> { for(const n of names){const i=headers.indexOf(normalize(n));if(i>=0)return String(row[i]??'').trim();}return ''; };
    const seen=new Set();return sort(grid.slice(start+1).flatMap((row,i)=>{
      const url=canonical(get(row,'Link','URL'));if(!url)return [];
      const pair=get(row,'Pair')||'XAUUSD';const r={url,name:get(row,'Nama Analis'),pair,months:get(row,'Months Since','Month Since'),slFixed:get(row,'SL Fixed Pips'),consLoss:get(row,'Cons. Loss','Cons Loss'),losingMonth:get(row,'Losing Month'),level:get(row,'Level'),medal:get(row,'Medal'),centang:get(row,'Centang'),source:'Excel',sourceRow:start+i+2,selected:true,status:'Menunggu'};
      if(seen.has(key(r)))return [];seen.add(key(r));return [r];
    }));
  }
  async function unzip(buffer) {
    const bytes=new Uint8Array(buffer),v=new DataView(buffer),decoder=new TextDecoder();let eocd=-1;
    for(let p=bytes.length-22;p>=Math.max(0,bytes.length-65557);p--)if(v.getUint32(p,true)===0x06054b50){eocd=p;break;}
    if(eocd<0)throw Error('File bukan XLSX yang valid. Simpan ulang sebagai .xlsx.');
    const count=v.getUint16(eocd+10,true);let p=v.getUint32(eocd+16,true),total=0;const out={};
    if(count>3000)throw Error('Workbook terlalu besar (maksimal 3000 bagian).');
    for(let i=0;i<count;i++){
      if(v.getUint32(p,true)!==0x02014b50)throw Error('Struktur ZIP Excel rusak.');
      const method=v.getUint16(p+10,true),size=v.getUint32(p+20,true),raw=v.getUint32(p+24,true),nl=v.getUint16(p+28,true),xl=v.getUint16(p+30,true),cl=v.getUint16(p+32,true),offset=v.getUint32(p+42,true),name=decoder.decode(bytes.slice(p+46,p+46+nl));p+=46+nl+xl+cl;
      if(!/\.xml$|\.rels$/.test(name))continue;
      total+=raw;if(raw>30000000||total>80000000)throw Error('Isi workbook melebihi batas aman 80 MB.');
      const from=offset+30+v.getUint16(offset+26,true)+v.getUint16(offset+28,true),data=bytes.slice(from,from+size);
      if(method===0)out[name]=decoder.decode(data);
      else if(method===8){const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));out[name]=await new Response(stream).text();}
      else throw Error('Kompresi Excel tidak didukung. Simpan ulang sebagai .xlsx.');
    }return out;
  }
  async function readWorkbook(buffer) {
    const files=await unzip(buffer),parse=s=>new DOMParser().parseFromString(s,'application/xml');
    const wb=parse(files['xl/workbook.xml']||''),rels=parse(files['xl/_rels/workbook.xml.rels']||'');
    const shared=files['xl/sharedStrings.xml']?[...parse(files['xl/sharedStrings.xml']).getElementsByTagName('si')].map(e=>[...e.getElementsByTagName('t')].map(t=>t.textContent).join('')):[];
    const sheets={};
    for(const sheet of wb.getElementsByTagName('sheet')){
      const id=sheet.getAttribute('r:id');const rel=[...rels.getElementsByTagName('Relationship')].find(e=>e.getAttribute('Id')===id);
      let target=rel?.getAttribute('Target')||'';target=target.startsWith('/')?target.slice(1):'xl/'+target.replace(/^\.\//,'');
      if(!files[target])continue;
      const grid=[];for(const row of parse(files[target]).getElementsByTagName('row')){
        const vals=[];for(const c of row.getElementsByTagName('c')){
          const letters=(c.getAttribute('r')||'A').replace(/\d/g,'');let idx=0;for(const char of letters)idx=idx*26+char.charCodeAt(0)-64;
          const type=c.getAttribute('t'),value=c.getElementsByTagName('v')[0]?.textContent||'';
          vals[idx-1]=type==='s'?shared[Number(value)]||'':type==='inlineStr'?[...c.getElementsByTagName('t')].map(e=>e.textContent).join(''):value;
        }grid.push(vals);
      }sheets[sheet.getAttribute('name')]=grid;
    }
    const name=Object.keys(sheets).find(n=>normalize(n)==='hasilscan')||Object.keys(sheets)[0];
    if(!name)throw Error('Tidak ada sheet yang dapat dibaca.');
    const filters=Object.entries(sheets).find(([n])=>normalize(n)==='filtersaatscan')?.[1]?.slice(1)||[];
    return {rows:rowsFromGrid(sheets[name]),filters,sheet:name};
  }
  function description(row,data,filters=[],narrative='survived') {
    const f=Object.fromEntries(filters),na=v=>v||'Tidak tersedia dalam sumber';
    const survived=/^ON/i.test(f['Survived Month']||'')?f['Bulan yang dipilih']:null;
    const lines=[`${data.name||row.name} — Portofolio Analis`];
    if(narrative==='level')lines.push(row.level?`Top ${row.level} This Month!`:'Top Level This Month! — Level belum tersedia dalam data scan.');
    else if(narrative==='oldest')lines.push(`Top Oldest Analyst${row.months?' - '+row.months+' months':' — usia analis belum tersedia dalam data scan.'}`);
    else if(narrative==='forex')lines.push(`Top Forex : ${row.pair||'Pair belum tersedia dalam data scan.'}`);
    else if(survived)lines.push(`Survived Month (filter scan): ${String(survived).replace(/[.\s]+$/,'')}.`);
    lines.push('',`Pair: ${row.pair}`,`Sumber: ${row.url}`,`Diambil: ${new Date(data.capturedAt).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})} WIB`,'',`Months Since: ${na(row.months)}`,`Level: ${na(row.level)}`,`Medal: ${na(row.medal)}${row.centang?' '+row.centang:''}`,`Consecutive Loss saat scan: ${na(row.consLoss)}`,`Losing Month saat scan: ${na(row.losingMonth)}${row.losingMonthContext?' ('+row.losingMonthContext+')':''}`);
    const summary=(data.summary||[]).filter(m=>/^(Total Pips P\/L(?: \(Pips\))?|Average R:R)$/i.test(m.label.trim()));
    if(summary.length)lines.push('',...summary.map(m=>`${m.label}: ${m.value}`));
    lines.push('','Hasil historis dapat berubah dan tidak menjamin hasil berikutnya.','', '#Forex #tradersfamily #trading #fyp #portofolio #johnpaul77 #TFeducation #signalforex');
    return lines.join('\r\n');
  }
  const api={pairList,normalize,canonical,rank,sort,safe,key,rowsFromGrid,readWorkbook,description};
  globalThis.PostCore=api;if(typeof module!=='undefined')module.exports=api;
})();
