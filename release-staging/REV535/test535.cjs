const{chromium}=require('playwright'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV535_MULTI_LINK';
(async()=>{
 const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),p=await b.newPage();
 await p.setContent('<div class="tf-github-update-block" data-tf-update-kind="profile"></div>');
 await p.evaluate(()=>{window.scanCallbacks=[];window.runtimeCallbacks=[];window.timerCount=0;const nativeSet=setInterval,nativeClear=clearInterval;const ids=new Set();window.setInterval=(fn,ms)=>{const id=nativeSet(fn,ms);ids.add(id);timerCount=ids.size;return id;};window.clearInterval=id=>{ids.delete(id);timerCount=ids.size;return nativeClear(id);};window.chrome={storage:{local:{get:(_k,cb)=>cb({tfTotalAnalystProgressV439:{runId:'old',total:6,completed:6,status:'done',startedAt:Date.now()-60000,updatedAt:Date.now()}})},onChanged:{addListener:fn=>scanCallbacks.push(fn)}},runtime:{onMessage:{addListener:fn=>runtimeCallbacks.push(fn)}}};window.scanState=value=>scanCallbacks.forEach(fn=>fn({tfTotalAnalystProgressV439:{newValue:value}},'local'));});
 await p.addScriptTag({path:root+'/assets/tf-multi-total-progress.js'});
 const panel=p.locator('.tf-total-progress');assert.equal(await panel.isVisible(),false,'completed snapshot stays hidden on startup');assert.equal(await p.evaluate(()=>timerCount),0);
 for(const status of ['running','paused','stopped','error','done']){
  await p.evaluate(status=>scanState({runId:'new',total:6,completed:2,status,startedAt:Date.now()-65000,updatedAt:Date.now()}),status);
  assert.equal(await panel.isVisible(),status==='running',status);
  assert.equal(await p.evaluate(()=>timerCount),status==='running'?1:0,status+' interval');
  if(status==='running')assert.match(await p.locator('.tf-total-progress-time').innerText(),/^01:0[56]$/);
 }
 await p.evaluate(()=>scanState({total:6,completed:6,status:'running',startedAt:Date.now()-65000}));assert.equal(await panel.isVisible(),false,'all analysts done hides before final done message');
 await p.evaluate(()=>scanState(null));assert.equal(await panel.isVisible(),false);
 await p.evaluate(()=>scanState({total:6,completed:0,status:'running',startedAt:Date.now()}));assert.equal(await panel.isVisible(),true);
 await p.evaluate(()=>runtimeCallbacks.forEach(fn=>fn({type:'batchScanDone',stopped:true})));assert.equal(await panel.isVisible(),false);assert.equal(await p.evaluate(()=>timerCount),0);
 await b.close();console.log('PASS REV535: only active unfinished batch shows progress/timer; completed startup, pause/stop/error/done/idle and final runtime message hide panel and clear interval.');
})().catch(e=>{console.error(e);process.exit(1)});
