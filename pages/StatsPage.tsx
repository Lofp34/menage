
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { CleaningLogEntry, Badge } from '../types';
import { formatDate, addDays, getTodayDateString } from '../utils/dateUtils';

const StatsPage: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return <div className="p-4">Chargement...</div>;
  const { cleaningHistory, earnedBadges, rooms } = context;

  const weeklyReport = useMemo(() => {
    const today = new Date(getTodayDateString());
    const oneWeekAgo = addDays(today, -7);
    
    const recentCleanings = cleaningHistory.filter(entry => new Date(entry.date) >= oneWeekAgo);
    const roomsCleanedThisWeek = new Set(recentCleanings.map(entry => entry.roomId));
    
    const overdueRooms = rooms.filter(room => {
        if (!room.isActive) return false;
        if (!room.lastCleanedDate) return true; // Never cleaned
        const daysSinceClean = (today.getTime() - new Date(room.lastCleanedDate).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceClean > 14;
    });

    return {
      cleanedCount: roomsCleanedThisWeek.size,
      totalActions: recentCleanings.length,
      overdueCount: overdueRooms.length,
      overdueRoomsNames: overdueRooms.map(r => r.name).join(', ') || 'Aucune',
    };
  }, [cleaningHistory, rooms]);


  // Simple Calendar View (Last 30 days)
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date(getTodayDateString());
    for (let i = 29; i >= 0; i--) {
      const date = addDays(today, -i);
      const dateString = date.toISOString().split('T')[0];
      const cleaningsOnDay = cleaningHistory.filter(entry => entry.date.startsWith(dateString));
      days.push({ date, dateString, cleaningsOnDay });
    }
    return days;
  }, [cleaningHistory]);


  return (
    <div className="p-4 md:p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Statistiques & Historique</h2>

      {/* Weekly Report */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Rapport Hebdomadaire (7 derniers jours)</h3>
        <div className="space-y-2 text-gray-600">
            <p>Pièces uniques nettoyées: <span className="font-bold text-primary">{weeklyReport.cleanedCount}</span></p>
            <p>Total actions de nettoyage: <span className="font-bold text-primary">{weeklyReport.totalActions}</span></p>
            <p>Pièces actuellement en retard: <span className={`font-bold ${weeklyReport.overdueCount > 0 ? 'text-accent' : 'text-secondary'}`}>{weeklyReport.overdueCount}</span></p>
            {weeklyReport.overdueCount > 0 && <p className="text-sm">En retard: {weeklyReport.overdueRoomsNames}</p>}
        </div>
      </div>
      
      {/* Badges */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Badges Gagnés</h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {earnedBadges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg border border-gray-200" title={`${badge.description} (Gagné le ${formatDate(badge.achievedDate!)})`}>
                <span className="text-4xl mb-2">{badge.icon}</span>
                <p className="text-xs font-semibold text-gray-700">{badge.name}</p>
                 <p className="text-xs text-gray-500">Gagné le {formatDate(badge.achievedDate!)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun badge gagné pour le moment. Continuez comme ça !</p>
        )}
      </div>

      {/* Calendar View */}
       <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Calendrier des Activités (30 derniers jours)</h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="font-semibold text-gray-600">{day}</div>
          ))}
          {/* Add empty cells for the first day of the month if not Sunday */}
          {Array.from({ length: (calendarDays[0]?.date.getDay() ?? 0) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="border rounded-md p-1 h-16"></div>
          ))}
          {calendarDays.map(({ date, dateString, cleaningsOnDay }) => (
            <div key={dateString} className={`border rounded-md p-1 h-16 flex flex-col items-center justify-center relative ${dateString === getTodayDateString() ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'}`}>
              <span className={`font-medium ${dateString === getTodayDateString() ? 'text-blue-700' : 'text-gray-700'}`}>{date.getDate()}</span>
              {cleaningsOnDay.length > 0 && (
                <div className="mt-1 flex justify-center items-center w-4 h-4 bg-green-500 rounded-full text-white text-xs" title={`${cleaningsOnDay.length} pièce(s) nettoyée(s)`}>
                  {cleaningsOnDay.length}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* Cleaning History Log */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Historique des Nettoyages</h3>
        {cleaningHistory.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {cleaningHistory.slice().reverse().map((entry: CleaningLogEntry) => ( // Show newest first
              <li key={entry.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-primary">{entry.roomName}</span> nettoyé(e)
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(entry.date)}</div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Points: +{entry.pointsEarned} {entry.isBonusStreakAwarded && <span className="ml-1 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs">Bonus Streak!</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun nettoyage enregistré pour le moment.</p>
        )}
      </div>

    </div>
  );
};

export default StatsPage;
