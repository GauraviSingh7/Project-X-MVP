// Mock Data for STRYKER - Phase 1
import type {
  NewsItem,
  DiscussionPost,
  CommentaryBall,
  FullScorecard,
} from "./types";

// =============================================================================
// MOCK MATCHES
// =============================================================================

export const mockMatchesFallback = [
  {
    id: "66709",
    tournament: "Big Bash League",
    matchType: "T20",
    venue: "Sydney Showground Stadium",
    status: "LIVE" as const,
    statusText: "2nd Innings",
    startTime: new Date().toISOString(),
    team1: { id: "54", name: "Sydney Thunder", shortName: "SYT" },
    team2: { id: "52", name: "Perth Scorchers", shortName: "PS" },
    innings: [],
    importance: "MEDIUM" as const,
  },
];

// =============================================================================
// MOCK DISCUSSIONS (War Room vs Global - 10 Posts Each)
// =============================================================================

export const mockDiscussions: DiscussionPost[] = [
  // --- MATCH DAY WAR ROOM (ID: 66709) ---
  {
    id: "w1",
    matchId: "66709",
    author: { name: "TacticalScout" },
    content: "Starc's release point is slightly higher today. Looking for that extra bounce over the swing. Huge over coming up.",
    likes: 48,
    replies: 6,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "w2",
    matchId: "66709",
    author: { name: "LineAndLength" },
    content: "Hazlewood's first spell: 4-1-12-0. The pressure he's building is exactly what's forcing these loose shots at the other end.",
    likes: 89,
    replies: 14,
    createdAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
  },
  {
    id: "w3",
    matchId: "66709",
    author: { name: "PerthPower" },
    content: "Cummins has gone to the cross-seam early. He's spotted some variable bounce on this Sydney surface.",
    likes: 34,
    replies: 2,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "w4",
    matchId: "66709",
    author: { name: "WicketWizard" },
    content: "Notice the mid-on is staying slightly wider for Starc. They are baiting the drive into the gap.",
    likes: 22,
    replies: 1,
    createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
  {
    id: "w5",
    matchId: "66709",
    author: { name: "AnalyticsAce" },
    content: "Projected score is dropping. The Scorchers' middle-order needs to rotate strike better against the spin duo.",
    likes: 56,
    replies: 9,
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    id: "w6",
    matchId: "66709",
    author: { name: "BowlFirst" },
    content: "Humidity is rising. Expect the ball to start tailing in for the left-armers in the next 15 minutes.",
    likes: 12,
    replies: 3,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "w7",
    matchId: "66709",
    author: { name: "FieldGenius" },
    content: "That's a massive gap at cow corner. Scorchers are taking a huge risk with only one man back there.",
    likes: 44,
    replies: 4,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: "w8",
    matchId: "66709",
    author: { name: "QuickSingle" },
    content: "The running between wickets has been sloppy. Already three close calls. A run-out feels inevitable.",
    likes: 31,
    replies: 2,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: "w9",
    matchId: "66709",
    author: { name: "DeathOverSpecialist" },
    content: "Starc has two overs left. If they don't take him on now, the required rate will climb past 12.",
    likes: 67,
    replies: 8,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "w10",
    matchId: "66709",
    author: { name: "TacticalScout" },
    content: "Absolute masterclass in yorker execution. Scorchers have effectively shut down the powerplay.",
    likes: 92,
    replies: 11,
    createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },

  // --- GLOBAL DISCUSSIONS (No matchId) ---
  {
    id: "g1",
    author: { name: "CricketPhilosopher" },
    content: "Is this the greatest Australian pace trio of all time? Starc, Cummins, and Hazlewood have a synergy that even McGrath/Gillespie struggled to match.",
    likes: 412,
    replies: 156,
    createdAt: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
  },
  {
    id: "g2",
    author: { name: "DataDork" },
    content: "Analysis: Starc's strike rate in ICC tournaments is nearly 20% better than his career average. The ultimate big-game player.",
    likes: 204,
    replies: 32,
    createdAt: new Date(Date.now() - 280 * 60 * 1000).toISOString(),
  },
  {
    id: "g3",
    author: { name: "TestMatchFanatic" },
    content: "The death of the ODI format is exaggerated. The last three World Cups have provided the highest level of tactical complexity we've seen.",
    likes: 188,
    replies: 45,
    createdAt: new Date(Date.now() - 260 * 60 * 1000).toISOString(),
  },
  {
    id: "g4",
    author: { name: "SpinDoctor" },
    content: "Why are finger spinners struggling in the modern T20 game? We need to discuss the lack of drift in the current white-ball era.",
    likes: 95,
    replies: 22,
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
  },
  {
    id: "g5",
    author: { name: "AussieLegend" },
    content: "Cummins’ captaincy transition has been flawless. Leading from the front with the ball while managing high-pressure fields is no small feat.",
    likes: 320,
    replies: 61,
    createdAt: new Date(Date.now() - 220 * 60 * 1000).toISOString(),
  },
  {
    id: "g6",
    author: { name: "GlobalUmpire" },
    content: "The DRS impact on the game has been mostly positive, but the 'Umpires Call' still creates too much ambiguity for the average viewer.",
    likes: 150,
    replies: 89,
    createdAt: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
  },
  {
    id: "g7",
    author: { name: "BattingCoach" },
    content: "Kohli’s bottom-hand technique is a case study in power generation. Even as he ages, his ability to find gaps remains elite.",
    likes: 540,
    replies: 112,
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
  },
  {
    id: "g8",
    author: { name: "PitchInspector" },
    content: "Drop-in pitches are making the game too predictable. We are losing the unique characteristics of historic venues like Perth and Adelaide.",
    likes: 120,
    replies: 34,
    createdAt: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
  },
  {
    id: "g9",
    author: { name: "T20Mercenary" },
    content: "The franchise model is inevitably going to shorten the international calendar. Boards need to find a way to coexist with the private leagues.",
    likes: 215,
    replies: 97,
    createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
  },
  {
    id: "g10",
    author: { name: "CricketPhilosopher" },
    content: "The aesthetic beauty of a classic cover drive is the only thing keeping the soul of the game alive in this power-hitting era.",
    likes: 890,
    replies: 230,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
];

// =============================================================================
// MOCK COMMENTARY DATA (Aussie Pace Focus)
// =============================================================================

export const mockCommentary: CommentaryBall[] = [
  { id: "c1", over: "15.1", ball: 1, runs: 0, isWicket: false, isBoundary: false, isSix: false, 
    description: "Starc from over the wicket. 148kph thunderbolt aimed at the toes. Blocked out by the batter, but that's a serious statement of intent.", timestamp: new Date().toISOString() },
  { id: "c2", over: "15.2", ball: 2, runs: 0, isWicket: true, isBoundary: false, isSix: false, 
    description: "OUT! THE STUMP IS OUT OF THE GROUND! Starc finds the late swing, zips through the gate of the set batter. Classic Mitchell Starc white-ball wizardry.", timestamp: new Date().toISOString() },
  { id: "c3", over: "16.1", ball: 1, runs: 0, isWicket: false, isBoundary: false, isSix: false, 
    description: "Cummins enters the fray. Immediate heavy length. Extracting bounce from a surface that looks dead to others. Incredible discipline.", timestamp: new Date().toISOString() },
  { id: "c4", over: "17.4", ball: 4, runs: 1, isWicket: false, isBoundary: false, isSix: false, 
    description: "Hazlewood at his metronomic best. Targeting that 5th-stump channel repeatedly. Batter eventually pushes one to deep point for a single.", timestamp: new Date().toISOString() },
  { id: "c5", over: "18.2", ball: 2, runs: 0, isWicket: false, isBoundary: false, isSix: false, 
    description: "Starc goes short. 151kph. Batter ducks under it, but that nearly took the helmet off. The Perth crowd is up and roaring.", timestamp: new Date().toISOString() },
];

// =============================================================================
// API HOOKS / FUNCTIONS
// =============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches discussions. 
 * If matchId is provided, returns ONLY match-specific War Room posts.
 * If matchId is omitted, returns ONLY Global community posts.
 */
export const fetchMockDiscussions = async (matchId?: string): Promise<DiscussionPost[]> => {
  await delay(300);
  if (matchId) {
    return mockDiscussions.filter((d) => d.matchId === matchId);
  }
  // Return global posts (where matchId is undefined)
  return mockDiscussions.filter((d) => !d.matchId);
};

export const fetchMockCommentary = async (_matchId: string): Promise<CommentaryBall[]> => {
  await delay(300);
  return mockCommentary;
};

export const fetchMockScorecard = async (_matchId: string): Promise<FullScorecard> => {
  await delay(300);
  return mockScorecard;
};

export const fetchMockNews = async (): Promise<NewsItem[]> => {
  await delay(400);
  // Using the original news data if needed
  return []; 
};