/* Keep intentional operator checks out of player traffic reports. */
(function () {
  var marker = 'fruit-stand-analytics-qa';
  var onTestUrl = new URLSearchParams(window.location.search).has('analytics_test');
  var inTestSession = onTestUrl;

  try {
    if (onTestUrl) window.sessionStorage.setItem(marker, '1');
    inTestSession = inTestSession || window.sessionStorage.getItem(marker) === '1';
  } catch (_) {
    // Storage can be disabled; the current test URL is still excluded.
  }

  window.fsbAnalyticsBeforeSend = function (_type, payload) {
    return inTestSession ? false : payload;
  };
}());
