const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {test} = require('node:test');
const source=fs.readFileSync('extension/assets/tf-device-lock.js','utf8');
function harness({states=[],initial={},startTime=1000000}={}) {
 let now=startTime, calls=0; const data={...initial}, errors=[], statuses=[];
 const context={console, AbortController, navigator:{}, document:{currentScript:null}, chrome:{runtime:{onMessage:{addListener(){}},getManifest:()=>({version:'1.16.86',version_name:'REV373'})}}, Date:class extends Date{static now(){return now}}, setTimeout:(fn,ms)=>{if(ms>=1000){now+=ms;queueMicrotask(fn)}return 1}, clearTimeout(){}, queueMicrotask};
 vm.createContext(context);
 const end=source.lastIndexOf('  ensureUi();\n  void runDeviceFlow(start);');
 vm.runInContext(source.slice(0,end)+`
 storageGet=async keys=>Object.fromEntries(keys.filter(k=>k in testData).map(k=>[k,testData[k]]));
 storageSet=async values=>Object.assign(testData,values);
 storageRemove=async keys=>keys.forEach(k=>delete testData[k]);
 setStatus=(...v)=>testStatuses.push(v); setContent=()=>{}; showError=r=>testErrors.push(r);
 apiWithCredentialVariants=async()=>nextState();
 globalThis.t={savePendingClient,waitForDeviceApproval,activateOrRenew,start,runDeviceFlow,
 override:code=>eval(code)};
})();`,Object.assign(context,{testData:data,testErrors:errors,testStatuses:statuses,nextState:()=>{const s=states[Math.min(calls++,states.length-1)];if(s instanceof Error)throw s;return s}}));
 return {t:context.t,context,data,errors,statuses,now:()=>now,calls:()=>calls};
}
const creds={email:'test@example.com',token:'TF-TEST'};
test('missing request metadata does not expire after 20 seconds',async()=>{const h=harness({states:[{ok:true,valid:true}]});await h.t.waitForDeviceApproval(creds,'REQ1',true);assert(h.now()>=1900000);assert.equal(h.errors[0].code,'DEVICE_APPROVAL_STATUS_UNAVAILABLE');assert(h.calls()>10)});
test('same pending request retains original deadline after reopening',async()=>{const h=harness({initial:{tfDevicePendingClientV1:{...creds,requestId:'REQ1',createdAt:200000}}});await h.t.savePendingClient(creds,'REQ1');assert.equal(h.data.tfDevicePendingClientV1.createdAt,200000)});
test('declined approval stops without another bind',async()=>{const h=harness({states:[{ok:true,valid:true,pendingRequestId:'REQ1',pendingStatus:'DECLINED'}]});await h.t.waitForDeviceApproval(creds,'REQ1',true);assert.equal(h.errors[0].code,'DEVICE_REQUEST_DECLINED');assert.equal(h.calls(),1)});
test('explicit server expiry is respected immediately',async()=>{const h=harness({states:[{ok:true,valid:true,pendingRequestId:'REQ1',pendingStatus:'EXPIRED'}]});await h.t.waitForDeviceApproval(creds,'REQ1',true);assert.equal(h.errors[0].code,'DEVICE_REQUEST_EXPIRED');assert.equal(h.calls(),1)});
test('blocked license never becomes approval wait or offline success',async()=>{const h=harness({states:[{ok:true,valid:false,code:'LICENSE_BLOCKED'}]});await h.t.waitForDeviceApproval(creds,'REQ1',true);assert.equal(h.errors[0].code,'LICENSE_BLOCKED')});
test('temporary server failure recovers to approval',async()=>{const h=harness({states:[{ok:false,code:'APPS_SCRIPT_TIMEOUT'},{ok:true,valid:true,pendingRequestId:'REQ1',pendingStatus:'APPROVED'}]});h.context.bound=0;h.t.override('activateOrRenew=async()=>{globalThis.bound++}');await h.t.waitForDeviceApproval(creds,'REQ1',true);assert.equal(h.context.bound,1);assert.equal(h.errors.length,0)});
test('successful bind actually reaches session validation when reload is false',async()=>{const h=harness();h.context.validated=0;h.t.override(`lookupLicenseSource=async()=>({valid:true});apiWithCredentialVariants=async path=>path==='/device-challenge'?{ok:true,valid:true,requestId:'C',challenge:'proof'}:{bound:true,sessionToken:'S'};requestVaultProof=async()=>({});saveSession=async()=>{};validateExistingSession=async()=>{if(busy)return;globalThis.validated++}`);await h.t.activateOrRenew(creds,false);assert.equal(h.context.validated,1)});
test('new build pending flow resumes without asking for credentials again',async()=>{const h=harness({initial:{tfLicenseCredentials:{...creds,submittedVersion:'1.16.86'},tfDevicePendingClientV1:{...creds,requestId:'REQ1',createdAt:900000}}});h.context.resumed=0;h.t.override(`ensureUi=()=>{};showActivationForm=()=>{throw Error('unexpected form')};waitForDeviceApproval=async()=>{globalThis.resumed++}`);await h.t.start();assert.equal(h.context.resumed,1)});
test('same-page double click shares one activation flow',async()=>{const h=harness();let release,calls=0;const work=()=>{calls++;return new Promise(r=>release=r)};const a=h.t.runDeviceFlow(work),b=h.t.runDeviceFlow(work);assert.equal(a,b);release();await a;assert.equal(calls,1)});
test('two extension pages serialize through the shared Web Lock',async()=>{const a=harness(),b=harness();let tail=Promise.resolve(),active=0,peak=0;const locks={request:(_name,fn)=>{const p=tail.then(fn);tail=p.catch(()=>{});return p}};a.context.navigator.locks=locks;b.context.navigator.locks=locks;const work=async()=>{active++;peak=Math.max(peak,active);await new Promise(r=>setImmediate(r));active--};await Promise.all([a.t.runDeviceFlow(work),b.t.runDeviceFlow(work)]);assert.equal(peak,1)});
