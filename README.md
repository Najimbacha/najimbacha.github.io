# Najim Bacha — Interactive portfolio

A responsive, static portfolio for GitHub Pages with a locally hosted Three.js scene, dimensional project illustrations, and an accessible mobile menu.

## Preview

Run `python -m http.server 4173` in this directory and open http://localhost:4173. Serve over HTTP; the 3D module cannot load from a file:// URL. No build or package installation is required.

## Edit

- `index.html`: portfolio copy, project links, experience, and contact details.
- `style.css`: responsive layout and project illustrations.
- `scene.js`: real-time 3D workspace, pointer/keyboard rotation, motion controls, and fallback.
- `app.js`: mobile navigation.
- `assets/portrait.jpg`: supplied portrait.
- `assets/vendor/`: Three.js 0.180.0 and its MIT license.

Drag the scene horizontally on a touchscreen or with a mouse. When the scene has keyboard focus, use the arrow keys to rotate and Home to reset. Animation respects reduced-motion settings and can be paused manually. If WebGL is unavailable, the scene displays a static fallback and the portfolio remains usable.

App screens are illustrative rather than actual app screenshots. Contact uses the existing LinkedIn profile and telephone number. The placeholder email from the previous site was omitted.

## Publishing

These static files can be deployed directly through the repository's GitHub Pages setup. Keep `app-ads.txt` at the repository root. Local changes are not published until committed and pushed to the Pages source branch.

## Verification

Checked in headless Microsoft Edge at desktop (1440 px) and mobile (390 px): WebGL scene creation, no JavaScript exceptions, no horizontal overflow, internal anchor destinations, mobile menu open/close, motion toggle, keyboard rotation, scene reset, and reduced-motion preference.
