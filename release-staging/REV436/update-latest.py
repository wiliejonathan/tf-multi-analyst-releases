import json,base64,hashlib
from pathlib import Path
release=json.loads(Path('/tmp/tf-rev436/release.json').read_text())
old=json.loads(Path('/tmp/tf-rev436/previous.json').read_text())
old_record=json.loads(base64.b64decode(old['content']))
assert int(old_record.get('revision',0)) <= 436, 'A newer release already exists'
asset=next(a for a in release['assets'] if a['name']=='TF_Extension_PC_MAC_REV436_MULTI_LINK.zip')
digest='sha256:'+hashlib.sha256(Path('/tmp/TF_Extension_PC_MAC_REV436_MULTI_LINK.zip').read_bytes()).hexdigest()
assert not asset.get('digest') or asset['digest']==digest
record={'schema':1,'available':True,'revision':436,'tag_name':'v1.17.49','release_url':release['html_url'],'published_at':release['published_at'],'asset':{'id':asset['id'],'name':asset['name'],'url':asset['browser_download_url'],'size':asset['size'],'digest':digest,'updated_at':asset['updated_at']}}
request={'message':'Publish REV436 latest update metadata','sha':old['sha'],'branch':'main','content':base64.b64encode((json.dumps(record,indent=2)+'\n').encode()).decode()}
Path('/tmp/tf-rev436/latest-request.json').write_text(json.dumps(request))
