const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Core=require('../src/core.js');
const config=JSON.parse(fs.readFileSync(path.join(__dirname,'../site-config.json'),'utf8'));
const valid={style:'Fine line',idea:'A fern for a new chapter.',placement:'Forearm',size:'Medium — 5–15 cm',date:'2030-02-20',name:'Amr',email:'amr@example.com',phone:'',consent:true};

test('gallery shows all six studies and filters each real category',()=>{
 assert.equal(Core.filterWork(config.work).length,6);
 assert.deepEqual(Core.filterWork(config.work,'Fine line').map(w=>w.id),['wild-form','olive-and-serpent']);
 assert.equal(Core.filterWork(config.work,'Blackwork').length,1);
 assert.equal(Core.filterWork(config.work,'Unavailable style').length,0);
});
test('saved-only view respects the active style and does not invent entries',()=>{
 const ids=['wild-form','night-wings','unknown'];
 assert.deepEqual(Core.filterWork(config.work,'All work',ids,true).map(w=>w.id),['wild-form','night-wings']);
 assert.deepEqual(Core.filterWork(config.work,'Blackwork',ids,true).map(w=>w.id),['night-wings']);
 assert.equal(Core.filterWork(config.work,'All work',[],true).length,0);
});
test('favorites load drops duplicates, unknown IDs and non-string values',()=>{
 const store={getItem:()=>JSON.stringify(['wild-form','wild-form',{},'night-wings','unknown',5])};
 assert.deepEqual(Core.readFavorites(store,config.work.map(w=>w.id)),['wild-form','night-wings']);
});
test('blocked or corrupt browser storage degrades gracefully',()=>{
 assert.deepEqual(Core.readFavorites({getItem:()=>'{bad'},['x']),[]);
 assert.deepEqual(Core.readFavorites({getItem(){throw Error('blocked');}},['x']),[]);
 assert.deepEqual(Core.readFavorites({getItem:()=>'{"x":1}'},['x']),[]);
});
test('all six contact-sheet cells have distinct positions and invalid input is bounded',()=>{
 assert.deepEqual([0,1,2,3,4,5].map(Core.cellPosition),['0% 0%','50% 0%','100% 0%','0% 100%','50% 100%','100% 100%']);
 assert.equal(Core.cellPosition(-1),'0% 0%');assert.equal(Core.cellPosition(6),'0% 0%');
});
test('a complete enquiry validates all three steps',()=>{
 for(let i=0;i<3;i++)assert.equal(Core.validateStep(valid,i,'2026-10-27'),null);
});
test('style selection is required and accepts the undecided option',()=>{
 assert.equal(Core.validateStep({...valid,style:''},0).field,'enquiry-style');
 assert.equal(Core.validateStep({...valid,style:'I’m not sure yet'},0),null);
 assert.equal(Core.validateStep({...valid,style:'fake'},0).field,'enquiry-style');
});
test('overlong idea is rejected without silently truncating a customer request',()=>{
 assert.equal(Core.validateStep({...valid,idea:'a'.repeat(1501)},0).field,'enquiry-idea');
});
test('placement and size must be an offered choice',()=>{
 assert.equal(Core.validateStep({...valid,placement:''},1).field,'enquiry-placement');
 assert.equal(Core.validateStep({...valid,size:''},1).field,'enquiry-size');
});
test('past, impossible and malformed dates are rejected; flexible/today work',()=>{
 assert.equal(Core.validateStep({...valid,date:'2020-01-01'},1,'2026-10-27').field,'enquiry-date');
 assert.equal(Core.validateStep({...valid,date:'2030-02-31'},1,'2026-10-27').field,'enquiry-date');
 assert.equal(Core.validateStep({...valid,date:'tomorrow'},1,'2026-10-27').field,'enquiry-date');
 assert.equal(Core.validateStep({...valid,date:'2026-10-27'},1,'2026-10-27'),null);
 assert.equal(Core.validateStep({...valid,date:''},1,'2026-10-27'),null);
 assert.equal(Core.validDate('2028-02-29'),true);assert.equal(Core.validDate('2027-02-29'),false);
});
test('name is required and bounded',()=>{
 assert.equal(Core.validateStep({...valid,name:' '},2).field,'enquiry-name');
 assert.equal(Core.validateStep({...valid,name:'x'.repeat(81)},2).field,'enquiry-name');
});
test('either a valid email or phone is sufficient; no contact is rejected',()=>{
 assert.equal(Core.validateStep({...valid,email:'',phone:'+91 98765 43210'},2),null);
 assert.equal(Core.validateStep({...valid,email:'',phone:''},2).field,'enquiry-email');
 assert.equal(Core.validateStep({...valid,email:'broken@',phone:'+91 98765 43210'},2).field,'enquiry-email');
 assert.equal(Core.validateStep({...valid,email:'',phone:'abc123'},2).field,'enquiry-phone');
 assert.equal(Core.validateStep({...valid,email:'',phone:'123'},2).field,'enquiry-phone');
});
test('enquiry-preview acknowledgement is required',()=>{
 assert.equal(Core.validateStep({...valid,consent:false},2).field,'enquiry-consent');
});
test('summary is complete, contact-aware and explicitly not a confirmed appointment',()=>{
 const text=Core.createSummary({...valid,phone:'+91 98765 43210'},'Demo Studio');
 for(const expected of ['Demo Studio','Amr','amr@example.com','98765','Fine line','Forearm','5–15 cm','2030-02-20','A fern','not a confirmed appointment'])assert.ok(text.includes(expected),expected);
});
test('optional empty date and idea have meaningful enquiry text',()=>{
 const text=Core.createSummary({...valid,date:'',idea:''});
 assert.ok(text.includes('Flexible / to discuss'));assert.ok(text.includes('discuss this with the artist'));
});
test('no sharing destination is fabricated for an unconfigured client',()=>{
 assert.deepEqual(Core.sharingLinks(config.brand,'test'),{whatsapp:'',email:''});
});
test('configured sharing creates only encoded drafts without executing a send',()=>{
 const text='Name: A & B\nIdea: #rose?';
 const links=Core.sharingLinks({whatsapp:'+91 98765 43210',email:'studio@example.com'},text);
 assert.ok(links.whatsapp.startsWith('https://wa.me/919876543210?text='));
 assert.equal(decodeURIComponent(links.whatsapp.split('?text=')[1]),text);
 assert.ok(links.email.startsWith('mailto:studio@example.com?subject='));
 assert.ok(links.email.includes(encodeURIComponent(text)));
});
test('unsafe or invalid destinations remain unavailable',()=>{
 assert.deepEqual(Core.sharingLinks({whatsapp:'javascript:bad',email:'invalid'},'test'),{whatsapp:'',email:''});
 assert.equal(Core.safeWebUrl('javascript:alert(1)'), '');
 assert.equal(Core.safeWebUrl('http://example.com'), '');
 assert.equal(Core.safeWebUrl('https://example.com/profile'), 'https://example.com/profile');
});
test('local date uses calendar components rather than a UTC day shift',()=>{
 assert.equal(Core.localDate({getFullYear:()=>2030,getMonth:()=>0,getDate:()=>2}),'2030-01-02');
});
test('rendered form and footer keep prototype status and do not contain fictional contact details',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
 assert.ok(html.includes('Nothing is sent automatically.'));
 assert.ok(html.includes('not a confirmed appointment'));
 assert.equal(config.brand.phone,'');assert.equal(config.brand.address,'');
 assert.equal(config.demo,true);
});

test('a client can add a new style without changing enquiry validation code',()=>{
 assert.equal(Core.validateStep({...valid,style:'Traditional'},0,'2026-10-27',['Traditional','I’m not sure yet']),null);
});
