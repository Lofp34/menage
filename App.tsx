
import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Header';
import QuestPage from './pages/QuestPage';
import RoomsPage from './pages/RoomsPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import { Tab } from './types';


const AppContent: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    // This should ideally be a global loading spinner or a minimal layout
    return <div className="flex items-center justify-center h-screen text-xl font-semibold">Chargement de l'application...</div>;
  }
  
  const { isLoading, activeTab } = context;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold">Initialisation des données...</div>;
  }

  return (
    <div className="min-h-screen bg-lightgray flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-0 sm:px-4 py-4">
        {activeTab === Tab.Quest && <QuestPage />}
        {activeTab === Tab.Rooms && <RoomsPage />}
        {activeTab === Tab.Stats && <StatsPage />}
        {activeTab === Tab.Settings && <SettingsPage />}
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 border-t border-gray-200 bg-white">
        Ménage Mode Quête © {new Date().getFullYear()} - Fait avec <i className="fas fa-heart text-red-500"></i> pour une maison plus propre !
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter> {/* Using HashRouter as per requirement */}
        {/* No Routes needed if using tab state, but HashRouter is set up */}
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
