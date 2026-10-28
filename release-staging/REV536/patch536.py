from pathlib import Path
import sys,json,hashlib,re
root=Path(sys.argv[1])
for name in ['894f18e8a37bd7c6.js','4b4d6b8dc315a95c.js']:
 p=root/'assets'/name;s=p.read_text('utf8');old="scope.querySelectorAll('#drawdown-table tbody tr')";assert s.count(old)==1;s=s.replace(old,"scope.querySelectorAll('#drawdown-table > tbody > tr:not(.dd-child-row)')");p.write_text(s,encoding='utf8',newline='\n')
p=root/'manifest.json';d=json.loads(p.read_text('utf8'));assert d['version']=='1.18.48';d.update(version='1.18.49',version_name='1.18.49',description='REV536: active-only scan progress, exclusive months, complete iSignal pair review, footer placement and history eligibility.');p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf8',newline='\n')
notes='''REV536 / v1.18.49

Includes all REV535 fixes:
- Progress bar and timer appear only during an active unfinished batch scan.
- Survived Month and Not Survived Month selections lock the same month in the opposite filter. Core validation rejects conflicting selections.
- Scan From iSignal includes active and inactive subscriptions, reads both symbol-label variants, and requires manual confirmation for missing pairs. Cancel preserves the previous analyst list.
- MT4/MT5 and TradingView pages place the shared footer after their content and tutorials.
- Analyst status names remain white below three distinct months of valid trade history. The dashboard popup explains this state.

Final regression fix: analyst-name coloring now visits only top-level analyst rows in the drawdown table. It does not recolor nested profit/loss detail metrics. Loss figures remain red and profit figures green, including after the new white-history rule is applied.
'''
(root/'README_REV536.md').write_text(notes,encoding='utf8',newline='\n')
p=root/'assets/7b6af0cb4001a684.js';s=p.read_text('utf8');m=re.search(r'const FILES = (\{.*?\});',s,re.S);checks=json.loads(m[1]);checks={n:hashlib.sha256((root/n).read_bytes()).hexdigest()for n in checks};p.write_text(s[:m.start(1)]+json.dumps(checks,indent=2)+s[m.end(1):],encoding='utf8',newline='\n')
print('Prepared REV536')
