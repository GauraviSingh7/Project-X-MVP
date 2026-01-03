import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { useSchedules } from "@/hooks/use-cricket-data";
import { formatMatchTime, formatScheduleDate } from "@/lib/utils";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function ScheduleDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const { data: matches, isLoading, error, refetch } = useSchedules();

  if (isLoading) {
    return <LoadingState message="Loading match details..." />;
  }

  if (error || !matches) {
    return (
      <ErrorState
        message="Unable to load match schedule."
        onRetry={refetch}
      />
    );
  }

  const match = matches.find(
    (m) => String(m.match_id ?? m.id) === matchId
  );

  if (!match) {
    return (
      <div className="container-content py-12 text-center">
        <p className="text-muted-foreground">Match not found.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Match Schedule | STRYKER</title>
      </Helmet>

      <div className="container-content py-8 space-y-6">
        {/* Back */}
        <Link
          to="/schedule"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to schedule
        </Link>

        {/* Match Info */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h1 className="text-2xl font-bold">
            {match.home_team.name} vs {match.away_team.name}
          </h1>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatScheduleDate(match.start_time)}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatMatchTime(match.start_time)}
            </div>

            {match.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {match.venue.name}
                {match.venue.city && `, ${match.venue.city}`}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {match.league?.name} • {match.stage}
          </div>
        </div>

        {/* Status Note */}
        <div className="text-sm text-muted-foreground">
          This match has not started yet. Live updates will be available
          once the match begins.
        </div>
      </div>
    </>
  );
}
