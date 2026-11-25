import type { APIRoute } from 'astro';
import { company, legal, navigation } from '../content/site';

export const GET: APIRoute = () => {
  const urls = [...navigation, ...legal].map(([, path]) =>
    '  <url><loc>' + new URL(path, company.origin).href + '</loc></url>'
  );

  return new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>'
  ].join('\n'), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
