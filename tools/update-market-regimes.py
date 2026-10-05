"""Daily BID candles from Dukascopy; unknown months remain unknown, never guessed."""
import calendar,datetime,json,lzma,struct,time,urllib.request,concurrent.futures
from pathlib import Path
PAIRS=['XAUUSD','AUDJPY','CHFJPY','CADJPY','GBPJPY','EURJPY','NZDJPY','USDJPY','GBPUSD','EURUSD','USDCHF','USDCAD','AUDUSD','NZDUSD','EURGBP','EURNZD']
TODAY=datetime.datetime.now(datetime.timezone.utc).date()
CACHE=Path('market-price-cache');CACHE.mkdir(exist_ok=True)
def fetch(task):
    pair,year=task;path=CACHE/f'{pair}-{year}.json';cached=json.loads(path.read_text()) if path.exists() else []
    if year<TODAY.year and cached:return pair,year,cached,None
    url=f'https://datafeed.dukascopy.com/datafeed/{pair}/{year}/BID_candles_day_1.bi5'
    error=None
    for attempt in range(3):
        try:
            request=urllib.request.Request(url,headers={'User-Agent':'TF-Market-Regime/1.0'})
            raw=urllib.request.urlopen(request,timeout=20).read();data=lzma.decompress(raw)
            if not data or len(data)%24:raise ValueError('invalid candle record length')
            start=datetime.datetime(year,1,1,tzinfo=datetime.timezone.utc);rows=[]
            for seconds,op,cl,lo,hi,volume in struct.iter_unpack('>5If',data):
                date=(start+datetime.timedelta(seconds=seconds)).date()
                if date.year!=year or min(op,cl,lo,hi)<=0 or lo>min(op,cl) or hi<max(op,cl):raise ValueError('invalid OHLC candle')
                if date<TODAY:rows.append({'date':date.isoformat(),'close':cl})
            if not rows:raise ValueError('no complete daily candle')
            path.write_text(json.dumps(rows,separators=(',',':')))
            return pair,year,rows,None
        except Exception as exc:
            error=str(exc)
            if attempt<2:time.sleep(2*(attempt+1))
    # Current-year D1 archive can be absent; complete daily closes can be aggregated from monthly H1 archives.
    daily={r['date']:r for r in cached}
    for month in range(1,13 if year<TODAY.year else TODAY.month+1):
        partial=CACHE/f'{pair}-{year}-{month:02}.json'
        previous=json.loads(partial.read_text()) if partial.exists() else []
        if previous and (year,month)<(TODAY.year,TODAY.month):
            daily.update({r['date']:r for r in previous});continue
        hourly_url=f'https://datafeed.dukascopy.com/datafeed/{pair}/{year}/{month-1:02}/BID_candles_hour_1.bi5'
        try:
            request=urllib.request.Request(hourly_url,headers={'User-Agent':'TF-Market-Regime/1.0'})
            raw=urllib.request.urlopen(request,timeout=12).read();data=lzma.decompress(raw)
            if not data or len(data)%24:raise ValueError('invalid hourly candles')
            start=datetime.datetime(year,month,1,tzinfo=datetime.timezone.utc);last={}
            for seconds,op,cl,lo,hi,volume in struct.iter_unpack('>5If',data):
                stamp=start+datetime.timedelta(seconds=seconds);date=stamp.date()
                if (date.year,date.month)!=(year,month) or min(op,cl,lo,hi)<=0 or lo>min(op,cl) or hi<max(op,cl):raise ValueError('invalid hourly OHLC')
                if date<TODAY:last[date.isoformat()]={'date':date.isoformat(),'close':cl}
            previous=list(last.values());partial.write_text(json.dumps(previous,separators=(',',':')))
        except Exception:pass
        daily.update({r['date']:r for r in previous})
    return pair,year,sorted(daily.values(),key=lambda r:r['date']),error
def classify(rows):
    months={}
    for r in rows:months.setdefault(r['date'][:7],[]).append(r)
    result={}
    for month,candles in months.items():
        candles=sorted(candles,key=lambda c:c['date']);values=[c['close'] for c in candles]
        if len(values)<8:continue
        # Kaufman-style directional efficiency, not an AI or a provider's official market label.
        travel=sum(abs(b-a) for a,b in zip(values,values[1:]));er=abs(values[-1]-values[0])/travel if travel else 0
        status='Trending/Rally' if er>=.55 else 'Semi-Trend' if er>=.25 else 'Ranging'
        year,number=map(int,month.split('-'));last=datetime.date(year,number,calendar.monthrange(year,number)[1])
        result[month]={'status':status,'efficiencyRatio':round(er,6),'dailyBars':len(values),'start':candles[0]['date'],'end':candles[-1]['date'],'provisional':last>=TODAY}
    return result
def main():
    tasks=[(pair,year) for pair in PAIRS for year in range(2024,TODAY.year+1)];allrows={pair:[] for pair in PAIRS};errors=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        for pair,year,rows,error in pool.map(fetch,tasks):
            allrows[pair].extend(rows)
            if error:errors.append({'pair':pair,'year':year,'error':error})
    data={'schema':1,'updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':'Dukascopy daily BID candles','sourceUrl':'https://www.dukascopy.com/swiss/english/marketwatch/historical/','method':{'name':'daily-close-directional-efficiency','formula':'abs(last close - first close) / sum(abs(daily close change))','rangingBelow':.25,'semiTrendBelow':.55,'trendingAtLeast':.55,'minimumDailyBars':8},'pairs':{pair:classify(rows) for pair,rows in allrows.items()},'errors':errors}
    total=sum(len(v) for v in data['pairs'].values())
    if total==0:raise RuntimeError('No price data available. Refusing to publish invented market colors.')
    Path('market-regimes.json').write_text(json.dumps(data,indent=2)+'\n')
    print('Verified month classifications:',total,'missing feed requests:',len(errors))
if __name__=='__main__':main()
