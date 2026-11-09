/* Vancouver Car Share Calculator — site-wide config, tracking, navigation, referral bar.
 *
 * EDIT THIS BLOCK ONLY: your promo codes, affiliate links and GA4 ID live here,
 * so you never have to touch the four HTML pages to change them.
 */
var SITE_CONFIG = {
  gaId: 'G-3PN9GDPTX5',                       // <- your GA4 Measurement ID
  /* Shown in every page footer as "Rates last reviewed ...". Change it ONLY after you have actually re-checked
   * the published Evo and Modo rates. Changing the year in page titles does not change this. */
  ratesReviewed: 'November 2026',
  evo: {
    code: 'EVOPARTNER920',                    // <- your Evo promo code
    link: 'https://evo.ca/register',          // <- add your referral parameters here if you have them
    offer: 'Free registration ($35 fee waived) + 60 minutes of drive time',
    note: "I'm a student and built this site on my own. Using my code helps both of us: you get the sign-up bonus, and I earn a small referral bonus. Thank you!",   // <- shown in the big sign-up box on the home and compare pages
    disclosure: 'Independent calculator. I may earn a referral bonus if you join with this code.',   // <- short line shown next to the offer strip
    promoPath: 'evo/promo-code/'
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

  var EVO_MENU = [
    { path: 'evo/', label: 'Evo calculator' },
    { path: 'evo/rates/', label: 'Evo rates' },
    { path: 'evo/airport/', label: 'Evo to YVR airport' },
    { path: 'evo/victoria/', label: 'Evo Victoria' },
    { path: 'evo/nanaimo/', label: 'Evo Nanaimo' }
  ];

  function renderNav() {
    var host = document.getElementById('site-nav');
    if (!host) return;
    var active = document.body.getAttribute('data-page') || '';
    var linkCls = function (on) {
      return 'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition ' +
        (on ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5');
    };
    var links = NAV.map(function (n) {
      var on = n.id === active;
      var a = '<a data-top href="' + BASE + n.path + '" class="' + linkCls(on) + '">' +
        '<span class="w-2 h-2 rounded-full" style="background:' + n.dot + '"></span>' + n.label + '</a>';
      if (n.id !== 'evo') return a;
      // Evo gets a dropdown: hover (desktop), tap the arrow (phones), or keyboard.
      var offerLine = hasCode('evo')
        ? '<a role="menuitem" data-offer-line href="' + BASE + SITE_CONFIG.evo.promoPath + '" class="block whitespace-nowrap mx-2 mb-1 px-3 py-2 rounded-lg text-sm font-semibold text-[#A8DAF3] bg-[#6BB8E0]/10 hover:bg-[#6BB8E0]/20">Free registration + 60 min <span aria-hidden="true">→</span></a>' : '';
      var items = EVO_MENU.map(function (m) {
        return '<a role="menuitem" href="' + BASE + m.path + '" class="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5">' + m.label + '</a>';
      }).join('');
      return '<div id="evoDrop" class="relative flex items-center">' + a +
        '<button type="button" id="evoDropBtn" aria-haspopup="true" aria-expanded="false" aria-label="Evo pages" class="px-1.5 py-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z"/></svg></button>' +
        '<div id="evoMenu" role="menu" style="display:none" class="absolute left-0 top-full pt-2 z-50 min-w-[14rem]">' +
          '<div class="rounded-xl border border-white/10 bg-[#0b0f19] py-2 shadow-xl">' + offerLine + items + '</div></div></div>';
    }).join('');
    host.innerHTML =
      '<nav class="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">' +
        '<a data-top href="' + BASE + '" aria-label="Vancouver Car Share Calculator home" class="flex items-center gap-2.5 font-semibold tracking-tight text-white shrink-0">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-7 h-7 shrink-0" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#1d1d20"/><polygon fill="#14D5F5" points="37,62 146.6,62 256,323.2 202.5,450.8"/><polygon fill="#C8102E" points="366.3,62 474.9,62 312.9,450.8 202.5,450.8"/><line x1="421.5" y1="76" x2="257.7" y2="439" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-dasharray="30 42"/></svg>' +
          '<span class="hidden md:inline">Vancouver Car Share Calculator</span><span class="hidden min-[430px]:inline md:hidden">VCS Calculator</span>' +
        '</a>' +
        '<div class="flex items-center gap-1">' + links + '</div>' +
      '</nav>';

    var drop = document.getElementById('evoDrop'), btn = document.getElementById('evoDropBtn'), menu = document.getElementById('evoMenu');
    var open = false, timer = null, byHover = false;
    var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    function set(v) {
      open = v; if (!v) byHover = false;
      menu.style.display = v ? 'block' : 'none'; btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    }
    if (canHover) {   // phones and tablets have no hover, so they only use the tap below
      drop.addEventListener('mouseenter', function () { clearTimeout(timer); if (!open) { set(true); byHover = true; } });
      drop.addEventListener('mouseleave', function () { timer = setTimeout(function () { set(false); }, 150); });
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (open && byHover) { byHover = false; return; }   // a click on the arrow while hover-opened keeps it open
      set(!open);
    });
    document.addEventListener('click', function (e) { if (open && !drop.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { set(false); btn.focus(); } });
    drop.addEventListener('focusout', function (e) { if (open && !drop.contains(e.relatedTarget)) set(false); });
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
  /* Resolves true only if the code really reached the clipboard. */
  function copyText(text) {
    return new Promise(function (resolve) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { resolve(true); }, function () { resolve(fallbackCopy(text)); });
      } else resolve(fallbackCopy(text));
    });
  }
  function fallbackCopy(text) {
    var ok = false, ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.left = '0'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    try { ta.focus(); ta.select(); ta.setSelectionRange(0, text.length); ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return !!ok;
  }
  function selectCodeText(key) {
    var el = document.querySelector('[data-code-text="' + key + '"]');
    if (!el || !window.getSelection) return;
    var r = document.createRange(); r.selectNodeContents(el);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }

  /* ---------------------------------------------------- offer strip */
  /* Compact Evo offer shown on the Evo pages. The big version lives on /evo/promo-code/. */
  function renderOfferStrip() {
    var host = document.getElementById('offer-strip');
    if (!host) return;
    if (!hasCode('evo')) { host.innerHTML = ''; return; }
    var c = SITE_CONFIG.evo;
    var copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4 h-4"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
    var onPromoPage = document.body.getAttribute('data-page') === 'promo';
    host.innerHTML =
      '<div class="rounded-2xl p-px" style="background:linear-gradient(90deg,rgba(107,184,224,.6),rgba(107,184,224,.12))">' +
        '<div class="rounded-[15px] px-4 py-3.5 md:px-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-5" style="background:#0c161d">' +
          '<div class="min-w-0 flex-1">' +
            '<p class="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6BB8E0]">✦ New member offer</p>' +
            '<p class="font-semibold text-base md:text-lg leading-snug">Free registration <span class="text-slate-400 font-normal text-sm">($35 fee waived)</span> + 60 minutes</p>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2">' +
            '<span class="inline-flex items-center gap-1 rounded-lg border border-dashed border-[#6BB8E0]/50 bg-black/50 pl-3 pr-1 py-1">' +
              '<code class="font-mono text-base text-[#A8DAF3] tracking-wide" data-code-text="evo"></code>' +
              '<button type="button" data-copy-code="evo" data-placement="strip" aria-label="Copy promo code" class="text-slate-300 hover:text-[#6BB8E0] transition p-2">' + copyIcon + '</button>' +
            '</span>' +
            '<button type="button" data-copy-code="evo" data-open-after data-placement="strip" data-copied-label="Copied, opening…" class="font-semibold text-sm px-4 py-2.5 rounded-xl text-black hover:brightness-110 transition" style="background:linear-gradient(90deg,#3C9ACF,#A8DAF3)">Copy code + sign up</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<p class="text-xs text-slate-500 mt-2 px-1">Enter the code in the “Promo Code” field on the “Promos &amp; Savings” page of the Evo app. ' + c.disclosure +
        (onPromoPage ? '' : ' <a class="underline underline-offset-2 text-slate-400 hover:text-white" href="' + BASE + c.promoPath + '">Offer details</a>') + '</p>';
  }

  /* ------------------------------------------- code reminder (mobile) */
  /* Evo's sign-up opens in another tab, so the code can't follow the visitor there. This bar stays on our pages
   * after they click, so the code is one tap away when they come back, and it survives page changes. */
  function reminderSet(v) { try { if (v) sessionStorage.setItem('codeReminder', '1'); else sessionStorage.removeItem('codeReminder'); } catch (e) {} }
  function reminderOn() { try { return sessionStorage.getItem('codeReminder') === '1'; } catch (e) { return false; } }
  function showReminder() {
    if (!hasCode('evo') || document.getElementById('codeReminder')) return;
    var bar = document.createElement('div');
    bar.id = 'codeReminder'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Your Evo promo code');
    bar.className = 'fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pt-2';
    bar.innerHTML =
      '<div class="max-w-xl mx-auto rounded-2xl border border-[#6BB8E0]/40 shadow-2xl px-3 py-2.5" style="background:#0c161d">' +
        '<p id="codeReminderNote" class="text-[11px] text-slate-400 leading-tight mb-1.5">Paste in “Promo Code” on the “Promos &amp; Savings” page</p>' +
        '<div class="flex items-center gap-2">' +
          '<code class="font-mono text-base text-[#A8DAF3] tracking-wide mr-auto" style="user-select:all;-webkit-user-select:all" data-code-text="evo"></code>' +
          '<button type="button" data-copy-code="evo" data-placement="reminder" data-copied-label="Copied" class="text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 hover:bg-white/5 whitespace-nowrap">Copy</button>' +
          '<a data-link="evo" data-placement="reminder" target="_blank" rel="noopener" class="text-sm font-semibold px-3 py-2 rounded-xl text-black whitespace-nowrap" style="background:linear-gradient(90deg,#3C9ACF,#A8DAF3)">Sign up</a>' +
          '<button type="button" id="codeReminderClose" aria-label="Dismiss" class="text-slate-400 hover:text-white px-2 py-1 text-xl leading-none">×</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);
    document.body.style.paddingBottom = '6rem';
    document.getElementById('codeReminderClose').addEventListener('click', function () {
      reminderSet(false); bar.remove(); document.body.style.paddingBottom = '';
    });
    wireCodesAndLinks(bar);
  }
  var REMINDER_DEFAULT = 'Paste in “Promo Code” on the “Promos & Savings” page';
  /* Shows a message in the pinned bar. Used when a copy fails or the browser blocks the sign-up tab. */
  function reminderNote(msg) {
    var n = document.getElementById('codeReminderNote');
    if (!n) return;
    n.textContent = msg || REMINDER_DEFAULT;
    n.style.color = msg ? '#fde68a' : ''; n.style.fontWeight = msg ? '600' : '';
    n.style.fontSize = msg ? '12px' : '';
  }
  function restoreReminder() { if (reminderOn()) showReminder(); }

  function wireCodesAndLinks(scope) {
    var root = scope || document;
    var fresh = !scope;
    if (fresh) {
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
    }

    root.querySelectorAll('[data-code-text]').forEach(function (el) {
      el.textContent = SITE_CONFIG[el.getAttribute('data-code-text')].code;
    });
    root.querySelectorAll('[data-link]').forEach(function (el) {
      var key = el.getAttribute('data-link');
      el.setAttribute('href', SITE_CONFIG[key].link);
      el.addEventListener('click', function () {
        window.track('click_' + key + '_link', { destination: SITE_CONFIG[key].link, placement: el.getAttribute('data-placement') || 'page' });
        reminderSet(true); showReminder();
      });
    });
    root.querySelectorAll('[data-copy-code]').forEach(function (el) {
      el.addEventListener('click', function () {
        var key = el.getAttribute('data-copy-code');
        var open = el.hasAttribute('data-open-after');
        var placement = el.getAttribute('data-placement') || 'page';
        var original = el.innerHTML;
        var label = el.getAttribute('data-copied-label');

        // Start the copy and open the sign-up tab in the same tap, so phones don't block the new tab.
        var blocked = false;
        var pending = copyText(SITE_CONFIG[key].code);
        if (open) {
          // No 'noopener' feature here: it makes window.open return null even on success, which would hide real blocks.
          // The opener link is cut manually instead.
          var w = window.open(SITE_CONFIG[key].link, '_blank');
          if (w) { try { w.opener = null; } catch (e) {} }
          window.track('click_' + key + '_link', { destination: SITE_CONFIG[key].link, via: 'copy_and_open', placement: placement, popup_blocked: !w });
          if (!w) blocked = true;
        }
        if (key === 'evo') { reminderSet(true); showReminder(); if (blocked) reminderNote('Your browser blocked the Evo tab. Tap “Sign up” below.'); }

        pending.then(function (ok) {
          // A copied code and an approved sign-up are different things: this event only means the code reached the clipboard.
          window.track(ok ? 'copy_' + key + '_code' : 'copy_' + key + '_code_failed', { open_after: open, placement: placement });
          if (ok) {
            if (label) el.textContent = label;
            else el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M20 6 9 17l-5-5"/></svg>';
          } else {
            selectCodeText(key);   // leave the code highlighted so the visitor can copy it by hand
            el.textContent = 'Select code and copy';
            if (key === 'evo') reminderNote('Copy did not work. Press and hold the code below, then choose Copy.');
          }
          setTimeout(function () { el.innerHTML = original; }, ok ? 1600 : 3500);
        });
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
      var links = GUIDES.slice();
      if (hasCode('evo')) links.push({ path: SITE_CONFIG.evo.promoPath, label: 'Evo promo code' });
      nav.innerHTML = links.map(function (g) { return '<a class="hover:text-white underline underline-offset-2" href="' + BASE + g.path + '">' + g.label + '</a>'; }).join('');
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
    renderOfferStrip();
    wireCodesAndLinks();
    restoreReminder();
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
    document.querySelectorAll('[data-reviewed]').forEach(function (el) { el.textContent = SITE_CONFIG.ratesReviewed; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
