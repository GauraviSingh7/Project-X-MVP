// frontend/src/components/FeaturedMatchCarousel.tsx

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedMatchCard from "./FeaturedMatchCard";
import type { LiveScoreMatch } from "@/lib/types";

interface FeaturedMatchCarouselProps {
  matches: LiveScoreMatch[];
}

export default function FeaturedMatchCarousel({ matches }: FeaturedMatchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (matches.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? matches.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === matches.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {matches.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background border border-border rounded-full p-2 shadow-lg hover:bg-accent/10 transition-colors"
            aria-label="Previous match"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background border border-border rounded-full p-2 shadow-lg hover:bg-accent/10 transition-colors"
            aria-label="Next match"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Match Card */}
      <div className="overflow-hidden">
        <FeaturedMatchCard match={matches[currentIndex]} />
      </div>

      {/* Dots Indicator */}
      {matches.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {matches.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentIndex ? "bg-accent" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to match ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}