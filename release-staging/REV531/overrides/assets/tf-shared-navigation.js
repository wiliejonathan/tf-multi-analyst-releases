(() => {
 'use strict';
 const dashboard='dashboard.html';
 const builders=[['#indicator-builder','Created MT4/MT5 Indicator'],['#tradingview-builder','Created TradingView Indicator']];
 function createStandalone(){
  const host=document.querySelector('main.page-shell');if(!host)return null;
  const wrap=document.createElement('div');wrap.className='tf-standalone-nav';
  wrap.innerHTML='<nav class="tf-top-nav" aria-label="Navigator"><ul><li><a class="tf-nav-link" href="dashboard.html">Beranda</a></li><li class="tf-nav-divider" aria-hidden="true"></li><li><a class="tf-nav-link" href="dashboard.html#analis-report">Analis Report</a></li><li class="tf-nav-divider" aria-hidden="true"></li><li><details><summary>iSignal</summary><ul><li><a href="https://account.tradersfamily.id/channels/isignal/" target="_blank" rel="noopener noreferrer">iSignal Analis</a></li><li><a href="iSignalUsers.html">iSignal Users</a></li></ul></details></li><li class="tf-nav-divider" aria-hidden="true"></li><li><details><summary>TF Copy Signal</summary><ul><li><a href="https://account.tradersfamily.id/channels/" target="_blank" rel="noopener noreferrer">Beranda</a></li><li><a href="https://account.tradersfamily.id/channels/browse/?v=symbol" target="_blank" rel="noopener noreferrer">Browse Channel</a></li><li><a href="https://account.tradersfamily.id/channels/my/" target="_blank" rel="noopener noreferrer">My Channels</a></li></ul></details></li><li class="tf-nav-divider" aria-hidden="true"></li><li><a class="tf-nav-link" href="https://account.tradersfamily.id/profile/u/155921/?tab=settings" target="_blank" rel="noopener noreferrer">Profile</a></li></ul></nav>';
  const style=document.createElement('style');style.textContent='.tf-standalone-nav{margin:18px 0 24px;padding:8px;border:1px solid #2c3b51;border-radius:16px;background:#0a1324;color:#dce8f5;font:13px/1.4 system-ui,sans-serif}.tf-standalone-nav nav>ul{list-style:none;display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:0;margin:0}.tf-standalone-nav a,.tf-standalone-nav summary{display:block;padding:8px 10px;color:#dce8f5;text-decoration:none;cursor:pointer;border-radius:8px}.tf-standalone-nav a:hover,.tf-standalone-nav summary:hover{background:#173149}.tf-standalone-nav .tf-nav-divider{height:20px;width:1px;background:#2c3b51;margin:0 3px}.tf-standalone-nav details{position:relative}.tf-standalone-nav details>ul{position:absolute;z-index:50;list-style:none;min-width:170px;background:#101e32;border:1px solid #34516c;padding:6px;border-radius:9px;box-shadow:0 12px 30px #0006}.tf-standalone-nav details>ul li{white-space:nowrap}.tf-standalone-nav summary{list-style:none}.tf-standalone-nav summary:after{content:" ▾"}.tf-standalone-nav summary::-webkit-details-marker{display:none}';
  document.head.append(style);const header=host.querySelector(':scope>header');if(header)header.after(wrap);else host.prepend(wrap);return wrap.querySelector('nav>ul');
 }
 function init(){
  const nav=document.querySelector('.tf-top-nav>ul')||createStandalone();if(!nav)return;
  const localDashboard=location.pathname.split('/').pop()==='dashboard.html'&&document.body.dataset.page!=='isignal-users';
  for(const [route,label] of builders){
   if([...nav.querySelectorAll('a')].some(a=>a.dataset.tfBuilderRoute===route||a.getAttribute('href')===route||a.getAttribute('href')===dashboard+route))continue;
   const divider=document.createElement('li');divider.className='tf-nav-divider';divider.setAttribute('aria-hidden','true');
   const item=document.createElement('li'),a=document.createElement('a');a.className='tf-nav-link';a.dataset.tfBuilderRoute=route;a.href=localDashboard?route:dashboard+route;a.textContent=label;item.append(a);nav.append(divider,item);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
