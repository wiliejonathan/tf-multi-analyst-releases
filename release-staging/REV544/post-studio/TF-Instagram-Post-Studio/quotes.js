(() => {
  const $=id=>document.getElementById(id);
  const bank={
    analis:[
      'Analisis yang baik memberi ruang untuk salah, lalu menyiapkan cara menghadapinya.',
      'Biarkan catatan transaksi menjelaskan kualitas analisismu, bukan satu hasil yang kebetulan bagus.',
      'Analis yang bertumbuh berani memperbaiki proses tanpa sibuk membela prediksi.',
      'Sinyal yang tidak diambil lebih baik daripada risiko yang tidak dipahami.',
      'Rencana entry perlu jelas. Rencana menghadapi kesalahan perlu lebih jelas.',
      'Di balik portofolio yang matang, ada evaluasi yang tidak selalu terlihat.',
      'Jangan hanya mencatat kapan analisismu benar. Pelajari juga bagaimana ia bisa salah.',
      'Tugas analis adalah membaca peluang dengan jujur, termasuk saat peluang itu belum ada.',
      'Konsistensi lahir dari proses yang bisa dijelaskan dan diulang.',
      'Prediksi bisa berubah. Tanggung jawab terhadap risiko tetap perlu dijaga.',
      'Satu bulan profit adalah hasil. Cara mengelola bulan sulit adalah pelajaran.',
      'Portofolio adalah percakapan panjang antara keputusan dan konsekuensinya.',
      'Lebih baik melewatkan peluang daripada memaksakan alasan untuk masuk.',
      'Angka yang kurang nyaman sering memberi pelajaran yang paling berguna.',
      'Evaluasi yang jujur dimulai ketika keinginan terlihat benar berhenti memimpin.',
      'Bagikan analisis yang kamu pahami, termasuk batas dari keyakinanmu.',
      'Sebelum mencari sinyal berikutnya, pahami pelajaran dari sinyal sebelumnya.',
      'Nama baik analis dibangun melalui proses panjang, bukan janji singkat.',
      'Kepercayaan tumbuh saat risiko dijelaskan seterang peluangnya.',
      'Analisis tidak selesai saat sinyal dibuat. Evaluasi dimulai setelah hasilnya tercatat.'
    ],
    trader:[
      'Tidak semua gerakan harga perlu menjadi transaksi.',
      'Disiplin paling berarti saat rencana terasa sulit untuk diikuti.',
      'Jeda yang tepat juga bagian dari keputusan trading.',
      'Kerugian perlu dievaluasi, bukan dikejar kembali dengan emosi.',
      'Sebelum menekan entry, pastikan kamu memahami batas risikonya.',
      'Keputusan tenang dimulai jauh sebelum harga menyentuh area entry.',
      'Catat prosesmu saat menang, agar kamu tidak belajar hanya ketika kalah.',
      'Sabar bukan menunggu tanpa arah. Sabar adalah setia pada syarat yang sudah ditetapkan.',
      'Trading memberi banyak kesempatan untuk bereaksi. Pilih waktu untuk berpikir.',
      'Ukuran posisi perlu mengikuti rencana, bukan keinginan menutup kerugian.',
      'Tidak bertransaksi hari ini bisa menjadi keputusan yang paling disiplin.',
      'Rasa yakin perlu ditemani batas risiko yang nyata.',
      'Satu transaksi tidak perlu membawa seluruh harapanmu.',
      'Jurnal yang jujur lebih berguna daripada ingatan yang hanya memilih kemenangan.',
      'Jangan biarkan hasil kemarin mengambil alih keputusan hari ini.',
      'Pasar tidak perlu tahu targetmu. Rencanamu yang perlu tahu batasmu.',
      'Kemajuan kadang terlihat sebagai kesalahan yang tidak lagi kamu ulangi.',
      'Berani entry perlu diimbangi kesiapan menerima hasilnya.',
      'Fokus pada keputusan yang bisa kamu kendalikan, lalu evaluasi hasilnya dengan jujur.',
      'Tetap belajar saat profit. Tetap berpikir jernih saat loss.'
    ],
    investor:[
      'Memahami risiko adalah bagian dari menghargai modal yang kamu percayakan.',
      'Portofolio perlu dibaca sampai bagian yang sulit, bukan hanya bagian yang menarik.',
      'Sebelum memilih analis, pahami bagaimana kamu akan menghadapi hasil yang tidak sesuai harapan.',
      'Kepercayaan yang sehat tumbuh bersama pertanyaan yang baik.',
      'Angka profit menarik perhatian. Riwayat pengelolaan risiko layak mendapat perhatian yang sama.',
      'Jangan terburu memilih hanya karena hasil terakhir terlihat bagus.',
      'Menjadi investor juga berarti terus belajar membaca proses di balik angka.',
      'Rencana yang dipahami lebih mudah dievaluasi ketika keadaan berubah.',
      'Modal memiliki cerita panjang. Perlakukan setiap keputusan dengan pertimbangan.',
      'Menunggu informasi yang cukup adalah bagian dari menjaga kualitas keputusan.',
      'Tanyakan bukan hanya berapa hasilnya, tetapi bagaimana risiko dijalani.',
      'Riwayat adalah bahan evaluasi, bukan janji untuk masa depan.',
      'Pahami alasanmu memilih sebelum mencari alasan untuk bertahan.',
      'Keputusan yang matang memerlukan ruang untuk berpikir, bukan tekanan untuk segera ikut.',
      'Kenali batas kenyamananmu sebelum menguji ketahananmu.',
      'Baca portofolio sebagai rangkaian keputusan, bukan sekadar angka akhir.',
      'Keterbukaan terhadap risiko membuat diskusi investasi lebih berarti.',
      'Jangan menyerahkan proses berpikir hanya karena mengikuti orang lain.',
      'Kesabaran perlu berjalan bersama evaluasi yang teratur.',
      'Tujuan yang jelas membantu kamu menilai pilihan dengan lebih tenang.'
    ]
  };
  for(const category of Object.keys(bank))bank[category]=[...new Set([...bank[category],...(globalThis.TFQuoteAddition?.[category]||[])])];
  let folder=null,bag=[],bagCategory='',last='',busy=false,timer,previewSerial=0;
  const status=(s,error=false)=>{$('quoteStatus').textContent=s;$('quoteStatus').classList.toggle('error',error);};
  function storeHandle(value){return new Promise((resolve,reject)=>{const q=indexedDB.open('TFQuoteStudio',1);q.onupgradeneeded=()=>q.result.createObjectStore('handles');q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,tx=db.transaction('handles',value?'readwrite':'readonly'),req=value?tx.objectStore('handles').put(value,'folder'):tx.objectStore('handles').get('folder');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();};});}
  function linesFor(c,text,width){const out=[];for(const para of text.split('\n')){if(!para.trim()){out.push('');continue;}let line='';for(const word of para.trim().split(/\s+/)){if(c.measureText((line?line+' ':'')+word).width<=width)line+=(line?' ':'')+word;else{if(line)out.push(line);line='';let part='';for(const ch of word){if(c.measureText(part+ch).width>width){out.push(part);part='';}part+=ch;}line=part;}}if(line)out.push(line);}return out;}
  async function render(text){
    const {canvas,c}=ExportQuality.create();
    const bg=c.createLinearGradient(0,0,1080,1440);bg.addColorStop(0,'#171122');bg.addColorStop(.5,'#39294e');bg.addColorStop(1,'#20172e');c.fillStyle=bg;c.fillRect(0,0,1080,1440);
    c.strokeStyle='#bda5ed40';c.lineWidth=1.5;for(const [x,y]of [[-80,-50],[1180,1500]])for(const radius of [250,290]){c.beginPath();c.arc(x,y,radius,0,Math.PI*2);c.stroke();}
    c.fillStyle='#0b0912';c.fillRect(740,177,269,234);c.fillRect(72,1040,260,240);
    c.save();c.shadowColor='#00000080';c.shadowBlur=45;c.shadowOffsetY=22;
    const card=c.createLinearGradient(100,205,970,1240);card.addColorStop(0,'#30263f');card.addColorStop(.6,'#221b30');card.addColorStop(1,'#392b4b');c.fillStyle=card;c.fillRect(100,205,880,1040);c.restore();
    c.strokeStyle='#c9b3ef35';c.strokeRect(100,205,880,1040);
    c.textAlign='left';c.fillStyle='#bba4ee';c.font='bold 160px Georgia';c.fillText('“',155,454);
    let size=64,lines;do{c.font=`${size}px Georgia`;lines=linesFor(c,text.trim(),740);if(lines.length*size*1.28<=480)break;size-=2;}while(size>=24);
    if(lines.length*size*1.28>480)throw Error('Quotes terlalu panjang untuk desain. Ringkas teks sebelum export.');
    const lineHeight=size*1.28,y=745-(lines.length-1)*lineHeight/2;
    c.fillStyle='#f2edf9';c.font=`${size}px Georgia`;c.save();c.strokeStyle='#f2edf9';c.lineWidth=.3;c.lineJoin='round';lines.forEach((line,i)=>{c.strokeText(line,160,y+i*lineHeight);c.fillText(line,160,y+i*lineHeight);});c.restore();
    const endY=y+(lines.length-1)*lineHeight,tailWidth=c.measureText(lines.at(-1)||'').width;c.fillStyle='#bba4ee';c.fillText('”',Math.min(915,168+tailWidth),endY);
    c.fillStyle='#c0b3d2';c.font='600 18px Arial';c.fillText('CATATAN UNTUK ANALIS, TRADER & INVESTOR',160,1120);
    const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});const [tf,sf]=await Promise.all([load('assets/tf-analyzer.jpeg'),load('assets/skill-fusion-white.png')]);
    c.save();c.beginPath();c.roundRect(140,1166,44,44,10);c.clip();c.drawImage(tf,140,1166,44,44);c.restore();c.textAlign='left';c.fillStyle='#ded2ee';c.font='bold 19px Arial';c.fillText('@tf_analyzer_analyst',199,1194);
    c.textAlign='right';c.fillStyle='#e4d9f3';c.font='bold 21px Arial';c.fillText('Skill Fusion',850,286);c.save();c.globalCompositeOperation='screen';c.filter='brightness(60%) contrast(600%)';c.drawImage(sf,865,254,64,62);c.restore();

    return ExportQuality.finish(canvas);
  }
  function caption(text){return [text.trim(),'','TF Analyzer Analyst × Skill Fusion','@tf_analyzer_analyst','','#Forex #tradersfamily #trading #fyp #portofolio #johnpaul77 #TFeducation #signalforex #TFAnalyzerAnalyst #SkillFusion'].join('\r\n');}
  async function preview(){const serial=++previewSerial,text=$('quoteText').value.trim();$('quoteCharacters').textContent=`${$('quoteText').value.length} / 600`;$('quoteName').textContent='Nomor otomatis + lima kata pertama.png';
    if(!text){$('quotePreview').hidden=true;return;}try{const result=await render(text);if(serial!==previewSerial)return;$('quotePreview').src=result.preview;$('quotePreview').hidden=false;}catch(e){status(e.message,true);}
  }
  async function count(){if(!folder)return;try{const s=await OutputFiles.scan(folder,true);$('quoteFolderCount').textContent=s.folders;$('quoteFileCount').textContent=s.files;$('quoteNext').textContent=String(s.next).padStart(2,'0');}catch(e){status('Tidak dapat membaca folder: '+e.message,true);}}
  const quoteKey=text=>text.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  async function generate(){
    $('quoteGenerate').disabled=true;
    try{await navigator.locks.request('tf-quotes-generate',async()=>{
      const saved=await chrome.storage.local.get(['quoteUsed','quoteDraft']);
      const used=new Set(saved.quoteUsed||[]);
      if(saved.quoteDraft)used.add(quoteKey(saved.quoteDraft));
      const category=$('quoteCategory').value;
      const pool=[...new Set(category==='semua'?Object.values(bank).flat():bank[category])];
      const available=pool.filter(q=>!used.has(quoteKey(q)));
      if(!available.length){status('Stok quotes kategori ini habis. Pilih kategori lain atau tulis quotes sendiri. Riwayat tidak direset otomatis.',true);return;}
      const text=available[Math.floor(Math.random()*available.length)];used.add(quoteKey(text));
      await chrome.storage.local.set({quoteUsed:[...used],quoteDraft:text,quoteCategory:category});
      $('quoteText').value=text;changed();status(`Quotes baru siap · ${available.length-1} dari ${pool.length} quotes kategori ini tersisa. Quotes yang pernah muncul tidak diulang.`);
    });}catch(e){status(e.message,true);}finally{$('quoteGenerate').disabled=false;}
  }
  function changed(){clearTimeout(timer);chrome.storage.local.set({quoteDraft:$('quoteText').value,quoteCategory:$('quoteCategory').value});timer=setTimeout(preview,180);}
  $('quoteGenerate').onclick=generate;$('quoteText').oninput=changed;$('quoteCategory').onchange=()=>{bag=[];changed();};
  $('quoteFolder').onclick=async()=>{try{folder=await showDirectoryPicker({id:'tf-quotes-output',mode:'readwrite'});await storeHandle(folder);$('quoteFolderLabel').textContent='Hasil: '+folder.name;await count();status('Folder quotes tersambung.');}catch(e){if(e.name!=='AbortError')status(e.message,true);}};
  $('quoteMark').onclick=async()=>{if(busy)return;busy=true;$('quoteMark').disabled=true;$('quoteExport').disabled=true;try{if(!folder)throw Error('Pilih folder hasil terlebih dahulu.');if(await folder.requestPermission({mode:'readwrite'})!=='granted')throw Error('Izin folder belum diberikan.');const n=await OutputFiles.markFolders(folder,Number($('quoteMarkStart').value),Number($('quoteMarkEnd').value),'quotes');await count();status(`${n} folder ditandai Done! dan akan dilewati.`);}catch(e){status(e.message,true);}finally{busy=false;$('quoteMark').disabled=false;$('quoteExport').disabled=false;}};
  $('quoteExport').onclick=async()=>{if(busy)return;const text=$('quoteText').value.trim();if(!text){status('Generate atau tulis quotes terlebih dahulu.',true);return;}if(!folder){status('Pilih folder hasil quotes terlebih dahulu.',true);return;}busy=true;$('quoteExport').disabled=true;
    try{if(await folder.requestPermission({mode:'readwrite'})!=='granted')throw Error('Izin menyimpan folder belum diberikan.');await count();const stem=OutputFiles.filename(text),result=await render(text),saved=await OutputFiles.writeQuoteFolder(folder,stem,result.blob,caption(text));await count();status(saved.marked?'Dilewati: folder sudah ditandai Done! — '+saved.folderName:saved.skipped?'PNG yang sama dilewati; deskripsi TXT tersedia: '+saved.captionName:'Folder tersimpan: '+saved.folderName+' · PNG + TXT');}
    catch(e){status(e.message,true);}finally{busy=false;$('quoteExport').disabled=false;}
  };
  async function init(){const data=await chrome.storage.local.get(['quoteDraft','quoteCategory']);$('quoteText').value=data.quoteDraft||'';$('quoteCategory').value=data.quoteCategory||'semua';try{folder=await storeHandle();if(folder){$('quoteFolderLabel').textContent='Folder terakhir: '+folder.name;await count();}}catch{}await preview();}
  for(const mode of ['Posts','Quotes'])$('nav'+mode).onclick=()=>{for(const tab of ['Posts','Quotes']){$('nav'+tab).setAttribute('aria-selected',String(tab===mode));$(tab.toLowerCase()+'Panel').hidden=tab!==mode;}};
  globalThis.QuoteStudio={render,caption,filename:OutputFiles.filename,bank};init().catch(e=>status(e.message,true));
})();
