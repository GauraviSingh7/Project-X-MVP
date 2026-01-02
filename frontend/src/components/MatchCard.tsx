import { Link } from "react-router-dom";
import { cn, formatMatchTime } from "@/lib/utils";
import type { Match } from "@/lib/types";
import { AlertTriangle, ChevronRight, Clock } from "lucide-react";

interface MatchCardProps {
  match: Match;
  variant?: "compact" | "full";
}

export default function MatchCard({ match, variant = "full" }: MatchCardProps) {
  // Treat everything except NS / FINISHED as LIVE
  const statusLower = match.status?.toLowerCase() ?? "";
  const isUpcoming = statusLower === "ns";
  const isFinished = statusLower === "finished";
  const isLive = !isUpcoming && !isFinished;

  const matchId = match.match_id ?? match.id;

  return (
    <Link
      to={`/match/${matchId}`}
      className={cn(
        "block bg-card rounded-lg border border-border card-hover overflow-hidden",
        variant === "compact" ? "p-4" : "p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
              isLive && "bg-live text-live-foreground",
              isUpcoming && "bg-muted text-muted-foreground",
              isFinished && "bg-accent/10 text-accent"
            )}
          >
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-live-foreground opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live-foreground" />
              </span>
            )}
            {match.status}
          </span>

          {match.importance === "HIGH" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-highlight/20 text-highlight-foreground text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              Key Match
            </span>
          )}
        </div>

        <span className="text-xs text-muted-foreground">
          {match.format ?? match.match_type ?? "—"}
        </span>
      </div>

      {/* League & Venue */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
        {match.league?.name ?? "—"} • {match.venue?.name ?? "Venue TBC"}
      </p>

      {/* Teams */}
      <div className="space-y-2">
        <TeamRow
          team={match.home_team}
          innings={match.innings?.find(
            (i) => i.team?.id === match.home_team?.id
          )}
        />
        <TeamRow
          team={match.away_team}
          innings={match.innings?.find(
            (i) => i.team?.id === match.away_team?.id
          )}
        />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <p
          className={cn(
            "text-sm",
            isLive ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          {isUpcoming ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatMatchTime(match.start_time)}
            </span>
          ) : (
            match.statusText ?? match.status
          )}
        </p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      {match.context && (
        <p className="mt-2 text-xs text-accent font-medium">
          {match.context}
        </p>
      )}
    </Link>
  );
}

function TeamRow({
  team,
  innings,
}: {
  team: Match["home_team"] | Match["away_team"];
  innings?: Match["innings"] extends (infer I)[] ? I : never;
}) {
  if (!team) {
    return (
      <div className="flex items-center py-1 text-sm text-muted-foreground">
        TBC
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <div className="w-6 h-4 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          {team.short_name ?? team.code ?? "—"}
        </div>
        <span className="text-sm text-foreground">{team.name ?? "TBC"}</span>
      </div>

      {innings && (
        <div className="text-right">
          <span className="text-sm font-semibold text-foreground">
            {innings.runs}/{innings.wickets}
          </span>
          <span className="text-xs text-muted-foreground ml-1.5">
            ({innings.overs})
          </span>
        </div>
      )}
    </div>
  );
}
