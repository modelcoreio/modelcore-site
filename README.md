# ModelCore website

## Clean URLs

Pages are addressed without `.html` (e.g. `modelcore.io/contact`). GitHub Pages serves `contact.html` for `/contact` automatically, so the files keep their `.html` names; every link, canonical tag, and the sitemap use the clean form. Two rules when editing:

- **Link to pages without `.html`**, starting with `/`: `/contact`, `/datasets/`, `/datasets/audio`.
- **Previewing locally:** double-clicking the files won't work, because links are site-root based. Run `npx serve` in this folder (it supports clean URLs) and open the address it prints, or just check the live site after pushing.

A static site for **modelcore.io**, ready for GitHub Pages. No build step: edit the HTML files directly.

## What's here

| Path | Page |
|---|---|
| File | Live URL | Page |
|---|---|---|
| `index.html` | `modelcore.io/` | Homepage, with the two paths: "I need data" and "I own content" |
| `datasets/index.html` | `modelcore.io/datasets/` | Training data overview, with the "Request the catalogue" form |
| `datasets/audio.html` etc. | `modelcore.io/datasets/audio` | One page per data type (9): audio, video, images, text, code, reasoning, human-feedback, robotics, business-operations |
| `custom-collection.html` | `modelcore.io/custom-collection` | Custom collection and enrichment, with a brief form |
| `content-owners.html` | `modelcore.io/content-owners` | For studios, publishers, and rights holders |
| `business-data.html` | `modelcore.io/business-data` | For companies licensing operational data |
| `contact.html`, `careers.html`, `legal.html` | `/contact`, `/careers`, `/legal` | Supporting pages |
| `404.html` | (any missing URL) | Not-found page |
| `assets/` | Shared stylesheet, script, favicon, social image, logo |
| `sitemap.xml`, `robots.txt`, `CNAME` | Search engine and domain files |
| `labs.html`, `datasets.html`, `explore.html`, `studios.html`, `business-operations-data.html` | | Redirects from old URLs, so existing links keep working |

## Go live

1. Create a public GitHub repository (e.g. `modelcore-site`).
2. **Add file → Upload files**, then drag in **everything in this folder, including the `assets` and `datasets` folders**. Commit.
3. **Settings → Pages**: Source = Deploy from a branch, Branch = `main`, Folder = `/ (root)`. Save.
4. **Settings → Pages → Custom domain**: `modelcore.io`. (The `CNAME` file already sets this.)
5. At your domain registrar, add DNS records:
   - `A` records on `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` on `www` → `<your-github-username>.github.io`
6. Once the certificate issues, tick **Enforce HTTPS**.

## Featured bar

The bar above the header promotes business data and links to `/business-data#estimate`. It's hidden on the business data page itself. Visitors can dismiss it, and it stays dismissed on their browser.

- **To change it:** search every page for `class="promo"` and edit the text there. The block is identical on every page, so a find-and-replace across the folder works.
- **To show a new announcement to people who dismissed the old one:** change `data-id="bizdata-1"` to a new value (e.g. `bizdata-2`) on every page and in the small script in each page's `<head>`.
- **To remove it:** delete the `<aside class="promo">…</aside>` block from each page.

## After launch: search engines (15 minutes, do this once)

1. Go to **Google Search Console**, add the domain property `modelcore.io`, and verify it with the DNS TXT record it gives you.
2. In Search Console → **Sitemaps**, submit `sitemap.xml`.
3. Use **URL Inspection** on the homepage and click **Request indexing**. Repeat for `/datasets/`, `/content-owners`, and `/business-data`. Google is still showing the very first splash page; this is what replaces it.
4. **Favicon and site name** in results update on Google's schedule, usually within a few weeks of re-crawling. The site now provides everything Google needs for both (a real favicon file, and site-name structured data).
5. **Sitelinks** (the extra rows under a result) are chosen by Google automatically, and appear as the site earns traffic. Clear page titles and the sitemap are what help.
6. **Knowledge panel** (the box on the right): create a Google Business Profile, and add your LinkedIn and other official profile URLs to the site's structured data (the `sameAs` field in the homepage's Organization block).
7. Repeat steps 1–2 in **Bing Webmaster Tools** (you can import from Google in one click).
8. Paste a page URL into LinkedIn's Post Inspector to confirm the social preview image shows.

## Where inquiries go

Forms open the visitor's email app with a pre-filled message. Make sure these inboxes exist:

- **data@modelcore.io**: data buyers, samples, quotes, custom collection
- **content@modelcore.io**: content owners and business data
- **hello@modelcore.io**: general, press, and job applications
- **legal@** and **privacy@**: listed on the contact page

## Motion and color

- `assets/motion.js` runs the animated panels (training data page and both owner pages), the logo assembling on the first page of each visit, the header on scroll, the process steps filling in, and the homepage code sample typing in. Everything pauses off-screen and switches off for visitors who have reduced motion turned on.
- Colors are set by tokens at the top of `assets/site.css`. `assets/palettes.css` holds three ready-made alternatives; copy one block to the end of `site.css` to switch. The animations follow automatically.

## Editing

- **Case studies:** in `index.html`, find the comment that starts `CASE STUDIES`. Fill in the three cards with real, anonymized deals, then delete the word `hidden` from the `<section>` tag. The section stays invisible until you do.
- **A data type page:** edit its file in `datasets/`. The short description on its tile appears on both the homepage and `datasets/index.html`, so change it in both places.
- **The catalogue is private by design.** The site describes capabilities only; volumes, specs, and dataset names go out by email in response to catalogue requests (data@modelcore.io).
- **Adding a page or dataset:** also add its clean URL (no `.html`) to `sitemap.xml`.
- Booking links point to `https://calendar.app.google/omsCyEfPso2KYJsH8`.

## Confirm before promoting the site

- **Legal changes for counsel to review:** the public Data Licensing Agreement was replaced by a plain-language "How licensing works" summary (`/legal#license`). Two sentences in the Terms of Service now refer to the signed License Agreement instead of the old public DLA, and the audio per-minute pricing line was removed from the Terms. Have a standard license agreement ready to send with quotes.
- **Business data claims:** "encrypted in transit and at rest" and "identifiers removed" are commitments security teams will ask you to document.
- **Legal documents** are templates. Have counsel review them.
- **Process claims on the training data page:** NDA, Data Processing Addendum, security questionnaires, and quality results reported in each datasheet. Make sure your team can do each of these before launch.
- **Capability claims:** each data-type page lists what you "can supply." Remove anything you wouldn't take on as a custom collection either.
