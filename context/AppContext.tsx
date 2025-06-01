
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Room, UserProfile, CleaningLogEntry, Badge, Tab } from '../types';
import { INITIAL_ROOMS, LOCAL_STORAGE_KEY, DEFAULT_USER_PROFILE, CLEANING_CYCLE_DAYS, ON_TIME_POINTS, LATE_POINTS, STREAK_BONUS_THRESHOLD, STREAK_BONUS_POINTS, BADGE_DEFINITIONS, CLEANING_PACE_DAYS } from '../constants';
import { daysSince } from '../utils/dateUtils';

interface AppState {
  rooms: Room[];
  userProfile: UserProfile;
  cleaningHistory: CleaningLogEntry[];
  earnedBadges: Badge[];
  isLoading: boolean;
  activeTab: Tab;
}

interface AppContextProps extends AppState {
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  setCleaningHistory: React.Dispatch<React.SetStateAction<CleaningLogEntry[]>>;
  setEarnedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  setActiveTab: (tab: Tab) => void;
  completeTask: (roomId: string) => void;
  getSuggestedRoom: () => Room | null;
  updateRoomSettings: (roomId: string, newSettings: Partial<Pick<Room, 'name' | 'icon' | 'isActive'>>) => void;
  isCleaningDayDue: () => boolean;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [cleaningHistory, setCleaningHistory] = useState<CleaningLogEntry[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Quest);

  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const { rooms: savedRooms, userProfile: savedUserProfile, cleaningHistory: savedHistory, earnedBadges: savedBadges, activeTab: savedTab } = JSON.parse(savedState);
      setRooms(savedRooms || INITIAL_ROOMS);
      setUserProfile(savedUserProfile || DEFAULT_USER_PROFILE);
      setCleaningHistory(savedHistory || []);
      setEarnedBadges(savedBadges || []);
      setActiveTab(savedTab || Tab.Quest);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ rooms, userProfile, cleaningHistory, earnedBadges, activeTab }));
    }
  }, [rooms, userProfile, cleaningHistory, earnedBadges, activeTab, isLoading]);

  const checkAndAwardBadges = useCallback((updatedRooms: Room[], updatedUserProfile: UserProfile, completedRoomId?: string) => {
    const newBadges: Badge[] = [];
    BADGE_DEFINITIONS.forEach(def => {
      const isAlreadyEarned = earnedBadges.some(eb => eb.id === def.id);
      if (isAlreadyEarned) return;

      let shouldAward = false;
      if (def.id.includes('_clean_')) { // Room specific cleaning count badges
        const roomForBadge = updatedRooms.find(r => def.id.startsWith(r.id));
        if (roomForBadge) {
          const countThreshold = parseInt(def.id.split('_clean_')[1]);
          if (roomForBadge.cleaningCount >= countThreshold) {
            shouldAward = true;
          }
        }
      } else if (def.id === 'all_rooms_active_once') {
        const activeRooms = updatedRooms.filter(r => r.isActive);
        if (activeRooms.length > 0 && activeRooms.every(r => r.cleaningCount > 0)) {
          shouldAward = true;
        }
      }
      // Add more badge logic here based on def.id or other properties

      if (shouldAward) {
        newBadges.push({ ...def, achievedDate: new Date().toISOString() });
      }
    });

    if (newBadges.length > 0) {
      setEarnedBadges(prev => [...prev, ...newBadges]);
      // Could add a notification here for new badges
    }
  }, [earnedBadges]); // Removed updatedRooms from dependencies for now to simplify, checkAndAwardBadges will use current state rooms

  const completeTask = useCallback((roomId: string) => {
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    if (roomIndex === -1) return;

    const today = new Date();
    const roomToUpdate = rooms[roomIndex];
    
    const daysSinceLastClean = roomToUpdate.lastCleanedDate ? daysSince(roomToUpdate.lastCleanedDate) : Infinity;
    const isOnTime = daysSinceLastClean <= CLEANING_CYCLE_DAYS;
    
    const pointsEarned = isOnTime ? ON_TIME_POINTS : LATE_POINTS;
    let currentStreak = userProfile.currentStreak;
    let bonusAwardedThisTurn = false;

    if (isOnTime) {
      currentStreak += 1;
    } else {
      currentStreak = 0; // Reset streak if late
    }
    
    let finalPoints = pointsEarned;
    if (currentStreak > 0 && currentStreak % STREAK_BONUS_THRESHOLD === 0) {
      finalPoints += STREAK_BONUS_POINTS;
      bonusAwardedThisTurn = true;
      // Streak continues, bonus awarded at 5, 10, 15 etc.
    }

    const updatedRoom: Room = {
      ...roomToUpdate,
      lastCleanedDate: today.toISOString(),
      cleaningCount: roomToUpdate.cleaningCount + 1,
    };

    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = updatedRoom;
    setRooms(updatedRooms);

    const updatedUserProfile: UserProfile = {
      ...userProfile,
      score: userProfile.score + finalPoints,
      currentStreak: currentStreak,
      lastTaskCompletionDate: today.toISOString(),
    };
    setUserProfile(updatedUserProfile);

    setCleaningHistory(prev => [...prev, {
      id: crypto.randomUUID(),
      roomId: roomId,
      roomName: updatedRoom.name,
      date: today.toISOString(),
      pointsEarned: finalPoints,
      isBonusStreakAwarded: bonusAwardedThisTurn,
    }]);
    
    checkAndAwardBadges(updatedRooms, updatedUserProfile, roomId);

  }, [rooms, userProfile, checkAndAwardBadges]);


  const getSuggestedRoom = useCallback((): Room | null => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - CLEANING_CYCLE_DAYS);
    fourteenDaysAgo.setHours(0,0,0,0);

    const activeRooms = rooms.filter(r => r.isActive);
    if (activeRooms.length === 0) return null;

    activeRooms.sort((a, b) => {
      const aLastCleaned = a.lastCleanedDate ? new Date(a.lastCleanedDate) : new Date(0); 
      const bLastCleaned = b.lastCleanedDate ? new Date(b.lastCleanedDate) : new Date(0);
      aLastCleaned.setHours(0,0,0,0);
      bLastCleaned.setHours(0,0,0,0);

      const aIsOverdue = a.lastCleanedDate ? aLastCleaned < fourteenDaysAgo : true;
      const bIsOverdue = b.lastCleanedDate ? bLastCleaned < fourteenDaysAgo : true;

      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;
      
      return aLastCleaned.getTime() - bLastCleaned.getTime();
    });
    return activeRooms[0];
  }, [rooms]);

  const updateRoomSettings = useCallback((roomId: string, newSettings: Partial<Pick<Room, 'name' | 'icon' | 'isActive'>>) => {
    setRooms(prevRooms => prevRooms.map(room => room.id === roomId ? { ...room, ...newSettings } : room));
  }, []);

  const isCleaningDayDue = useCallback((): boolean => {
    if (!userProfile.lastTaskCompletionDate) return true; // If never cleaned, it's due
    const daysSinceLast = daysSince(userProfile.lastTaskCompletionDate);
    return daysSinceLast >= CLEANING_PACE_DAYS;
  }, [userProfile.lastTaskCompletionDate]);


  return (
    <AppContext.Provider value={{
      rooms, setRooms,
      userProfile, setUserProfile,
      cleaningHistory, setCleaningHistory,
      earnedBadges, setEarnedBadges,
      isLoading,
      activeTab, setActiveTab,
      completeTask,
      getSuggestedRoom,
      updateRoomSettings,
      isCleaningDayDue,
    }}>
      {children}
    </AppContext.Provider>
  );
};
