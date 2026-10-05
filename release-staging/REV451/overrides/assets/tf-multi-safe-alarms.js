(() => {
 'use strict';
 const failures=[];
 async function run(method,args){
  for(let attempt=0;attempt<3;attempt++){
   try {await chrome.alarms[method](...args);return true;}
   catch(error){
    const message=String(error?.message||error);
    const transient=/^No SW$/i.test(message);
    if(transient&&attempt<2){await new Promise(resolve=>setTimeout(resolve,150*(attempt+1)));continue;}
    failures.push({method,name:args[0],message,at:Date.now()});
    if(failures.length>20)failures.shift();
    if(!transient)console.warn('TF alarm operation failed:',method,args[0],message);
    return false;
   }
  }
  return false;
 }
 globalThis.TFSafeAlarm={create:(name,info)=>run('create',[name,info]),clear:name=>run('clear',[name]),failures};
})();
