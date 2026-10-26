(() => {
'use strict';
const HOST='com.tfanalyst.indicator_compiler';
const cancelled=row=>row?.isCancelled===true||/^cancelled$/i.test(String(row?.status||row?.tradeStatus||row?.result||''));
const number=value=>{const n=Number(value);return value!==''&&value!=null&&Number.isFinite(n)?n:null;};
const fmt=value=>Number(value).toLocaleString('id-ID',{maximumFractionDigits:2});
function stamp(value){
 const text=String(value||'').trim();
 let m=text.match(/^(\d{2})[-/](\d{2})[-/](\d{4})[, ]+\s*(\d{2}):(\d{2})/);
 if(m)return `${m[3]}.${m[2]}.${m[1]} ${m[4]}:${m[5]}`;
 m=text.match(/^(\d{4})[-.](\d{2})[-.](\d{2})[T ](\d{2}):(\d{2})/);
 return m?`${m[1]}.${m[2]}.${m[3]} ${m[4]}:${m[5]}`:'';
}
function pipSize(symbol){return /^XAU/i.test(symbol)?0.1:/^XAG/i.test(symbol)?0.01:/JPY/i.test(symbol)?0.01:/^(?:USD|EUR|GBP|AUD|NZD|CAD|CHF|JPY){2}$/i.test(symbol)?0.0001:0.1;}
function init(){
 const page=document.querySelector('#tf-dashboard-main'), nav=document.querySelector('nav .tf-nav-link')?.closest('ul');
 if(!page||!nav||document.getElementById('tf-indicator-builder'))return;
 const li=document.createElement('li'), link=document.createElement('a');
 link.className='tf-nav-link';link.href='#indicator-builder';link.textContent='Created MT4/MT5 Indicator';li.append(link);nav.append(li);
 const section=document.createElement('section');section.id='tf-indicator-builder';section.className='card';section.hidden=true;
 section.innerHTML=`<h2>Created MT4/MT5 Indicator</h2>
 <p class="small-muted">Buat indikator risk/reward dari history tersimpan. Cancelled ditampilkan abu-abu dan tidak dihitung sebagai trade.</p>
 <form id="tf-indicator-form"><div class="tf-builder-controls">
 <label>Analis<select name="analyst" required><option value="">Pilih Analis</option></select></label>
 <label>Pair<select name="pair" required><option value="">Pilih Pair</option></select></label>
 <label>Time Range<select name="range"><option value="ALL">ALL</option><option value="3">3 bulan terakhir</option><option value="6">6 bulan terakhir</option><option value="12">12 bulan terakhir</option></select></label>
 <label>MetaTrader<select name="platform"><option>MT4</option><option>MT5</option></select></label>
 </div><div id="tf-indicator-summary" aria-live="polite"></div>
 <progress id="tf-indicator-progress" max="100" value="0" style="width:100%"></progress>
 <p id="tf-indicator-message" role="status"></p><button type="submit">Submit</button> <button type="reset">Reset</button>
 <p class="small-muted">Kompilasi memakai MetaEditor di laptop ini melalui TF Indicator Compiler. Instal pendamping lokal sekali dari paket plugin. Sesuaikan ServerTimeMode di pengaturan indikator dengan waktu broker.</p>
 </form>`;
 page.append(section);
 const css=document.createElement('style');css.textContent=`body.tf-builder-open #tf-dashboard-main>section:not(#tf-indicator-builder){display:none!important}#tf-indicator-builder{padding:20px}.tf-builder-controls{display:flex;gap:12px;flex-wrap:wrap}.tf-builder-controls label{display:grid;gap:5px;flex:1 1 160px}.tf-builder-controls select{max-width:100%;min-height:36px}#tf-indicator-summary table{width:100%;margin:18px 0;border-collapse:collapse}#tf-indicator-summary td{padding:9px;border-bottom:1px solid #26394b}#tf-indicator-builder button{padding:9px 18px;border:1px solid #34516c;border-radius:7px;background:#12243a;color:#e3efff}`;document.head.append(css);
 const form=section.querySelector('form'),summary=section.querySelector('#tf-indicator-summary'),message=section.querySelector('#tf-indicator-message'),progress=section.querySelector('progress');
 let history=[],port=null,busy=false;
 const setMessage=text=>{message.textContent=text;};
 const options=(select,values,placeholder)=>{select.replaceChildren(new Option(placeholder,''),...values.map(v=>new Option(v,v)));};
 const selected=()=>{
  let rows=history.filter(r=>r.analyst===form.elements.analyst.value&&String(r.pair||'').toUpperCase()===form.elements.pair.value);
  const dates=rows.map(r=>stamp(r.displayDate||r.closedDate)).filter(Boolean).sort();
  if(form.elements.range.value!=='ALL'&&dates.length){const latest=dates.at(-1),month=Number(latest.slice(0,4))*12+Number(latest.slice(5,7))-1,cut=month-Number(form.elements.range.value)+1;rows=rows.filter(r=>{const d=stamp(r.displayDate||r.closedDate);return d&&Number(d.slice(0,4))*12+Number(d.slice(5,7))-1>=cut;});}
  return rows.sort((a,b)=>stamp(a.displayDate).localeCompare(stamp(b.displayDate)));
 };
 const refresh=()=>{
  const rows=selected(),trades=rows.filter(r=>!cancelled(r));let tp=0,sl=0,pp=0,lp=0,rTotal=0,cl=0,maxCL=0,equity=0,peak=0,dd=0,missing=0;
  for(const row of trades){const p=number(row.pips);if(p==null)continue;if(p>0){tp++;pp+=p;cl=0;}else if(p<0){sl++;lp+=p;cl++;maxCL=Math.max(maxCL,cl);}
   equity+=p;peak=Math.max(peak,equity);dd=Math.max(dd,peak-equity);
   const entry=number(row.entry),stop=number(row.stopLoss),risk=entry!=null&&stop!=null?Math.abs(entry-stop)/pipSize(row.pair):0;
   if(risk>0)rTotal+=p/risk;else missing++;
  }
  const date=r=>{const s=stamp(r?.displayDate);return s?`${s.slice(8,10)}/${s.slice(5,7)}/${s.slice(0,4)}`:'—';};
  summary.replaceChildren();if(!rows.length)return;
  const table=document.createElement('table');
  for(const cells of [[`TP: ${tp}`,`SL: ${sl}`,`R: ${missing?'—':fmt(rTotal)}`],[`TP pips: ${fmt(pp)}`,`SL pips: ${fmt(lp)}`,`Cancelled: ${rows.length-trades.length}`],[`Cons Loss: ${maxCL}`,`Drawdown: ${fmt(dd)} pips`, `Range Date: ${date(rows[0])} – ${date(rows.at(-1))}`]]){
   const tr=document.createElement('tr');for(const text of cells){const td=document.createElement('td');td.textContent=text;tr.append(td);}table.append(tr);
  }
  table.title='R = jumlah PnL pips ÷ SL pips rencana per trade. Cancelled dikecualikan.';summary.append(table);
 };
 async function load(){const data=await chrome.storage.local.get('tfHistorySignals');history=Array.isArray(data.tfHistorySignals)?data.tfHistorySignals:[];options(form.elements.analyst,[...new Set(history.map(r=>r.analyst).filter(Boolean))].sort(),'Pilih Analis');refresh();}
 function navigate(){const open=location.hash==='#indicator-builder';document.body.classList.toggle('tf-builder-open',open);section.hidden=!open;if(open)load().catch(e=>setMessage(e.message));}
 window.addEventListener('hashchange',navigate);navigate();
 form.addEventListener('change',e=>{if(e.target.name==='analyst')options(form.elements.pair,[...new Set(history.filter(r=>r.analyst===e.target.value).map(r=>String(r.pair||'').toUpperCase()).filter(Boolean))].sort(),'Pilih Pair');refresh();});
 form.addEventListener('reset',()=>{busy=false;port?.disconnect();port=null;form.querySelector('[type=submit]').disabled=false;progress.value=0;setMessage('');setTimeout(()=>{options(form.elements.pair,[],'Pilih Pair');refresh();},0);});
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(busy)return;const records=selected();if(!records.length){setMessage('Tidak ada data pada pilihan ini.');return;}
  const rows=records.map(r=>({status:cancelled(r)?'Cancelled':'Closed',created:stamp(r.createdDate),opened:stamp(r.openedDate),closed:stamp(r.displayDate),analyst:String(r.analyst||''),symbol:String(r.pair||''),side:String(r.type||''),entry:r.entry,tp:r.takeProfit,sl:r.stopLoss,pips:r.pips}));
  const missing=rows.filter(r=>!r.created||!r.closed||(!r.opened&&r.status!=='Cancelled')||![r.entry,r.tp,r.sl].every(v=>number(v)>0));
  if(missing.length){setMessage(`${missing.length} sinyal belum memiliki tanggal/harga lengkap. Jalankan batch scanning ulang agar posisi indikator akurat.`);return;}
  busy=true;progress.value=5;setMessage('Menghubungkan compiler lokal...');let chunks=[];
  const submit=form.querySelector('[type=submit]');submit.disabled=true;
  const finish=()=>{busy=false;submit.disabled=false;port?.disconnect();port=null;};
  try{
   port=chrome.runtime.connectNative(HOST);
   port.onDisconnect.addListener(()=>{const error=chrome.runtime.lastError;if(busy){busy=false;submit.disabled=false;setMessage(error?'Compiler lokal belum terhubung. Jalankan Install-Compiler.ps1 dari folder indicator-compiler dalam paket plugin.':'Compiler terputus. Coba kembali.');}});
   port.onMessage.addListener(async result=>{
    if(result.type==='progress'){progress.value=result.value;setMessage(result.message);}
    else if(result.type==='chunk'){const raw=atob(result.data);chunks.push(Uint8Array.from(raw,c=>c.charCodeAt(0)));}
    else if(result.type==='error'){setMessage(result.message);finish();}
    else if(result.type==='done'){
     try{const blob=new Blob(chunks,{type:'application/octet-stream'}),hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))].map(v=>v.toString(16).padStart(2,'0')).join('');
      if(blob.size!==result.size||hash!==result.sha256||!/^TF_RR_\d{8}_\d{6}\.ex[45]$/.test(result.filename))throw new Error('Verifikasi hasil kompilasi gagal.');
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=result.filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);progress.value=100;setMessage('Indikator selesai dan diunduh.');
     }catch(error){setMessage(error.message);}finally{chunks=[];finish();}
    }
   });port.postMessage({platform:form.elements.platform.value,rows});
  }catch(error){setMessage(error.message);finish();}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
