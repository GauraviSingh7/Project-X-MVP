import { Helmet } from "react-helmet-async";
import { useLiveMatches, useNews, useDiscussions } from "@/hooks/use-cricket-data";
import MatchCard from "@/components/MatchCard";
import NewsCard from "@/components/NewsCard";
import DiscussionCard from "@/components/DiscussionCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { Radio, Newspaper, MessageCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const { data: matches, isLoading: matchesLoading, error: matchesError, refetch: refetchMatches } = useLiveMatches();
  const { data: news, isLoading: newsLoading, error: newsError, refetch: refetchNews } = useNews();
  const { data: discussions, isLoading: discussionsLoading, error: discussionsError, refetch: refetchDiscussions } = useDiscussions();

  const liveMatches = matches?.filter(m => m.status === "LIVE") || [];
  const upcomingMatches = matches?.filter(m => m.status === "UPCOMING").slice(0, 2) || [];

  return (
    <>
      <Helmet>
        <title>STRYKER - Your Cricket Command Center</title>
        <meta name="description" content="Live cricket scores, expert analysis, and intelligent discussions for serious cricket fans." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-content">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Your Cricket Command Center
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Live scores, expert analysis, and intelligent discussions — all in one place. 
              Built for serious cricket fans who demand clarity over noise.
            </p>
          </div>
        </div>
      </section>

      <div className="container-content py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed - Left Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Matches */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Radio className="h-5 w-5 text-live" />
                <h2 className="font-display text-xl font-bold text-foreground">Live Now</h2>
                {liveMatches.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-live/10 text-live text-xs font-medium">
                    {liveMatches.length} match{liveMatches.length > 1 ? "es" : ""}
                  </span>
                )}
              </div>
              
              {matchesLoading ? (
                <LoadingState message="Loading live matches..." />
              ) : matchesError ? (
                <ErrorState onRetry={() => refetchMatches()} />
              ) : liveMatches.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">No live matches at the moment.</p>
                  {upcomingMatches.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Check the upcoming matches below.</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </section>

            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-xl font-bold text-foreground">Coming Up</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </section>
            )}

            {/* Discussions */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl font-bold text-foreground">Fan Discussions</h2>
              </div>
              
              {discussionsLoading ? (
                <LoadingState message="Loading discussions..." />
              ) : discussionsError ? (
                <ErrorState onRetry={() => refetchDiscussions()} />
              ) : !discussions || discussions.length === 0 ? (
                <EmptyState title="No discussions yet" message="Be the first to start a conversation." />
              ) : (
                <div className="space-y-4">
                  {discussions.slice(0, 3).map(post => (
                    <DiscussionCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Right Column */}
          <aside className="space-y-8">
            {/* Cricket News */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="h-5 w-5 text-accent" />
                <h2 className="font-display text-lg font-bold text-foreground">Top Stories</h2>
              </div>
              
              {newsLoading ? (
                <LoadingState message="Loading news..." />
              ) : newsError ? (
                <ErrorState onRetry={() => refetchNews()} />
              ) : !news || news.length === 0 ? (
                <EmptyState title="No news available" message="Check back later for updates." />
              ) : (
                <div className="space-y-4">
                  {news.slice(0, 5).map(item => (
                    <NewsCard key={item.id} news={item} variant="compact" />
                  ))}
                </div>
              )}
            </section>

            {/* Quick Stats Card */}
            <section className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Did You Know?</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Highest ODI Score</p>
                  <p className="text-2xl font-bold text-foreground">481/6</p>
                  <p className="text-xs text-muted-foreground">England vs Australia, 2022</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Most Test Centuries</p>
                  <p className="text-2xl font-bold text-foreground">51</p>
                  <p className="text-xs text-muted-foreground">Sachin Tendulkar</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
