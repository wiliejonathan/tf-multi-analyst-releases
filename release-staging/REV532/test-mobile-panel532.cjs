const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV532_MULTI_LINK';
const source=fs.readFileSync(root+'/assets/tf-indicator-source.js','utf8'),old=fs.readFileSync(require('path').join(__dirname,'pine-baseline531.js'),'utf8');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(source,ctx);
const rows=[{created:'2026.10.28 08:00',opened:'2026.10.28 08:05',closed:'2026.10.28 09:00',entry:4000,tp:4040,sl:3980,pips:400,status:'Closed',lot:.05,dollarPerPip:10,riskDollar:100,grossDollar:200,swapDollar:.45,commDollar:1}];
const code=ctx.window.TFIndicatorSources.pine(rows,'An analyst name much longer than a mobile panel','XAUUSD');
assert(code.includes('hidePanel = input.bool(false, "Hide Panel"'));
assert(code.includes('panelMode = input.string("Ringkas (ponsel)"'));
assert(code.includes('panelSize = input.string("Sangat kecil"'));
assert(code.includes('var table panel = hidePanel ? na : table.new(position.top_right'));
assert(code.includes('if not hidePanel\n        table.clear(panel'));
const calls=code.split('\n').filter(x=>x.includes('table.cell('));assert.equal(calls.length,14);assert(calls.every(x=>x.includes('text_size = panelTextSize')));
const compact=code.slice(code.indexOf('        if compact'),code.indexOf('        else\n',code.indexOf('        if compact')));assert.equal(compact.split('\n').filter(x=>x.includes('table.cell(')).length,5);assert(!compact.includes('Settings / Inputs'));assert(!compact.includes('Gross pips'));assert(code.includes('An analyst name … | XAUUSD'));assert(code.includes('string fullName = "An analyst name much longer than a mobile panel | XAUUSD"'));
// The actual ingestion, financial snapshot and drawing code must remain byte-identical.
const ingest=s=>s.slice(s.indexOf('type Trade'),s.indexOf('var table panel'));
assert.equal(ingest(source),ingest(old));const drawing=(s,end)=>s.slice(s.indexOf('f_box(int start'),s.indexOf(end));assert.equal(drawing(source,'    if not hidePanel'),drawing(old,'    table.clear(panel'));
fs.mkdirSync('work/report532',{recursive:true});fs.writeFileSync('work/report532/Synthetic-Mobile-Panel.pine',code);console.log('PASS compact default, tiny text on every cell, complete hide guard, full-name tooltip, full mode retained and byte-identical trade/fee/geometry code');
