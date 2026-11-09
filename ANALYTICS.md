# Website measurement

The official site uses Umami Cloud Hobby to count page views and store-link clicks. The game app does not use this tracker. The public privacy policy explains website collection separately from the app.

After creating the `fruitstandbattle.com` website in Umami, run:

```sh
node scripts/enable-umami.mjs <website-uuid>
node scripts/build-site.mjs
```

The installer adds the tracker to every HTML page and marks only links to this game's App Store and Google Play listings. It can be rerun with the same or a replacement website ID. Umami records page views automatically; `google_play_click` and `app_store_click` are separate events. Use the event's page path to compare a page's store clicks with that page's views for the same time window. This is an outbound click rate, not a store visit or completed install rate. Count test visits separately from real traffic.

Check the live site, then confirm that one test page view and one test store click appear in Umami's real-time dashboard. Do not report website traffic before the tracker is live and the dashboard has received events. The Hobby plan has no API access, so the dashboard is the measurement source.
