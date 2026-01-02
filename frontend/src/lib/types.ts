// frontend/src/lib/types.ts

export type MatchStatus = "LIVE" | "UPCOMING" | "FINISHED";

/* ---------- Shared (Backend-Aligned) ---------- */

export interface Team {
  id: number;
  name: string;
}

export interface League {
  id: number;
  name: string;
}

export interface Venue {
  id: number;
  name: string;
  city?: string;
}

/* ---------- Schedule (Backend-Aligned) ---------- */

export interface MatchTeams {
  home: Team;
  away: Team;
}

export interface ScheduleMatch {
  match_id: number;
  season_id: number;
  league: League;
  start_time: string;
  venue: Venue;
  teams: MatchTeams;
  status: MatchStatus;
}

/* ---------- Live (Backend-Aligned) ---------- */

export interface LiveScore {
  runs: number;
  wickets: number;
  overs: number;
}

export interface LiveMatch {
  match_id: number;
  status: MatchStatus;
  current_inning: number;
  score: LiveScore;
  batting_team: Team;
  bowling_team: Team;
  last_updated: string;
}

/* ---------- Events (Backend-Aligned) ---------- */

export type EventType =
  | "WICKET"
  | "FOUR"
  | "SIX"
  | "RUNS"
  | "OVER_END"
  | "INNINGS_CHANGE"
  | "MATCH_END";

export interface MatchEvent {
  match_id: number;  // ✅ Changed from `number | string` to just `number`
  event_type: EventType;
  description: string;
  timestamp: string;
  inning: number;
  over: number;  // ✅ Changed from `over: number` (backend uses float but TS number works)
}

/* ---------- Mock Data Types (Keep for Phase 1) ---------- */

export interface CommentaryBall {
  id: string;
  over: string;
  ball: number;
  runs: number;
  isWicket: boolean;
  isBoundary: boolean;
  isSix: boolean;
  description: string;
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  category: 'news' | 'analysis' | 'opinion';
}

export interface DiscussionPost {
  id: string;
  matchId?: number;  // ✅ Changed from `string` to `number` for consistency
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export interface ScorecardEntry {
  batsman: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
}

export interface BowlingFigures {
  bowler: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  wides: number;
  noBalls: number;
}

export interface FullScorecard {
  innings: number;
  team: Team;
  batting: ScorecardEntry[];
  bowling: BowlingFigures[];
  extras: {
    byes: number;
    legByes: number;
    wides: number;
    noBalls: number;
    penalties: number;
    total: number;
  };
  total: {
    runs: number;
    wickets: number;
    overs: string;
  };
  fallOfWickets: string[];
}