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
function exportFilename(analyst, suffix){
 const date=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Jakarta',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date()).replaceAll('/','-');
 const name=String(analyst||'Analis').normalize('NFKC').replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g,'_').replace(/\s+/g,'_').replace(/^[. ]+|[. ]+$/g,'').slice(0,96)||'Analis';
 return `${date} ${name}.${suffix}`;
}
function mount(tv=false){
 const pageId=tv?'tf-tradingview-builder':'tf-indicator-builder',route=tv?'#tradingview-builder':'#indicator-builder';
 const page=document.querySelector('#tf-dashboard-main'), nav=document.querySelector('nav .tf-nav-link')?.closest('ul');
 if(!page||!nav||document.getElementById(pageId))return;
 const existing=nav.querySelector('a[data-tf-builder-route="'+route+'"]');
 const li=existing?.closest('li')||document.createElement('li'),link=existing||document.createElement('a');
 link.className='tf-nav-link';link.href=route;link.textContent=tv?'Created TradingView Indicator':'Created MT4/MT5 Indicator';
 if(!existing){li.append(link);const divider=document.createElement('li');divider.className='tf-nav-divider';divider.setAttribute('aria-hidden','true');nav.append(divider,li);}
 const section=document.createElement('section');section.id=pageId;section.className='card tf-indicator-builder';section.hidden=true;
 section.innerHTML=`<h2>Created MT4/MT5 Indicator</h2>
 <p class="small-muted">Buat indikator risk/reward dari history tersimpan. Cancelled ditampilkan abu-abu dan tidak dihitung sebagai trade.</p>
 <div class="tf-compiler-setup"><strong>Compiler lokal · Windows</strong>
 <p id="tf-compiler-status" role="status">Untuk EX4/EX5, pasang pendamping sekali pada setiap akun Windows. MT4/MT5 dan MetaEditor harus tersedia di PC tersebut.</p>
 <a id="tf-compiler-download" download="Setup-TF-Indicator-Compiler.exe">Unduh installer Windows</a> <button id="tf-compiler-check" type="button">Cek koneksi</button>
 <p class="small-muted">Buka installer yang diunduh, setujui pemasangan, lalu klik Cek koneksi. Tidak perlu Administrator atau PowerShell. Di macOS, gunakan PC Windows untuk kompilasi lokal ini.</p></div>
 <form id="tf-indicator-form"><div class="tf-builder-controls">
 <label>Analis<select name="analyst" required><option value="">Pilih Analis</option></select></label>
 <label>Pair<select name="pair" required><option value="">Pilih Pair</option></select></label>
 <label>Time Range<select name="range"><option value="ALL">ALL</option><option value="3">3 bulan terakhir</option><option value="6">6 bulan terakhir</option><option value="12">12 bulan terakhir</option></select></label>
 <label>MetaTrader<select name="platform"><option>MT4</option><option>MT5</option></select></label>
 </div><div id="tf-indicator-summary" aria-live="polite"></div>
 <div id="tf-indicator-data-audit" aria-live="polite"></div>
 <label id="tf-indicator-skip-label" hidden><input name="skipIncomplete" type="checkbox"> Saya setuju melewati sinyal yang belum lengkap; hasil indikator hanya berisi sinyal yang siap.</label>
 <progress id="tf-indicator-progress" max="100" value="0" style="width:100%"></progress>
 <p id="tf-indicator-message" role="status"></p><button type="submit">Submit</button> <button type="reset">Reset</button>
 <p class="small-muted">Swap dan Comm pada indikator aktif secara default. Biaya memakai snapshot lot dan tarif User Adjustment saat ekspor (per trade, bukan swap broker per malam). R net = PnL dollar setelah biaya ÷ risiko dollar rencana; jumlah TP/SL dan warna outcome tetap bruto. Rentang lembut: Created→Opened; rentang utama: Opened→Closed. Default waktu server GMT+2 (WIB−5 jam), sesuai contoh 15:31 WIB = 10:31 server. Jika broker memakai jadwal lain, ubah ServerTimeMode pada Inputs indikator. Kompilasi memakai MetaEditor lokal. Pasang pendamping lewat tombol Unduh installer Windows di atas. Sesuaikan ServerTimeMode di pengaturan indikator dengan waktu broker.</p>
 </form>`;
 section.insertAdjacentHTML('beforeend',`<div class="tf-source-code"><h3>Script indikator</h3><p class="small-muted">Klik Submit untuk membuat script, lalu Copy Code untuk menyalinnya.</p><button type="button" data-source-copy disabled>Copy Code</button><textarea data-source-code readonly rows="16" aria-label="Script indikator" placeholder="Pilih analis dan pair, lalu klik Submit."></textarea><p data-source-message role="status" aria-live="polite"></p></div>`);
 if(tv){for(const el of section.querySelectorAll('[id]'))el.id=el.id.replace('tf-','tf-tv-');section.querySelector('h2').textContent='Created TradingView Indicator';}
 const find=selector=>section.querySelector(tv?selector.replaceAll('#tf-','#tf-tv-'):selector);
 if(!tv)find('[type=reset]').insertAdjacentHTML('afterend',' <button type="button" data-template-download>Download Mt4 Template</button>');
 page.append(section);
 const css=document.createElement('style');css.textContent=`body.tf-builder-open #tf-dashboard-main>section:not(.tf-indicator-builder){display:none!important}.tf-indicator-builder[hidden]{display:none!important}.tf-source-code{margin-top:20px;min-width:0}.tf-source-code textarea{display:block;width:100%;max-width:100%;margin-top:12px;background:#091426;color:#dcecff;border:1px solid #34516c;border-radius:7px;padding:12px;font:12px/1.5 Consolas,monospace;white-space:pre;overflow:auto;resize:vertical;min-height:220px}.tf-indicator-builder{padding:20px}.tf-compiler-setup{padding:14px;border:1px solid #34516c;border-radius:8px;margin:14px 0}.tf-compiler-setup a{display:inline-block;color:#63cfff;margin:6px 12px 6px 0}#tf-indicator-data-audit{overflow-wrap:anywhere}#tf-indicator-skip-label{display:block;padding:10px 0}#tf-indicator-skip-label[hidden]{display:none}.tf-builder-controls{display:flex;gap:12px;flex-wrap:wrap}.tf-builder-controls label{display:grid;gap:5px;flex:1 1 160px}.tf-indicator-builder{color-scheme:dark}.tf-builder-controls select{width:100%;max-width:100%;min-height:40px;padding:8px 12px;background:#101c30;color:#e3efff;border:1px solid #34516c;border-radius:7px;font:inherit;color-scheme:dark}.tf-builder-controls select option{background:#101c30;color:#e3efff}.tf-builder-controls select:focus-visible{outline:2px solid #63cfff;outline-offset:2px}#tf-indicator-progress{height:7px;border:0;border-radius:5px;background:#17283d;accent-color:#55c8ed;margin-top:12px}#tf-indicator-progress::-webkit-progress-bar{background:#17283d;border-radius:5px}#tf-indicator-progress::-webkit-progress-value{background:#55c8ed;border-radius:5px}#tf-indicator-progress::-moz-progress-bar{background:#55c8ed;border-radius:5px}#tf-indicator-summary table{width:100%;margin:18px 0;border-collapse:collapse}#tf-indicator-summary td{padding:9px;border-bottom:1px solid #26394b}.tf-indicator-builder button{padding:9px 18px;border:1px solid #34516c;border-radius:7px;background:#12243a;color:#e3efff}`;document.head.append(css);
 const form=find('form'),summary=find('#tf-indicator-summary'),message=find('#tf-indicator-message'),progress=find('progress');
 const audit=find('#tf-indicator-data-audit'),skipLabel=find('#tf-indicator-skip-label'),status=find('#tf-compiler-status'),checkButton=find('#tf-compiler-check');
 const installer=find('#tf-compiler-download');installer.href=chrome.runtime.getURL?chrome.runtime.getURL('indicator-compiler/Setup-TF-Indicator-Compiler.exe'):new URL('indicator-compiler/Setup-TF-Indicator-Compiler.exe',location.href).href;
 let history=[],port=null,busy=false,requestId=0;
 function finance(r,cache){
  try{
   const key=r.analyst+'|'+r.pair;
   if(!cache.has(key)){
    const stats=computeSlStatsFromHistory(r.analyst,r.pair),sl=getEffectiveSlForAnalyst(r.analyst,r.pair,stats).pips,dpp=getDollarPerPipForAnalyst(null,r.pair);
    const lot=roundLotToTwoDecimals(computeLot(currentBalance,getRiskPercentForAnalyst(r.analyst,r.pair),sl,dpp));
    cache.set(key,{lot,dpp,swap:tf_roundTradeCostMoney(lot*Math.max(0,Number(swapRatePerLot)||0)),comm:tf_roundTradeCostMoney(lot*Math.max(0,Number(commissionRatePerLot)||0))});
   }
   const f=cache.get(key);if(!(f.lot>0&&f.dpp>0))return null;
   return {lot:f.lot,dollarPerPip:f.dpp,riskDollar:Math.abs(Number(r.entry)-Number(r.stopLoss))/pipSize(r.pair)*f.lot*f.dpp,grossDollar:Number(r.pips)*f.lot*f.dpp,swapDollar:f.swap,commDollar:f.comm};
  }catch{return null;}
 }
 function inspect(records){
  const good=[],bad=[],cache=new Map();
  for(const r of records){
   const isCancel=cancelled(r),row={status:isCancel?'Cancelled':'Closed',created:stamp(r.createdDate),opened:stamp(r.openedDate),closed:stamp(r.displayDate||r.closedDate),analyst:String(r.analyst||''),symbol:String(r.pair||''),side:String(r.type||''),entry:r.entry,tp:r.takeProfit,sl:r.stopLoss,pips:isCancel?0:r.pips};
   const reasons=[];
   for(const [label,key,optional] of [['Created At','created',false],['Opened At','opened',isCancel],['Closed At','closed',false]]){
    if(!row[key]){if(!optional)reasons.push(label);continue;}
    const d=row[key],v=new Date(Date.UTC(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8,10),+d.slice(11,13),+d.slice(14,16)));
    if(+d.slice(0,4)<2000||+d.slice(0,4)>2100||v.getUTCFullYear()!==+d.slice(0,4)||v.getUTCMonth()+1!==+d.slice(5,7)||v.getUTCDate()!==+d.slice(8,10)||v.getUTCHours()!==+d.slice(11,13)||v.getUTCMinutes()!==+d.slice(14,16))reasons.push(label+' tidak valid');
   }
   for(const [label,key] of [['Entry','entry'],['Take Profit','tp'],['Stop Loss','sl']])if(!(number(row[key])>0))reasons.push(label);
   if(!isCancel&&number(row.pips)==null)reasons.push('PnL pips');
   if(!/^(buy|sell)$/i.test(row.side))reasons.push('Type Buy/Sell');
   if(number(row.entry)>0&&number(row.sl)>0&&number(row.entry)===number(row.sl))reasons.push('SL sama dengan Entry');
   if(row.created&&row.closed&&row.created>row.closed)reasons.push('Created setelah Closed');
   if(row.created&&row.opened&&row.created>row.opened)reasons.push('Created setelah Opened');
   if(row.opened&&row.closed&&row.opened>row.closed)reasons.push('Opened setelah Closed');
   if(!isCancel&&!reasons.length){const money=finance(r,cache);if(money)Object.assign(row,money);else reasons.push('Pengaturan lot/dollar belum siap');}
   if(isCancel)Object.assign(row,{lot:0,dollarPerPip:0,riskDollar:0,grossDollar:0,swapDollar:0,commDollar:0});
   if(reasons.length)bad.push({id:String(r.signalId||'—'),reasons});else good.push(row);
  }
  return {good,bad};
 }
 function checkCompiler(){
  checkButton.disabled=true;status.textContent='Memeriksa pendamping dan MetaEditor lokal...';
  return new Promise(resolve=>{let probe,done=false;
   const finish=result=>{if(done)return;done=true;clearTimeout(timer);try{probe?.disconnect();}catch{}checkButton.disabled=false;status.textContent=result.message;resolve(result);};
   const timer=setTimeout(()=>finish({ok:false,message:'Compiler belum merespons. Pasang/perbarui pendamping dengan installer di atas, lalu cek kembali.'}),8000);
   try{probe=chrome.runtime.connectNative(HOST);
    probe.onDisconnect.addListener(()=>{const error=chrome.runtime.lastError;finish({ok:false,message:error?'Pendamping belum terpasang atau belum terdaftar untuk akun Chrome ini. Unduh dan buka installer Windows di atas, lalu cek kembali.':'Koneksi pendamping berakhir sebelum pemeriksaan selesai. Coba Cek koneksi kembali.'});});
    probe.onMessage.addListener(result=>{
     if(result.type!=='status'||result.compilerVersion!=='2.29'){finish({ok:false,message:'Pendamping versi lama terdeteksi. Pasang installer terbaru di atas, lalu cek kembali.'});return;}
     finish({ok:true,mt4:result.mt4===true,mt5:result.mt5===true,message:'Compiler terhubung (2.29). MT4: '+(result.mt4?'siap':'MetaEditor belum terdeteksi')+' · MT5: '+(result.mt5?'siap':'MetaEditor belum terdeteksi')+'.'});
    });probe.postMessage({action:'status'});
   }catch(error){finish({ok:false,message:'Pendamping tidak dapat dibuka. Pasang installer Windows di atas lalu klik Cek koneksi.'});}
  });
 }
 checkButton.addEventListener('click',()=>{if(!busy)void checkCompiler();});
 const setMessage=text=>{message.textContent=text;};
 const code=find('[data-source-code]'),codeMessage=find('[data-source-message]'),copy=find('[data-source-copy]');let generatedName='';
 const feedback=new WeakMap();
 function flash(button){
  if(!button)return;feedback.get(button)?.cancel();
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const effect=button.animate(reduced?[{outline:'2px solid #76e2ff'},{outline:'2px solid #76e2ff'}]:[{background:'#26718c',boxShadow:'0 0 0 2px #76e2ff'},{background:'#12243a',boxShadow:'0 0 0 0 transparent',offset:.35},{background:'#26718c',boxShadow:'0 0 0 2px #76e2ff',offset:.65},{background:'#12243a',boxShadow:'0 0 0 0 transparent'}],{duration:360,easing:'ease-out'});
  feedback.set(button,effect);
 }
 section.addEventListener('click',e=>{const button=e.target.closest('button');if(button?.matches('[type=submit],[type=reset],[data-source-copy],[data-template-download]')&&!button.disabled)flash(button);},true);
 find('[data-template-download]')?.addEventListener('click',async e=>{const button=e.currentTarget;button.disabled=true;try{const response=await fetch(chrome.runtime.getURL('assets/metatrader-guide/BACKTEST.tpl'));if(!response.ok)throw new Error('Template belum dapat dibaca. Reload plugin lalu coba kembali.');download(await response.arrayBuffer(),'BACKTEST.tpl');setMessage('BACKTEST.tpl diunduh. Ikuti tutorial template di bawah sebelum memasang indikator.');}catch(error){setMessage(error.message);}finally{button.disabled=false;}});
 const download=(text,name)=>{const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);};
 const pdfName=tv?'Panduan_TradingView_Pine_Script.pdf':'Panduan_MT4_MT5_Template_dan_Indikator.pdf';
 section.addEventListener('click',async e=>{const button=e.target.closest('[data-guide-download]');if(!button||button.disabled)return;flash(button);button.disabled=true;try{const response=await fetch(chrome.runtime.getURL('assets/indicator-guides/'+pdfName));if(!response.ok)throw new Error('PDF panduan belum dapat dibaca. Reload plugin lalu coba kembali.');const blob=new Blob([await response.arrayBuffer()],{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=pdfName;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);setMessage('Panduan PDF selesai diunduh.');}catch(error){setMessage(error.message);}finally{button.disabled=false;}});
 async function buildSource(downloadNow=false){
  try{
   const {good,bad}=inspect(selected());if(!good.length)throw new Error('Belum ada sinyal lengkap untuk dibuat script. Lihat rincian data di atas.');
   if(bad.length&&!form.elements.skipIncomplete.checked)throw new Error('Centang persetujuan melewati data belum lengkap, atau lengkapi history terlebih dahulu.');
   const platform=form.elements.platform.value;
   const text=tv?TFIndicatorSources.pine(good,form.elements.analyst.value,form.elements.pair.value):await TFIndicatorSources.mql(good,platform);
   code.value=text;generatedName=exportFilename(form.elements.analyst.value,tv?'txt':platform==='MT5'?'mq5':'mq4');copy.disabled=false;
   codeMessage.textContent=good.length+' sinyal masuk script'+(bad.length?' · '+bad.length+' dilewati sesuai persetujuan':'')+'.'+(tv?' Paste ke Pine Editor → Save → Add to chart. Centang TP/SL/Cancelled/Swap/Comm di Settings / Inputs.':' Sumber MQL dapat dikompilasi manual lewat MetaEditor.');
   if(downloadNow)download(text,generatedName);return true;
  }catch(error){codeMessage.textContent=error.message;return false;}
 }
 copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code.value);codeMessage.textContent='Kode berhasil disalin.';}catch{code.focus();code.select();codeMessage.textContent='Kode dipilih. Tekan Ctrl+C untuk menyalin.';}});
 if(tv){
  find('.tf-compiler-setup').hidden=true;
  const platform=form.elements.platform;platform.replaceChildren(new Option('Pine Script v6','PINE'));platform.disabled=true;platform.closest('label').firstChild.textContent='Format ';
  find('form>p.small-muted').textContent='Submit membuat script dan mengunduh file .txt untuk Pine Editor. Default mencakup seluruh history pilihan sampai trade paling lampau, tanpa batas 100/120 trade pada pengaturan history. Geser atau zoom chart untuk melihat trade lama. Banyaknya kotak sekaligus mengikuti batas objek TradingView; panel memberi tahu jika area chart terlalu padat. Panel di kanan atas memakai mode Ringkas (ponsel) dan teks sangat kecil secara default. Untuk menyembunyikan informasi saja: Settings / Inputs → Panel → centang Hide Panel. Hapus centang untuk menampilkan lagi; kotak dan garis trade tetap tampil. Mode Lengkap serta ukuran teks dapat dipilih di bagian Panel. Centang TP/SL/Cancelled/Swap/Comm tersedia di Settings / Inputs.';
  const tutorial=document.createElement('div');tutorial.className='tf-pine-tutorial';
  tutorial.innerHTML='<h3>Cara memasang indikator di TradingView</h3><p>Pilih analis, pair, dan periode, lalu klik Submit. Buka chart dengan pair yang sama.</p>';
  const steps=[
   ['Buka Pine Editor','Klik ikon Pine Editor pada sisi kanan TradingView.','pine-editor.png'],
   ['Kosongkan script awal','Klik area kode, tekan Ctrl + A, lalu Delete untuk menghapus script bawaan.','clear-script.png'],
   ['Salin script indikator','Kembali ke halaman ini. Setelah Submit selesai, klik Copy Code.','copy-code.png'],
   ['Tempel ke Pine Editor','Kembali ke area kode Pine Editor, lalu tekan Ctrl + V untuk menempelkan seluruh script.','paste-script.png'],
   ['Tambahkan ke chart','Klik Tambahkan ke chart / Add to chart pada toolbar Pine Editor. Jika setelah klik Publikasikan Skrip muncul dialog seperti foto, klik Tambahkan ke dalam chart. Publikasi tidak diperlukan untuk memakai indikator sendiri.','add-to-chart.png'],
   ['Periksa hasil indikator','Indikator tampil dengan panel analis dan pair di kanan atas. Atur Trade TP, Trade SL, Trade Cancelled, Swap dan Comm melalui Settings → Inputs. Geser atau zoom chart untuk memeriksa history yang lebih lama.','result.png']
  ];
  const grid=document.createElement('ol');grid.className='tf-pine-steps';
  for(const [title,text,file] of steps){const item=document.createElement('li'),heading=document.createElement('h4'),desc=document.createElement('p'),image=document.createElement('img'),a=document.createElement('a');heading.textContent=title;desc.textContent=text;image.src=chrome.runtime.getURL('assets/tradingview-guide/'+file);image.alt=title;image.loading='lazy';image.decoding='async';a.href=image.src;a.target='_blank';a.rel='noopener';a.title='Buka gambar ukuran penuh';a.append(image);item.append(heading,desc,a);grid.append(item);}
  const pdfButton=document.createElement('button');pdfButton.type='button';pdfButton.dataset.guideDownload='';pdfButton.textContent='Download Panduan Tutorial (PDF)';tutorial.prepend(pdfButton);pdfButton.style.marginBottom='14px';tutorial.append(grid);section.append(tutorial);
  const guideStyle=document.createElement('style');guideStyle.textContent='.tf-pine-tutorial{margin-top:28px;padding-top:20px;border-top:1px solid #34516c;min-width:0}.tf-pine-steps{list-style:none;counter-reset:pine-step;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;padding:0;margin:18px 0 0}.tf-pine-steps li{counter-increment:pine-step;min-width:0;border:1px solid #263c55;border-radius:10px;padding:16px;background:#0c182a}.tf-pine-steps h4{margin:0 0 9px;font-size:15px}.tf-pine-steps h4:before{content:counter(pine-step) " · ";color:#63cfff}.tf-pine-steps p{margin:0 0 14px;line-height:1.6;color:#b9cce0}.tf-pine-steps img{display:block;width:100%;height:auto;border-radius:6px}.tf-pine-steps a{display:block}.tf-indicator-builder button:focus-visible{outline:2px solid #76e2ff;outline-offset:3px}@media(max-width:700px){.tf-pine-steps{grid-template-columns:minmax(0,1fr)}}';document.head.append(guideStyle);
 }
 if(!tv){
  const templateTutorial=document.createElement('div');templateTutorial.className='tf-template-tutorial tf-pine-tutorial';templateTutorial.innerHTML='<h3>1. Pasang template MT4 terlebih dahulu</h3><p>Terapkan BACKTEST sebelum memasang indikator. Template ini khusus MT4. Untuk MT5, lanjut ke bagian 2 di bawah.</p>';
  const templateSteps=[
   ['Unduh dan salin BACKTEST.tpl','Klik Download Mt4 Template di samping Submit dan Reset. Pada folder Downloads, pilih BACKTEST.tpl lalu tekan Ctrl + C.',''],
   ['Buka Data Folder MT4','Di MT4, klik File → Open Data Folder.','template-data-folder.png'],
   ['Buka folder templates','Buka folder templates pada Data Folder MT4, sejajar dengan folder MQL4.','template-folder.png'],
   ['Tempel BACKTEST.tpl','Di dalam folder templates, tekan Ctrl + V untuk menempelkan file yang tadi disalin.','template-paste.png'],
   ['Terapkan template BACKTEST','Kembali ke chart MT4. Klik kanan di chart → Template → BACKTEST. Jika belum muncul, pilih Template → Load Template lalu buka BACKTEST.tpl. Setelah template diterapkan, lanjutkan pemasangan indikator pada bagian 2.','template-apply.png']
  ];
  const templateGrid=document.createElement('ol');templateGrid.className='tf-pine-steps';
  for(const [title,text,file] of templateSteps){const item=document.createElement('li'),heading=document.createElement('h4'),desc=document.createElement('p');heading.textContent=title;desc.textContent=text;item.append(heading,desc);if(file){const image=document.createElement('img'),a=document.createElement('a');image.src=chrome.runtime.getURL('assets/metatrader-guide/'+file);image.alt=title;image.loading='lazy';image.decoding='async';a.href=image.src;a.target='_blank';a.rel='noopener';a.title='Buka gambar ukuran penuh';a.append(image);item.append(a);}templateGrid.append(item);}
  const pdfButton=document.createElement('button');pdfButton.type='button';pdfButton.dataset.guideDownload='';pdfButton.textContent='Download Panduan Tutorial (PDF)';pdfButton.style.marginBottom='14px';templateTutorial.prepend(pdfButton);templateTutorial.append(templateGrid);section.append(templateTutorial);
  const tutorial=document.createElement('div');tutorial.className='tf-mt-tutorial tf-pine-tutorial';
  tutorial.innerHTML='<h3>2. Pasang indikator MT4 / MT5</h3><p>Untuk MT4, selesaikan pemasangan template BACKTEST di atas terlebih dahulu. Gunakan file EX4 pada MT4 atau EX5 pada MT5. Foto berikut mencontohkan MT4; pada MT5 gunakan folder MQL5.</p>';
  const steps=[
   ['Unduh indikator lewat Submit','Pilih analis, pair, Time Range, dan MT4 / MT5, lalu klik Submit. Tunggu proses selesai. Di folder Downloads, pilih file .ex4 / .ex5 yang baru diunduh lalu tekan Ctrl + C untuk menyalinnya.','download.png'],
   ['Buka Data Folder MetaTrader','Pada terminal MetaTrader yang akan dipakai, klik File → Open Data Folder.','data-folder.png'],
   ['Buka folder MQL4 / MQL5','MT4: buka folder MQL4. MT5: buka folder MQL5.','mql-folder.png'],
   ['Buka folder Indicators','Di dalam MQL4 / MQL5, buka folder Indicators.','indicators-folder.png'],
   ['Tempel file indikator','Tekan Ctrl + V di folder Indicators untuk menempelkan file yang tadi disalin. MT4 memakai .ex4; MT5 memakai .ex5.','paste-file.png'],
   ['Pasang ke chart','Kembali ke MetaTrader. Pada Navigator → Indicators, klik kanan lalu Refresh jika nama indikator belum muncul. Buka chart pair yang sesuai, klik kanan nama indikator → Attach to a chart, lalu konfirmasi pengaturannya dengan OK.','attach-chart.png'],
   ['Periksa hasil indikator','Indikator tampil di chart dengan nama analis dan pair. Gunakan centang Trade TP, Trade SL, Trade Cancelled, Swap, dan Comm untuk mengatur tampilan serta biaya. Foto ini contoh hasil; susunan panel mengikuti versi indikator yang dibuat.','result.png']
  ];
  const grid=document.createElement('ol');grid.className='tf-pine-steps';
  const appendImage=(parent,title,file)=>{const image=document.createElement('img'),a=document.createElement('a');image.src=chrome.runtime.getURL('assets/metatrader-guide/'+file);image.alt=title;image.loading='lazy';image.decoding='async';a.href=image.src;a.target='_blank';a.rel='noopener';a.title='Buka gambar ukuran penuh';a.append(image);parent.append(a);};
  for(let i=0;i<steps.length;i++){
   const [title,text,file]=steps[i],item=document.createElement('li'),heading=document.createElement('h4');heading.dataset.step=i===2?'3–5':String(i+1);heading.textContent=i===2?'Salin indikator ke folder yang tepat':title;item.append(heading);
   if(i===2){item.className='tf-install-folder-group';for(let j=2;j<=4;j++){const [subTitle,subText,subFile]=steps[j],part=document.createElement('div'),label=document.createElement('h5'),desc=document.createElement('p');part.className='tf-install-substep';label.textContent=(j+1)+' · '+subTitle;desc.textContent=subText;part.append(label,desc);appendImage(part,subTitle,subFile);item.append(part);}i=4;}
   else{const desc=document.createElement('p');desc.textContent=text;item.append(desc);appendImage(item,title,file);}
   grid.append(item);
  }
  const compactStyle=document.createElement('style');compactStyle.textContent='.tf-pine-steps{align-items:start}.tf-template-tutorial img{max-height:300px;width:auto;max-width:100%;object-fit:contain}.tf-mt-tutorial h4[data-step]:before{content:attr(data-step) " · "}.tf-install-substep{padding:10px 0;border-top:1px solid #263c55}.tf-install-substep:first-of-type{border-top:0;padding-top:0}.tf-install-substep:last-child{padding-bottom:0}.tf-install-substep h5{margin:0 0 6px;font-weight:600;font-size:13px;line-height:1.5;color:#e3efff}.tf-install-substep p{margin-bottom:9px}';document.head.append(compactStyle);
  tutorial.append(grid);section.append(tutorial);
 }
 form.addEventListener('change',()=>{code.value='';copy.disabled=true;codeMessage.textContent='Pilihan berubah. Klik Submit untuk memperbarui script.';});

 const options=(select,values,placeholder)=>{select.replaceChildren(new Option(placeholder,''),...values.map(v=>new Option(v,v)));};
 const selected=()=>{
  let rows=history.filter(r=>r.analyst===form.elements.analyst.value&&String(r.pair||'').toUpperCase()===form.elements.pair.value);
  const dates=rows.map(r=>stamp(r.displayDate||r.closedDate)).filter(Boolean).sort();
  if(form.elements.range.value!=='ALL'&&dates.length){const latest=dates.at(-1),month=Number(latest.slice(0,4))*12+Number(latest.slice(5,7))-1,cut=month-Number(form.elements.range.value)+1;rows=rows.filter(r=>{const d=stamp(r.displayDate||r.closedDate);return d&&Number(d.slice(0,4))*12+Number(d.slice(5,7))-1>=cut;});}
  return rows.sort((a,b)=>stamp(a.displayDate||a.closedDate).localeCompare(stamp(b.displayDate||b.closedDate)));
 };
 const refresh=()=>{
  const rows=selected(),trades=rows.filter(r=>!cancelled(r));let tp=0,sl=0,pp=0,lp=0,rTotal=0,cl=0,maxCL=0,equity=0,peak=0,dd=0,missing=0;
  for(const row of trades){const p=number(row.pips);if(p==null)continue;if(p>0){tp++;pp+=p;cl=0;}else if(p<0){sl++;lp+=p;cl++;maxCL=Math.max(maxCL,cl);}
   equity+=p;peak=Math.max(peak,equity);dd=Math.max(dd,peak-equity);
   const entry=number(row.entry),stop=number(row.stopLoss),risk=entry!=null&&stop!=null?Math.abs(entry-stop)/pipSize(row.pair):0;
   if(risk>0)rTotal+=p/risk;else missing++;
  }
  const date=r=>{const s=stamp(r?.displayDate||r?.closedDate);return s?`${s.slice(8,10)}/${s.slice(5,7)}/${s.slice(0,4)}`:'—';};
  const result=inspect(rows),counts=new Map();for(const item of result.bad)for(const reason of item.reasons)counts.set(reason,(counts.get(reason)||0)+1);
  audit.replaceChildren();skipLabel.hidden=!result.good.length||!result.bad.length;
  if(rows.length){const p=document.createElement('p');p.textContent=result.good.length+' dari '+rows.length+' sinyal siap untuk indikator. '+result.bad.length+' sinyal belum lengkap / tidak valid.';audit.append(p);
   if(result.bad.length){const details=document.createElement('details'),heading=document.createElement('summary');heading.textContent='Lihat rincian data yang perlu diperbarui';details.append(heading);
    const text=document.createElement('p');text.textContent=[...counts].map(([key,count])=>key+': '+count).join(' · ')+'. Satu sinyal bisa memiliki beberapa kolom yang kurang. Data lama tidak otomatis memperoleh kolom baru; scan history ulang untuk melengkapinya.';details.append(text);
    const sample=document.createElement('p');sample.textContent='Contoh Signal ID: '+result.bad.slice(0,10).map(item=>item.id+' ('+item.reasons.join(', ')+')').join(' · ');details.append(sample);audit.append(details);
   }
  }
  summary.replaceChildren();if(!rows.length)return;
  const table=document.createElement('table');
  for(const cells of [[`TP: ${tp}`,`SL: ${sl}`,`R: ${missing?'—':fmt(rTotal)}`],[`TP pips: ${fmt(pp)}`,`SL pips: ${fmt(lp)}`,`Cancelled: ${rows.length-trades.length}`],[`Cons Loss: ${maxCL}`,`Drawdown: ${fmt(dd)} pips`, `Range Date: ${date(rows[0])} – ${date(rows.at(-1))}`]]){
   const tr=document.createElement('tr');for(const text of cells){const td=document.createElement('td');td.textContent=text;tr.append(td);}table.append(tr);
  }
  table.title='R = jumlah PnL pips ÷ SL pips rencana per trade. Cancelled dikecualikan.';summary.append(table);
 };
 async function load(){const data=await chrome.storage.local.get('tfHistorySignals');history=Array.isArray(data.tfHistorySignals)?data.tfHistorySignals:[];options(form.elements.analyst,[...new Set(history.map(r=>r.analyst).filter(Boolean))].sort(),'Pilih Analis');refresh();}
 function navigate(){
  const open=location.hash===route,wasOpen=!section.hidden;
  document.body.classList.toggle('tf-builder-open',['#indicator-builder','#tradingview-builder'].includes(location.hash));section.hidden=!open;
  li.classList.toggle('active',open);link.setAttribute('aria-current',open?'page':'false');
  if(open){
   nav.querySelectorAll(':scope>li.active').forEach(item=>{if(item!==li)item.classList.remove('active');});
   nav.querySelectorAll('a[aria-current="page"]').forEach(a=>{if(a!==link)a.setAttribute('aria-current','false');});
   document.getElementById('tf-risk-explainer')?.remove();document.body.classList.remove('tf-risk-explainer-open');
   if(!wasOpen)load().catch(e=>setMessage(e.message));
  }
 }
 window.addEventListener('popstate',navigate);
 window.addEventListener('tf-dashboard-routechange',navigate);
 window.addEventListener('hashchange',navigate);navigate();
 form.addEventListener('change',e=>{if(['analyst','pair','range'].includes(e.target.name))form.elements.skipIncomplete.checked=false;if(e.target.name==='analyst')options(form.elements.pair,[...new Set(history.filter(r=>r.analyst===e.target.value).map(r=>String(r.pair||'').toUpperCase()).filter(Boolean))].sort(),'Pilih Pair');refresh();});
 form.addEventListener('reset',()=>{code.value='';copy.disabled=true;codeMessage.textContent='';requestId++;busy=false;port?.disconnect();port=null;form.querySelector('[type=submit]').disabled=false;progress.value=0;setMessage('');setTimeout(()=>{options(form.elements.pair,[],'Pilih Pair');refresh();},0);});
 form.addEventListener('submit',async e=>{
  e.preventDefault();flash(e.submitter||form.querySelector('[type=submit]'));if(busy)return;if(tv){progress.value=10;const ok=await buildSource(true);progress.value=ok?100:0;return;}const records=selected();if(!records.length){setMessage('Tidak ada data pada pilihan ini.');return;}
  const {good:rows,bad}=inspect(records);
  if(!rows.length){setMessage('Belum ada sinyal siap ekspor. Buka rincian data di atas untuk melihat kolom yang kurang, lalu scan history ulang. Tanggal dan harga tidak akan ditebak.');return;}
  if(bad.length&&!form.elements.skipIncomplete.checked){setMessage(bad.length+' sinyal belum lengkap. Lengkapi lewat scan ulang, atau centang persetujuan di atas untuk mengekspor hanya '+rows.length+' sinyal yang siap.');return;}
  if(rows.length>10000){setMessage('Batas kompilasi 10.000 sinyal. Pilih periode yang lebih pendek.');return;}
  const skipped=bad.length;
  const platform=form.elements.platform.value,job=++requestId;
  const downloadName=exportFilename(form.elements.analyst.value,platform==='MT5'?'ex5':'ex4');
  await buildSource(false);
  busy=true;const submit=form.querySelector('[type=submit]');submit.disabled=true;const availability=await checkCompiler();
  if(job!==requestId)return;
  if(!availability.ok){busy=false;submit.disabled=false;setMessage('Setup compiler belum selesai. Ikuti keterangan pada panel Compiler lokal di atas.');return;}
  if(!(platform==='MT5'?availability.mt5:availability.mt4)){busy=false;submit.disabled=false;setMessage('MetaEditor '+platform+' belum terdeteksi. Instal dan buka terminal tersebut sekali, lalu Cek koneksi.');return;}
  progress.value=5;setMessage('Menghubungkan compiler lokal...');let chunks=[];
  submit.disabled=true;
  const finish=()=>{busy=false;submit.disabled=false;port?.disconnect();port=null;};
  try{
   port=chrome.runtime.connectNative(HOST);
   port.onDisconnect.addListener(()=>{const error=chrome.runtime.lastError;if(busy){busy=false;submit.disabled=false;setMessage(error?'Compiler lokal belum terhubung. Unduh dan buka installer Windows pada panel Compiler lokal, lalu klik Cek koneksi.':'Compiler terputus. Coba kembali.');}});
   port.onMessage.addListener(async result=>{
    if(result.type==='progress'){progress.value=result.value;setMessage(result.message);}
    else if(result.type==='chunk'){const raw=atob(result.data);chunks.push(Uint8Array.from(raw,c=>c.charCodeAt(0)));}
    else if(result.type==='error'){setMessage(result.message);finish();}
    else if(result.type==='done'){
     try{if(result.compilerVersion!=='2.29')throw new Error('Perbarui pendamping melalui installer Windows di atas, lalu Cek koneksi kembali.');
      const blob=new Blob(chunks,{type:'application/octet-stream'}),hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))].map(v=>v.toString(16).padStart(2,'0')).join('');
      if(blob.size!==result.size||hash!==result.sha256||!/^TF_RR_\d{8}_\d{6}\.ex[45]$/.test(result.filename))throw new Error('Verifikasi hasil kompilasi gagal.');
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=downloadName;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);progress.value=100;setMessage('Indikator selesai dan diunduh: '+rows.length+' sinyal.'+(skipped?' '+skipped+' sinyal dilewati sesuai persetujuan.':''));
     }catch(error){setMessage(error.message);}finally{chunks=[];finish();}
    }
   });port.postMessage({platform,rows});
  }catch(error){setMessage(error.message);finish();}
 });
}
function init(){mount(false);mount(true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
