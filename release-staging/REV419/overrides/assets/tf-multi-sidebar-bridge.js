(async()=>{
  'use strict';if(window.tfIntegrityReady&&!(await window.tfIntegrityReady))return;
  let frame=null,mode=false;
  function setMode(value){mode=value;document.body.classList.toggle('tf-multi-mode',value);chrome.storage.local.set({tfMultiViewV419:value});}
  function mount(){const main=document.getElementById('main-container'),view=document.getElementById('dashboard-view');if(!main||!view)return;
    if(!document.getElementById('tf-multi-entry')){const note=Array.from(view.querySelectorAll('p')).find(p=>p.textContent.includes('Batch Scan 1x'));if(!note)return;const button=document.createElement('button');button.id='tf-multi-entry';button.className='btn tf-multi-entry';button.type='button';button.textContent='Scrape Multi-Link Analis';button.onclick=()=>setMode(true);note.after(button);}
    if(!frame){frame=document.createElement('iframe');frame.id='tf-multi-frame';frame.title='Scrape Multi-Link Analis';frame.src=chrome.runtime.getURL('multi-scanner/sidebar.html');frame.setAttribute('allow','clipboard-write');main.querySelector('#common-actions').after(frame);}
    const update=main.querySelector('.tf-github-update-block[data-tf-update-kind="profile"]');if(update&&!document.getElementById('tf-multi-back')){const button=document.createElement('button');button.id='tf-multi-back';button.type='button';button.className='btn tf-multi-back';button.textContent='Back To Main Dashboard';button.onclick=()=>setMode(false);update.after(button);}
    document.body.classList.toggle('tf-multi-mode',mode);
  }
  window.addEventListener('message',e=>{if(frame&&e.source===frame.contentWindow&&e.data?.type==='TF_MULTI_HEIGHT'){const height=Number(e.data.height);if(Number.isFinite(height))frame.style.height=Math.min(20000,Math.max(350,height))+'px';}});
  const state=await chrome.storage.local.get('tfMultiViewV419');mode=!!state.tfMultiViewV419;mount();new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
})();
