/* Vancouver Car Share Calculator — site-wide config, tracking, navigation, referral bar.
 *
 * EDIT THIS BLOCK ONLY: your promo codes, affiliate links and GA4 ID live here,
 * so you never have to touch the four HTML pages to change them.
 */
var SITE_CONFIG = {
  gaId: 'G-3PN9GDPTX5',                       // <- your GA4 Measurement ID
  evo: {
    code: 'EVOPARTNER920',                    // <- your Evo promo code
    link: 'https://evo.ca/register',          // <- add your referral parameters here if you have them
    offer: 'Free registration ($35 fee waived) + 60 minutes of drive time',
    note: "I'm a student and built this site on my own. Using my code helps both of us: you get the sign-up bonus, and I earn a small referral bonus. Thank you!"   // <- shown next to your code, so visitors know you earn a bonus
  },
  modo: {
    code: '',                                 // <- paste your Modo referral code here. While empty, all Modo code
                                              //    buttons/boxes stay hidden; adding a code brings them back.
    link: 'https://www.modo.coop/get-a-plan',
    offer: 'Join the co-op through a member referral',
    note: "I'm a student and built this site on my own. If you join through my referral, I earn a small credit. Thank you!"
  },
  /* Feedback form. Set ONE of these; while all are empty the form stays hidden.
   *  web3formsKey: your Web3Forms access key. Messages arrive in the inbox you registered there.
   *  endpoint:     any other form-backend URL (e.g. https://formspree.io/f/xxxxxxxx).
   *  email:        fallback. Opens the visitor's email app addressed to you (your address is visible in the page source).
   *  If more than one is set, web3formsKey wins, then endpoint, then email. */
  feedback: {
    web3formsKey: '68e13dfe-f69b-43b4-91b8-d6cca486472f',
    endpoint: '',
    email: ''
  }
};

(function () {
  'use strict';

  /* Folder that contains /assets/, worked out from this script's own URL.
   * This makes every link work whether the site is opened from a folder
   * (file://) or served from GitHub Pages / a custom domain. */
  var BASE = (function () {
    var tag = document.currentScript;
    if (!tag || !tag.src) {
      var all = document.getElementsByTagName('script');
      for (var i = 0; i < all.length; i++) if (/assets\/site\.js/.test(all[i].src)) { tag = all[i]; break; }
    }
    return tag && tag.src ? tag.src.replace(/assets\/site\.js.*$/, '') : '/';
  })();

  /* ---------------------------------------------------------- analytics */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  window.track = function (name, params) {
    try {
      var p = params || {};
      p.page_path = location.pathname;
      window.gtag('event', name, p);
    } catch (e) { /* never let analytics break the page */ }
  };

  if (SITE_CONFIG.gaId && SITE_CONFIG.gaId.indexOf('XXXX') === -1) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(SITE_CONFIG.gaId);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', SITE_CONFIG.gaId);
  }

  /* -------------------------------------------------------- navigation */
  var NAV = [
    { id: 'evo', label: 'Evo', path: 'evo/', dot: '#6BB8E0' },
    { id: 'modo', label: 'Modo', path: 'modo/', dot: '#E31837' },
    { id: 'compare', label: 'Compare', path: 'compare/', dot: 'linear-gradient(90deg,#6BB8E0,#E31837)' }
  ];

  function renderNav() {
    var host = document.getElementById('site-nav');
    if (!host) return;
    var active = document.body.getAttribute('data-page') || '';
    var links = NAV.map(function (n) {
      var on = n.id === active;
      return '<a href="' + BASE + n.path + '" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ' +
        (on ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5') + '">' +
        '<span class="w-2 h-2 rounded-full" style="background:' + n.dot + '"></span>' + n.label + '</a>';
    }).join('');
    host.innerHTML =
      '<nav class="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">' +
        '<a href="' + BASE + 'index.html" class="flex items-center gap-2.5 font-semibold tracking-tight text-white">' +
          '<span class="w-7 h-7 rounded-lg" style="background:linear-gradient(135deg,#6BB8E0,#E31837)"></span>' +
          '<span class="hidden sm:inline">Vancouver Car Share Calculator</span><span class="sm:hidden">VCS Calculator</span>' +
        '</a>' +
        '<div class="flex items-center gap-1">' + links + '</div>' +
      '</nav>';
  }

  /* ------------------------------------------------------ referral bar */
  /* A service only shows code buttons once you have actually set a code for it. */
  function hasCode(key) {
    var c = SITE_CONFIG[key] && SITE_CONFIG[key].code;
    return !!(c && String(c).trim());
  }

  function renderReferralBar() {
    var host = document.getElementById('referral-bar');
    if (!host) return;

    var services = [
      { key: 'evo', name: 'Evo Car Share', color: '#6BB8E0', btnText: '#031018' },
      { key: 'modo', name: 'Modo Co-op', color: '#E31837', btnText: '#ffffff' }
    ].filter(function (s) { return hasCode(s.key); });

    if (!services.length) { host.innerHTML = ''; return; }

    var both = services.length > 1;
    var heading = both ? 'Joining either service? Use a code and skip the fee.'
                       : 'Joining ' + services[0].name.split(' ')[0] + '? Use the code and skip the fee.';
    var border = both ? 'linear-gradient(90deg,rgba(107,184,224,.6),rgba(227,24,55,.6))'
                      : 'linear-gradient(90deg,' + services[0].color + '99,' + services[0].color + '33)';

    host.innerHTML =
      '<div class="max-w-6xl mx-auto px-5">' +
        '<div class="rounded-3xl p-px" style="background:' + border + '">' +
          '<div class="rounded-[23px] bg-[#0b0f19] p-6 md:p-8">' +
            '<p class="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-1">Sign-up bonus' + (both ? 'es' : '') + '</p>' +
            '<h2 class="text-xl md:text-2xl font-semibold mb-6">' + heading + '</h2>' +
            '<div class="grid gap-4' + (both ? ' md:grid-cols-2' : ' max-w-xl') + '">' +
              services.map(function (s) { return card(s.key, s.name, s.color, s.btnText); }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function card(key, name, color, btnText) {
    var c = SITE_CONFIG[key];
    return '<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-4">' +
      '<div><div class="flex items-center gap-2 mb-1"><span class="w-2.5 h-2.5 rounded-full" style="background:' + color + '"></span>' +
      '<span class="font-semibold">' + name + '</span></div>' +
      '<p class="text-sm text-slate-400">' + c.offer + '</p>' +
      (c.note ? '<p class="text-xs mt-2 text-slate-300">' + c.note + '</p>' : '') +
      (key === 'modo' ? '<p class="text-xs mt-2" style="color:#fde68a">Modo is round-trip only: you must return the car to where you picked it up. Need a one-way trip? Use Evo.</p>' : '') +
      (key === 'evo' ? '<p class="text-xs mt-2 text-slate-500">Evo allows one-way trips, ending at approved parking inside its Home Zone.</p>' : '') +
      '</div>' +
      '<div class="flex flex-wrap items-center gap-2">' +
        '<code class="font-mono text-sm px-3 py-2 rounded-lg border border-dashed border-white/20 bg-black/30" style="color:' + color + '" data-code-text="' + key + '"></code>' +
        '<button type="button" data-copy-code="' + key + '" class="text-xs font-semibold px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 transition">Copy code</button>' +
        '<a data-link="' + key + '" target="_blank" rel="noopener" class="text-xs font-semibold px-3 py-2 rounded-lg hover:brightness-110 transition" style="background:' + color + ';color:' + btnText + '">Sign up →</a>' +
      '</div></div>';
  }

  /* -------------------------------------------------- codes & links */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function wireCodesAndLinks() {
    // Remove anything that depends on a code the site doesn't have yet.
    document.querySelectorAll('[data-requires-code]').forEach(function (el) {
      if (!hasCode(el.getAttribute('data-requires-code'))) el.remove();
    });
    document.querySelectorAll('[data-copy-code], [data-code-text]').forEach(function (el) {
      var key = el.getAttribute('data-copy-code') || el.getAttribute('data-code-text');
      if (!hasCode(key)) el.remove();
    });

    document.querySelectorAll('[data-note]').forEach(function (el) {
      var c = SITE_CONFIG[el.getAttribute('data-note')];
      if (c && c.note && hasCode(el.getAttribute('data-note'))) el.textContent = c.note; else el.remove();
    });

    document.querySelectorAll('[data-code-text]').forEach(function (el) {
      el.textContent = SITE_CONFIG[el.getAttribute('data-code-text')].code;
    });
    document.querySelectorAll('[data-link]').forEach(function (el) {
      var key = el.getAttribute('data-link');
      el.setAttribute('href', SITE_CONFIG[key].link);
      el.addEventListener('click', function () { window.track('click_' + key + '_link', { destination: SITE_CONFIG[key].link }); });
    });
    document.querySelectorAll('[data-copy-code]').forEach(function (el) {
      el.addEventListener('click', function () {
        var key = el.getAttribute('data-copy-code');
        var open = el.hasAttribute('data-open-after');
        var original = el.innerHTML;
        copyText(SITE_CONFIG[key].code);
        window.track('copy_' + key + '_code', { open_after: open });
        if (open) {
          window.open(SITE_CONFIG[key].link, '_blank', 'noopener');
          window.track('click_' + key + '_link', { destination: SITE_CONFIG[key].link, via: 'copy_and_open' });
        }
        var label = el.getAttribute('data-copied-label');
        if (label) {
          el.textContent = label;
        } else {
          el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M20 6 9 17l-5-5"/></svg>';
        }
        setTimeout(function () { el.innerHTML = original; }, 1600);
      });
    });
  }

  /* ------------------------------------------------------- evo guides */
  var GUIDES = [
    { path: 'evo/rates/', label: 'Evo rates', blurb: 'Per-minute, hourly, daily and multi-day prices, fees and tax.' },
    { path: 'evo/airport/', label: 'Evo to YVR', blurb: 'The $5 drop-off fee, where to park, and what a trip costs.' },
    { path: 'evo/victoria/', label: 'Evo Victoria', blurb: 'The Victoria and Langford Home Zone, and a trip calculator.' },
    { path: 'evo/nanaimo/', label: 'Evo Nanaimo', blurb: 'Evo Return at the Hullo ferry terminal, round trips only.' }
  ];

  function renderGuides() {
    var host = document.getElementById('evo-guides');
    if (host) {
      host.innerHTML =
        '<div class="max-w-6xl mx-auto px-5"><div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">' +
          '<h2 class="text-xl font-semibold mb-1">Evo guides</h2>' +
          '<p class="text-sm text-slate-400 mb-5">Rates, airport trips and the other places Evo runs.</p>' +
          '<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">' +
          GUIDES.map(function (g) {
            return '<a href="' + BASE + g.path + '" class="block rounded-xl border border-white/10 bg-black/30 p-4 hover:border-white/30 transition">' +
              '<span class="block font-semibold text-sm mb-1">' + g.label + ' →</span>' +
              '<span class="block text-xs text-slate-400">' + g.blurb + '</span></a>';
          }).join('') +
          '</div></div></div>';
    }
    document.querySelectorAll('footer').forEach(function (f) {
      var nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'Site guides');
      nav.className = 'mb-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-400';
      nav.innerHTML = GUIDES.map(function (g) { return '<a class="hover:text-white underline underline-offset-2" href="' + BASE + g.path + '">' + g.label + '</a>'; }).join('');
      f.insertBefore(nav, f.firstChild);
    });
  }

  /* ------------------------------------------------------------ feedback */
  function renderFeedback() {
    var host = document.getElementById('feedback');
    if (!host) return;
    var fb = SITE_CONFIG.feedback || {};
    var w3key = fb.web3formsKey && String(fb.web3formsKey).trim();
    var endpoint = w3key ? 'https://api.web3forms.com/submit' : (fb.endpoint && String(fb.endpoint).trim());
    var email = fb.email && String(fb.email).trim();
    if (!endpoint && !email) { host.innerHTML = ''; return; }

    var field = 'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30';
    host.innerHTML =
      '<div class="max-w-6xl mx-auto px-5"><div class="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">' +
        '<h2 class="text-xl font-semibold mb-1">Help improve this site</h2>' +
        '<p class="text-sm text-slate-400 mb-5">Spot a wrong price? Want a feature, a different comparison, or something changed? Tell me.</p>' +
        '<form id="fbForm" novalidate>' +
          '<div class="grid gap-3">' +
            '<label class="text-xs font-semibold text-slate-400">What kind of feedback?' +
              '<select id="fbType" class="' + field + ' mt-1.5">' +
                '<option value="Suggestion: add something">Add something new</option>' +
                '<option value="Suggestion: change something">Change or improve something</option>' +
                '<option value="Problem: wrong price or rate">A price or rate looks wrong</option>' +
                '<option value="Problem: bug or display issue">Bug or display issue</option>' +
                '<option value="Other">Something else</option>' +
              '</select></label>' +
            '<label class="text-xs font-semibold text-slate-400">Your message' +
              '<textarea id="fbMsg" rows="4" maxlength="2000" required placeholder="What should I add, fix or change?" class="' + field + ' mt-1.5"></textarea></label>' +
            '<label class="text-xs font-semibold text-slate-400">Your email <span class="font-normal text-slate-500">(optional, only if you want a reply)</span>' +
              '<input id="fbEmail" type="email" maxlength="200" autocomplete="email" class="' + field + ' mt-1.5"></label>' +
            '<input id="fbTrap" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0">' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-3 mt-4">' +
            '<button id="fbSend" type="submit" class="text-sm font-semibold px-5 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 transition">Send feedback</button>' +
            '<span id="fbStatus" class="text-sm" role="status" aria-live="polite"></span>' +
          '</div>' +
        '</form>' +
      '</div></div>';

    var form = document.getElementById('fbForm'), status = document.getElementById('fbStatus'), btn = document.getElementById('fbSend');
    function say(msg, ok) { status.textContent = msg; status.style.color = ok ? '#86efac' : '#fca5a5'; }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = document.getElementById('fbMsg').value.trim();
      var type = document.getElementById('fbType').value;
      var from = document.getElementById('fbEmail').value.trim();
      if (document.getElementById('fbTrap').value) return;            // bot filled the hidden field
      if (msg.length < 5) { say('Please write a few words first.', false); return; }
      if (from && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(from)) { say('That email address does not look right.', false); return; }

      var page = location.pathname || '/';
      window.track('submit_feedback', { feedback_type: type });          // type only, never the message text

      if (endpoint) {
        btn.disabled = true; say('Sending...', true);
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(w3key
            ? { access_key: w3key, subject: 'Site feedback: ' + type, from_name: 'vancouvercarsharecalculator.com', email: from, message: msg + '\n\nType: ' + type + '\nPage: ' + page, botcheck: '' }
            : { type: type, message: msg, email: from, page: page, _subject: 'Site feedback: ' + type })
        }).then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || j.success === false) throw new Error('bad status');
            form.reset(); say('Thank you! Your feedback was sent.', true);
          });
        }).catch(function () {
          say('Sorry, that did not send. Please try again in a moment.', false);
        }).then(function () { btn.disabled = false; });
      } else {
        var body = msg + '\n\n---\nType: ' + type + (from ? '\nReply to: ' + from : '') + '\nPage: ' + page;
        window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Site feedback: ' + type) + '&body=' + encodeURIComponent(body.slice(0, 1800));
        say('Your email app should open with the message ready to send.', true);
      }
    });
  }

  function init() {
    renderNav();
    renderGuides();
    renderFeedback();
    renderReferralBar();
    wireCodesAndLinks();
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
