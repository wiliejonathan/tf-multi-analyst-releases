(() => {
 const message='Putih: data history signal belum memenuhi syarat minimal 3 bulan. Dihitung dari jumlah bulan kalender berbeda yang memiliki trade valid; transaksi Cancelled dan Withdraw tidak dihitung. Warna status risiko baru diterapkan setelah tersedia minimal 3 bulan data.';
 function explain(){
  const card=document.querySelector('#tf-risk-explainer .tf-risk-explainer-card');
  if(card&&!card.querySelector('[data-history-eligibility535]')){const note=document.createElement('p');note.dataset.historyEligibility535='';note.textContent=message;note.style.color='#f8fafc';const heading=card.querySelector('h2');if(heading)heading.after(note);else card.prepend(note);}
  const adjustment=document.querySelector('#tf-analyst-risk-adjustment details');
  if(adjustment&&!adjustment.querySelector('[data-history-eligibility535]')){const note=document.createElement('p');note.dataset.historyEligibility535='';note.textContent='Nama analis putih = history signal kurang dari 3 bulan. Minimal 3 bulan data diperlukan untuk warna status risiko.';note.style.cssText='color:#f8fafc;font-size:10px;line-height:1.5;margin:8px 0';adjustment.querySelector('summary')?.after(note);}
  return !!card&&!!adjustment;
 }
 if(!explain()){const observer=new MutationObserver(()=>{if(explain())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});}
})();
