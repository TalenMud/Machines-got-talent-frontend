import type {
  Lobby,
  Player,
  Comedian,
  LeaderboardEntry,
  TimelineEvent,
  Reward,
  GameStatus,
  BracketRound,
  StageMatch,
} from '../types'

export const gameStatus: GameStatus = {
  roomCode: 'MGT-4821',
  host: 'Ammar',
  round: 1,
  totalRounds: 4,
  category: 'Pun Duel',
  prompt: 'Pitch a time-travel pun about coffee.',
  timeLeft: '00:42',
  audience: 18,
  tokens: 120,
}

export const lobbies: Lobby[] = [
  {
    id: 'l1',
    name: 'The Punchline Pit',
    players: 4,
    capacity: 6,
    region: 'EU West',
    isPrivate: false,
    status: 'open',
  },
  {
    id: 'l2',
    name: 'Studio 404',
    players: 6,
    capacity: 6,
    region: 'US East',
    isPrivate: true,
    status: 'in-game',
  },
  {
    id: 'l3',
    name: 'Laugh Lab',
    players: 2,
    capacity: 5,
    region: 'EU Central',
    isPrivate: false,
    status: 'open',
  },
]

export const players: Player[] = [
  { id: 'p1', name: 'Talen', isHost: true, latencyMs: 18, ready: true },
  { id: 'p2', name: 'Ammar', latencyMs: 35, ready: true },
  { id: 'p3', name: 'Sana', latencyMs: 52, ready: false },
  { id: 'p4', name: 'Rico', latencyMs: 64, ready: true },
]

export const comedians: Comedian[] = [
  {
    id: 'c1',
    stageName: 'Neon Parrot',
    bio: 'Hyperactive storyteller who riffs on tech glitches.',
    style: 'High-energy, absurdist',
    color: '#FF9F43',
    score: 2,
    streak: 2,
    status: 'performing',
  },
  {
    id: 'c2',
    stageName: 'Quiet Thunder',
    bio: 'Deadpan delivery with poetic metaphors.',
    style: 'Deadpan, poetic',
    color: '#00B8A9',
    score: 2,
    streak: 1,
    status: 'up-next',
  },
  {
    id: 'c3',
    stageName: 'Glitch Biscuit',
    bio: 'Unexpected tangents and retro gaming jokes.',
    style: 'Nerdy, nostalgic',
    color: '#2EC4B6',
    score: 1,
    streak: 0,
    status: 'up-next',
  },
  {
    id: 'c4',
    stageName: 'Velvet Voltage',
    bio: 'Smooth punchlines with dramatic pauses.',
    style: 'Smooth, theatrical',
    color: '#FF6B6B',
    score: 0,
    streak: 0,
    status: 'eliminated',
  },
]

export const bracketRounds: BracketRound[] = [
  {
    round: 1,
    label: 'Quarterfinals',
    matches: [
      {
        id: 'm1',
        round: 1,
        label: 'Quarterfinals',
        status: 'live',
        left: { id: 'c1', stageName: 'Neon Parrot', color: '#FF9F43' },
        right: { id: 'c2', stageName: 'Quiet Thunder', color: '#00B8A9' },
      },
      {
        id: 'm2',
        round: 1,
        label: 'Quarterfinals',
        status: 'upcoming',
        left: { id: 'c3', stageName: 'Glitch Biscuit', color: '#2EC4B6' },
        right: { id: 'c4', stageName: 'Velvet Voltage', color: '#FF6B6B' },
      },
    ],
  },
  {
    round: 2,
    label: 'Final',
    matches: [
      {
        id: 'm3',
        round: 2,
        label: 'Final',
        status: 'upcoming',
        left: { id: 'w1', stageName: 'Winner QF1', color: '#94A3B8' },
        right: { id: 'w2', stageName: 'Winner QF2', color: '#94A3B8' },
      },
    ],
  },
]

export const stageMatch: StageMatch = {
  id: 'm1',
  round: 1,
  label: 'Quarterfinals',
  prompt: 'Pitch a time-travel pun about coffee.',
  performers: [
    {
      id: 'c1',
      stageName: 'Neon Parrot',
      color: '#FF9F43',
      joke: 'I tried time-traveling for espresso... but it just made me latte.',
      score: 2,
    },
    {
      id: 'c2',
      stageName: 'Quiet Thunder',
      color: '#00B8A9',
      joke: 'My time machine runs on beans. It keeps brewing the past.',
      score: 2,
    },
  ],
}

export const leaderboard: LeaderboardEntry[] = [
  { id: 'u1', name: 'Talen', wins: 5, tokens: 320, bestStreak: 4 },
  { id: 'u2', name: 'Ammar', wins: 4, tokens: 290, bestStreak: 3 },
  { id: 'u3', name: 'Sana', wins: 3, tokens: 210, bestStreak: 2 },
  { id: 'u4', name: 'Rico', wins: 2, tokens: 160, bestStreak: 2 },
]

export const timeline: TimelineEvent[] = [
  {
    id: 't1',
    round: 1,
    label: 'Golden Buzzer',
    detail: 'Neon Parrot grabbed +2 with a surprise twist.',
    tag: 'golden',
  },
  {
    id: 't2',
    round: 1,
    label: 'Buzzer Hit',
    detail: 'Velvet Voltage lost -1 after a slow opener.',
    tag: 'buzzer',
  },
  {
    id: 't3',
    round: 2,
    label: 'Elimination',
    detail: 'Velvet Voltage exits the bracket.',
    tag: 'elimination',
  },
  {
    id: 't4',
    round: 2,
    label: 'Wildcard Twist',
    detail: 'Audience vote adds 30 seconds to the set.',
    tag: 'twist',
  },
]

export const rewards: Reward[] = [
  {
    id: 'r1',
    title: 'First Pick Advantage',
    description: 'Lock in your favorite comedian before the lobby does.',
    cost: 45,
    owned: true,
  },
  {
    id: 'r2',
    title: 'Extra Golden Buzzer',
    description: 'Earn a one-time +2 boost for the next round.',
    cost: 80,
    owned: false,
  },
  {
    id: 'r3',
    title: 'Spotlight Timer',
    description: 'Add 20 seconds to the performer you choose.',
    cost: 60,
    owned: false,
  },
]
