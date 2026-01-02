import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMatch, useCommentary, useScorecard, useDiscussions } from "@/hooks/use-cricket-data";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import DiscussionCard from "@/components/DiscussionCard";
import { cn, formatMatchTime } from "@/lib/utils";
import { useState } from "react";
import { ArrowLeft, MapPin, Clock, MessageCircle, Share2, Bookmark } from "lucide-react";
import type { ScheduleMatch, LiveMatch, CommentaryBall, FullScorecard, DiscussionPost } from "@/lib/types";

type TabType = "commentary" | "scorecard" | "stats" | "discussion";

// Type guard to distinguish between LiveMatch and ScheduleMatch
function isLiveMatch(match: ScheduleMatch | LiveMatch): match is LiveMatch {
  return 'score' in match && 'batting_team' in match;
}

// Helper to generate short team name (first 3 letters uppercase)
function getShortName(name: string): string {
  return name.substring(0, 3).toUpperCase();
}

export default function MatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("commentary");
  
  const matchIdNum = matchId ? parseInt(matchId, 10) : undefined;

  const { data: match, isLoading: matchLoading, error: matchError, refetch: refetchMatch } = useMatch(matchIdNum, {
    refetchInterval: 30000,
  });

  const { data: commentary } = useCommentary(activeTab === "commentary" ? matchIdNum : undefined);
  const { data: scorecard } = useScorecard(activeTab === "scorecard" ? matchIdNum : undefined);
  const { data: discussions } = useDiscussions(activeTab === "discussion" ? matchIdNum : undefined);

  if (matchLoading) {
    return (
      <div className="container-content py-20">
        <LoadingState message="Loading match details..." />
      </div>
    );
  }

  if (matchError || !match) {
    return (
      <div className="container-content py-20">
        <ErrorState message="Unable to load match details." onRetry={() => refetchMatch()} />
      </div>
    );
  }

  const isLive = isLiveMatch(match);
  const isStatusLive = match.status === "LIVE";

  // Extract data based on match type
  const team1 = isLive ? match.batting_team : match.teams.home;
  const team2 = isLive ? match.bowling_team : match.teams.away;
  const venue = isLive ? "Live Match" : match.venue.name;
  const venueCity = isLive ? undefined : match.venue.city;
  const tournament = isLive ? "Live Cricket" : match.league.name;
  const startTime = isLive ? match.last_updated : match.start_time;

  return (
    <>
      <Helmet>
        <title>{getShortName(team1.name)} vs {getShortName(team2.name)} | STRYKER</title>
        <meta name="description" content={`${match.status} - ${tournament} at ${venue}`} />
      </Helmet>

      {/* Match Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container-content">
          {/* Back Link */}
          <Link to="/live" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Live Scores
          </Link>

          {/* Tournament & Status */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-primary-foreground/70">{tournament}</span>
            {!isLive && venueCity && (
              <>
                <span className="text-primary-foreground/40">•</span>
                <span className="text-sm text-primary-foreground/70">{venueCity}</span>
              </>
            )}
          </div>

          {/* Teams & Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Team 1 */}
            <div className="text-center md:text-left">
              <h2 className="font-display text-2xl font-bold mb-1">{team1.name}</h2>
              {isLive && (
                <p className="text-3xl font-bold">
                  {match.score.runs}/{match.score.wickets}
                  <span className="text-lg font-normal text-primary-foreground/70 ml-2">
                    ({match.score.overs} ov)
                  </span>
                </p>
              )}
            </div>

            {/* VS / LIVE Badge */}
            <div className="flex items-center justify-center">
              <span className={cn(
                "inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary-foreground/30 text-lg font-bold",
                isStatusLive && "bg-live border-live-foreground text-live-foreground"
              )}>
                {isStatusLive ? "LIVE" : "VS"}
              </span>
            </div>

            {/* Team 2 */}
            <div className="text-center md:text-right">
              <h2 className="font-display text-2xl font-bold mb-1">{team2.name}</h2>
              {isLive && match.current_inning === 2 && (
                <p className="text-lg text-primary-foreground/70">
                  Yet to bat
                </p>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center bg-primary-foreground/10 rounded-lg py-3 px-4">
            <p className="font-medium">
              {isLive 
                ? `Inning ${match.current_inning} in progress` 
                : match.status === "UPCOMING" 
                  ? "Match not started" 
                  : "Match completed"
              }
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {venue}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {isLive ? `Updated ${formatMatchTime(startTime)}` : formatMatchTime(startTime)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-sm font-medium transition-colors">
              <Bookmark className="h-4 w-4" />
              Follow
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-sm font-medium transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Live Stats Bar (if live) */}
      {isLive && (
        <section className="bg-card border-b border-border py-4">
          <div className="container-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Score Details */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Inning</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">{match.batting_team.name}</span>
                    <span className="text-foreground font-medium">
                      {match.score.runs}/{match.score.wickets} ({match.score.overs} overs)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bowling Team */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bowling</h3>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{match.bowling_team.name}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="container-content py-8">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-border">
          {(["commentary", "scorecard", "stats", "discussion"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-[2px]",
                activeTab === tab
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "discussion" && <MessageCircle className="inline-block h-4 w-4 mr-1.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "commentary" && (
          <CommentaryTab commentary={commentary || []} />
        )}
        {activeTab === "scorecard" && scorecard && (
          <ScorecardTab scorecard={scorecard} />
        )}
        {activeTab === "stats" && (
          <StatsTab match={match} />
        )}
        {activeTab === "discussion" && (
          <DiscussionTab discussions={discussions || []} matchId={matchIdNum} />
        )}
      </div>
    </>
  );
}

function CommentaryTab({ commentary }: { commentary: CommentaryBall[] }) {
  if (commentary.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Commentary will appear here once the match starts.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {commentary.map((ball) => (
        <div
          key={ball.id}
          className={cn(
            "p-4 rounded-lg border",
            ball.isWicket && "bg-destructive/5 border-destructive/20",
            ball.isSix && "bg-highlight/10 border-highlight/20",
            ball.isBoundary && !ball.isSix && "bg-accent/5 border-accent/20",
            !ball.isWicket && !ball.isBoundary && !ball.isSix && "bg-card border-border"
          )}
        >
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-mono text-sm font-bold text-foreground">
              {ball.over}
            </span>
            <div className="flex-1">
              <p className="text-foreground">{ball.description}</p>
              <div className="flex items-center gap-2 mt-1">
                {ball.isWicket && (
                  <span className="text-xs font-medium text-destructive">WICKET</span>
                )}
                {ball.isSix && (
                  <span className="text-xs font-medium text-highlight">SIX</span>
                )}
                {ball.isBoundary && !ball.isSix && (
                  <span className="text-xs font-medium text-accent">FOUR</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScorecardTab({ scorecard }: { scorecard: FullScorecard }) {
  return (
    <div className="space-y-8">
      {/* Batting */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4">
          {scorecard.team.name} Batting
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium text-muted-foreground">Batsman</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground">Dismissal</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">R</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">B</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">4s</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">6s</th>
                <th className="pb-2 pl-4 font-medium text-muted-foreground text-right">SR</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.batting.filter(b => b.dismissal !== "did not bat").map((entry, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium text-foreground">{entry.batsman}</td>
                  <td className="py-3 px-4 text-muted-foreground">{entry.dismissal}</td>
                  <td className="py-3 px-4 text-right font-semibold text-foreground">{entry.runs}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.balls}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.fours}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.sixes}</td>
                  <td className="py-3 pl-4 text-right text-muted-foreground">{entry.strikeRate.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras & Total */}
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Extras:</span>
            <span className="ml-2 text-foreground font-medium">{scorecard.extras.total}</span>
            <span className="ml-1 text-muted-foreground text-xs">
              (b {scorecard.extras.byes}, lb {scorecard.extras.legByes}, w {scorecard.extras.wides}, nb {scorecard.extras.noBalls})
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Total:</span>
            <span className="ml-2 text-foreground font-bold">
              {scorecard.total.runs}/{scorecard.total.wickets} ({scorecard.total.overs} ov)
            </span>
          </div>
        </div>
      </div>

      {/* Bowling */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Bowling</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium text-muted-foreground">Bowler</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">O</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">M</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">R</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">W</th>
                <th className="pb-2 pl-4 font-medium text-muted-foreground text-right">Econ</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.bowling.map((entry, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium text-foreground">{entry.bowler}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.overs}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.maidens}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.runs}</td>
                  <td className="py-3 px-4 text-right font-semibold text-foreground">{entry.wickets}</td>
                  <td className="py-3 pl-4 text-right text-muted-foreground">{entry.economy.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {scorecard.fallOfWickets.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Fall of Wickets</h3>
          <div className="flex flex-wrap gap-2">
            {scorecard.fallOfWickets.map((fow, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-muted rounded text-sm text-muted-foreground">
                {fow}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsTab({ match }: { match: ScheduleMatch | LiveMatch }) {
  const isLive = isLiveMatch(match);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Match Info</h3>
        <div className="space-y-4">
          <StatRow label="Status" value={match.status} />
          <StatRow label="Match ID" value={match.match_id.toString()} />
          {!isLive && (
            <>
              <StatRow label="League" value={match.league.name} />
              <StatRow label="Season ID" value={match.season_id.toString()} />
              <StatRow label="Venue" value={match.venue.name} />
              {match.venue.city && <StatRow label="City" value={match.venue.city} />}
            </>
          )}
          {isLive && (
            <>
              <StatRow label="Current Inning" value={match.current_inning.toString()} />
              <StatRow label="Last Updated" value={formatMatchTime(match.last_updated)} />
            </>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">
          {isLive ? "Current Score" : "Teams"}
        </h3>
        <div className="space-y-4">
          {isLive ? (
            <>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-foreground font-medium">{match.batting_team.name}</span>
                <span className="text-foreground font-bold">
                  {match.score.runs}/{match.score.wickets} ({match.score.overs} ov)
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">vs {match.bowling_team.name}</span>
              </div>
            </>
          ) : (
            <>
              <StatRow label="Home Team" value={match.teams.home.name} />
              <StatRow label="Away Team" value={match.teams.away.name} />
              <StatRow label="Start Time" value={formatMatchTime(match.start_time)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function DiscussionTab({ discussions, matchId }: { discussions: DiscussionPost[]; matchId?: number }) {
  if (discussions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground font-medium mb-2">No discussions yet</p>
        <p className="text-muted-foreground text-sm">Be the first to share your thoughts on this match.</p>
        <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Start Discussion
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map(post => (
        <DiscussionCard key={post.id} post={post} />
      ))}
    </div>
  );
}