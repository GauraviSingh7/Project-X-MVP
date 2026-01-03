import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  useMatch,
  useCommentary,
  useScorecard,
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
  LiveMatch,
  CommentaryBall,
  FullScorecard,
  DiscussionPost,
} from "@/lib/types";

type TabType = "commentary" | "scorecard" | "discussion";

// Helper to generate short team name
function getShortName(name: string): string {
  return name.substring(0, 3).toUpperCase();
}

export default function LiveMatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("commentary");

  const matchIdNum = matchId ? parseInt(matchId, 10) : undefined;

  const {
    data: match,
    isLoading,
    error,
    refetch,
  } = useMatch(matchIdNum, {
    refetchInterval: 30000,
  });

  const { data: commentary } = useCommentary(
    activeTab === "commentary" ? matchIdNum : undefined
  );
  const { data: scorecard } = useScorecard(
    activeTab === "scorecard" ? matchIdNum : undefined
  );
  const { data: discussions } = useDiscussions(
    activeTab === "discussion" ? matchIdNum : undefined
  );

  if (isLoading) {
    return (
      <div className="container-content py-20">
        <LoadingState message="Loading live match..." />
      </div>
    );
  }

  if (error || !match || match.status !== "LIVE") {
    return (
      <div className="container-content py-20">
        <ErrorState
          message="This match is not live or could not be loaded."
          onRetry={refetch}
        />
      </div>
    );
  }

  const liveMatch = match as LiveMatch;

  return (
    <>
      <Helmet>
        <title>
          {getShortName(liveMatch.batting_team.name)} vs{" "}
          {getShortName(liveMatch.bowling_team.name)} | STRYKER
        </title>
      </Helmet>

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container-content">
          <Link
            to="/live"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Live Scores
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Batting Team */}
            <div>
              <h2 className="font-display text-2xl font-bold">
                {liveMatch.batting_team.name}
              </h2>
              <p className="text-3xl font-bold">
                {liveMatch.score.runs}/{liveMatch.score.wickets}
                <span className="text-lg font-normal ml-2">
                  ({liveMatch.score.overs} ov)
                </span>
              </p>
            </div>

            {/* LIVE badge */}
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-live text-live-foreground font-bold">
                LIVE
              </span>
            </div>

            {/* Bowling Team */}
            <div className="text-right">
              <h2 className="font-display text-2xl font-bold">
                {liveMatch.bowling_team.name}
              </h2>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              Live Match
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated {formatMatchTime(liveMatch.last_updated)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 mt-6">
            <button className="btn-secondary">
              <Bookmark className="h-4 w-4" />
              Follow
            </button>
            <button className="btn-secondary">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container-content py-8">
        <div className="flex gap-2 mb-6 border-b">
          {(["commentary", "scorecard", "discussion"] as TabType[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2",
                  activeTab === tab
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground"
                )}
              >
                {tab === "discussion" && (
                  <MessageCircle className="inline h-4 w-4 mr-1" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>

        {activeTab === "commentary" && (
          <CommentaryTab commentary={commentary || []} />
        )}

        {activeTab === "scorecard" && scorecard && (
          <ScorecardTab scorecard={scorecard} />
        )}

        {activeTab === "discussion" && (
          <DiscussionTab discussions={discussions || []} />
        )}
      </div>
    </>
  );
}

/* ---------------- Tabs ---------------- */

function CommentaryTab({ commentary }: { commentary: CommentaryBall[] }) {
  if (commentary.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Commentary will appear here shortly.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {commentary.map((ball) => (
        <div key={ball.id} className="p-4 bg-card border rounded-lg">
          <span className="text-sm text-muted-foreground">{ball.over}</span>
          <p className="text-foreground mt-1">{ball.description}</p>
        </div>
      ))}
    </div>
  );
}

function ScorecardTab({ scorecard }: { scorecard: FullScorecard }) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-bold mb-4">
        {scorecard.team.name} Batting
      </h3>
      {/* render as you already had */}
    </div>
  );
}

function DiscussionTab({
  discussions,
}: {
  discussions: DiscussionPost[];
}) {
  if (discussions.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No discussions yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map((post) => (
        <DiscussionCard key={post.id} post={post} />
      ))}
    </div>
  );
}
