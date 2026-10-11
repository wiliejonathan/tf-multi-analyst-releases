const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV456_MULTI_LINK',source=fs.readFileSync(root+'/multi-scanner/engine.js','utf8');
(async()=>{
 let now=0,probes=0,creates=0;const url='https://account.tradersfamily.id/channels/290186/';
 const chrome={storage:{local:{set:async()=>{}}},tabs:{getCurrent:async()=>({windowId:8}),create:async()=>({id:++creates}),remove:async()=>{},get:async()=>{now+=60000;return {status:'loading',url}}},scripting:{executeScript:async()=>[{result:++probes>180}]}};
 const ctx=vm.createContext({chrome,AbortController,Date:{now:()=>now},setTimeout:f=>{f()},clearTimeout});vm.runInContext(source,ctx);const e=new ctx.TFEngine(()=>{});e.abort=new AbortController();e.log=async()=>{};await e.navigate(url);assert.equal(creates,1);assert(now>3*60*60*1000);
 let reads=0;chrome.scripting.executeScript=async p=>p.files?[]:[{result:++reads<=12?{ok:false,error:'Panel belum tersedia'}:{ok:true,data:{summary:'5x (-100) Consecutive Loss'}}}];await e.dom('summary',{pair:'XAUUSD'});assert.equal(reads,13);
 chrome.scripting.executeScript=async()=>{e.interrupted='stopped';e.abort.abort();return []};await assert.rejects(e.navigate(url),/Dihentikan/);
 const collector=fs.readFileSync(root+'/multi-scanner/collector.js','utf8');assert(!collector.includes('timeout=45000'));assert(!source.includes('Date.now()+60000'));
 console.log('PASS: loading beyond 3 simulated hours has no deadline or tab replacement; 12 transient DOM failures recover; Stop cancels unlimited waiting.');
})().catch(e=>{console.error(e);process.exitCode=1});
