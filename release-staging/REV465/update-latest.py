import json,base64,hashlib
from pathlib import Path
release=json.loads(Path('/tmp/tf465/release.json').read_text());old=json.loads(Path('/tmp/tf465/previous.json').read_text());record=json.loads(base64.b64decode(old['content']));assert int(record.get('revision',0))<465
asset=next(a for a in release['assets'] if a['name']=='TF_Extension_PC_MAC_REV465_MULTI_LINK.zip')
digest='sha256:'+hashlib.sha256(Path('/tmp/TF_Extension_PC_MAC_REV465_MULTI_LINK.zip').read_bytes()).hexdigest();assert not asset.get('digest') or asset['digest']==digest
data={'schema':1,'available':True,'revision':465,'tag_name':'v1.17.78','release_url':release['html_url'],'published_at':release['published_at'],'asset':{'id':asset['id'],'name':asset['name'],'url':asset['browser_download_url'],'size':asset['size'],'digest':digest,'updated_at':asset['updated_at']}}
request={'message':'Publish REV465 latest update metadata','sha':old['sha'],'branch':'main','content':base64.b64encode((json.dumps(data,indent=2)+'\n').encode()).decode()}
Path('/tmp/tf465/latest-request.json').write_text(json.dumps(request))
