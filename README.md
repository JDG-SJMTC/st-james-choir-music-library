# St James Choir Music Library — MVP

Static, mobile-first catalogue for St James Mar Thoma Church, London.

## Collection included
Kristheeya Keerthanangal — 427 verified songs.

## Files
- `index.html` — website shell
- `styles.css` — responsive styling
- `app.js` — search/filter + PDF page links
- `data/songs.json` — generated catalogue data
- `assets/kk-staff-notation.pdf` — source notation PDF

## Test locally
Because browsers normally block `fetch()` from `file://`, run a simple local web server in this folder, for example:

`python -m http.server 8000`

Then open `http://localhost:8000`.

## Deployment
Upload the folder contents to any normal static web host. The site has no server-side dependency.

For Google Sites, the most reliable setup is to host this static app at a public HTTPS URL and add it to the church site as a link or embedded page. If the PDF is hosted elsewhere, change `PDF_PATH` near the top of `app.js` to its public URL.

## Search behaviour
Users can search by:
- song number
- Malayalam title
- English transliteration
- aliases/common spellings from the catalogue

Opening a result points the browser PDF viewer to the stored PDF page using `#page=N`.
