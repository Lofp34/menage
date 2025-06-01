
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import RoomCard from '../components/RoomCard';
import { Room } from '../types';

const RoomsPage: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  if (!context) return <div className="p-4">Chargement...</div>;
  const { rooms, completeTask } = context;

  const handleSelectForCleaning = (roomId: string) => {
    // Optional: Add a confirmation modal here
    // For now, directly complete
    completeTask(roomId); 
    // Could add a success toast/message
  };

  const filteredRooms = rooms
    .filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(room => showInactive ? true : room.isActive)
    .sort((a,b) => { // Sort by active first, then by name
        if(a.isActive && !b.isActive) return -1;
        if(!a.isActive && b.isActive) return 1;
        return a.name.localeCompare(b.name);
    });

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Liste des Pièces</h2>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher une pièce..."
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="flex items-center space-x-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"
            checked={showInactive}
            onChange={() => setShowInactive(!showInactive)}
          />
          <span className="text-gray-700">Afficher inactives</span>
        </label>
      </div>

      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} onSelectForCleaning={handleSelectForCleaning} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-xl text-gray-500">Aucune pièce ne correspond à vos critères.</p>
            <img src="https://picsum.photos/seed/empty/300/200" alt="Empty state" className="mt-4 rounded-md inline-block opacity-70"/>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
