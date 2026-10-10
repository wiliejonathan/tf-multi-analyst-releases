const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV493_MULTI_LINK',TFCore=require(path.resolve(root,'multi-scanner/core.js'));
const store={},writes=[];let locked=false;
const chrome={storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,structuredClone(store[k])])),set:async data=>{writes.push({keys:Object.keys(data),size:JSON.stringify(data).length});Object.assign(store,structuredClone(data));},remove:async key=>{delete store[key];}}},tabs:{remove:async()=>{}}};
const ctx=vm.createContext({chrome,TFCore,navigator:{locks:{request:async(n,o,fn)=>{if(locked)return fn(null);locked=true;try{return await fn({});}finally{locked=false;}}}},crypto:require('crypto').webcrypto,structuredClone,AbortController,Date,setInterval,clearInterval,setTimeout:f=>setImmediate(f),clearTimeout,console});
vm.runInContext(fs.readFileSync(root+'/multi-scanner/engine.js','utf8'),ctx);
(async()=>{
 const engine=new ctx.TFEngine(()=>{});let attempts=0;const cards=Array.from({length:10000},(_,i)=>({id:''+i,name:'Analyst '+i,url:'https://account.tradersfamily.id/channels/'+i+'/',level:'Master',losing:i<9997?0:1,denominator:12}));
 engine.navigate=async()=>{engine.check();engine.tabId=17;};let range;
 engine.dom=async(stage,arg)=>{
  engine.check();if(stage==='inventoryStart')return {rows:cards};if(stage==='inventoryMore')return {rows:cards,done:true};
  if(stage==='portfolio')return {months:12};if(stage==='summary'){if(attempts++<5)throw Error('Frame with ID 0 was removed');return {summary:'5x (-100)\nConsecutive Loss'};}
  if(stage==='statistics')return {rows:[],oldest:'2024-01'};if(stage==='historyStart'){range=arg;return {rows:[]};}
  if(stage==='historyMore')return {rows:Array.from({length:20000},(_,i)=>({signal_id:''+i,symbol:'XAUUSD',result:'-150.0 Pips',closed_at_wib:range.start.split('-').reverse().join('-')})),done:true,endEvidence:'fixture'};
  throw Error(stage);
 };
 await engine.start({...TFCore.defaults,statuses:[],profitFactorAllowed:[],recoveryAllowed:[],survivedOn:false});
 assert.equal(engine.job.status,'complete');assert.equal(engine.job.cursor,10000);assert.equal(engine.job.results.length,3);assert.equal(engine.job.skipped.length,9997);assert.equal(attempts,8);
 assert.equal(new Set(engine.job.results.map(x=>x.url)).size,3);
 assert(engine.job.evidence.every(e=>e.storageKey&&e.windows.every(w=>!w.rows)));
 assert(!JSON.stringify(store.tfMultiJobV419).includes('closed_at_wib'));
 const small=writes.filter(w=>w.keys.includes('tfMultiProgressV457'));assert(small.length>10000);assert(Math.max(...small.map(w=>w.size))<50000);
 const record=store[engine.job.evidence[0].storageKey];assert(record.windows.some(w=>w.rows.length===20000));
 console.log('PASS: 10,000 analysts; 120,000 history signals; 5 frame failures auto-recovered; no duplicate results; raw history excluded from job/progress checkpoints.');
 // Pause and Stop remain cancellable while automatic recovery waits.
 for(const status of ['paused','stopped']){
  delete store.tfMultiJobV419;const e=new ctx.TFEngine(()=>{});e.navigate=engine.navigate.bind(e);let enter;const entered=new Promise(r=>enter=r);
  e.dom=async stage=>{if(stage==='inventoryStart')return {rows:[cards[9999]]};if(stage==='inventoryMore')return {rows:[cards[9999]],done:true};if(stage==='portfolio')return {months:12};throw Error('Network disconnected');};
  e.recover=async()=>{enter();await e.guarded(new Promise(()=>{}));};const running=e.start({...TFCore.defaults,statuses:[],profitFactorAllowed:[],recoveryAllowed:[]});await entered;await e.interrupt(status);await running;assert.equal(e.job.status,status);assert.equal(e.job.cursor,0);
 }
 console.log('PASS: explicit Pause/Stop cancel automatic recovery immediately.');
})().catch(e=>{console.error(e);process.exitCode=1});

