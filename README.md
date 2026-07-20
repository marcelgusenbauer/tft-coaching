# TFT Coaching — One-Pager

Booking/landing page for 1-on-1 Teamfight Tactics coaching (Challenger). Pure static site —
no build step, no framework. The contact form delivers requests to your inbox via
[Web3Forms](https://web3forms.com).

## Structure

```
index.html / styles.css / main.js / config.js   → the site ("Hextech Arcane" design)
assets/       → logo.png goes here
docs/
  design.md   → approved design decisions
```

The site is fully self-contained — deploy the project folder as-is.

## Setup (one file: `config.js`)

All personal data lives in `config.js`:

| Key | What it is |
|---|---|
| `coachName` | Your name/handle |
| `riotId` | e.g. `YourName#EUW` |
| `region` | Ladder region (default `EUW`) |
| `peakRank` | e.g. `Challenger 1,240 LP` |
| `seasonsPlayed` | e.g. `8` |
| `profileUrl` | tactics.tools / lolchess.gg profile (rank proof link) |
| `discordHandle` | Your Discord username |
| `discordInviteUrl` | Discord server invite / profile link — enables the Discord buttons |
| `contactEmail` | Shown as direct-email fallback + custom-offer mailto |
| `web3formsAccessKey` | **Required for the form** — free key from https://web3forms.com (enter your email there, key arrives by mail) |
| `pricing.*` | Fixed prices (pre-filled: 1 h €50 · 2 h €90 · Duo €65 · 4× €180 · 8× €340 · 12× €480). Empty value → "Price on request" |
| `testimonials[]` | `{ name, rank, quote }` entries — until filled, clearly-marked sample cards are shown |

Unfilled values render as visibly marked placeholders on the page, and the form shows a
"not connected yet" notice until the Web3Forms key is set — nothing fails silently.

## Logo

Save your logo as `assets/logo.png`. On load it automatically replaces the header hex mark and
the favicon; while the file is missing, the built-in SVG mark is shown instead. A square image
(≥128×128) works best — it is displayed as a circle.

## Local preview

Any static server works, e.g.:

```bash
npx serve .        # then open http://localhost:3000
```

## Deploy (Cloudflare Pages, free)

1. Run `make-dist.cmd` — builds a clean `dist/` folder (site files only, no docs/IDE files).
2. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** →
   **Pages** → **Upload assets** → project name e.g. `tft-coaching` → drag the `dist/`
   folder in → **Deploy**.
3. Site is live at `https://<projekt>.pages.dev` (free subdomain, SSL included).

Re-deploy after changes: run `make-dist.cmd` again, then in the Pages project
**Create new deployment** → drag `dist/` in. A custom domain can be attached later
under the project's **Custom domains** tab.

## Legal

Footer includes the Riot Games non-affiliation disclaimer. If you operate commercially from
Austria, add an Impressum link in the footer.
