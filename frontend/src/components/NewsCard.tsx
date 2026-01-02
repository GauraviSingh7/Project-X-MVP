import { formatRelativeTime } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";
import { ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  news: NewsItem;
  variant?: "compact" | "full";
}

export default function NewsCard({ news, variant = "full" }: NewsCardProps) {
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block bg-card rounded-lg border border-border card-hover overflow-hidden group",
        variant === "compact" ? "p-4" : "p-5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize",
              news.category === "news" && "bg-primary/10 text-primary",
              news.category === "analysis" && "bg-accent/10 text-accent",
              news.category === "opinion" && "bg-highlight/20 text-highlight-foreground"
            )}>
              {news.category}
            </span>
            <span className="text-xs text-muted-foreground">{news.source}</span>
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-display font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2",
            variant === "compact" ? "text-base" : "text-lg"
          )}>
            {news.title}
          </h3>

          {/* Summary (full variant only) */}
          {variant === "full" && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {news.summary}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(news.publishedAt)}
            </span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>

        {/* Thumbnail (if available) */}
        {news.imageUrl && variant === "full" && (
          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-muted overflow-hidden">
            <img
              src={news.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </a>
  );
}
