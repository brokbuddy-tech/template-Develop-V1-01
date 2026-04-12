
import type { Area, Testimonial, Award, Blog, SellerTestimonial } from './types';

export const areaGuides: Area[] = [
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    yield: '5.4%',
    imageId: 'area-downtown',
  },
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    yield: '6.2%',
    imageId: 'area-marina',
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    yield: '4.8%',
    imageId: 'area-palm',
  },
  {
    id: 'dubai-hills-estate',
    name: 'Dubai Hills Estate',
    yield: '5.9%',
    imageId: 'area-hills',
  },
  {
    id: 'business-bay',
    name: 'Business Bay',
    yield: '5.7%',
    imageId: 'area-guide-bridge',
  },
  {
    id: 'city-walk',
    name: 'City Walk',
    yield: '6.0%',
    imageId: 'area-guide-city-walk',
  },
  {
    id: 'jumeirah-village-circle',
    name: 'JVC',
    yield: '7.1%',
    imageId: 'area-guide-villa',
  },
  {
    id: 'difc',
    name: 'DIFC',
    yield: '5.2%',
    imageId: 'area-guide-burj',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Sarah Jenkins',
    name: 'Sarah Jenkins',
    content: 'The level of professionalism and market expertise shown by the team was outstanding. They helped us find our dream villa in Palm Jumeirah within weeks.',
    quote: 'The level of professionalism and market expertise shown by the team was outstanding. They helped us find our dream villa in Palm Jumeirah within weeks.',
    rating: 5,
    imageId: 'testimonial-1',
  },
  {
    id: 'test-2',
    clientName: 'Mohammed Al-Maktoum',
    name: 'Mohammed Al-Maktoum',
    content: 'DEVELOP provided me with data-driven insights that I couldn\'t find elsewhere. Their advice on investment properties in Downtown was invaluable.',
    quote: 'DEVELOP provided me with data-driven insights that I couldn\'t find elsewhere. Their advice on investment properties in Downtown was invaluable.',
    rating: 5,
    imageId: 'testimonial-2',
  },
  {
    id: 'test-3',
    clientName: 'Elena Rodriguez',
    name: 'Elena Rodriguez',
    content: 'Reliable, transparent, and extremely helpful. The transition to our new penthouse in Dubai Marina was seamless thanks to their dedicated support.',
    quote: 'Reliable, transparent, and extremely helpful. The transition to our new penthouse in Dubai Marina was seamless thanks to their dedicated support.',
    rating: 5,
    imageId: 'testimonial-3',
  },
];

export const awards: Award[] = [
  {
    id: 'award-1',
    title: 'Best Luxury Brokerage 2025',
    description: 'Recognized for excellence in the luxury real estate segment across the UAE.',
    imageId: 'award-1',
  },
  {
    id: 'award-2',
    title: 'Customer Service Excellence',
    description: 'Awarded for maintaining a 99% client satisfaction rate over five consecutive years.',
    imageId: 'award-2',
  },
  {
    id: 'award-3',
    title: 'Top Sales Performance',
    description: 'Acknowledged as the highest-grossing independent brokerage in Dubai Marina.',
    imageId: 'award-3',
  },
  {
    id: 'award-4',
    title: 'Innovation in Real Estate',
    description: 'For pioneering the use of data analytics in property valuation and market forecasting.',
    imageId: 'award-4',
  },
];

export const blogPosts: Blog[] = [
  {
    id: 'blog-1',
    title: 'The Future of Sustainable Living in Dubai',
    excerpt: 'Exploring how green architecture and sustainable communities are shaping the city\'s skyline.',
    readTime: '5 min read',
    imageId: 'blog-1',
    author: {
      name: 'James Wilson',
      avatarId: 'author-1',
    },
  },
  {
    id: 'blog-2',
    title: 'Dubai Real Estate Market Trends 2025',
    excerpt: 'An in-depth analysis of the current market cycle and predictions for the coming quarters.',
    readTime: '8 min read',
    imageId: 'blog-3',
    author: {
      name: 'Emily Chen',
      avatarId: 'author-2',
    },
  },
  {
    id: 'blog-3',
    title: 'Top 5 Areas for High Rental Yields',
    excerpt: 'Where to invest for maximum return on investment in the current economic climate.',
    readTime: '6 min read',
    imageId: 'blog-2',
    author: {
      name: 'David Garcia',
      avatarId: 'agent-1',
    },
  },
];

export const sellerTestimonials: SellerTestimonial[] = [
  {
    id: 'seller-1',
    name: 'Robert Thompson',
    property: 'Villa in Emirates Hills',
    quote: 'The team managed to sell my property at a record price within just two weeks of listing. Their marketing strategy is truly world-class.',
    avatarFallback: 'RT',
  },
  {
    id: 'seller-2',
    name: 'Linda Gao',
    property: 'Apartment in Business Bay',
    quote: 'Transparent communication and expert negotiation. I felt supported throughout the entire sales process. Highly recommend their services.',
    avatarFallback: 'LG',
  },
];
