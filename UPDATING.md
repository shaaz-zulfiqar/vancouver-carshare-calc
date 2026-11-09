# Updating the site

## Rates changed (Evo or Modo)
1. Edit the numbers at the top of `assets/pricing.js` (EVO, MODO, PVRT, TAX_RATE).
2. Re-check them against evo.ca/Rates and modo.coop/plans.
3. ONLY THEN change `ratesReviewed` in `assets/site.js` (for example `'January 2027'`).
   Every page footer reads "Rates last reviewed ..." from that one value. If you have not re-checked the
   rates, leave it alone, so the site never claims a check that did not happen.

## New year (2027)
The year in page titles, descriptions and hero badges is plain text, so search engines can read it.
It does not change the "rates last reviewed" date. To roll it over, search the folder for `2026` and update it
on purpose (titles, meta descriptions, og/twitter tags, hero badges, the sitemap). Keep titles at 60 characters or fewer and
descriptions at 155 or fewer. Then bump `<lastmod>` in `sitemap.xml` for the pages you changed.

## Promo code or link changed
Only edit `SITE_CONFIG.evo` in `assets/site.js` (`code`, `link`, `disclosure`). Every page, the dropdown line, the offer strip,
the pinned code reminder and the /evo/promo-code/ page update automatically.

## Modo Day Tripper assumption
`MODO.dayTripperMinHours` (in `assets/pricing.js`) is 24. Modo says the Day Tripper is for "whole-day bookings" but does not
publish a minimum length. If Modo confirms a shorter minimum, change that one number.

## Measuring referrals
GA4 events: `copy_evo_code` (code reached the clipboard), `copy_evo_code_failed`, `click_evo_link` (opened Evo sign-up).
Each carries `placement` (strip, promo_page, reminder) and `page_path`. A copy or click is NOT an approved referral:
compare these against the referrals shown in your Evo affiliate reporting.

## Styles (Tailwind)
The site uses a compiled stylesheet, `assets/tailwind.css`, instead of Tailwind's development CDN. If you add or change
CSS classes in any page or in `assets/*.js`, rebuild it from this folder:

    npx tailwindcss@3.4.17 -c tailwind.config.js -i src/input.css -o assets/tailwind.css --minify

A class that isn't in the compiled file simply won't style until you rebuild. Text-only edits need no rebuild.

## The "Current offers" box on the home page
It says "Checked against the official Evo and Modo sites on <date>". That date is typed by hand in `index.html`.
Update it only after you have really re-checked those offers.
