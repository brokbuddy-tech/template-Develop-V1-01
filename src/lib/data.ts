import type { Property, Area, Testimonial, Blog } from './types';

export const featuredOffPlan: Property[] = [
  {
    id: 'prop-1',
    name: 'Emaar Beachfront Studio',
    type: 'Studio',
    purpose: 'Buy',
    price: 'AED 1.2M',
    bedrooms: 0,
    bathrooms: 1,
    areaSqFt: 450,
    imageId: 'property-1',
    location: 'Emaar Beachfront',
    agent: {
      name: 'John Doe',
      avatarId: 'author-1',
    },
  },
  {
    id: 'prop-2',
    name: 'Creek Harbour Villas',
    type: 'Villa',
    purpose: 'Buy',
    price: 'AED 8.5M',
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 4500,
    imageId: 'property-2',
    location: 'Dubai Creek Harbour',
    agent: {
      name: 'Jane Smith',
      avatarId: 'author-2',
    },
  },
  {
    id: 'prop-3',
    name: 'The Palm Royal Penthouse',
    type: 'Penthouse',
    purpose: 'Buy',
    price: 'AED 25M',
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 7200,
    imageId: 'property-3',
    location: 'Palm Jumeirah',
    agent: {
      name: 'Alex Johnson',
      avatarId: 'author-1',
    },
  },
];

export const featuredReady: Property[] = [
  {
    id: 'prop-4',
    name: 'Downtown Views II',
    type: 'Apartment',
    purpose: 'Buy',
    price: 'AED 4.1M',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1750,
    imageId: 'property-5',
    location: 'Downtown Dubai',
    agent: {
      name: 'Emily Chen',
      avatarId: 'author-2',
    },
  },
  {
    id: 'prop-5',
    name: 'Arabian Ranches III - Joy',
    type: 'Townhouse',
    purpose: 'Buy',
    price: 'AED 2.8M',
    bedrooms: 3,
    bathrooms: 4,
    areaSqFt: 2100,
    imageId: 'property-4',
    location: 'Arabian Ranches III',
    agent: {
      name: 'John Doe',
      avatarId: 'author-1',
    },
  },
  {
    id: 'prop-6',
    name: 'District One Villa',
    type: 'Villa',
    purpose: 'Buy',
    price: 'AED 15M',
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 8000,
    imageId: 'property-6',
    location: 'Mohammed Bin Rashid City',
    agent: {
      name: 'Jane Smith',
      avatarId: 'author-2',
    },
  },
];

export const areaGuides: Area[] = [
  { id: 'area-1', name: 'Dubai Marina', yield: '6.5% Avg. Yield', imageId: 'area-marina' },
  { id: 'area-2', name: 'Dubai Hills Estate', yield: '5.8% Avg. Yield', imageId: 'area-hills' },
  { id: 'area-3', name: 'Downtown Dubai', yield: '7.2% Avg. Yield', imageId: 'area-downtown' },
  { id: 'area-4', name: 'Palm Jumeirah', yield: '5.5% Avg. Yield', imageId: 'area-palm' },
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alex Johnson',
    quote: 'The professionalism and market knowledge of the DEVELOP team were exceptional. They found our dream home in record time.',
    imageId: 'testimonial-1',
  },
  {
    id: 'test-2',
    name: 'Samantha Lee',
    quote: 'An absolutely seamless experience from start to finish. Their property management service is second to none.',
    imageId: 'testimonial-2',
  },
  {
    id: 'test-3',
    name: 'Rashid Al Maktoum',
    quote: 'As an investor, DEVELOP provides unparalleled insights and access to exclusive off-market deals. Highly recommended.',
    imageId: 'testimonial-3',
  },
];

export const blogPosts: Blog[] = [
  {
    id: 'blog-1',
    readTime: '5 min read',
    title: 'Dubai Loop Tunnel Set to Serve 80% of The City’s Population',
    excerpt: 'The visionary project aims to revolutionize urban mobility in Dubai, connecting key districts with a high-speed transit network.',
    author: {
      name: 'John Doe',
      avatarId: 'author-1',
    },
    imageId: 'blog-1',
  },
  {
    id: 'blog-2',
    readTime: '7 min read',
    title: 'Top 5 Most Expensive Villas in Dubai in 2024',
    excerpt: 'A deep dive into the most opulent and sought-after villa properties that are setting new benchmarks in luxury living.',
    author: {
      name: 'Jane Smith',
      avatarId: 'author-2',
    },
    imageId: 'blog-2',
  },
  {
    id: 'blog-3',
    readTime: '4 min read',
    title: 'The Rise of Branded Residences: A New Era of Luxury',
    excerpt: 'Explore the growing trend of branded residences and why they represent a compelling investment opportunity in Dubai.',
    author: {
      name: 'Alex Johnson',
      avatarId: 'author-1',
    },
    imageId: 'blog-3',
  },
  {
    id: 'blog-4',
    readTime: '6 min read',
    title: 'How to Secure a Mortgage in Dubai as an Expat',
    excerpt: 'A comprehensive guide to navigating the mortgage process in Dubai for non-residents looking to invest in property.',
    author: {
      name: 'Emily Chen',
      avatarId: 'author-2',
    },
    imageId: 'blog-4',
  },
];
