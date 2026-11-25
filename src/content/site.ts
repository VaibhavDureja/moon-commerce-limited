export const company = {
  brand: 'Moon Commerce',
  registeredName: 'MOONCOMMERCE LIMITED',
  number: '15894361',
  incorporated: '13 August 2024',
  origin: 'https://mooncommercelimited.com',
  register: 'https://find-and-update.company-information.service.gov.uk/company/15894361',
  street: '3rd Floor, 86-90 Paul Street',
  city: 'London',
  postcode: 'EC2A 4NE',
  country: 'England',
  jurisdiction: 'England and Wales',
  linkedin: 'https://uk.linkedin.com/company/mooncommerce-limited',
  founder: {
    name: 'Vaibhav Dureja',
    site: 'https://vaibhavdureja.com',
    linkedin: 'https://www.linkedin.com/in/vaibhav-dureja-5b7110123/',
    research: 'https://ssrn.com/abstract=6111026',
    github: 'https://github.com/VaibhavDureja'
  },
  venture: 'https://supplycorridor.com'
} as const;

export const navigation = [
  ['Home', '/'],
  ['About', '/about/'],
  ['Ventures', '/ventures/'],
  ['Technology', '/technology/'],
  ['Insights', '/insights/'],
  ['Careers', '/careers/'],
  ['Contact', '/contact/']
] as const;

export const legal = [
  ['Privacy Policy', '/privacy/'],
  ['Terms of Use', '/terms/'],
  ['Cookie Policy', '/cookies/'],
  ['Company Information', '/company-information/']
] as const;

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.brand,
  legalName: company.registeredName,
  url: company.origin,
  logo: company.origin + '/brand/logo-dark.svg',
  alternateName: 'Moon Commerce Limited',
  identifier: { '@type': 'PropertyValue', propertyID: 'Companies House', value: company.number },
  foundingDate: '2024-08-13',
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.street,
    addressLocality: company.city,
    postalCode: company.postcode,
    addressCountry: 'GB'
  },
  founder: { '@type': 'Person', name: company.founder.name, url: company.founder.site },
  sameAs: [company.linkedin]
};
