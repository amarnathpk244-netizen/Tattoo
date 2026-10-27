# Prototype verification

Date: 27 October 2026

## Completed

- `node build.mjs`: passed; generated deployable `dist/` plus a self-contained offline HTML preview.
- JavaScript syntax checks: passed for application, core helpers and build script.
- **21 Node tests passed, 0 failed**. Coverage: style filters, saved-only gallery, storage failures/corruption, contact-sheet positions, the three enquiry steps, date validity/past-date rejection, name/contact validation, preview consent, complete summary creation, optional inputs, configured/unconfigured sharing destinations, unsafe URLs, calendar date formatting, demo status, and future client-added styles.
- HTML structural checks: **75 IDs**, **40 fragment/ARIA/label references**, and **45 literal application ID references** resolve correctly; no duplicate IDs.
- All four script/image references in the generated HTML resolve to local files. CSS, font and favicon assets are bundled.
- The portable preview has no external script or image references, and embeds its local display font.
- Default client phone, email, WhatsApp and address remain empty. No fictional client details have been published.

These tests verify helpers and build structure. They are not a browser end-to-end test.

## Not verified in this session

- Live browser visual/layout QA on desktop, Android or iOS: the managed browser-control entry point was unavailable.
- Hosted deployment or live URL: the native Sites registration/publishing tools were not exposed in this session, although Sites was listed as installed.
- Real WhatsApp/email delivery: no client contact destination was supplied. The implementation opens drafts only, and never sends automatically.
- Backend reservations, deposits/payments, admin accounts: not implemented or implied by the prototype.

## Manual acceptance before client delivery

- [ ] Open the HTML preview on the client's phone and on desktop; check headline layout and font loading.
- [ ] Open the mobile navigation and follow each section link; check the sticky booking control.
- [ ] Try every portfolio filter, save/unsave artwork, and open/close artwork previews.
- [ ] Verify keyboard focus, Escape-to-close, tab order, and reduced-motion behaviour.
- [ ] Complete the three enquiry steps; try missing contact, invalid email, past date and back/edit actions.
- [ ] Confirm copy/download summary matches entered text and never shows a false sent/booking confirmation.
- [ ] After entering real contact destinations, open the WhatsApp/email drafts and verify the recipient and enquiry text with the client.
- [ ] Replace AI demo images and placeholder artist information, then review all page copy and studio policies.
- [ ] Deploy from the client-owned account, test its live URL and SSL, then review indexing settings for launch.

See TEST-RESULTS.txt and STRUCTURE-RESULTS.json for the measured local results.
