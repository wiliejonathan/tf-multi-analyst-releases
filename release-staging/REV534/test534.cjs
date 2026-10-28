const{chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV534_MULTI_LINK';
(async()=>{
 const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'});
 const p=await b.newPage();
 await p.setContent('<html data-tf-server-authorized="1"><body><table id="drawdown-table"><tbody><tr class="dd-child-row"><td class="tf-latest-risk-healthy"><table class="drawdown-detail-table"><tr><td class="tp">500</td><td class="sl">708.4</td><td class="sl">$306.52</td></tr></table></td></tr></tbody></table></body></html>');
 await p.addStyleTag({path:root+'/assets/7e95b596e5bf8dff.css'});
 const colors=await p.locator('.drawdown-detail-table td').evaluateAll(es=>es.map(e=>getComputedStyle(e).color));
 assert.deepEqual(colors,['rgb(0, 230, 118)','rgb(255, 64, 64)','rgb(255, 64, 64)']);
 const auth=await b.newPage();
 await auth.route('**/*',r=>r.fulfill({contentType:'text/html',body:'<form id="loginForm"><input id="logname"><input id="logpass"><button id="btn-signin">Masuk</button></form><a data-track="gtm_c_sb_nav_msk">Masuk</a>'}));
 await auth.addInitScript(()=>{
  window.__patches=[];window.__messages=[];window.__listeners=[];
  const data={tfManualAuthActive:true,tfManualAuthStartedAt:Date.now()};
  window.chrome={runtime:{id:'test-extension',getURL:s=>s,sendMessage:(m,cb)=>{__messages.push(m);if(cb)cb({});},onMessage:{addListener:()=>{}}},storage:{local:{get:(keys,cb)=>{const v={};for(const k of keys)v[k]=data[k];if(cb)cb(v);return Promise.resolve(v)},set:(v,cb)=>{__patches.push(v);Object.assign(data,v);if(cb)cb()},remove:(_k,cb)=>{if(cb)cb()}},onChanged:{addListener:fn=>__listeners.push(fn)}}};
 });
 await auth.goto('https://account.tradersfamily.id/?tfAuth=1&tfAuthToken=synthetic');
 await auth.addScriptTag({path:root+'/assets/tf-login-helper-rev205.js'});
 await auth.waitForTimeout(1800);
 assert.equal(await auth.evaluate(()=>__patches.some(v=>v.tfLoginError||v.tfAccountLoginState==='logged_out')),false,'pending login must not be rejected');
 assert.equal(await auth.evaluate(()=>__messages.some(m=>m.type==='tfLoggedOut')),false);
 assert.equal(await auth.evaluate(()=>__patches.some(v=>v.tfLoginConfirmed===true)),false,'pending flow is not a successful login');
 await auth.evaluate(()=>{for(const fn of __listeners)fn({tfManualAuthActive:{newValue:false}},'local');window.dispatchEvent(new Event('focus'));});
 await auth.waitForTimeout(2200);
 assert.equal(await auth.evaluate(()=>__patches.some(v=>v.tfAccountLoginState==='logged_out')),true,'real logged-out form must still be detected after flow ends');
 await auth.goto('https://account.tradersfamily.id/?tfAuth=1&tfAuthToken=synthetic&sign=out');
 await auth.addScriptTag({path:root+'/assets/tf-login-helper-rev205.js'});
 assert.equal(await auth.evaluate(()=>__patches.some(v=>v.tfLogoutSuccess===true)),true,'explicit logout overrides pending login');
 await auth.close();
 await p.route('https://report.test/**',r=>{const u=new URL(r.request().url()),file=path.resolve(root,'.'+u.pathname);return fs.existsSync(file)?r.fulfill({path:file}):r.fulfill({status:404,body:''});});
 await p.setContent('<iframe id="report" src="https://report.test/assets/tf-activity-report.html" style="width:100%;height:500px"></iframe><script>window.heights=[];addEventListener("message",e=>{if(e.data.type==="TF_ACTIVITY_HEIGHT"){heights.push(e.data.height);document.querySelector("iframe").style.height=e.data.height+"px"}})</script>');
 const frame=p.frameLocator('#report');await frame.locator('.method summary').waitFor();
 await p.waitForTimeout(400);await frame.locator('.method summary').click();
 await p.waitForFunction(()=>heights.length>0);
 let h,bounds;
 for(let attempt=0;attempt<40;attempt++){
  h=await p.evaluate(()=>heights.at(-1));
  bounds=await frame.locator('.method').evaluate(e=>({bottom:e.getBoundingClientRect().bottom+scrollY,open:e.open}));
  if(bounds.open&&h>=bounds.bottom-2)break;
  await p.waitForTimeout(50);
 }
 assert(bounds.open);assert(h>=bounds.bottom-2,`methodology must fit in resized iframe: ${h} < ${bounds.bottom}`);
 const timer=await b.newPage();await timer.setContent('<div class="tf-github-update-block" data-tf-update-kind="profile"></div>');
 await timer.evaluate(()=>{window.now534=20000000;Date.now=()=>now534;window.progressListeners=[];window.chrome={storage:{local:{get:(_k,cb)=>cb({tfTotalAnalystProgressV439:{runId:'test',total:6,completed:2,status:'running',startedAt:now534-65000}})},onChanged:{addListener:fn=>progressListeners.push(fn)}},runtime:{onMessage:{addListener:()=>{}}}};});
 await timer.addScriptTag({path:root+'/assets/tf-multi-total-progress.js'});
 assert.equal(await timer.locator('.tf-total-progress-time').innerText(),'01:05');
 await timer.evaluate(()=>{for(const fn of progressListeners)fn({tfTotalAnalystProgressV439:{newValue:{runId:'test',total:6,completed:6,status:'done',startedAt:now534-3661000,updatedAt:now534}}},'local');now534+=90000;});
 assert.equal(await timer.locator('.tf-total-progress-time').innerText(),'1:01:01');
 assert(await timer.locator('.tf-total-progress').isVisible());
 await timer.waitForTimeout(1100);assert.equal(await timer.locator('.tf-total-progress-time').innerText(),'1:01:01');
 console.log('PASS REV534: loss colors, pending Google flow, explicit/real logout, methodology iframe height, elapsed timer and final frozen duration. Synthetic data only.');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

