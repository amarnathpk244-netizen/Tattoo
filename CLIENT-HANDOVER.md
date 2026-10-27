# Client-ന് website കൈമാറാനുള്ള guide

ഈ ZIP-ൽ website-ന്റെ മുഴുവൻ editable source ഉണ്ട്. ഇപ്പോഴത്തെ **INKROOM** താൽക്കാലിക പേരാണ്. Real client details നൽകിയിട്ടില്ല.

## ഇപ്പോൾ കാണിക്കാൻ

`Tattoo-Studio-Preview.html` browser-ൽ തുറക്കുക. Internet ഇല്ലാതെയും preview പ്രവർത്തിക്കും. Form ഒരു enquiry preview മാത്രമാണ്; അത് appointment reserve ചെയ്യില്ല, payment എടുക്കില്ല, message അയയ്ക്കില്ല.

## Client details കിട്ടുമ്പോൾ

`site-config.json`-ൽ ഇവ മാറ്റാം:

- Studio name, description.
- Email, phone, WhatsApp number with country code.
- Instagram, verified address, map link.
- Hero text, portfolio labels, artist profiles, service descriptions, FAQ.

AI demo images മാറ്റി client-ന്റെ സ്വന്തം approved work/photos ചേർക്കണം. Photo/video/artwork publish ചെയ്യാനുള്ള permission client ഉറപ്പാക്കണം. Aftercare, booking, age/ID, deposit, cancellation തുടങ്ങിയ studio policies client approve ചെയ്തശേഷം ചേർക്കണം. ഇപ്പോൾ fictional reviews, qualifications, awards, address, prices തുടങ്ങിയവ ഇല്ല.

Source copy മാറ്റങ്ങൾ `src/`-ൽ ചെയ്യുക. ശേഷം:

```bash
node build.mjs
node --test tests/core.test.cjs
```

ഇതോടെ `dist/` website-ും single-file preview-യും പുതുക്കും. Node 20+ വേണം. Separate npm dependencies install ചെയ്യേണ്ടതില്ല.

## Ownership client-ന്റെ പേരിൽ

1. Client-ന്റെ സ്വന്തം email ഉപയോഗിച്ചുള്ള Git/hosting/domain accounts ഉപയോഗിക്കുക. Developer access invite ചെയ്യാൻ കഴിയുന്ന platform ആണെങ്കിൽ invite ഉപയോഗിക്കുക; passwords ചാറ്റിൽ share ചെയ്യരുത്.
2. ഈ source code client-ന്റെ repository-ൽ നൽകുക. Git വേണ്ടെങ്കിൽ ZIP-ന്റെ ഒരു copy client-ന് നൽകാം.
3. Client-ന്റെ hosting account-ൽ `dist/` deploy ചെയ്യുക. Hosting provider support ചെയ്താൽ repository connect ചെയ്ത് build command `node build.mjs`, output `dist` ആക്കാം.
4. Domain client-ന്റെ account-ൽ തന്നെ സൂക്ഷിക്കുക. DNS connection hosting provider കാണിക്കുന്ന verified values പ്രകാരം ചെയ്യുക.
5. Real contact destination ചേർത്തശേഷം phone/browser വഴി ഒരു enquiry തയ്യാറാക്കി ശരിയായ WhatsApp/email draft-ലേക്ക് തുറക്കുന്നതും client-ന് ലഭിക്കുന്നതും പരിശോധിക്കുക.
6. Gallery, artist details, mobile layout, contact links, approved policies എന്നിവ client review ചെയ്തശേഷം public launch ചെയ്യുക.
7. Repository ownership, hosting ownership, domain access, source ZIP, update instructions എന്നിവ കൈമാറുക. Client access ഉറപ്പാക്കിയശേഷം ആവശ്യമില്ലാത്ത developer permissions remove ചെയ്യാം.

## Client-ന് കൊടുക്കേണ്ട checklist

- [ ] Source ZIP + repository access.
- [ ] Hosting dashboard access, domain account access.
- [ ] Verified contact destinations and live website URL.
- [ ] Portfolio source photos and permissions.
- [ ] Branding and approved page content.
- [ ] Studio-approved enquiry/booking/aftercare/privacy policies.
- [ ] Content update guide and agreed support scope.
- [ ] A tested backup/version of the approved site.

## പിന്നീട് backend വേണമെങ്കിൽ

ഇപ്പോഴുള്ള form browser-ൽ enquiry തയ്യാറാക്കുകയാണ്. Automatic inbox, booking calendar, artist availability, admin dashboard, deposits/payments, customer accounts എന്നിവ ഈ prototype-ൽ ഇല്ല. Client ആവശ്യപ്പെടുന്നപ്പോൾ client-owned services ഉപയോഗിച്ച് പ്രത്യേകം integrate ചെയ്ത് end-to-end test ചെയ്യണം. അതുവരെ “booking confirmed” എന്നോ “enquiry sent” എന്നോ കാണിക്കരുത്.

ഈ source ഏതെങ്കിലും പ്രത്യേക builder account-ലോ developer subscription-ലോ lock ചെയ്തിട്ടില്ല.
