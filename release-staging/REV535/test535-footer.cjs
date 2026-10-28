const{chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV535_MULTI_LINK';
(async()=>{const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=new URL(r.request().url()),file=path.resolve(root,'.'+u.pathname);if(u.pathname.startsWith('/assets/')&&fs.existsSync(file))return r.fulfill({path:file});return r.fulfill({contentType:'text/html',body:'<main id="tf-dashboard-main"><nav><ul><li><a class="tf-nav-link">Profile</a></li></ul></nav><section>Home</section><footer><div class="tf-copyright-footer">Copyright · Instagram</div></footer></main>'});});
 await p.goto('https://footer.test');await p.evaluate(()=>window.chrome={storage:{local:{get:async()=>({tfHistorySignals:[]})}},runtime:{getURL:s=>'https://footer.test/'+s}});await p.addScriptTag({path:root+'/assets/tf-indicator-builder.js'});
 for(const label of ['Created MT4/MT5 Indicator','Created TradingView Indicator']){
  await p.getByText(label,{exact:true}).first().click();
  const box=await p.evaluate(()=>{const page=document.querySelector('#tf-dashboard-main'),footer=page.querySelector(':scope > footer'),builder=[...page.querySelectorAll('.tf-indicator-builder')].find(e=>!e.hidden);return {footerTop:footer.getBoundingClientRect().top,builderBottom:builder.getBoundingClientRect().bottom,after:!!(builder.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING),count:page.querySelectorAll('footer').length};});
  assert(box.after);assert(box.footerTop>=box.builderBottom-1);assert.equal(box.count,1);
 }
 assert.deepEqual(errors,[]);await b.close();console.log('PASS REV535: shared footer follows both builder pages and tutorials without duplication.');
})().catch(e=>{console.error(e);process.exit(1)});
