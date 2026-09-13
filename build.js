const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(ROOT, 'assets');
const TEMPLATES = path.join(ROOT, 'templates');
const CONTENT = path.join(ROOT, 'content');
const SITE_URL = 'https://starflux.fikua.com';

const LANGS = ['en', 'es', 'ca', 'fr'];
const DEFAULT_LANG = 'en';

const LANG_NAMES = { en: 'English', es: 'Español', ca: 'Català', fr: 'Français' };

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function render(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value ?? '');
  }
  return out;
}

function readFile(p) {
  return fs.readFileSync(p, 'utf-8');
}

function loadContent(lang) {
  return JSON.parse(readFile(path.join(CONTENT, `${lang}.json`)));
}

function fmt(template, values) {
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    out = out.replaceAll(`{${key}}`, value);
  }
  return out;
}

function softwareJsonLd(c, lang) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Starflux',
    applicationCategory: 'ScientificApplication',
    operatingSystem: 'macOS, Windows, Linux',
    description: c.meta.description,
    url: `${SITE_URL}/${lang}/`,
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    codeRepository: 'https://github.com/fikua/fikua-starflux',
    creator: { '@type': 'Organization', name: 'Fikua', url: 'https://fikua.com' },
  };
  return JSON.stringify(data);
}

function build() {
  console.log('Building starflux.fikua.com...');

  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  ensureDir(DIST);

  copyDir(ASSETS, path.join(DIST, 'assets'));
  // Files served at the root regardless of language: favicon, 404, robots, etc.
  for (const entry of fs.readdirSync(PUBLIC, { withFileTypes: true })) {
    if (entry.isFile()) fs.copyFileSync(path.join(PUBLIC, entry.name), path.join(DIST, entry.name));
  }

  const baseTemplate = readFile(path.join(TEMPLATES, 'base.html'));
  const homeTemplate = readFile(path.join(TEMPLATES, 'home.html'));

  const contentByLang = {};
  for (const l of LANGS) contentByLang[l] = loadContent(l);

  const allPages = [];
  const today = new Date().toISOString().split('T')[0];

  function hreflangFor() {
    const lines = LANGS.map(
      l => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/">`
    );
    lines.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LANG}/">`);
    return lines.join('\n    ');
  }

  for (const lang of LANGS) {
    const c = contentByLang[lang];
    const langDir = path.join(DIST, lang);
    ensureDir(langDir);

    const otherLangs = LANGS.filter(l => l !== lang);
    const langSwitcher = otherLangs
      .map(l => `<a href="/${l}/" hreflang="${l}">${LANG_NAMES[l]}</a>`)
      .join('');

    const homeContent = render(homeTemplate, {
      hero_eyebrow: c.hero.eyebrow,
      hero_title_line1: c.hero.title_line1,
      hero_title_highlight: c.hero.title_highlight,
      hero_title_rest: c.hero.title_rest,
      hero_sub: c.hero.sub,
      hero_cta_primary: c.hero.cta_primary,
      hero_cta_secondary: c.hero.cta_secondary,
      hero_readout_title: c.hero.readout_title,
      hero_readout_target: c.hero.readout_target,
      hero_readout_filter: c.hero.readout_filter,
      hero_readout_points: c.hero.readout_points,
      hero_readout_rms: c.hero.readout_rms,

      features_kicker: c.features.kicker,
      features_title: c.features.title,
      features_sub: c.features.sub,
      feature_1_title: c.features.items[0].title,
      feature_1_body: c.features.items[0].body,
      feature_2_title: c.features.items[1].title,
      feature_2_body: c.features.items[1].body,
      feature_3_title: c.features.items[2].title,
      feature_3_body: c.features.items[2].body,
      feature_4_title: c.features.items[3].title,
      feature_4_body: c.features.items[3].body,
      feature_5_title: c.features.items[4].title,
      feature_5_body: c.features.items[4].body,
      feature_6_title: c.features.items[5].title,
      feature_6_body: c.features.items[5].body,

      pipeline_kicker: c.pipeline.kicker,
      pipeline_title: c.pipeline.title,
      pipeline_sub: c.pipeline.sub,
      pipeline_1_title: c.pipeline.steps[0].title,
      pipeline_1_body: c.pipeline.steps[0].body,
      pipeline_2_title: c.pipeline.steps[1].title,
      pipeline_2_body: c.pipeline.steps[1].body,
      pipeline_3_title: c.pipeline.steps[2].title,
      pipeline_3_body: c.pipeline.steps[2].body,

      download_status: c.download.status,
      download_title: c.download.title,
      download_sub: fmt(c.download.sub, {
        latest_release: `<a href="https://github.com/fikua/fikua-starflux/releases/latest" target="_blank" rel="noopener">${c.download.latest_release_label}</a>`,
      }),
      download_note: fmt(c.download.note, { cmd: '<code>xattr -cr Starflux.app</code>' }),
      download_all_releases: c.download.all_releases,

      roadmap_title: c.roadmap.title,
      roadmap_sub: c.roadmap.sub,
      roadmap_status_done: c.roadmap.status_done,
      roadmap_status_next: c.roadmap.status_next,
      roadmap_1_body: c.roadmap.items[0].body,
      roadmap_2_body: c.roadmap.items[1].body,
      roadmap_3_body: c.roadmap.items[2].body,
      roadmap_4_body: c.roadmap.items[3].body,
      roadmap_5_body: c.roadmap.items[4].body,
      roadmap_footer: fmt(c.roadmap.footer, {
        changelog: `<a href="https://github.com/fikua/fikua-starflux/blob/main/CHANGELOG.md" target="_blank" rel="noopener">${c.roadmap.changelog_label}</a>`,
        readme: `<a href="https://github.com/fikua/fikua-starflux#status" target="_blank" rel="noopener">${c.roadmap.readme_label}</a>`,
      }),
    });

    const pageHtml = render(baseTemplate, {
      lang,
      page_title: c.meta.title,
      page_description: c.meta.description,
      page_url: `${SITE_URL}/${lang}/`,
      hreflang_links: hreflangFor(),
      lang_current: lang.toUpperCase(),
      lang_switcher: langSwitcher,
      nav_features: c.nav.features,
      nav_roadmap: c.nav.roadmap,
      nav_download: c.nav.download,
      fikua_body: fmt(c.fikua.body, {
        fikua: '<a href="https://fikua.com" target="_blank" rel="noopener">Fikua</a>',
      }),
      footer_license: c.footer.license,
      software_jsonld: softwareJsonLd(c, lang),
      content: homeContent,
    });

    fs.writeFileSync(path.join(langDir, 'index.html'), pageHtml);
    allPages.push({ url: `/${lang}/`, lang });
  }

  // Root: redirect to the browser's preferred language.
  const rootRedirect = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Starflux</title>
  <meta http-equiv="refresh" content="0; url=/en/">
  <script>
    (function () {
      var supported = ${JSON.stringify(LANGS)};
      var pref = (navigator.language || 'en').slice(0, 2).toLowerCase();
      var lang = supported.includes(pref) ? pref : 'en';
      window.location.replace('/' + lang + '/');
    })();
  </script>
  <link rel="canonical" href="${SITE_URL}/en/">
</head>
<body></body>
</html>
`;
  fs.writeFileSync(path.join(DIST, 'index.html'), rootRedirect);

  // --- sitemap.xml ---
  const sitemapEntries = allPages
    .map(p => `  <url>\n    <loc>${SITE_URL}${p.url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

  // --- robots.txt ---
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);

  console.log(`Built ${allPages.length + 1} pages to dist/`);
}

if (process.argv.includes('--watch')) {
  build();
  console.log('Watching for changes...');
  for (const dir of [PUBLIC, ASSETS, TEMPLATES, CONTENT]) {
    if (!fs.existsSync(dir)) continue;
    fs.watch(dir, { recursive: true }, () => {
      console.log('Change detected, rebuilding...');
      try { build(); } catch (e) { console.error('Build error:', e.message); }
    });
  }
} else {
  build();
}
