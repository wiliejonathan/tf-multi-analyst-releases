const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV490_MULTI_LINK';
async function run({active=false,discovery=false,missing=false,job=null,reuse=false}={}){
 let listener,state={tfScanInProgress:true,tfMultiJobV419:job},opened=0,updated=0;
 const chrome={storage:{local:{get:async()=>structuredClone(state),set:async x=>Object.assign(state,x)}},runtime:{getURL:p=>'test/'+p,onMessage:{addListener:f=>listener=f},onStartup:{addListener:()=>{}}},windows:{getLastFocused:async()=>({id:1}),get:async()=>({id:1})},tabs:{query:async()=>reuse?[{id:9}]:[],create:async()=>{opened++;return{id:9}},update:async()=>updated++},alarms:{create:async()=>{},onAlarm:{addListener:()=>{}}}};
 const ctx={chrome,navigator:{locks:{request:async()=>{}}},console,tfIsignalDiscovery450:{active:discovery}};
 if(!missing)ctx.tf_batchScanState={active};
 vm.runInNewContext(fs.readFileSync(root+'/assets/tf-multi-background.js','utf8'),ctx);
 const reply=await new Promise(resolve=>listener({type:'TF_MULTI_START'},{},resolve));return{reply,state,opened,updated};
}
(async()=>{
 const stale=await run();assert.equal(stale.reply.ok,true);assert.equal(stale.state.tfMultiPendingStartV419,true);assert.equal(stale.opened,1);
 const reuse=await run({reuse:true});assert.equal(reuse.updated,1);assert.equal(reuse.opened,0);
 for(const options of [{active:true},{discovery:true},{missing:true},{job:{status:'running'}},{job:{status:'paused'}},{job:{status:'error'}}]){const x=await run(options);assert.equal(x.reply.ok,false);assert.equal(x.opened,0);assert.equal(x.state.tfMultiPendingStartV419,undefined);}
 console.log('PASS Submit: stale saved flag permits start; real active main/discovery and unfinished Multi-Link block; dashboard reused.');
})().catch(e=>{console.error(e);process.exitCode=1});
