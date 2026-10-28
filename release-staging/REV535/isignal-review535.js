function cleanPairs535(pairs){return [...new Set((Array.isArray(pairs)?pairs:[]).map(p=>String(p).trim().toUpperCase()).filter(p=>p==='__ALL__'||/^[A-Z][A-Z0-9._-]{2,19}$/.test(p)))];}
function chooseMissingPairs535(items){
 return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='tf-isignal-pair-review535';
  dialog.setAttribute('aria-labelledby','tf-isignal-review-title535');
  dialog.style.cssText='color-scheme:dark;width:min(520px,calc(100vw - 24px));max-height:85vh;overflow:auto;padding:18px;border:1px solid #475569;border-radius:12px;background:#0f172a;color:#e2e8f0;font:12px/1.5 Arial;';
  const heading=document.createElement('h2');heading.id='tf-isignal-review-title535';heading.textContent='Konfirmasi pair analis';heading.style.fontSize='16px';dialog.append(heading);
  const info=document.createElement('p');info.textContent='Tolong pilih pair sendiri untuk analis yang belum terhubung iSignal.';dialog.append(info);
  const selects=new Map(),options=cleanPairs535([...(typeof tf_getAllAnalystPairsCachedIsignal==='function'?tf_getAllAnalystPairsCachedIsignal():[]),...Array.from(document.querySelectorAll('.analyst-pair-select option'),e=>e.value),...(typeof TFCore!=='undefined'?TFCore.pairs:[])]).filter(p=>p!=='__ALL__');
  if(!options.includes('XAUUSD'))options.unshift('XAUUSD');
  items.forEach((item,index)=>{
   const row=document.createElement('div');row.style.cssText='padding:9px 0;border-bottom:1px solid #334155;overflow-wrap:anywhere';
   const label=document.createElement('label');const pairs=cleanPairs535(item.pairs);
   label.textContent=(item.name||'Analis '+(index+1))+' : '+(pairs.length?pairs.map(p=>p==='__ALL__'?'ALL':p).join(', '):'belum terhubung iSignal');row.append(label);
   if(item.isignalActive===false){const status=document.createElement('small');status.textContent=' · iSignal Tidak Aktif';row.append(status);}
   if(!pairs.length){
    const select=document.createElement('select');select.required=true;select.id='tf-isignal-pair535-'+index;label.htmlFor=select.id;select.setAttribute('aria-label','Pilih pair '+(item.name||'analis '+(index+1)));
    select.style.cssText='display:block;width:100%;margin-top:6px;padding:8px;background:#111c30;color:#e2e8f0;border:1px solid #475569;border-radius:6px';
    for(const [value,text]of [['','Pilih pair'],['__ALL__','ALL Pairs'],...options.map(p=>[p,p])]){const opt=document.createElement('option');opt.value=value;opt.textContent=text;select.append(opt);}
    row.append(select);selects.set(index,select);
   }dialog.append(row);
  });
  const error=document.createElement('p');error.style.color='#f87171';error.setAttribute('role','status');dialog.append(error);
  const actions=document.createElement('div');actions.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin-top:14px';
  const cancel=document.createElement('button'),confirm=document.createElement('button');cancel.textContent='Cancel';confirm.textContent='Confirm';
  for(const button of[cancel,confirm]){button.type='button';button.style.cssText='padding:8px 14px;border:1px solid #475569;border-radius:7px;background:#17263c;color:#e2e8f0;cursor:pointer';actions.append(button);}dialog.append(actions);
  const done=value=>{dialog.close();dialog.remove();resolve(value);};
  cancel.onclick=()=>done(null);dialog.addEventListener('cancel',event=>{event.preventDefault();done(null);});
  confirm.onclick=()=>{for(const select of selects.values())if(!select.value){error.textContent='Pilih pair untuk setiap analis yang belum terhubung iSignal.';select.focus();return;}done(items.map((item,index)=>({...item,pairs:selects.has(index)?[selects.get(index).value]:cleanPairs535(item.pairs)})));};
  document.body.append(dialog);dialog.showModal();selects.values().next().value?.focus();
 });
}
async function reviewDiscovery535(snapshot){
 if(reviewing535||snapshot.runId===applied)return;
 const items=(snapshot.items||[]).map(item=>({...item,pairs:cleanPairs535(item.pairs)}));
 if(!items.some(item=>!item.pairs.length)){applied=snapshot.runId;tf_populateIsignalRows(items);return;}
 if(reviewRecord535?.runId===snapshot.runId){applied=snapshot.runId;if(reviewRecord535.result==='confirmed')tf_populateIsignalRows(reviewRecord535.items||[]);return;}
 reviewing535=true;scheduleSubmit();
 try{
  const chosen=await chooseMissingPairs535(items);
  if(job?.runId!==snapshot.runId||job?.status!=='done')return;
  const record={runId:snapshot.runId,result:chosen?'confirmed':'cancelled',items:chosen||[]};
  await chrome.storage.local.set({tfIsignalDiscoveryReviewV535:record});
  reviewRecord535=record;applied=snapshot.runId;
  if(chosen){tf_populateIsignalRows(chosen);if(typeof setIsignalStatus==='function')setIsignalStatus('Selesai · '+chosen.length+' analis · pair sudah dikonfirmasi.');}
  else if(typeof setIsignalStatus==='function')setIsignalStatus('Pemilihan pair dibatalkan. Daftar analis sebelumnya dipertahankan.');
 }catch(error){if(typeof setIsignalStatus==='function')setIsignalStatus(error.message||'Gagal menyimpan konfirmasi pair.');}
 finally{reviewing535=false;scheduleSubmit();}
}
