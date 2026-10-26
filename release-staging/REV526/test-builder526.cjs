const {chromium}=require('playwright'),assert=require('assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV526_MULTI_LINK';
(async()=>{
 const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),p=await b.newPage();
 await p.route('**/*',r=>r.fulfill({body:'<html><body><main id="tf-dashboard-main"><nav class="tf-top-nav"><ul style="display:flex;list-style:none;align-items:center"><li><a class="tf-nav-link" href="#">Profile</a></li></ul></nav><section>Dashboard</section></main></body></html>',contentType:'text/html'}));await p.goto('https://builder.test/');
 await p.clock.install({time:new Date('2026-10-26T12:00:00Z')});
 await p.addStyleTag({path:path.join(root,'assets/7e95b596e5bf8dff.css')});
 await p.evaluate(()=>{const row={analyst:'Udine_Trade',pair:'XAUUSD',pips:400,entry:4000,takeProfit:4040,stopLoss:3980,type:'Buy',createdDate:'23-10-2026 20:00 WIB',openedDate:'23-10-2026 21:27 WIB',displayDate:'23-10-2026 22:27 WIB'};window.chrome={storage:{local:{get:async()=>({tfHistorySignals:[row]})}},runtime:{connectNative:()=>({onDisconnect:{addListener(){}},onMessage:{addListener(fn){window.compilerResult=fn;}},postMessage(){},disconnect(){}})}};});
 await p.addScriptTag({path:path.join(root,'assets/tf-indicator-builder.js')});await p.getByText('Created MT4/MT5 Indicator',{exact:true}).first().click();
 const divider=p.locator('nav li.tf-nav-divider');assert.equal(await divider.count(),1);assert.equal(await divider.evaluate(e=>e.previousElementSibling.textContent),'Profile');assert.equal(await divider.evaluate(e=>getComputedStyle(e).width),'1px');
 for(const select of await p.locator('#tf-indicator-builder select').all()){
  assert.equal(await select.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(16, 28, 48)');assert.equal(await select.evaluate(e=>getComputedStyle(e).colorScheme),'dark');
 }
 await p.locator('[name=analyst]').selectOption('Udine_Trade');await p.locator('[name=pair]').selectOption('XAUUSD');
 for(const platform of ['MT4','MT5']){
  await p.locator('[name=platform]').selectOption(platform);await p.getByRole('button',{name:'Submit',exact:true}).click();
  // Exercise the real browser download flow with a valid hash-checked response.
  const bytes=Buffer.from('synthetic compiled response '+platform),hash=crypto.createHash('sha256').update(bytes).digest('hex');
  const pending=p.waitForEvent('download');
  await p.evaluate(async x=>{await compilerResult({type:'chunk',data:x.data});await compilerResult({type:'done',compilerVersion:'2.26',filename:'TF_RR_20261026_205004.ex'+x.suffix,size:x.size,sha256:x.hash});},{data:bytes.toString('base64'),suffix:platform.at(-1),size:bytes.length,hash});
  const download=await pending;assert.equal(download.suggestedFilename(),'26-10-2026 Udine_Trade.ex'+platform.at(-1));
 }
 await p.getByRole('button',{name:'Submit',exact:true}).click();await p.evaluate(()=>compilerResult({type:'done',filename:'TF_RR_20261026_205004.ex5'}));assert.match(await p.locator('#tf-indicator-message').textContent(),/Perbarui compiler lokal/);
 for(const width of [360,768,1200]){await p.setViewportSize({width,height:850});assert(await p.evaluate(()=>document.querySelector('#tf-indicator-builder').scrollWidth<=document.documentElement.clientWidth));}
 console.log('PASS divider, dark selectors, responsive form, date + analyst EX4/EX5 downloads and outdated compiler detection');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
