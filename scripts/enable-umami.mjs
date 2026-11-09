// Run once after creating the official site's Umami website. The website ID is public.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const websiteId = process.argv[2];
if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(websiteId || '')) {
  console.error('Usage: node scripts/enable-umami.mjs <website-uuid>');
  process.exit(1);
}

const root = resolve(import.meta.dirname, '..');
const htmlFiles = [];
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (entry.name === 'index.html') htmlFiles.push(path);
  }
}
collect(root);

let marked = 0;
for (const path of htmlFiles) {
  let html = readFileSync(path, 'utf8');
  const script = `<script defer src="https://cloud.umami.is/script.js" data-website-id="${websiteId}"></script>`;
  if (html.includes('data-website-id=')) {
    html = html.replace(/<script defer src="https:\/\/cloud\.umami\.is\/script\.js" data-website-id="[0-9a-f-]+"><\/script>/i, script);
  } else {
    html = html.replace('</head>', `  ${script}\n</head>`);
  }
  html = html.replace(/<a\b[^>]*>/gi, tag => {
    if (tag.includes('data-umami-event=')) return tag;
    const href = tag.match(/\bhref="([^"]+)"/i)?.[1] || '';
    const event = href.includes('play.google.com/store/apps/details?id=com.veralearn.zxx.fruitstandbattle')
      ? 'google_play_click'
      : href.includes('apps.apple.com/') && href.includes('id6797271636')
        ? 'app_store_click'
        : null;
    if (!event) return tag;
    marked++;
    return tag.replace(/>$/, ` data-umami-event="${event}">`);
  });
  writeFileSync(path, html);
}
console.log(`Enabled Umami on ${htmlFiles.length} pages; marked ${marked} store links`);
