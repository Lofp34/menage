
export interface Room {
  id: string;
  defaultName: string;
  name: string;
  icon: string;
  lastCleanedDate: string | null; // ISO string
  cleaningCount: number;
  isActive: boolean;
}

export interface UserProfile {
  score: number;
  currentStreak: number; // Number of consecutive on-time cleanings
  lastTaskCompletionDate: string | null; // ISO string for the day a task was marked complete
}

export interface CleaningLogEntry {
  id: string;
  roomId: string;
  roomName: string;
  date: string; // ISO string
  pointsEarned: number;
  isBonusStreakAwarded: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achievedDate?: string; // ISO string
}

export enum RoomStatus {
  Ok = 'OK',
  DueSoon = 'À FAIRE BIENTÔT',
  Overdue = 'EN RETARD',
}

export enum Tab {
  Quest = 'quête',
  Rooms = 'pièces',
  Stats = 'stats',
  Settings = 'réglages',
}
