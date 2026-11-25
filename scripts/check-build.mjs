import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve('dist');
const origin = 'https://mooncommercelimited.com';
const routes = ['/', '/about/', '/ventures/', '/technology/', '/insights/', '/careers/', '/contact/', '/privacy/', '/terms/', '/cookies/', '/company-information/'];
const titleSet = new Set();
const descriptionSet = new Set();
const credential = /\b(?:ghp_|gho_|ghu_|github_pat_|cfut_|cfat_|cfoac_)[A-Za-z0-9_-]{20,}/;

const fileFor = path => join(root, decodeURIComponent(path.slice(1)) + (path.endsWith('/') ? 'index.html' : ''));
const htmlFor = path => readFileSync(fileFor(path), 'utf8');
const attr = (tag, name) => tag.match(new RegExp('\\b' + name + '="([^"]*)"'))?.[1];

for (const route of [...routes, '/404.html']) {
  const html = htmlFor(route);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, route + ' must have one h1');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const meta = html.match(/<meta name="description"[^>]*>/)?.[0] ?? '';
  const description = attr(meta, 'content');
  assert.ok(title && !titleSet.has(title), route + ' must have its own title');
  assert.ok(description && !descriptionSet.has(description), route + ' must have its own description');
  titleSet.add(title);
  descriptionSet.add(description);
  assert.ok(html.includes('og:image') && html.includes('og:description'), route + ' must have social metadata');
  assert.ok(html.includes('lang="en-GB"'), route + ' must declare its document language');
  if (route !== '/404.html') {
    assert.ok(html.includes('rel="canonical" href="' + origin + route + '"'), route + ' canonical');
  }
  assert.ok(!/<form\b/.test(html), route + ' must only present working contact channels');
  assert.ok(!credential.test(html), route + ' contains a credential-shaped value');

  for (const tag of html.matchAll(/<(?:a|link|img|script)\b[^>]+>/g)) {
    const name = tag[0].startsWith('<a') || tag[0].startsWith('<link') ? 'href' : 'src';
    const value = attr(tag[0], name);
    if (!value) continue;
    const url = new URL(value, origin + route);
    if (url.origin !== origin) continue;
    const target = fileFor(url.pathname);
    assert.ok(existsSync(target), route + ' has a missing asset or link ' + value);
    if (url.hash && target.endsWith('.html')) {
      assert.ok(readFileSync(target, 'utf8').includes('id="' + url.hash.slice(1) + '"'), route + ' has a missing anchor ' + value);
    }
  }
}

const structuredData = JSON.parse(htmlFor('/').match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1] ?? '{}');
assert.equal(structuredData['@type'], 'Organization');
assert.equal(structuredData.legalName, 'MOONCOMMERCE LIMITED');
assert.equal(structuredData.identifier?.value, '15894361');
assert.equal(structuredData.foundingDate, '2024-08-13');
assert.equal(structuredData.address?.postalCode, 'EC2A 4NE');
for (const route of routes) {
  assert.ok(readFileSync(join(root, 'sitemap.xml'), 'utf8').includes('<loc>' + origin + route + '</loc>'), 'sitemap ' + route);
}
assert.ok(readFileSync(join(root, 'robots.txt'), 'utf8').includes('Sitemap: ' + origin + '/sitemap.xml'));
for (const path of ['/_headers', '/images/social-share.png', '/brand/logo-dark.svg', '/brand/logo-light.svg', '/brand/favicon-32.png', '/brand/apple-touch-icon.png']) {
  assert.ok(existsSync(fileFor(path)), 'expected asset ' + path);
}
for (const path of readdirSync(join(root, '_astro'), { recursive: true }).filter(file => file.endsWith('.css'))) {
  const file = join(root, '_astro', path);
  for (const url of readFileSync(file, 'utf8').matchAll(/url\((?:["'])?([^"'()]+)(?:["'])?\)/g)) {
    if (/^(?:data:|https?:|#)/.test(url[1])) continue;
    const target = url[1].startsWith('/') ? fileFor(url[1]) : resolve(dirname(file), url[1]);
    assert.ok(existsSync(target), 'CSS asset ' + url[1]);
  }
}
console.log('Verified ' + routes.length + ' canonical pages, custom 404, metadata, sitemap, internal links, fonts and required assets.');
