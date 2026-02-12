import type { ImagePlaceholder } from './placeholder-images';

export type Property = {
  id: string;
  name: string;
  type: 'Apartment' | 'Villa' | 'Penthouse' | 'Townhouse' | 'Plot';
  purpose: 'Buy' | 'Rent' | 'Commercial';
  price: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  imageId: string;
  location: string;
};

export type Area = {
  id:string;
  name: string;
  yield: string;
  imageId: string;
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  imageId: string;
};

export type Agent = {
  id: string;
  name: string;
  specialization: string;
  languages: string[];
  imageId: string;
};

export type NavLink = {
  href: string;
  label: string;
  children?: NavLink[];
};
