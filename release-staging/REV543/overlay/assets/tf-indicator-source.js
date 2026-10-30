(() => {
'use strict';
const checkedText=v=>{const s=String(v??'');if(/[;"\\\r\n\x00-\x1f]/.test(s))throw new Error('Nama/teks sinyal mengandung karakter yang tidak didukung compiler.');return s;};
const num=v=>{const n=Number(v);if(!Number.isFinite(n))throw new Error('Nilai angka sinyal tidak valid.');return String(n);};
const utc=s=>{if(!s)return 0;const m=s.match(/^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/);if(!m)throw new Error('Tanggal tidak valid.');return Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5])-7*3600000;};
let template;
async function mql(rows,platform){
 template??=fetch(chrome.runtime.getURL('indicator-compiler/indicator-template.mq4')).then(r=>{if(!r.ok)throw new Error('Template lokal tidak dapat dibaca. Reload plugin.');return r.text();}).catch(e=>{template=null;throw e;});
 const raw=rows.map((r,i)=>[i+1,r.opened,r.closed,checkedText(r.analyst),checkedText(r.side),checkedText(r.symbol),num(r.entry),num(r.tp),num(r.sl),num(r.pips),0,r.created,r.status,num(r.lot),num(r.dollarPerPip),num(r.riskDollar),num(r.grossDollar),num(r.swapDollar),num(r.commDollar)].join(';')).map(s=>'"'+s+'"').join(',\n');
 return (await template).replace('@@RAW@@',raw);
}
function pine(rows,analyst,pair){
 if(rows.length>10000)throw new Error('Maksimal 10.000 sinyal per script. Pilih periode yang lebih pendek.');
 // Lossless numeric deltas, zero runs and a small shared pattern dictionary.
 const values=rows.map(r=>[utc(r.created),utc(r.opened),utc(r.closed),r.entry,r.tp,r.sl,r.pips,r.status==='Cancelled'?(/^buy/i.test(r.side)||!/^sell/i.test(r.side)&&Number(r.tp)>Number(r.entry)?1:-1):0,r.lot,r.dollarPerPip,r.riskDollar,r.grossDollar,r.swapDollar,r.commDollar].map(v=>Number(num(v))));
 const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';
 const scales=Array.from({length:14},(_,k)=>k<3?1:[1,10,100,1000,1e4,1e5,1e6,1e7,1e8].find(scale=>values.every(r=>Math.abs(r[k]*scale)<2**47&&Math.round(r[k]*scale)/scale===r[k]))||0);
 const dictionary=[],ids=new Map();
 const unsigned=n=>{let out='';do{const d=n%32;n=Math.floor(n/32);out+=alphabet[d+(n?32:0)];}while(n);return out;};
 const signed=n=>unsigned(n<0?-n*2-1:n*2);
 let chunks=[];
 for(let i=0;i<values.length;i+=60){const previous=Array(14).fill(0);let data='';
  for(const row of values.slice(i,i+60))for(let k=0;k<14;k++){const n=row[k];let value;
   if(k<3)value=n/60000;else if(scales[k])value=Math.round(n*scales[k]);else{if(!ids.has(n)){ids.set(n,dictionary.length);dictionary.push(n);}value=ids.get(n);}
   data+=signed(value-previous[k]);previous[k]=value;
  }
  chunks.push(data.replace(/0{3,}/g,run=>'.'+unsigned(run.length)));
 }
 const markers='!#$%&()*+/:;<=>?@[]^{}~',patterns=[];
 for(const marker of markers){const counts=new Map();for(const c of chunks)for(let len=4;len<=10;len++)for(let i=0;i+len<=c.length;i++){const key=c.slice(i,i+len);if(/^[0-9A-Za-z_.-]+$/.test(key))counts.set(key,(counts.get(key)||0)+1);}
  let best='',score=0;for(const [key,n]of counts){const benefit=(key.length-1)*n-key.length-8;if(benefit>score){score=benefit;best=key;}}
  if(score<40)break;patterns.push(best);chunks=chunks.map(c=>c.split(best).join(marker));
 }
 const chunkFunctions=chunks.map((c,i)=>`f_chunk_${i}() =>\n    ${JSON.stringify(c)}`).join('\n');
 // A balanced tree keeps every dispatcher to a single bounded expression.
 const dispatchFunctions=[];let dispatchId=0;
 function dispatch(lo,hi){
  if(lo>=hi)return '""';
  if(hi-lo===1)return `f_chunk_${lo}()`;
  const mid=Math.floor((lo+hi)/2),left=dispatch(lo,mid),right=dispatch(mid,hi),name='f_pick_'+dispatchId++;
  dispatchFunctions.push(`${name}(int index) =>\n    index < ${mid} ? ${left} : ${right}`);
  return name+'(index)';
 }
 const dispatchRoot=dispatch(0,chunks.length),chunkDispatch=dispatchFunctions.join('\n');
 const title=JSON.stringify(String(analyst).slice(0,80)+' | '+pair+' | RR History');
 const source = `//@version=6
// TF Analyzer Analyst — imported history snapshot, not live signals or a strategy.
// Source timestamps: WIB (UTC+7), exported as absolute UNIX milliseconds.
// Costs: dashboard snapshot per trade, not live broker overnight charges.
indicator(${title}, overlay = true, max_boxes_count = 500, max_lines_count = 500, max_labels_count = 500)
showTP = input.bool(true, "Trade TP", group = "Tampilan")
showSL = input.bool(true, "Trade SL", group = "Tampilan")
showCancelled = input.bool(true, "Trade Cancelled", group = "Tampilan")
useSwap = input.bool(true, "Swap", group = "Biaya")
useComm = input.bool(true, "Comm", group = "Biaya")
hidePanel = input.bool(false, "Hide Panel", group = "Panel", tooltip = "Centang untuk menyembunyikan panel informasi saja. Kotak dan garis trade tetap tampil. Untuk menampilkan kembali, hapus centang.", display = display.none)
panelMode = input.string("Ringkas (ponsel)", "Mode panel", options = ["Ringkas (ponsel)", "Lengkap"], group = "Panel", display = display.none)
panelSize = input.string("Sangat kecil", "Ukuran teks", options = ["Sangat kecil", "Kecil", "Normal"], group = "Panel", display = display.none)
panelTextSize = panelSize == "Normal" ? size.normal : panelSize == "Kecil" ? size.small : size.tiny
maxTrades = input.int(${rows.length}, "Maksimal trade terlihat (default semua history)", minval = 1, maxval = 10000, group = "Tampilan")
checkSymbol = input.bool(true, "Cek nama pair chart", group = "Tampilan")
// Change ticker mapping explicitly if the TradingView provider uses a different symbol.
pairName = input.string(${JSON.stringify(pair)}, "Pair history", group = "Tampilan")
type Trade
    int created
    int opened
    int closed
    float entry
    float tp
    float sl
    float pips
    bool cancelled
    bool buy
    float lot
    float dpp
    float riskDollar
    float gross
    float swap
    float comm
var array<Trade> trades = array.new<Trade>()
var array<float> stats = array.new_float(13, 0.0)
// Keep packed data literals out of the implicit main function (Pine E10295).
var array<float> decodeScales = array.from(${scales.map(v=>num(v)+'.0').join(', ')})
var array<float> decodeDictionary = array.new_float()
var array<string> decodePatterns = array.from(${patterns.length?patterns.map(v=>JSON.stringify(v)).join(', '):'""'})
if barstate.isfirst
    for value in str.split(${JSON.stringify(dictionary.length?dictionary.map(num).join(','):'0')}, ",")
        array.push(decodeDictionary, str.tonumber(value))
f_expand(string chunk) =>
    string expanded = chunk
    for i = 0 to ${Math.max(0,patterns.length-1)}
        expanded := str.replace_all(expanded, str.substring(${JSON.stringify(markers)}, i, i + 1), array.get(decodePatterns, i))
    expanded
f_unsigned(string data, int start) =>
    int cursor = start
    float value = 0
    float factor = 1
    bool more = true
    while more and cursor < str.length(data)
        int digit = str.pos("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-", str.substring(data, cursor, cursor + 1))
        value += (digit % 32) * factor
        factor *= 32
        more := digit >= 32
        cursor += 1
    [value, cursor]
f_delta(string data, int start, int zeros) =>
    float delta = 0
    int cursor = start
    int remaining = zeros
    if remaining > 0
        remaining -= 1
    else if str.substring(data, cursor, cursor + 1) == "."
        [count, finish] = f_unsigned(data, cursor + 1)
        cursor := finish
        remaining := int(count) - 1
    else
        [encoded, finish] = f_unsigned(data, cursor)
        cursor := finish
        delta := encoded % 2 == 0 ? encoded / 2 : -(encoded + 1) / 2
    [delta, cursor, remaining]
${chunkFunctions}
${chunkDispatch}
f_chunk(int index) =>
    ${dispatchRoot}
int chunkCount = ${chunks.length}
var int loaded = 0
var int firstTime = time
f_add(int i, float value) =>
    array.set(stats, i, array.get(stats, i) + value)
f_ingest(string chunk) =>
    string data = f_expand(chunk)
    int cursor = 0
    int zeros = 0
    array<float> previous = array.new_float(14, 0.0)
    while cursor < str.length(data) or zeros > 0
        array<float> fields = array.new_float(14, 0.0)
        for k = 0 to 13
            [delta, finish, remaining] = f_delta(data, cursor, zeros)
            cursor := finish
            zeros := remaining
            float raw = array.get(previous, k) + delta
            array.set(previous, k, raw)
            float scale = array.get(decodeScales, k)
            float value = k < 3 ? raw * 60000 : scale > 0 ? raw / scale : array.get(decodeDictionary, int(raw))
            array.set(fields, k, value)
        t = Trade.new(int(array.get(fields, 0)), int(array.get(fields, 1)), int(array.get(fields, 2)), array.get(fields, 3), array.get(fields, 4), array.get(fields, 5), array.get(fields, 6), array.get(fields, 7) != 0, array.get(fields, 7) > 0, array.get(fields, 8), array.get(fields, 9), array.get(fields, 10), array.get(fields, 11), array.get(fields, 12), array.get(fields, 13))
        array.push(trades, t)
        if t.cancelled
            f_add(2, 1)
        else
            f_add(t.pips > 0 ? 0 : t.pips < 0 ? 1 : 12, 1)
            f_add(3, t.pips)
            f_add(4, t.gross)
            f_add(5, t.swap)
            f_add(6, t.comm)
            if t.riskDollar > 0
                f_add(7, t.gross / t.riskDollar)
                f_add(8, t.swap / t.riskDollar)
                f_add(9, t.comm / t.riskDollar)
            if t.lot * t.dpp > 0
                f_add(10, t.swap / (t.lot * t.dpp))
                f_add(11, t.comm / (t.lot * t.dpp))
// Parse one bounded chunk per historical bar to avoid one giant initialization loop.
if loaded < chunkCount
    f_ingest(f_chunk(loaded))
    loaded += 1
var array<box> boxes = array.new<box>()
var array<line> paths = array.new<line>()
var array<label> labels = array.new<label>()
var map<int, label> closeLabels = map.new<int, label>()
var map<int, string> closeTips = map.new<int, string>()
var table panel = hidePanel ? na : table.new(position.top_right, 1, 9, bgcolor = color.rgb(15, 23, 42), border_width = 1)
f_box(int start, int finish, float p1, float p2, color tone) =>
    array.push(boxes, box.new(left = start, top = math.max(p1, p2), right = finish, bottom = math.min(p1, p2), xloc = xloc.bar_time, border_color = color.new(tone, 100), bgcolor = tone))
f_panel(int drawn, int visibleCount, bool symbolOK, int total) =>
    if not hidePanel
        table.clear(panel, 0, 0, 0, 8)
        float fees = (useSwap ? array.get(stats, 5) : 0) + (useComm ? array.get(stats, 6) : 0)
        float netR = array.get(stats, 7) - (useSwap ? array.get(stats, 8) : 0) - (useComm ? array.get(stats, 9) : 0)
        float netPips = array.get(stats, 3) - (useSwap ? array.get(stats, 10) : 0) - (useComm ? array.get(stats, 11) : 0)
        bool compact = panelMode == "Ringkas (ponsel)"
        string fullName = ${JSON.stringify(analyst+' | '+pair)}
        string heading = compact ? ${JSON.stringify(String(analyst).slice(0,16)+(String(analyst).length>16?'…':'')+' | '+String(pair).slice(0,12))} : fullName
        string help = "Settings > Inputs > Panel > Hide Panel. Hapus centang untuk menampilkan kembali."
        string notice = not symbolOK ? "Pair chart tidak sesuai" : loaded < chunkCount ? "Perluas history chart" : drawn < visibleCount ? "Zoom untuk detail trade" : ""
        table.cell(panel, 0, 0, heading, text_color = color.white, text_size = panelTextSize, tooltip = fullName + "\\n" + help)
        if compact
            table.cell(panel, 0, 1, "TP " + str.tostring(array.get(stats, 0), "#") + " | SL " + str.tostring(array.get(stats, 1), "#") + " | Can " + str.tostring(array.get(stats, 2), "#"), text_color = color.white, text_size = panelTextSize, tooltip = "Can = Cancelled")
            table.cell(panel, 0, 2, "Net " + str.tostring(netPips, "#.##") + " pips", text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 3, "$" + str.tostring(array.get(stats, 4) - fees, "#.##") + " | R " + str.tostring(netR, "#.##"), text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 4, str.tostring(drawn) + "/" + str.tostring(total) + " | Sw " + (useSwap ? "ON" : "OFF") + " Co " + (useComm ? "ON" : "OFF"), text_color = color.white, text_size = panelTextSize, tooltip = "Sw = Swap, Co = Comm; trade terlihat / seluruh history")
            if notice != ""
                table.cell(panel, 0, 5, notice, text_color = color.yellow, text_size = panelTextSize)
        else
            table.cell(panel, 0, 1, "TF ANALYST | RR HISTORY", text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 2, "TP " + str.tostring(array.get(stats, 0), "#") + " | SL " + str.tostring(array.get(stats, 1), "#") + " | Cancelled " + str.tostring(array.get(stats, 2), "#"), text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 3, "Gross pips " + str.tostring(array.get(stats, 3), "#.##") + "\\nNet pips " + str.tostring(netPips, "#.##"), text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 4, "Net $" + str.tostring(array.get(stats, 4) - fees, "#.##") + " | R net " + str.tostring(netR, "#.##"), text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 5, "TP " + (showTP ? "ON" : "OFF") + " | SL " + (showSL ? "ON" : "OFF") + " | Cancelled " + (showCancelled ? "ON" : "OFF"), text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 6, "Swap " + (useSwap ? "ON" : "OFF") + " | Comm " + (useComm ? "ON" : "OFF"), text_color = color.white, text_size = panelTextSize, tooltip = help)
            table.cell(panel, 0, 7, str.tostring(total) + " history | " + str.tostring(drawn) + "/" + str.tostring(visibleCount) + " terlihat", text_color = color.white, text_size = panelTextSize)
            table.cell(panel, 0, 8, notice == "" ? "Soft: Created > Opened\\nMain: Opened > Closed | UTC" : notice, text_color = color.yellow, text_size = panelTextSize)

f_render() =>
    for item in boxes
        box.delete(item)
    array.clear(boxes)
    for item in paths
        line.delete(item)
    array.clear(paths)
    for item in labels
        label.delete(item)
    array.clear(labels)
    map.clear(closeLabels)
    map.clear(closeTips)
    int drawn = 0
    int visibleCount = 0
    bool symbolOK = not checkSymbol or str.contains(str.upper(syminfo.ticker), str.upper(pairName))
    int total = array.size(trades)
    if symbolOK and total > 0
        for i = total - 1 to 0
            t = array.get(trades, i)
            bool selected = t.cancelled ? showCancelled : t.pips > 0 ? showTP : showSL
            bool visible = t.closed >= chart.left_visible_bar_time and t.created <= chart.right_visible_bar_time and t.closed <= time_close and t.closed >= firstTime
            int neededBoxes = not t.cancelled and t.created < t.opened ? 4 : 2
            if selected and visible
                visibleCount += 1
            if selected and visible and drawn < maxTrades and array.size(boxes) + neededBoxes <= 500 and array.size(paths) + 2 <= 500
                color riskTone = t.cancelled ? color.new(color.gray, 65) : color.new(color.red, 65)
                color rewardTone = t.cancelled ? color.new(color.gray, 65) : color.new(color.green, 65)
                int activeStart = t.cancelled ? t.created : t.opened
                if not t.cancelled and t.created < t.opened
                    f_box(t.created, t.opened, t.entry, t.sl, color.new(color.red, 88))
                    f_box(t.created, t.opened, t.entry, t.tp, color.new(color.green, 88))
                f_box(activeStart, t.closed, t.entry, t.sl, riskTone)
                f_box(activeStart, t.closed, t.entry, t.tp, rewardTone)
                if not t.cancelled
                    float exitPrice = t.pips > 0 ? t.tp : t.sl
                    array.push(paths, line.new(x1 = t.opened, y1 = t.entry, x2 = t.closed, y2 = exitPrice, xloc = xloc.bar_time, color = color.gray, style = line.style_dashed))
                    array.push(paths, line.new(x1 = t.opened, y1 = math.min(t.tp, t.sl), x2 = t.opened, y2 = math.max(t.tp, t.sl), xloc = xloc.bar_time, color = color.gray, style = line.style_dotted))
                string outcome = t.cancelled ? "Cancelled" : t.pips > 0 ? "TP" : t.pips < 0 ? "SL" : "Flat"
                int bucket = int(math.floor(t.closed / (timeframe.in_seconds() * 1000))) * 4 + (t.cancelled ? (t.buy ? 1 : 2) : 0)
                string detail = "Created: " + str.format_time(t.created, "dd-MM-yyyy HH:mm", "Asia/Jakarta") + " WIB\\nOpened: " + (t.opened > 0 ? str.format_time(t.opened, "dd-MM-yyyy HH:mm", "Asia/Jakarta") : "Not opened") + "\\nClosed: " + str.format_time(t.closed, "dd-MM-yyyy HH:mm", "Asia/Jakarta") + " WIB"
                if map.contains(closeLabels, bucket)
                    label existing = map.get(closeLabels, bucket)
                    string caption = label.get_text(existing)
                    label.set_text(existing, str.length(caption) < 40 ? caption + " / " + outcome : caption)
                    string tip = map.get(closeTips, bucket)
                    string updatedTip = str.length(tip) < 3000 ? tip + "\\n---\\n" + outcome + "\\n" + detail : tip
                    label.set_tooltip(existing, updatedTip)
                    map.put(closeTips, bucket, updatedTip)
                else
                    label marker = label.new(x = t.closed, y = t.entry, text = outcome, xloc = xloc.bar_time, style = label.style_label_left, color = color.new(color.black, 75), textcolor = t.cancelled ? (t.buy ? color.lime : color.red) : t.pips > 0 ? color.lime : color.red, size = size.tiny, tooltip = detail)
                    array.push(labels, marker)
                    map.put(closeLabels, bucket, marker)
                    map.put(closeTips, bucket, detail)
                drawn += 1
    f_panel(drawn, visibleCount, symbolOK, total)

if barstate.islast
    f_render()
`;
 if(new TextEncoder().encode(source).length>85000)throw new Error('History terlalu besar untuk batas kode Pine TradingView. Pilih Time Range yang lebih pendek; data tidak dipotong otomatis.');
 return source;
}
window.TFIndicatorSources=Object.freeze({mql,pine,utc});
})();
