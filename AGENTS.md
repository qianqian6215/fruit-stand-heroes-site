# Official website maintenance

- `index.html` loads generated `site.js` and `site.css`. Edit `content.js`, `home.js`, `i18n.js`, `style.css`, `home.css`, `i18n.css`, and `locales/en.json` as the sources. Run `node scripts/build-site.mjs` and commit the regenerated bundles after changing these sources. Bump the `site.js` / `site.css` query version in `index.html` when publishing changed bundles.
- Keep `CNAME` as `fruitstandbattle.com`. HTTPS was verified and enabled on 2026-10-07; do not repeat the earlier pre-certificate rollback.
- The user removed video download features. Do not restore direct video/download links or HD download buttons. Keep `controlslist="nodownload"` and `preload="none"` on videos. Original media files remain for released-game compatibility.
- Preserve the selected artwork, story order (Grape, Dew, Peach), `#watch` concert entry, App Store and Google Play links, and all 12 locales.
- App Store identity is `6797271636` / `com.veralearn.zxx.fruitstandbattle`. Verify actual storefront availability and redirects; an HTTP 200 or a correct app ID alone does not prove the visitor reaches the game.
