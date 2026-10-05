const fs=require('fs'),vm=require('vm'),assert=require('assert');
let listener;const state={tfMultiJobV419:{id:'test',status:'complete',results:[{name:'test'}]},tfMainResults:[{name:'main'}],tfScanInProgress:true};
const context={chrome:{runtime:{onMessage:{addListener:f=>listener=f}},storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,state[k]])),set:async o=>Object.assign(state,o),remove:async keys=>(Array.isArray(keys)?keys:[keys]).forEach(k=>delete state[k])}}},navigator:{locks:{request:async(n,o,f)=>f({})}},Date,crypto:{randomUUID:()=> 'test'}};
const source=require('path').join(process.env.TF_REV419_ROOT||'work/multi-integration','assets/tf-multi-background.js');
vm.runInNewContext(fs.readFileSync(source,'utf8'),context);
const call=m=>new Promise(resolve=>listener(m,{},resolve));
(async()=>{let r=await call({type:'TF_MULTI_RESET'});assert(r.ok);assert(!state.tfMultiJobV419);assert(state['tfMultiArchiveV419-test']);assert.equal(state.tfMainResults[0].name,'main');assert.equal(state.tfScanInProgress,true);state.tfMultiJobV419={id:'running',status:'running'};r=await call({type:'TF_MULTI_RESET'});assert(!r.ok);assert.equal(state.tfMultiJobV419.id,'running');console.log('PASS Reset clears Multi-Link, retains recoverable archive and Main Dashboard; rejects active scan.');})().catch(e=>{console.error(e);process.exit(1)});
