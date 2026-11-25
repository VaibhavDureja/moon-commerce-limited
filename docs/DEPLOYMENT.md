# Deployment and DNS

## Cloudflare Pages

On 25 November 2026, the founder approved the site for publication, including the Privacy Policy, Terms of Use and Cookie Policy. The approved build was deployed to the `main` branch of the `moon-commerce-limited` Cloudflare Pages project. The homepage and the three policy pages returned HTTP 200, and the custom 404 returned HTTP 404. [Open the production Pages site](https://moon-commerce-limited.pages.dev/)

A separate `founder-review` deployment remains available for reviewing future changes. [Open the review site](https://founder-review.moon-commerce-limited.pages.dev/)

The canonical custom domain is `mooncommercelimited.com`. Both custom domains were added to Pages. Public HTTPS on these domains depends on the GoDaddy nameserver change, Cloudflare zone activation and certificate issuance. The `www` host should permanently redirect to the matching path and query on the canonical host.

1. Build with `npm ci`, `npm run check`, `npm run build`, and `npm test`.
2. Deploy a review build with `npm run deploy:preview`. Confirm the URL from Wrangler and review any changes in the preview.
3. Publish the approved production build with `npm run deploy`. Verify the URL Wrangler returns, the custom 404 response and the headers in `public/_headers`.

The project is configured for direct upload. Source may be versioned privately in GitHub. [Cloudflare Pages direct upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

## DNS checked on 25 November 2026

The .com registry shows GoDaddy as the registrar. Public DNS returned the following before the migration.

| Record | Name | Observed value |
| --- | --- | --- |
| NS | `@` | `ns49.domaincontrol.com`, `ns50.domaincontrol.com` |
| A | `@` | `160.153.0.14` |
| CNAME | `www` | `mooncommercelimited.com` |
| MX | `@` | `1 aspmx.l.google.com`, `5 alt1.aspmx.l.google.com`, `5 alt2.aspmx.l.google.com`, `10 alt3.aspmx.l.google.com`, `10 alt4.aspmx.l.google.com` |
| TXT | `@` | SPF policy referencing `dc-aa8e722993._spfm.mooncommercelimited.com`, Google verification, and additional TXT records |
| TXT | `dc-aa8e722993._spfm` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `_dmarc` | GoDaddy DMARC policy with quarantine |
| CNAME | `secureserver1._domainkey` | `s1.dkim.mooncommercelimited_com.1a0.onsecureserver.net` |
| CNAME | `secureserver2._domainkey` | `s2.dkim.mooncommercelimited_com.1a0.onsecureserver.net` |
| CNAME | `_acme-challenge` | `mooncommercelimited.com.a2a5947319618a50.dcv.cloudflare.com` |
| CNAME | `_domainconnect` | `_domainconnect.gd.domaincontrol.com` |

Both pages of the GoDaddy DNS table were received, and all 20 entries were confirmed against public DNS. The migration inventory includes 17 records with one-hour TTLs. Cloudflare generates the two replacement apex NS records and the SOA. The public registry had no DNSSEC DS record before the migration. Both website addresses returned HTTP 404 before the migration.

## GoDaddy to Cloudflare DNS

The free Cloudflare zone was created for `mooncommercelimited.com` and assigned `kenneth.ns.cloudflare.com` and `mina.ns.cloudflare.com`. All 17 transferable records were imported and compared against the GoDaddy inventory. Cloudflare now has proxied CNAME records for `@` and `www` pointing to `moon-commerce-limited.pages.dev`. The other 15 records retain their original values and TTLs, including Google Workspace MX records, SPF, DKIM, DMARC and verification records.

1. In GoDaddy, go to **Domain Portfolio → mooncommercelimited.com → DNS → Nameservers → Change Nameservers**. Choose the option to use your own nameservers, enter `kenneth.ns.cloudflare.com` and `mina.ns.cloudflare.com`, and save. Complete GoDaddy's confirmation if prompted.
2. Wait for the Cloudflare zone to show **Active** and for both custom domains and HTTPS certificates to be ready in Cloudflare Pages.
3. Configure a zone redirect matching `http.host eq "www.mooncommercelimited.com"` with dynamic destination `concat("https://mooncommercelimited.com", http.request.uri.path)`, status `301` and **Preserve query string** enabled.
4. Verify the apex homepage and 404 route over HTTPS and test a `www` subpage with a query parameter. Confirm public MX, SPF, DKIM and DMARC values against the GoDaddy inventory.

If an issue requires rollback, restore the saved records or revert the GoDaddy nameservers to the previous pair once the old zone is confirmed intact. [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [GoDaddy nameservers](https://www.godaddy.com/help/change-my-domain-nameservers-664)

`vaibhavdureja.com` and `supplycorridor.com` are external links from the website. Their deployments and DNS are outside this project's deployment steps.
