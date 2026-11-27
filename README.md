# play.normaapps.com

Norma Games: browser games for Meta Quest. Static site on GitHub Pages, no build step, no tracking, no third-party requests.

- `index.html`: the games home. `kaito/index.html`: the Master Kaito page.
- `kaito/play/`: the game itself, a production build of the Norma Spatial Lab table tennis game (Immersive Web SDK). Built in the lab repo with `npm run build:public` (branch `agent/kaito-public`) and copied here as is. That build opens straight into the game, has the AI conversation off, ships no source maps and is checked for key-like strings.
- `assets/`: `site.css`, `site.js` (device-aware buttons, copy, screenshot viewer) and self-hosted fonts (Inter, IBM Plex Mono, Shippori Mincho B1; SIL Open Font License, licences beside the files).
- `img/`: captures from the game, the share image and the QR codes (`node tools/make-qr.cjs` regenerates them).
- "Send to Meta Quest" uses Meta's Web Launch link: https://developers.meta.com/horizon/documentation/web/web-launch/

Updating the game: rebuild in the lab, replace `kaito/play/` with the new `dist-public/`, commit, push to `main`.

## Hosting and DNS

- GitHub Pages, legacy build from `main` root. Pushing to `main` deploys in about a minute.
- Custom domain `play.normaapps.com` (Pages setting plus `CNAME` file).
- DNS at Namecheap, normaapps.com Advanced DNS: one record added on 2026-11-27, `CNAME play -> talmor84.github.io.` (TTL automatic). No other record was changed. To take the site down, delete that record and disable Pages.
