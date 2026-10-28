const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV528_MULTI_LINK';
(async()=>{const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());const f=path.join(root,u.pathname.slice(1));if(u.hostname==='runtime.test'&&u.pathname.startsWith('/assets/')&&fs.existsSync(f))return r.fulfill({path:f,contentType:f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'text/css'});return r.fulfill({body:'<!doctype html><html><body></body></html>',contentType:'text/html'});});
await p.goto('https://runtime.test/dashboard.html');await p.addStyleTag({path:root+'/assets/7e95b596e5bf8dff.css'});await p.addScriptTag({path:root+'/assets/4b4d6b8dc315a95c.js'});
await p.evaluate(()=>{setupBalanceAndRiskControls();window.chrome={storage:{local:{get:(keys,cb)=>{const value={tfHistorySignals:[]};if(cb)queueMicrotask(()=>cb(value));return Promise.resolve(value);}},onChanged:{addListener(){}}},runtime:{getURL:p=>'https://runtime.test/'+p}};});
await p.addScriptTag({path:root+'/assets/tf-analyst-risk-adjustment.js'});await p.addScriptTag({path:root+'/assets/tf-analyst-report.js'});await p.waitForSelector('#tf-report-nav');await p.addScriptTag({path:root+'/assets/tf-indicator-builder.js'});
const home=p.locator('a[data-tf-url="dashboard.html"]').first(),report=p.locator('#tf-report-nav'),builder=p.getByText('Created MT4/MT5 Indicator',{exact:true}).first();
async function dismiss(){if(await p.locator('#tf-report-explainer[open] button').count())await p.locator('#tf-report-explainer[open] button').click();}
async function expectView(mode){await p.waitForFunction(mode=>{const b=document.body;return b.classList.contains('tf-builder-open')===(mode==='builder')&&b.classList.contains('tf-report-view')===(mode==='report');},mode);assert.equal(await p.locator('#tf-indicator-builder').isVisible(),mode==='builder');assert.equal(await p.locator('#tf-analis-report').isVisible().catch(()=>false),mode==='report');}
// Confirm real report ID rather than replacing the report controller with a fake.
const panel=await p.locator('#tf-report-nav').evaluate(()=>document.querySelector('.tf-report-exports').parentElement.id);
async function check(mode){await p.waitForFunction(mode=>document.body.classList.contains('tf-builder-open')===(mode==='builder')&&document.body.classList.contains('tf-report-view')===(mode==='report'),mode);assert.equal(await p.locator('#tf-indicator-builder').isVisible(),mode==='builder');assert.equal(await p.locator('#'+panel).isVisible(),mode==='report');}
await builder.dispatchEvent('click');await check('builder');await home.dispatchEvent('click');await check('home');
await report.dispatchEvent('click');await dismiss();await check('report');await builder.dispatchEvent('click');await check('builder');await report.dispatchEvent('click');await check('report');
await p.goBack();await check('builder');await p.goForward();await check('report');await home.dispatchEvent('click');await check('home');
const tv=p.getByText('Created TradingView Indicator',{exact:true}).first();
await tv.dispatchEvent('click');assert.equal(await p.locator('#tf-tradingview-builder').isVisible(),true);
await report.dispatchEvent('click');await check('report');assert.equal(await p.locator('#tf-tradingview-builder').isVisible(),false);
await p.goBack();assert.equal(await p.locator('#tf-tradingview-builder').isVisible(),true);
await home.dispatchEvent('click');await check('home');assert.equal(await p.locator('#tf-tradingview-builder').isVisible(),false);
await p.evaluate(()=>{location.hash='#indicator-builder';});await check('builder');
await p.evaluate(()=>{location.hash='#analis-report';});await check('report');
console.log('PASS real controllers: both builders→home/report, report→builder, Back/Forward, hash routes and visibility');
assert.equal(errors.filter(e=>!e.includes('tf_')).length,0,errors.join('\n'));await b.close();})().catch(e=>{console.error(e);process.exit(1)});
