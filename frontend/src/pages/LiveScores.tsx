// frontend/src/pages/LiveScores.tsx

import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { Radio, Search, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiveScores, useSchedules } from "@/hooks/use-cricket-data";
import LiveMatchCard from "@/components/LiveMatchCard";
import MatchCard from "@/components/MatchCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import type {
  LiveScoreMatch,
  ScheduleMatch,
  CombinedMatch,
  FilterStatus,
} from "@/lib/types";

export default function LiveScores() {
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: liveScoresData = [],
    isLoading: liveLoading,
    error: liveError,
    refetch: refetchLive,
  } = useLiveScores({ refetchInterval: 30000 });

  const {
    data: schedulesData = [],
    isLoading: scheduleLoading,
    error: scheduleError,
    refetch: refetchSchedules,
  } = useSchedules();

  const isLoading = liveLoading || scheduleLoading;
  const error = liveError || scheduleError;

  const combinedMatches = useMemo<CombinedMatch[]>(() => {
    const matches: CombinedMatch[] = [];

    if (Array.isArray(liveScoresData)) {
      liveScoresData
        .filter((m: LiveScoreMatch) => m.match_status === "LIVE")
        .forEach((m) => matches.push({ ...m, _type: "live" }));
    }

    if (Array.isArray(schedulesData)) {
      schedulesData
        .filter((m: ScheduleMatch) => m.status === "Finished")
        .forEach((m) => matches.push({ ...m, _type: "finished" }));
    }

    return matches.sort((a, b) => {
      if (a._type === "live" && b._type === "finished") return -1;
      if (a._type === "finished" && b._type === "live") return 1;
      return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
    });
  }, [liveScoresData, schedulesData]);

  const filteredMatches = useMemo(() => {
    let result = combinedMatches;

    if (filter === "LIVE") result = result.filter((m) => m._type === "live");
    if (filter === "COMPLETED")
      result = result.filter((m) => m._type === "finished");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) =>
        m._type === "live"
          ? m.teams.batting_first.name.toLowerCase().includes(q) ||
            m.teams.batting_second.name.toLowerCase().includes(q) ||
            m.venue.city.toLowerCase().includes(q)
          : m.home_team.name.toLowerCase().includes(q) ||
            m.away_team.name.toLowerCase().includes(q) ||
            m.league.name.toLowerCase().includes(q) ||
            m.venue.city.toLowerCase().includes(q)
      );
    }

    return result;
  }, [combinedMatches, filter, searchQuery]);

  const liveCount = combinedMatches.filter((m) => m._type === "live").length;

  return (
    <>
      <Helmet>
        <title>Live Cricket Scores | STRYKER</title>
      </Helmet>

      {/* BACKGROUND LAYER - Using 'fixed' ensures it stays put while content scrolls */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1730739463889-34c7279277a9?q=80&w=1600&auto=format&fit=crop"
          alt="Live Cricket Background"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay to ensure text readability and fade to page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-background/95" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10">
        {/* COMPACT HERO */}
        <section className="h-[40vh] min-h-[300px] flex items-center">
          <div className="container-content">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black/5 backdrop-blur-md rounded-lg border border-black/5">
                  <Radio className="h-5 w-5 text-black" />
                </div>
                {liveCount > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-live text-white text-[10px] font-black tracking-widest animate-pulse">
                    {liveCount} LIVE NOW
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
                Live Scores
              </h1>

              <p className="text-black/70 text-lg md:text-xl max-w-2xl font-medium">
                Real-time updates from professional matches worldwide. Precision
                data, instantly delivered.
              </p>
            </div>
          </div>
        </section>

        {/* MAIN MATCH LIST SECTION */}
        <section className="relative pb-24">
          <div className="container-content">
            {/* FILTER + SEARCH CARD */}
            <div className="bg-background/60 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-10 -mt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Status Tabs */}
                <div className="flex items-center gap-1 p-1 bg-black/5 rounded-xl w-fit">
                  {(["ALL", "LIVE", "COMPLETED"] as FilterStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
                        filter === status
                          ? "bg-white text-black shadow-sm"
                          : "text-black/50 hover:text-black hover:bg-black/5"
                      )}
                    >
                      {status === "ALL" && "All Matches"}
                      {status === "LIVE" && "Live"}
                      {status === "COMPLETED" && "Finished"}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teams, series, or city..."
                    className="w-full pl-12 pr-4 py-3 bg-black/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/10 outline-none placeholder:text-black/30 text-black font-medium"
                  />
                </div>
              </div>

              {/* Sync Status */}
              <div className="flex items-center gap-2 mt-5 text-[10px] uppercase tracking-[0.2em] text-black/40 font-black">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-40 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                </span>
                Live Data Feed Active
              </div>
            </div>

            {/* MATCH GRID */}
            {isLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <LoadingState message="Connecting to live data stream..." />
              </div>
            ) : error ? (
              <div className="min-h-[400px]">
                <ErrorState
                  message="Data synchronization failed"
                  onRetry={() => {
                    refetchLive();
                    refetchSchedules();
                  }}
                />
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-32 bg-white/40 backdrop-blur-md border border-dashed border-black/10 rounded-3xl">
                <AlertTriangle className="h-12 w-12 text-black/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-black/60">No Matches Found</h3>
                <p className="text-black/40 font-medium">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "No matches are currently active or completed."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMatches.map((match) =>
                  match._type === "live" ? (
                    <LiveMatchCard key={match.match_id} match={match} />
                  ) : (
                    <MatchCard key={match.match_id} match={match} />
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </div>
      {/* Footer will now naturally appear here in your App.tsx layout */}
    </>
  );
}