// Keep both stores available while putting the visitor's store first.
if (/Android/i.test(navigator.userAgent)) {
  document.querySelectorAll('.store-actions').forEach((group) => {
    const play = group.querySelector('a[data-umami-event="google_play_click"]');
    const appStore = group.querySelector('a[data-umami-event="app_store_click"]');
    if (play && appStore) group.insertBefore(play, appStore);
  });
}
