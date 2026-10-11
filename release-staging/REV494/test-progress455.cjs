const assert=require('assert/strict'),{chromium}=require('playwright'),fs=require('fs');
(async()=>{const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV454_MULTI_LINK';const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'});try{
 const p=await b.newPage({viewport:{width:430,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 // Reproduce license bootstrap: body content mounted after initial stylesheet setup.
 await p.setContent('<body class="tf-multi-mode"><button id="tf-multi-back">Back To Main Dashboard</button><div id="controls">'+['start','pause','dashboard','reset'].map(x=>`<button id="tf-multi-control-${x}"></button>`).join('')+'</div><div id="tf-multi-page"></div></body>');
 await p.evaluate(()=>{window.listeners=[];window.saved={};chrome={windows:{getCurrent:async()=>({id:1})},runtime:{getURL:x=>x,sendMessage:async()=>({ok:true})},storage:{local:{get:async()=>({tfMultiScoreDefaultsV431:true}),set:async x=>Object.assign(saved,x)},onChanged:{addListener:f=>listeners.push(f)}}};fetch=async()=>({ok:false});});
 for(const f of ['multi-scanner/core.js','multi-scanner/progress.js','assets/tf-multi-native-sidebar.js'])await p.addScriptTag({path:root+'/'+f});
 await p.evaluate(()=>TFMultiSidebar.mount(document.querySelector('#tf-multi-page'),document.querySelector('#controls')));await p.waitForTimeout(100);
 assert(await p.locator('#tf-multi-top-progress').isHidden());
 assert.equal(await p.locator('#historyMonths').count(),1);assert(await p.evaluate(()=>document.querySelector('#minimumPortfolioMonths').parentElement.nextElementSibling.contains(document.querySelector('#historyMonths'))));assert(await p.evaluate(()=>document.querySelector('#minRepeats').parentElement.nextElementSibling.textContent.includes('±5 pips')));
 const job={id:'test',status:'running',inventory:Array(89).fill({}),inventoryComplete:true,cursor:5,results:[],skipped:Array(5).fill({}),progress:{inside:true,index:6,name:'Sobat Gold',fraction:.2,message:'Statistics · Survived Month'}};
 async function send(j){await p.evaluate(j=>listeners.forEach(f=>f({tfMultiJobV419:{newValue:j}},'local')),j)}
 await send(job);assert(await p.locator('#tf-multi-top-progress').isVisible());assert(await p.locator('#card-progress').isVisible());assert.equal(await p.locator('.progress-track').getAttribute('aria-valuenow'),'20');
 const geometry=await p.locator('.progress-track').evaluate(e=>{const f=e.firstElementChild,a=e.getBoundingClientRect(),z=f.getBoundingClientRect();return {height:a.height,width:a.width,fill:z.width,bg:getComputedStyle(f).backgroundImage,afterBack:document.querySelector('#tf-multi-back').nextElementSibling.id}});
 assert(geometry.height>=4&&geometry.width>300);assert(geometry.fill>0);assert(geometry.bg.includes('gradient'));assert.equal(geometry.afterBack,'tf-multi-top-progress');
 await p.screenshot({path:'outputs/rev454-sidebar-progress.png'});
 await send({...job,progress:{inside:false,message:'Memuat card'}});assert(await p.locator('.progress-track.indeterminate').isVisible());
 await send({...job,status:'paused'});assert(await p.locator('#tf-multi-top-progress').isVisible());
 for(const status of ['stopped','complete','error']){await send({...job,status});assert(await p.locator('#tf-multi-top-progress').isHidden());}
 await send(null);assert(await p.locator('#tf-multi-top-progress').isHidden());
 // Dashboard shows stored scan filters instead of exposing raw JSON.
 await p.setViewportSize({width:1440,height:1200});await p.setContent('<body></body>');await p.addStyleTag({path:root+'/multi-scanner/styles.css'});
 await p.evaluate(()=>{delete window.chrome;window.TFEngine=class{constructor(){} };window.TFMultiPreviewJob={id:'preview',isPreview:true,status:'stopped',inventory:[],inventoryComplete:true,cursor:0,results:[{name:'Test analyst',url:'https://account.tradersfamily.id/channels/1/',pair:'XAUUSD',sl:null,slFixedChecked:false,consecutive:2,losing:'1/12',level:'Master',status:'Priority'}],skipped:[],logs:[],ranges:[{start:'2026-07-06',end:'2026-10-06'}],asOf:'2026-10-06',filters:{...TFCore.defaults,levels:['Master','Legend'],statuses:[],probabilityMin:30,profitMin:'',profitMax:'',maxLoss:'',recoveryAllowed:[],profitFactorAllowed:[],survivedOn:true,survivedMonths:['2026-10'],historyMonths:3,requireFixed:false}};});
 await p.addScriptTag({path:root+'/multi-scanner/dashboard.js'});await p.waitForTimeout(100);
 assert.equal(await p.locator('#results .analyst-name-cell').evaluate(e=>getComputedStyle(e).textAlign),'left');assert.equal(await p.locator('#result-head th[data-sort="name"]').evaluate(e=>getComputedStyle(e).textAlign),'center');assert.equal(await p.locator('.filter-summary-table').count(),2);const text=await p.locator('#filter-summary').textContent();for(const value of ['Master, Legend','Semua status','30 – 100%','Oktober 2026','OFF · History Signal dilewati','Tidak dibatasi','Tidak difilter'])assert(text.includes(value),value);
 assert(await p.locator('#filter-info').isHidden());assert.equal(await p.locator('.audit details').count(),0);
 const order=await p.locator('.filter-summary').evaluate(e=>e.nextElementSibling.className);assert.equal(order,'audit');
 const positions=await p.locator('.filter-summary-table').evaluateAll(e=>e.map(x=>({x:x.getBoundingClientRect().x,y:x.getBoundingClientRect().y})));assert(positions[1].x>positions[0].x);assert.equal(positions[0].y,positions[1].y);
 await p.screenshot({path:'outputs/rev454-filter-summary.png',fullPage:true});
 await p.setViewportSize({width:430,height:1000});const mobile=await p.locator('.filter-summary-table').evaluateAll(e=>e.map(x=>({x:x.getBoundingClientRect().x,y:x.getBoundingClientRect().y})));assert.equal(mobile[0].x,mobile[1].x);assert(mobile[1].y>mobile[0].y);assert.deepEqual(errors,[]);
 console.log('PASS: visible per-card bar without external CSS, position below Back, inventory/paused states, terminal states hide; readable saved filters in two responsive tables; no raw JSON; no browser errors.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
