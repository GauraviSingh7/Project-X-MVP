// Adapters to transform API responses to internal app types
import type { Match, MatchStatus, Team, NewsItem, CommentaryBall, InningsScore } from '@/lib/types';
import type {
  ApiScheduleItem,
  ApiMatchItem,
  ApiLiveMatchResponse,
  ApiNewsItem,
  ApiCommentaryItem,
  ApiEventItem,
} from './types';

// Transform API team to internal Team type
function adaptTeam(apiTeam: { id: string; name: string; short_name?: string; logo_url?: string }): Team {
  return {
    id: apiTeam.id,
    name: apiTeam.name,
    shortName: apiTeam.short_name || apiTeam.name.substring(0, 3).toUpperCase(),
    flagUrl: apiTeam.logo_url,
  };
}

// Transform API status to internal MatchStatus
function adaptStatus(status: string): MatchStatus {
  switch (status) {
    case 'LIVE':
      return 'LIVE';
    case 'UPCOMING':
      return 'UPCOMING';
    case 'FINISHED':
      return 'FINISHED';
    default:
      return 'UPCOMING';
  }
}

// Transform schedule item to Match
// export function adaptScheduleToMatch(schedule: ApiScheduleItem): Match {
//   return {
//     id: schedule.match_id,
//     team1: adaptTeam(schedule.teams.home),
//     team2: adaptTeam(schedule.teams.away),
//     status: adaptStatus(schedule.status),
//     statusText: schedule.status === 'LIVE' ? 'In Progress' : schedule.status,
//     venue: schedule.venue.name,
//     startTime: schedule.start_time,
//     matchType: schedule.format,
//     tournament: schedule.league.name,
//     innings: [],
//     context: schedule.stage,
//     importance: 'MEDIUM',
//   };
// }

// Transform match item to Match
export function adaptMatchItemToMatch(match: ApiMatchItem): Match {
  return {
    id: match.match_id,
    team1: adaptTeam(match.teams.home),
    team2: adaptTeam(match.teams.away),
    status: adaptStatus(match.status),
    statusText: match.result || match.status,
    startTime: match.start_time,
    matchType: match.format,
    tournament: '',
    venue: '',
    innings: [],
    importance: 'MEDIUM',
  };
}

// Enhance match with live score data
export function enhanceMatchWithLiveData(
  match: Match,
  liveData: ApiLiveMatchResponse
): Match {
  if (!liveData.current_innings) {
    return {
      ...match,
      status: adaptStatus(liveData.status),
      statusText: liveData.stage || match.statusText,
    };
  }

  const { current_innings } = liveData;
  const isBattingTeam1 = current_innings.batting_team_id === match.team1.id;

  const battingTeam = isBattingTeam1 ? match.team1 : match.team2;

  const currentInningsScore: InningsScore = {
    team: battingTeam,
    runs: current_innings.score.runs,
    wickets: current_innings.score.wickets,
    overs: current_innings.score.overs.toString(),
    runRate: current_innings.run_rate,
  };

  // Update or add innings
  const updatedInnings = [...match.innings];
  const existingInningsIndex = updatedInnings.findIndex(
    (inn) => inn.team.id === battingTeam.id
  );
  
  if (existingInningsIndex >= 0) {
    updatedInnings[existingInningsIndex] = currentInningsScore;
  } else {
    updatedInnings.push(currentInningsScore);
  }

  return {
    ...match,
    status: adaptStatus(liveData.status),
    statusText: liveData.stage || 'In Progress',
    innings: updatedInnings,
    context: current_innings.target 
      ? `Target: ${current_innings.target}${current_innings.required_run_rate ? ` (RRR: ${current_innings.required_run_rate.toFixed(2)})` : ''}`
      : match.context,
  };
}

// Transform API news to internal NewsItem
export function adaptNewsItem(news: ApiNewsItem): NewsItem {
  return {
    id: news.news_id,
    title: news.title,
    summary: news.summary,
    source: news.source,
    publishedAt: news.published_at,
    imageUrl: news.image_url,
    url: '#', // API doesn't provide URL, mocked for Phase-1
    category: 'news',
  };
}

// Transform API commentary to internal CommentaryBall
export function adaptCommentaryItem(commentary: ApiCommentaryItem): CommentaryBall {
  const eventType = commentary.event_type.toUpperCase();
  return {
    id: commentary.commentary_id,
    over: commentary.over,
    ball: parseInt(commentary.over.split('.')[1]) || 0,
    runs: eventType === 'SIX' ? 6 : eventType === 'FOUR' ? 4 : 0,
    isWicket: eventType === 'WICKET',
    isBoundary: eventType === 'FOUR',
    isSix: eventType === 'SIX',
    description: commentary.text,
    timestamp: commentary.timestamp,
  };
}

// Transform API event
export function adaptEventItem(event: ApiEventItem) {
  return {
    id: event.event_id,
    type: event.type.toLowerCase(),
    teamId: event.team_id,
    playerId: event.player_id,
    over: event.over,
    timestamp: event.timestamp,
  };
}