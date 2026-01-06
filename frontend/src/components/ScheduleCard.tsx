import { Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMatchTime } from "@/lib/utils";
import type { ScheduleMatch } from "@/lib/types";

const FALLBACK_STADIUM_IMAGE =
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&q=80";

export default function ScheduleCard({ match }: { match: ScheduleMatch }) {
  const status = match.status;

  const stadiumImage =
    match.venue?.image_path &&
    match.venue.image_path.includes("/images/")
      ? match.venue.image_path
      : FALLBACK_STADIUM_IMAGE;

  return (
    <Link
      to={`/match/${match.match_id}/schedule`}
      className="group relative block overflow-hidden rounded-2xl border border-border hover:shadow-2xl transition-all"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src={stadiumImage}
          alt={match.venue?.name ?? "Cricket stadium"}
          className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 p-6 text-white">
        {/* STATUS */}
        <div className="flex items-center justify-center mb-4">
          {status === "LIVE" ? (
            <span className="px-4 py-1 rounded-full bg-live text-live-foreground text-xs font-bold tracking-widest animate-pulse">
              LIVE
            </span>
          ) : status === "NS" ? (
            <span className="flex items-center gap-1 text-sm text-white/80">
              <Clock className="h-4 w-4" />
              {formatMatchTime(match.start_time)}
            </span>
          ) : (
            <span className="text-xs font-semibold text-white/70">
              {status === "Aban." ? "ABANDONED" : "FINISHED"}
            </span>
          )}
        </div>

        {/* TEAMS */}
        <div className="flex items-center justify-center gap-10">
          {/* HOME */}
          <div className="flex flex-col items-center gap-2 w-32 text-center">
            <img
              src={match.home_team.image_path}
              alt={match.home_team.name}
              className="h-12 w-12 object-contain"
            />
            <span className="font-semibold text-sm">
              {match.home_team.name}
            </span>
            {match.home_score && (
              <span className="text-xs text-white/70">
                {match.home_score}
              </span>
            )}
          </div>

          <span className="text-sm font-bold text-white/60">VS</span>

          {/* AWAY */}
          <div className="flex flex-col items-center gap-2 w-32 text-center">
            <img
              src={match.away_team.image_path}
              alt={match.away_team.name}
              className="h-12 w-12 object-contain"
            />
            <span className="font-semibold text-sm">
              {match.away_team.name}
            </span>
            {match.away_score && (
              <span className="text-xs text-white/70">
                {match.away_score}
              </span>
            )}
          </div>
        </div>

        {/* META */}
        <div className="mt-4 text-center space-y-1">
          <div className="text-sm text-white/80">
            {match.league.name}
          </div>
          {match.venue?.city && (
            <div className="flex items-center justify-center gap-1 text-xs text-white/70">
              <MapPin className="h-3 w-3" />
              {match.venue.city}
            </div>
          )}
        </div>

        {/* RESULT */}
        {match.result_note && (
          <div className="mt-3 text-center text-xs font-medium text-primary">
            {match.result_note}
          </div>
        )}
      </div>
    </Link>
  );
}
