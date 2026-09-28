# Double Treble Stitches — Website Handoff (Netlify)

Everything you need to host the site on Netlify is in this folder.

## What's inside
- `build/` — the complete website, ready to host
- `netlify/functions/submission-created.js` — optional extra that sends customers a branded thank-you email after they submit the order form
- `netlify.toml` — tells Netlify where the site and function live

## Option A — Live in 5 minutes (drag & drop)
1. Go to https://app.netlify.com/drop (free Netlify account needed)
2. Drag ONLY the **`build` folder** onto the page — the site is live immediately

   ⚠️ IMPORTANT: unzip the package first and drag the **build** folder from INSIDE it.
   Do NOT drag the zip file itself, and do NOT drag the outer folder that contains build.
   If your live site shows "Not Found" / 404, this is what went wrong — fix it here:
   **Deploys → (bottom of page) "Need to update your site? Drag and drop your site output folder here"**
   → drop the **build** folder → wait ~30 seconds → your homepage will load at your site URL.
3. Order requests and pattern waitlist signups now arrive in Netlify:
   **Site dashboard → Forms** (photos customers attach are stored there too)
4. To get each order by email, set up a notification:
   **Site configuration → Forms → Form notifications → Add notification → Email notification**
   - Form: `order-request` — send to **doubletreblests@gmail.com**
   - Form: `pattern-waitlist` — send to **doubletreblests@gmail.com**
5. Optional: **Domain settings** to connect a custom domain (free HTTPS included)

## Option B — Full setup (adds automatic customer thank-you emails)
Drag-and-drop skips the function, so customers won't get the branded thank-you
email. To enable it:
1. Set environment variables in **Site configuration → Environment variables**:
   - `EMERGENT_EMAIL_KEY` = (private key: get it from your developer; never commit it to this repo)
   - `EMAIL_FROM_NAME` = Double Treble Stitches
   - `EMAIL_REPLY_TO` = doubletreblests@gmail.com
2. Deploy this whole folder (not just `build/`) with the Netlify CLI:
   `netlify deploy --prod --dir=build`
   (or connect the project via Git and Netlify will build it automatically —
   build command: `yarn build` with env `REACT_APP_NETLIFY=true`, publish `build`)

## Custom domain (optional)
1. Buy a domain (e.g. doubletreblestitches.com) from any registrar — Namecheap, GoDaddy, Cloudflare, etc.
2. In Netlify: **Site configuration → Domain management → Add a custom domain**, enter the domain, and verify you own it.
3. Point the domain at Netlify — pick ONE:
   - **Easiest (Netlify DNS):** choose "Use Netlify DNS" when prompted, then at your registrar replace the nameservers with the four Netlify nameservers shown. Netlify handles everything else.
   - **Keep your registrar's DNS:** add an **A record** for the root domain (`@`) pointing to `75.2.60.5`, and a **CNAME record** for `www` pointing to `your-site-name.netlify.app`.
4. HTTPS: Netlify provisions a free certificate automatically — check **Domain management → HTTPS** and enable "Force HTTPS".
5. DNS can take a few minutes to a few hours to update worldwide, then your domain is live.

## Notes
- The site is fully static — no server or database to maintain or pay for
- Product photos live in `build/photos/`; swapping one means replacing the file and redeploying (or asking your developer)
- Netlify's free plan covers this site's needs, including form submissions (100/month free)
