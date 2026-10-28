function tf_markRiskEligibility535(src,byPair,byAnalyst){
 const analysts=new Map(),pairs=new Map();
 for(const row of src){
  if(!row||row.isWithdraw||row.isCancelled||row.cancelled||/cancelled|canceled/i.test(String(row.status||row.result||''))||row.pips==null||String(row.pips).trim()===''||!Number.isFinite(Number(row.pips)))continue;
  const analyst=tf_latestRiskNormAnalyst(row.analyst),pair=tf_latestRiskNormPair(row.pair),ts=tf_latestRiskRowTs(row);
  if(!analyst||!pair||ts==null)continue;
  const month=tf_latestRiskMonthKey(ts);if(!/^\d{4}-\d{2}$/.test(month))continue;
  if(!analysts.has(analyst))analysts.set(analyst,new Set());analysts.get(analyst).add(month);
  const key=analyst+'|'+pair;if(!pairs.has(key))pairs.set(key,new Set());pairs.get(key).add(month);
 }
 for(const [key,entry]of byAnalyst){entry.historyMonths=analysts.get(key)?.size||0;entry.eligible=entry.historyMonths>=3;}
 for(const [key,entry]of byPair){entry.historyMonths=pairs.get(key)?.size||0;entry.eligible=entry.historyMonths>=3;}
}
