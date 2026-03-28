import React, { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { Screen } from './types';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import DirectoryList from './components/DirectoryList';
import ExternalView from './components/ExternalView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  useEffect(() => {
    OneSignal.init({
      appId: 'd45b951e-1fb2-4bf8-91e6-530e0392aa9c',
      allowLocalhostAsSecureOrigin: true,
    });
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onExplore={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'phonebook':
      case 'rental':
      case 'property':
      case 'jobs':
      case 'food':
      case 'realestate':
        return <DirectoryList screen={currentScreen} onBack={() => setCurrentScreen('dashboard')} />;
      case 'weather':
        return (
          <ExternalView 
            title="Weather" 
            url="https://city.imd.gov.in/citywx/city_weather_test_try_warnings.php?id=42539" 
            onBack={() => setCurrentScreen('dashboard')} 
          />
        );
      case 'apmc':
        return (
          <ExternalView 
            title="APMC Rates" 
            url="https://apmcdeesa.com" 
            onBack={() => setCurrentScreen('dashboard')} 
          />
        );
      case 'shopping':
        return (
          <ExternalView 
            title="Shopping" 
            url="https://mydeesa.statusring.in" 
            onBack={() => setCurrentScreen('dashboard')} 
          />
        );
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#fedf36]/30">
      {renderScreen()}
    </div>
  );
}
