# Quality assurance

Tested on 25 November 2026 against the local production build.

| Check | Result |
| --- | --- |
| Astro type check | 0 errors, warnings or hints |
| Clean source ZIP rebuild | npm ci, type check, production build and generated page checks passed after extracting the ZIP into a fresh directory |
| Static production build | 12 HTML pages including a custom 404, plus sitemap and supporting files |
| Generated HTML and assets | 11 canonical pages, distinct titles and descriptions, sitemap, JSON-LD, internal links, anchors, fonts, favicon, social image and security rules verified |
| Responsive browser checks | 44 page visits at 1440, 768, 390 and 320 pixels. No horizontal overflow in final runs |
| Automated axe accessibility | 22 desktop and mobile checks across all canonical pages. Zero violations in the selected WCAG 2.2 AA ruleset |
| Keyboard and reduced motion | Skip link, mobile menu, navigation and reduced-motion paths passed |
| Local Cloudflare Pages runtime | Security headers applied, assets served with HTTP 200, unknown path returned HTTP 404 and the 44 responsive browser visits passed again |
| Custom 404 | Unexpected route returned HTTP 404 with the expected page and noindex metadata |
| Contact | External contact links present. Form delivery and Turnstile are outside this static build |
| External links | SupplyCorridor, founder site, GitHub and SSRN responded successfully over HTTPS. The research title and author matched SSRN. LinkedIn restricted automated checks |
| Credential checks | Generated HTML and tracked project files checked for common credential patterns |
| Corporate disclosures | Verified legal name, company number, incorporation and registered office against Companies House |

## Homepage Lighthouse 13.6.0

| Mode | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 96 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Automated accessibility results cover the checks run. Production HTTPS, DNS, redirects, and delivery must be checked against the deployed site.

## Publication review

- Founder review covers the Privacy Policy, Terms of Use and Cookie Policy before public publication.
- Companies House listed an overdue confirmation statement and an active proposal to strike off on 25 November 2026. The filing history includes a first Gazette notice dated 17 November 2026. [Company record](https://find-and-update.company-information.service.gov.uk/company/15894361) · [Filing history](https://find-and-update.company-information.service.gov.uk/company/15894361/filing-history)
- Planned SupplyCorridor features are described as proposals. The site includes the founder’s existing SSRN publication and editorial topics for future writing.

## Rotating homepage globe

The updated globe passed desktop and 320px mobile browser checks for rotation, keyboard and pointer controls, viewport pause and resume, reduced motion and the JavaScript-free illustration. Automated accessibility checks passed. Local Cloudflare Pages mobile Lighthouse scored 100 in all four categories.

## Global trade map update

Verified a full 360-degree mouse drag, touch and keyboard rotation, automatic resumption after release, market selection, reduced motion, the 320px layout and the static illustration. The market selector contains 29 agreement partners and 10 additional markets. Automated accessibility checks passed, including the expanded sources links. The new founder link reached the existing personal website. The SVG and 1024px PNG download headers and file contents were verified locally.

## Cloudflare Pages production

All 11 canonical pages returned HTTP 200 with the expected canonical URLs on `moon-commerce-limited.pages.dev`. An unknown path returned HTTP 404. Both logo formats returned the expected attachment headers. The custom domains require separate HTTPS, redirect and public DNS checks after the GoDaddy nameserver change. [Production Pages site](https://moon-commerce-limited.pages.dev/)
