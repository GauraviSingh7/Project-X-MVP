import { useMemo } from "react";

interface Props {
  url: string;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

export default function YouTubeEmbed({ url }: Props) {
  const videoId = useMemo(() => extractYouTubeId(url), [url]);

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-400">
        Highlights unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full h-full aspect-video bg-black">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
        title="Match Highlights"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
