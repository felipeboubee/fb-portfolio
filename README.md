# Felipe Boubee — Portfolio

A professional portfolio built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, social links, featured sections |
| `/about` | About — profile picture placeholder + bio |
| `/projects` | Projects grid — thumbnail, title, date |
| `/projects/[slug]` | Individual project detail (links, overview, materials, steps, gallery) |
| `/ee-mindmap` | Interactive EE Mind Map |
| `/admin` | **Local-only** project creation tool (not linked in site nav) |

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Adding New Projects

1. Go to `http://localhost:3000/admin`
2. Fill in all the fields (title, date, overview, materials, steps, images, etc.)
3. Click **Generate Project Code**
4. Copy the output and paste it into the `projects` array in `src/data/projects.ts`
5. Place your images/videos in `public/projects/<your-slug>/`
6. Commit & push — Vercel auto-deploys

## Deploying to Vercel

### Why the 404 happened

A bare `.jsx` file cannot be deployed to Vercel as a website. Vercel needs a **framework** (Next.js, Vite, etc.) with a proper build configuration. The project is now a full Next.js app, so it will deploy correctly.

### Steps

1. **Push to GitHub**
   ```bash
   git add -A
   git commit -m "feat: full portfolio with Next.js"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your `fb-portfolio` repository
   - Vercel auto-detects Next.js — leave all defaults
   - Click **Deploy**

3. **That's it!** Vercel will build with `next build` and serve the site.

### Custom Domain: felipeboubee.portfolio.com

The warning you received means `portfolio.com` is owned by another Vercel account. To verify ownership, add these DNS records at your domain registrar:

| Type | Name | Value |
|---|---|---|
| CNAME | `felipeboubee` | `57bfcfdd4c7a0a8d.vercel-dns-017.com.` |
| TXT | `_vercel` | `vc-domain-verify=felipeboubee.portfolio.com,b15517da2b5c74944a0e` |

**Important**: You must own or control the `portfolio.com` domain to add these records. If you don't own `portfolio.com`, you cannot use `felipeboubee.portfolio.com` as a subdomain. Consider:

- Using Vercel's free subdomain: `fb-portfolio.vercel.app`
- Buying your own domain (e.g. `felipeboubee.com`) from a registrar like Namecheap, Google Domains, or Cloudflare, then adding it in Vercel's project settings → Domains

If you **do** control `portfolio.com`:
1. Add both DNS records above at your registrar
2. Wait for DNS propagation (up to 48 hours)
3. Go to your Vercel project → Settings → Domains → Add `felipeboubee.portfolio.com`
4. The TXT record can be removed after verification completes

## Color Palettes Used

- **Blues** (palette 30636): `#096192`, `#1171ba`, `#1399c6`, `#24aae2`, `#0e8c7f`
- **Neutrals** (palette 18976): `#1f222b`, `#8f9294`, `#a4bcc4`, `#d9e0e2`, `#f4f3f3`

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Deployed on Vercel
