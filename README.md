# INKROOM — Tattoo studio prototype

Client-ready visual concept with temporary branding. No actual client name, address, phone number, email, opening hours, testimonials, qualifications or completed client tattoos have been invented.

## Open the prototype

Open **Tattoo-Studio-Preview.html** in a modern browser. This single file contains the styles, JavaScript, images and display font, so it can be opened offline without a development server. On a phone, download the file and choose a browser to open it. Clipboard access depends on browser permissions; the enquiry download action remains available.

## Included experience

- Responsive editorial homepage, charcoal/ivory/copper visual identity.
- Six illustrative tattoo studies with style filters and an artwork preview dialog.
- Saved artwork using browser storage (artwork IDs only, no contact details).
- Service/style enquiry entry points, artist profile placeholders and studio story.
- Three-step consultation enquiry: idea, placement/size/date, and contact details.
- Required-field/contact validation and a review summary.
- Copy/download enquiry; WhatsApp/email draft links appear only after a valid studio destination is configured.
- Process, aftercare section, FAQs, contact section, privacy and booking notes.
- Keyboard-accessible controls, native dialogs, reduced-motion support, sticky mobile booking action and responsive navigation.

**Booking status:** this is a working enquiry prototype, not a live reservation system. Nothing is sent automatically, no time is reserved, and no payment is taken. Contact details exist only in current page memory until the visitor chooses to share or download them. There is no database, admin login, email delivery service or payment gateway pretending to work.

## Personalize for the client

1. Edit `site-config.json`: studio name, contact details, WhatsApp number including country code, Instagram, address/map URL, homepage copy, portfolio and artist details.
2. Replace the sample images in `assets/` with approved studio/portfolio images. These demo images were AI-generated and are not the client's actual work. The supplied gallery currently uses six cells of a single illustrative contact sheet.
3. Edit `src/index.html` for the studio story, process, aftercare wording and any other page copy. FAQ text and service descriptions are in the configuration file.
4. Run `node build.mjs` to regenerate the deployable `dist/` directory and the single-file preview.

No install step or npm runtime packages are needed. Node 20+ is sufficient for building. The browser runtime has no external framework, CDN, API, webfont or image dependencies.

### Gallery images

For this prototype, `images.portfolio` points to a 3 × 2 contact sheet. `cell: 0...5` selects each tile. For production, either replace the contact sheet with approved work arranged in the same grid, or add `"image": "assets/your-photo.jpg"` to each portfolio entry. For an artist portrait, set that artist’s `image` to an approved local asset path. Separate image files are supported in both the hosted build and portable preview. Do not present generated studies as work done by the client.

### Contact options

Keep unknown contact fields empty. When a verified WhatsApp destination is entered, the final enquiry screen can open a **message draft**. When email is entered, it can open an email draft. The visitor still sends the message in their own app. Test each real destination with the client before launch.

## Build and test

```bash
node build.mjs
node --test tests/core.test.cjs
```

`dist/index.html` loads adjacent static assets and is the hosting entry point. Host the contents of `dist/` on the client's static hosting account. The included `vercel.json` declares the build command and output directory if that provider is chosen. No deployment was performed here.

To preview the multi-file source locally after building, use a normal static web server pointing at `dist/`. On a phone, the self-contained HTML file is easier.

The prototype intentionally has `noindex,nofollow` and a `robots.txt` disallow rule. Review and remove those only when real content is ready for public launch. Configure the final page title, social preview, canonical domain, studio policies and verified contact details at that stage.

## Transfer to the client

See **CLIENT-HANDOVER.md**. The source is ordinary HTML/CSS/JavaScript with a JSON content file. The client can own the Git repository, hosting and domain directly. There is no required ChatGPT account, subscription, Sites runtime or developer-owned backend dependency in the delivered source.

## Verification

21 Node tests pass for enquiry validation, dates, filters, favorites and sharing helpers. Build, JavaScript syntax, anchor/ID references and asset presence were checked. This environment did not provide the managed browser-control or native Sites publishing tools, so **live browser visual QA and hosting are unverified**. A manual checklist is included in TEST-REPORT.md.

## License and demo assets

Custom project code is supplied under the included MIT license. The local display font is a subset of DejaVu Sans Bold; its own notice is in `assets/FONT-LICENSE.txt`. Image generation prompts and asset provenance are recorded in ASSET-NOTES.md. Obtain permission for any replacement photos or artwork before publication.
