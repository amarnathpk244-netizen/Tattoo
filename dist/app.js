(function () {
  'use strict';
  const config=window.STUDIO_CONFIG, Core=window.InkroomCore;
  if(!config || !Core) return;
  const $=id=>document.getElementById(id);
  const make=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const ids=config.work.map(w=>w.id);
  const allowedStyles=[...config.styles.map(s=>s.name),'I’m not sure yet'];
  let storage;
  try{storage=window.localStorage;}catch{storage={getItem:()=>null,setItem:()=>{}};}
  let favorites=Core.readFavorites(storage,ids),currentFilter='All work',onlySaved=false,showAll=false,step=0,activeArt=null,summary='',toastTimer;
  const heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-4.7-8-10a4.4 4.4 0 0 1 8-2.5A4.4 4.4 0 0 1 20 10c0 5.3-8 10-8 10Z"/></svg>';
  function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
  document.querySelectorAll('[data-brand]').forEach(el=>el.textContent=config.brand.name);
  document.title=`${config.brand.name} — ${config.brand.descriptor}`;
  document.querySelector('.header .brand').setAttribute('aria-label',`${config.brand.name} home`);
  if(!config.demo)$('concept-strip').hidden=true;
  ['eyebrow','line1','line2','line3','description'].forEach(key=>{const el=$('hero-'+key);if(el&&config.hero[key])el.textContent=config.hero[key];});
  document.querySelectorAll('[data-image="hero"]').forEach(el=>el.src=config.images.hero);
  $('year').textContent=String(new Date().getFullYear());
  const styleOptions=[make('option','','Choose a style'),...allowedStyles.map(style=>{const option=make('option','',style);option.value=style;return option;})];styleOptions[0].value='';$('enquiry-style').replaceChildren(...styleOptions);
  $('enquiry-date').min=Core.localDate();
  function paintImage(el,cell){el.style.backgroundImage=`url("${config.images.portfolio}")`;el.style.backgroundPosition=Core.cellPosition(cell);}
  function paintArtwork(el,work){if(work.image){el.style.backgroundImage=`url("${work.image}")`;el.style.backgroundPosition='center';el.style.backgroundSize='cover';}else{paintImage(el,work.cell);el.style.backgroundSize='300% 200%';}}
  function updateSaved(){ $('saved-count').textContent=String(favorites.length);$('saved-link').setAttribute('aria-label',`View ${favorites.length} saved artwork ${favorites.length===1?'study':'studies'}`); }
  function syncFilters(){document.querySelectorAll('[data-filter]').forEach(button=>{const active=!onlySaved&&button.dataset.filter===currentFilter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});}
  function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(item=>item!==id):favorites.concat(id);try{storage.setItem('inkroom-favorites-v1',JSON.stringify(favorites));}catch{toast('Saved for this visit. Browser storage is unavailable.');}updateSaved();renderGallery();}
  function renderGallery(){
    const gallery=$('gallery');gallery.replaceChildren();
    const all=Core.filterWork(config.work,currentFilter,favorites,onlySaved);
    const visible=showAll||currentFilter!=='All work'||onlySaved?all:all.slice(0,3);
    visible.forEach(work=>{
      const card=make('article','work-card'),wrap=make('div','work-image-wrap');
      const open=make('button','work-open');open.type='button';open.setAttribute('aria-label',`View ${work.title}, ${work.style} concept artwork`);
      const image=make('span','work-image');image.setAttribute('role','img');image.setAttribute('aria-label',`${work.title}: ${work.description} Illustrative tattoo concept.`);paintArtwork(image,work);
      const view=make('span','art-view','↗');view.setAttribute('aria-hidden','true');open.append(image,view);open.addEventListener('click',()=>openArtwork(work));
      const save=make('button','favorite');save.type='button';save.innerHTML=heart;save.setAttribute('aria-label',`${favorites.includes(work.id)?'Unsave':'Save'} ${work.title}`);save.setAttribute('aria-pressed',String(favorites.includes(work.id)));save.addEventListener('click',()=>{toggleFavorite(work.id);const next=document.querySelector(`[data-save-id="${work.id}"]`);if(next)next.focus({preventScroll:true});});save.dataset.saveId=work.id;
      wrap.append(open,save);
      const caption=make('div','work-caption'),copy=make('div');copy.append(make('h3','',work.title),make('p','',`${work.style.toUpperCase()} / ${work.placement.toUpperCase()}`));caption.append(copy,make('span','work-number',String(config.work.indexOf(work)+1).padStart(2,'0')));card.append(wrap,caption);gallery.append(card);
    });
    if(!visible.length)gallery.append(make('p','gallery-empty',onlySaved?'No saved pieces yet. Tap a heart on any artwork to keep it here.':'No studies in this style yet. Explore another style.'));
    $('show-all').hidden=onlySaved||currentFilter!=='All work'||all.length<=3;
    $('show-all').textContent=showAll?'Show selected studies ↑':`View all ${all.length===6?'six':all.length} studies ↗`;
    $('show-all').setAttribute('aria-expanded',String(showAll));
    $('gallery-note').textContent=onlySaved?'Your saved concept artwork. Stored in this browser only.':'Illustrative design studies, created for this studio concept.';
    $('filter-status').textContent=`${visible.length} ${onlySaved?'saved ':''}artwork ${visible.length===1?'study':'studies'} shown${currentFilter==='All work'?'':` in ${currentFilter}`}.`;
    syncFilters();
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{currentFilter=button.dataset.filter;onlySaved=false;renderGallery();}));
  $('show-all').addEventListener('click',()=>{showAll=!showAll;renderGallery();});
  $('saved-link').addEventListener('click',()=>{onlySaved=!onlySaved;currentFilter='All work';showAll=true;renderGallery();$('work').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
  function syncDialogState(){document.body.classList.toggle('dialog-open',Boolean(document.querySelector('dialog[open]')));}
  function openDialog(id){const dialog=$(id);if(!dialog.open)dialog.showModal();syncDialogState();}
  function closeDialog(id){$(id).close();syncDialogState();}
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>closeDialog(button.dataset.close)));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('close',syncDialogState);
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  });
  function openArtwork(work){activeArt=work;$('art-title').textContent=work.title;$('art-description').textContent=work.description;$('art-style').textContent=work.style;$('art-placement').textContent=work.placement;paintArtwork($('art-detail-image'),work);$('art-detail-image').setAttribute('aria-label',`${work.title}, illustrative ${work.style} tattoo concept`);openDialog('art-dialog');}
  function renderStep(){
    document.querySelectorAll('[data-step]').forEach(el=>el.hidden=Number(el.dataset.step)!==step);
    document.querySelectorAll('[data-step-label]').forEach(el=>{el.classList.toggle('current',Number(el.dataset.stepLabel)===step);if(Number(el.dataset.stepLabel)===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    $('booking-back').hidden=step===0;$('booking-next').hidden=step===2;$('booking-submit').hidden=step!==2;$('booking-next').textContent=step===0?'The details →':'About you →';$('form-error').textContent='';
    $('booking-dialog').scrollTop=0;
  }
  function openBooking(style,artwork){
    closeMenu();
    if(style&&allowedStyles.includes(style))$('enquiry-style').value=style;
    if(artwork&&!$('enquiry-idea').value.trim())$('enquiry-idea').value=`Inspired by “${artwork.title}” — a ${artwork.style.toLowerCase()} design study.`;
    $('enquiry-date').min=Core.localDate();$('booking-form').hidden=false;$('enquiry-result').hidden=true;document.querySelector('.step-track').hidden=false;step=0;renderStep();openDialog('booking-dialog');
  }
  document.querySelectorAll('.booking-trigger').forEach(button=>button.addEventListener('click',()=>openBooking()));
  $('art-enquire').addEventListener('click',()=>{closeDialog('art-dialog');openBooking(activeArt.style,activeArt);});
  config.styles.forEach(style=>{
    const row=make('button','style-item');row.type='button';row.setAttribute('aria-label',`Start an enquiry about ${style.name}`);row.append(make('span','',style.mark));const copy=make('span','style-content');copy.append(make('h3','',style.name),make('p','',style.detail));row.append(copy,make('span','style-arrow','↗'));row.addEventListener('click',()=>openBooking(style.name));$('style-list').append(row);
  });
  config.artists.forEach((artist,index)=>{
    const card=make('article','artist-card');let image;
    if(artist.image!=='portfolio'){image=make('img','artist-image');image.src=artist.image==='hero'?config.images.hero:artist.image;image.alt=artist.image==='hero'?'Illustrative artist hands at work, not an artist portrait':`Portrait of ${artist.name}`;image.loading='lazy';image.width=300;image.height=380;}
    else{image=make('div','artist-image');paintImage(image,artist.cell);image.setAttribute('role','img');image.setAttribute('aria-label','Illustrative blackwork tattoo concept, not client work');}
    const copy=make('div','artist-copy');copy.append(make('p','eyebrow',`ARTIST PROFILE / ${String(index+1).padStart(2,'0')}`),make('h3','',artist.name),make('p','artist-specialty',artist.specialty),make('p','artist-bio',artist.bio));const link=make('button','text-link','Start a conversation ↗');link.type='button';link.addEventListener('click',()=>openBooking());copy.append(link);card.append(image,copy);$('artist-grid').append(card);
  });
  config.faq.forEach(item=>{const details=make('details');details.append(make('summary','',item.q),make('p','',item.a));$('faq-list').append(details);});
  function readForm(){return {style:$('enquiry-style').value,idea:$('enquiry-idea').value,placement:$('enquiry-placement').value,size:$('enquiry-size').value,date:$('enquiry-date').value,name:$('enquiry-name').value,email:$('enquiry-email').value,phone:$('enquiry-phone').value,consent:$('enquiry-consent').checked};}
  function showError(error){$('form-error').textContent=error.message;const field=$(error.field);if(field){field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby','form-error');field.focus();}}
  $('booking-form').addEventListener('input',event=>{event.target.removeAttribute('aria-invalid');if(event.target.getAttribute('aria-describedby')==='form-error')event.target.removeAttribute('aria-describedby');$('form-error').textContent='';});
  $('booking-next').addEventListener('click',()=>{const error=Core.validateStep(readForm(),step,Core.localDate(),allowedStyles);if(error){showError(error);return;}step=Math.min(2,step+1);renderStep();document.querySelector(`[data-step="${step}"] select, [data-step="${step}"] input`).focus();});
  $('booking-back').addEventListener('click',()=>{step=Math.max(0,step-1);renderStep();document.querySelector(`[data-step="${step}"] select, [data-step="${step}"] input`).focus();});
  $('booking-form').addEventListener('submit',event=>{
    event.preventDefault();
    if(step<2){$('booking-next').click();return;}
    const data=readForm();for(let s=0;s<3;s++){const error=Core.validateStep(data,s,Core.localDate(),allowedStyles);if(error){step=s;renderStep();showError(error);return;}}
    summary=Core.createSummary(data,config.brand.name);$('enquiry-summary').textContent=summary;
    const links=Core.sharingLinks(config.brand,summary);
    $('enquiry-result-note').textContent=(links.whatsapp||links.email)?'Your enquiry hasn’t been sent. Choose a sharing option to open a message or email draft, then send it yourself.':'Your enquiry hasn’t been sent. Copy or download it to share when the studio’s contact details are available.';
    [['whatsapp-enquiry',links.whatsapp],['email-enquiry',links.email]].forEach(([id,url])=>{$(id).hidden=!url;if(url)$(id).href=url;else $(id).removeAttribute('href');});
    $('booking-form').hidden=true;document.querySelector('.step-track').hidden=true;$('enquiry-result').hidden=false;$('booking-dialog').scrollTop=0;$('copy-enquiry').focus();
  });
  $('copy-enquiry').addEventListener('click',async()=>{try{if(!navigator.clipboard)throw new Error('Unavailable');await navigator.clipboard.writeText(summary);toast('Enquiry copied. Nothing has been sent.');}catch{toast('Copy is unavailable here. Use “Download .txt” instead.');}});
  $('download-enquiry').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([summary],{type:'text/plain;charset=utf-8'}));const link=make('a');link.href=url;link.download='tattoo-consultation-enquiry.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  $('edit-enquiry').addEventListener('click',()=>{$('booking-form').hidden=false;$('enquiry-result').hidden=true;document.querySelector('.step-track').hidden=false;step=0;renderStep();$('enquiry-style').focus();});
  function closeMenu(){$('mobile-nav').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');$('menu-toggle').setAttribute('aria-label','Open navigation');}
  $('menu-toggle').addEventListener('click',()=>{const open=$('mobile-nav').hidden;$('mobile-nav').hidden=!open;$('menu-toggle').setAttribute('aria-expanded',String(open));$('menu-toggle').setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  document.querySelectorAll('#mobile-nav a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('mobile-nav').hidden){closeMenu();$('menu-toggle').focus();}});
  window.matchMedia('(min-width: 821px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  const policies={privacy:{title:'A little privacy.',paragraphs:['Your enquiry details stay in this page until you choose to copy, download or share them. This prototype does not automatically send enquiries to a studio or store contact information in a database.','Saved artwork identifiers are stored in this browser, if browser storage is available. You can remove them using the heart buttons or clear your browser’s site data.','If you choose WhatsApp or email when contact links are available, your selected app handles that sharing. This page does not send messages on your behalf.']},booking:{title:'Before we begin.',paragraphs:['This is a studio concept. The enquiry form prepares a preview; it does not reserve a time, take a payment or confirm an appointment.','Prices, studio availability, deposits, identification requirements and cancellation terms must be confirmed directly with the studio. A preferred date is a request only.','Portfolio images are illustrative concept artwork. Artist profiles and studio details will be replaced with the client’s approved information before launch.']}};
  document.querySelectorAll('[data-policy]').forEach(button=>button.addEventListener('click',()=>{const policy=policies[button.dataset.policy];$('policy-heading').textContent=policy.title;$('policy-copy').replaceChildren(...policy.paragraphs.map(text=>make('p','',text)));openDialog('policy-dialog');}));
  const contact=$('contact-details'),entries=[];
  if(config.brand.email&&Core.sharingLinks(config.brand,'').email){const a=make('a','',config.brand.email);a.href=`mailto:${config.brand.email}`;entries.push(a);}
  if(config.brand.phone&&/^\+?[\d\s().-]{7,30}$/.test(config.brand.phone)){const a=make('a','',config.brand.phone);a.href='tel:'+config.brand.phone.replace(/[^+\d]/g,'');entries.push(a);}
  if(Core.safeWebUrl(config.brand.instagram)){const a=make('a','','Instagram ↗');a.href=Core.safeWebUrl(config.brand.instagram);a.target='_blank';a.rel='noopener noreferrer';entries.push(a);}
  if(config.brand.address)entries.push(make('span','',config.brand.address));
  if(Core.safeWebUrl(config.brand.mapsUrl)){const a=make('a','','Find the studio ↗');a.href=Core.safeWebUrl(config.brand.mapsUrl);a.target='_blank';a.rel='noopener noreferrer';entries.push(a);}
  if(entries.length)contact.replaceChildren(...entries);
  updateSaved();renderGallery();renderStep();
})();
