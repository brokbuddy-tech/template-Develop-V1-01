
import type { ImagePlaceholder } from './placeholder-images';

export type PropertyAgent = {
  name: string;
  avatarId: string;
  title?: string;
  company?: string;
  orn?: string;
  propertyCount?: number;
};

export type Property = {
  id: string;
  name: string;
  type: string; // Dynamic based on category
  category: string;
  propertyGroup?: 'Residential' | 'Commercial';
  purpose: 'Buy' | 'Rent';
  status: 'Off-plan' | 'Ready';
  price: string;
  priceNumeric: number;
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
  id: string;
  name: string;
  yield: string;
  imageId: string | null;
};

export type Testimonial = {
  id: string;
  name?: string;
  clientName?: string; // Backend uses clientName
  quote?: string;
  content?: string; // Backend uses content
  imageId?: string | null;
  rating?: number;
};

export type SellerTestimonial = {
  id: string;
  name: string;
  property: string;
  quote: string;
  avatarFallback: string;
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
  readTime: string | null;
  title: string;
  excerpt: string;
  content?: string | null;
  authorName?: string | null;
  authorAvatar?: string | null;
  author?: {
    name: string;
    avatarId: string;
  };
  imageId: string | null;
};

export type Award = {
  id: string;
  title: string;
  description: string;
  imageId: string;
};
