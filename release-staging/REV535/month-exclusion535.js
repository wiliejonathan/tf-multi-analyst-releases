function syncMonthExclusion535(){
 const active=!!(currentJob&&['running','paused','error'].includes(currentJob.status));
 const yes=new Set(Array.from(root.querySelectorAll('[name="survivedMonths"]:checked'),e=>e.value));
 const no=new Set(Array.from(root.querySelectorAll('[name="notSurvivedMonths"]:checked'),e=>e.value));
 for(const name of ['survivedMonths','notSurvivedMonths']){
  const opposite=name==='survivedMonths'?no:yes;
  root.querySelectorAll('[name="'+name+'"]').forEach(e=>{
   e.disabled=active||opposite.has(e.value);
   e.title=opposite.has(e.value)?'Bulan ini sudah dipilih pada '+(name==='survivedMonths'?'Not Survived Month':'Survived Month')+'. Lepaskan centang di sana terlebih dahulu.':'';
  });
 }
}
root.addEventListener('change',event=>{
 const input=event.target;if(!['survivedMonths','notSurvivedMonths'].includes(input.name))return;
 const opposite=input.name==='survivedMonths'?'notSurvivedMonths':'survivedMonths';
 const occupied=Array.from(root.querySelectorAll('[name="'+opposite+'"]:checked')).some(e=>e.value===input.value);
 if(input.checked&&occupied)input.checked=false;
 if(!input.checked){
  if(input.name==='survivedMonths')confirmedMonths=confirmedMonths.filter(m=>m!==input.value);
  else confirmedNotMonths=confirmedNotMonths.filter(m=>m!==input.value);
 }
 paintMonths();paintNotMonths();syncMonthExclusion535();
},true);
