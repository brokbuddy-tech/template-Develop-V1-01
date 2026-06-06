"use client";

import { ReviewCarousel } from "@/components/review-carousel";
import { normalizePublicTestimonials } from "@/lib/reviews";
import type { Testimonial } from "@/lib/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <ReviewCarousel
      title="What Our Clients Say"
      items={normalizePublicTestimonials(testimonials)}
      variant="light"
    />
  );
}
