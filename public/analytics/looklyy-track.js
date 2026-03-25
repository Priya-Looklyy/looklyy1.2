/**
 * Looklyy lightweight visitor tracker — non-blocking, defer-loaded.
 * Add: <script src="/analytics/looklyy-track.js" defer></script>
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'looklyy_visitor_id_v2';
  var GEO_ENDPOINT = 'https://ipapi.co/json/';
  var DEFAULT_TRACK_URL = '/track';

  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function scheduleIdle(fn) {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(fn, { timeout: 3000 });
    } else {
      setTimeout(fn, 1);
    }
  }

  function getVisitorState() {
    var existing = null;
    try {
      existing = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* private mode */
    }
    var isUnique = !existing;
    var visitorId = existing || uuid();
    if (isUnique) {
      try {
        localStorage.setItem(STORAGE_KEY, visitorId);
      } catch (e) {
        /* ignore */
      }
    }
    return { visitorId: visitorId, isUnique: isUnique };
  }

  function TimeMeter() {
    this._visibleStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._totalMs = 0;
    this._hidden = false;
  }

  TimeMeter.prototype._now = function () {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  };

  TimeMeter.prototype.onVisibilityChange = function () {
    var now = this._now();
    if (document.visibilityState === 'hidden') {
      if (!this._hidden) {
        this._totalMs += now - this._visibleStart;
        this._hidden = true;
      }
    } else {
      this._visibleStart = now;
      this._hidden = false;
    }
  };

  TimeMeter.prototype.seconds = function () {
    var now = this._now();
    var extra = !this._hidden ? now - this._visibleStart : 0;
    return Math.max(0, Math.round((this._totalMs + extra) / 1000));
  };

  function fetchGeo() {
    return fetch(GEO_ENDPOINT, { credentials: 'omit', cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .catch(function () {
        return null;
      });
  }

  function buildPayload(state, meter, geo, formFilled, visitStartedAt, sessionId) {
    var country = geo && (geo.country_name || geo.country) ? String(geo.country_name || geo.country) : null;
    var city = geo && geo.city ? String(geo.city) : null;
    var ip = geo && geo.ip ? String(geo.ip) : null;
    return {
      visitorId: state.visitorId,
      sessionId: sessionId,
      isUnique: state.isUnique,
      timestamp: visitStartedAt,
      timeSpent: meter.seconds(),
      formFilled: !!formFilled,
      location: { country: country, city: city },
      ip: ip,
      pageUrl: typeof location !== 'undefined' ? location.href : '',
    };
  }

  function sendTrack(url, payload, useBeacon) {
    var body = JSON.stringify(payload);
    if (useBeacon && typeof navigator.sendBeacon === 'function') {
      var blob = new Blob([body], { type: 'application/json' });
      return navigator.sendBeacon(url, blob);
    }
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      keepalive: true,
      credentials: 'same-origin',
    }).catch(function () {});
  }

  function init(options) {
    options = options || {};
    var trackUrl = (options.trackUrl || DEFAULT_TRACK_URL).replace(/\/$/, '');
    if (trackUrl.indexOf('http') !== 0) {
      trackUrl = (typeof location !== 'undefined' ? location.origin : '') + (trackUrl.indexOf('/') === 0 ? '' : '/') + trackUrl;
    }

    var state = getVisitorState();
    var sessionId = uuid();
    var meter = new TimeMeter();
    var visitStartedAt = new Date().toISOString();
    var formFilled = false;
    var geoCache = null;
    var sent = false;
    var pendingUrl = trackUrl;

    function flush(useBeacon) {
      if (sent) return;
      sent = true;
      var payload = buildPayload(state, meter, geoCache, formFilled, visitStartedAt, sessionId);
      sendTrack(pendingUrl, payload, useBeacon);
    }

    document.addEventListener('visibilitychange', function () {
      meter.onVisibilityChange();
    });

    window.addEventListener('pagehide', function () {
      flush(true);
    });

    window.addEventListener('beforeunload', function () {
      flush(true);
    });

    document.addEventListener(
      'submit',
      function () {
        formFilled = true;
      },
      true,
    );

    scheduleIdle(function () {
      fetchGeo().then(function (g) {
        geoCache = g;
      });
    });

    return {
      flush: function () {
        flush(false);
      },
      getPayload: function () {
        return buildPayload(state, meter, geoCache, formFilled, visitStartedAt, sessionId);
      },
    };
  }

  var auto = typeof document !== 'undefined' && document.currentScript;
  var optTrack = auto && auto.getAttribute('data-track-url');
  init(optTrack ? { trackUrl: optTrack } : {});

  if (typeof window !== 'undefined') {
    window.LooklyyTrack = { init: init };
  }
})();
