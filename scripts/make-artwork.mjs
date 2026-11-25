import { readFile, writeFile } from 'node:fs/promises';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { india, tradeMarkets, tradeRoutes } from '../src/content/trade-markets.js';

const land = JSON.parse(await readFile(new URL('./data/natural-earth-land.geojson', import.meta.url)));
const projection = geoOrthographic()
  .rotate([-38, -29])
  .translate([307, 265])
  .scale(214)
  .precision(0.8);
const path = geoPath(projection).digits(1);
const routes = agreement => path(tradeRoutes(tradeMarkets.filter(market => market.agreement === agreement)));
const stillMarkets = [{ ...india, agreement: true }, ...tradeMarkets]
  .filter(market => geoDistance([38, 29], market.location) < Math.PI / 2 - 0.04);
const marker = market => {
  const [x, y] = projection(market.location).map(Math.round);
  const color = market.agreement ? '#c8f45d' : '#becbd9';
  return '<circle cx="' + x + '" cy="' + y + '" r="' + (market.name === 'India' ? '4.5' : '2.4') + '" fill="' + color + '"/>';
};

const globe = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 614 539" role="presentation" focusable="false">',
  '<circle cx="307" cy="265" r="237" fill="none" stroke="#49573e" stroke-dasharray="2 8"/>',
  '<circle cx="307" cy="265" r="214" fill="#1a251b" stroke="#788761" stroke-width="1.2"/>',
  '<path d="' + path(land) + '" fill="#3d512f" stroke="#9aaf7b" stroke-width=".75"/>',
  '<path d="' + path(geoGraticule10()) + '" fill="none" stroke="#a8ca6e" stroke-opacity=".2" stroke-width=".72"/>',
  '<path class="route" d="' + routes(false) + '" fill="none" stroke="#becbd9" stroke-opacity=".45" stroke-dasharray="3 4" stroke-width="1.2"/>',
  '<path class="route" d="' + routes(true) + '" fill="none" stroke="#c8f45d" stroke-opacity=".45" stroke-width="1.25"/>',
  ...stillMarkets.map(marker),
  '</svg>'
].join('\n');
await writeFile(new URL('../src/content/trade-network.svg', import.meta.url), globe + '\n');

const mark = color => [
  '<path d="M28 6.2A22 22 0 1 0 49.8 36.5 20.7 20.7 0 0 1 28 6.2Z" fill="' + color + '"/>',
  '<path d="M9.6 48.7C5.8 44.5 14.3 31 29 18.6 43.6 6.2 58.6 0.3 62.2 4.7 66 9.2 57.6 22.8 43 35.2 28.4 47.7 13.3 53.3 9.6 48.7Z" fill="none" stroke="' + color + '" stroke-width="2.6"/>',
  '<circle cx="53" cy="7" r="3.4" fill="' + color + '"/>'
].join('');
const origin = '<svg xmlns="http://www.w3.org/2000/svg" ';
const save = (name, contents) => writeFile(new URL('../public/brand/' + name, import.meta.url), contents + '\n');
const monogram = color => origin + 'viewBox="0 0 68 60" role="img" aria-label="Moon Commerce monogram">' + mark(color) + '</svg>';
const wordmark = (ink, accent) => origin + 'viewBox="0 0 340 80" role="img" aria-label="Moon Commerce"><g transform="translate(8 11)">' + mark(accent) + '</g><text x="91" y="52" fill="' + ink + '" font-family="Space Grotesk,DejaVu Sans,sans-serif" font-size="36" font-weight="700" letter-spacing="-1.5">Moon Commerce</text></svg>';
await Promise.all([
  save('moon-mark-lime.svg', monogram('#C8F45D')),
  save('moon-commerce-mark.svg', monogram('#C8F45D')),
  save('moon-mark-dark.svg', monogram('#101114')),
  save('logo-dark.svg', wordmark('#101114', '#263C12')),
  save('logo-light.svg', wordmark('#F5F3ED', '#C8F45D')),
  save('favicon.svg', origin + 'viewBox="0 0 96 96"><rect width="96" height="96" rx="16" fill="#101114"/><g transform="translate(13 20)">' + mark('#C8F45D') + '</g></svg>')
]);

const sharesvg = [
  origin + 'width="1200" height="630" viewBox="0 0 1200 630">',
  '<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#28322a" stroke-width="1"/></pattern></defs>',
  '<rect width="1200" height="630" fill="#101114"/><rect x="722" y="0" width="478" height="630" fill="url(#grid)"/>',
  '<g transform="translate(760 118)" fill="none" stroke="#516541"><circle cx="208" cy="197" r="187"/><ellipse cx="208" cy="197" rx="153" ry="187"/><ellipse cx="208" cy="197" rx="81" ry="187"/><ellipse cx="208" cy="197" rx="187" ry="84"/><path d="M21 197h374M208 10v374"/></g>',
  '<g fill="none" stroke="#C8F45D" stroke-width="3.5"><path d="M887 237Q984 116 1079 325"/><path d="M896 269Q991 186 1079 325"/></g>',
  '<g fill="#C8F45D"><circle cx="887" cy="237" r="6"/><circle cx="896" cy="269" r="6"/><circle cx="1079" cy="325" r="8"/></g>',
  '<g transform="translate(72 63)">' + mark('#C8F45D') + '</g>',
  '<text x="154" y="100" font-family="DejaVu Sans,sans-serif" font-size="24" font-weight="700" fill="#F5F3ED">Moon Commerce</text>',
  '<g font-family="DejaVu Sans,sans-serif" font-size="62" font-weight="700" fill="#F5F3ED"><text x="72" y="256">Building the</text><text x="72" y="335">infrastructure for</text><text x="72" y="414" fill="#C8F45D">tomorrow’s commerce.</text></g>',
  '<text x="75" y="531" font-family="DejaVu Sans,sans-serif" font-size="23" fill="#A7ADB7">Intelligence. Infrastructure. Global opportunity.</text>',
  '</svg>'
].join('\n');
await writeFile(new URL('../public/images/social-share.svg', import.meta.url), sharesvg + '\n');

const focusArt = {
  ai: '<path d="M12 21h24M16 8l16 26m0-26L16 34"/><circle cx="16" cy="8" r="3"/><circle cx="32" cy="8" r="3"/><circle cx="12" cy="21" r="3"/><circle cx="36" cy="21" r="3"/><circle cx="16" cy="34" r="3"/><circle cx="32" cy="34" r="3"/>',
  commerce: '<circle cx="24" cy="22" r="17"/><ellipse cx="24" cy="22" rx="8" ry="17"/><path d="M7 22h34M10 14h28M10 30h28"/>',
  automation: '<path d="M10 13h23l-5-5m5 5l-5 5M38 31H15l5-5m-5 5l5 5"/><rect x="8" y="28" width="6" height="6"/><rect x="34" y="10" width="6" height="6"/>',
  infrastructure: '<path d="M24 7 42 16 24 25 6 16 24 7Zm17 16L24 32 7 23m34 7L24 39 7 30"/>'
};
for (const [name, drawing] of Object.entries(focusArt)) {
  const svg = origin + 'viewBox="0 0 48 44" aria-hidden="true"><g fill="#f5f3ed" stroke="#41602e" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">' + drawing + '</g></svg>';
  await writeFile(new URL('../public/images/' + name + '.svg', import.meta.url), svg + '\n');
}
