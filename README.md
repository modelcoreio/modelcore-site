# ModelCore, launch kit

Everything in this folder is ready to go live. Upload all five HTML files to one GitHub repository and turn on Pages.

## Files
- **index.html** — the splash landing (content owners vs data buyers). This is your homepage.
- **explore.html** — the full site (the "Neither?" link and general home).
- **studios.html** — content owners. Links to the operations-data page.
- **labs.html** — data buyers (the full buyer site).
- **business-operations-data.html** — operations-data supply page.

All internal links are relative, so the whole funnel works from a single repo. Do not rename `index.html`.

## Go live in 5 steps
1. Sign in at github.com and click **New repository**. Name it (e.g. `modelcore-site`), set it **Public**, create it.
2. On the repo page: **Add file → Upload files**. Drag in all five `.html` files. Click **Commit changes**.
3. **Settings → Pages → Build and deployment**: Source = **Deploy from a branch**, Branch = **main**, Folder = **/ (root)**. Save.
4. Wait 1 to 2 minutes. Your live URL appears on that page: `https://<username>.github.io/modelcore-site/`.
5. Open it. You land on the splash, and both doors work.

## Custom domain (modelcore.io), optional
1. **Settings → Pages → Custom domain**: enter `modelcore.io`, Save.
2. At your registrar, add DNS:
   - `A` records on `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` on `www` → `<username>.github.io`
3. Back in Pages, enable **Enforce HTTPS** once the certificate issues.

## Where inbound goes (make sure these inboxes exist)
- **data@modelcore.io** — data buyers, custom collection, sample requests
- **content@modelcore.io** — content owners, publishers, studios, operations-data
- **legal@modelcore.io** — Terms, Licensing, Acceptable Use
- **privacy@modelcore.io** — Privacy, Cookies, Data Processing
- **hello@modelcore.io** — job applications

Forms open the visitor's email pre-addressed and pre-filled, so they work the moment you launch, with no third-party setup.

## Booking
The "Schedule a call" buttons point to your Google calendar: `https://calendar.app.google/omsCyEfPso2KYJsH8`.

## Optional upgrade later
If you want form submissions to arrive automatically (no visitor mail-app step), create a free key at web3forms.com for content@ and one for data@ and ask to have the forms switched to use them.

## Before you scale marketing
The buyer site still contains sample stats, client logos, and pricing that should be confirmed as real or removed, and any security certifications you hold can be added. See prior notes for the full review.
