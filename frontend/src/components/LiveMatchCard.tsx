import type { LiveMatch } from "@/lib/types";

export default function LiveMatchCard({ match }: { match: LiveMatch }) {
  const inning = match.scorecard?.[0];

  return (
    <div className="border border-live rounded-lg p-5 bg-live/5">
      <div className="flex justify-between mb-2">
        <span className="text-live font-semibold animate-pulse">
          {match.status}
        </span>
        <span className="text-xs text-muted-foreground">
          {match.venue?.name}
        </span>
      </div>

      {inning && (
        <div className="text-2xl font-bold">
          {inning.score}
          <span className="text-sm text-muted-foreground ml-2">
            ({inning.overs} ov)
          </span>
        </div>
      )}
    </div>
  );
}
