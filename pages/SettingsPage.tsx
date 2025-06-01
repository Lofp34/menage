
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Room } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

interface EditableRoomSettings extends Partial<Pick<Room, 'name' | 'icon' | 'isActive'>> {}

const SettingsPage: React.FC = () => {
  const context = useContext(AppContext);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [currentEditValues, setCurrentEditValues] = useState<EditableRoomSettings>({});

  if (!context) return <div className="p-4">Chargement...</div>;
  const { rooms, updateRoomSettings: contextUpdateRoomSettings } = context;

  const handleEdit = (room: Room) => {
    setEditingRoomId(room.id);
    setCurrentEditValues({ name: room.name, icon: room.icon, isActive: room.isActive });
  };

  const handleSave = (roomId: string) => {
    contextUpdateRoomSettings(roomId, currentEditValues);
    setEditingRoomId(null);
  };

  const handleCancel = () => {
    setEditingRoomId(null);
    setCurrentEditValues({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // For checkbox
    setCurrentEditValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const availableIcons = ['🛏️', '🧸', '🎀', '🦄', '🛁', '🐥', '🍳', '🛋️', '🧺', '🚗', '🍾', '🚽', '🚻', '🪴', '🖼️', '📚', '💻', '✨'];


  return (
    <div className="p-4 md:p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Réglages des Pièces</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {rooms.map(room => (
            <li key={room.id} className="p-4 border border-gray-200 rounded-lg">
              {editingRoomId === room.id ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`name-${room.id}`} className="block text-sm font-medium text-gray-700 mb-1">Nom:</label>
                    <input
                      type="text"
                      id={`name-${room.id}`}
                      name="name"
                      value={currentEditValues.name || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor={`icon-${room.id}`} className="block text-sm font-medium text-gray-700 mb-1">Icône:</label>
                    <select
                      id={`icon-${room.id}`}
                      name="icon"
                      value={currentEditValues.icon || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-xl"
                    >
                      {availableIcons.map(icon => <option key={icon} value={icon} className="text-xl">{icon}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`isActive-${room.id}`}
                      name="isActive"
                      checked={currentEditValues.isActive || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
                    />
                    <label htmlFor={`isActive-${room.id}`} className="text-sm text-gray-700">Active</label>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button onClick={() => handleSave(room.id)} className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-green-600 transition-colors">Sauvegarder</button>
                    <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{room.icon}</span>
                    <div>
                        <p className={`font-semibold ${room.isActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{room.name}</p>
                        <p className="text-xs text-gray-500">{room.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <button onClick={() => handleEdit(room)} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                    <i className="fas fa-edit mr-1"></i> Modifier
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Réinitialiser les Données</h3>
        <p className="text-sm text-gray-600 mb-3">Attention : Ceci effacera toutes vos données de progression, scores, et réglages personnalisés.</p>
        <button 
            onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données de l'application ? Cette action est irréversible.")) {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    window.location.reload();
                }
            }}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-red-700 transition-colors"
        >
            <i className="fas fa-exclamation-triangle mr-2"></i> Réinitialiser l'application
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
