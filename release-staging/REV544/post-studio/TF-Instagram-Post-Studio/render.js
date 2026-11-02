(() => {
  const W=1080,H=1440,C={bg:'#0c0a13',card:'#191528',line:'#39314e',muted:'#c3b9d9',ink:'#f6f3ff',accent:'#b9a5fa',green:'#61e5b1',red:'#ff8f9f'};
  const image=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Gambar tidak dapat dibaca.'));im.src=src;});
  let assets,avatar;
  async function loadAssets(){if(!assets)assets=await Promise.all([image('assets/tf-analyzer.jpeg'),image('assets/skill-fusion-white.png')]);return assets;}
  function base(data,row,title,index,total){const {canvas,c}=ExportQuality.create(W,H);
    const bg=c.createLinearGradient(0,0,W,H);bg.addColorStop(0,C.bg);bg.addColorStop(.65,'#121020');bg.addColorStop(1,'#302341');c.fillStyle=bg;c.fillRect(0,0,W,H);
    const glow=c.createRadialGradient(1020,1300,0,1020,1300,650);glow.addColorStop(0,'#8460bb35');glow.addColorStop(1,'#8460bb00');c.fillStyle=glow;c.fillRect(0,0,W,H);
    c.strokeStyle='#bba0f426';c.lineWidth=1;c.strokeRect(28,28,W-56,H-56);
    const rr=(x,y,w,h,r=16,color=C.card)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();c.strokeStyle=C.line;c.lineWidth=1;c.stroke();};
    const txt=(s,x,y,size=24,color=C.ink,weight=400,max)=>{const content=String(s??'—');let actual=size;const setFont=()=>{c.font=`${actual<=22?Math.max(600,weight):weight} ${actual}px Arial, sans-serif`;};setFont();if(max)while(c.measureText(content).width>max&&actual>16){actual-=.5;setFont();}c.fillStyle=color;c.textAlign='left';c.fillText(content,x,y);};
    const wrap=(s,x,y,width,size=22,color=C.ink,maxLines=3)=>{c.font=`600 ${size}px Arial`;const words=String(s||'—').split(/\s+/);let line='',n=0;for(const w of words){if(c.measureText(line+w).width>width&&line){txt(line.trim(),x,y+n*size*1.2,size,color);line='';n++;if(n===maxLines)return y+n*size*1.2;}line+=w+' ';}if(line)txt(line.trim(),x,y+n*size*1.2,size,color);return y+(n+1)*size*1.2;};
    const valColor=(label,value)=>/loss|sl pips|drawdown/i.test(label)||/^\s*[-−]/.test(value)?C.red:/profit|tp pips|total pips|pnl/i.test(label)?C.green:C.ink;
    txt('TF ANALYZER ANALYST',148,88,22,C.ink,700);txt('ANALYST PORTFOLIO',148,119,16,C.muted,400);
    if(avatar){c.save();c.beginPath();c.arc(105,210,41,0,Math.PI*2);c.clip();c.drawImage(avatar,64,169,82,82);c.restore();}
    txt(data.name||row.name,avatar?166:64,211,58,C.ink,700,avatar?840:900);wrap(`${row.pair}  /  ALL TIME`,avatar?168:66,250,avatar?840:950,20,C.accent,2);
    txt(title,64,306,29,C.ink,600,950);
    c.strokeStyle=C.line;c.beginPath();c.moveTo(64,1247);c.lineTo(1016,1247);c.stroke();
    txt('@tf_analyzer_analyst',64,1290,22,C.accent,600);txt(`${String(index).padStart(2,'0')} / ${String(total).padStart(2,'0')}   GESER →`,805,1290,19,C.muted);
    txt(`Sumber: TradersFamily · ${new Date(data.capturedAt).toLocaleDateString('id-ID',{timeZone:'Asia/Jakarta'})}`,64,1226,20,C.muted);
    return {canvas,c,rr,txt,wrap,valColor};
  }
  function metric(p,m,x,y,w,h){p.rr(x,y,w,h);p.wrap(m.label,x+18,y+27,w-36,20,C.muted,2);p.txt(m.value||'—',x+18,y+h-24,28,p.valColor(m.label,m.value),700,w-36);}
  async function render(data,row){const logos=await loadAssets(),slides=[];avatar=null;if(data.avatar){try{const u=new URL(data.avatar);if(['account.tradersfamily.id','static2.tradersfamily.id','static.tradersfamily.id'].includes(u.hostname)){const response=await fetch(u.href,{signal:AbortSignal.timeout(8000)});if(response.ok){const blob=await response.blob();avatar=await createImageBitmap(blob);}}}catch{}}
    const history=data.score?.history||[];const groups=[];
    for(const y of data.years||[])for(let i=0;i<y.months.length;i+=12)groups.push({...y,months:y.months.slice(i,i+12),part:i/12+1});
    const historyPages=Math.max(1,Math.ceil(history.length/8)),total=2+groups.length+historyPages;
    async function finish(p,name){const {c}=p;c.save();c.beginPath();c.roundRect(64,61,64,64,15);c.clip();c.drawImage(logos[0],64,61,64,64);c.restore();c.save();c.globalAlpha=.65;c.globalCompositeOperation='screen';c.filter='brightness(60%) contrast(600%)';c.drawImage(logos[1],940,59,70,68);c.restore();const output=await ExportQuality.finish(p.canvas);slides.push({name:`${String(slides.length+1).padStart(2,'0')}-${name}.png`,...output});}
    let p=base(data,row,'GROWTH & SIGNAL FREQUENCY',1,total);
    const profileParts=String(data.profile||'').replace(data.name,'').replace(/\s+/g,' ').trim();
    p.wrap(profileParts,64,348,950,20,C.muted,2);
    (data.rate||[]).slice(0,4).forEach((m,i)=>metric(p,m,64+i*241,394,229,115));
    const glass=p.c.createLinearGradient(64,529,1016,955);glass.addColorStop(0,'rgba(113,78,153,0.28)');glass.addColorStop(.48,'rgba(73,48,105,0.16)');glass.addColorStop(1,'rgba(126,85,164,0.24)');
    p.rr(64,529,952,426,18,glass);
    p.c.save();p.c.beginPath();p.c.roundRect(65,530,950,424,17);p.c.clip();const sheen=p.c.createLinearGradient(0,530,0,700);sheen.addColorStop(0,'rgba(224,200,255,0.075)');sheen.addColorStop(1,'rgba(224,200,255,0)');p.c.fillStyle=sheen;p.c.fillRect(65,530,950,424);
    if(data.chart?.data){const im=await image(data.chart.data);const scale=Math.min(928/im.width,406/im.height);const w=im.width*scale,h=im.height*scale;p.c.drawImage(im,76+(928-w)/2,539+(406-h)/2,w,h);}else p.txt('Grafik tidak tersedia pada sumber',95,730,24,C.muted);p.c.restore();
    (data.frequency||[]).slice(0,4).forEach((m,i)=>metric(p,m,64+(i%2)*484,978+Math.floor(i/2)*104,468,92));
    await finish(p,'growth-signal');
    p=base(data,row,'SUMMARY & AKTIVITAS CHANNEL',2,total);
    (data.summary||[]).slice(0,8).forEach((m,i)=>metric(p,m,64+(i%2)*484,337+Math.floor(i/2)*108,468,96));
    const details=data.details||[];details.forEach((m,i)=>{if(i>=8)return;const x=64+(i%2)*484,y=790+Math.floor(i/2)*61;p.txt(m.label,x,y,20,C.muted,400,450);p.txt(m.value,x,y+27,22,p.valColor(m.label,m.value),600,450);});
    const ay=1045;p.txt(data.activityTitle||'Informasi Aktivitas Channel',64,ay,20,C.accent,600,950);
    (data.activity||[]).slice(0,2).forEach((m,i)=>metric(p,m,64+i*484,ay+20,468,95));
    if(data.checkpoint)p.txt(`Checkpoint ${data.checkpoint} · ${data.checkpointCaption||''} · Batas bawah ${data.lowerLimit||'—'}`,64,1190,17,C.muted,400,950);
    await finish(p,'summary-statistik');
    for(const y of groups){p=base(data,row,`PROFIT PER MONTH · ${y.year}`,slides.length+1,total);p.rr(64,339,952,94);p.txt(`TAHUN ${y.year}`,88,378,22,C.muted,700);p.txt(y.total||'—',88,413,29,/^-/.test(y.total)?C.red:C.green,700);
      y.months.forEach((m,i)=>{const x=64+(i%3)*322,ypos=457+Math.floor(i/3)*173;p.rr(x,ypos,306,155);p.txt(m.month,x+18,ypos+35,22,C.ink,600,270);p.txt(m.signals,x+18,ypos+65,21,C.muted);p.txt(m.pips,x+18,ypos+116,27,/^[-−]/.test(m.pips)?C.red:C.green,700,270);});
      await finish(p,'profit-'+y.year+(y.part>1?'-'+y.part:''));
    }
    for(let hp=0;hp<historyPages;hp++){
      p=base(data,row,hp===0?'SCORE & HISTORY SCORE':'HISTORY SCORE · LANJUTAN',slides.length+1,total);
      const score=data.score||{};
      if(hp===0){p.rr(64,339,952,142);p.txt(`OVERVIEW ${score.month||''}`,88,375,20,C.muted);p.txt(score.value||'Tidak tersedia',88,446,56,C.accent,700);p.txt(score.rating||'',460,408,28,C.ink,600);p.txt(score.trend||'',460,448,18,C.muted,400,520);
        (score.cards||[]).slice(0,8).forEach((m,i)=>{const x=64+(i%2)*484,y=501+Math.floor(i/2)*105;p.rr(x,y,468,93);p.txt(m.label,x+17,y+27,19,C.muted);p.txt(m.value||'—',x+17,y+64,25,C.ink,600,285);p.txt(`${m.score}/4 · ${m.rating}`,x+295,y+64,18,C.accent,500,155);});
      }
      const start=hp===0?963:350;p.txt('RIWAYAT SCORE',64,start,20,C.muted,700);
      history.slice(hp*8,hp*8+8).forEach((m,i)=>{const x=64+(i%2)*484,y=start+22+Math.floor(i/2)*51;p.rr(x,y,468,43,8);p.txt(m.month,x+14,y+28,18,C.muted,400,315);p.txt(m.value,x+354,y+28,21,C.accent,700,100);});
      if(!history.length)p.txt('Riwayat score belum tersedia pada sumber.',64,start+60,21,C.muted);
      await finish(p,hp?'history-score-'+(hp+1):'score-history');
    }
    return slides;
  }
  globalThis.PostRender={render};
})();
