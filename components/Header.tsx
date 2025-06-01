
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Tab } from '../types';

const Header: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { userProfile, activeTab, setActiveTab } = context;

  const navItems = [
    { label: 'Quête', tab: Tab.Quest, icon: 'fa-solid fa-wand-sparkles' },
    { label: 'Pièces', tab: Tab.Rooms, icon: 'fa-solid fa-house-chimney-window' },
    { label: 'Stats', tab: Tab.Stats, icon: 'fa-solid fa-chart-line' },
    { label: 'Réglages', tab: Tab.Settings, icon: 'fa-solid fa-cog' },
  ];

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">🧹 Ménage Mode Quête</h1>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <div className="text-center">
              <span className="block text-xs uppercase">Score</span>
              <span className="font-semibold text-lg">{userProfile.score} pts</span>
            </div>
            <div className="text-center">
              <span className="block text-xs uppercase">Série</span>
              <span className="font-semibold text-lg">{userProfile.currentStreak} 🔥</span>
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-center sm:justify-start">
          {navItems.map(item => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`px-3 py-3 sm:px-6 text-sm sm:text-base font-medium text-gray-600 hover:text-primary border-b-4 border-transparent transition-colors duration-150 ${activeTab === item.tab ? 'tab-active' : ''}`}
            >
              <i className={`${item.icon} mr-1 sm:mr-2`}></i>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
