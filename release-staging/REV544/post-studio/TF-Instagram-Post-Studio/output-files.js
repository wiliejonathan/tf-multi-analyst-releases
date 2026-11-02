(() => {
  const number=name=>Number(String(name).match(/^(\d+)[.\- ]/)?.[1]||0);
  function nextNumber(values){const used=new Set(values.filter(n=>Number.isSafeInteger(n)&&n>0));let next=used.size?Math.min(...used):1;while(used.has(next))next++;return next;}
  async function scan(dir,recursive=false){let folders=0,files=0,maxFolder=0,maxFile=0;const names=[],numbers=[];
    for await(const[name,handle]of dir.entries()){
      if(number(name)>0)numbers.push(number(name));
      if(handle.kind==='directory'){folders++;maxFolder=Math.max(maxFolder,number(name));if(recursive){const sub=await scan(handle,true);folders+=sub.folders;files+=sub.files;}}
      else if(/\.png$/i.test(name)){files++;maxFile=Math.max(maxFile,number(name));names.push(name);}
    }return {folders,files,maxFolder,maxFile,names,next:nextNumber(numbers),numbers};
  }
  async function writeNewPNG(dir,stem,blob,caption){return navigator.locks.request('tf-post-png-allocation',async()=>{
    async function companion(png){
      if(typeof caption!=='string')return null;
      const name=png.replace(/\.png$/i,'.txt');
      try{const file=await(await dir.getFileHandle(name)).getFile();if(file.size)return name;}catch(e){if(e.name!=='NotFoundError')throw e;}
      const handle=await dir.getFileHandle(name,{create:true}),writer=await handle.createWritable();
      try{await writer.write(new Blob([caption],{type:'text/plain;charset=utf-8'}));await writer.close();}catch(e){await writer.abort().catch(()=>{});throw e;}return name;
    }
    const state=await scan(dir),clean=PostCore.safe(stem).replace(/\.png$/i,'');
    const existing=state.names.find(n=>n.replace(/^\d+[.\- ]\s*/,'').replace(/\.png$/i,'').toLocaleLowerCase()===clean.toLocaleLowerCase());
    if(existing){const f=await(await dir.getFileHandle(existing)).getFile();if(f.size)return {name:existing,skipped:true,captionName:await companion(existing),state};}
    let next=state.next,name;for(;;){name=`${String(next++).padStart(2,'0')}. ${clean}.png`;try{await dir.getFileHandle(name);}catch(e){if(e.name==='NotFoundError')break;throw e;}}
    const handle=await dir.getFileHandle(name,{create:true}),writer=await handle.createWritable();try{await writer.write(blob);await writer.close();}catch(e){await writer.abort().catch(()=>{});throw e;}
    return {name,skipped:false,captionName:await companion(name),state:await scan(dir)};
  });}
  async function createPostFolder(root,stem){return navigator.locks.request('tf-post-png-allocation',async()=>{
    const state=await scan(root),name=`${String(state.next).padStart(2,'0')}. ${PostCore.safe(stem)}`;
    try{await root.getDirectoryHandle(name);throw Error('Nomor folder sedang dipakai; ulangi proses.');}catch(e){if(e.name!=='NotFoundError')throw e;}
    return {name,dir:await root.getDirectoryHandle(name,{create:true})};
  });}
  const marked=name=>/\bDone!/.test(name);
  async function markFolders(root,start,end,mode){return navigator.locks.request('tf-instagram-post-run',{ifAvailable:true},async lock=>{
    if(!lock)throw Error('Hentikan proses Analis sebelum Mark.');
    return navigator.locks.request('tf-post-png-allocation',async()=>{
      if(!root)throw Error('Pilih folder hasil terlebih dahulu.');
      if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||end<start)throw Error('Isi Start dan End yang valid (Start minimal 1).');
      const jobs=[];for await(const[name,dir]of root.entries())if(dir.kind==='directory'&&number(name)>=start&&number(name)<=end&&!marked(name))jobs.push({name,dir});
      let count=0;
      async function copy(source,dest){for await(const[name,handle]of source.entries()){
        if(handle.kind==='directory'){await copy(handle,await dest.getDirectoryHandle(name,{create:true}));continue;}
        const file=await handle.getFile(),target=await dest.getFileHandle(name,{create:true}),writer=await target.createWritable();try{await writer.write(file);await writer.close();}catch(e){await writer.abort().catch(()=>{});throw e;}
        const actual=new Uint8Array(await(await target.getFile()).arrayBuffer()),expected=new Uint8Array(await file.arrayBuffer());
        if(actual.length!==expected.length||!actual.every((v,i)=>v===expected[i]))throw Error('Verifikasi file gagal; folder asli tetap disimpan.');
      }}
      for(const job of jobs){const target=mode==='quotes'?job.name.replace(/^(\d+\.\s*)/,'$1Done! '):job.name+' Done!';
        try{await root.getDirectoryHandle(target);throw Error('Folder tujuan sudah ada: '+target);}catch(e){if(e.name!=='NotFoundError')throw e;}
        const dest=await root.getDirectoryHandle(target,{create:true});try{await copy(job.dir,dest);}catch(e){await root.removeEntry(target,{recursive:true}).catch(()=>{});throw e;}await root.removeEntry(job.name,{recursive:true});count++;
      }return count;
    });
  });}
  async function writeQuoteFolder(root,stem,blob,caption){return navigator.locks.request('tf-post-png-allocation',async()=>{
    const clean=PostCore.safe(stem),same=name=>name.replace(/^\d+[.\- ]\s*/,'').replace(/^Done!\s*/,'').replace(/\.png$/i,'').toLocaleLowerCase()===clean.toLocaleLowerCase();
    const numbers=[];let match=null,legacy=null;
    for await(const[name,handle]of root.entries()){
      if(number(name)>0)numbers.push(number(name));
      if(handle.kind==='directory'&&same(name))match={dir:handle,folderName:name};
      if(handle.kind==='file'&&/\.png$/i.test(name)&&same(name))legacy={dir:root,folderName:null,base:name.replace(/\.png$/i,'')};
    }
    // Preserve prior exports at the root; do not duplicate or move existing user files.
    let target=match||legacy;
    if(!target){const folderName=`${String(nextNumber(numbers)).padStart(2,'0')}. ${clean}`;target={dir:await root.getDirectoryHandle(folderName,{create:true}),folderName};}
    if(target.folderName&&marked(target.folderName))return {name:target.folderName,folderName:target.folderName,captionName:target.folderName,skipped:true,marked:true};
    const base=target.base||target.folderName,name=base+'.png',captionName=base+'.txt';
    async function saveMissing(fileName,data){
      try{const file=await(await target.dir.getFileHandle(fileName)).getFile();if(file.size)return false;}catch(e){if(e.name!=='NotFoundError')throw e;}
      const handle=await target.dir.getFileHandle(fileName,{create:true}),writer=await handle.createWritable();
      try{await writer.write(data);await writer.close();}catch(e){await writer.abort().catch(()=>{});throw e;}return true;
    }
    const created=await saveMissing(name,blob);await saveMissing(captionName,new Blob([caption],{type:'text/plain;charset=utf-8'}));
    return {name,captionName,folderName:target.folderName,skipped:!created};
  });}
  function filename(text){const words=String(text).match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)||[];if(!words.length)throw Error('Tulis quotes dengan minimal satu kata.');return PostCore.safe(words.slice(0,5).join(' '));}
  globalThis.OutputFiles={scan,writeNewPNG,writeQuoteFolder,filename,marked,markFolders,nextNumber,createPostFolder};
})();
