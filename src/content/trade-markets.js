/**
 * @param {string} name
 * @param {boolean} agreement
 * @param {Array<[country: string, longitude: number, latitude: number, label?: string]>} entries
 */
const group = (name, agreement, entries) => ({
  name,
  agreement,
  markets: entries.map(([name, longitude, latitude, label]) => ({
    name,
    location: [longitude, latitude],
    label: label ?? name.toUpperCase(),
    featured: Boolean(label)
  }))
});

export const india = { name: 'India', label: 'INDIA', location: [77.1, 28.6], featured: true };

export const marketGroups = [
  group('South Asia · SAFTA', true, [
    ['Afghanistan', 69.17, 34.53],
    ['Bangladesh', 90.41, 23.81],
    ['Bhutan', 89.64, 27.47],
    ['Maldives', 73.51, 4.17],
    ['Nepal', 85.32, 27.72],
    ['Pakistan', 73.05, 33.69],
    ['Sri Lanka', 79.86, 6.93]
  ]),
  group('Southeast Asia · ASEAN agreement', true, [
    ['Brunei', 114.94, 4.89],
    ['Cambodia', 104.93, 11.56],
    ['Indonesia', 106.85, -6.21],
    ['Laos', 102.63, 17.96],
    ['Malaysia', 101.69, 3.14],
    ['Myanmar', 96.16, 19.75],
    ['Philippines', 120.98, 14.60],
    ['Singapore', 103.82, 1.35, 'SINGAPORE'],
    ['Thailand', 100.50, 13.75],
    ['Vietnam', 105.85, 21.03]
  ]),
  group('Europe · EFTA agreement', true, [
    ['Iceland', -21.94, 64.15],
    ['Liechtenstein', 9.52, 47.14],
    ['Norway', 10.75, 59.91],
    ['Switzerland', 7.45, 46.95]
  ]),
  group('Other Indian trade agreements in force', true, [
    ['Australia', 149.13, -35.28, 'AUSTRALIA'],
    ['Japan', 139.69, 35.68, 'JAPAN'],
    ['Mauritius', 57.50, -20.16, 'MAURITIUS'],
    ['New Zealand', 174.78, -41.29, 'NEW ZEALAND'],
    ['Oman', 58.41, 23.59],
    ['South Korea', 126.98, 37.57, 'SOUTH KOREA'],
    ['United Arab Emirates · Dubai', 55.27, 25.20, 'DUBAI'],
    ['United Kingdom', -0.12, 51.50, 'UK']
  ]),
  group('Additional markets', false, [
    ['Bahrain', 50.59, 26.23],
    ['China', 116.41, 39.90, 'CHINA'],
    ['Egypt', 31.24, 30.04],
    ['European Union', 4.35, 50.85, 'EU'],
    ['Kenya', 36.82, -1.29, 'KENYA'],
    ['Nigeria', 7.49, 9.06, 'NIGERIA'],
    ['Qatar', 51.53, 25.29],
    ['Saudi Arabia', 46.68, 24.71, 'SAUDI ARABIA'],
    ['South Africa', 28.22, -25.75, 'SOUTH AFRICA'],
    ['United States', -74.01, 40.71, 'USA']
  ])
];

export const tradeMarkets = marketGroups.flatMap(({ agreement, markets }) =>
  markets.map(market => ({ ...market, agreement }))
);

export function tradeRoutes(markets) {
  return {
    type: 'MultiLineString',
    coordinates: markets.map(market => [india.location, market.location])
  };
}
