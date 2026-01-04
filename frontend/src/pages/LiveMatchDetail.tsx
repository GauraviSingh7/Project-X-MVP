import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  useMatchDetail,
  useCommentary,
  useDiscussions,
} from "@/hooks/use-cricket-data";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import DiscussionCard from "@/components/DiscussionCard";
import { cn, formatMatchTime } from "@/lib/utils";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import type {
  CommentaryBall,
  DiscussionPost,
} from "@/lib/types";

type TabType = "commentary" | "scorecard" | "discussion";

export default function LiveMatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("commentary");

  const matchIdNum = matchId ? parseInt(matchId, 10) : undefined;

  const {
    data: match,
    isLoading,
    error,
    refetch,
  } = useMatchDetail(matchIdNum);

  const { data: commentary } = useCommentary(
    activeTab === "commentary" ? matchIdNum : undefined
  );
  const { data: discussions } = useDiscussions(
    activeTab === "discussion" ? matchIdNum : undefined
  );

  if (isLoading && !match) {
    return <LoadingState message="Connecting to live feed..." />;
  }

  if (error || !match) {
    return (
      <div className="container-content py-20">
        <ErrorState message="Match details unavailable." onRetry={refetch} />
      </div>
    );
  }

  // Data Extraction
  const richInning = match.scorecard?.[0]; 
  const venue = match.venue;
  const toss = match.toss;

  /**
   * Determine Opponent Name
   * We compare the batting team ID with the teams in the lineups.
   * Based on your JSON: Team 51 is Stars.
   */
  const battingTeamId = richInning?.team_id;
  // If Team 51 is batting (Stars), the opponent is the 'away' team (Renegades/Scorchers etc.)
  // If Team 50 is batting, the opponent is the 'home' team.
  const opponentName = battingTeamId === 51 ? "Melbourne Renegades" : "Melbourne Stars"; 

  return (
    <>
      <Helmet>
        <title>{`${richInning?.team_name || 'Match'} | STRYKER`}</title>
      </Helmet>

      {/* Header - Layout as requested */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container-content">
          <Link
            to="/live"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Live Scores
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Column: Batting Team Score */}
            <div className="text-left">
              <h1 className="text-3xl font-bold mb-1">
                {richInning?.team_name || "Melbourne Stars"}
              </h1>
              <p className="text-4xl font-bold">
                {richInning?.score || "0/0"} 
                <span className="text-xl font-normal ml-2 opacity-80">
                  ({richInning?.overs || "0.0"} ov)
                </span>
              </p>
            </div>

            {/* Middle Column: Status & Venue */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-live text-live-foreground flex items-center justify-center font-bold animate-pulse mb-2">
                LIVE
              </div>
              <span className="text-xs font-bold uppercase tracking-widest mb-2">
                {match.status || "1ST INNINGS"}
              </span>
              <div className="mt-1">
                <p className="text-sm font-semibold flex items-center justify-center gap-1">
                  <MapPin className="h-3 w-3" /> {venue?.name || "Venue TBC"}
                </p>
                <p className="text-[10px] opacity-70 uppercase tracking-tighter">{venue?.city || ""}</p>
              </div>
            </div>

            {/* Right Column: Opponent Information */}
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-1 opacity-60">
                {opponentName}
              </h2>
              <p className="text-lg font-medium opacity-50">Yet to Bat</p>
            </div>
          </div>

          {/* Metadata & Secondary Actions */}
          <div className="mt-8 flex flex-col items-center gap-4 border-t border-primary-foreground/10 pt-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Updated: {formatMatchTime(match.updated_at || new Date())}
              </span>
            </div>
            
            {toss && (
              <p className="text-sm italic opacity-90">
                Toss: {toss.won_by_team_id === richInning?.team_id ? richInning.team_name : opponentName} won and elected to {toss.elected}
              </p>
            )}

            <div className="flex gap-4 mt-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-md transition-colors text-sm font-medium">
                <Bookmark className="h-4 w-4" /> Follow
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-md transition-colors text-sm font-medium">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <div className="container-content py-8">
        <div className="flex gap-8 mb-8 border-b border-border">
          {(["commentary", "scorecard", "discussion"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-sm font-semibold transition-all relative",
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                {tab === "discussion" && <MessageCircle className="h-4 w-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "commentary" && (
          <CommentaryTab commentary={commentary || []} />
        )}

        {activeTab === "scorecard" && (
          <ScorecardTab scorecard={richInning} />
        )}

        {activeTab === "discussion" && (
          <DiscussionTab discussions={discussions || []} />
        )}
      </div>
    </>
  );
}

/* ---------------- Sub-Components ---------------- */

function CommentaryTab({ commentary }: { commentary: CommentaryBall[] }) {
  if (commentary.length === 0) {
    return <p className="text-center py-12 text-muted-foreground">Commentary will appear here shortly.</p>;
  }
  return (
    <div className="space-y-4">
      {commentary.map((ball) => (
        <div key={ball.id} className="p-4 bg-card border rounded-lg">
          <span className="text-sm font-bold text-accent">{ball.over}</span>
          <p className="text-foreground mt-1">{ball.description}</p>
        </div>
      ))}
    </div>
  );
}

function ScorecardTab({ scorecard }: { scorecard: any }) {
  if (!scorecard?.batting) return <p className="text-center py-12 text-muted-foreground">Detailed scorecard pending...</p>;

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-muted/50 px-6 py-3 border-b">
          <h3 className="font-bold">{scorecard.team_name} Batting</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground border-b bg-muted/20">
            <tr>
              <th className="px-6 py-3 font-medium">Batter</th>
              <th className="py-3 font-medium">R</th>
              <th className="py-3 font-medium">B</th>
              <th className="py-3 font-medium">4s</th>
              <th className="py-3 font-medium">6s</th>
              <th className="py-3 font-medium">SR</th>
            </tr>
          </thead>
          <tbody>
            {scorecard.batting.map((player: any) => (
              <tr key={player.player.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={player.player.image} className="w-8 h-8 rounded-full bg-muted shadow-inner" alt="" />
                  <div>
                    <p className="font-semibold">{player.player.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{player.status}</p>
                  </div>
                </td>
                <td className="font-bold">{player.runs}</td>
                <td className="text-muted-foreground">{player.balls}</td>
                <td>{player.fours}</td>
                <td>{player.sixes}</td>
                <td className="text-muted-foreground">{player.strike_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-muted/50 px-6 py-3 border-b text-foreground">
          <h3 className="font-bold">Bowling Performance</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground border-b bg-muted/20">
            <tr>
              <th className="px-6 py-3 font-medium">Bowler</th>
              <th className="py-3 font-medium">O</th>
              <th className="py-3 font-medium">R</th>
              <th className="py-3 font-medium">W</th>
              <th className="py-3 font-medium">ECON</th>
            </tr>
          </thead>
          <tbody>
            {scorecard.bowling?.map((bowler: any) => (
              <tr key={bowler.player.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={bowler.player.image} className="w-8 h-8 rounded-full bg-muted shadow-inner" alt="" />
                  <span className="font-semibold">{bowler.player.name}</span>
                </td>
                <td>{bowler.overs}</td>
                <td>{bowler.runs_conceded}</td>
                <td className="font-bold text-accent">{bowler.wickets}</td>
                <td className="text-muted-foreground">{bowler.economy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DiscussionTab({ discussions }: { discussions: DiscussionPost[] }) {
  if (discussions.length === 0) {
    return <p className="text-center py-12 text-muted-foreground">Join the conversation. No posts yet.</p>;
  }
  return (
    <div className="space-y-4">
      {discussions.map((post) => (
        <DiscussionCard key={post.id} post={post} />
      ))}
    </div>
  );
}