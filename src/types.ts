export type Lobby = {
  id: string
  name: string
  players: number
  capacity: number
  region: string
  isPrivate: boolean
  status: 'open' | 'in-game'
}

export type Player = {
  id: string
  name: string
  isHost?: boolean
  latencyMs: number
  ready: boolean
}

export type Comedian = {
  id: string
  stageName: string
  bio: string
  style: string
  color: string
  score: number
  streak: number
  status: 'up-next' | 'performing' | 'eliminated'
}

export type LeaderboardEntry = {
  id: string
  name: string
  wins: number
  tokens: number
  bestStreak: number
}

export type TimelineEvent = {
  id: string
  round: number
  label: string
  detail: string
  tag: 'twist' | 'buzzer' | 'golden' | 'elimination'
}

export type Reward = {
  id: string
  title: string
  description: string
  cost: number
  owned: boolean
}

export type GameStatus = {
  roomCode: string
  host: string
  round: number
  totalRounds: number
  category: string
  prompt: string
  timeLeft: string
  audience: number
  tokens: number
}

export type BracketCompetitor = {
  id: string
  stageName: string
  color: string
}

export type BracketMatch = {
  id: string
  round: number
  label: string
  status: 'upcoming' | 'live' | 'complete'
  left: BracketCompetitor
  right: BracketCompetitor
  winnerId?: string
}

export type BracketRound = {
  round: number
  label: string
  matches: BracketMatch[]
}

export type StagePerformer = {
  id: string
  stageName: string
  color: string
  joke: string
  score: number
}

export type StageMatch = {
  id: string
  round: number
  label: string
  prompt: string
  performers: [StagePerformer, StagePerformer]
}

export type BetSlip = {
  matchId: string
  competitorId: string
  amount: number
}
