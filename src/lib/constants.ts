
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
      { href: '/buy/townhouses', label: 'Townhouses' },
      { href: '/buy/plots', label: 'Plots' },
    ],
  },
  {
    href: '/rent',
    label: 'Rent',
    children: [
      { href: '/rent/apartments', label: 'Apartments' },
      { href: '/rent/villas', label: 'Villas' },
      { href: '/rent/penthouses', label: 'Penthouses' },
      { href: '/rent/townhouses', label: 'Townhouses' },
    ],
  },
  {
    href: '/commercial',
    label: 'Commercial',
    children: [
      { href: '/commercial/for-sale', label: 'For Sale' },
      { href: '/commercial/for-rent', label: 'For Rent' },
      { href: '/commercial/offices', label: 'Offices' },
      { href: '/commercial/retail', label: 'Retail' },
      { href: '/commercial/industrial', label: 'Industrial' },
    ],
  },
  {
    href: '/off-plan',
    label: 'Off-Plan',
  },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services/property-management', label: 'Property Management' },
      { href: '/services/interior-design', label: 'Interior Design' },
      { href: '/services/mortgage', label: 'Mortgage Consultancy' },
      { href: '/services/relocation', label: 'Relocation Services' },
    ],
  },
   {
    href: '/about',
    label: 'About Us',
  },
];


export const FOOTER_LINKS: Record<string, NavLink[]> = {
  'For Sale': [
    { href: '/buy/apartments', label: 'Apartments' },
    { href: '/buy/villas', label: 'Villas' },
    { href: '/buy/penthouses', label: 'Penthouses' },
    { href: '/buy/townhouses', label: 'Townhouses' },
    { href: '/buy/plots', label: 'Plots' },
  ],
  'For Rent': [
    { href: '/rent/annual', label: 'Annual Rentals' },
    { href: '/rent/short-term', label: 'Short-term Homes' },
  ],
  Services: [
    { href: '/services/property-management', label: 'Property Management' },
    { href: '/services/interior-design', label: 'Interior Design' },
    { href: '/services/mortgage', label: 'Mortgage Consultancy' },
    { href: '/services/relocation', label: 'Relocation Services' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/media', label: 'Media Hub' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ],
};
