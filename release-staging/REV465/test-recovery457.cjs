const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV465_MULTI_LINK';
(async()=>{
 let state={tfMultiJobV419:{id:'fixture',status:'running'},tfMultiHeartbeatV419:0},locked=false,alarmHandler,startHandler,created=[],reloads=[],alarms=[];
 const chrome={storage:{local:{get:async()=>structuredClone(state)}},runtime:{getURL:p=>'chrome-extension://test/'+p,onMessage:{addListener:()=>{}},onStartup:{addListener:f=>startHandler=f}},alarms:{create:async(n,x)=>alarms.push(x),onAlarm:{addListener:f=>alarmHandler=f}},tabs:{query:async()=>created.length?[{id:1}]:[],create:async t=>{created.push(t);return {id:1};},reload:async id=>reloads.push(id)}};
 const ctx=vm.createContext({chrome,navigator:{locks:{request:async(n,o,fn)=>fn(locked?null:{})}},Date,console});vm.runInContext(fs.readFileSync(root+'/assets/tf-multi-background.js','utf8'),ctx);
 const tick=async()=>{alarmHandler({name:'tf-multi-recover-v457'});await new Promise(r=>setImmediate(r));};
 await tick();assert.equal(created.length,1);assert.equal(created[0].active,false);await tick();assert.equal(reloads.length,1);
 locked=true;await tick();assert.equal(reloads.length,1);locked=false;
 for(const status of ['paused','stopped','complete','error']){state.tfMultiJobV419.status=status;await tick();assert.equal(reloads.length,1);}
 state.tfMultiJobV419.status='running';state.tfMultiHeartbeatV419=Date.now();await tick();assert.equal(reloads.length,1);assert(alarms.every(a=>a.periodInMinutes===.5));
 console.log('PASS: lost runner reopens inactive/reloads dashboard; live lock/heartbeat and explicit Pause/Stop prevent recovery.');
 const records={a:{card:{name:'Test'},windows:[{rows:[{signal_id:'raw'}]}]},inventory:[{id:'1'}]};const ex=vm.createContext({chrome:{storage:{local:{get:async k=>({[k]:records[k]})}}},Error,JSON});vm.runInContext(fs.readFileSync(root+'/assets/tf-multi-evidence-export.js','utf8').replace('export async function','async function')+'\nglobalThis.exportParts=exportParts;',ex);
 const portable=JSON.parse((await ex.exportParts({id:'test',inventory:[],inventoryKey:'inventory',evidence:[{storageKey:'a'}]})).join(''));assert.equal(portable.evidence[0].windows[0].rows[0].signal_id,'raw');assert.equal(portable.inventory[0].id,'1');assert(!portable.inventoryKey);await assert.rejects(ex.exportParts({evidence:[{storageKey:'missing'}]}),/Bukti scan/);
 console.log('PASS: portable JSON reconstructs complete raw evidence and inventory; missing records fail visibly.');
})().catch(e=>{console.error(e);process.exitCode=1});
