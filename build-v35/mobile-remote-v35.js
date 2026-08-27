(() => {
  'use strict';

  const API='https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDS_KEY='tfMobileLicenseCredentialsV2';
  const STATE_KEY='tfMobileLicenseStateV2';
  const POLL_MS=3000;
  const PAIRS=['XAUUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','EURJPY','GBPJPY','AUDJPY','NZDJPY','CADJPY','CHFJPY','USDCAD','USDCHF'];
  const ALL='__ALL__';
  let pollTimer=null,opened=false,sending=false,lastStatus=null,editorDirty=false,lastCommandSignature='',eventLog=[];

  const ICON_REMOTE='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7.5 9.5h.01M11 9.5h5"/></svg>';
  const q=id=>document.getElementById(id);
  const getJson=k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch(_){return null;}};
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=(v,max=2400)=>String(v==null?'':v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim().slice(0,max);

  function auth(){
    const c=getJson(CREDS_KEY),s=getJson(STATE_KEY);
    if(!c||!s||!c.email||!c.token||!s.sessionToken)return null;
    return {email:c.email,token:c.token,licenseId:s.licenseId||s.license||'',sessionToken:s.sessionToken};
  }

  async function api(path,body){
    const a=auth();
    if(!a)throw new Error('Session Mobile belum tersedia.');
    const ctl=typeof AbortController==='function'?new AbortController():null;
    const t=setTimeout(()=>{try{ctl&&ctl.abort();}catch(_){}},12000);
    try{
      const r=await fetch(API+path,{method:'POST',cache:'no-store',signal:ctl?ctl.signal:undefined,headers:{'Content-Type':'application/json'},body:JSON.stringify({...a,...body,deviceType:'MOBILE',clientType:'MOBILE',mobileVersion:'1.0.35'})});
      const text=await r.text();let data;
      try{data=JSON.parse(text);}catch(_){throw new Error('Respons Remote bukan JSON.');}
      if(data&&data.valid===false)throw new Error(data.message||data.code||'Remote tidak tersedia.');
      return data||{};
    }finally{clearTimeout(t);}
  }

  function logEvent(message,type='info'){
    const at=new Date();
    eventLog.unshift({at:at.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),message:clean(message,500),type});
    if(eventLog.length>50)eventLog.length=50;
    renderEventLog();
  }

  function renderEventLog(){
    const el=q('tf-remote-event-log');if(!el)return;
    el.innerHTML=eventLog.length?eventLog.map(x=>`<div class="tf-remote-log-row ${esc(x.type)}"><span>${esc(x.at)}</span><div>${esc(x.message)}</div></div>`).join(''):'<div class="tf-remote-empty">Belum ada event Remote.</div>';
  }

  function pairLabels(selected){
    const vals=Array.isArray(selected)&&selected.length?selected:[ALL];
    return [ALL,...PAIRS].map(v=>{
      const label=v===ALL?'ALL':v;
      return `<label class="tf-remote-pair-chip"><input type="checkbox" data-pair="${v}" ${vals.includes(v)||((vals.includes('ALL'))&&v===ALL)?'checked':''}><span>${label}</span></label>`;
    }).join('');
  }

  function ensureButton(){
    const data=q('tf-mobile-data-open');
    if(!data||q('tf-mobile-remote-open'))return !!q('tf-mobile-remote-open');
    const b=document.createElement('button');b.type='button';b.id='tf-mobile-remote-open';b.className='tf-mobile-appbar-action tf-mobile-remote-open';b.setAttribute('aria-label','Remote plugin');b.innerHTML=ICON_REMOTE+'<span>Remote</span>';
    data.parentNode.insertBefore(b,data);try{data.parentNode.classList.add('tf-mobile-appbar-has-remote');}catch(_){}
    b.addEventListener('click',openRemote);return true;
  }

  function ensureUi(){
    if(q('tf-mobile-remote-page'))return q('tf-mobile-remote-page');
    const root=document.createElement('div');root.id='tf-mobile-remote-page';root.className='tf-mobile-remote-page';
    root.innerHTML=`
      <div class="tf-remote-head">
        <button id="tf-remote-back" type="button" class="tf-remote-back" aria-label="Kembali">‹</button>
        <div class="tf-remote-title-wrap"><div class="tf-remote-kicker">PREMIUM REMOTE</div><div class="tf-remote-title">Remote Sidebar PC</div></div>
        <button id="tf-remote-refresh-state" class="tf-remote-icon-btn" type="button" aria-label="Refresh">↻</button>
      </div>
      <div class="tf-remote-body">
        <section class="tf-remote-card tf-remote-status-card">
          <div class="tf-remote-status-top"><span id="tf-remote-dot" class="tf-remote-dot"></span><strong id="tf-remote-pc-status">Menghubungkan PC…</strong><span id="tf-remote-version" class="tf-remote-version"></span></div>
          <div id="tf-remote-status-note" class="tf-remote-note">PC harus menyala, Chrome aktif, extension aktif, dan sidebar TF terbuka.</div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Sidebar Plugin</div>
          <div class="tf-remote-profile"><div class="tf-remote-avatar">TF</div><div><strong id="tf-remote-user">TF User</strong><div id="tf-remote-email" class="tf-remote-muted"></div></div></div>
          <div class="tf-remote-grid3"><div class="tf-remote-mini"><span>View</span><strong id="tf-remote-view">-</strong></div><div class="tf-remote-mini"><span>Scan Pair</span><strong id="tf-remote-pair">ALL</strong></div><div class="tf-remote-mini"><span>Time</span><strong id="tf-remote-time-mini">ALL</strong></div></div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Time Range</div>
          <div id="tf-remote-time-current" class="tf-remote-current">Current: ALL</div>
          <div class="tf-remote-time-buttons"><button data-range="m3">3 Month</button><button data-range="m6">6 Month</button><button data-range="y1">1 Year</button><button data-range="y2">2 Year</button><button data-range="y3">3 Year</button><button data-range="y5">5 Year</button><button data-range="all_time">ALL</button></div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">ALL ANALIS PAIR</div>
          <div class="tf-remote-help">Sama dengan selector pair global pada sidebar PC.</div>
          <div id="tf-remote-all-pairs" class="tf-remote-pair-grid">${pairLabels([ALL])}</div>
          <button id="tf-remote-apply-all-pairs" class="tf-remote-wide-btn" type="button">Terapkan Pair Global ke PC</button>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Link Analis</div>
          <div class="tf-remote-help">Edit Link Analis dan Pair dari HP, lalu kirim ke sidebar PC.</div>
          <div id="tf-remote-analyst-editor" class="tf-remote-editor"></div>
          <div class="tf-remote-editor-actions"><button id="tf-remote-add-row" type="button">+ Add Analis</button><button id="tf-remote-apply-analysts" class="primary" type="button">Apply Link ke PC</button></div>
          <label class="tf-remote-toggle"><input id="tf-remote-remember-links" type="checkbox"><span>Remember all analyst links</span></label>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Remote Control</div>
          <label class="tf-remote-field"><span>Pair Scan Channel</span><select id="tf-remote-scan-pair"><option value="ALL">ALL</option>${PAIRS.map(p=>`<option value="${p}">${p}</option>`).join('')}</select></label>
          <div class="tf-remote-actions tf-remote-actions-3">
            <button id="tf-remote-update" type="button">Update</button>
            <button id="tf-remote-refresh" type="button">Refresh</button>
            <button id="tf-remote-submit" class="primary" type="button">Submit</button>
            <button id="tf-remote-scan" type="button">Scan Channel ini</button>
            <button id="tf-remote-isignal" class="accent" type="button">Scan From iSignal User</button>
            <button id="tf-remote-dashboard" type="button">Buka Dashboard</button>
            <button id="tf-remote-export" type="button">Export di PC</button>
            <button id="tf-remote-clear-scan" type="button">Clear Scan Log</button>
            <button id="tf-remote-clear-power" type="button">Clear Power Log</button>
          </div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">iSignal User / Analysts</div>
          <div id="tf-remote-isignal-analysts" class="tf-remote-analysts"><div class="tf-remote-empty">Belum ada hasil iSignal.</div></div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Status & Progress Scan</div>
          <div id="tf-remote-scan-status" class="tf-remote-console">Belum ada status.</div>
          <div id="tf-remote-command-status" class="tf-remote-command-status"></div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Scan Event Log</div>
          <div id="tf-remote-scan-log" class="tf-remote-console tf-remote-console-tall">Belum ada log scan.</div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Power / Sleep Event Log</div>
          <div class="tf-remote-grid2"><div class="tf-remote-mini"><span>Stay Awake</span><strong id="tf-remote-power-badge">-</strong></div><div class="tf-remote-mini"><span>Summary</span><strong id="tf-remote-power-summary">-</strong></div></div>
          <div id="tf-remote-power-log" class="tf-remote-console tf-remote-console-tall">Belum ada event power.</div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Remote Event Log</div>
          <div id="tf-remote-event-log" class="tf-remote-event-log"></div>
        </section>
      </div>`;
    document.body.appendChild(root);

    q('tf-remote-back').addEventListener('click',closeRemote);
    q('tf-remote-refresh-state').addEventListener('click',()=>{logEvent('Refresh status Remote dari HP.');refreshStatus();});
    q('tf-remote-update').addEventListener('click',()=>sendCommand('update'));
    q('tf-remote-refresh').addEventListener('click',()=>sendCommand('refresh'));
    q('tf-remote-submit').addEventListener('click',()=>sendCommand('batch_toggle'));
    q('tf-remote-scan').addEventListener('click',()=>sendCommand('scan_channel'));
    q('tf-remote-isignal').addEventListener('click',()=>sendCommand('scan_from_isignal'));
    q('tf-remote-dashboard').addEventListener('click',()=>sendCommand('open_dashboard'));
    q('tf-remote-export').addEventListener('click',()=>sendCommand('export_data'));
    q('tf-remote-clear-scan').addEventListener('click',()=>sendCommand('clear_scan_log'));
    q('tf-remote-clear-power').addEventListener('click',()=>sendCommand('clear_power_log'));
    q('tf-remote-scan-pair').addEventListener('change',e=>sendCommand('set_scan_pair',{value:e.target.value}));
    q('tf-remote-remember-links').addEventListener('change',e=>sendCommand('set_remember_links',{value:!!e.target.checked}));
    q('tf-remote-add-row').addEventListener('click',()=>{addEditorRow({url:'',pairs:[ALL]});editorDirty=true;});
    q('tf-remote-apply-analysts').addEventListener('click',()=>sendCommand('set_analysts',{analysts:collectAnalysts()}));
    q('tf-remote-apply-all-pairs').addEventListener('click',()=>sendCommand('set_all_analyst_pairs',{values:collectCheckedPairs(q('tf-remote-all-pairs'))}));
    root.querySelectorAll('[data-range]').forEach(btn=>btn.addEventListener('click',()=>sendCommand('set_time_range',{value:btn.dataset.range})));

    q('tf-remote-analyst-editor').addEventListener('input',()=>{editorDirty=true;});
    q('tf-remote-analyst-editor').addEventListener('change',e=>{editorDirty=true;pairExclusivity(e.target);});
    q('tf-remote-analyst-editor').addEventListener('click',e=>{
      const rm=e.target.closest('[data-remove-row]');if(!rm)return;
      const row=rm.closest('.tf-remote-editor-row');if(row){row.remove();renumberEditor();editorDirty=true;}
    });
    q('tf-remote-all-pairs').addEventListener('change',e=>pairExclusivity(e.target));
    return root;
  }

  function pairExclusivity(target){
    if(!target||target.type!=='checkbox'||!target.dataset.pair)return;
    const root=target.closest('.tf-remote-pair-grid');if(!root)return;
    const all=root.querySelector('input[data-pair="'+ALL+'"]');
    const others=Array.from(root.querySelectorAll('input[data-pair]')).filter(x=>x!==all);
    if(target===all&&target.checked)others.forEach(x=>x.checked=false);
    if(target!==all&&target.checked&&all)all.checked=false;
    if(!Array.from(root.querySelectorAll('input[data-pair]')).some(x=>x.checked)&&all)all.checked=true;
  }

  function collectCheckedPairs(root){
    if(!root)return [ALL];
    const vals=Array.from(root.querySelectorAll('input[data-pair]:checked')).map(x=>x.dataset.pair);
    return vals.length?vals:[ALL];
  }

  function addEditorRow(item={}){
    const box=q('tf-remote-analyst-editor');if(!box)return;
    const idx=box.querySelectorAll('.tf-remote-editor-row').length+1;
    const pairs=Array.isArray(item.pairs)&&item.pairs.length?item.pairs:[ALL];
    const row=document.createElement('div');row.className='tf-remote-editor-row';row.innerHTML=`
      <div class="tf-remote-editor-head"><strong>Analis <span data-row-number>${idx}</span></strong><button data-remove-row type="button">✕</button></div>
      <input class="tf-remote-link-input" type="url" inputmode="url" placeholder="https://account.tradersfamily.id/channels/..." value="${esc(item.url||'')}">
      <details class="tf-remote-pair-details"><summary>Selector Pair</summary><div class="tf-remote-pair-grid">${pairLabels(pairs)}</div></details>`;
    box.appendChild(row);
  }

  function renumberEditor(){
    q('tf-remote-analyst-editor')?.querySelectorAll('.tf-remote-editor-row').forEach((r,i)=>{const n=r.querySelector('[data-row-number]');if(n)n.textContent=String(i+1);});
  }

  function renderEditor(items){
    if(editorDirty)return;
    const box=q('tf-remote-analyst-editor');if(!box)return;
    box.innerHTML='';
    const arr=Array.isArray(items)?items.filter(x=>x&&x.url):[];
    (arr.length?arr:[{url:'',pairs:[ALL]}]).slice(0,28).forEach(addEditorRow);
  }

  function collectAnalysts(){
    const rows=Array.from(q('tf-remote-analyst-editor')?.querySelectorAll('.tf-remote-editor-row')||[]);
    return rows.map(r=>({url:clean(r.querySelector('.tf-remote-link-input')?.value||'',520),pairs:collectCheckedPairs(r.querySelector('.tf-remote-pair-grid'))})).filter(x=>x.url);
  }

  function setPairGrid(root,vals){
    if(!root)return;
    const values=Array.isArray(vals)&&vals.length?vals:[ALL];
    root.querySelectorAll('input[data-pair]').forEach(ch=>{ch.checked=values.includes(ch.dataset.pair)||(values.includes('ALL')&&ch.dataset.pair===ALL);});
  }

  function controlsDisabled(v){
    const root=q('tf-mobile-remote-page');if(!root)return;
    root.querySelectorAll('.tf-remote-actions button,.tf-remote-time-buttons button,#tf-remote-scan-pair,#tf-remote-apply-all-pairs,#tf-remote-apply-analysts,#tf-remote-remember-links').forEach(el=>el.disabled=!!v);
  }

  function renderIsignal(items){
    const list=q('tf-remote-isignal-analysts');if(!list)return;
    const arr=Array.isArray(items)?items:[];
    list.innerHTML=arr.length?arr.map(x=>`<div class="tf-remote-analyst"><span>${esc(x.no||'')}</span><div><strong>${esc(clean(x.name,80)||'Analis '+(x.no||''))}</strong><small>${esc(clean(x.url,400))}</small>${Array.isArray(x.pairs)&&x.pairs.length?`<em>${esc(x.pairs.map(p=>p===ALL?'ALL':p).join(', '))}</em>`:''}</div></div>`).join(''):'<div class="tf-remote-empty">Belum ada link analis hasil Scan From iSignal User.</div>';
  }

  function render(state){
    lastStatus=state||{};const online=!!state.desktopOnline;
    q('tf-remote-dot')?.classList.toggle('online',online);
    if(q('tf-remote-pc-status'))q('tf-remote-pc-status').textContent=online?'PC + Plugin Online':'PC / Sidebar Offline';
    if(q('tf-remote-version'))q('tf-remote-version').textContent=state.extensionVersion||'';
    if(q('tf-remote-status-note'))q('tf-remote-status-note').textContent=online?'Remote terhubung. Semua kontrol di halaman ini diteruskan ke sidebar Chrome.':'PC harus menyala, Chrome aktif, extension aktif, dan sidebar TF terbuka.';
    controlsDisabled(!online||sending);

    const s=state.snapshot||{};
    if(q('tf-remote-user'))q('tf-remote-user').textContent=clean(s.userName,100)||'TF User';
    if(q('tf-remote-email'))q('tf-remote-email').textContent=clean(s.userEmail,140);
    if(q('tf-remote-view'))q('tf-remote-view').textContent=clean(s.view,40)||'-';
    if(q('tf-remote-pair'))q('tf-remote-pair').textContent=clean(s.scanPair||'ALL',80);
    if(q('tf-remote-time-mini'))q('tf-remote-time-mini').textContent=clean(s.timeRange||'ALL',40).replace(/[()]/g,'');
    if(q('tf-remote-time-current'))q('tf-remote-time-current').textContent='Current: '+(clean(s.timeRange,80)||'ALL');
    if(q('tf-remote-submit'))q('tf-remote-submit').textContent=clean(s.batchButton,80)||'Submit';
    const sp=q('tf-remote-scan-pair');if(sp){const p=clean(s.scanPair||'ALL',30);if(Array.from(sp.options).some(o=>o.value===p))sp.value=p;}
    const rem=q('tf-remote-remember-links');if(rem&&document.activeElement!==rem)rem.checked=!!s.rememberAllLinks;
    setPairGrid(q('tf-remote-all-pairs'),s.allAnalystPairs);
    renderEditor(s.analysts);
    renderIsignal(s.isignalAnalysts);

    const statusText=clean([s.status,s.scanLog,s.isignalScanLog].filter(Boolean).join('\n'),7000)||'Belum ada status.';
    if(q('tf-remote-scan-status'))q('tf-remote-scan-status').textContent=statusText;
    if(q('tf-remote-scan-log'))q('tf-remote-scan-log').textContent=clean([s.scanLog,s.isignalScanLog].filter(Boolean).join('\n\n'),9000)||'Belum ada log scan.';
    const power=s.power||{};
    if(q('tf-remote-power-badge'))q('tf-remote-power-badge').textContent=clean(power.badge,80)||'-';
    if(q('tf-remote-power-summary'))q('tf-remote-power-summary').textContent=clean(power.summary,240)||'-';
    if(q('tf-remote-power-log'))q('tf-remote-power-log').textContent=clean(power.log,5000)||'Belum ada event power.';

    const cs=q('tf-remote-command-status');
    if(cs){
      const st=clean(state.commandStatus,40),msg=state.result&&state.result.message?clean(state.result.message,300):'';
      cs.textContent=st?('Perintah terakhir: '+st+(msg?' — '+msg:'')):'';
      cs.className='tf-remote-command-status '+(st==='DONE'?'ok':st==='ERROR'?'err':'');
      const sig=[state.commandId||'',st,msg].join('|');
      if(sig&&sig!==lastCommandSignature&&st){lastCommandSignature=sig;logEvent('Command '+st+(msg?' — '+msg:''),st==='ERROR'?'err':st==='DONE'?'ok':'info');if(st==='DONE'&&editorDirty&&state.result&&state.result.analysts){editorDirty=false;}}
    }
  }

  async function refreshStatus(){
    if(!opened)return;
    try{const r=await api('/remote/mobile-status',{});render(r);}
    catch(e){render({desktopOnline:false,snapshot:lastStatus&&lastStatus.snapshot||{},commandStatus:'',extensionVersion:''});const n=q('tf-remote-status-note');if(n)n.textContent=e.message||String(e);logEvent('Status Remote gagal: '+(e.message||e),'err');}
  }

  async function sendCommand(action,payload={}){
    if(sending)return;
    if(!lastStatus||!lastStatus.desktopOnline){await refreshStatus();if(!lastStatus||!lastStatus.desktopOnline){logEvent('Perintah dibatalkan: PC/sidebar offline.','err');return;}}
    sending=true;controlsDisabled(true);const status=q('tf-remote-command-status');if(status){status.textContent='Mengirim perintah…';status.className='tf-remote-command-status';}
    try{
      const r=await api('/remote/mobile-command',{command:{action,payload}});
      if(r.accepted===false)throw new Error(r.message||'Perintah sebelumnya masih diproses.');
      logEvent('Kirim: '+action,'info');if(status)status.textContent='Perintah dikirim. Menunggu PC…';
      setTimeout(refreshStatus,450);setTimeout(refreshStatus,1200);setTimeout(refreshStatus,2600);
    }catch(e){if(status){status.textContent=e.message||String(e);status.className='tf-remote-command-status err';}logEvent('Gagal '+action+': '+(e.message||e),'err');}
    finally{sending=false;controlsDisabled(!(lastStatus&&lastStatus.desktopOnline));}
  }

  async function disconnectRemote(){try{await api('/remote/mobile-disconnect',{});}catch(_){} }

  function openRemote(){
    ensureUi();opened=true;document.documentElement.classList.add('tf-mobile-remote-opened');q('tf-mobile-remote-page')?.classList.add('open');logEvent('Remote dibuka dari Mobile.');refreshStatus();if(!pollTimer)pollTimer=setInterval(refreshStatus,POLL_MS);
  }

  function closeRemote(){
    if(opened)void disconnectRemote();opened=false;document.documentElement.classList.remove('tf-mobile-remote-opened');q('tf-mobile-remote-page')?.classList.remove('open');if(pollTimer){clearInterval(pollTimer);pollTimer=null;}logEvent('Remote ditutup dari Mobile.');
  }

  function boot(){
    if(ensureButton())return;
    const mo=new MutationObserver(()=>{if(ensureButton())mo.disconnect();});mo.observe(document.documentElement,{subtree:true,childList:true});setTimeout(()=>ensureButton(),1200);
  }

  window.addEventListener('pagehide',()=>{if(opened)void disconnectRemote();},{passive:true});
  window.addEventListener('beforeunload',()=>{if(opened)void disconnectRemote();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
