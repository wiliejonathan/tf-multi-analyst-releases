export async function exportParts(job){
 const {evidence=[],currentEvidence,...header}=job;
 if(header.inventoryKey){header.inventory=(await chrome.storage.local.get(header.inventoryKey))[header.inventoryKey];if(!header.inventory)throw Error('Inventaris export tidak tersedia.');delete header.inventoryKey;}
 const parts=[JSON.stringify(header).slice(0,-1)+',"evidence":['];
 for(let i=0;i<evidence.length;i++){
  const entry=evidence[i];let record=entry;
  if(entry.storageKey){record=(await chrome.storage.local.get(entry.storageKey))[entry.storageKey];if(!record)throw Error('Bukti scan tidak tersedia untuk '+entry.card?.name);}
  parts.push((i?',':'')+JSON.stringify(record));
 }
 parts.push(']}');return parts;
}
