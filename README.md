# TFT Coaching — One-Pager

Booking/landing page for 1-on-1 Teamfight Tactics coaching (Challenger). Static site,
generated from a single content file. The contact form delivers requests by email via
[Web3Forms](https://web3forms.com).

**Live:** https://tft-coaching.pages.dev · **Content editor:** https://tft-coaching.pages.dev/admin

## Structure

```
config.json    → ALL content (texts, prices, offers, testimonials, video) — the single source
index.html     → template; {{placeholders}} are filled by the build
build.js       → renders dist/ from config.json (Node, no dependencies)
styles.css     → design
main.js        → runtime only: smooth scroll, reveals, form submit
admin/         → Sveltia CMS (self-hosted) — the editing UI for config.json
legal.html     → Impressum + privacy
assets/        → logo.png, og-image.png
docs/          → design decisions
ANLEITUNG.md   → German guide for the client
```

## Editing content

Two ways, both end up as a commit that auto-deploys:

1. **Admin panel** (for the client): `/admin` → sign in with GitHub → form fields → Save.
2. **Directly:** edit `config.json` in GitHub or locally.

The build **validates** `config.json`: invalid JSON, empty required fields or an
unrecognizable video URL abort the build, so Cloudflare keeps the last good deployment
online instead of publishing a broken page.

## Local development

```bash
node build.js && npx serve dist -l 4599
```

`dist/` is generated and gitignored — never edit it directly.

## Deploy (Cloudflare Pages)

Connected to this repo: every push to `main` deploys automatically.
Build command `sh build.sh`, output directory `dist`.

## Admin panel setup (one-time)

The CMS signs in through GitHub, which needs an OAuth proxy:

1. Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) as a Cloudflare Worker.
2. Register a GitHub OAuth App whose callback URL is `<worker-url>/callback`.
3. Put the OAuth client ID/secret into the worker's environment variables, and restrict
   `ALLOWED_DOMAINS` to `tft-coaching.pages.dev`.
4. Enter the worker URL as `base_url` in `admin/config.yml`.

Only repository collaborators can save — the CMS acts with the signed-in user's GitHub rights.
