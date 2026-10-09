const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV487_MULTI_LINK';
const source=fs.readFileSync(path.join(root,'assets/4b4d6b8dc315a95c.js'),'utf8');
const rules=source.slice(source.indexOf('let __tfLatestRiskState'),source.indexOf('function tf_latestRiskReason'));
const initial=JSON.parse(source.slice(source.indexOf('=')+1,source.indexOf(';\n')).trim());
(async()=>{
const browser=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),page=await browser.newPage();
await page.route('https://report.test/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body>'+initial+'</body>'}));
await page.goto('https://report.test/dashboard.html',{waitUntil:'domcontentloaded'});
await page.evaluate(()=>{document.documentElement.setAttribute('data-tf-server-authorized','1');document.querySelector('#tf-risk-explainer').style.display='none';globalThis.calls=0;window.tfRequireLicense=()=>{calls++;};document.querySelector('a[data-tf-url="dashboard.html"]').addEventListener('click',()=>tfRequireLicense());});
await page.addScriptTag({content:`let historySignals=[],ANALYSTS=[],analystSourcesByName={};\n${rules}`});
await page.addScriptTag({content:source.slice(source.indexOf('function tf_xlsxXmlEscape'),source.indexOf('function tf_historyExcelColumnDefs'))});
await page.addScriptTag({content:'let currentBalance=5000; function getDollarPerPipForAnalyst(){return 10} function getEffectiveSlForAnalyst(){return {pips:100}} function computeSlStatsFromHistory(){return {}} function getRiskPercentForAnalyst(){return 1} function computeLot(b){return b/100000} function roundLotToTwoDecimals(x){return Math.round(x*100)/100}'});
await page.evaluate(()=>{window.shared=document.getElementById('tf-user-adjustment415');const c=document.createElement('div');c.id='tf-balance-cards412';c.textContent='Saldo Equity $ PnL $ PnL %';shared.after(c);});
await page.addScriptTag({path:path.join(root,'assets/tf-analyst-risk-adjustment.js')});
await page.addScriptTag({path:path.join(root,'assets/tf-analyst-report.js')});
await page.addStyleTag({path:path.join(root,'assets/7e95b596e5bf8dff.css')});
await page.addStyleTag({path:path.join(root,'assets/tf-mechanical-theme.css')});
await page.evaluate(()=>{
const add=(name,date,pips,pair='XAUUSD')=>historySignals.push({analyst:name,pair,pips,sortKey:Date.parse(date+'T12:00:00Z')});
for(const n of ['Green','Yellow','Red']){analystSourcesByName[n]={url:'https://account.tradersfamily.id/profile/'+n};for(let i=1;i<=10;i++)add(n,'2026-01-'+String(i).padStart(2,'0'),-100);add(n,'2026-02-01',3000);}
for(let i=1;i<=13;i++)add('Yellow','2026-08-'+String(i).padStart(2,'0'),-10);add('Yellow','2026-08-20',2000);
for(let i=1;i<=14;i++)add('Red','2026-08-'+String(i).padStart(2,'0'),-10);add('Red','2026-08-20',2000);
add('Green','2026-09-01',100);analystSourcesByName.Missing={url:'https://account.tradersfamily.id/profile/missing'};
});
assert.equal(await page.locator('#tf-analyst-risk-adjustment input[type=checkbox]:checked').count(),5);assert(await page.locator('#tf-analyst-risk-adjustment').evaluate(e=>e.nextElementSibling.id==='tf-pair-value-adjustment'));assert.equal(await page.locator('#tf-pair-value-adjustment').evaluate(e=>e.nextElementSibling.id),'section-summary');assert.equal(await page.locator('#tf-pair-value-adjustment>details>summary').innerText(),'Table Adjustment Value of Pairs - Hide');assert.match(initial,/PnL.*pips, bukan dolar/);
assert.equal(await page.locator('.tf-risk-fold').getAttribute('open'),null);assert.equal(await page.locator('#summary-table').isVisible(),false);assert.equal(await page.locator('.pip-table-compact').first().isVisible(),false);assert.equal(await page.locator('.tf-price-fold>summary').evaluate(e=>getComputedStyle(e,'::before').content),'"▶"');await page.click('.tf-lot-fold>summary');assert.equal(await page.locator('#summary-table').isVisible(),true);await page.click('.tf-risk-fold>summary');assert.equal(await page.evaluate(()=>tf_analystRiskSettings().critical),120);await page.fill('[data-risk=cons]','40');await page.locator('[data-risk=cons]').dispatchEvent('change');assert.equal(await page.evaluate(()=>tf_analystRiskSettings().cons),30);assert.match(await page.locator('.tf-risk-fold>summary').innerText(),/Show$/);await page.locator('.tf-risk-confirm').click();assert.equal(await page.evaluate(()=>tf_analystRiskSettings().cons),40);await page.fill('[data-risk=cons]','30');await page.locator('.tf-risk-confirm').click();
const nav=await page.locator('.tf-top-nav > ul > li').allTextContents();assert.match(nav[0],/Beranda/);assert.match(nav[1],/Analis Report/);
await page.click('#tf-report-nav');assert.equal(await page.locator('#section-summary').isVisible(),false);assert.equal(await page.locator('#tf-analyst-report').isVisible(),true);
assert.equal(await page.locator('#tf-report-explainer .tf-risk-explainer-row').count(),2);assert.equal(await page.locator('#tf-report-explainer .tf-risk-green').count(),0);assert.match(await page.locator('#tf-report-explainer').innerText(),/dibagi 4/);assert.match(await page.locator('#tf-report-explainer').innerText(),/Cons. Loss Count/);await page.getByRole('button',{name:'Mengerti !',exact:true}).click();
assert(await page.locator('#tf-analyst-report #tf-user-adjustment415').isVisible());assert.equal(await page.locator('#tf-analyst-report #rule1-withdraw-note').isVisible(),false);
assert.equal(await page.locator('#tf-analyst-report .tf-report-risk #tf-analyst-risk-adjustment').count(),1);const table=page.locator('#tf-analyst-report');assert.equal(await table.locator('tbody tr').count(),4);
const green=table.locator('tbody tr').filter({hasText:'Green'}),yellow=table.locator('tbody tr').filter({hasText:'Yellow'}),red=table.locator('tbody tr').filter({hasText:'Red'});
assert.equal(await green.getAttribute('data-severity'),'0');assert.equal(await yellow.getAttribute('data-severity'),'1');assert.equal(await red.getAttribute('data-severity'),'2');
assert.deepEqual(await yellow.locator('td').allTextContents(),['!','Yellow','—','10x','13x','-1,000 pips-$500-10%','-130 pips-$65-1.3%','1,870 pips$935Avg. 1 Bulan','0 pips0%$0']);
assert.equal(await table.locator('thead th').count(),9);assert.equal(await yellow.locator('.tf-report-pnl-pair').count(),4);assert.equal(await yellow.locator('.tf-report-pnl-pair').first().locator('span').count(),3);assert.equal(await yellow.locator('.tf-report-pnl-pair').first().evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1);
assert.equal(await green.locator('a').getAttribute('target'),'_blank');assert.equal(await green.locator('a').getAttribute('href'),'https://account.tradersfamily.id/profile/Green');
assert.equal(await red.locator('td:nth-child(2)').evaluate(el=>getComputedStyle(el).color),'rgb(239, 68, 68)');
assert.equal(await table.locator('tbody tr[data-severity="unknown"]').count(),1);
await page.click('a[data-tf-url="dashboard.html"]');assert.equal(await page.evaluate(()=>shared===document.querySelector('#section-summary #tf-user-adjustment415')),true);assert.equal(await table.isVisible(),false);assert.equal(await page.locator('#section-summary').isVisible(),true);assert.equal(await page.evaluate(()=>calls),0);
await page.click('#tf-report-nav');await page.goBack();assert.equal(await table.isVisible(),false);await page.goForward();assert.equal(await table.isVisible(),true);
await page.click('th[data-sort="severity"]');assert.match(await table.locator('tbody tr').first().innerText(),/Green/);await page.click('th[data-sort="severity"]');assert.match(await table.locator('tbody tr').first().innerText(),/Red/);
for(const key of ['oldLoss','newLoss','oldDd','newDd','name']){await page.click('th[data-sort="'+key+'"]');await page.click('th[data-sort="'+key+'"]');}
await page.evaluate(()=>{const source=[];for(let i=3;i<=8;i++)source.push({analyst:'PnL',pair:'XAUUSD',pips:100,sortKey:new Date(2026,i,2).getTime()});const test=(loss)=>{const rows=source.concat({analyst:'PnL',pair:'XAUUSD',pips:-loss,sortKey:new Date(2026,9,2).getTime()});return tf_monthlyPnlRisk(rows,'2026-10',tf_latestRiskNormAnalyst,tf_latestRiskNormPair,tf_latestRiskRowTs,tf_latestRiskMonthKey).get('pnl');};for(const [n,s] of [[75,0],[75.01,1],[120,1],[120.01,2]]){const r=test(n);if(r.severity!==s||r.avgPips!==100||r.avgUsd!==50)throw Error('threshold '+n);}localStorage.setItem('tfAnalystRiskAdjustment',JSON.stringify({warning:60,critical:90}));if(test(55).severity!==0||test(80).severity!==1||test(91).severity!==2)throw Error('custom thresholds');localStorage.setItem('tfAnalystRiskAdjustment',JSON.stringify({warningOn:false,criticalOn:false}));if(test(1000).severity!==0)throw Error('tick off');localStorage.removeItem('tfAnalystRiskAdjustment');});
for(const th of await table.locator('thead th').all()){assert.equal(await th.evaluate(el=>getComputedStyle(el).textAlign),'center');assert.equal(await th.evaluate(el=>getComputedStyle(el).verticalAlign),'middle');assert.equal(await th.locator('.tf-report-arrow').evaluate(el=>getComputedStyle(el).position),'absolute');}assert.equal(await yellow.locator('td:nth-child(5)').evaluate(el=>getComputedStyle(el).verticalAlign),'middle');await table.locator('table').screenshot({path:'outputs/report487-table.png'});
const dl=page.waitForEvent('download');await page.click('#tf-report-excel');await (await dl).saveAs('outputs/report474-test.xlsx');
await page.evaluate(()=>{for(let i=0;i<20;i++)analystSourcesByName['Additional '+i]={url:'https://example.com/'+i};});await page.click('th[data-sort="name"]');await page.waitForTimeout(100);assert.equal(await table.locator('tbody tr').count(),24);assert(await table.locator('.tf-report-scroll').evaluate(e=>e.scrollHeight>e.clientHeight));
await page.setViewportSize({width:390,height:844});assert.equal(await table.isVisible(),true);assert(await table.locator('.tf-report-scroll').evaluate(el=>el.scrollWidth>el.clientWidth));
if(!process.env.CI)await page.screenshot({path:'outputs/report474-mobile.png',fullPage:false});
await page.evaluate(()=>{historySignals=[];analystSourcesByName={};});await page.click('a[data-tf-url="dashboard.html"]');await page.click('#tf-report-nav');assert.match(await table.locator('tbody').innerText(),/Belum ada data/);
const users=await browser.newPage();await users.setContent('<body data-page="isignal-users">'+initial+'</body>');await users.addScriptTag({path:path.join(root,'assets/tf-analyst-report.js')});
assert.equal(await users.locator('#tf-report-nav').getAttribute('href'),'dashboard.html#analis-report');
assert.match(fs.readFileSync(path.join(root,'iSignalUsers.html'),'utf8'),/tf-device-lock.js/);assert.match(source,/const __tfLicenseAllowed = await window.tfRequireLicense/);
console.log('PASS report: nav order, shared risk metrics/colors, safe links, no-data, responsive scroll, browser back/forward, no activation on report/home; iSignal activation retained');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});






