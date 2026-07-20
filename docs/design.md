# TFT Coaching One-Pager — Design (2026-07-11)

## Goal
Booking/landing page for 1-on-1 TFT (Teamfight Tactics) coaching by a Challenger player.
Visitors read credentials + offering and send a booking request via contact form; the coach
receives it as an email.

## Decisions (approved)
- **Tech:** pure static — `index.html` + `styles.css` + `main.js` + `config.js`. No build step, no framework.
- **Email delivery:** Web3Forms (`https://api.web3forms.com/submit`), access key lives in `config.js`.
- **Language:** English.
- **Offering (updated 2026-07-11, modeled on coachrogue.com):** two groups —
  - *Single sessions:* 1-Hour Session (VOD review or live game) · 2-Hour Deep Dive (VOD + live game, "Most popular") · Double Up Duo (60 min for two players).
  - *Training plans (bundles with discount tag + "DM me anytime between sessions" perk):* Starter Plan (4 sessions) · Climb Plan (8 sessions) · Pro Plan (12 sessions).
  - Prices live in `config.js` under `pricing.*` and ship FIXED (user decision 2026-07-11, premium ladder): 1 h €50 · 2 h €90 · Duo €65 · 4er €180 (save €20) · 8er €340 (save €60) · 12er €480 (save €120). Empty value falls back to "Price on request".
  - Each offer card CTA preselects the offer in the contact form's "What are you interested in?" select and scrolls to the form.
  - Custom offers: "Custom request" option in the form select + a "Need something else?" strip under the plans + direct mailto link (config `contactEmail`).
- **Testimonials (added 2026-07-11):** section between curriculum and how-it-works, driven by `config.testimonials[]` (name, rank progression, quote). Ships with clearly-marked sample cards until real ones are configured.
- **Discord (added 2026-07-11):** `config.discordInviteUrl` — "Reach me on Discord" button in the contact section + linked handle in the footer; unconfigured-hint treatment when empty.
- **Personal details:** all placeholders centralized in `config.js` (name, Riot ID, peak rank, profile link, Discord, Web3Forms key). Page shows visible placeholder markers until filled; form shows a clear "not configured" notice if the key is missing.
- **Design:** dark esports look — near-black navy background, Hextech gold primary accent, violet secondary, large display typography, subtle glow effects, scroll-reveal animations, fully responsive.

## Page structure
1. **Hero** — headline, Challenger badge (peak LP from config), CTA scrolls to form.
2. **Credentials** — stat cards: peak rank, region, seasons played + proof link (tactics.tools/lolchess) + Riot ID.
3. **Offerings** — single sessions (3 cards) + training plans (3 bundle cards), see above.
4. **What you'll learn** — 4 cards: Economy & Tempo · Scouting & Positioning · Meta & Comp Flexibility · Stage-by-Stage Decision-Making.
5. **How it works** — 3 steps: request via form → schedule via email/Discord → live 1-on-1 on Discord with screenshare.
6. **Contact form** — name, email, current rank (select), interest (select, preselectable from offer cards), Discord handle (optional), message; JS fetch to Web3Forms; honeypot spam field; inline success/error, no reload.
7. **Footer** — Discord handle, socials placeholder, Riot Games non-affiliation disclaimer, optional Impressum link.

## Variants (resolved 2026-07-19)
Three variants were built and judged; the user picked **B "Hextech Arcane"** (violet glassmorphism,
gradient orbs, gold reserved for badge + CTA). Its files now live in the project root; variants
A "Cinematic Gold" and C "Sharp Esports Minimal" were deleted.

## Non-functional
- No JS libraries; Google Fonts allowed.
- Responsive down to 360px; `prefers-reduced-motion` respected; accessible labels/contrast.
- Deployable by dropping the folder on Netlify/Vercel/GitHub Pages.
