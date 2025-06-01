
import { CLEANING_CYCLE_DAYS } from '../constants';
import { Room, RoomStatus } from '../types';

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDate = (isoDateString: string | null): string => {
  if (!isoDateString) return 'Jamais';
  const date = new Date(isoDateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const daysSince = (isoDateString: string | null): number => {
  if (!isoDateString) return Infinity;
  const date = new Date(isoDateString);
  const today = new Date();
  today.setHours(0,0,0,0); // Compare dates only
  date.setHours(0,0,0,0);
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getRoomStatus = (room: Room, today: Date = new Date()): RoomStatus => {
  if (!room.lastCleanedDate) return RoomStatus.Overdue; // Never cleaned is overdue
  
  const lastCleaned = new Date(room.lastCleanedDate);
  const deadline = new Date(lastCleaned);
  deadline.setDate(lastCleaned.getDate() + CLEANING_CYCLE_DAYS);
  
  today.setHours(0,0,0,0);
  deadline.setHours(0,0,0,0);

  if (today >= deadline) {
    return RoomStatus.Overdue;
  }
  
  const threeDaysBeforeDeadline = new Date(deadline);
  threeDaysBeforeDeadline.setDate(deadline.getDate() - 3);
  if (today >= threeDaysBeforeDeadline) {
    return RoomStatus.DueSoon;
  }
  
  return RoomStatus.Ok;
};

export const getStatusColor = (status: RoomStatus): string => {
  switch (status) {
    case RoomStatus.Ok:
      return 'text-green-500';
    case RoomStatus.DueSoon:
      return 'text-yellow-500';
    case RoomStatus.Overdue:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
