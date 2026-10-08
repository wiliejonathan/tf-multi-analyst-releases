(function(root){
  let active=null;
  function select(channels){
    if(active)return Promise.resolve(null);
    const seen=new Set(),rows=channels.filter(c=>c&&c.url&&!seen.has(c.url)&&seen.add(c.url));
    if(!rows.length)return Promise.resolve(null);
    return new Promise(resolve=>{
      const previous=document.activeElement,overlay=document.createElement('div');
      overlay.id='tf-update-picker';overlay.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#000a;display:flex;align-items:center;justify-content:center;padding:12px';
      const card=document.createElement('div');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','tf-update-picker-title');card.style.cssText='width:100%;max-width:440px;max-height:85vh;overflow:auto;box-sizing:border-box;background:#0b1425;color:#e5edf8;border:1px solid #475569;border-radius:14px;padding:16px;font:13px system-ui';
      const title=document.createElement('h2');title.id='tf-update-picker-title';title.textContent='Pilih Analis untuk Update';title.style.cssText='font-size:16px;margin:0 0 8px';
      const help=document.createElement('p');help.textContent='Pilih analis yang ingin diperbarui. Pair tetap mengikuti pilihan tersimpan.';help.style.cssText='color:#a6b4c8;font-size:12px';
      const table=document.createElement('table');table.style.cssText='width:100%;border-collapse:collapse';
      const head=table.createTHead().insertRow(),tick=head.appendChild(document.createElement('th')),names=head.appendChild(document.createElement('th'));names.textContent='Nama Analis';names.style.textAlign='left';
      const all=document.createElement('input');all.type='checkbox';all.checked=true;all.setAttribute('aria-label','Tick ALL');const label=document.createElement('label');label.append(all,document.createTextNode(' Ticker'));tick.append(label);tick.style.cssText='width:85px;text-align:left;padding:8px 0';
      const body=table.createTBody(),checks=[];
      rows.forEach((c,i)=>{const tr=body.insertRow(),td=tr.insertCell(),name=tr.insertCell(),input=document.createElement('input');input.type='checkbox';input.checked=true;input.setAttribute('aria-label','Pilih '+c.name);input.dataset.index=String(i);td.append(input);name.textContent=c.name||'Analis '+(i+1);name.style.cssText='text-align:left;padding:9px 0;overflow-wrap:anywhere';checks.push(input);});
      const counter=document.createElement('p');counter.id='tf-update-picker-count';counter.style.cssText='color:#a6b4c8;font-size:12px';
      const actions=document.createElement('div');actions.style.cssText='display:flex;gap:8px;margin-top:12px';
      const button=(text,id)=>{const b=document.createElement('button');b.type='button';b.id=id;b.textContent=text;b.style.cssText='flex:1;padding:9px;border-radius:9px;border:1px solid #64748b;background:#172337;color:#e5edf8;cursor:pointer';return b;};
      const cancel=button('Cancel','tf-update-picker-cancel'),submit=button('Submit','tf-update-picker-submit');submit.style.background='#14532d';submit.style.borderColor='#22c55e';actions.append(cancel,submit);card.append(title,help,table,counter,actions);overlay.append(card);document.body.append(overlay);active=overlay;
      let confirming=false,finished=false;
      const close=value=>{if(finished)return;finished=true;document.removeEventListener('keydown',key);overlay.remove();active=null;previous?.focus();resolve(value);};
      const selected=()=>rows.filter((c,i)=>checks[i].checked);
      const sync=()=>{const n=selected().length;all.checked=n===rows.length;all.indeterminate=n>0&&n<rows.length;counter.textContent=n+' / '+rows.length+' analis dipilih';submit.disabled=n===0;submit.style.opacity=n===0?'.45':'1';};
      all.onchange=()=>{checks.forEach(c=>c.checked=all.checked);sync();};checks.forEach(c=>c.onchange=sync);cancel.onclick=()=>close(null);
      submit.onclick=()=>{const chosen=selected();if(!chosen.length)return;confirming=true;table.hidden=true;counter.hidden=true;title.textContent='Konfirmasi Update';help.textContent='Update '+chosen.length+' analis yang dipilih? Data analis lain tetap tersimpan. Proses Update menggunakan timeframe 3 bulan.';submit.textContent='Confirm';submit.id='tf-update-picker-confirm';cancel.onclick=()=>{confirming=false;table.hidden=false;counter.hidden=false;title.textContent='Pilih Analis untuk Update';help.textContent='Pilih analis yang ingin diperbarui. Pair tetap mengikuti pilihan tersimpan.';submit.textContent='Submit';submit.id='tf-update-picker-submit';submit.onclick=confirmStart;cancel.onclick=()=>close(null);sync();};submit.onclick=()=>close(chosen.map(c=>c.url));cancel.focus();};
      const confirmStart=submit.onclick;
      const key=e=>{if(e.key==='Escape'){e.preventDefault();cancel.click();}if(e.key==='Tab'){const focusable=[...card.querySelectorAll('button,input')].filter(el=>!el.disabled&&!el.closest('[hidden]'));const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
      document.addEventListener('keydown',key);sync();all.focus();
    });
  }
  root.TFUpdatePicker={select};
})(globalThis);
