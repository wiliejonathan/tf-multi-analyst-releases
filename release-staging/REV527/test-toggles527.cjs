const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV527_MULTI_LINK';
const source=fs.readFileSync(root+'/indicator-compiler/indicator-template.mq4','utf8');
function body(name){const start=source.indexOf('{',source.indexOf(name+'('));let depth=1,end=start+1;while(depth){if(source[end]==='{')depth++;if(source[end]==='}')depth--;end++;}return source.slice(start+1,end-1);}
const trades=[{id:'tp',pips:400,cancelled:false},{id:'sl',pips:-200,cancelled:false},{id:'cancel',pips:0,cancelled:true}];
const c={prefix:'instance_',tpTradesVisible:true,slTradesVisible:true,cancelledTradesVisible:true,CHARTEVENT_OBJECT_CLICK:1,CHARTEVENT_CHART_CHANGE:2};
vm.createContext(c);
vm.runInContext('function TradeCategoryVisible(tr){'+body('TradeCategoryVisible')+'}\nfunction OnChartEvent(id,lparam,dparam,sparam){'+body('OnChartEvent').replace(/\bbool changed/g,'let changed')+'}',c);
let redraws=0,visible=[];c.Redraw=force=>{assert.equal(force,true);redraws++;visible=trades.filter(r=>c.TradeCategoryVisible(r)).map(r=>r.id);};
const click=key=>c.OnChartEvent(1,0,0,'instance_FILTER_'+key);
for(let mask=0;mask<8;mask++){
 c.tpTradesVisible=!!(mask&1);c.slTradesVisible=!!(mask&2);c.cancelledTradesVisible=!!(mask&4);
 assert.deepEqual(trades.filter(r=>c.TradeCategoryVisible(r)).map(r=>r.id),trades.filter((r,i)=>mask&(1<<i)).map(r=>r.id));
}
c.tpTradesVisible=c.slTradesVisible=c.cancelledTradesVisible=true;
click('TP');assert.deepEqual(visible,['sl','cancel']);click('SL_TEXT');assert.deepEqual(visible,['cancel']);click('CANCELLED');assert.deepEqual(visible,[]);
click('TP_TEXT');click('SL');click('CANCELLED_TEXT');assert.deepEqual(visible,['tp','sl','cancel']);assert.equal(redraws,6);
c.OnChartEvent(1,0,0,'other_instance_FILTER_TP');assert.equal(redraws,6,'another indicator instance cannot toggle this one');
c.OnChartEvent(2,0,0,'');assert.equal(redraws,7);assert(c.tpTradesVisible&&c.slTradesVisible&&c.cancelledTradesVisible,'zoom/resize preserves chosen visibility');
const redraw=body('Redraw');assert(redraw.indexOf('total++')<redraw.indexOf('if(!TradeCategoryVisible(tr)) continue;'));assert(redraw.indexOf('if(!TradeCategoryVisible(tr)) continue;')<redraw.indexOf('DrawTrade(tr)'));
assert(redraw.indexOf('DeletePrefixed()')<redraw.indexOf('for(int i'),'disabled categories cannot leave stale rectangles, paths or labels');
for(const key of ['TP','SL','CANCELLED'])assert(source.includes('PanelCheckbox("FILTER_'+key+'"'));
for(const key of ['TP','SL','Cancelled'])assert(source.includes('input bool ShowTrade'+key+' = true;'));
Object.assign(c,{panelAnalysts:[],ArraySize:a=>a.length,ArrayResize:(a,n)=>a.length=n});
vm.runInContext('function RememberPanelAnalyst(analyst){'+body('RememberPanelAnalyst').replace(/\bint /g,'let ')+'}\nfunction PanelAnalystNames(){'+body('PanelAnalystNames').replace(/\bint /g,'let ').replace(/\bstring /g,'let ')+'}',c);
c.RememberPanelAnalyst('Udine_Trade');c.RememberPanelAnalyst('Udine_Trade');assert.equal(c.PanelAnalystNames(),'Udine_Trade');c.RememberPanelAnalyst('Analyst B');assert.equal(c.PanelAnalystNames(),'Udine_Trade, Analyst B');
assert(redraw.indexOf('RememberPanelAnalyst(tr.analyst)')<redraw.indexOf('if(!tr.cancelled)'),'a cancelled-only analyst still has a name');
assert(source.includes('PanelLine(-1, Upper(analystDisplay) + " | " + Upper(pairDisplay)'));
assert(body('PanelLine').includes('(row + 1) * (PanelFontSize + 10)'),'analyst heading at row -1 is above the TF ANALYST row 0');
console.log('PASS actual category predicate and click handler: all 8 combinations, independent checkboxes/labels, all-off/all-on, instance isolation, redraw persistence and statistics-before-visibility ordering');
