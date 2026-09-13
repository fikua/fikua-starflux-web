# fikua-starflux-web

Landing page for [Starflux](https://github.com/fikua/fikua-starflux), served at **<https://starflux.fikua.com>**, in English, Spanish, Catalan, and French.

Starflux is an open-source native desktop app for differential aperture photometry on FITS image series (exoplanet transits, variable stars, asteroid occultations), coordinated by [Fikua](https://fikua.com). This site describes the product and links to the platform downloads (macOS / Windows / Linux) published on the [fikua-starflux releases page](https://github.com/fikua/fikua-starflux/releases).

## What lives here

```text
.
├── content/               One JSON file per language: en.json, es.json, ca.json, fr.json
├── templates/
│   ├── base.html           Shared shell: nav, language switcher, Fikua strip, footer
│   └── home.html           Page content: hero, instrumentation, pipeline, download, roadmap
├── assets/
│   ├── css/main.css        Observatory/instrument-panel aesthetic (own palette, not Fikua's)
│   ├── js/main.js          Smooth-scroll + language-menu toggle
│   └── img/favicon.svg
├── public/
│   └── 404.html            Served at the root regardless of language
├── build.js                Renders content × templates → dist/{en,es,ca,fr}/index.html
└── wrangler.toml
```

`dist/` is generated (gitignored) — run the build before deploying or previewing.

## Build & preview

```bash
npm run build   # renders dist/
npm run dev     # build + rebuild on change
```

`dist/index.html` is a script-based redirect to the visitor's preferred language (falling back to English); each `dist/<lang>/index.html` is a fully static page.

## Hosting

- **Production:** Cloudflare Workers Static Assets (project `fikua-starflux-web`), custom domain `starflux.fikua.com`, serving `dist/`.
- **Deploy:** the Workers project's GitHub integration runs `npm run build` then `npx wrangler deploy` on every push to `main` (same pattern as `fikua-lab-wallet` and `fikua-lab-landing`, adapted for the build step); pull requests get a preview URL.
- **DNS:** Workers custom domains manage their own hostname — no separate DNS record is declared in `fikua-platform-iac` (see that repo's `tofu/cloudflare-fikua-com.tf` for why).

## Content updates

Download links point at `fikua-starflux`'s GitHub Releases rather than hard-coded asset URLs, so nothing here needs updating when a new version ships — only when the platform matrix itself changes (README.md in `fikua-starflux` is the source of truth for supported platforms). Adding a fifth language means a new `content/<lang>.json` plus adding the code to `LANGS` in `build.js`.

## License

Apache-2.0. See [LICENSE](LICENSE).
