import { Helmet } from "react-helmet-async";
import { useSchedules } from "@/hooks/use-cricket-data";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { Calendar } from "lucide-react";
import { formatScheduleDate } from "@/lib/utils";
import { useMemo } from "react";
import type { ScheduleMatch } from "@/lib/types";
import ScheduleCard from "@/components/ScheduleCard";

export default function Schedule() {
  const { data: matches, isLoading, error, refetch } = useSchedules();

  const groupedMatches = useMemo(() => {
    if (!matches) return {};

    const todayStr = new Date().toDateString();

    const visibleMatches = matches.filter((match) => {
      const isToday =
        new Date(match.start_time).toDateString() === todayStr;

      if (match.status === "NS") return true;

      if (
        match.status !== "NS" &&
        match.status.toLowerCase() !== "finished" &&
        isToday
      ) {
        return false;
      }

      return false;
    });

    const sorted = [...visibleMatches].sort(
      (a, b) =>
        new Date(a.start_time).getTime() -
        new Date(b.start_time).getTime()
    );

    const groups: Record<string, ScheduleMatch[]> = {};
    sorted.forEach((match) => {
      const dateKey = formatScheduleDate(match.start_time);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(match);
    });

    return groups;
  }, [matches]);

  return (
    <>
      <Helmet>
        <title>Match Schedule | STRYKER</title>
      </Helmet>

      {/* HERO */}
      <section className="relative h-[45vh] min-h-[360px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1730739628981-6537b299aea3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="w-full h-full object-cover"
            alt="Cricket stadium"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background/95" />

        <div className="absolute inset-0 flex items-center z-10">
          <div className="container-content">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-white" />
                <span className="text-white/80 uppercase tracking-widest text-xs font-bold">
                  Fixtures
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Match Schedule
              </h1>
              <p className="text-white/100 text-lg">
                Upcoming fixtures from leagues around the world. All times shown
                in your local timezone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="bg-background">
        <div className="container-content py-16">
          {isLoading ? (
            <LoadingState message="Loading schedule..." />
          ) : error ? (
            <ErrorState message="Unable to load schedule." onRetry={refetch} />
          ) : Object.keys(groupedMatches).length === 0 ? (
            <EmptyState
              title="No matches found"
              message="Schedules will appear here once available."
            />
          ) : (
            <div className="space-y-14">
              {Object.entries(groupedMatches).map(([date, dayMatches]) => (
                <div key={date}>
                  <h2 className="font-display text-xl font-bold mb-6 border-b pb-2">
                    {date}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dayMatches.map((match) => (
                      <ScheduleCard
                        key={match.match_id ?? match.id}
                        match={match}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
