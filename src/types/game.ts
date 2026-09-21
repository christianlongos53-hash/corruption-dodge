export type CharacterId = 'bico' | 'sharah' | 'vong' | 'juan';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  title: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  description: string;
}

export type ObstacleType = 'cash_stack' | 'bribe_envelope' | 'gold_briefcase' | 'pork_barrel';

export type WeatherType = 'sunny' | 'windy' | 'stormy';

export type DevelopmentStage = 'muddy_rural' | 'provincial_paved' | 'national_highway' | 'urban_metropolis';

export interface StageDetails {
  id: DevelopmentStage;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  nextBudgetTarget: number;
  projectName: string;
  projectDescription: string;
}

export const STAGE_CONFIGS: Record<DevelopmentStage, StageDetails> = {
  muddy_rural: {
    id: 'muddy_rural',
    name: 'Muddy Countryside',
    shortName: 'Rural Mud',
    icon: '🌾',
    description: 'Unpaved dirt road, bamboo fences, and rural Bahay Kubo.',
    nextBudgetTarget: 100000,
    projectName: '🚜 Farm-to-Market Road',
    projectDescription: 'Pave the muddy road into durable concrete!'
  },
  provincial_paved: {
    id: 'provincial_paved',
    name: 'Provincial Concrete Town',
    shortName: 'Provincial',
    icon: '🏘️',
    description: 'Paved concrete slabs, sari-sari stores, and utility lines.',
    nextBudgetTarget: 300000,
    projectName: '🛣️ National Highway & Drainage',
    projectDescription: 'Build modern asphalt highway with storm drainage!'
  },
  national_highway: {
    id: 'national_highway',
    name: 'National Highway',
    shortName: 'Highway',
    icon: '🛣️',
    description: 'Smooth asphalt highway, streetlights, and commercial shophouses.',
    nextBudgetTarget: 650000,
    projectName: '🏙️ Metro Skyway & Smart City',
    projectDescription: 'Transform into a bustling smart metropolis with elevated transit!'
  },
  urban_metropolis: {
    id: 'urban_metropolis',
    name: 'Modern Smart Metropolis',
    shortName: 'Metropolis',
    icon: '🌟',
    description: 'Futuristic highway, glass skyscrapers, and elevated transit.',
    nextBudgetTarget: 1200000,
    projectName: '🌊 Smart Flood Barrier System',
    projectDescription: 'Activate advanced seawall barrier to repel all floodwaters!'
  }
};

export const PROJECT_COST = 500_000; // 500,000 pesos per project

export function formatPeso(amount: number): string {
  if (amount >= 1_000_000_000) {
    const b = (amount / 1_000_000_000).toFixed(2);
    return `₱${b}B`;
  }
  if (amount >= 1_000_000) {
    const m = (amount / 1_000_000).toFixed(1);
    return `₱${m}M`;
  }
  if (amount >= 100_000) {
    return `₱${(amount / 1_000).toFixed(0)}K`;
  }
  return `₱${amount.toLocaleString()}`;
}

export const MONEY_VALUES: Record<ObstacleType, number> = {
  cash_stack: 500,      // ₱500
  bribe_envelope: 1000, // ₱1,000
  gold_briefcase: 1500, // ₱1,500
  pork_barrel: 2000     // ₱2,000
};

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  radius: number;
  type: ObstacleType;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  pulsePhase: number;
  scale: number;
  swaySeed: number;
}

export interface GovernmentProject {
  id: number;
  x: number;
  y: number;
  radius: number;
  name: string;
  description: string;
  stageTarget: DevelopmentStage;
  cost: number;
  speed: number;
  pulsePhase: number;
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  name: string;
  avatar: CharacterId;
  score: number; // meters
  timestamp: number;
}

export type GameState = 'START' | 'PLAYING' | 'GAMEOVER_FLOOD' | 'GAMEOVER_MODAL' | 'LEADERBOARD';

export interface PlayerPosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
}

export interface GameStats {
  distance: number; // in meters
  speed: number;
  dodgedCount: number;
  activeCharacter: CharacterId;
  playerName: string;
  weather: WeatherType;
  hits: number; // 0 to 10
  maxHits: number; // 10
  budget: number; // Total money earned from dodging bribes
  stage: DevelopmentStage;
  nextProjectBudget: number;
  activeProjectName?: string;
  projectNotification?: string;
}

/**
 * Calculates standard road bounds across canvas rendering, player input, and obstacle spawning.
 */
export function getRoadBounds(width: number) {
  const roadWidth = Math.min(500, width - 36);
  const roadMargin = (width - roadWidth) / 2;
  return {
    roadWidth,
    roadMargin,
    left: roadMargin,
    right: roadMargin + roadWidth
  };
}

/**
 * Returns current weather based on distance survived (changes every 20,000 meters).
 */
export function getWeatherForDistance(distance: number): WeatherType {
  const tier = Math.floor(distance / 20000) % 3;
  if (tier === 0) return 'sunny';
  if (tier === 1) return 'windy';
  return 'stormy';
}
