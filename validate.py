"""Check build structure without claiming browser rendering verification."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import json,re
ROOT=Path(__file__).resolve().parent
class Inventory(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.refs=[];self.labels=[];self.scripts=[];self.images=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id'in d:self.ids.append(d['id'])
        if tag=='a' and d.get('href','').startswith('#'):self.refs.append(d['href'][1:])
        if tag=='label' and d.get('for'):self.labels.append(d['for'])
        if tag=='script' and d.get('src'):self.scripts.append(d['src'])
        if tag=='img' and d.get('src'):self.images.append(d['src'])
        for attr in ('aria-controls','aria-labelledby','aria-describedby'):
            if d.get(attr):self.refs.extend(d[attr].split())
page=Inventory();page.feed((ROOT/'dist/index.html').read_text())
assert not [x for x,n in Counter(page.ids).items() if n>1], 'Duplicate HTML IDs'
assert not set(page.refs+page.labels)-set(page.ids), 'Unresolved fragment, label or ARIA target'
for item in page.scripts+page.images:assert (ROOT/'dist'/item).is_file(),item
source=(ROOT/'src/app.js').read_text()
references=set(re.findall(r"\$\('([^']+)'\)",source))
assert references<=set(page.ids),references-set(page.ids)
preview=Inventory();preview.feed((ROOT/'Tattoo-Studio-Preview.html').read_text())
assert not preview.scripts,'Portable preview has an external script'
assert all(i.startswith('data:') for i in preview.images),'Portable preview has an external image'
assert 'data:font/woff;base64,' in (ROOT/'Tattoo-Studio-Preview.html').read_text()
config=json.loads((ROOT/'site-config.json').read_text())
assert len({w['id'] for w in config['work']})==len(config['work'])
assert all(re.fullmatch(r'[a-z0-9-]+',w['id']) for w in config['work'])
assert not any(config['brand'][k] for k in ('email','phone','whatsapp','address'))
result={'html_ids':len(page.ids),'fragment_aria_and_label_targets':len(page.refs+page.labels),'static_asset_references':len(page.scripts+page.images),'app_id_references':len(references),'portable_preview_external_scripts':0,'portable_preview_external_images':0,'build_structure_pass':True,'live_browser_verified':False,'hosted_deployment_verified':False}
(ROOT/'STRUCTURE-RESULTS.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
