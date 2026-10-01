# ModelCore website

## Clean URLs

Pages are addressed without `.html` (e.g. `modelcore.io/contact`). GitHub Pages serves `contact.html` for `/contact` automatically, so the files keep their `.html` names; every link, canonical tag, and the sitemap use the clean form. Two rules when editing:

- **Link to pages without `.html`**, starting with `/`: `/contact`, `/datasets/`, `/datasets/spch-conv`.
- **Previewing locally:** double-clicking the files won't work, because links are site-root based. Run `npx serve` in this folder (it supports clean URLs) and open the address it prints, or just check the live site after pushing.

A static site for **modelcore.io**, ready for GitHub Pages. No build step: edit the HTML files directly.

## What's here

| Path | Page |
|---|---|
| File | Live URL | Page |
|---|---|---|
| `index.html` | `modelcore.io/` | Homepage, with the two paths: "I need data" and "I own content" |
| `datasets/index.html` | `modelcore.io/datasets/` | Catalogue of all 71 datasets with filters and search |
| `datasets/spch-conv.html` etc. | `modelcore.io/datasets/spch-conv` | One page per dataset (71 pages), each indexable by Google |
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

## After launch: search engines (15 minutes, do this once)

1. Go to **Google Search Console**, add the domain property `modelcore.io`, and verify it with the DNS TXT record it gives you.
2. In Search Console → **Sitemaps**, submit `sitemap.xml`.
3. Use **URL Inspection** on the homepage and click **Request indexing**.
4. Repeat steps 1–2 in **Bing Webmaster Tools** (you can import from Google in one click).
5. Paste a page URL into LinkedIn's Post Inspector to confirm the social preview image shows.

## Where inquiries go

Forms open the visitor's email app with a pre-filled message. Make sure these inboxes exist:

- **data@modelcore.io**: data buyers, samples, quotes, custom collection
- **content@modelcore.io**: content owners and business data
- **hello@modelcore.io**: general, press, and job applications
- **legal@** and **privacy@**: listed on the contact page

## Editing

- **Case studies:** in `index.html`, find the comment that starts `CASE STUDIES`. Fill in the three cards with real, anonymized deals, then delete the word `hidden` from the `<section>` tag. The section stays invisible until you do.
- **A dataset:** edit its file in `datasets/`. Change the card text in `datasets/index.html` to match.
- **Adding a page or dataset:** also add its clean URL (no `.html`) to `sitemap.xml`.
- Booking links point to `https://calendar.app.google/omsCyEfPso2KYJsH8`.

## Confirm before promoting the site

- **Dataset volumes and "220+ languages"** appear on dataset pages. They should be numbers you can stand behind if a buyer asks.
- **Legal entity:** the legal page says "ModelCore LLC". Confirm that is the right name.
- **Business data claims:** "encrypted in transit and at rest" and "identifiers removed" are commitments security teams will ask you to document.
- **Legal documents** are templates. Have counsel review them.
- **Pricing** was removed from public pages; every dataset now says "Pricing is quoted". Add it back only if you want public prices.
