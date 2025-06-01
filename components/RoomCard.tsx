
import React, { useContext }from 'react';
import { Room as RoomType, RoomStatus } from '../types';
import { formatDate, getRoomStatus, getStatusColor, daysSince } from '../utils/dateUtils';
import { AppContext } from '../context/AppContext';

interface RoomCardProps {
  room: RoomType;
  onSelectForCleaning?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onSelectForCleaning }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const status = getRoomStatus(room);
  const days = daysSince(room.lastCleanedDate);

  return (
    <div className={`p-4 rounded-lg shadow-lg bg-white border-l-4 ${
        status === RoomStatus.Overdue ? 'border-red-500' :
        status === RoomStatus.DueSoon ? 'border-yellow-500' :
        'border-green-500'
      } transition-all hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-3xl mr-3">{room.icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
        </div>
        {onSelectForCleaning && (
            <button 
                onClick={() => onSelectForCleaning(room.id)}
                title="Marquer comme nettoyé"
                className="text-green-500 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-100"
            >
                <i className="fas fa-check-circle text-xl"></i>
            </button>
        )}
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          Dernier nettoyage: <span className="font-medium">{formatDate(room.lastCleanedDate)}</span>
          {days !== Infinity && ` (${days} j)`}
        </p>
        <p>
          Statut: <span className={`font-bold ${getStatusColor(status)}`}>{status}</span>
        </p>
        <p>Nettoyages: <span className="font-medium">{room.cleaningCount}</span></p>
      </div>
    </div>
  );
};

export default RoomCard;
