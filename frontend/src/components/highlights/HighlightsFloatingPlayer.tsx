import { X } from 'lucide-react';
import YouTubeEmbed from "./YouTubeEmbed";

interface Props {
  url: string;
  onHide?: () => void;
}

export default function HighlightsFloatingPlayer({ url, onHide }: Props) {
  return (
    <div
      className="
        fixed
        z-[60]
        bg-black
        shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
        overflow-hidden
        border-t border-white/10

        /* Mobile View: Docked at bottom */
        bottom-0 left-0 right-0
        rounded-t-[1.5rem]
        aspect-video
        animate-in slide-in-from-bottom duration-500

        /* Desktop View: Floating Picture-in-Picture */
        md:bottom-6 md:right-6 md:left-auto
        md:w-[400px]
        md:rounded-2xl
        md:border
      "
    >
      {/* Mobile-only dismiss button (top right for easy thumb reach) */}
      {onHide && (
        <button
            onClick={onHide}
            className="
            md:hidden
            absolute top-3 right-3 z-10
            p-2 rounded-full
            bg-black/60 text-white backdrop-blur-md
            "
            aria-label="Close highlights"
        >
            <X className="h-5 w-5" />
        </button>
        )}

      {/* The Video Layer */}
      <YouTubeEmbed url={url} />
    </div>
  );
}