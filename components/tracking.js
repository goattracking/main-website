// Central tracking loader for Goat Tracking
// - Ensures dataLayer exists
// - Adds event_id to all pushed objects
// - Loads custom endpoints (abc.goattracking.com, tg.goattracking.com)
// - Fires an initial page_view
// - Injects Microsoft Clarity

(function () {
  // 1) Ensure dataLayer exists
  var w = window;
  w.dataLayer = w.dataLayer || [];

  // 2) UUID generator
  function makeId() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }
    } catch (e) {}
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  // 3) Stamp any queued items
  try {
    w.dataLayer.forEach(function (item) {
      if (item && typeof item === 'object' && !item.event_id && !item.eventID) {
        item.event_id = makeId();
      }
    });
  } catch (e) {}

  // 4) Monkey‑patch dataLayer.push
  try {
    var origPush = w.dataLayer.push;
    w.dataLayer.push = function () {
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
          if (!arg.event_id && !arg.eventID) arg.event_id = makeId();
        }
      }
      return origPush.apply(w.dataLayer, arguments);
    };
  } catch (e) {}

  // 5) Helper to load external scripts once
  function loadScriptOnce(src, id) {
    if (id && document.getElementById(id)) return;
    var exists = Array.prototype.some.call(document.getElementsByTagName('script'), function (s) {
      return s.src === src;
    });
    if (exists) return;
    var s = document.createElement('script');
    if (id) s.id = id;
    s.async = true;
    s.src = src;
    var f = document.getElementsByTagName('script')[0];
    f.parentNode.insertBefore(s, f);
  }

  // 6) Load custom endpoints (mirrors provided snippets)
  loadScriptOnce('https://abc.goattracking.com/db.js', 'gt-loader-abc');
  loadScriptOnce('https://tg.goattracking.com/db.js', 'gt-loader-tg');

  // 7) Fire initial page_view (after loaders queued)
  try {
    w.dataLayer.push({ event: 'page_view' });
  } catch (e) {}

  // 8) Microsoft Clarity
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    if (document.getElementById('clarity-tag')) return; // prevent double insert
    t = l.createElement(r); t.id = 'clarity-tag'; t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'gq9io6nusi');
})();


