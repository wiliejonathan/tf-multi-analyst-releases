(function(root){
  let active=null;
  function select(channels,options={}){
    const heading=options.all?'Pilih Analis untuk Scan ALL':'Pilih Analis untuk Update',confirmation=options.all?'Konfirmasi Scan ALL':'Konfirmasi Update';
    if(active)return Promise.resolve(null);
    const seen=new Set(),rows=channels.filter(c=>c&&c.url&&!seen.has(c.url)&&seen.add(c.url));
    if(!rows.length)return Promise.resolve(null);
    return new Promise(resolve=>{
      const previous=document.activeElement,overlay=document.createElement('div');
      overlay.id='tf-update-picker';overlay.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#000a;display:flex;align-items:center;justify-content:center;padding:12px';
      const card=document.createElement('div');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','tf-update-picker-title');card.style.cssText='width:100%;max-width:280px;max-height:70vh;overflow:auto;box-sizing:border-box;background:#0b1425;color:#e5edf8;border:1px solid #475569;border-radius:10px;padding:10px;font:9.9px/1.4 Arial,Segoe UI,sans-serif';
      const title=document.createElement('h2');title.id='tf-update-picker-title';title.textContent=heading;title.style.cssText='font-size:11.7px;margin:0 0 6px';
      const help=document.createElement('p');help.textContent='Pilih analis yang ingin diperbarui. Pair tetap mengikuti pilihan tersimpan.';help.style.cssText='color:#a6b4c8;font-size:9px;margin:6px 0';
      const table=document.createElement('table');table.style.cssText='width:100%;border-collapse:collapse';
      const head=table.createTHead().insertRow(),tick=head.appendChild(document.createElement('th')),names=head.appendChild(document.createElement('th'));names.textContent='Nama Analis';names.style.textAlign='left';
      const all=document.createElement('input');all.type='checkbox';all.checked=true;all.setAttribute('aria-label','Tick ALL');const label=document.createElement('label');label.append(all);tick.append(label);tick.style.cssText='width:26px;text-align:left;padding:5px 0';
      const body=table.createTBody(),checks=[];
      rows.forEach((c,i)=>{const tr=body.insertRow(),td=tr.insertCell(),name=tr.insertCell(),input=document.createElement('input');input.type='checkbox';input.checked=true;input.setAttribute('aria-label','Pilih '+c.name);input.dataset.index=String(i);td.append(input);name.textContent=c.name||'Analis '+(i+1);name.style.cssText='text-align:left;padding:5px 0;overflow-wrap:anywhere';checks.push(input);});
      const counter=document.createElement('p');counter.id='tf-update-picker-count';counter.style.cssText='color:#a6b4c8;font-size:9px;margin:6px 0';
      const actions=document.createElement('div');actions.style.cssText='display:flex;gap:6px;margin-top:8px';
      const button=(text,id)=>{const b=document.createElement('button');b.type='button';b.id=id;b.textContent=text;b.style.cssText='flex:1;padding:5px;height:25.2px;font:9.45px Arial;border-radius:7px;border:1px solid #64748b;background:#172337;color:#e5edf8;cursor:pointer';return b;};
      const cancel=button('Cancel','tf-update-picker-cancel'),submit=button('Submit','tf-update-picker-submit');submit.style.background='#14532d';submit.style.borderColor='#22c55e';actions.append(cancel,submit);card.append(title,help,table,counter,actions);overlay.append(card);const style=document.createElement('style');style.textContent='#tf-update-picker table,#tf-update-picker th,#tf-update-picker td,#tf-update-picker label{font:9.9px/1.4 Arial,Segoe UI,sans-serif!important;background:transparent!important;color:#e5edf8!important}#tf-update-picker table{margin:0!important}#tf-update-picker th,#tf-update-picker td{border:0!important;border-bottom:1px solid #263449!important}#tf-update-picker input[type=checkbox]{width:12px!important;height:12px!important;min-width:12px!important;margin:0!important;padding:0!important;accent-color:#22c55e}#tf-update-picker label{margin:0!important;padding:0!important;display:inline-flex!important;align-items:center}#tf-update-picker button{font:9.45px Arial!important;margin:0!important;min-height:25.2px!important}';overlay.append(style);document.body.append(overlay);active=overlay;
      let confirming=false,finished=false;
      const close=value=>{if(finished)return;finished=true;document.removeEventListener('keydown',key);overlay.remove();active=null;previous?.focus();resolve(value);};
      const selected=()=>rows.filter((c,i)=>checks[i].checked);
      const sync=()=>{const n=selected().length;all.checked=n===rows.length;all.indeterminate=n>0&&n<rows.length;counter.textContent=n+' / '+rows.length+' analis dipilih';submit.disabled=n===0;submit.style.opacity=n===0?'.45':'1';};
      all.onchange=()=>{checks.forEach(c=>c.checked=all.checked);sync();};checks.forEach(c=>c.onchange=sync);cancel.onclick=()=>close(null);
      submit.onclick=()=>{const chosen=selected();if(!chosen.length)return;confirming=true;table.hidden=true;counter.hidden=true;title.textContent=confirmation;help.textContent=options.all?'Scan ulang '+chosen.length+' analis yang dipilih dengan timeframe ALL? Hasil scan menimpa data analis terpilih; JSON import asli tetap utuh.':'Update '+chosen.length+' analis yang dipilih? Data analis lain tetap tersimpan. Proses Update menggunakan timeframe 3 bulan.';submit.textContent='Confirm';submit.id='tf-update-picker-confirm';cancel.onclick=()=>{confirming=false;table.hidden=false;counter.hidden=false;title.textContent=heading;help.textContent='Pilih analis yang ingin diperbarui. Pair tetap mengikuti pilihan tersimpan.';submit.textContent='Submit';submit.id='tf-update-picker-submit';submit.onclick=confirmStart;cancel.onclick=()=>close(null);sync();};submit.onclick=()=>close(chosen.map(c=>c.url));cancel.focus();};
      const confirmStart=submit.onclick;
      const key=e=>{if(e.key==='Escape'){e.preventDefault();cancel.click();}if(e.key==='Tab'){const focusable=[...card.querySelectorAll('button,input')].filter(el=>!el.disabled&&!el.closest('[hidden]'));const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
      document.addEventListener('keydown',key);sync();all.focus();
    });
  }
  root.TFUpdatePicker={select};
})(globalThis);
