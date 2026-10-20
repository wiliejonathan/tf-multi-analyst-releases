import json,base64,hashlib
from pathlib import Path
release=json.loads(Path('/tmp/tf515/release.json').read_text());old=json.loads(Path('/tmp/tf515/previous.json').read_text());record=json.loads(base64.b64decode(old['content']));assert int(record.get('revision',0))<=515
asset=next(a for a in release['assets'] if a['name']=='TF_Extension_PC_MAC_REV515_MULTI_LINK.zip')
digest='sha256:'+hashlib.sha256(Path('/tmp/TF_Extension_PC_MAC_REV515_MULTI_LINK.zip').read_bytes()).hexdigest();assert not asset.get('digest') or asset['digest']==digest
data={'schema':1,'available':True,'revision':515,'tag_name':'v1.18.28','release_url':release['html_url'],'published_at':release['published_at'],'asset':{'id':asset['id'],'name':asset['name'],'url':asset['browser_download_url'],'size':asset['size'],'digest':digest,'updated_at':asset['updated_at']}}
request={'message':'Publish REV515 latest update metadata','sha':old['sha'],'branch':'main','content':base64.b64encode((json.dumps(data,indent=2)+'\n').encode()).decode()}
Path('/tmp/tf515/latest-request.json').write_text(json.dumps(request))
