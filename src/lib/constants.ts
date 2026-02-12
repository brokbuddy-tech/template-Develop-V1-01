import type { NavLink } from './types';

export const SITE_NAME = 'DEVELOP';

export const NAV_LINKS: NavLink[] = [
  { href: '/buy', label: 'Buy' },
  { href: '/rent', label: 'Rent' },
  { href: '/commercial', label: 'Commercial' },
  { href: '/services/property-management', label: 'Property Management' },
  { href: '/invest/off-plan', label: 'Off-Plan' },
  { href: '/media', label: 'Media' },
  { href: '/about', label: 'About Us' },
  { href: '/vip-portal', label: 'VIP Portal'},
];

export const FOOTER_LINKS: Record<string, NavLink[]> = {
  'For Sale': [
    { href: '/buy/apartments', label: 'Apartments' },
    { href: '/buy/villas', label: 'Villas' },
    { href: '/buy/penthouses', label: 'Penthouses' },
    { href: '/buy/townhouses', label: 'Townhouses' },
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
