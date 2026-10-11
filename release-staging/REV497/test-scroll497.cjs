const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV497_MULTI_LINK';
const source=fs.readFileSync(path.join(root,'assets/4b4d6b8dc315a95c.js'),'utf8');
const initial=JSON.parse(source.slice(source.indexOf('=')+1,source.indexOf(';\n')).trim());
(async()=>{
const browser=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'});
for(const width of [390,966,1440])for(const direct of [true,false]){
 const page=await browser.newPage({viewport:{width,height:764}});
 await page.route('https://report.test/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html data-tf-server-authorized="1"><body class="tf-risk-explainer-open">'+initial+'</body></html>'}));
 await page.goto('https://report.test/dashboard.html'+(direct?'#analis-report':''));
 await page.addStyleTag({path:path.join(root,'assets/7e95b596e5bf8dff.css')});
 assert.equal(await page.evaluate(()=>getComputedStyle(document.body).overflowY),'hidden');
 await page.addScriptTag({content:"let historySignals=[],analystSourcesByName={};function tf_refreshLatestRiskState(){return {byPair:new Map(),byAnalyst:new Map()}}"});
 await page.addScriptTag({path:path.join(root,'assets/tf-analyst-report.js')});
 if(!direct)await page.evaluate(()=>document.getElementById('tf-report-nav').click());
 await page.locator('#tf-report-explainer button').click();
 assert.equal(await page.locator('#tf-risk-explainer').count(),0);
 assert.equal(await page.evaluate(()=>document.body.classList.contains('tf-risk-explainer-open')),false);
 assert.notEqual(await page.evaluate(()=>getComputedStyle(document.body).overflowY),'hidden');
 await page.evaluate(()=>{document.querySelector('.tf-report-adjust').style.height='1000px';const wrap=document.querySelector('.tf-report-scroll');wrap.style.maxHeight='350px';document.querySelector('#tf-analyst-report tbody').innerHTML=Array.from({length:40},(_,i)=>'<tr><td>'+i+'</td><td>Analyst</td>'+('<td>10</td>'.repeat(7))+'</tr>').join('')});
 await page.mouse.move(width-40,400);await page.mouse.wheel(0,650);await page.waitForTimeout(150);
 assert(await page.evaluate(()=>window.scrollY>0),'Page cannot scroll '+width+' direct='+direct);
 await page.locator('.tf-report-scroll').scrollIntoViewIfNeeded();
 await page.locator('.tf-report-scroll').hover();await page.mouse.wheel(0,500);await page.waitForTimeout(150);
 assert(await page.locator('.tf-report-scroll').evaluate(e=>e.scrollTop>0),'Table cannot scroll');
 await page.evaluate(()=>document.querySelector('a[data-tf-url="dashboard.html"]').click());
 assert.equal(await page.locator('#tf-analyst-report').isVisible(),false);
 await page.evaluate(()=>document.getElementById('tf-report-nav').click());
 assert.equal(await page.locator('#tf-analyst-report').isVisible(),true);
 assert.equal(await page.evaluate(()=>document.body.classList.contains('tf-risk-explainer-open')),false);
 await page.close();
}
await browser.close();console.log('PASS direct hash and menu navigation: page scroll, inner table scroll, return/reopen at phone/tablet/desktop widths');
})().catch(e=>{console.error(e);process.exit(1)});
