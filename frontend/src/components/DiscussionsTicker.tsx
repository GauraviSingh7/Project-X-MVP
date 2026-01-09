// frontend/src/components/DiscussionsTicker.tsx

import { useRef } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Discussion {
  id: string;
  title: string;
  preview: string;
  author: string;
  replies: number;
  timestamp: string;
}

interface DiscussionsTickerProps {
  discussions: Discussion[];
}

export default function DiscussionsTicker({ discussions }: DiscussionsTickerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  if (discussions.length === 0) return null;

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {discussions.length > 3 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background border border-border rounded-full p-2 shadow-lg hover:bg-accent/10 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background border border-border rounded-full p-2 shadow-lg hover:bg-accent/10 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth",
          discussions.length <= 3 ? "justify-center" : "px-12"
        )}
      >
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="flex-shrink-0 w-80 bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-2">
              <MessageCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground mb-1 line-clamp-2">
                  {discussion.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {discussion.preview}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border mt-2">
              <span>by {discussion.author}</span>
              <span>{discussion.replies} replies</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}