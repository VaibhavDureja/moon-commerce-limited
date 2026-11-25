# Moon Commerce Limited

Corporate website for Moon Commerce, built with Astro, TypeScript and CSS. The site compiles to static HTML and assets for Cloudflare Pages.

## Local development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Production checks

```sh
npm run check
npm run build
npm test
npm run preview
```

The build writes to `dist/`. Preview serves that output locally. The test checks generated routes, internal links and assets, canonical URLs, metadata, sitemap, organisation data and accidental credential patterns.

## Source and content

- `src/pages/` contains the main site and corporate and policy pages.
- `src/content/site.ts` holds verified company details, founder links, navigation and structured organisation data.
- `src/layouts/BaseLayout.astro` provides shared navigation, footer and search and sharing metadata.
- `public/brand/` contains the orbital monogram, wordmark, favicon and Apple touch icon. The light wordmark is for dark surfaces and the dark wordmark is for light surfaces.
- `public/images/` contains the 1200 × 630 social image and focus illustrations.
- `scripts/make-artwork.mjs` generates editable SVG artwork. Its geographical source is Natural Earth’s public-domain 1:110m land data, vendored under `scripts/data/`. [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/)

Verify corporate disclosures against Companies House when they change. Rebuild after changing copy, logos, paths or the calendar-year footer. Update sitemap and navigation together with any new public route.

## Contact and privacy

The site links to established public profiles for enquiries. It uses no tracking scripts, backend, or form submissions. The proposed contact addresses should be published only after mailbox routing and deliverability are verified.

If a form is added later, configure a delivery provider and Cloudflare Turnstile. Validate Turnstile tokens server-side and test failed and successful delivery. Update the privacy and cookie pages to reflect what the published site actually does.

## Environment and hosting

The static build needs no environment variables. Deployments require an authorised Cloudflare Pages session. For CI, provide a scoped Pages API token and account ID through the CI secret store. Keep all credentials outside the repository.

See [Deployment and DNS](docs/DEPLOYMENT.md) for Cloudflare Pages and GoDaddy steps. See [QA](docs/QA.md) for the recorded checks.
