(() => {
  'use strict';

  const API = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDS_KEY = 'tfMobileLicenseCredentialsV2';
  const STATE_KEY = 'tfMobileLicenseStateV2';
  const POLL_MS = 3000;
  let pollTimer = null;
  let opened = false;
  let sending = false;
  let lastStatus = null;

  const ICON_REMOTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7.5 9.5h.01M11 9.5h5"/></svg>';

  function q(id){ return document.getElementById(id); }
  function getJson(k){ try{return JSON.parse(localStorage.getItem(k)||'null');}catch(_){return null;} }
  function esc(v){ return String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function clean(v,max=1600){ return String(v==null?'':v).replace(/\s+/g,' ').trim().slice(0,max); }

  function auth(){
    const c=getJson(CREDS_KEY), s=getJson(STATE_KEY);
    if(!c||!s||!c.email||!c.token||!s.sessionToken) return null;
    return {email:c.email,token:c.token,licenseId:s.licenseId||s.license||'',sessionToken:s.sessionToken};
  }

  async function api(path, body){
    const a=auth();
    if(!a) throw new Error('Session Mobile belum tersedia.');
    const ctl=typeof AbortController==='function'?new AbortController():null;
    const t=setTimeout(()=>{try{ctl&&ctl.abort();}catch(_){}},10000);
    try{
      const r=await fetch(API+path,{method:'POST',cache:'no-store',signal:ctl?ctl.signal:undefined,headers:{'Content-Type':'application/json'},body:JSON.stringify({...a,...body,deviceType:'MOBILE',clientType:'MOBILE',mobileVersion:'1.0.33'})});
      const text=await r.text();
      let data;
      try{data=JSON.parse(text);}catch(_){throw new Error('Respons Remote bukan JSON.');}
      if(data&&data.valid===false) throw new Error(data.message||data.code||'Remote tidak tersedia.');
      return data||{};
    } finally { clearTimeout(t); }
  }

  function ensureButton(){
    const data=q('tf-mobile-data-open');
    if(!data||q('tf-mobile-remote-open')) return !!q('tf-mobile-remote-open');
    const b=document.createElement('button');
    b.type='button';
    b.id='tf-mobile-remote-open';
    b.className='tf-mobile-appbar-action tf-mobile-remote-open';
    b.setAttribute('aria-label','Remote plugin');
    b.innerHTML=ICON_REMOTE+'<span>Remote</span>';
    data.parentNode.insertBefore(b,data);
    b.addEventListener('click',openRemote);
    return true;
  }

  function ensureUi(){
    if(q('tf-mobile-remote-page')) return q('tf-mobile-remote-page');
    const root=document.createElement('div');
    root.id='tf-mobile-remote-page';
    root.className='tf-mobile-remote-page';
    root.innerHTML=`
      <div class="tf-remote-head">
        <button id="tf-remote-back" type="button" class="tf-remote-back" aria-label="Kembali">‹</button>
        <div class="tf-remote-title-wrap"><div class="tf-remote-kicker">PREMIUM FEATURE</div><div class="tf-remote-title">Remote Sidebar</div></div>
        <button id="tf-remote-refresh-state" class="tf-remote-icon-btn" type="button" aria-label="Refresh">↻</button>
      </div>
      <div class="tf-remote-body">
        <section class="tf-remote-card tf-remote-status-card">
          <div class="tf-remote-status-top"><span id="tf-remote-dot" class="tf-remote-dot"></span><strong id="tf-remote-pc-status">Menghubungkan PC…</strong><span id="tf-remote-version" class="tf-remote-version"></span></div>
          <div id="tf-remote-status-note" class="tf-remote-note">Chrome harus aktif dan sidebar plugin TF harus terbuka.</div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Sidebar Plugin</div>
          <div class="tf-remote-profile"><div class="tf-remote-avatar">TF</div><div><strong id="tf-remote-user">TF User</strong><div id="tf-remote-email" class="tf-remote-muted"></div></div></div>
          <div class="tf-remote-grid2">
            <div class="tf-remote-mini"><span>View</span><strong id="tf-remote-view">-</strong></div>
            <div class="tf-remote-mini"><span>Pair</span><strong id="tf-remote-pair">ALL</strong></div>
          </div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Time Range</div>
          <div id="tf-remote-time-current" class="tf-remote-current">Current: ALL</div>
          <div class="tf-remote-time-buttons">
            <button data-range="m3">3 Month</button><button data-range="m6">6 Month</button><button data-range="y1">1 Year</button><button data-range="y2">2 Year</button><button data-range="y3">3 Year</button><button data-range="y5">5 Year</button><button data-range="all_time">ALL</button>
          </div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Remote Control</div>
          <div class="tf-remote-actions">
            <button id="tf-remote-refresh" class="primary" type="button">Refresh</button>
            <button id="tf-remote-batch" class="primary" type="button">Submit</button>
            <button id="tf-remote-scan" type="button">Scan Channel ini</button>
            <button id="tf-remote-dashboard" type="button">Buka Dashboard</button>
          </div>
          <label class="tf-remote-field"><span>Pair Scan</span><select id="tf-remote-pair-select"><option>ALL</option><option>XAUUSD</option><option>EURUSD</option><option>GBPUSD</option><option>AUDUSD</option><option>NZDUSD</option><option>USDJPY</option><option>EURJPY</option><option>GBPJPY</option><option>AUDJPY</option><option>NZDJPY</option><option>CADJPY</option><option>CHFJPY</option><option>USDCAD</option><option>USDCHF</option></select></label>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Analis di Sidebar PC</div>
          <div id="tf-remote-analysts" class="tf-remote-analysts"><div class="tf-remote-empty">Menunggu data sidebar…</div></div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Status Scan</div>
          <div id="tf-remote-scan-status" class="tf-remote-console">Belum ada status.</div>
          <div id="tf-remote-command-status" class="tf-remote-command-status"></div>
        </section>
      </div>`;
    document.body.appendChild(root);
    q('tf-remote-back').addEventListener('click',closeRemote);
    q('tf-remote-refresh-state').addEventListener('click',refreshStatus);
    q('tf-remote-refresh').addEventListener('click',()=>sendCommand('refresh'));
    q('tf-remote-batch').addEventListener('click',()=>sendCommand('batch_toggle'));
    q('tf-remote-scan').addEventListener('click',()=>sendCommand('scan_channel'));
    q('tf-remote-dashboard').addEventListener('click',()=>sendCommand('open_dashboard'));
    q('tf-remote-pair-select').addEventListener('change',e=>sendCommand('set_pair',{value:e.target.value}));
    root.querySelectorAll('[data-range]').forEach(btn=>btn.addEventListener('click',()=>sendCommand('set_time_range',{value:btn.dataset.range})));
    return root;
  }

  function controlsDisabled(v){
    const root=q('tf-mobile-remote-page');
    if(!root)return;
    root.querySelectorAll('.tf-remote-actions button,.tf-remote-time-buttons button,#tf-remote-pair-select').forEach(el=>el.disabled=!!v);
  }

  function render(state){
    lastStatus=state||{};
    const online=!!state.desktopOnline;
    q('tf-remote-dot')?.classList.toggle('online',online);
    if(q('tf-remote-pc-status')) q('tf-remote-pc-status').textContent=online?'PC + Plugin Online':'PC / Sidebar Offline';
    if(q('tf-remote-version')) q('tf-remote-version').textContent=state.extensionVersion||'';
    if(q('tf-remote-status-note')) q('tf-remote-status-note').textContent=online?'Remote aktif. Perintah dikirim ke sidebar Chrome dalam beberapa detik.':'Chrome harus aktif dan sidebar plugin TF harus terbuka. Remote tidak akan menjalankan perintah jika sidebar ditutup.';
    controlsDisabled(!online || sending);

    const s=state.snapshot||{};
    if(q('tf-remote-user')) q('tf-remote-user').textContent=clean(s.userName,100)||'TF User';
    if(q('tf-remote-email')) q('tf-remote-email').textContent=clean(s.userEmail,140);
    if(q('tf-remote-view')) q('tf-remote-view').textContent=clean(s.view,40)||'-';
    if(q('tf-remote-pair')) q('tf-remote-pair').textContent=clean(s.pair,80)||'ALL';
    if(q('tf-remote-time-current')) q('tf-remote-time-current').textContent='Current: '+(clean(s.timeRange,80)||'ALL');
    if(q('tf-remote-batch')) q('tf-remote-batch').textContent=clean(s.batchButton,80)||'Submit';
    const ps=q('tf-remote-pair-select');
    if(ps){ const p=clean(s.pair,40).split(',')[0].trim(); if(Array.from(ps.options).some(o=>o.value===p))ps.value=p; else if(p==='__ALL__')ps.value='ALL'; }

    const list=q('tf-remote-analysts');
    if(list){
      const arr=Array.isArray(s.analysts)?s.analysts:[];
      list.innerHTML=arr.length?arr.map(x=>`<div class="tf-remote-analyst"><span>${esc(x.no||'')}</span><div><strong>${esc(clean(x.name,80)||'Analis '+(x.no||''))}</strong><small>${esc(clean(x.url,260))}</small>${Array.isArray(x.pairs)&&x.pairs.length?`<em>${esc(x.pairs.join(', '))}</em>`:''}</div></div>`).join(''):'<div class="tf-remote-empty">Tidak ada link analis yang terbaca pada sidebar PC.</div>';
    }
    const scanText=clean([s.status,s.progress].filter(Boolean).join('\n'),3400) || 'Belum ada status.';
    if(q('tf-remote-scan-status')) q('tf-remote-scan-status').textContent=scanText;
    const cs=q('tf-remote-command-status');
    if(cs){
      const st=clean(state.commandStatus,40);
      const msg=state.result&&state.result.message?clean(state.result.message,240):'';
      cs.textContent=st?('Perintah terakhir: '+st+(msg?' — '+msg:'')):'';
      cs.className='tf-remote-command-status '+(st==='DONE'?'ok':st==='ERROR'?'err':'');
    }
  }

  async function refreshStatus(){
    if(!opened)return;
    try{ const r=await api('/remote/mobile-status',{}); render(r); }
    catch(e){ render({desktopOnline:false,snapshot:lastStatus&&lastStatus.snapshot||{},commandStatus:'',extensionVersion:''}); const n=q('tf-remote-status-note'); if(n)n.textContent=e.message||String(e); }
  }

  async function sendCommand(action,payload={}){
    if(sending)return;
    if(!lastStatus||!lastStatus.desktopOnline){ await refreshStatus(); if(!lastStatus||!lastStatus.desktopOnline)return; }
    sending=true; controlsDisabled(true);
    const status=q('tf-remote-command-status');
    if(status){status.textContent='Mengirim perintah…';status.className='tf-remote-command-status';}
    try{
      const r=await api('/remote/mobile-command',{command:{action,payload}});
      if(r.accepted===false) throw new Error(r.message||'Perintah sebelumnya masih diproses.');
      if(status)status.textContent='Perintah dikirim. Menunggu PC…';
      setTimeout(refreshStatus,700);
    }catch(e){ if(status){status.textContent=e.message||String(e);status.className='tf-remote-command-status err';} }
    finally{sending=false;controlsDisabled(!(lastStatus&&lastStatus.desktopOnline));}
  }

  function openRemote(){
    ensureUi();
    opened=true;
    document.documentElement.classList.add('tf-mobile-remote-opened');
    q('tf-mobile-remote-page')?.classList.add('open');
    refreshStatus();
    if(!pollTimer)pollTimer=setInterval(refreshStatus,POLL_MS);
  }

  function closeRemote(){
    opened=false;
    document.documentElement.classList.remove('tf-mobile-remote-opened');
    q('tf-mobile-remote-page')?.classList.remove('open');
    if(pollTimer){clearInterval(pollTimer);pollTimer=null;}
  }

  function boot(){
    if(ensureButton()) return;
    const mo=new MutationObserver(()=>{ if(ensureButton())mo.disconnect(); });
    mo.observe(document.documentElement,{subtree:true,childList:true});
    setTimeout(()=>ensureButton(),1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
