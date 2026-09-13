# fikua-starflux-web

Landing page for [Starflux](https://github.com/fikua/fikua-starflux), served at **<https://starflux.fikua.com>**.

Starflux is an open-source native desktop app for differential aperture photometry on FITS image series (exoplanet transits, variable stars, asteroid occultations), coordinated by [Fikua](https://fikua.com). This site describes the product and links to the platform downloads (macOS / Windows / Linux) published on the [fikua-starflux releases page](https://github.com/fikua/fikua-starflux/releases).

## What lives here

```text
.
├── public/
│   ├── index.html   Landing page: product description, features, downloads, roadmap
│   ├── style.css     Page styles (own dark/starfield aesthetic, not the Fikua brand palette)
│   ├── app.js        Smooth-scroll for in-page anchors
│   ├── favicon.svg
│   └── 404.html
└── wrangler.toml
```

The site is **fully static** — no build step. Cloudflare Workers serves the directory as-is.

## Hosting

- **Production:** Cloudflare Workers Static Assets (project `fikua-starflux-web`), custom domain `starflux.fikua.com`.
- **Deploy:** every push to `main` is deployed automatically by the Workers project's GitHub integration (same setup as `fikua-lab-wallet` and `fikua-lab-landing`); pull requests get a preview URL.
- **DNS:** Workers custom domains manage their own hostname — no separate DNS record is declared in `fikua-platform-iac` (see that repo's `tofu/cloudflare-fikua-com.tf` for why).
- **Local preview:** open `public/index.html` directly, or `npx wrangler dev` once you `npm i -g wrangler`.

## Content updates

Download links point at `fikua-starflux`'s GitHub Releases rather than hard-coded asset URLs, so nothing here needs updating when a new version ships — only when the platform matrix itself changes (README.md in `fikua-starflux` is the source of truth for supported platforms).

## License

Apache-2.0. See [LICENSE](LICENSE).
