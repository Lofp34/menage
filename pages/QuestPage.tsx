
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import QuestOfTheDay from '../components/QuestOfTheDay';
import ProgressBar from '../components/ProgressBar';
import { CLEANING_CYCLE_DAYS } from '../constants';
import { daysSince } from '../utils/dateUtils';

const QuestPage: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return <div className="p-4">Chargement...</div>;
  const { rooms } = context;

  const houseCleanliness = useMemo(() => {
    const activeRooms = rooms.filter(r => r.isActive);
    if (activeRooms.length === 0) return 100; // Or 0, depending on interpretation

    const cleanRooms = activeRooms.filter(r => {
      if (!r.lastCleanedDate) return false;
      return daysSince(r.lastCleanedDate) < CLEANING_CYCLE_DAYS;
    }).length;

    return (cleanRooms / activeRooms.length) * 100;
  }, [rooms]);

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Barre de "Maison Propre"</h2>
        <ProgressBar value={houseCleanliness} label="Propreté générale" />
        <p className="text-xs text-gray-500 mt-2">Pourcentage de pièces actives nettoyées dans les {CLEANING_CYCLE_DAYS} derniers jours.</p>
      </div>
      <QuestOfTheDay />
    </div>
  );
};

export default QuestPage;
