
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Room, RoomStatus } from '../types';
import { daysSince, getRoomStatus, getStatusColor, formatDate } from '../utils/dateUtils';
import { CLEANING_CYCLE_DAYS } from '../constants';

const QuestOfTheDay: React.FC = () => {
  const context = useContext(AppContext);
  const [suggestedRoom, setSuggestedRoom] = useState<Room | null>(null);
  const [isTaskCompletedForPace, setIsTaskCompletedForPace] = useState(false);

  useEffect(() => {
    if (context) {
      setSuggestedRoom(context.getSuggestedRoom());
      if (context.userProfile.lastTaskCompletionDate) {
        const daysSinceLastCompletion = daysSince(context.userProfile.lastTaskCompletionDate);
        // Assuming CLEANING_PACE_DAYS = 2, if last cleaned 0 or 1 day ago, it's "completed for pace"
        setIsTaskCompletedForPace(daysSinceLastCompletion < 2); 
      } else {
        setIsTaskCompletedForPace(false); // Never completed a task
      }
    }
  }, [context]);


  if (!context) return <p>Chargement du contexte...</p>;
  const { completeTask, userProfile, isCleaningDayDue } = context;

  if (!suggestedRoom) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Toutes les pièces sont impeccables !</h2>
        <p className="text-gray-600">Revenez plus tard ou activez plus de pièces dans les réglages.</p>
        <img src="https://picsum.photos/300/200?grayscale&blur=2" alt="Clean house" className="mt-4 rounded-md inline-block"/>
      </div>
    );
  }
  
  const roomStatus = getRoomStatus(suggestedRoom);
  const urgencyDays = suggestedRoom.lastCleanedDate ? daysSince(suggestedRoom.lastCleanedDate) : CLEANING_CYCLE_DAYS * 2; // Effectively infinite if never cleaned
  const urgencyPercentage = Math.min(100, (urgencyDays / CLEANING_CYCLE_DAYS) * 100);

  const handleCompleteTask = () => {
    completeTask(suggestedRoom.id);
    // After completion, re-evaluate suggested room and pace status for next render
    setSuggestedRoom(context.getSuggestedRoom()); 
    setIsTaskCompletedForPace(true); // Assume completed now for this pace period
  };

  const cleaningDayIsDue = isCleaningDayDue();

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-3xl font-bold mb-2 text-primary">🌟 Quête du Jour 🌟</h2>
      
      {!cleaningDayIsDue && !isTaskCompletedForPace && (
         <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md text-center">
            Vous avez nettoyé récemment. Reposez-vous ! La prochaine quête est bientôt.
         </div>
      )}
       {cleaningDayIsDue && !isTaskCompletedForPace && (
         <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-center animate-pulse">
            <i className="fas fa-bell mr-2"></i> Il est temps pour une nouvelle quête !
         </div>
      )}


      <div className="text-center mb-6">
        <span className="text-6xl">{suggestedRoom.icon}</span>
        <h3 className="text-2xl font-semibold mt-2 text-gray-800">{suggestedRoom.name}</h3>
        <p className={`text-sm font-medium ${getStatusColor(roomStatus)}`}>Statut: {roomStatus}</p>
        <p className="text-xs text-gray-500">Dernier nettoyage: {formatDate(suggestedRoom.lastCleanedDate)} ({urgencyDays} jour(s) passés)</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Urgence:</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${urgencyPercentage > 75 ? 'bg-red-500' : urgencyPercentage > 50 ? 'bg-yellow-400' : 'bg-green-500'}`}
            style={{ width: `${urgencyPercentage}%` }}
          ></div>
        </div>
      </div>
      
      { isTaskCompletedForPace && cleaningDayIsDue ? (
          <div className="text-center p-3 bg-green-100 text-green-700 rounded-md">
            <i className="fas fa-check-circle mr-2"></i> Pièce marquée comme nettoyée pour cette période ! Prêt pour la prochaine ?
             <button
                onClick={handleCompleteTask}
                className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                <i className="fas fa-broom mr-2"></i> Valider ce nettoyage quand même
              </button>
          </div>
      ) : (
         <button
          onClick={handleCompleteTask}
          className="w-full bg-gradient-to-r from-green-500 to-secondary hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          <i className="fas fa-check-circle mr-2"></i> J'ai terminé cette pièce !
        </button>
      )

      }
      
      <p className="text-xs text-gray-500 mt-4 text-center">Valider terminera la quête et mettra à jour vos stats.</p>
    </div>
  );
};

export default QuestOfTheDay;
