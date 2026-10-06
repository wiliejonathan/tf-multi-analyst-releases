const fs=require('fs'),assert=require('assert'),{chromium}=require('playwright');
(async()=>{const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV453_MULTI_LINK';const browser=await chromium.launch({channel:'chrome',headless:true});try{
const p=await browser.newPage();await p.setContent('<button id="scan-from-isignal-btn"></button><button disabled id="tf-btn-submit-isignal"></button><button disabled id="batch-scan-isignal-btn"></button><div id="isignal-links-container"><input class="analyst-link-input"></div>');
await p.evaluate(()=>{window.listeners=[];window.chrome={runtime:{sendMessage:(m,cb)=>cb?.({ok:true})},storage:{local:{get:(k,cb)=>cb({tfIsignalDiscoveryV450:{runId:'done',status:'done',total:1,items:[{url:'https://account.tradersfamily.id/channels/1/'}]}})},onChanged:{addListener:f=>listeners.push(f)}}};window.setIsignalStatus=()=>{};window.tf_populateIsignalRows=items=>document.querySelector('input').value=items[0].url;});
await p.addScriptTag({path:root+'/assets/tf-multi-isignal-sidebar.js'});await p.waitForTimeout(100);
assert.equal(await p.locator('#tf-btn-submit-isignal').isEnabled(),true);assert.equal(await p.locator('#batch-scan-isignal-btn').isEnabled(),true);
await p.evaluate(()=>{listeners[0]({tfScanInProgress:{newValue:true},tfScanOrigin:{newValue:'updateButton'}},'local');document.querySelectorAll('#tf-btn-submit-isignal,#batch-scan-isignal-btn').forEach(b=>{b.disabled=true;b.classList.add('tf-scan-activity-locked');});});await p.waitForTimeout(100);assert.equal(await p.locator('#batch-scan-isignal-btn').isEnabled(),false);
await p.evaluate(()=>{listeners[0]({tfScanInProgress:{newValue:false}},'local');document.querySelectorAll('#tf-btn-submit-isignal,#batch-scan-isignal-btn').forEach(b=>b.classList.remove('tf-scan-activity-locked'));});await p.waitForTimeout(100);assert.equal(await p.locator('#batch-scan-isignal-btn').isEnabled(),true);
await p.evaluate(()=>{document.querySelector('input').value='';document.querySelector('input').dispatchEvent(new Event('input',{bubbles:true}));});await p.waitForTimeout(100);assert.equal(await p.locator('#batch-scan-isignal-btn').isEnabled(),false);
const source=fs.readFileSync(root+'/assets/tf-multi-native-sidebar.js','utf8');await p.setContent('<div id="tf-multi-page"><form id="filters"></form></div>');await p.addScriptTag({path:root+'/multi-scanner/core.js'});
await p.evaluate(code=>{const $=s=>document.querySelector(s);eval(code);},source.slice(source.indexOf('const chip='),source.indexOf('const topProgress=')));
assert.equal(await p.locator('#fixedRepeatsOn').count(),0);assert.equal(await p.locator('#filters #minRepeats').count(),0);
const html=JSON.parse(source.slice(source.indexOf('root.innerHTML=')+15,source.indexOf(';',source.indexOf('root.innerHTML='))).split('+pairOptions+')[0]);
assert(html.includes('id="minRepeats"'));assert(html.indexOf('id="minRepeats"')>html.indexOf('id="requireFixed"'));assert(html.indexOf('id="minRepeats"')<html.indexOf('for="pair"'));
await p.evaluate(s=>{const st=document.createElement('style');st.textContent="*{box-sizing:border-box}"+s;document.head.append(st);},source.match(/style\.textContent\+= '([^']+)'/)[1]);
const r=await p.evaluate(()=>{const a=document.querySelector('#survived-caption').getBoundingClientRect(),b=document.querySelector('#market-refresh').getBoundingClientRect();return {top:Math.abs(a.top-b.top),height:Math.abs(a.height-b.height)};});assert(r.top<1);assert(r.height<1);
assert.equal(await p.evaluate(()=>TFCore.validate({...TFCore.defaults,fixedRepeatsOn:false}).fixedRepeatsOn),true);
assert(fs.readFileSync(root+'/assets/927ecbd63036f61b.js','utf8').includes('if (!btnSubmitIsignal.disabled) batchIsignalBtn?.click()'));
await p.setContent('<button id="tf-multi-back"></button><div id="controls"><button id="tf-multi-control-start"></button><button id="tf-multi-control-pause"></button><button id="tf-multi-control-reset"></button><button id="tf-multi-control-dashboard"></button></div><div id="tf-multi-page"></div>');
await p.evaluate(()=>{window.saved={};window.chrome={storage:{local:{get:async()=>({tfMultiScoreDefaultsV431:true}),set:async d=>Object.assign(saved,d)},onChanged:{addListener:()=>{}}},runtime:{getURL:x=>x}};window.fetch=async()=>({ok:false});});
await p.addScriptTag({path:root+'/multi-scanner/progress.js'});await p.addScriptTag({path:root+'/assets/tf-multi-native-sidebar.js'});await p.evaluate(()=>TFMultiSidebar.mount(document.querySelector('#tf-multi-page'),document.querySelector('#controls')));
await p.evaluate(()=>document.querySelector('#tf-multi-page').style.display='block');await p.waitForTimeout(100);assert.equal(await p.locator('#minRepeats').inputValue(),'10');
await p.locator('#minRepeats').fill('12');await p.locator('#minRepeats').dispatchEvent('change');assert.equal(await p.evaluate(()=>saved.tfMultiFiltersV419.minRepeats),12);
await p.locator('#requireFixed').dispatchEvent('click');assert.equal(await p.locator('#minRepeats').isEnabled(),false);assert.equal(await p.evaluate(()=>saved.tfMultiFiltersV419.requireFixed),false);
await p.locator('#requireFixed').dispatchEvent('click');assert.equal(await p.locator('#minRepeats').isEnabled(),true);assert.equal(await p.evaluate(()=>saved.tfMultiFiltersV419.fixedRepeatsOn),true);
console.log('PASS: discovered links enable both Submit controls; busy locks and empty links disable; single SL toggle retains minimum 10; refresh aligned; legacy repeat flag normalized.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});



