
import { Room, Badge } from './types';

export const CLEANING_CYCLE_DAYS = 14;
export const CLEANING_PACE_DAYS = 2;
export const STREAK_BONUS_THRESHOLD = 5;
export const STREAK_BONUS_POINTS = 10; // Extra points for streak
export const ON_TIME_POINTS = 3;
export const LATE_POINTS = 1;

export const LOCAL_STORAGE_KEY = 'menageModeQueteState';

export const INITIAL_ROOMS: Room[] = [
  { id: 'ch_parents', defaultName: 'Chambre parents', name: 'Chambre parents', icon: '🛏️', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'ch_lilian', defaultName: 'Chambre Lilian', name: 'Chambre Lilian', icon: '🧸', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'ch_maelys', defaultName: 'Chambre Maëlys', name: 'Chambre Maëlys', icon: '🎀', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'ch_albane', defaultName: 'Chambre Albane', name: 'Chambre Albane', icon: '🦄', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'sdb_parents', defaultName: 'Salle de bain parents', name: 'Salle de bain parents', icon: '🛁', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'sdb_enfants', defaultName: 'Salle de bain enfants', name: 'Salle de bain enfants', icon: '🐥', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'cuisine', defaultName: 'Cuisine', name: 'Cuisine', icon: '🍳', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'salon', defaultName: 'Salon', name: 'Salon', icon: '🛋️', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'cellier', defaultName: 'Cellier', name: 'Cellier', icon: '🧺', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'garage', defaultName: 'Garage', name: 'Garage', icon: '🚗', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'cave', defaultName: 'Cave', name: 'Cave', icon: '🍾', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'wc1', defaultName: 'WC 1', name: 'WC 1', icon: '🚽', lastCleanedDate: null, cleaningCount: 0, isActive: true },
  { id: 'wc2', defaultName: 'WC 2', name: 'WC 2', icon: '🚻', lastCleanedDate: null, cleaningCount: 0, isActive: true },
];

export const BADGE_DEFINITIONS: Omit<Badge, 'achievedDate'>[] = [
    // Room specific badges based on cleaning count
    ...INITIAL_ROOMS.flatMap(room => [
        { id: `${room.id}_clean_3`, name: `${room.defaultName} Maître(sse) N1`, description: `Nettoyé "${room.defaultName}" 3 fois !`, icon: '🥉' },
        { id: `${room.id}_clean_6`, name: `${room.defaultName} Maître(sse) N2`, description: `Nettoyé "${room.defaultName}" 6 fois !`, icon: '🥈' },
        { id: `${room.id}_clean_9`, name: `${room.defaultName} Maître(sse) N3`, description: `Nettoyé "${room.defaultName}" 9 fois !`, icon: '🥇' },
    ]),
    // General badges
    { id: 'all_rooms_active_once', name: 'Explorateur de Propreté', description: 'Toutes les pièces actives nettoyées au moins une fois !', icon: '🗺️' },
    { id: 'perfect_house_maintained', name: 'Gardien de la Propreté', description: 'Maintenir 100% des pièces propres pendant une semaine.', icon: '🌟' } // This one is harder to track without daily checks, simplifying for now
];

export const DEFAULT_USER_PROFILE = {
  score: 0,
  currentStreak: 0,
  lastTaskCompletionDate: null,
};
