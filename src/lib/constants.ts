
import type { NavLink } from './types';

export const SITE_NAME = 'DEVELOP';

export const NAV_LINKS: NavLink[] = [
  {
    href: '/buy',
    label: 'Buy',
    children: [
      { href: '/buy/apartments', label: 'Apartments' },
      { href: '/buy/villas', label: 'Villas' },
      { href: '/buy/penthouses', label: 'Penthouses' },
    ],
  },
  {
    href: '/sell',
    label: 'Sell',
  },
  {
    href: '/rent',
    label: 'Rent',
    children: [
      { href: '/rent/apartments', label: 'Apartments' },
      { href: '/rent/villas', label: 'Villas' },
    ],
  },
  {
    href: '/commercial',
    label: 'Commercial',
    children: [
      { href: '/commercial/for-sale', label: 'For Sale' },
      { href: '/commercial/for-rent', label: 'For Rent' },
    ],
  },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services/property-management', label: 'Property Management' },
      { href: '/services/interior-design', label: 'Interior Design' },
      { href: '/services/mortgage', label: 'Mortgage Consultancy' },
    ],
  },
  {
    href: '/about',
    label: 'About Us',
  },
  {
    href: '/careers',
    label: 'Careers',
  },
];


export const FOOTER_LINKS: Record<string, NavLink[]> = {
  'Explore': [
    { href: '/buy', label: 'Buy' },
    { href: '/sell', label: 'Sell' },
    { href: '/rent', label: 'Rent' },
    { href: '/commercial', label: 'Commercial' },
    { href: '/off-plan', label: 'Off-Plan' },
    { href: '/for-developers', label: 'For Developers' },
  ],
  'Services': [
    { href: '/services/property-management', label: 'Property Management' },
    { href: '/services/interior-design', label: 'Interior Design' },
    { href: '/services/mortgage', label: 'Mortgage Consultancy' },
    { href: '/services/relocation', label: 'Relocation Services' },
  ],
  'Company': [
    { href: '/about', label: 'About Us' },
    { href: '/content-hub', label: 'Content Hub' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ],
};
