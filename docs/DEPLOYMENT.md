# Deployment and DNS

## Cloudflare Pages

The intended Pages project is `moon-commerce-limited`, with production branch `main`. The production host is `mooncommercelimited.com`. The `www` host should redirect permanently to the matching path and query on the production host.

The Privacy Policy, Terms of Use and Cookie Policy are ready for founder review before public publication.

1. Build with `npm ci`, `npm run check`, `npm run build`, and `npm test`.
2. Create a **new** direct-upload Pages project in the intended Cloudflare account. Use `npx wrangler pages project create moon-commerce-limited --production-branch main`.
3. Deploy a review build with `npm run deploy:preview`. Confirm the URL from Wrangler and review the policies in the preview.
4. After review, publish the production build with `npm run deploy`. Verify the URL Wrangler returns, the custom 404 response and the headers in `public/_headers`.
5. Add the custom domains in the project’s **Custom domains** settings after the zone is active, then follow the DNS and redirect steps below.

The project is configured for direct upload. Source may be versioned privately in GitHub. [Cloudflare Pages direct upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

## DNS checked on 25 November 2026

The .com registry shows GoDaddy as the registrar. Public DNS returns the following for the domain.

| Record | Name | Observed value |
| --- | --- | --- |
| NS | `@` | `ns49.domaincontrol.com`, `ns50.domaincontrol.com` |
| A | `@` | `160.153.0.14` |
| CNAME | `www` | `mooncommercelimited.com` |
| MX | `@` | `1 aspmx.l.google.com`, `5 alt1.aspmx.l.google.com`, `5 alt2.aspmx.l.google.com`, `10 alt3.aspmx.l.google.com`, `10 alt4.aspmx.l.google.com` |
| TXT | `@` | SPF policy referencing `dc-aa8e722993._spfm.mooncommercelimited.com`, Google verification, and additional TXT records |
| TXT | `dc-aa8e722993._spfm` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `_dmarc` | GoDaddy DMARC policy with quarantine |
| CNAME | `_domainconnect` | `_domainconnect.gd.domaincontrol.com` |

The public lookup covers these known names. Export the full GoDaddy zone before switching DNS providers to preserve every active record, including mail records and verification tokens. The current home URL returned HTTP 404 during testing.

## GoDaddy to Cloudflare DNS

1. In GoDaddy, open **Domain Portfolio → mooncommercelimited.com → DNS**. Export the zone file. Save it as the backup for mail, verification records, subdomains, and a rollback.
2. In Cloudflare, add only `mooncommercelimited.com` to the same account as the new Pages project. Select the free plan.
3. Compare the imported zone against the full GoDaddy export. Preserve Google Workspace MX records, SPF and its included record, DKIM selectors, DMARC, and any mail or verification aliases. Keep mail-related hostnames DNS-only. Retain every other active subdomain or verification record from the export.
4. In the new Cloudflare zone’s **Overview**, copy the two nameservers assigned to this domain. The zone must exist before Cloudflare can provide these exact names.
5. In GoDaddy, go to **Domain Portfolio → mooncommercelimited.com → DNS → Nameservers → Change Nameservers**. Select the option to use your own nameservers. Enter exactly the two assigned Cloudflare nameservers and save.
6. Once Cloudflare shows the zone as **Active**, add `mooncommercelimited.com` and `www.mooncommercelimited.com` under the new Pages project’s **Custom domains**. Follow the domain setup UI to replace the existing web records with the Pages records. Wait for both domains and HTTPS certificates to become active.
7. In the Cloudflare zone, open **Rules → Redirect Rules**. Create a single redirect matching `http.host eq "www.mooncommercelimited.com"` with dynamic destination `concat("https://mooncommercelimited.com", http.request.uri.path)`, status `301` and **Preserve query string** enabled.
8. Verify the apex homepage and 404 route over HTTPS and test a `www` subpage with a query parameter. Confirm the MX, SPF, DKIM and DMARC values against the export and check mail delivery.

If an issue requires rollback, restore the saved records or revert the GoDaddy nameservers to the previous pair once the old zone is confirmed intact. [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [GoDaddy nameservers](https://www.godaddy.com/help/change-my-domain-nameservers-664)

`vaibhavdureja.com` and `supplycorridor.com` are external links from the website. Their deployments and DNS are outside this project's deployment steps.
