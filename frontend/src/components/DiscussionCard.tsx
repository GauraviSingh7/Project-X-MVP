import { formatRelativeTime, formatNumber } from "@/lib/utils";
import type { DiscussionPost } from "@/lib/types";
import { MessageCircle, ThumbsUp, Share2, User } from "lucide-react";

interface DiscussionCardProps {
  post: DiscussionPost;
}

export default function DiscussionCard({ post }: DiscussionCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsUp className="h-4 w-4" />
          <span>{formatNumber(post.likes)}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span>{post.replies} replies</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
