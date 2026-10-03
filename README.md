# Najim Bacha / Ideas into reality

A static portfolio with an obsidian, silver, and glacial-blue visual identity. Features an interactive chrome knot sculpture, staged headline entrances, dimensional project reveals, Wazn's interactive nutrition concept, Mindora Lab, and a full-color portrait.

## Preview

From this directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. No build or application package installation is needed. Use HTTP rather than opening `index.html` directly so browser modules load correctly.

## Editing

- `index.html`: content, projects, metadata, navigation, and contact links.
- `style.css`: responsive design, dimensional project art, and motion preferences.
- `scene.js`: Three.js geometry, generated studio reflections, drag/keyboard controls, render scheduling, and static fallback.
- `app.js`: mobile navigation, scroll reveals, reading progress, and animated sample nutrition interaction.
- `illustrations.js`: locally drawn meal illustrations that follow the sample meal selection.
- `assets/portrait.jpg`: existing portrait.
- `assets/vendor/`: locally hosted Three.js 0.180.0 and MIT license.
- `assets/fonts/`: locally hosted Space Grotesk and SIL Open Font License.

All runtime assets are local. No analytics, remote fonts, or external script requests are needed. The sculpture stops its animation when offscreen or the tab is hidden. Reduced motion pauses it by default; the user can explicitly resume it. Without WebGL, a static orbital illustration remains visible. Without JavaScript, content and navigation remain accessible.

### Wazn

Wazn replaces the former product name throughout visible content. The existing Google Play URL retains the original `com.snapcal.snapcal` package identifier, which is not a display name. If the app moves to a new listing, update that URL in `index.html`.

The meal explorer is a labeled interactive concept using sample nutrition data. It is not a live recognition service or an actual app screenshot. The road artwork is a custom illustration.

## Verification

The browser check uses Python Playwright and an installed Google Chrome, with a fresh isolated browser profile:

```sh
python -m pip install playwright
python tests/browser_check.py
python tests/cache_check.py
```

Start the preview server before running the checks. Coverage includes WebGL rendering; pointer and keyboard rotation; reset and motion controls; the complete sample meal cycle; anchor targets; mobile menu and focus behavior; reduced motion; JavaScript-disabled and WebGL-disabled fallbacks; and horizontal overflow at widths from 320 to 1920 pixels. Screenshots are generated locally and excluded from Git.

An additional axe-core WCAG A/AA check was run on desktop and mobile during implementation. Automated checks do not replace testing on real devices or with assistive technology. Entry motion is finite; hover motion only runs on a fine pointer; reduced motion disables decorative CSS animation and automatic sculpture rotation. No scroll hijacking or new runtime dependency is used.

## Publishing

Styles, application scripts, and the favicon use release-version query parameters in `index.html`. Update those version values whenever the corresponding files change so returning visitors do not combine new HTML with cached assets from an older release. The cache regression check simulates the original unversioned files remaining cached.

The repository remains directly compatible with GitHub Pages. Keep `app-ads.txt` at the repository root. Publish by merging the feature branch and pushing to the repository's configured Pages source branch. Local edits and commits do not change the live site.
