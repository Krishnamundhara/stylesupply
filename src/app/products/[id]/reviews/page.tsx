"use client";

import { use } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  TestimonialsHero,
  TestimonialsRating,
  TestimonialsReviews,
  ExperienceFashion,
} from "@/components/sections";

export default function ReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  void id; // available for future data fetching by product id

  return (
    <>
      <Header />
      <div className="mx-auto max-w-360 bg-white">
        <main className="flex flex-col gap-[60px] lg:gap-[80px] pb-[60px] lg:pb-[80px]">
          <TestimonialsHero />
          <TestimonialsRating />
          <TestimonialsReviews />
          <ExperienceFashion />
        </main>
      </div>
      <Footer />
    </>
  );
}
