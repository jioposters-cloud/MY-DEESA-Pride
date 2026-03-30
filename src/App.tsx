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

    // Initialize history state
    window.history.replaceState({ screen: 'welcome' }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
      } else {
        setCurrentScreen('welcome');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (screen: Screen) => {
    if (screen === currentScreen) return;
    setCurrentScreen(screen);
    window.history.pushState({ screen }, '');
  };

  const goBack = () => {
    window.history.back();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onExplore={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'phonebook':
      case 'rental':
      case 'property':
      case 'jobs':
      case 'food':
      case 'realestate':
        return <DirectoryList screen={currentScreen} onBack={goBack} />;
      case 'weather':
        return (
          <ExternalView 
            title="Weather" 
            url="https://www.mydeesa.in/2016/02/weather.html" 
            onBack={goBack} 
          />
        );
      case 'apmc':
        return (
          <ExternalView 
            title="APMC Rates" 
            url="https://www.mydeesa.in/2016/02/apmc.html" 
            onBack={goBack} 
          />
        );
      case 'shopping':
        return (
          <ExternalView 
            title="Shopping" 
            url="https://mydeesa.statusring.in" 
            onBack={goBack} 
          />
        );
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#fedf36]/30">
      {renderScreen()}
    </div>
  );
}
