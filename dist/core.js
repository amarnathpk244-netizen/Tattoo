(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.InkroomCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const styles = ['Fine line','Blackwork','Ornamental','Realism','Abstract','Custom / cover-up','I’m not sure yet'];
  function clean(value) { return String(value || '').trim(); }
  function localDate(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y,m,d] = value.split('-').map(Number);
    const date = new Date(y,m-1,d);
    return date.getFullYear()===y && date.getMonth()===m-1 && date.getDate()===d;
  }
  function validateStep(data, step, today = localDate(), allowedStyles = styles) {
    if (step===0) {
      if (!allowedStyles.includes(data.style)) return {field:'enquiry-style',message:'Choose a style, or “I’m not sure yet”.'};
      if (clean(data.idea).length>1500) return {field:'enquiry-idea',message:'Keep your idea under 1,500 characters.'};
    }
    if (step===1) {
      if (!['Forearm','Upper arm','Shoulder','Back','Leg','Other / let’s discuss'].includes(data.placement)) return {field:'enquiry-placement',message:'Choose a placement, or “Other / let’s discuss”.'};
      if (!['Small — up to 5 cm','Medium — 5–15 cm','Large — over 15 cm','I’d like advice'].includes(data.size)) return {field:'enquiry-size',message:'Choose a size, or “I’d like advice”.'};
      if (data.date && (!validDate(data.date) || data.date<today)) return {field:'enquiry-date',message:'Choose today or a future date for your preference.'};
    }
    if (step===2) {
      if (!clean(data.name) || clean(data.name).length>80) return {field:'enquiry-name',message:'Enter your name, using up to 80 characters.'};
      const email=clean(data.email), phone=clean(data.phone);
      if (!email && !phone) return {field:'enquiry-email',message:'Add an email address or phone number to your enquiry.'};
      if (email && (email.length>150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return {field:'enquiry-email',message:'Check the email address you entered.'};
      if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || phone.replace(/\D/g,'').length<7 || phone.replace(/\D/g,'').length>15)) return {field:'enquiry-phone',message:'Enter a valid phone number, including your country code if needed.'};
      if (!data.consent) return {field:'enquiry-consent',message:'Confirm that this is an enquiry preview, not a booking.'};
    }
    return null;
  }
  function filterWork(work, style='All work', favorites=[], onlySaved=false) {
    return work.filter(item => (style==='All work' || item.style===style) && (!onlySaved || favorites.includes(item.id)));
  }
  function cellPosition(cell) { const n=Number.isInteger(cell)&&cell>=0&&cell<6?cell:0; return `${(n%3)*50}% ${n>=3?100:0}%`; }
  function createSummary(data, brand='Tattoo studio') {
    const lines=[`${brand} — consultation enquiry`,'',`Name: ${clean(data.name)}`];
    if(clean(data.email)) lines.push(`Email: ${clean(data.email)}`);
    if(clean(data.phone)) lines.push(`Phone: ${clean(data.phone)}`);
    lines.push('',`Style: ${clean(data.style)}`,`Placement: ${clean(data.placement)}`,`Approximate size: ${clean(data.size)}`,`Preferred consultation date: ${data.date||'Flexible / to discuss'}`,'',`Idea: ${clean(data.idea)||'I’d like to discuss this with the artist.'}`,'','This is an enquiry, not a confirmed appointment. Please confirm availability and the quote.');
    return lines.join('\n');
  }
  function sharingLinks(brand, summary) {
    const whatsapp=clean(brand.whatsapp).replace(/[\s()+.-]/g,'');
    const email=clean(brand.email);
    return {
      whatsapp:/^\d{7,15}$/.test(whatsapp)?`https://wa.me/${whatsapp}?text=${encodeURIComponent(summary)}`:'',
      email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?`mailto:${email}?subject=${encodeURIComponent('Tattoo consultation enquiry')}&body=${encodeURIComponent(summary)}`:''
    };
  }
  function safeWebUrl(value) { try { const url=new URL(value);return url.protocol==='https:'?url.href:''; } catch {return '';} }
  function readFavorites(storage, allowedIds) {
    try {const saved=JSON.parse(storage.getItem('inkroom-favorites-v1')||'[]');return Array.isArray(saved)?[...new Set(saved.filter(id=>typeof id==='string' && allowedIds.includes(id)))]:[];} catch{return [];}
  }
  return {styles,localDate,validDate,validateStep,filterWork,cellPosition,createSummary,sharingLinks,safeWebUrl,readFavorites};
});
