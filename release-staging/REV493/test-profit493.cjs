const assert=require('assert/strict'),path=require('path');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV493_MULTI_LINK';const C=require(path.resolve(root,'multi-scanner/core.js'));
assert.deepEqual(C.profitPairs({labels:['BAD','USDJPY   ','ZERO','AUDJPY','CADJPY'],datasets:[{data:[900,5589.6,0,5509.3,3737.2],backgroundColor:['#ea524c','#4c79ff','#4c79ff','#4c79ff','#4c79ff']}]}),[{pair:'USDJPY',profitUsd:5589.6},{pair:'AUDJPY',profitUsd:5509.3},{pair:'CADJPY',profitUsd:3737.2},{pair:'ZERO',profitUsd:0},{pair:'BAD',profitUsd:-900}]);
assert.deepEqual(C.profitPairs({labels:['GBPJPY','EURUSD'],datasets:[{label:'Profit',data:[100,400]},{label:'Loss',data:[150,100]}]}),[{pair:'EURUSD',profitUsd:300},{pair:'GBPJPY',profitUsd:-50}]);
assert.deepEqual(C.profitPairs({labels:['EURJPY'],datasets:[{data:[-25]}]}),[{pair:'EURJPY',profitUsd:-25}]);
assert.deepEqual(C.profitPairs({labels:['EURJPY'],datasets:[{data:[null]}]}),[{pair:'EURJPY',profitUsd:null}]);
assert.deepEqual(C.profitPairs({labels:[],datasets:[]}),[]);
console.log('PASS chart DOM labels only, descending signed USD, red absolute losses, zero, negative raw values, separate Profit/Loss and unavailable values');
