import type { ImagePlaceholder } from './placeholder-images';

export type PropertyAgent = {
  name: string;
  avatarId: string;
};

export type Property = {
  id: string;
  name: string;
  type: 'Apartment' | 'Villa' | 'Penthouse' | 'Townhouse' | 'Plot' | 'Studio' | 'Office' | 'Retail' | 'Industrial';
  purpose: 'Buy' | 'Rent';
  status: 'Off-plan' | 'Ready';
  price: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  imageId: string;
  location: string;
  agent?: PropertyAgent;
  description: string;
  amenities: string[];
  galleryImageIds: string[];
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

export type Blog = {
  id: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatarId: string;
  };
  imageId: string;
};
