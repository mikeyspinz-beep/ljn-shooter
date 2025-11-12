export enum GameStatus {
  Start,
  SelectingSpot,
  SelectingDifficulty,
  Playing,
  GameOver,
}

export interface Figure {
  id: number;
  characterId: string;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  imageUrl: string;
  status: 'standing' | 'falling';
  dx: number; // horizontal velocity
  dy: number; // vertical velocity
  scale: number;
  phase: number;
  fallStartTime?: number;
  spawnTime: number;
}

export type GunId = 'nerf_gun' | 'water_gun' | 'grenade_launcher';

export interface Gun {
  id: GunId;
  imageUrl: string | null;
  thumbUrl: string;
  speed: number;
  className: string | null;
  fireOffsetY: number;
  projectileImageUrl?: string;
}

export interface Projectile {
  id: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  progress: number; // 0 to 1
  type: GunId;
}

export interface Explosion {
  id: number;
  x: number;
  y: number;
  color: string;
  shadow: string;
  createdAt: number;
}

export interface Difficulty {
  id: string;
  name: string;
  duration: number;
  speedMultiplier: number;
}

export interface EnemyData {
  id: string;
  width: number;
  height: number;
  imageUrl: string;
  headshotRect?: {
    y: number; // y-offset as a percentage of height (e.g., 0)
    height: number; // height as a percentage of total height (e.g., 0.3 for top 30%)
  };
}

export interface FloatingText {
  id: number;
  text: string;
  x: number; // pixels
  y: number; // pixels
  type: 'score' | 'headshot';
  createdAt: number;
}
